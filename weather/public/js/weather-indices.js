// 天气指数计算模块

class WeatherIndices {
    constructor() {
        this.indices = {
            uv: null,
            comfort: null,
            dressing: null,
            carWash: null,
            sport: null,
            travel: null
        };
    }

    // 计算紫外线指数
    calculateUVIndex(weatherMain, cloudiness = 0) {
        let baseUV = 8; // 基础紫外线指数

        // 根据天气状况调整
        switch(weatherMain.toLowerCase()) {
            case 'clear':
                baseUV = 10;
                break;
            case 'clouds':
                baseUV = 6 - (cloudiness / 100 * 4);
                break;
            case 'rain':
            case 'drizzle':
                baseUV = 2;
                break;
            case 'snow':
                baseUV = 7; // 雪地反射增强紫外线
                break;
            case 'thunderstorm':
                baseUV = 1;
                break;
            default:
                baseUV = 5;
        }

        return Math.max(0, Math.min(11, Math.round(baseUV)));
    }

    // 计算舒适度指数
    calculateComfortIndex(temperature, humidity, windSpeed) {
        // 体感温度计算 (简化版)
        const feelsLike = temperature + (humidity - 50) * 0.1 - windSpeed * 0.5;

        if (feelsLike >= 30) return { level: '很不舒适', description: '炎热难耐，注意防暑' };
        if (feelsLike >= 26) return { level: '不舒适', description: '闷热，注意降温' };
        if (feelsLike >= 22) return { level: '较舒适', description: '体感良好' };
        if (feelsLike >= 18) return { level: '舒适', description: '最适宜温度' };
        if (feelsLike >= 10) return { level: '较舒适', description: '稍凉，注意保暖' };
        if (feelsLike >= 0) return { level: '不舒适', description: '寒冷，需添衣' };
        return { level: '很不舒适', description: '严寒，注意防寒' };
    }

    // 计算穿衣指数
    calculateDressingIndex(temperature, weatherMain) {
        const temp = Math.round(temperature);

        if (temp >= 32) {
            return {
                level: '炎热',
                suggestion: '轻薄短装，注意防晒',
                clothes: ['短袖', '短裤', '凉鞋', '太阳镜']
            };
        } else if (temp >= 28) {
            return {
                level: '热',
                suggestion: '轻薄衣物，注意通风',
                clothes: ['短袖', '薄长裤', '运动鞋']
            };
        } else if (temp >= 24) {
            return {
                level: '较热',
                suggestion: '轻薄长袖或短袖',
                clothes: ['短袖', '长袖衬衫', '薄外套']
            };
        } else if (temp >= 20) {
            return {
                level: '舒适',
                suggestion: '长袖衣物',
                clothes: ['长袖', '薄毛衣', '休闲裤']
            };
        } else if (temp >= 15) {
            return {
                level: '较凉',
                suggestion: '薄外套或毛衣',
                clothes: ['毛衣', '薄外套', '长裤']
            };
        } else if (temp >= 10) {
            return {
                level: '凉',
                suggestion: '厚外套',
                clothes: ['厚外套', '毛衣', '长裤']
            };
        } else if (temp >= 5) {
            return {
                level: '冷',
                suggestion: '冬装',
                clothes: ['羽绒服', '厚毛衣', '保暖内衣']
            };
        } else {
            return {
                level: '寒冷',
                suggestion: '厚重冬装',
                clothes: ['厚羽绒服', '保暖内衣', '帽子手套']
            };
        }
    }

    // 计算洗车指数
    calculateCarWashIndex(weatherMain, pop, windSpeed) {
        if (weatherMain === 'rain' || pop > 0.6) {
            return {
                level: '不宜',
                suggestion: '有降雨，不适合洗车'
            };
        }

        if (windSpeed > 8) {
            return {
                level: '不宜',
                suggestion: '风力较大，洗车后易沾灰尘'
            };
        }

        if (weatherMain === 'clear') {
            return {
                level: '适宜',
                suggestion: '天气晴好，适宜洗车'
            };
        }

        return {
            level: '较适宜',
            suggestion: '天气较好，可以洗车'
        };
    }

    // 计算运动指数
    calculateSportIndex(temperature, weatherMain, windSpeed, aqi = 50) {
        // 温度适宜性 (18-25度最佳)
        let tempScore = 100;
        if (temperature < 5 || temperature > 35) tempScore = 20;
        else if (temperature < 10 || temperature > 30) tempScore = 60;
        else if (temperature < 15 || temperature > 28) tempScore = 80;

        // 天气状况评分
        let weatherScore = 100;
        if (weatherMain === 'rain' || weatherMain === 'thunderstorm') weatherScore = 20;
        else if (weatherMain === 'snow') weatherScore = 40;
        else if (weatherMain === 'mist' || weatherMain === 'fog') weatherScore = 70;

        // 风力评分
        let windScore = 100;
        if (windSpeed > 10) windScore = 30;
        else if (windSpeed > 6) windScore = 70;

        // 空气质量评分
        let aqiScore = 100;
        if (aqi > 200) aqiScore = 20;
        else if (aqi > 150) aqiScore = 50;
        else if (aqi > 100) aqiScore = 80;

        const totalScore = (tempScore + weatherScore + windScore + aqiScore) / 4;

        if (totalScore >= 90) {
            return {
                level: '极适宜',
                suggestion: '天气条件极佳，适合户外运动',
                activities: ['跑步', '骑行', '球类运动']
            };
        } else if (totalScore >= 75) {
            return {
                level: '适宜',
                suggestion: '天气条件良好，适合运动',
                activities: ['慢跑', '散步', '太极']
            };
        } else if (totalScore >= 60) {
            return {
                level: '较适宜',
                suggestion: '天气条件一般，适度运动',
                activities: ['室内运动', '轻度散步']
            };
        } else if (totalScore >= 40) {
            return {
                level: '不太适宜',
                suggestion: '天气条件较差，建议室内运动',
                activities: ['室内健身', '瑜伽']
            };
        } else {
            return {
                level: '不适宜',
                suggestion: '天气条件恶劣，不建议户外运动',
                activities: ['室内运动']
            };
        }
    }

