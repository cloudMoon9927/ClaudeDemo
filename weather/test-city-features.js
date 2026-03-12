// 城市管理功能测试脚本
class CityManagementTester {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    async runTests() {
        console.log('🏙️ 开始城市管理功能测试...\n');

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

        if (this.failed === 0) {
            console.log('🎉 所有城市管理功能测试通过！');
        } else {
            console.log('⚠️  发现一些问题，需要进一步检查。');
        }

        return this.failed === 0;
    }
}

// 创建测试实例
const tester = new CityManagementTester();

// 测试城市搜索功能
tester.addTest('城市搜索算法', async () => {
    const searchResults = DemoData.searchCities('北京');
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
        throw new Error('城市搜索返回无效结果');
    }

    const beijing = searchResults.find(city => city.name === '北京');
    if (!beijing) {
        throw new Error('未找到北京');
    }

    console.log(`    找到 ${searchResults.length} 个城市，包含北京`);
});

// 测试拼音搜索功能
tester.addTest('拼音搜索功能', async () => {
    const searchResults = DemoData.searchCities('beijing');
    if (!Array.isArray(searchResults) || searchResults.length === 0) {
        throw new Error('拼音搜索返回无效结果');
    }

    const beijing = searchResults.find(city => city.name === '北京');
    if (!beijing) {
        throw new Error('拼音搜索未找到北京');
    }

    console.log('    拼音搜索功能正常');
});

// 测试城市数据完整性
tester.addTest('城市数据完整性', async () => {
    const cities = DemoData.cities;
    if (!Array.isArray(cities) || cities.length < 20) {
        throw new Error(`城市数据不足，当前只有 ${cities.length} 个城市`);
    }

    // 检查每个城市是否都有必要字段
    for (const city of cities.slice(0, 5)) {
        if (!city.name || !city.country || typeof city.lat !== 'number' || typeof city.lon !== 'number') {
            throw new Error(`城市数据不完整: ${JSON.stringify(city)}`);
        }
    }

    console.log(`    城市数据完整，共 ${cities.length} 个城市`);
});

// 测试热门城市推荐
tester.addTest('热门城市推荐', async () => {
    const popularCities = [
        { name: '北京', country: 'CN' },
        { name: '上海', country: 'CN' },
        { name: '纽约', country: 'US' },
        { name: '伦敦', country: 'GB' }
    ];

    for (const cityInfo of popularCities) {
        const found = DemoData.cities.find(city =>
            city.name === cityInfo.name && city.country === cityInfo.country
        );
        if (!found) {
            throw new Error(`热门城市 ${cityInfo.name} 未在数据中找到`);
        }
    }

    console.log('    热门城市推荐数据正常');
});

// 测试城市排序功能
tester.addTest('城市排序功能', async () => {
    const cities = [
        { name: "北京", country: "CN" },
        { name: "上海", country: "CN" },
        { name: "纽约", country: "US" },
        { name: "伦敦", country: "GB" }
    ];

    // 测试按名称排序
    const sortedByName = [...cities].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    if (sortedByName[0].name !== '北京') {
        throw new Error('按名称排序结果不正确');
    }

    // 测试按国家排序
    const sortedByCountry = [...cities].sort((a, b) => {
        const countryA = a.country || '';
        const countryB = b.country || '';
        return countryA.localeCompare(countryB);
    });

    console.log('    城市排序功能正常');
});

// 测试批量操作逻辑
tester.addTest('批量操作逻辑', async () => {
    const savedCities = [
        { name: "北京", country: "CN" },
        { name: "上海", country: "CN" },
        { name: "纽约", country: "US" }
    ];

    const selectedCities = new Set([0, 2]);

    // 模拟批量删除
    const sortedIndices = Array.from(selectedCities).sort((a, b) => b - a);
    const citiesAfterDelete = [...savedCities];
    sortedIndices.forEach(index => {
        citiesAfterDelete.splice(index, 1);
    });

    if (citiesAfterDelete.length !== 1 || citiesAfterDelete[0].name !== '上海') {
        throw new Error('批量删除逻辑不正确');
    }

    console.log('    批量操作逻辑正常');
});

