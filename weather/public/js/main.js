// 主应用文件 - 天气应用的核心逻辑

// 导入天气指数计算模块
class WeatherApp {
    constructor() {
        this.currentCity = null;
        this.savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.apiBaseUrl = '/api/weather';
        this.useDemoData = false; // 是否使用演示数据
        this.weatherIndices = new WeatherIndices(); // 天气指数计算实例
        this.charts = new WeatherCharts(); // 图表实例

        // 数据缓存系统
        this.cache = {
            weather: new Map(),
            forecast: new Map(),
            cities: new Map(),
            maxAge: 5 * 60 * 1000 // 5分钟缓存
        };

        // 批量操作状态
        this.batchMode = false;
        this.selectedCities = new Set();

        // 排序和分组状态
        this.sortMode = 'none'; // none, name, country
        this.groupByRegion = false;

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.applyTheme();
        this.renderCityList();

        // 如果没有保存的城市，尝试获取当前位置
        if (this.savedCities.length === 0) {
            await this.getCurrentLocation();
        } else {
            // 加载第一个保存的城市
            await this.loadCityWeather(this.savedCities[0]);
        }
    }

    setupEventListeners() {
        // 导航标签切换（支持触摸）
        document.getElementById('currentWeatherTab').addEventListener('click', () => {
            this.switchTab('current');
        });
        document.getElementById('currentWeatherTab').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.switchTab('current');
        });

        document.getElementById('forecastTab').addEventListener('click', () => {
            this.switchTab('forecast');
        });
        document.getElementById('forecastTab').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.switchTab('forecast');
        });

        document.getElementById('hourlyTab').addEventListener('click', () => {
            this.switchTab('hourly');
        });
        document.getElementById('hourlyTab').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.switchTab('hourly');
        });

        // 主题切换（支持触摸）
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        document.getElementById('themeToggle').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });

        // 添加城市按钮（支持触摸）
        document.getElementById('addCityBtn').addEventListener('click', () => {
            this.showAddCityModal();
        });
        document.getElementById('addCityBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.showAddCityModal();
        });

        // 批量操作按钮
        document.getElementById('batchModeBtn').addEventListener('click', () => {
            this.toggleBatchMode();
        });

        // 批量操作控制按钮
        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.selectAllCities();
        });
        document.getElementById('deselectAllBtn').addEventListener('click', () => {
            this.deselectAllCities();
        });
        document.getElementById('batchDeleteBtn').addEventListener('click', () => {
            this.batchDeleteCities();
        });
        document.getElementById('exportCitiesBtn').addEventListener('click', () => {
            this.exportCities();
        });
        document.getElementById('importCitiesBtn').addEventListener('click', () => {
            this.showImportDialog();
        });

        // 排序和分组按钮
        document.getElementById('sortByNameBtn').addEventListener('click', () => {
            this.sortCitiesByName();
        });
        document.getElementById('sortByCountryBtn').addEventListener('click', () => {
            this.sortCitiesByCountry();
        });
        document.getElementById('groupByRegionBtn').addEventListener('click', () => {
            this.toggleGroupByRegion();
        });

        // 城市搜索（优化移动端输入）
        const citySearch = document.getElementById('citySearch');
        citySearch.addEventListener('input', (e) => {
            this.searchCities(e.target.value);
        });

        // 移动端键盘优化
        citySearch.addEventListener('focus', () => {
            this.handleMobileInputFocus();
        });

        citySearch.addEventListener('blur', () => {
            this.handleMobileInputBlur();
        });

        // 点击模态框外部关闭
        document.getElementById('addCityModal').addEventListener('click', (e) => {
            if (e.target.id === 'addCityModal') {
                this.closeAddCityModal();
            }
        });

        // 添加触摸手势支持
        this.setupTouchGestures();
    }

    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const threshold = 50; // 滑动阈值
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            const activeTab = document.querySelector('.nav-link.active');
            if (activeTab) {
                const tabs = ['current', 'forecast', 'hourly'];
                const currentIndex = tabs.findIndex(tab => activeTab.id === `${tab}Tab`);

                if (diff > 0 && currentIndex < tabs.length - 1) {
                    // 向左滑动，切换到下一个标签
                    this.switchTab(tabs[currentIndex + 1]);
                } else if (diff < 0 && currentIndex > 0) {
                    // 向右滑动，切换到上一个标签
                    this.switchTab(tabs[currentIndex - 1]);
                }
            }
        }
    }

    handleMobileInputFocus() {
        // 移动端输入框获得焦点时的处理
        if (this.isMobile()) {
            document.body.classList.add('mobile-input-focus');
        }
    }

    handleMobileInputBlur() {
        // 移动端输入框失去焦点时的处理
        document.body.classList.remove('mobile-input-focus');
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 缓存管理方法
    setCache(key, data, type = 'weather') {
        const cacheItem = {
            data: data,
            timestamp: Date.now(),
            type: type
        };
        this.cache[type].set(key, cacheItem);

        // 清理过期缓存
        this.cleanExpiredCache();
    }

    getCache(key, type = 'weather') {
        const cacheItem = this.cache[type].get(key);
        if (!cacheItem) return null;

        const age = Date.now() - cacheItem.timestamp;
        if (age > this.cache.maxAge) {
            this.cache[type].delete(key);
            return null;
        }

        return cacheItem.data;
    }

    cleanExpiredCache() {
        const now = Date.now();
        for (const [type, cache] of Object.entries(this.cache)) {
            if (type === 'maxAge') continue;
            for (const [key, item] of cache.entries()) {
                if (now - item.timestamp > this.cache.maxAge) {
                    cache.delete(key);
                }
            }
        }
    }

    clearCache(type = null) {
        if (type) {
            this.cache[type].clear();
        } else {
            for (const [key, cache] of Object.entries(this.cache)) {
                if (key !== 'maxAge') {
                    cache.clear();
                }
            }
        }
    }

    // 生成缓存键
    generateCacheKey(city, type = 'weather') {
        return `${type}_${city.lat}_${city.lon}`;
    }

    switchTab(tabName) {
        // 更新导航栏激活状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // 修正标签ID映射
        const tabIdMap = {
            'current': 'currentWeatherTab',
            'forecast': 'forecastTab',
            'hourly': 'hourlyTab'
        };
        const tabId = tabIdMap[tabName] || `${tabName}Tab`;
        document.getElementById(tabId).classList.add('active');

        // 获取所有内容面板
        const contents = document.querySelectorAll('.weather-content');
        const targetContent = document.getElementById(`${tabName}Content`);

        // 添加切换动画
        contents.forEach(content => {
            if (content !== targetContent) {
                // 隐藏其他内容
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    content.style.display = 'none';
                }, 300);
            }
        });

        // 显示目标内容
        if (targetContent) {
            targetContent.style.display = 'block';
            setTimeout(() => {
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0)';
            }, 50);
        }

        // 根据标签加载相应数据
        switch(tabName) {
            case 'forecast':
                if (this.currentCity) {
                    // 添加加载状态
                    this.showContentLoading('forecastContent');
                    setTimeout(() => {
                        this.loadForecast(this.currentCity);
                    }, 400); // 等待动画完成
                }
                break;
            case 'hourly':
                if (this.currentCity) {
                    // 添加加载状态
                    this.showContentLoading('hourlyContent');
                    setTimeout(() => {
                        this.loadHourlyForecast(this.currentCity);
                    }, 400); // 等待动画完成
                }
                break;
        }
    }

    async getCurrentLocation() {
        this.showLoading(true);

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const cityData = await this.getCityFromCoords(latitude, longitude);

            if (cityData) {
                this.addCityToList(cityData);
                await this.loadCityWeather(cityData);
            }
        } catch (error) {
            console.error('获取位置失败:', error);
            this.showError('无法获取您的位置，请手动添加城市');
            // 默认显示北京天气
            const beijing = { name: '北京', country: 'CN', lat: 39.9042, lon: 116.4074 };
            this.addCityToList(beijing);
            await this.loadCityWeather(beijing);
        } finally {
            this.showLoading(false);
        }
    }

    async getCityFromCoords(lat, lon) {
        try {
            let cityData;

            if (this.useDemoData) {
                // 使用演示数据
                cityData = DemoData.getCityFromCoords(lat, lon);
                console.log('使用演示数据获取城市信息');
            } else {
                // 使用真实API
                const response = await fetch(`${this.apiBaseUrl}/city/coords?lat=${lat}&lon=${lon}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                cityData = await response.json();
            }

            if (cityData && cityData.name) {
                return {
                    name: cityData.name,
                    country: cityData.country,
                    lat: lat,
                    lon: lon
                };
            }
        } catch (error) {
            console.error('获取城市信息失败:', error);

            // 如果API失败，自动切换到演示数据
            if (!this.useDemoData) {
                console.log('API调用失败，切换到演示数据模式');
                this.useDemoData = true;
                this.showError('无法连接到天气服务，已切换到演示模式');
                return await this.getCityFromCoords(lat, lon); // 重新获取演示数据
            }
        }
        return null;
    }

    async loadCityWeather(city) {
        this.showLoading(true);
        this.currentCity = city;

        try {
            const cacheKey = this.generateCacheKey(city, 'weather');
            let weatherData;

            // 首先检查缓存
            const cachedData = this.getCache(cacheKey, 'weather');
            if (cachedData) {
                console.log('使用缓存的天气数据');
                weatherData = cachedData;
                this.displayCurrentWeather(weatherData, city);
                this.updateActiveCity(city);
                this.showInfo('数据来自缓存');
                this.showLoading(false);
                return;
            }

            // 缓存未命中，获取新数据
            if (this.useDemoData) {
                // 使用演示数据
                weatherData = DemoData.getCurrentWeather();
                console.log('使用演示数据加载天气信息');
            } else {
                // 使用真实API
                const response = await fetch(`${this.apiBaseUrl}/current?lat=${city.lat}&lon=${city.lon}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                weatherData = await response.json();
            }

            // 缓存数据
            this.setCache(cacheKey, weatherData, 'weather');

            this.displayCurrentWeather(weatherData, city);
            this.switchTab('current');
            this.updateActiveCity(city);
        } catch (error) {
            console.error('获取天气数据失败:', error);

            // 如果API失败，自动切换到演示数据
            if (!this.useDemoData) {
                console.log('API调用失败，切换到演示数据模式');
                this.useDemoData = true;
                this.showWarning('无法连接到天气服务，已切换到演示模式');
                await this.loadCityWeather(city); // 重新加载演示数据
            } else {
                this.showError('获取天气数据失败，请稍后重试');
            }
        } finally {
            this.showLoading(false);
        }
    }

    displayCurrentWeather(weatherData, city) {
        // 更新城市名称
        document.getElementById('cityName').textContent = `${city.name}, ${city.country}`;

        // 更新温度
        document.getElementById('currentTemp').textContent = `${Math.round(weatherData.main.temp)}°`;

        // 更新天气描述
        document.getElementById('weatherDesc').textContent = weatherData.weather[0].description;

        // 更新天气图标
        this.updateWeatherIcon(weatherData.weather[0].main, weatherData.weather[0].icon);

        // 更新详细信息
        document.getElementById('feelsLike').textContent = `${Math.round(weatherData.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = `${weatherData.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${weatherData.wind.speed} m/s`;

        // 估算空气质量（实际应用中需要专门的API）
        const airQuality = this.estimateAirQuality(weatherData.main.humidity);
        document.getElementById('airQuality').textContent = airQuality;

        // 显示天气预警
        this.displayWeatherAlert(weatherData);

        // 显示生活指数
        this.displayWeatherIndices(weatherData);

        // 更新时间
        const updateTime = new Date().toLocaleString('zh-CN');
        const updateElement = document.getElementById('updateTime');
        updateElement.textContent = `更新时间: ${updateTime}`;

        // 添加更新动画
        updateElement.classList.add('data-updating');
        setTimeout(() => {
            updateElement.classList.remove('data-updating');
        }, 1000);
    }

    updateWeatherIcon(weatherMain, iconCode) {
        const iconElement = document.getElementById('weatherIcon');

        // 清除之前的图标类
        iconElement.className = 'fas fa-6x';

        // 根据天气状况设置图标
        switch(weatherMain.toLowerCase()) {
            case 'clear':
                iconElement.classList.add(iconCode.includes('d') ? 'fa-sun' : 'fa-moon');
                break;
            case 'clouds':
                iconElement.classList.add('fa-cloud');
                break;
            case 'rain':
                iconElement.classList.add('fa-cloud-rain');
                break;
            case 'snow':
                iconElement.classList.add('fa-snowflake');
                break;
            case 'thunderstorm':
                iconElement.classList.add('fa-bolt');
                break;
            case 'drizzle':
                iconElement.classList.add('fa-cloud-rain');
                break;
            case 'mist':
            case 'fog':
                iconElement.classList.add('fa-smog');
                break;
            default:
                iconElement.classList.add('fa-cloud-sun');
        }
    }

    estimateAirQuality(humidity) {
        // 简单的空气质量估算（实际应用中需要专门的API）
        if (humidity < 40) return '优';
        if (humidity < 60) return '良';
        if (humidity < 80) return '轻度污染';
        return '中度污染';
    }

    displayWeatherIndices(weatherData) {
        try {
            const indices = this.weatherIndices.getAllIndices(weatherData);
            this.weatherIndices.displayIndicesPanel(indices, 'weatherIndices');
        } catch (error) {
            console.error('显示天气指数失败:', error);
            document.getElementById('weatherIndices').innerHTML = '<p class="text-muted">指数计算暂时不可用</p>';
        }
    }

    displayWeatherAlert(weatherData) {
        try {
            const alert = this.calculateWeatherAlert(weatherData);

            // 移除现有的预警横幅
            const existingAlert = document.querySelector('.weather-alert-banner');
            if (existingAlert) {
                existingAlert.remove();
            }

            // 如果预警级别不是低，则显示预警横幅
            if (alert.level !== 'low') {
                this.showWeatherAlertBanner(alert);
            }
        } catch (error) {
            console.error('显示天气预警失败:', error);
        }
    }

    showWeatherAlertBanner(alert) {
        // 创建预警横幅
        const alertBanner = document.createElement('div');
        alertBanner.className = 'weather-alert-banner';
        alertBanner.innerHTML = `
            <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
            <div class="alert-header">
                <div class="alert-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="alert-title">天气预警</div>
            </div>
            <div class="alert-message">${alert.message}</div>
        `;

        // 添加到页面
        document.body.appendChild(alertBanner);

        // 5秒后自动隐藏
        setTimeout(() => {
            if (alertBanner.parentElement) {
                alertBanner.style.opacity = '0';
                alertBanner.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (alertBanner.parentElement) {
                        alertBanner.remove();
                    }
                }, 500);
            }
        }, 5000);
    }

    async loadForecast(city) {
        try {
            const cacheKey = this.generateCacheKey(city, 'forecast');
            let forecastData;

            // 检查缓存
            const cachedData = this.getCache(cacheKey, 'forecast');
            if (cachedData) {
                console.log('使用缓存的预报数据');
                forecastData = cachedData;
                this.displayForecast(forecastData);
                this.showInfo('预报数据来自缓存');
                return;
            }

            // 缓存未命中，获取新数据
            if (this.useDemoData) {
                // 使用演示数据
                forecastData = DemoData.getForecast();
                console.log('使用演示数据加载天气预报');
            } else {
                // 使用真实API
                const response = await fetch(`${this.apiBaseUrl}/forecast?lat=${city.lat}&lon=${city.lon}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                forecastData = await response.json();
            }

            // 缓存数据
            this.setCache(cacheKey, forecastData, 'forecast');
            this.displayForecast(forecastData);
        } catch (error) {
            console.error('获取预报数据失败:', error);

            // 如果API失败，自动切换到演示数据
            if (!this.useDemoData) {
                console.log('API调用失败，切换到演示数据模式');
                this.useDemoData = true;
                this.showWarning('无法连接到天气服务，已切换到演示模式');
                await this.loadForecast(city); // 重新加载演示数据
            } else {
                this.showError('获取天气预报失败');
            }
        }
    }

    displayForecast(forecastData) {
        const forecastCards = document.getElementById('forecastCards');
        forecastCards.innerHTML = '';

        // 按天分组预报数据
        const dailyForecasts = this.groupForecastByDay(forecastData.list);

        dailyForecasts.forEach((dayForecast, index) => {
            const card = this.createForecastCard(dayForecast, index);
            forecastCards.appendChild(card);
        });
    }

    groupForecastByDay(forecastList) {
        const grouped = {};

        forecastList.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
        });

        // 转换为数组并取前7天
        return Object.entries(grouped)
            .slice(0, 7)
            .map(([date, items]) => ({
                date,
                items: items.slice(0, 2) // 取白天和晚上的预报
            }));
    }

    createForecastCard(dayForecast, index) {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-3';

        const date = new Date(dayForecast.date);
        const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const dateStr = index === 0 ? '今天' : `${dayNames[date.getDay()]} ${date.getMonth() + 1}/${date.getDate()}`;

        const dayItem = dayForecast.items[0]; // 白天的预报
        const tempMax = Math.round(dayItem.main.temp_max);
        const tempMin = Math.round(dayItem.main.temp_min);
        const humidity = dayItem.main.humidity;
        const windSpeed = dayItem.wind.speed;
        const pressure = dayItem.main.pressure;
        const visibility = dayItem.visibility ? Math.round(dayItem.visibility / 1000) : '10';

        // 计算天气预警级别
        const alertLevel = this.calculateWeatherAlert(dayItem);
        const alertClass = alertLevel.level === 'high' ? 'forecast-alert-high' :
                          alertLevel.level === 'medium' ? 'forecast-alert-medium' : '';

        card.innerHTML = `
            <div class="forecast-card ${alertClass}" data-bs-toggle="tooltip" data-bs-placement="top" title="${alertLevel.message}">
                <div class="forecast-header">
                    <div class="forecast-date">${dateStr}</div>
                    ${alertLevel.level !== 'low' ? `<div class="forecast-alert-badge"><i class="fas fa-exclamation-triangle"></i></div>` : ''}
                </div>
                <div class="forecast-icon">
                    <i class="fas ${this.getWeatherIconClass(dayItem.weather[0].main)}"></i>
                </div>
                <div class="forecast-desc">${dayItem.weather[0].description}</div>
                <div class="forecast-temp">
                    <span class="temp-max">${tempMax}°</span>
                    <span class="temp-min">${tempMin}°</span>
                </div>
                <div class="forecast-details">
                    <div class="forecast-detail-item">
                        <i class="fas fa-tint"></i>
                        <span>${humidity}%</span>
                    </div>
                    <div class="forecast-detail-item">
                        <i class="fas fa-wind"></i>
                        <span>${windSpeed} m/s</span>
                    </div>
                    <div class="forecast-detail-item">
                        <i class="fas fa-eye"></i>
                        <span>${visibility}km</span>
                    </div>
                    <div class="forecast-detail-item">
                        <i class="fas fa-compress-alt"></i>
                        <span>${pressure}hPa</span>
                    </div>
                </div>
                <div class="forecast-rain">
                    <i class="fas fa-cloud-rain"></i>
                    <small>降水: ${Math.round(dayItem.pop * 100)}%</small>
                </div>
                <div class="forecast-uv-index">
                    <small>紫外线: ${this.estimateUVIndex(dayItem.weather[0].main)}</small>
                </div>
            </div>
        `;

        return card;
    }

    getWeatherIconClass(weatherMain) {
        switch(weatherMain.toLowerCase()) {
            case 'clear': return 'fa-sun weather-clear-day';
            case 'clouds': return 'fa-cloud weather-clouds';
            case 'rain': return 'fa-cloud-rain weather-rain';
            case 'snow': return 'fa-snowflake weather-snow';
            case 'thunderstorm': return 'fa-bolt weather-thunderstorm';
            case 'drizzle': return 'fa-cloud-rain weather-rain';
            case 'mist':
            case 'fog': return 'fa-smog weather-mist';
            default: return 'fa-cloud-sun';
        }
    }

    calculateWeatherAlert(weatherData) {
        const temp = weatherData.main.temp;
        const windSpeed = weatherData.wind.speed;
        const pop = weatherData.pop;
        const weatherMain = weatherData.weather[0].main.toLowerCase();

        // 高温预警
        if (temp > 35) {
            return {
                level: 'high',
                message: '高温预警：气温过高，请注意防暑降温'
            };
        }

        // 低温预警
        if (temp < -10) {
            return {
                level: 'high',
                message: '低温预警：气温过低，请注意保暖'
            };
        }

        // 大风预警
        if (windSpeed > 10) {
            return {
                level: 'medium',
                message: '大风预警：风力较强，请注意安全'
            };
        }

        // 暴雨预警
        if (weatherMain === 'rain' && pop > 0.8) {
            return {
                level: 'medium',
                message: '暴雨预警：降雨概率大，请携带雨具'
            };
        }

        // 雷电预警
        if (weatherMain === 'thunderstorm') {
            return {
                level: 'high',
                message: '雷电预警：可能有雷电活动，请注意安全'
            };
        }

        // 暴雪预警
        if (weatherMain === 'snow' && pop > 0.6) {
            return {
                level: 'medium',
                message: '暴雪预警：可能有大雪，请注意出行安全'
            };
        }

        return {
            level: 'low',
            message: '天气状况良好'
        };
    }

    estimateUVIndex(weatherMain) {
        // 简单的紫外线指数估算
        switch(weatherMain.toLowerCase()) {
            case 'clear': return '强 (8-10)';
            case 'clouds': return '中等 (4-6)';
            case 'rain':
            case 'drizzle': return '弱 (1-2)';
            case 'snow': return '中等 (5-7)';
            case 'thunderstorm': return '弱 (0-1)';
            case 'mist':
            case 'fog': return '弱 (1-3)';
            default: return '中等 (3-5)';
        }
    }

    async loadHourlyForecast(city) {
        try {
            const cacheKey = this.generateCacheKey(city, 'forecast'); // 复用预报缓存
            let forecastData;

            // 检查缓存
            const cachedData = this.getCache(cacheKey, 'forecast');
            if (cachedData) {
                console.log('使用缓存的逐小时预报数据');
                forecastData = cachedData;
                this.displayHourlyForecast(forecastData.list.slice(0, 24));
                this.showInfo('逐小时数据来自缓存');
                return;
            }

            // 缓存未命中，获取新数据
            if (this.useDemoData) {
                // 使用演示数据
                forecastData = DemoData.getForecast();
                console.log('使用演示数据加载逐小时预报');
            } else {
                // 使用真实API
                const response = await fetch(`${this.apiBaseUrl}/forecast?lat=${city.lat}&lon=${city.lon}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                forecastData = await response.json();
            }

            // 缓存数据
            this.setCache(cacheKey, forecastData, 'forecast');
            this.displayHourlyForecast(forecastData.list.slice(0, 24));
        } catch (error) {
            console.error('获取逐小时预报失败:', error);

            // 如果API失败，自动切换到演示数据
            if (!this.useDemoData) {
                console.log('API调用失败，切换到演示数据模式');
                this.useDemoData = true;
                this.showWarning('无法连接到天气服务，已切换到演示模式');
                await this.loadHourlyForecast(city); // 重新加载演示数据
            } else {
                this.showError('获取逐小时预报失败');
            }
        }
    }

    displayHourlyForecast(hourlyData) {
        // 使用优化的图表渲染
        this.charts.queueChartRender('hourlyChart', hourlyData, 'hourly', this.currentTheme);
    }

    addCityToList(city) {
        // 检查城市是否已存在
        const exists = this.savedCities.some(c => c.name === city.name && c.country === city.country);
        if (!exists) {
            this.savedCities.push(city);
            localStorage.setItem('savedCities', JSON.stringify(this.savedCities));
            this.renderCityList();
        }
    }

    renderCityList() {
        const cityList = document.getElementById('cityList');
        cityList.innerHTML = '';

        this.savedCities.forEach((city, index) => {
            const cityItem = document.createElement('button');
            cityItem.className = 'city-item';
            cityItem.innerHTML = `
                <span>${city.name}</span>
                <span class="remove-city" data-index="${index}">
                    <i class="fas fa-times"></i>
                </span>
            `;
            cityItem.addEventListener('click', () => {
                this.loadCityWeather(city);
            });

            cityList.appendChild(cityItem);
        });

        // 添加删除城市的事件监听器
        document.querySelectorAll('.remove-city').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.closest('.remove-city').dataset.index);
                this.removeCity(index);
            });
        });
    }

    removeCity(index) {
        this.savedCities.splice(index, 1);
        localStorage.setItem('savedCities', JSON.stringify(this.savedCities));
        this.renderCityList();

        // 如果删除的是当前城市，加载第一个城市
        if (this.savedCities.length > 0) {
            this.loadCityWeather(this.savedCities[0]);
        } else {
            this.getCurrentLocation();
        }
    }

    updateActiveCity(city) {
        document.querySelectorAll('.city-item').forEach(item => {
            item.classList.remove('active');
        });

        const cityItems = document.querySelectorAll('.city-item');
        const index = this.savedCities.findIndex(c => c.name === city.name && c.country === city.country);
        if (index !== -1 && cityItems[index]) {
            cityItems[index].classList.add('active');
        }
    }

    showAddCityModal() {
        const modal = new bootstrap.Modal(document.getElementById('addCityModal'));
        modal.show();
        this.renderPopularCities();
    }

    closeAddCityModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCityModal'));
        modal.hide();
    }

    async searchCities(query) {
        if (query.length < 1) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }

        try {
            let cities;

            if (this.useDemoData) {
                // 使用演示数据
                cities = DemoData.searchCities(query);
                console.log('使用演示数据搜索城市:', cities.length, '个结果');
            } else {
                // 使用真实API
                const response = await fetch(`${this.apiBaseUrl}/city/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                cities = await response.json();
            }

            this.displaySearchResults(cities);
        } catch (error) {
            console.error('搜索城市失败:', error);

            // 如果API失败，自动切换到演示数据
            if (!this.useDemoData) {
                console.log('API调用失败，切换到演示数据模式');
                this.useDemoData = true;
                this.showError('无法连接到天气服务，已切换到演示模式');
                await this.searchCities(query); // 重新搜索演示数据
            } else {
                this.showError('搜索城市失败');
            }
        }
    }

    displaySearchResults(cities) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        if (cities.length === 0) {
            resultsContainer.innerHTML = '<div class="list-group-item">未找到相关城市</div>';
            return;
        }

        cities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'list-group-item list-group-item-action';
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${city.name}</strong>
                        <small class="text-muted ms-2">${city.country}</small>
                    </div>
                    <button class="btn btn-sm btn-primary add-city-btn">添加</button>
                </div>
            `;

            const addBtn = item.querySelector('.add-city-btn');
            addBtn.addEventListener('click', () => {
                this.addCityToList(city);
                this.closeAddCityModal();
                this.loadCityWeather(city);
            });

            resultsContainer.appendChild(item);
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    applyTheme() {
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-theme');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        }

        // 更新图表主题
        this.updateChartsTheme();
    }

    updateChartsTheme() {
        // 重新创建图表以应用新主题
        if (this.currentCity) {
            // 如果当前显示的是逐小时预报，重新加载
            const activeTab = document.querySelector('.nav-link.active');
            if (activeTab && activeTab.id === 'hourlyTab') {
                this.loadHourlyForecast(this.currentCity);
            }
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        const contents = document.querySelectorAll('.weather-content');

        if (show) {
            spinner.style.display = 'block';
            contents.forEach(content => content.style.display = 'none');
        } else {
            spinner.style.display = 'none';
        }
    }

    showError(message, type = 'error') {
        const errorAlert = document.getElementById('errorAlert');
        const errorMessage = document.getElementById('errorMessage');
        const errorIcon = errorAlert.querySelector('.error-icon') || document.createElement('div');

        // 设置错误图标和样式
        if (type === 'warning') {
            errorAlert.className = 'alert alert-warning alert-dismissible fade show';
            errorIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        } else if (type === 'info') {
            errorAlert.className = 'alert alert-info alert-dismissible fade show';
            errorIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
        } else {
            errorAlert.className = 'alert alert-danger alert-dismissible fade show';
            errorIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        }

        // 添加错误图标到消息前面
        if (!errorAlert.querySelector('.error-icon')) {
            errorIcon.className = 'error-icon me-2';
            errorMessage.parentNode.insertBefore(errorIcon, errorMessage);
        }

        errorMessage.textContent = message;
        errorAlert.style.display = 'block';

        // 自动隐藏不同类型的错误
        const hideTime = type === 'info' ? 3000 : type === 'warning' ? 5000 : 7000;
        setTimeout(() => {
            errorAlert.style.display = 'none';
        }, hideTime);

        // 添加关闭按钮功能
        const closeBtn = errorAlert.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                errorAlert.style.display = 'none';
            };
        }
    }

    showSuccess(message) {
        this.showError(message, 'success');
    }

    showWarning(message) {
        this.showError(message, 'warning');
    }

    showInfo(message) {
        this.showError(message, 'info');
    }

    showContentLoading(contentId) {
        const content = document.getElementById(contentId);
        if (content) {
            // 保存原始内容
            if (!content.dataset.originalContent) {
                content.dataset.originalContent = content.innerHTML;
            }

            // 显示加载状态
            content.innerHTML = `
                <div class="content-loading">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">加载中...</span>
                    </div>
                    <div class="loading-text">正在加载数据...</div>
                </div>
            `;
        }
    }

    hideContentLoading(contentId) {
        const content = document.getElementById(contentId);
        if (content && content.dataset.originalContent) {
            // 恢复原始内容
            setTimeout(() => {
                content.innerHTML = content.dataset.originalContent;
            }, 300);
        }
    }

    // ==================== 批量操作功能 ====================

    toggleBatchMode() {
        this.batchMode = !this.batchMode;
        const batchControls = document.getElementById('batchControls');
        const batchBtn = document.getElementById('batchModeBtn');

        if (this.batchMode) {
            batchControls.style.display = 'block';
            batchBtn.classList.remove('btn-outline-primary');
            batchBtn.classList.add('btn-primary');
            this.selectedCities.clear();
        } else {
            batchControls.style.display = 'none';
            batchBtn.classList.remove('btn-primary');
            batchBtn.classList.add('btn-outline-primary');
            this.selectedCities.clear();
        }

        this.renderCityList();
    }

    selectAllCities() {
        this.savedCities.forEach((_, index) => {
            this.selectedCities.add(index);
        });
        this.renderCityList();
    }

    deselectAllCities() {
        this.selectedCities.clear();
        this.renderCityList();
    }

    batchDeleteCities() {
        if (this.selectedCities.size === 0) {
            this.showWarning('请先选择要删除的城市');
            return;
        }

        if (!confirm(`确定要删除选中的 ${this.selectedCities.size} 个城市吗？`)) {
            return;
        }

        // 从后往前删除，避免索引变化问题
        const sortedIndices = Array.from(this.selectedCities).sort((a, b) => b - a);
        sortedIndices.forEach(index => {
            this.savedCities.splice(index, 1);
        });

        localStorage.setItem('savedCities', JSON.stringify(this.savedCities));
        this.selectedCities.clear();
        this.renderCityList();
        this.showSuccess(`已删除 ${sortedIndices.length} 个城市`);

        // 如果删除的是当前城市，加载第一个城市
        if (this.savedCities.length > 0 && !this.currentCity) {
            this.loadCityWeather(this.savedCities[0]);
        }
    }

    exportCities() {
        if (this.savedCities.length === 0) {
            this.showWarning('没有城市可以导出');
            return;
        }

        const dataStr = JSON.stringify(this.savedCities, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `cities_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showSuccess(`已导出 ${this.savedCities.length} 个城市`);
    }

    showImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importCities(file);
            }
        };
        input.click();
    }

    async importCities(file) {
        try {
            const text = await file.text();
            const cities = JSON.parse(text);

            if (!Array.isArray(cities)) {
                throw new Error('文件格式不正确');
            }

            let imported = 0;
            let duplicates = 0;

            cities.forEach(city => {
                const exists = this.savedCities.some(c =>
                    c.name === city.name && c.country === city.country
                );

                if (!exists) {
                    this.savedCities.push(city);
                    imported++;
                } else {
                    duplicates++;
                }
            });

            localStorage.setItem('savedCities', JSON.stringify(this.savedCities));
            this.renderCityList();

            let message = `导入完成：成功导入 ${imported} 个城市`;
            if (duplicates > 0) {
                message += `，跳过 ${duplicates} 个重复城市`;
            }

            this.showSuccess(message);
        } catch (error) {
            this.showError('导入失败：文件格式不正确');
        }
    }

    // ==================== 排序和分组功能 ====================

    sortCitiesByName() {
        this.savedCities.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
        this.sortMode = 'name';
        localStorage.setItem('savedCities', JSON.stringify(this.savedCities));
        this.renderCityList();
        this.showInfo('已按名称排序');
    }

    sortCitiesByCountry() {
        this.savedCities.sort((a, b) => {
            const countryA = a.country || '';
            const countryB = b.country || '';
            return countryA.localeCompare(countryB);
        });
        this.sortMode = 'country';
        localStorage.setItem('savedCities', JSON.stringify(this.savedCities));
        this.renderCityList();
        this.showInfo('已按国家排序');
    }

    toggleGroupByRegion() {
        this.groupByRegion = !this.groupByRegion;
        const groupBtn = document.getElementById('groupByRegionBtn');

        if (this.groupByRegion) {
            groupBtn.classList.remove('btn-outline-secondary');
            groupBtn.classList.add('btn-secondary');
        } else {
            groupBtn.classList.remove('btn-secondary');
            groupBtn.classList.add('btn-outline-secondary');
        }

        this.renderCityList();
    }

    getRegionName(countryCode) {
        const regions = {
            'CN': '中国',
            'US': '美国',
            'GB': '英国',
            'JP': '日本',
            'FR': '法国',
            'AU': '澳大利亚',
            'SG': '新加坡',
            'KR': '韩国',
            'TH': '泰国',
            'AE': '阿联酋',
            'RU': '俄罗斯',
            'EG': '埃及',
            'IN': '印度',
            'CA': '加拿大',
            'DE': '德国',
            'IT': '意大利',
            'ES': '西班牙'
        };
        return regions[countryCode] || countryCode;
    }

    renderPopularCities() {
        const popularCitiesContainer = document.getElementById('popularCities');
        if (!popularCitiesContainer) return;

        const popularCities = [
            { name: '北京', country: 'CN' },
            { name: '上海', country: 'CN' },
            { name: '纽约', country: 'US' },
            { name: '伦敦', country: 'GB' },
            { name: '东京', country: 'JP' },
            { name: '巴黎', country: 'FR' },
            { name: '悉尼', country: 'AU' },
            { name: '新加坡', country: 'SG' }
        ];

        const citiesContainer = popularCitiesContainer.querySelector('.d-flex');
        citiesContainer.innerHTML = '';

        popularCities.forEach(cityInfo => {
            const city = this.findCityInDemoData(cityInfo.name, cityInfo.country);
            if (city) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-primary popular-city-badge';
                badge.textContent = city.name;
                badge.style.cursor = 'pointer';
                badge.addEventListener('click', () => {
                    this.addCityToList(city);
                    this.closeAddCityModal();
                    this.loadCityWeather(city);
                });

                citiesContainer.appendChild(badge);
            }
        });
    }

    findCityInDemoData(name, country) {
        return DemoData.cities.find(city =>
            city.name === name && city.country === country
        );
    }

    // 重写城市列表渲染方法以支持批量操作和分组
    renderCityList() {
        const cityList = document.getElementById('cityList');
        cityList.innerHTML = '';

        if (this.groupByRegion && this.savedCities.length > 0) {
            // 按地区分组显示
            const groupedCities = this.groupCitiesByRegion();
            this.renderGroupedCities(cityList, groupedCities);
        } else {
            // 普通列表显示
            this.renderNormalCityList(cityList);
        }
    }

    groupCitiesByRegion() {
        const grouped = {};

        this.savedCities.forEach((city, index) => {
            const region = this.getRegionName(city.country) || '其他';
            if (!grouped[region]) {
                grouped[region] = [];
            }
            grouped[region].push({ city, index });
        });

        return grouped;
    }

    renderGroupedCities(cityList, groupedCities) {
        Object.entries(groupedCities).forEach(([region, cities]) => {
            // 添加地区标题
            const regionHeader = document.createElement('div');
            regionHeader.className = 'region-header mb-2';
            regionHeader.innerHTML = `
                <h6 class="text-white mb-0 py-1 px-2" style="background: rgba(255,255,255,0.2); border-radius: 5px;">
                    ${region} (${cities.length})
                </h6>
            `;
            cityList.appendChild(regionHeader);

            // 添加该地区的城市
            cities.forEach(({ city, index }) => {
                const cityItem = this.createCityItem(city, index);
                cityList.appendChild(cityItem);
            });

            // 添加分隔线
            const separator = document.createElement('hr');
            separator.className = 'my-3';
            separator.style.borderColor = 'rgba(255,255,255,0.3)';
            cityList.appendChild(separator);
        });
    }

    renderNormalCityList(cityList) {
        this.savedCities.forEach((city, index) => {
            const cityItem = this.createCityItem(city, index);
            cityList.appendChild(cityItem);
        });
    }

    createCityItem(city, index) {
        const cityItem = document.createElement('button');
        cityItem.className = 'city-item';

        const isSelected = this.selectedCities.has(index);
        const isActive = this.currentCity &&
            this.currentCity.name === city.name &&
            this.currentCity.country === city.country;

        if (isActive) {
            cityItem.classList.add('active');
        }

        if (this.batchMode) {
            cityItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <input type="checkbox" class="city-checkbox me-2"
                           data-index="${index}" ${isSelected ? 'checked' : ''}>
                    <span class="flex-grow-1 text-start">${city.name}</span>
                </div>
            `;

            // 批量模式下点击选择/取消选择
            cityItem.addEventListener('click', (e) => {
                e.preventDefault();
                const checkbox = cityItem.querySelector('.city-checkbox');
                checkbox.checked = !checkbox.checked;

                if (checkbox.checked) {
                    this.selectedCities.add(index);
                } else {
                    this.selectedCities.delete(index);
                }
            });
        } else {
            cityItem.innerHTML = `
                <span>${city.name}</span>
                <span class="remove-city" data-index="${index}">
                    <i class="fas fa-times"></i>
                </span>
            `;

            // 正常模式下点击加载天气
            cityItem.addEventListener('click', () => {
                this.loadCityWeather(city);
            });
        }

        return cityItem;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});