# 故障排除指南

## 🔴 CORS 跨域错误

### 错误信息
```
Access to fetch at 'http://localhost:3003/api/coze/...' from origin 'https://xxx.vercel.app' 
has been blocked by CORS policy
```

### 问题原因
1. 前端部署在 Vercel，但 API 地址仍指向 `localhost`
2. 后端 CORS 配置只允许本地域名

### 解决方案

#### 方案一：Vercel 全栈部署（推荐）

1. **确保前后端都部署在 Vercel**
   - 前端：自动部署
   - 后端：通过 `vercel.json` 配置自动部署

2. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   CORS_ORIGIN=https://your-vercel-domain.vercel.app,https://*.vercel.app,http://localhost:8080
   ```
   
   或者使用通配符（开发环境）：
   ```
   CORS_ORIGIN=*
   ```

3. **重新部署**
   - 推送代码到 GitHub
   - Vercel 会自动重新部署

#### 方案二：前后端分离部署

如果后端部署在其他平台：

1. **修改前端 API 地址**
   编辑 `frontend/app.js`，修改 `getApiBaseUrl()` 函数：
   ```javascript
   const getApiBaseUrl = () => {
       if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
           return 'http://localhost:3003/api/coze';
       }
       // 改为实际的后端地址
       return 'https://your-backend-domain.com/api/coze';
   };
   ```

2. **配置后端 CORS**
   在后端环境变量中添加前端域名：
   ```
   CORS_ORIGIN=https://your-frontend-domain.vercel.app,http://localhost:8080
   ```

## 🔴 API 请求失败

### 错误信息
```
Failed to fetch
TypeError: Failed to fetch
```

### 可能原因

1. **后端服务未启动**
   - 检查后端是否正常运行
   - 查看后端日志

2. **API 地址错误**
   - 检查前端 `API_BASE_URL` 配置
   - 确认后端路由路径正确

3. **网络问题**
   - 检查防火墙设置
   - 确认端口未被占用

### 解决方案

1. **本地开发环境**
   ```bash
   # 启动后端
   cd backend
   npm run dev
   
   # 确认后端运行在 http://localhost:3003
   curl http://localhost:3003/health
   ```

2. **生产环境**
   - 检查 Vercel 部署日志
   - 确认环境变量已配置
   - 测试 API 端点：`https://your-domain.vercel.app/api/coze/test`

## 🔴 环境变量未生效

### 问题
后端无法读取环境变量，提示 "未配置"

### 解决方案

1. **本地开发**
   - 确认 `backend/.env` 文件存在
   - 检查文件格式（无多余空格）
   - 重启后端服务

2. **Vercel 部署**
   - 在 Vercel 项目设置中检查环境变量
   - 确认变量名拼写正确
   - 重新部署项目

## 🔴 构建失败

### Vercel 构建错误

1. **检查构建日志**
   - 查看 Vercel 部署日志
   - 确认错误信息

2. **常见问题**
   - Node.js 版本不兼容（需要 18+）
   - 依赖安装失败
   - TypeScript 编译错误

3. **解决方案**
   ```bash
   # 本地测试构建
   cd backend
   npm install
   npm run build
   
   # 如果本地构建成功，检查 vercel.json 配置
   ```

## 🔴 前端页面空白

### 可能原因

1. **JavaScript 错误**
   - 打开浏览器控制台查看错误
   - 检查 `app.js` 是否有语法错误

2. **资源加载失败**
   - 检查网络请求
   - 确认静态资源路径正确

3. **API 调用失败**
   - 检查 API 地址配置
   - 查看控制台网络请求

## 📝 调试技巧

### 1. 查看浏览器控制台
- 按 F12 打开开发者工具
- 查看 Console 标签的错误信息
- 查看 Network 标签的请求详情

### 2. 查看后端日志
- 本地：查看终端输出
- Vercel：查看部署日志和函数日志

### 3. 测试 API
```bash
# 健康检查
curl https://your-domain.vercel.app/health

# 测试 Coze 连接
curl https://your-domain.vercel.app/api/coze/test
```

### 4. 检查环境变量
```bash
# 本地
cat backend/.env

# Vercel
# 在项目设置 > Environment Variables 中查看
```

## 🆘 获取帮助

如果以上方案都无法解决问题：

1. 查看完整的错误日志
2. 检查 GitHub Issues
3. 提供以下信息：
   - 错误信息截图
   - 浏览器控制台日志
   - 后端日志
   - 部署环境（本地/Vercel）
   - 环境变量配置（隐藏敏感信息）
