// 天气API处理模块

class WeatherAPI {
    constructor() {
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.geoUrl = 'https://api.openweathermap.org/geo/1.0';
        this.apiKey = 'YOUR_API_KEY'; // 实际使用时需要替换为真实的API密钥
    }

    async getCurrentWeather(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=zh_cn`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取当前天气失败:', error);
            throw error;
        }
    }

    async getForecast(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=zh_cn`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取天气预报失败:', error);
            throw error;
        }
    }

    async searchCities(query) {
        try {
            const response = await fetch(
                `${this.geoUrl}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('搜索城市失败:', error);
            throw error;
        }
    }

    async getCityFromCoords(lat, lon) {
        try {
            const response = await fetch(
                `${this.geoUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data[0]; // 返回第一个结果
        } catch (error) {
            console.error('通过坐标获取城市信息失败:', error);
            throw error;
        }
    }

    // 获取天气图标对应的CSS类
    getWeatherIconClass(weatherMain, iconCode) {
        const isDay = iconCode.includes('d');

        switch(weatherMain.toLowerCase()) {
            case 'clear':
                return isDay ? 'fa-sun weather-clear-day sun-animation' : 'fa-moon weather-clear-night';
            case 'clouds':
                return 'fa-cloud weather-clouds cloud-animation';
            case 'rain':
                return 'fa-cloud-rain weather-rain rain-animation';
            case 'snow':
                return 'fa-snowflake weather-snow snow-animation';
            case 'thunderstorm':
                return 'fa-bolt weather-thunderstorm';
            case 'drizzle':
                return 'fa-cloud-rain weather-rain rain-animation';
            case 'mist':
            case 'fog':
                return 'fa-smog weather-mist';
            case 'dust':
            case 'sand':
                return 'fa-smog weather-dust';
            case 'tornado':
                return 'fa-tornado weather-tornado';
            case 'hurricane':
                return 'fa-hurricane weather-hurricane';
            default:
                return 'fa-cloud-sun';
        }
    }

    // 获取天气描述
    getWeatherDescription(weatherId) {
        const descriptions = {
            // 晴天
            800: '晴天',
            // 多云
            801: '少云',
            802: '多云',
            803: '阴',
            804: '阴天',
            // 雨天
            500: '小雨',
            501: '中雨',
            502: '大雨',
            503: '暴雨',
            504: '大暴雨',
            511: '冻雨',
            520: '小雨-阵雨',
            521: '阵雨',
            522: '强阵雨',
            531: '间歇性阵雨',
            // 雪天
            600: '小雪',
            601: '雪',
            602: '大雪',
            611: '雨夹雪',
            612: '小雨夹雪',
            613: '雨夹雪',
            615: '小雨雪',
            616: '雨夹雪',
            620: '小雪-阵雪',
            621: '阵雪',
            622: '大雪',
            // 雷雨
            200: '雷阵雨',
            201: '强雷阵雨',
            202: '强雷阵雨',
            210: '轻微雷雨',
            211: '雷雨',
            212: '强雷雨',
            221: '间歇性雷雨',
            230: '轻微雷阵雨',
            231: '雷阵雨',
            232: '强雷阵雨',
            // 雾天
            701: '薄雾',
            711: '烟雾',
            721: '霾',
            731: '沙尘',
            741: '雾',
            751: '沙尘',
            761: '沙尘',
            762: '火山灰',
            771: '龙卷风',
            781: '龙卷风'
        };

        return descriptions[weatherId] || '未知天气';
    }

    // 获取空气质量描述
    getAirQualityDescription(aqi) {
        const descriptions = {
            1: '优',
            2: '良',
            3: '轻度污染',
            4: '中度污染',
            5: '重度污染'
        };

        return descriptions[aqi] || '未知';
    }

    // 获取风速描述
    getWindSpeedDescription(speed) {
        if (speed < 0.3) return '无风';
        if (speed < 1.6) return '软风';
        if (speed < 3.4) return '轻风';
        if (speed < 5.5) return '微风';
        if (speed < 8.0) return '和风';
        if (speed < 10.8) return '清风';
        if (speed < 13.9) return '强风';
        if (speed < 17.2) return '疾风';
        if (speed < 20.8) return '大风';
        if (speed < 24.5) return '烈风';
        if (speed < 28.5) return '狂风';
        if (speed < 32.7) return '暴风';
        return '飓风';
    }
}

// 导出WeatherAPI类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherAPI;
}