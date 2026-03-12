// 导航修复脚本
console.log('🔧 开始修复导航功能...');

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM已加载，开始修复导航...');

    // 检查WeatherApp是否已经存在
    if (typeof window.weatherAppInstance === 'undefined') {
        console.log('📝 创建新的WeatherApp实例...');

        // 创建WeatherApp实例
        try {
            window.weatherAppInstance = new WeatherApp();
            console.log('✅ WeatherApp实例创建成功');
        } catch (error) {
            console.error('❌ WeatherApp实例创建失败:', error);
            return;
        }
    }

    const app = window.weatherAppInstance;

    // 重新绑定导航事件
    console.log('🔗 重新绑定导航事件...');

    // 当前天气标签
    const currentTab = document.getElementById('currentWeatherTab');
    if (currentTab) {
        currentTab.onclick = function(e) {
            e.preventDefault();
            console.log('🌤️ 切换到当前天气');
            app.switchTab('current');
        };
        console.log('✅ 当前天气标签事件绑定成功');
    }

    // 天气预报标签
    const forecastTab = document.getElementById('forecastTab');
    if (forecastTab) {
        forecastTab.onclick = function(e) {
            e.preventDefault();
            console.log('📅 切换到天气预报');
            app.switchTab('forecast');
        };
        console.log('✅ 天气预报标签事件绑定成功');
    }

    // 逐小时预报标签
    const hourlyTab = document.getElementById('hourlyTab');
    if (hourlyTab) {
        hourlyTab.onclick = function(e) {
            e.preventDefault();
            console.log('⏰ 切换到逐小时预报');
            app.switchTab('hourly');
        };
        console.log('✅ 逐小时预报标签事件绑定成功');
    }

    // 添加城市按钮
    const addCityBtn = document.getElementById('addCityBtn');
    if (addCityBtn) {
        addCityBtn.onclick = function(e) {
            e.preventDefault();
            console.log('➕ 打开添加城市模态框');
            app.showAddCityModal();
        };
        console.log('✅ 添加城市按钮事件绑定成功');
    }

    // 主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.onclick = function(e) {
            e.preventDefault();
            console.log('🌓 切换主题');
            app.toggleTheme();
        };
        console.log('✅ 主题切换按钮事件绑定成功');
    }

    console.log('🎉 所有导航事件修复完成！');

    // 测试导航功能
    setTimeout(function() {
        console.log('🧪 测试导航功能...');
        try {
            app.switchTab('current');
            console.log('✅ 当前天气标签切换测试成功');

            setTimeout(function() {
                app.switchTab('forecast');
                console.log('✅ 天气预报标签切换测试成功');

                setTimeout(function() {
                    app.switchTab('hourly');
                    console.log('✅ 逐小时预报标签切换测试成功');
                    console.log('🎉 所有导航功能测试通过！');
                }, 100);
            }, 100);
        } catch (error) {
            console.error('❌ 导航功能测试失败:', error);
        }
    }, 1000);
});

// 如果DOM已经加载完成，直接执行修复
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('📄 DOM已经加载完成，立即执行修复...');
    setTimeout(function() {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    }, 100);
}