    // 计算旅游指数
    calculateTravelIndex(temperature, weatherMain, aqi = 50) {
        // 基础评分
        let score = 100;

        // 温度影响
        if (temperature < 0 || temperature > 35) score -= 30;
        else if (temperature < 5 || temperature > 30) score -= 20;
        else if (temperature < 10 || temperature > 28) score -= 10;

        // 天气影响
        if (weatherMain === 'thunderstorm') score -= 40;
        else if (weatherMain === 'rain') score -= 25;
        else if (weatherMain === 'snow') score -= 20;
        else if (weatherMain === 'mist' || weatherMain === 'fog') score -= 15;

        // 空气质量影响
        if (aqi > 200) score -= 30;
        else if (aqi > 150) score -= 20;
        else if (aqi > 100) score -= 10;

        score = Math.max(0, score);

        if (score >= 90) {
            return {
                level: '极适宜',
                suggestion: '天气绝佳，是出游的好时机',
                tips: ['适合所有户外活动', '注意防晒']
            };
        } else if (score >= 75) {
            return {
                level: '适宜',
                suggestion: '天气良好，适合出游',
                tips: ['适宜大部分景点游览']
            };
        } else if (score >= 60) {
            return {
                level: '较适宜',
                suggestion: '天气一般，可选择性出游',
                tips: ['建议选择室内景点', '关注天气变化']
            };
        } else if (score >= 40) {
            return {
                level: '不太适宜',
                suggestion: '天气条件较差，出游需谨慎',
                tips: ['建议室内活动', '出行注意安全']
            };
        } else {
            return {
                level: '不适宜',
                suggestion: '天气恶劣，不建议出游',
                tips: ['建议取消户外活动', '注意安全']
            };
        }
    }

    // 获取所有指数
    getAllIndices(weatherData) {
        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;
        const weatherMain = weatherData.weather[0].main;
        const cloudiness = weatherData.clouds ? weatherData.clouds.all : 0;
        const aqi = 50; // 默认空气质量指数

        return {
            uv: {
                index: this.calculateUVIndex(weatherMain, cloudiness),
                level: this.getUVLevel(this.calculateUVIndex(weatherMain, cloudiness))
            },
            comfort: this.calculateComfortIndex(temp, humidity, windSpeed),
            dressing: this.calculateDressingIndex(temp, weatherMain),
            carWash: this.calculateCarWashIndex(weatherMain, weatherData.pop || 0, windSpeed),
            sport: this.calculateSportIndex(temp, weatherMain, windSpeed, aqi),
            travel: this.calculateTravelIndex(temp, weatherMain, aqi)
        };
    }

    // 获取紫外线级别
    getUVLevel(uvIndex) {
        if (uvIndex <= 2) return '弱';
        if (uvIndex <= 5) return '中等';
        if (uvIndex <= 7) return '强';
        if (uvIndex <= 10) return '很强';
        return '极强';
    }

    // 显示指数面板
    displayIndicesPanel(indicesData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="indices-panel">
                <h5><i class="fas fa-sun"></i> 生活指数</h5>
                <div class="indices-grid">
                    <div class="index-item">
                        <div class="index-icon"><i class="fas fa-tshirt"></i></div>
                        <div class="index-info">
                            <div class="index-name">穿衣指数</div>
                            <div class="index-value">${indicesData.dressing.level}</div>
                            <div class="index-suggestion">${indicesData.dressing.suggestion}</div>
                        </div>
                    </div>

                    <div class="index-item">
                        <div class="index-icon"><i class="fas fa-running"></i></div>
                        <div class="index-info">
                            <div class="index-name">运动指数</div>
                            <div class="index-value">${indicesData.sport.level}</div>
                            <div class="index-suggestion">${indicesData.sport.suggestion}</div>
                        </div>
                    </div>

                    <div class="index-item">
                        <div class="index-icon"><i class="fas fa-car"></i></div>
                        <div class="index-info">
                            <div class="index-name">洗车指数</div>
                            <div class="index-value">${indicesData.carWash.level}</div>
                            <div class="index-suggestion">${indicesData.carWash.suggestion}</div>
                        </div>
                    </div>

                    <div class="index-item">
                        <div class="index-icon"><i class="fas fa-plane"></i></div>
                        <div class="index-info">
                            <div class="index-name">旅游指数</div>
                            <div class="index-value">${indicesData.travel.level}</div>
                            <div class="index-suggestion">${indicesData.travel.suggestion}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherIndices;
}