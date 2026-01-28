# 部署指南

本项目支持两种部署方式：GitHub Pages（仅前端）和 Vercel（全栈）。

## 📦 GitHub Pages 部署

GitHub Pages 只能部署静态前端文件，后端 API 需要单独部署。

### 启用 GitHub Pages

1. 访问仓库：https://github.com/shangbian/superip
2. 进入 **Settings** > **Pages**
3. 在 **Source** 中选择：
   - **Branch**: `main` 或 `master`
   - **Folder**: `/ (root)` 或 `/frontend`
4. 点击 **Save**
5. 等待 GitHub Actions 自动部署（约 1-2 分钟）
6. 部署完成后，访问：`https://shangbian.github.io/superip/`

### 注意事项

⚠️ **重要**：GitHub Pages 只支持静态文件，后端 API 无法在 GitHub Pages 上运行。

**解决方案**：
1. 将后端部署到其他平台（如 Vercel、Railway、Render 等）
2. 修改前端 `app.js` 中的 `API_BASE_URL` 指向后端地址
3. 或者使用 Vercel 全栈部署（推荐）

### 修改前端 API 地址

如果后端部署在其他地方，需要修改 `frontend/app.js`：

```javascript
// 将本地地址改为实际的后端地址
const API_BASE_URL = 'https://your-backend-domain.com/api/coze';
```

## 🚀 Vercel 部署（推荐）

Vercel 支持全栈部署，可以同时部署前端和后端。

### 方式一：通过 Vercel 网站部署

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **Add New Project**
4. 导入仓库：`shangbian/superip`
5. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Output Directory**: `frontend`
6. 添加环境变量：
   ```
   COZE_TOKEN=你的Token
   COZE_WORKFLOW_ID=7599232922009583626
   PORT=3000
   CORS_ORIGIN=https://your-vercel-domain.vercel.app,http://localhost:8080
   ```
   
   **重要**：`CORS_ORIGIN` 支持多个域名，用逗号分隔。部署后会自动获取 Vercel 域名，建议配置为：
   ```
   CORS_ORIGIN=https://your-vercel-domain.vercel.app,https://*.vercel.app,http://localhost:8080
   ```
   或者使用通配符 `*`（不推荐生产环境）：
   ```
   CORS_ORIGIN=*
   ```
7. 点击 **Deploy**
8. 等待部署完成

### 方式二：通过 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

### Vercel 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `COZE_TOKEN` | Coze API Token | `pat_xxx...` |
| `COZE_WORKFLOW_ID` | 工作流 ID | `7599232922009583626` |
| `PORT` | 服务器端口（可选） | `3000` |
| `CORS_ORIGIN` | 允许的跨域来源（支持多个，用逗号分隔） | `https://your-domain.vercel.app,http://localhost:8080` |

## 🔧 配置说明

### 前端配置

前端代码在 `frontend/` 目录，主要文件：
- `index.html` - 主页面
- `app.js` - 应用逻辑

**API 地址配置**：
前端代码已自动检测环境：
- **本地开发**：自动使用 `http://localhost:3003/api/coze`
- **生产环境**：自动使用相对路径 `/api/coze`（前后端同域部署）

如果前后端分离部署，需要手动修改 `frontend/app.js` 中的 `getApiBaseUrl()` 函数。

### 后端配置

后端代码在 `backend/` 目录，使用 TypeScript + Express。

**环境变量**（`.env` 文件）：
```env
COZE_TOKEN=你的Token
COZE_WORKFLOW_ID=7599232922009583626
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## 📝 部署检查清单

### GitHub Pages
- [ ] 仓库已推送到 GitHub
- [ ] GitHub Actions 工作流已运行
- [ ] Settings > Pages 已启用
- [ ] 前端 API 地址已更新为实际后端地址
- [ ] 测试访问 GitHub Pages URL

### Vercel
- [ ] 项目已导入到 Vercel
- [ ] 环境变量已配置
- [ ] 构建成功
- [ ] 前端和后端都能正常访问
- [ ] API 接口测试通过

## 🐛 常见问题

### GitHub Pages 显示 404

1. 检查 GitHub Actions 是否成功运行
2. 确认 Pages 设置中的分支和文件夹正确
3. 等待几分钟后刷新页面

### Vercel 部署失败

1. 检查构建日志中的错误信息
2. 确认环境变量已正确配置
3. 检查 `vercel.json` 配置是否正确
4. 确认 Node.js 版本兼容（建议 18+）

### API 请求失败

1. 检查前端 API 地址是否正确
2. 确认后端已正确部署
3. 检查 CORS 配置
4. 查看浏览器控制台和网络请求

## 🔗 相关链接

- GitHub 仓库：https://github.com/shangbian/superip
- Vercel 文档：https://vercel.com/docs
- GitHub Pages 文档：https://docs.github.com/en/pages

## 📞 获取帮助

如果遇到部署问题：
1. 查看 GitHub Actions 日志
2. 查看 Vercel 部署日志
3. 检查环境变量配置
4. 参考项目 README.md
