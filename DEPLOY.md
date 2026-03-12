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

## 🖥️ 火山服务器部署（世恒光）

已在世恒光火山服务器完成部署，端口已开通。

### 访问地址

| 方式 | 地址 |
|------|------|
| **域名（推荐）** | `http://markbot.shangbianai.com`（配置 HTTPS 后为 `https://markbot.shangbianai.com`） |
| **IP + 端口** | 前端 `http://115.190.64.160:8050`，后端 `http://115.190.64.160:3050`（健康检查：`/health`，API 测试：`/api/coze/test`） |

用户访问前端即可，前端通过 Nginx 将 `/api` 反向代理到后端 3050，无需单独访问后端端口。

### HTTPS 配置（markbot.shangbianai.com）

使用项目内脚本在服务器上安装 certbot 并为 **markbot.shangbianai.com** 申请 Let's Encrypt 证书。

1. **将脚本放到服务器并执行**

   ```bash
   # 本地：上传脚本到服务器
   scp deploy/setup-https.sh 世恒光火山服务器:/tmp/

   # SSH 登录服务器后执行（需设置 Let's Encrypt 通知邮箱）
   ssh 世恒光火山服务器
   sudo chmod +x /tmp/setup-https.sh
   export CERTBOT_EMAIL=your@email.com   # 替换为实际邮箱
   sudo -E /tmp/setup-https.sh
   ```

2. **脚本会完成**
   - 检查并确认 Nginx 配置存在
   - 安装 certbot 与 python3-certbot-nginx（若未安装）
   - 为 markbot.shangbianai.com 申请并部署证书
   - 自动配置 HTTP → HTTPS 重定向
   - certbot 续期定时任务由安装包自动配置，到期前会自动续期

3. **验证**
   - 访问 `https://markbot.shangbianai.com` 应返回 200，证书校验通过
   - 证书有效期约 90 天，到期前 certbot 会自动续期

### 服务器部署结构

- **项目目录**：`/opt/superip/`
- **前端静态**：`/opt/superip/frontend/`
- **后端**：`/opt/superip/backend/`，由 **pm2** 常驻（`PORT=3050`，进程名 `superip-backend`）
- **Nginx 配置**：`/etc/nginx/conf.d/superip-8050.conf`（监听 8050，根目录为前端，`/api/` 代理到 127.0.0.1:3050）

### 常用命令（SSH 到「世恒光火山服务器」后）

```bash
# 查看后端状态
pm2 status superip-backend
pm2 logs superip-backend

# 重启后端
cd /opt/superip/backend && pm2 restart superip-backend

# 更新代码后重新部署
# 本地执行：rsync 同步代码到 世恒光火山服务器:/opt/superip/
# 服务器执行：
cd /opt/superip/backend && npm install && npm run build && pm2 restart superip-backend
# 前端为静态文件，同步后无需重启
```

## 🖥️ 阿里云服务器部署（放羊哥综合营销智能体）

因域名限制，可将服务部署到阿里云服务器：前端 **8050**、后端 **3050**。

### 前置条件

1. **SSH 配置**：`~/.ssh/config` 中已添加 Host `aliyun`（脚本已包含示例，请取消注释并填写 `IdentityFile` 若使用密钥）。
2. **能免密登录**：终端执行 `ssh aliyun` 可登录（或先执行 `ssh-copy-id root@182.92.97.169`）。

### 一键部署

在项目根目录（`多智能体/`）下执行：

```bash
chmod +x deploy/deploy-aliyun.sh
./deploy/deploy-aliyun.sh
```

脚本会：同步前端/后端代码到 `/opt/superip`、在服务器安装 Node/Nginx/PM2（若未安装）、构建后端、创建/保留 `.env`、用 PM2 启动后端（3050）、部署 Nginx（8050 + `/api` 代理到 3050）。

### 访问地址

| 用途 | 地址 |
|------|------|
| **前端** | `http://182.92.97.169:8050` |
| **后端健康检查** | `http://182.92.97.169:3050/health` |
| **API（经 Nginx）** | `http://182.92.97.169:8050/api/coze/...` |

### 配置 Coze

首次部署后若未配置 Token，需登录服务器编辑环境变量并重启后端：

```bash
ssh aliyun
vim /opt/superip/backend/.env   # 填写 COZE_TOKEN、COZE_WORKFLOW_ID
cd /opt/superip/backend && pm2 restart superip-backend
```

### 常用命令（SSH 到 aliyun 后）

```bash
pm2 status superip-backend
pm2 logs superip-backend
cd /opt/superip/backend && npm install && npm run build && pm2 restart superip-backend
```

---

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
