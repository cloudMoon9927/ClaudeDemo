// 天气应用后端服务器

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenWeatherMap API配置
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
    });
};

// 验证API密钥中间件
const validateApiKey = (req, res, next) => {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_API_KEY') {
        return res.status(500).json({
            error: 'API配置错误',
            message: '请配置OpenWeatherMap API密钥'
        });
    }
    next();
};

// 当前天气API
app.get('/api/weather/current', validateApiKey, async (req, res, next) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                error: '参数错误',
                message: '缺少必要的经纬度参数'
            });
        }

        const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
            params: {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                appid: OPENWEATHER_API_KEY,
                units: 'metric',
                lang: 'zh_cn'
            }
        });

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            // OpenWeatherMap API返回的错误
            res.status(error.response.status).json({
                error: '天气数据获取失败',
                message: error.response.data.message || '无法获取天气数据'
            });
        } else {
            next(error);
        }
    }
});

// 天气预报API
app.get('/api/weather/forecast', validateApiKey, async (req, res, next) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                error: '参数错误',
                message: '缺少必要的经纬度参数'
            });
        }

        const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
            params: {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                appid: OPENWEATHER_API_KEY,
                units: 'metric',
                lang: 'zh_cn'
            }
        });

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                error: '天气预报获取失败',
                message: error.response.data.message || '无法获取天气预报'
            });
        } else {
            next(error);
        }
    }
});

// 城市搜索API
app.get('/api/weather/city/search', validateApiKey, async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({
                error: '参数错误',
                message: '搜索关键词至少需要2个字符'
            });
        }

        const response = await axios.get(`${OPENWEATHER_GEO_URL}/direct`, {
            params: {
                q: q,
                limit: 5,
                appid: OPENWEATHER_API_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                error: '城市搜索失败',
                message: error.response.data.message || '无法搜索城市'
            });
        } else {
            next(error);
        }
    }
});

// 通过坐标获取城市信息
app.get('/api/weather/city/coords', validateApiKey, async (req, res, next) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                error: '参数错误',
                message: '缺少必要的经纬度参数'
            });
        }

        const response = await axios.get(`${OPENWEATHER_GEO_URL}/reverse`, {
            params: {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                limit: 1,
                appid: OPENWEATHER_API_KEY
            }
        });

        if (response.data && response.data.length > 0) {
            res.json(response.data[0]);
        } else {
            res.status(404).json({
                error: '未找到城市',
                message: '指定坐标未找到对应的城市信息'
            });
        }
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                error: '城市信息获取失败',
                message: error.response.data.message || '无法获取城市信息'
            });
        } else {
            next(error);
        }
    }
});

// 获取空气质量（模拟数据，实际应用中需要专门的API）
app.get('/api/weather/air-quality', validateApiKey, async (req, res, next) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                error: '参数错误',
                message: '缺少必要的经纬度参数'
            });
        }

        // 尝试获取真实的空气质量数据
        try {
            const response = await axios.get(`${OPENWEATHER_BASE_URL}/air_pollution`, {
                params: {
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    appid: OPENWEATHER_API_KEY
                }
            });

            res.json(response.data);
        } catch (airQualityError) {
            // 如果空气质量API不可用，返回模拟数据
            const mockAirQuality = {
                coord: [parseFloat(lon), parseFloat(lat)],
                list: [{
                    main: {
                        aqi: Math.floor(Math.random() * 5) + 1 // 1-5的随机值
                    },
                    components: {
                        co: Math.floor(Math.random() * 1000) + 200,
                        no: Math.floor(Math.random() * 50),
                        no2: Math.floor(Math.random() * 100),
                        o3: Math.floor(Math.random() * 200) + 50,
                        so2: Math.floor(Math.random() * 50),
                        pm2_5: Math.floor(Math.random() * 100) + 10,
                        pm10: Math.floor(Math.random() * 150) + 20,
                        nh3: Math.floor(Math.random() * 20)
                    },
                    dt: Math.floor(Date.now() / 1000)
                }]
            };

            res.json(mockAirQuality);
        }
    } catch (error) {
        next(error);
    }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 根路径重定向到前端应用
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        error: '路由不存在',
        message: `无法找到 ${req.originalUrl} 对应的资源`
    });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
    console.log(`天气应用服务器正在运行...`);
    console.log(`服务器地址: http://localhost:${PORT}`);
    console.log(`健康检查: http://localhost:${PORT}/api/health`);

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_API_KEY') {
        console.warn('警告: 请设置OPENWEATHER_API_KEY环境变量');
        console.warn('你可以从 https://openweathermap.org/api 获取免费的API密钥');
    }
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    console.error('Promise:', promise);
});

module.exports = app;