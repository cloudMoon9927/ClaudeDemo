// 图表处理模块 - 用于天气数据的可视化

class WeatherCharts {
    constructor() {
        this.charts = new Map();
    }

    // 创建逐小时预报图表
    createHourlyForecastChart(canvasId, hourlyData, theme = 'light') {
        const ctx = document.getElementById(canvasId).getContext('2d');

        // 销毁已存在的图表
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }

        // 准备数据
        const labels = this.prepareHourlyLabels(hourlyData);
        const temperatureData = this.prepareTemperatureData(hourlyData);
        const precipitationData = this.preparePrecipitationData(hourlyData);
        const humidityData = this.prepareHumidityData(hourlyData);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '温度 (°C)',
                        data: temperatureData.values,
                        borderColor: '#ff7675',
                        backgroundColor: 'rgba(255, 118, 117, 0.1)',
                        fill: true,
                        yAxisID: 'y',
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6
                    },
                    {
                        label: '降水概率 (%)',
                        data: precipitationData.values,
                        borderColor: '#74b9ff',
                        backgroundColor: 'rgba(116, 185, 255, 0.1)',
                        fill: true,
                        yAxisID: 'y1',
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6
                    },
                    {
                        label: '湿度 (%)',
                        data: humidityData.values,
                        borderColor: '#00b894',
                        backgroundColor: 'rgba(0, 184, 148, 0.1)',
                        fill: false,
                        yAxisID: 'y2',
                        tension: 0.4,
                        pointRadius: 2,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            color: theme === 'dark' ? '#ddd' : '#333',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                        titleColor: theme === 'dark' ? '#ddd' : '#333',
                        bodyColor: theme === 'dark' ? '#ddd' : '#333',
                        borderColor: theme === 'dark' ? '#555' : '#ddd',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '时间',
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        ticks: {
                            color: theme === 'dark' ? '#ddd' : '#333',
                            maxTicksLimit: 12
                        },
                        grid: {
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: '温度 (°C)',
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        ticks: {
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        grid: {
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '降水 (%)',
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        ticks: {
                            color: theme === 'dark' ? '#ddd' : '#333',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            drawOnChartArea: false
                        },
                        min: 0,
                        max: 100
                    },
                    y2: {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        min: 0,
                        max: 100
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: theme === 'dark' ? '#fff' : '#333'
                    }
                }
            }
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // 创建温度趋势图表
    createTemperatureTrendChart(canvasId, forecastData, theme = 'light') {
        const ctx = document.getElementById(canvasId).getContext('2d');

        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }

        const labels = this.prepareDailyLabels(forecastData);
        const maxTemps = this.prepareMaxTemperatureData(forecastData);
        const minTemps = this.prepareMinTemperatureData(forecastData);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '最高温度',
                        data: maxTemps,
                        borderColor: '#e17055',
                        backgroundColor: 'rgba(225, 112, 85, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#e17055'
                    },
                    {
                        label: '最低温度',
                        data: minTemps,
                        borderColor: '#74b9ff',
                        backgroundColor: 'rgba(116, 185, 255, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#74b9ff'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: theme === 'dark' ? '#ddd' : '#333'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        grid: {
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '温度 (°C)',
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        ticks: {
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        grid: {
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // 创建降水概率图表
    createPrecipitationChart(canvasId, hourlyData, theme = 'light') {
        const ctx = document.getElementById(canvasId).getContext('2d');

        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }

        const labels = this.prepareHourlyLabels(hourlyData).slice(0, 12); // 只显示前12小时
        const precipitationData = this.preparePrecipitationData(hourlyData).values.slice(0, 12);

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '降水概率 (%)',
                    data: precipitationData,
                    backgroundColor: 'rgba(116, 185, 255, 0.7)',
                    borderColor: '#74b9ff',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        grid: {
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '降水概率 (%)',
                            color: theme === 'dark' ? '#ddd' : '#333'
                        },
                        ticks: {
                            color: theme === 'dark' ? '#ddd' : '#333',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    // 准备逐小时标签
    prepareHourlyLabels(hourlyData) {
        return hourlyData.map(item => {
            const date = new Date(item.dt * 1000);
            return date.getHours() + ':00';
        });
    }

    // 准备每日标签
    prepareDailyLabels(forecastData) {
        const dailyData = this.groupForecastByDay(forecastData);
        return dailyData.map(day => {
            const date = new Date(day.date);
            const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            return dayNames[date.getDay()];
        });
    }

    // 准备温度数据
    prepareTemperatureData(hourlyData) {
        return {
            values: hourlyData.map(item => Math.round(item.main.temp)),
            times: hourlyData.map(item => new Date(item.dt * 1000))
        };
    }

    // 准备最高温度数据
    prepareMaxTemperatureData(forecastData) {
        const dailyData = this.groupForecastByDay(forecastData);
        return dailyData.map(day => {
            const temps = day.items.map(item => item.main.temp_max);
            return Math.round(Math.max(...temps));
        });
    }

    // 准备最低温度数据
    prepareMinTemperatureData(forecastData) {
        const dailyData = this.groupForecastByDay(forecastData);
        return dailyData.map(day => {
            const temps = day.items.map(item => item.main.temp_min);
            return Math.round(Math.min(...temps));
        });
    }

    // 准备降水概率数据
    preparePrecipitationData(hourlyData) {
        return {
            values: hourlyData.map(item => Math.round(item.pop * 100)),
            times: hourlyData.map(item => new Date(item.dt * 1000))
        };
    }

    // 准备湿度数据
    prepareHumidityData(hourlyData) {
        return {
            values: hourlyData.map(item => item.main.humidity),
            times: hourlyData.map(item => new Date(item.dt * 1000))
        };
    }

    // 按天分组预报数据
    groupForecastByDay(forecastList) {
        const grouped = {};

        forecastList.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
        });

        return Object.entries(grouped)
            .map(([date, items]) => ({ date, items }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // 更新图表主题
    updateChartTheme(canvasId, theme) {
        if (this.charts.has(canvasId)) {
            const chart = this.charts.get(canvasId);
            // Chart.js 3.x 不支持直接更新主题
            // 需要重新创建图表
            return true;
        }
        return false;
    }

    // 销毁图表
    destroyChart(canvasId) {
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
            this.charts.delete(canvasId);
            return true;
        }
        return false;
    }

    // 销毁所有图表
    destroyAllCharts() {
        for (const [canvasId, chart] of this.charts) {
            chart.destroy();
        }
        this.charts.clear();
    }

    // 获取图表实例
    getChart(canvasId) {
        return this.charts.get(canvasId) || null;
    }

    // 调整图表大小
    resizeChart(canvasId) {
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).resize();
            return true;
        }
        return false;
    }
}

// 导出WeatherCharts类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherCharts;
}