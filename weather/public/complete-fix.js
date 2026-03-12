// 完整的修复脚本
console.log('🔧 开始完整修复...');

// 修复1: 确保WeatherApp正确初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM已加载，开始修复...');

    // 等待一小段时间确保所有脚本加载完成
    setTimeout(function() {
        try {
            // 检查WeatherApp是否存在
            if (typeof WeatherApp === 'undefined') {
                console.error('❌ WeatherApp类未定义');
                return;
            }

            console.log('✅ WeatherApp类存在');

            // 创建或获取WeatherApp实例
            if (!window.weatherApp || typeof window.weatherApp.init !== 'function') {
                console.log('📝 创建新的WeatherApp实例...