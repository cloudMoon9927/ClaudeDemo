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

        return this.cities.filter(city =>
            city.name.toLowerCase().includes(query.toLowerCase()) ||
            (city.local_names.en && city.local_names.en.toLowerCase().includes(query.toLowerCase()))
        );
    },

    getCityFromCoords: function(lat, lon) {
        return this.reverseGeocode;
    }
};

// 导出DemoData对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DemoData;
}