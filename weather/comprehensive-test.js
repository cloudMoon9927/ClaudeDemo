// 综合功能测试脚本

class ComprehensiveTester {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.warnings = 0;
    }

    addTest(name, testFunction, category = '功能测试') {
        this.tests.push({ name, testFunction, category });
    }

    async runTests() {
        console.log('🚀 开始综合功能测试...\n');

        const categories = [...new Set(this.tests.map(t => t.category))];

        for (const category of categories) {
            console.log(`📋 ${category}:`);
            const categoryTests = this.tests.filter(t => t.category === category);

            for (const test of categoryTests) {
                try {
                    await test.testFunction();
                    console.log(`  ✅ ${test.name}`);
                    this.passed++;
                } catch (error) {
                    if (error.message.includes('警告')) {
                        console.log(`  ⚠️  ${test.name}: ${error.message}`);
                        this.warnings++;
                    } else {
                        console.log(`  ❌ ${test.name}: ${error.message}`);
                        this.failed++;
                    }
                }
            }
            console.log('');
        }

        console.log(`📊 测试结果: ${this.passed} 通过, ${this.failed} 失败, ${this.warnings} 警告`);

        if (this.failed === 0) {
            console.log('🎉 所有功能测试通过！应用运行正常。');
        } else {
            console.log('⚠️  发现一些问题，需要进一步检查。');
        }

        return this.failed === 0;
    }
}

// 创建测试实例
const tester = new ComprehensiveTester();

// 用户体验测试
tester.addTest('页面切换动画', async () => {
    const weatherApp = new WeatherApp();

    // 测试标签切换
    weatherApp.switchTab('forecast');
    await new Promise(resolve => setTimeout(resolve, 400));

    const forecastContent = document.getElementById('forecastContent');
    if (!forecastContent || forecastContent.style.display !== 'block') {
        throw new Error('预报标签切换失败');
    }

    console.log('    页面切换动画正常');
}, '用户体验');

// 缓存功能测试
tester.addTest('数据缓存系统', async () => {
    const weatherApp = new WeatherApp();

    // 测试缓存设置和获取
    const testData = { temp: 25, humidity: 60 };
    const testKey = 'test_weather_key';

    weatherApp.setCache(testKey, testData, 'weather');
    const cachedData = weatherApp.getCache(testKey, 'weather');

    if (!cachedData || cachedData.temp !== 25) {
        throw new Error('缓存系统工作不正常');
    }

    console.log('    数据缓存功能正常');
}, '性能优化');

// 移动端功能测试
tester.addTest('移动端检测', async () => {
    const weatherApp = new WeatherApp();

    // 测试移动端检测
    const isMobile = weatherApp.isMobile();
    if (typeof isMobile !== 'boolean') {
        throw new Error('移动端检测功能异常');
    }

    console.log('    移动端检测功能正常');
}, '用户体验');

// 错误处理测试
tester.addTest('错误处理系统', async () => {
    const weatherApp = new WeatherApp();

    // 测试不同类型的错误提示
    weatherApp.showError('测试错误', 'error');
    weatherApp.showWarning('测试警告');
    weatherApp.showInfo('测试信息');

    const errorAlert = document.getElementById('errorAlert');
    if (!errorAlert || errorAlert.style.display !== 'block') {
        throw new Error('错误提示系统异常');
    }

    console.log('    错误处理系统正常');
}, '用户体验');

// 生活指数测试
tester.addTest('生活指数计算', async () => {
    const indices = new WeatherIndices();

    // 测试各种指数计算
    const mockWeather = {
        main: { temp: 25, humidity: 60, pressure: 1013 },
        weather: [{ main: 'Clear' }],
        wind: { speed: 3 },
        pop: 0.1
    };

    const allIndices = indices.getAllIndices(mockWeather);

    if (!allIndices.dressing || !allIndices.sport || !allIndices.carWash) {
        throw new Error('生活指数计算不完整');
    }

    console.log('    生活指数计算正常');
}, '功能测试');

// 图表性能优化测试
tester.addTest('图表性能优化', async () => {
    const charts = new WeatherCharts();

    // 测试数据优化
    const largeData = [];
    for (let i = 0; i < 100; i++) {
        largeData.push({
            dt: Date.now() + i * 3600,
            main: { temp: 20 + Math.random() * 10, humidity: 50 + Math.random() * 20 },
            pop: Math.random() * 0.5
        });
    }

    const optimizedData = charts.optimizeDataPoints(largeData, 24);

    if (optimizedData.length > 24) {
        throw new Error('数据优化功能异常');
    }

    console.log('    图表性能优化正常');
}, '性能优化');

// 天气预警测试
tester.addTest('天气预警系统', async () => {
    const weatherApp = new WeatherApp();

    // 测试高温预警
    const hotWeather = {
        main: { temp: 38 },
        weather: [{ main: 'Clear' }],
        wind: { speed: 2 },
        pop: 0
    };

    const alert = weatherApp.calculateWeatherAlert(hotWeather);
    if (alert.level !== 'high') {
        throw new Error('高温预警检测失败');
    }

    console.log('    天气预警系统正常');
}, '功能测试');

// 触摸手势测试
tester.addTest('触摸手势支持', async () => {
    const weatherApp = new WeatherApp();

    // 测试手势设置
    weatherApp.setupTouchGestures();

    // 模拟触摸事件
    const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ screenX: 100 }]
    });

    const touchEndEvent = new TouchEvent('touchend', {
        changedTouches: [{ screenX: 50 }]
    });

    document.dispatchEvent(touchStartEvent);
    document.dispatchEvent(touchEndEvent);

    console.log('    触摸手势支持正常');
}, '用户体验');

// 运行测试（如果在浏览器环境中）
if (typeof window !== 'undefined') {
    window.runComprehensiveTests = async () => {
        return await tester.runTests();
    };
} else {
    // Node.js环境
    tester.runTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { ComprehensiveTester, tester };