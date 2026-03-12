# API配置指南

本指南将帮助你正确配置OpenWeatherMap API密钥，以便天气应用能够正常工作。

## 获取OpenWeatherMap API密钥

### 步骤1：注册OpenWeatherMap账户

1. 访问 [OpenWeatherMap官网](https://openweathermap.org/)
2. 点击右上角的 "Sign In" 按钮
3. 选择 "Create a new account"
4. 填写注册信息：
   - Email地址
   - 密码
   - 确认密码
   - 同意服务条款
5. 点击 "Create Account" 完成注册

### 步骤2：验证邮箱

1. 检查你的邮箱，找到来自OpenWeatherMap的验证邮件
2. 点击邮件中的验证链接
3. 验证成功后，登录到你的OpenWeatherMap账户

### 步骤3：获取API密钥

1. 登录后，点击右上角的账户头像
2. 选择 "My API keys"
3. 你会看到一个默认的API密钥（通常以默认名称显示）
4. 你也可以点击 "Generate key" 创建新的API密钥
5. 复制你的API密钥（一串字母和数字的组合）

## 配置API密钥到项目中

### 方法1：使用环境变量文件（推荐）

1. 在项目根目录，复制 `.env.example` 文件：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的API密钥：
   ```
   OPENWEATHER_API_KEY=你的API密钥在这里
   PORT=3000
   NODE_ENV=development
   ```

3. 保存文件

### 方法2：直接修改服务器代码（不推荐）

如果你不想使用环境变量，可以直接在 `server/server.js` 文件中修改：

```javascript
const OPENWEATHER_API_KEY = '你的API密钥在这里'; // 替换这行
```

⚠️ **注意**：这种方法不安全，不建议在生产环境中使用。

## 验证API密钥配置

### 步骤1：重启服务器

```bash
# 如果服务器正在运行，先停止它
# 然后重新启动
npm run dev
```

### 步骤2：检查控制台输出

如果配置正确，你应该看到：
```
天气应用服务器正在运行...
服务器地址: http://localhost:3000
健康检查: http://localhost:3000/api/health
```

如果没有API密钥或配置错误，你会看到警告信息。

### 步骤3：测试API连接

1. 打开浏览器访问：`http://localhost:3000/test-setup.html`
2. 点击 "测试服务器连接" 按钮
3. 如果显示成功，说明服务器正常工作

## 常见问题解决

### Q: 为什么我获取不到天气数据？

A: 可能的原因：
1. API密钥未正确配置
2. API密钥未激活（新注册的账户需要等待几分钟）
3. 网络连接问题
4. API调用频率超限（免费账户每分钟60次限制）

### Q: API密钥什么时候激活？

A: 新注册的OpenWeatherMap账户通常需要等待5-10分钟才能激活API密钥。如果等待后仍无法使用，请检查邮箱验证是否完成。

### Q: 免费账户有什么限制？

A: OpenWeatherMap免费账户的限制：
- 每分钟最多60次API调用
- 每小时最多1,000,000次调用
- 支持当前天气、5天预报、地理编码等功能
- 数据更新频率：每小时

### Q: 如何监控API使用情况？

A: 登录OpenWeatherMap账户后，你可以：
1. 访问 "API" 页面查看调用统计
2. 查看每分钟的调用次数
3. 监控剩余的免费调用额度

## API功能说明

### 当前天气API
```
GET /api/weather/current?lat={纬度}&lon={经度}
```
返回当前温度、湿度、风速、天气描述等信息。

### 天气预报API
```
GET /api/weather/forecast?lat={纬度}&lon={经度}
```
返回未来5天的3小时间隔天气预报。

### 城市搜索API
```
GET /api/weather/city/search?q={城市名称}
```
搜索城市并返回城市信息，包括经纬度。

### 反向地理编码API
```
GET /api/weather/city/coords?lat={纬度}&lon={经度}
```
通过经纬度获取城市名称和国家信息。

## 升级API计划

如果免费账户的限制不够用，可以考虑升级到付费计划：

- **Startup**：每分钟1,000次调用，$40/月
- **Developer**：每分钟10,000次调用，$170/月
- **Professional**：每分钟50,000次调用，$450/月

更多计划详情：https://openweathermap.org/price

## 安全建议

1. **不要将API密钥提交到版本控制系统**（如Git）
2. 使用环境变量来存储敏感信息
3. 定期更换API密钥
4. 监控API使用情况，避免超额费用
5. 在生产环境中使用API密钥白名单功能

## 故障排除

### 错误："Invalid API key"
- 检查API密钥是否正确复制
- 确认账户已激活
- 等待几分钟让密钥生效

### 错误："API key blocked"
- 可能超过了调用限制
- 等待限制重置或升级账户

### 错误："city not found"
- 检查城市名称拼写
- 尝试使用英文城市名
- 确认城市存在于OpenWeatherMap数据库中

## 联系支持

如果遇到问题，可以：
1. 查看OpenWeatherMap官方文档：https://openweathermap.org/api
2. 联系OpenWeatherMap支持：https://openweathermap.org/contact
3. 查看项目GitHub Issues寻求帮助

---

**祝你的天气应用开发顺利！** 🌤️