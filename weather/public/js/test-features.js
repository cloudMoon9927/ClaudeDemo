// 功能测试脚本

class FeatureTester {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    async runTests() {
        console.log('🚀 开始功能测试...\n');

        for (const test of this.tests) {
            try {
                await test.testFunction();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 测试结果: ${this.passed} 通过, ${this.failed} 失败`);
        return this.failed === 0;
    }
}

// 创建测试实例
const tester = new FeatureTester();

// 测试预报卡片功能
tester.addTest('预报卡片渲染', async () => {
    // 模拟预报数据
    const mockForecastData = {
        list: [
            {
                dt: Math.floor(Date.now() / 1000),
                dt_txt: new Date().toISOString().slice(0, 10) + ' 12:00:00',
                main: {
                    temp: 25,
                    temp_max: 28,
                    temp_min: 20,
                    humidity: 65,
                    pressure: 1013
                },
                weather: [{ main: 'Clear', description: '晴天' }],
                wind: { speed: 3.5 },
                pop: 0.1,
                visibility: 10000
            }
        ]
    };

    // 测试分组功能
    const weatherApp = new WeatherApp();
    const grouped = weatherApp.groupForecastByDay(mockForecastData.list);

    if (!grouped || grouped.length === 0) {
        throw new Error('预报数据分组失败');
    }

    // 测试卡片创建
    const card = weatherApp.createForecastCard(grouped[0], 0);
    if (!card || !card.querySelector) {
        throw new Error('预报卡片创建失败');
    }

    console.log('  预报卡片创建成功');
});

// 测试天气指数计算
tester.addTest('天气指数计算', async () => {
    const indices = new WeatherIndices();

    // 测试UV指数计算
    const uvIndex = indices.calculateUVIndex('Clear');
    if (typeof uvIndex !== 'number' || uvIndex < 0 || uvIndex > 11) {
        throw new Error('UV指数计算错误');
    }

    // 测试舒适度指数
    const comfort = indices.calculateComfortIndex(25, 60, 3);
    if (!comfort.level || !comfort.description) {
        throw new Error('舒适度指数计算错误');
    }

    // 测试穿衣指数
    const dressing = indices.calculateDressingIndex(20, 'Clear');
    if (!dressing.level || !dressing.suggestion || !dressing.clothes) {
        throw new Error('穿衣指数计算错误');
    }

    console.log('  天气指数计算正常');
});

// 测试天气预警
tester.addTest('天气预警系统', async () => {
    const weatherApp = new WeatherApp();

    // 测试高温预警
    const hotWeather = {
        main: { temp: 38 },
        weather: [{ main: 'Clear' }],
        wind: { speed: 2 },
        pop: 0
    };

    const hotAlert = weatherApp.calculateWeatherAlert(hotWeather);
    if (hotAlert.level !== 'high') {
        throw new Error('高温预警检测失败');
    }

    // 测试低温预警
    const coldWeather = {
        main: { temp: -15 },
        weather: [{ main: 'Clear' }],
        wind: { speed: 2 },
        pop: 0
    };

    const coldAlert = weatherApp.calculateWeatherAlert(coldWeather);
    if (coldAlert.level !== 'high') {
        throw new Error('低温预警检测失败');
    }

    console.log('  天气预警系统正常');
});

// 测试图表功能
tester.addTest('图表功能', async () => {
    const charts = new WeatherCharts();

    // 测试图表实例创建
    if (!charts.charts || typeof charts.charts.set !== 'function') {
        throw new Error('图表实例创建失败');
    }

    // 测试数据准备方法
    const hourlyData = [
        {
            dt: Math.floor(Date.now() / 1000),
            main: { temp: 25, humidity: 60 },
            pop: 0.1
        }
    ];

    const labels = charts.prepareHourlyLabels(hourlyData);
    if (!labels || labels.length === 0) {
        throw new Error('逐小时标签生成失败');
    }

    console.log('  图表功能正常');
});

// 运行测试
if (typeof window !== 'undefined') {
    // 浏览器环境
    window.runFeatureTests = async () => {
        return await tester.runTests();
    };
} else {
    // Node.js环境
    tester.runTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { FeatureTester, tester };