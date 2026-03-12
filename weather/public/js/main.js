// 主应用文件 - 天气应用的核心逻辑

class WeatherApp {
    constructor() {
        this.currentCity = null;
        this.savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.apiBaseUrl = '/api/weather';
        this.useDemoData = false; // 是否使用演示数据

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
        // 导航标签切换
        document.getElementById('currentWeatherTab').addEventListener('click', () => {
            this.switchTab('current');
        });

        document.getElementById('forecastTab').addEventListener('click', () => {
            this.switchTab('forecast');
        });

        document.getElementById('hourlyTab').addEventListener('click', () => {
            this.switchTab('hourly');
        });

        // 主题切换
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // 添加城市按钮
        document.getElementById('addCityBtn').addEventListener('click', () => {
            this.showAddCityModal();
        });

        // 城市搜索
        document.getElementById('citySearch').addEventListener('input', (e) => {
            this.searchCities(e.target.value);
        });

        // 点击模态框外部关闭
        document.getElementById('addCityModal').addEventListener('click', (e) => {
            if (e.target.id === 'addCityModal') {
                this.closeAddCityModal();
            }
        });
    }

    switchTab(tabName) {
        // 更新导航栏激活状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById(`${tabName}WeatherTab`).classList.add('active');

        // 切换内容显示
        document.querySelectorAll('.weather-content').forEach(content => {
            content.style.display = 'none';
        });

        switch(tabName) {
            case 'current':
                document.getElementById('currentWeatherContent').style.display = 'block';
                break;
            case 'forecast':
                document.getElementById('forecastContent').style.display = 'block';
                if (this.currentCity) {
                    this.loadForecast(this.currentCity);
                }
                break;
            case 'hourly':
                document.getElementById('hourlyContent').style.display = 'block';
                if (this.currentCity) {
                    this.loadHourlyForecast(this.currentCity);
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
            let weatherData;

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

            this.displayCurrentWeather(weatherData, city);
            this.switchTab('current');
            this.updateActiveCity(city);
        } catch (error) {
            console.error('获取天气数据失败:', error);

            // 如果API失败，自动切换到演示数据
            if (!this.useDemoData) {
                console.log('API调用失败，切换到演示数据模式');
                this.useDemoData = true;
                this.showError('无法连接到天气服务，已切换到演示模式');
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

        // 更新时间
        const updateTime = new Date().toLocaleString('zh-CN');
        document.getElementById('updateTime').textContent = `更新时间: ${updateTime}`;
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

    async loadForecast(city) {
        try {
            let forecastData;

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

            this.displayForecast(forecastData);
        } catch (error) {
            console.error('获取预报数据失败:', error);

            // 如果API失败，自动切换到演示数据
            if (!this.useDemoData) {
                console.log('API调用失败，切换到演示数据模式');
                this.useDemoData = true;
                this.showError('无法连接到天气服务，已切换到演示模式');
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

        card.innerHTML = `
            <div class="forecast-card">
                <div class="forecast-date">${dateStr}</div>
                <div class="forecast-icon">
                    <i class="fas ${this.getWeatherIconClass(dayItem.weather[0].main)}"></i>
                </div>
                <div class="forecast-desc">${dayItem.weather[0].description}</div>
                <div class="forecast-temp">
                    <span class="temp-max">${tempMax}°</span>
                    <span class="temp-min">${tempMin}°</span>
                </div>
                <div class="forecast-rain">
                    <small>降水: ${Math.round(dayItem.pop * 100)}%</small>
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

    async loadHourlyForecast(city) {
        try {
            let forecastData;

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

            this.displayHourlyForecast(forecastData.list.slice(0, 24));
        } catch (error) {
            console.error('获取逐小时预报失败:', error);

            // 如果API失败，自动切换到演示数据
            if (!this.useDemoData) {
                console.log('API调用失败，切换到演示数据模式');
                this.useDemoData = true;
                this.showError('无法连接到天气服务，已切换到演示模式');
                await this.loadHourlyForecast(city); // 重新加载演示数据
            } else {
                this.showError('获取逐小时预报失败');
            }
        }
    }

    displayHourlyForecast(hourlyData) {
        const ctx = document.getElementById('hourlyChart').getContext('2d');

        // 准备图表数据
        const labels = hourlyData.map(item => {
            const time = new Date(item.dt * 1000);
            return time.getHours() + ':00';
        });

        const temperatures = hourlyData.map(item => Math.round(item.main.temp));
        const precipitation = hourlyData.map(item => Math.round(item.pop * 100));

        // 创建图表
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '温度 (°C)',
                    data: temperatures,
                    borderColor: '#ff7675',
                    backgroundColor: 'rgba(255, 118, 117, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4
                }, {
                    label: '降水概率 (%)',
                    data: precipitation,
                    borderColor: '#74b9ff',
                    backgroundColor: 'rgba(116, 185, 255, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        labels: {
                            color: this.currentTheme === 'dark' ? '#ddd' : '#333'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: this.currentTheme === 'dark' ? '#ddd' : '#333'
                        },
                        grid: {
                            color: this.currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            color: this.currentTheme === 'dark' ? '#ddd' : '#333'
                        },
                        grid: {
                            color: this.currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            color: this.currentTheme === 'dark' ? '#ddd' : '#333'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
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

    showError(message) {
        const errorAlert = document.getElementById('errorAlert');
        const errorMessage = document.getElementById('errorMessage');

        errorMessage.textContent = message;
        errorAlert.style.display = 'block';

        // 5秒后自动隐藏错误提示
        setTimeout(() => {
            errorAlert.style.display = 'none';
        }, 5000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});