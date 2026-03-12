// 演示数据 - 用于在没有API密钥时展示应用界面

const DemoData = {
    // 当前天气演示数据
    currentWeather: {
        coord: { lon: 116.4074, lat: 39.9042 },
        weather: [
            {
                id: 801,
                main: "Clouds",
                description: "少云",
                icon: "02d"
            }
        ],
        base: "stations",
        main: {
            temp: 22.5,
            feels_like: 25.1,
            temp_min: 18.0,
            temp_max: 26.0,
            pressure: 1013,
            humidity: 65
        },
        visibility: 10000,
        wind: {
            speed: 3.2,
            deg: 180
        },
        clouds: {
            all: 20
        },
        dt: Math.floor(Date.now() / 1000),
        sys: {
            type: 1,
            id: 9609,
            country: "CN",
            sunrise: Math.floor(Date.now() / 1000) - 3600,
            sunset: Math.floor(Date.now() / 1000) + 3600
        },
        timezone: 28800,
        id: 1816670,
        name: "北京",
        cod: 200
    },

    // 天气预报演示数据
    forecast: {
        cod: "200",
        message: 0,
        cnt: 40,
        list: [
            {
                dt: Math.floor(Date.now() / 1000) + 3600,
                main: {
                    temp: 23.5,
                    feels_like: 26.1,
                    temp_min: 20.0,
                    temp_max: 25.0,
                    pressure: 1012,
                    sea_level: 1012,
                    grnd_level: 1008,
                    humidity: 60,
                    temp_kf: -1.5
                },
                weather: [
                    {
                        id: 500,
                        main: "Rain",
                        description: "小雨",
                        icon: "10d"
                    }
                ],
                clouds: { all: 75 },
                wind: { speed: 4.1, deg: 200, gust: 5.2 },
                visibility: 8000,
                pop: 0.3,
                rain: { "3h": 0.25 },
                sys: { pod: "d" },
                dt_txt: new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ')
            },
            {
                dt: Math.floor(Date.now() / 1000) + 7200,
                main: {
                    temp: 25.0,
                    feels_like: 27.5,
                    temp_min: 22.0,
                    temp_max: 27.0,
                    pressure: 1010,
                    sea_level: 1010,
                    grnd_level: 1006,
                    humidity: 55,
                    temp_kf: -1.0
                },
                weather: [
                    {
                        id: 803,
                        main: "Clouds",
                        description: "阴",
                        icon: "04d"
                    }
                ],
                clouds: { all: 75 },
                wind: { speed: 3.5, deg: 210, gust: 4.8 },
                visibility: 10000,
                pop: 0.1,
                sys: { pod: "d" },
                dt_txt: new Date(Date.now() + 7200 * 1000).toISOString().slice(0, 19).replace('T', ' ')
            }
        ],
        city: {
            id: 1816670,
            name: "北京",
            coord: { lat: 39.9042, lon: 116.4074 },
            country: "CN",
            population: 1000000,
            timezone: 28800,
            sunrise: Math.floor(Date.now() / 1000) - 3600,
            sunset: Math.floor(Date.now() / 1000) + 3600
        }
    },

    // 城市搜索演示数据
    cities: [
        {
            name: "北京",
            local_names: { zh: "北京", en: "Beijing" },
            lat: 39.9042,
            lon: 116.4074,
            country: "CN",
            state: "Beijing"
        },
        {
            name: "上海",
            local_names: { zh: "上海", en: "Shanghai" },
            lat: 31.2304,
            lon: 121.4737,
            country: "CN",
            state: "Shanghai"
        },
        {
            name: "广州",
            local_names: { zh: "广州", en: "Guangzhou" },
            lat: 23.1291,
            lon: 113.2644,
            country: "CN",
            state: "Guangdong"
        },
        {
            name: "深圳",
            local_names: { zh: "深圳", en: "Shenzhen" },
            lat: 22.5431,
            lon: 114.0579,
            country: "CN",
            state: "Guangdong"
        },
        {
            name: "杭州",
            local_names: { zh: "杭州", en: "Hangzhou" },
            lat: 30.2741,
            lon: 120.1551,
            country: "CN",
            state: "Zhejiang"
        },
        {
            name: "南京",
            local_names: { zh: "南京", en: "Nanjing" },
            lat: 32.0603,
            lon: 118.7969,
            country: "CN",
            state: "Jiangsu"
        },
        {
            name: "成都",
            local_names: { zh: "成都", en: "Chengdu" },
            lat: 30.5728,
            lon: 104.0668,
            country: "CN",
            state: "Sichuan"
        },
        {
            name: "武汉",
            local_names: { zh: "武汉", en: "Wuhan" },
            lat: 30.5928,
            lon: 114.3055,
            country: "CN",
            state: "Hubei"
        },
        {
            name: "西安",
            local_names: { zh: "西安", en: "Xi'an" },
            lat: 34.3416,
            lon: 108.9398,
            country: "CN",
            state: "Shaanxi"
        },
        {
            name: "天津",
            local_names: { zh: "天津", en: "Tianjin" },
            lat: 39.3434,
            lon: 117.3616,
            country: "CN",
            state: "Tianjin"
        },
        {
            name: "重庆",
            local_names: { zh: "重庆", en: "Chongqing" },
            lat: 29.4316,
            lon: 106.9123,
            country: "CN",
            state: "Chongqing"
        },
        {
            name: "纽约",
            local_names: { zh: "纽约", en: "New York" },
            lat: 40.7128,
            lon: -74.0060,
            country: "US",
            state: "New York"
        },
        {
            name: "伦敦",
            local_names: { zh: "伦敦", en: "London" },
            lat: 51.5074,
            lon: -0.1278,
            country: "GB",
            state: "England"
        },
        {
            name: "东京",
            local_names: { zh: "东京", en: "Tokyo" },
            lat: 35.6762,
            lon: 139.6503,
            country: "JP",
            state: "Tokyo"
        },
        {
            name: "巴黎",
            local_names: { zh: "巴黎", en: "Paris" },
            lat: 48.8566,
            lon: 2.3522,
            country: "FR",
            state: "Île-de-France"
        },
        {
            name: "悉尼",
            local_names: { zh: "悉尼", en: "Sydney" },
            lat: -33.8688,
            lon: 151.2093,
            country: "AU",
            state: "New South Wales"
        },
        {
            name: "新加坡",
            local_names: { zh: "新加坡", en: "Singapore" },
            lat: 1.3521,
            lon: 103.8198,
            country: "SG",
            state: null
        },
        {
            name: "首尔",
            local_names: { zh: "首尔", en: "Seoul" },
            lat: 37.5665,
            lon: 126.9780,
            country: "KR",
            state: "Seoul"
        },
        {
            name: "曼谷",
            local_names: { zh: "曼谷", en: "Bangkok" },
            lat: 13.7563,
            lon: 100.5018,
            country: "TH",
            state: "Bangkok"
        },
        {
            name: "迪拜",
            local_names: { zh: "迪拜", en: "Dubai" },
            lat: 25.2048,
            lon: 55.2708,
            country: "AE",
            state: "Dubai"
        },
        {
            name: "莫斯科",
            local_names: { zh: "莫斯科", en: "Moscow" },
            lat: 55.7558,
            lon: 37.6173,
            country: "RU",
            state: "Moscow"
        },
        {
            name: "开罗",
            local_names: { zh: "开罗", en: "Cairo" },
            lat: 30.0444,
            lon: 31.2357,
            country: "EG",
            state: "Cairo"
        },
        {
            name: "孟买",
            local_names: { zh: "孟买", en: "Mumbai" },
            lat: 19.0760,
            lon: 72.8777,
            country: "IN",
            state: "Maharashtra"
        },
        {
            name: "多伦多",
            local_names: { zh: "多伦多", en: "Toronto" },
            lat: 43.651070,
            lon: -79.347015,
            country: "CA",
            state: "Ontario"
        },
        {
            name: "洛杉矶",
            local_names: { zh: "洛杉矶", en: "Los Angeles" },
            lat: 34.0522,
            lon: -118.2437,
            country: "US",
            state: "California"
        },
        {
            name: "柏林",
            local_names: { zh: "柏林", en: "Berlin" },
            lat: 52.5200,
            lon: 13.4050,
            country: "DE",
            state: "Berlin"
        },
        {
            name: "罗马",
            local_names: { zh: "罗马", en: "Rome" },
            lat: 41.9028,
            lon: 12.4964,
            country: "IT",
            state: "Lazio"
        },
        {
            name: "马德里",
            local_names: { zh: "马德里", en: "Madrid" },
            lat: 40.4168,
            lon: -3.7038,
            country: "ES",
            state: "Madrid"
        }
    ],

    // 反向地理编码演示数据
    reverseGeocode: {
        name: "北京",
        local_names: { zh: "北京", en: "Beijing" },
        lat: 39.9042,
        lon: 116.4074,
        country: "CN",
        state: "Beijing"
    },

    // 生成更多预报数据的辅助函数
    generateForecastData: function(days = 7) {
        const forecastList = [];
        const baseTemp = 22;
        const baseHumidity = 65;

        for (let i = 0; i < days * 8; i++) { // 每3小时一个数据点
            const date = new Date(Date.now() + i * 3 * 60 * 60 * 1000);
            const tempVariation = (Math.random() - 0.5) * 10;
            const humidityVariation = (Math.random() - 0.5) * 20;

            const weatherConditions = [
                { id: 800, main: "Clear", description: "晴天", icon: "01d" },
                { id: 801, main: "Clouds", description: "少云", icon: "02d" },
                { id: 802, main: "Clouds", description: "多云", icon: "03d" },
                { id: 803, main: "Clouds", description: "阴", icon: "04d" },
                { id: 500, main: "Rain", description: "小雨", icon: "10d" },
                { id: 600, main: "Snow", description: "小雪", icon: "13d" }
            ];

            const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

            forecastList.push({
                dt: Math.floor(date.getTime() / 1000),
                main: {
                    temp: baseTemp + tempVariation,
                    feels_like: baseTemp + tempVariation + 2,
                    temp_min: baseTemp + tempVariation - 3,
                    temp_max: baseTemp + tempVariation + 3,
                    pressure: 1013 + (Math.random() - 0.5) * 20,
                    sea_level: 1013 + (Math.random() - 0.5) * 20,
                    grnd_level: 1009 + (Math.random() - 0.5) * 20,
                    humidity: Math.max(30, Math.min(90, baseHumidity + humidityVariation)),
                    temp_kf: 0
                },
                weather: [weather],
                clouds: { all: Math.floor(Math.random() * 100) },
                wind: {
                    speed: Math.random() * 5 + 1,
                    deg: Math.floor(Math.random() * 360),
                    gust: Math.random() * 3 + 1
                },
                visibility: Math.floor(Math.random() * 5000) + 5000,
                pop: Math.random() * 0.8,
                rain: Math.random() > 0.7 ? { "3h": Math.random() * 5 } : undefined,
                snow: Math.random() > 0.9 ? { "3h": Math.random() * 2 } : undefined,
                sys: { pod: date.getHours() < 6 || date.getHours() > 18 ? "n" : "d" },
                dt_txt: date.toISOString().slice(0, 19).replace('T', ' ')
            });
        }

        return {
            cod: "200",
            message: 0,
            cnt: forecastList.length,
            list: forecastList,
            city: {
                id: 1816670,
                name: "北京",
                coord: { lat: 39.9042, lon: 116.4074 },
                country: "CN",
                population: 1000000,
                timezone: 28800,
                sunrise: Math.floor(Date.now() / 1000) - 3600,
                sunset: Math.floor(Date.now() / 1000) + 3600
            }
        };
    },

    // 获取演示数据的方法
    getCurrentWeather: function() {
        return this.currentWeather;
    },

    getForecast: function() {
        return this.generateForecastData(7);
    },

    searchCities: function(query) {
        if (!query || query.length < 1) {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        const results = [];

        // 拼音映射表（简化的拼音映射）
        const pinyinMap = {
            'beijing': '北京', 'shanghai': '上海', 'guangzhou': '广州', 'shenzhen': '深圳',
            'hangzhou': '杭州', 'nanjing': '南京', 'chengdu': '成都', 'wuhan': '武汉',
            'xian': '西安', 'tianjin': '天津', 'chongqing': '重庆', 'tokyo': '东京',
            'paris': '巴黎', 'london': '伦敦', 'newyork': '纽约', 'singapore': '新加坡',
            'seoul': '首尔', 'bangkok': '曼谷', 'dubai': '迪拜', 'moscow': '莫斯科',
            'cairo': '开罗', 'mumbai': '孟买', 'toronto': '多伦多', 'losangeles': '洛杉矶',
            'berlin': '柏林', 'rome': '罗马', 'madrid': '马德里', 'sydney': '悉尼'
        };

        for (const city of this.cities) {
            let score = 0;
            let matched = false;

            // 1. 中文名称精确匹配（最高分）
            if (city.name.toLowerCase().includes(searchTerm)) {
                score += 100;
                matched = true;
            }

            // 2. 英文名称匹配
            if (city.local_names.en && city.local_names.en.toLowerCase().includes(searchTerm)) {
                score += 80;
                matched = true;
            }

            // 3. 拼音匹配
            const cityPinyin = Object.keys(pinyinMap).find(key => pinyinMap[key] === city.name);
            if (cityPinyin && cityPinyin.includes(searchTerm.replace(/\s+/g, ''))) {
                score += 60;
                matched = true;
            }

            // 4. 国家/地区匹配
            if (city.country.toLowerCase().includes(searchTerm) ||
                (city.state && city.state.toLowerCase().includes(searchTerm))) {
                score += 40;
                matched = true;
            }

            // 5. 首字母匹配
            if (city.name.charAt(0).toLowerCase() === searchTerm.charAt(0)) {
                score += 20;
                matched = true;
            }

            if (matched) {
                results.push({
                    ...city,
                    searchScore: score
                });
            }
        }

        // 按匹配分数排序，返回前10个结果
        return results
            .sort((a, b) => b.searchScore - a.searchScore)
            .slice(0, 10);
    },

    getCityFromCoords: function(lat, lon) {
        return this.reverseGeocode;
    }
};

// 导出DemoData对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DemoData;
}