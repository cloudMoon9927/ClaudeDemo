# 天气应用

一个现代化的天气应用，提供实时天气信息、多日预报、逐小时预报和城市管理功能。

## 功能特性

### 🌤️ 实时天气
- 自动定位并显示当前位置的天气
- 当前温度、体感温度、湿度、风速
- 天气现象图标显示
- 空气质量指数

### 📅 天气预报
- 未来7天天气预报
- 每日最高/最低温度
- 降水概率显示
- 天气状况描述

### 📊 逐小时预报
- 未来24小时详细预报
- 温度变化趋势图
- 降水概率图表
- 湿度变化曲线

### 🏙️ 城市管理
- 搜索全球城市
- 添加/删除常用城市
- 多城市快速切换
- 本地存储城市列表

### 🎨 用户体验
- 响应式设计，支持PC和移动端
- 暗色/亮色主题切换
- 流畅的动画效果
- 友好的错误提示

## 技术栈

### 前端
- **HTML5/CSS3/JavaScript** - 基础Web技术
- **Bootstrap 5** - 响应式UI框架
- **Chart.js** - 数据可视化图表
- **Font Awesome** - 图标库

### 后端
- **Node.js** - JavaScript运行环境
- **Express.js** - Web应用框架
- **Axios** - HTTP客户端
- **CORS** - 跨域资源共享

### 数据源
- **OpenWeatherMap API** - 天气数据服务

## 安装和运行

### 前提条件
- Node.js (v14.0.0或更高版本)
- npm (Node.js包管理器)

### 安装步骤

1. **克隆或下载项目**
   ```bash
   git clone <repository-url>
   cd weather
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置API密钥**
   - 访问 [OpenWeatherMap](https://openweathermap.org/api) 注册并获取免费API密钥
   - 复制 `.env.example` 文件为 `.env`
   - 在 `.env` 文件中填入你的API密钥：
     ```
     OPENWEATHER_API_KEY=你的API密钥
     ```

4. **启动服务器**
   ```bash
   npm start
   ```

5. **访问应用**
   打开浏览器访问 `http://localhost:3000`

### 开发模式
```bash
npm run dev
```

## 项目结构

```
weather/
├── public/                 # 前端静态文件
│   ├── index.html         # 主页面
│   ├── css/              # 样式文件
│   │   ├── style.css     # 主样式
│   │   └── weather-icons.css  # 天气图标样式
│   └── js/               # JavaScript文件
│       ├── main.js       # 主应用逻辑
│       ├── weather-api.js    # API处理
│       ├── location.js       # 位置服务
│       └── charts.js         # 图表处理
├── server/                # 后端服务器
│   └── server.js          # Express服务器
├── package.json          # 项目配置和依赖
├── .env.example          # 环境变量示例
├── README.md            # 项目文档
└── weather-app-plan.md   # 开发计划
```

## API接口

### 获取当前天气
```
GET /api/weather/current?lat={latitude}&lon={longitude}
```

### 获取天气预报
```
GET /api/weather/forecast?lat={latitude}&lon={longitude}
```

### 搜索城市
```
GET /api/weather/city/search?q={city_name}
```

### 通过坐标获取城市信息
```
GET /api/weather/city/coords?lat={latitude}&lon={longitude}
```

## 配置说明

### 环境变量
- `OPENWEATHER_API_KEY` - OpenWeatherMap API密钥（必需）
- `PORT` - 服务器端口（默认：3000）
- `NODE_ENV` - 环境模式（development/production）

### 浏览器兼容性
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 支持地理位置API的现代浏览器

## 常见问题

### Q: 如何获取OpenWeatherMap API密钥？
A: 访问 [OpenWeatherMap官网](https://openweathermap.org/api)，注册账号后即可获取免费的API密钥。

### Q: 应用无法获取位置信息？
A: 请确保浏览器已允许位置访问权限，或者手动添加城市查看天气。

### Q: 如何添加更多城市？
A: 点击右上角的"添加城市"按钮，搜索并选择你想要的城市。

### Q: 数据更新频率如何？
A: 天气数据根据OpenWeatherMap API的更新频率，通常为每小时更新一次。

## 开发指南

### 添加新的天气数据源
1. 在后端创建新的API路由
2. 在前端JavaScript中添加对应的数据处理方法
3. 更新用户界面以显示新的数据

### 自定义样式
1. 修改 `public/css/style.css` 文件
2. 可以添加新的CSS变量来自定义主题色彩
3. 使用Bootstrap 5的实用类进行快速样式调整

### 扩展功能
1. 添加新的JavaScript模块到 `public/js/` 目录
2. 在主应用文件中导入和使用新模块
3. 更新HTML以包含新的UI元素

## 部署

### 本地部署
按照安装和运行步骤在本地服务器上运行。

### 云端部署
- **Vercel** - 前端静态文件托管
- **Render/Heroku** - 后端API服务部署
- **Netlify** - 完整的全栈应用部署

## 许可证

MIT License - 详见 LICENSE 文件

## 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目！

## 致谢

- [OpenWeatherMap](https://openweathermap.org/) - 提供天气数据API
- [Bootstrap](https://getbootstrap.com/) - 优秀的UI框架
- [Chart.js](https://www.chartjs.org/) - 强大的图表库
- [Font Awesome](https://fontawesome.com/) - 丰富的图标库