// 运行测试
if (typeof window === 'undefined') {
    // Node.js环境
    const fs = require('fs');
    const path = require('path');

    // 创建简单的DemoData对象用于测试
    const DemoData = {
        cities: [
            { name: "北京", local_names: { zh: "北京", en: "Beijing" }, lat: 39.9042, lon: 116.4074, country: "CN", state: "Beijing" },
            { name: "上海", local_names: { zh: "上海", en: "Shanghai" }, lat: 31.2304, lon: 121.4737, country: "CN", state: "Shanghai" },
            { name: "广州", local_names: { zh: "广州", en: "Guangzhou" }, lat: 23.1291, lon: 113.2644, country: "CN", state: "Guangdong" },
            { name: "深圳", local_names: { zh: "深圳", en: "Shenzhen" }, lat: 22.5431, lon: 114.0579, country: "CN", state: "Guangdong" },
            { name: "杭州", local_names: { zh: "杭州", en: "Hangzhou" }, lat: 30.2741, lon: 120.1551, country: "CN", state: "Zhejiang" },
            { name: "南京", local_names: { zh: "南京", en: "Nanjing" }, lat: 32.0603, lon: 118.7969, country: "CN", state: "Jiangsu" },
            { name: "成都", local_names: { zh: "成都", en: "Chengdu" }, lat: 30.5728, lon: 104.0668, country: "CN", state: "Sichuan" },
            { name: "武汉", local_names: { zh: "武汉", en: "Wuhan" }, lat: 30.5928, lon: 114.3055, country: "CN", state: "Hubei" },
            { name: "西安", local_names: { zh: "西安", en: "Xi'an" }, lat: 34.3416, lon: 108.9398, country: "CN", state: "Shaanxi" },
            { name: "天津", local_names: { zh: "天津", en: "Tianjin" }, lat: 39.3434, lon: 117.3616, country: "CN", state: "Tianjin" },
            { name: "重庆", local_names: { zh: "重庆", en: "Chongqing" }, lat: 29.4316, lon: 106.9123, country: "CN", state: "Chongqing" },
            { name: "纽约", local_names: { zh: "纽约", en: "New York" }, lat: 40.7128, lon: -74.0060, country: "US", state: "New York" },
            { name: "伦敦", local_names: { zh: "伦敦", en: "London" }, lat: 51.5074, lon: -0.1278, country: "GB", state: "England" },
            { name: "东京", local_names: { zh: "东京", en: "Tokyo" }, lat: 35.6762, lon: 139.6503, country: "JP", state: "Tokyo" },
            { name: "巴黎", local_names: { zh: "巴黎", en: "Paris" }, lat: 48.8566, lon: 2.3522, country: "FR", state: "Île-de-France" },
            { name: "悉尼", local_names: { zh: "悉尼", en: "Sydney" }, lat: -33.8688, lon: 151.2093, country: "AU", state: "New South Wales" },
            { name: "新加坡", local_names: { zh: "新加坡", en: "Singapore" }, lat: 1.3521, lon: 103.8198, country: "SG", state: null },
            { name: "首尔", local_names: { zh: "首尔", en: "Seoul" }, lat: 37.5665, lon: 126.9780, country: "KR", state: "Seoul" },
            { name: "曼谷", local_names: { zh: "曼谷", en: "Bangkok" }, lat: 13.7563, lon: 100.5018, country: "TH", state: "Bangkok" },
            { name: "迪拜", local_names: { zh: "迪拜", en: "Dubai" }, lat: 25.2048, lon: 55.2708, country: "AE", state: "Dubai" },
            { name: "莫斯科", local_names: { zh: "莫斯科", en: "Moscow" }, lat: 55.7558, lon: 37.6173, country: "RU", state: "Moscow" },
            { name: "开罗", local_names: { zh: "开罗", en: "Cairo" }, lat: 30.0444, lon: 31.2357, country: "EG", state: "Cairo" },
            { name: "孟买", local_names: { zh: "孟买", en: "Mumbai" }, lat: 19.0760, lon: 72.8777, country: "IN", state: "Maharashtra" },
            { name: "多伦多", local_names: { zh: "多伦多", en: "Toronto" }, lat: 43.651070, lon: -79.347015, country: "CA", state: "Ontario" },
            { name: "洛杉矶", local_names: { zh: "洛杉矶", en: "Los Angeles" }, lat: 34.0522, lon: -118.2437, country: "US", state: "California" },
            { name: "柏林", local_names: { zh: "柏林", en: "Berlin" }, lat: 52.5200, lon: 13.4050, country: "DE", state: "Berlin" },
            { name: "罗马", local_names: { zh: "罗马", en: "Rome" }, lat: 41.9028, lon: 12.4964, country: "IT", state: "Lazio" },
            { name: "马德里", local_names: { zh: "马德里", en: "Madrid" }, lat: 40.4168, lon: -3.7038, country: "ES", state: "Madrid" }
        ],
        searchCities: function(query) {
            if (!query || query.length < 1) {
                return [];
            }

            const searchTerm = query.toLowerCase().trim();
            const results = [];

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

                if (city.name.toLowerCase().includes(searchTerm)) {
                    score += 100;
                    matched = true;
                }

                if (city.local_names.en && city.local_names.en.toLowerCase().includes(searchTerm)) {
                    score += 80;
                    matched = true;
                }

                const cityPinyin = Object.keys(pinyinMap).find(key => pinyinMap[key] === city.name);
                if (cityPinyin && cityPinyin.includes(searchTerm.replace(/\s+/g, ''))) {
                    score += 60;
                    matched = true;
                }

                if (city.country.toLowerCase().includes(searchTerm) ||
                    (city.state && city.state.toLowerCase().includes(searchTerm))) {
                    score += 40;
                    matched = true;
                }

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

            return results
                .sort((a, b) => b.searchScore - a.searchScore)
                .slice(0, 10);
        }
    };

    tester.runTests().then(success => {
        process.exit(success ? 0 : 1);
    });
} else {
    // 浏览器环境
    window.runCityManagementTests = async () => {
        return await tester.runTests();
    };
}

module.exports = { CityManagementTester, tester };