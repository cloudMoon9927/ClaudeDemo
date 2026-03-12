// 地理位置处理模块

class LocationService {
    constructor() {
        this.defaultCity = {
            name: '北京',
            country: 'CN',
            lat: 39.9042,
            lon: 116.4074
        };
    }

    async getCurrentPosition(options = {}) {
        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000 // 10分钟
        };

        const finalOptions = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('浏览器不支持地理定位'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    });
                },
                (error) => {
                    let errorMessage;
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '用户拒绝了地理定位请求';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '位置信息不可用';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '获取位置信息超时';
                            break;
                        default:
                            errorMessage = '获取位置信息时发生未知错误';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                finalOptions
            );
        });
    }

    async watchPosition(callback, options = {}) {
        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000
        };

        const finalOptions = { ...defaultOptions, ...options };

        if (!navigator.geolocation) {
            throw new Error('浏览器不支持地理定位');
        }

        return navigator.geolocation.watchPosition(
            (position) => {
                callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
            },
            (error) => {
                console.error('位置监听失败:', error);
            },
            finalOptions
        );
    }

    clearWatch(watchId) {
        if (navigator.geolocation && watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
    }

    // 计算两点之间的距离（Haversine公式）
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // 地球半径（公里）
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return distance;
    }

    toRadians(degrees) {
        return degrees * (Math.PI/180);
    }

    // 格式化距离显示
    formatDistance(distance) {
        if (distance < 1) {
            return `${Math.round(distance * 1000)}米`;
        } else if (distance < 10) {
            return `${distance.toFixed(1)}公里`;
        } else {
            return `${Math.round(distance)}公里`;
        }
    }

    // 获取位置描述
    getLocationDescription(lat, lon) {
        // 这里可以集成反向地理编码服务
        // 暂时返回坐标信息
        return {
            latitude: lat.toFixed(4),
            longitude: lon.toFixed(4),
            description: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`
        };
    }

    // 检查位置权限状态
    async checkLocationPermission() {
        if (!navigator.permissions) {
            return 'unsupported';
        }

        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            return permission.state; // 'granted', 'denied', 或 'prompt'
        } catch (error) {
            console.error('检查位置权限失败:', error);
            return 'error';
        }
    }

    // 请求位置权限
    async requestLocationPermission() {
        try {
            const position = await this.getCurrentPosition({
                timeout: 5000,
                maximumAge: 0
            });
            return {
                success: true,
                position: position
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 获取默认城市信息
    getDefaultCity() {
        return this.defaultCity;
    }

    // 保存用户位置偏好
    saveLocationPreference(city) {
        localStorage.setItem('preferredCity', JSON.stringify(city));
    }

    // 获取用户位置偏好
    getLocationPreference() {
        const saved = localStorage.getItem('preferredCity');
        return saved ? JSON.parse(saved) : null;
    }

    // 清除位置偏好
    clearLocationPreference() {
        localStorage.removeItem('preferredCity');
    }

    // 位置错误处理
    handleLocationError(error, fallbackCallback) {
        console.error('位置服务错误:', error);

        // 显示友好的错误消息
        let userMessage;
        switch(error.code) {
            case error.PERMISSION_DENIED:
                userMessage = '请允许访问您的位置，以获得更准确的天气信息。';
                break;
            case error.POSITION_UNAVAILABLE:
                userMessage = '无法获取您的位置信息，请检查网络连接。';
                break;
            case error.TIMEOUT:
                userMessage = '获取位置信息超时，请稍后重试。';
                break;
            default:
                userMessage = '获取位置信息失败，请手动选择城市。';
                break;
        }

        // 调用回退函数
        if (fallbackCallback) {
            fallbackCallback(this.defaultCity);
        }

        return {
            success: false,
            message: userMessage,
            error: error
        };
    }
}

// 导出LocationService类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationService;
}