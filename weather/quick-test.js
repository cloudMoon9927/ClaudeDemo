// 快速功能测试脚本
const http = require('http');

const tests = [
    { name: '服务器健康检查', url: 'http://localhost:3000/api/health', expected: 'status' },
    { name: '主页面访问', url: 'http://localhost:3000/', expected: 'html' },
    { name: '测试页面访问', url: 'http://localhost:3000/test-features.html', expected: 'html' },
    { name: '静态CSS文件', url: 'http://localhost:3000/css/style.css', expected: 'css' },
    { name: '静态JS文件', url: 'http://localhost:3000/js/main.js', expected: 'js' },
    { name: '天气API端点', url: 'http://localhost:3000/api/weather/current?lat=39.9&lon=116.4', expected: 'json' }
];

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.on('error', reject);
        req.setTimeout(5000, () => req.abort());
    });
}

async function runTests() {
    console.log('🚀 开始快速功能测试...\n');

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            const result = await makeRequest(test.url);

            let success = false;
            if (test.expected === 'html' && result.data.includes('<!DOCTYPE html>')) success = true;
            else if (test.expected === 'css' && result.data.includes('/*')) success = true;
            else if (test.expected === 'js' && result.data.includes('//')) success = true;
            else if (test.expected === 'json' && result.data.includes('{')) success = true;
            else if (test.expected === 'status' && result.data.includes('"status":"OK"')) success = true;

            if (success && result.status === 200) {
                console.log(`✅ ${test.name} - 通过`);
                passed++;
            } else {
                console.log(`❌ ${test.name} - 失败 (状态码: ${result.status})`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ ${test.name} - 错误: ${error.message}`);
            failed++;
        }
    }

    console.log(`\n📊 测试结果: ${passed} 通过, ${failed} 失败`);

    if (failed === 0) {
        console.log('🎉 所有测试通过！应用运行正常。');
    } else {
        console.log('⚠️  部分测试失败，请检查应用状态。');
    }
}

runTests().catch(console.error);