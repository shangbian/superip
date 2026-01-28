# 一站式社会化获客AI助手

> 基于扣子AI工作流的智能文案生成系统

## 📋 项目简介

本项目是一个完整的前后端分离架构的AI助手系统，集成了36个专业的智能体，涵盖短视频获客、客户培育、成交转化和招商赋能四大领域。

## 🎯 功能特点

- ✅ **36个专业智能体**：覆盖营销全流程
- ✅ **四大分类体系**：短视频获客矩阵、客户培育与信任构建、成交与裂变转化、线下活动与招商赋能
- ✅ **Markdown渲染**：完整支持Markdown格式输出
- ✅ **一键复制功能**：快速复制生成的内容
- ✅ **美观UI界面**：现代化渐变设计，流畅动画效果
- ✅ **完整日志系统**：便于调试和问题排查

## 📂 项目结构

```
羊智能体/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── server.ts       # 服务器入口
│   │   ├── routes/         # 路由
│   │   │   └── cozeRoutes.ts
│   │   ├── services/       # 业务逻辑
│   │   │   └── cozeService.ts
│   │   └── utils/          # 工具函数
│   │       └── logger.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── config.txt          # 配置文件（需重命名为.env）
├── frontend/               # 前端页面
│   ├── index.html
│   └── app.js
├── logs/                   # 日志目录
└── README.md
```

## 🚀 快速开始

### 1. 环境准备

确保已安装：
- Node.js (v18+)
- npm或yarn

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

将 `backend/config.txt` 重命名为 `backend/.env`：

```bash
cd backend
ren config.txt .env
```

或手动创建 `.env` 文件，内容：

```env
# Coze 工作流配置
COZE_TOKEN=你的Token
COZE_WORKFLOW_ID=7599232922009583626

# 服务器配置
PORT=3000
NODE_ENV=development

# CORS 配置
CORS_ORIGIN=http://localhost:8080
```

### 4. 启动后端服务

开发模式（推荐）：
```bash
cd backend
npm run dev
```

生产模式：
```bash
cd backend
npm run build
npm start
```

### 5. 启动前端页面

使用任意HTTP服务器（推荐Live Server）：

**方式一：使用Live Server（VS Code插件）**
1. 安装Live Server插件
2. 右键点击 `frontend/index.html`
3. 选择 "Open with Live Server"
4. 自动在浏览器打开 http://localhost:5500

**方式二：使用Python HTTP服务器**
```bash
cd frontend
python -m http.server 8080
```
然后访问 http://localhost:8080

**方式三：使用http-server（需要全局安装）**
```bash
npm install -g http-server
cd frontend
http-server -p 8080
```

## 📡 API接口说明

### 执行工作流

**接口**：`POST /api/coze/workflow/execute`

**请求参数**：
```json
{
  "choice": 1,                    // 智能体编号 (1-36)
  "userInput": "用户输入的内容"     // 用户提供的信息
}
```

**响应格式**：
```json
{
  "success": true,
  "data": {
    "output": "生成的内容（支持Markdown格式）",
    "raw": {}
  },
  "message": "工作流执行成功"
}
```

### 健康检查

**接口**：`GET /health`

**响应**：
```json
{
  "status": "healthy",
  "timestamp": "2026-01-26T08:00:00.000Z",
  "cozeToken": "已配置",
  "workflowId": "7599232922009583626"
}
```

### 测试连接

**接口**：`GET /api/coze/test`

**响应**：
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "token": "已配置",
    "workflowId": "7599232922009583626"
  },
  "message": "连接正常"
}
```

## 🎨 36个智能体列表

### 短视频获客矩阵（28个）
1. 七天选题智能体
2. A融入B智能体
3. 同行劲爆文案仿写智能体
4. 热点文案智能体
5. 自我反思与成长话题智能体
6-9. 大字报系列（4个）
10-13. 钩子口播系列（4个）
14. 短视频配套文案智能体
15. 稀缺观点生成智能体
16. 独特观点性感传播语生成智能体
17. 牛逼案例生成智能体
18-21. 起号系列（4个）
22-23. 直播系列（2个）
32-36. 专项系列（5个）

### 客户培育与信任构建（3个）
24. 万能朋友圈文案生成智能体
25. 群文案智能体
26. 公众号文案生成智能体

### 成交与裂变转化（2个）
27. 私域直播稿生成智能体
28. 私域直播业务员跟单话术智能体

### 线下活动与招商赋能（3个）
29. 招商会/销讲话术生成智能体（讲师用）
30. 招商流程生成智能体（运营用）
31. 招商会客户群同步投喂话术智能体（业务员用）

## 🔧 技术栈

### 后端
- Node.js + Express
- TypeScript
- Axios（HTTP客户端）
- dotenv（环境变量）
- cors（跨域处理）

### 前端
- HTML5 + CSS3 + JavaScript（原生）
- Marked.js（Markdown渲染）
- 现代化CSS动画

## 📊 日志查看

日志文件位于 `logs/` 目录：
- `info.log` - 常规信息日志
- `error.log` - 错误日志
- `warn.log` - 警告日志
- `debug.log` - 调试日志

## ❓ 常见问题

### 1. 后端无法启动

**问题**：提示找不到模块

**解决**：
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 2. CORS跨域错误

**问题**：前端调用API时提示跨域

**解决**：
1. 检查 `.env` 中的 `CORS_ORIGIN` 是否正确
2. 确保前端服务器端口与配置一致
3. 重启后端服务

### 3. API返回空内容

**问题**：工作流执行成功但前端显示空

**解决**：
1. 查看后端控制台日志
2. 检查扣子平台工作流是否正常运行
3. 确认Token是否有效
4. 查看 `logs/` 目录中的日志文件

### 4. Token认证失败

**问题**：提示 Token 无效

**解决**：
1. 检查 `.env` 文件中的 `COZE_TOKEN` 是否正确
2. 确认Token没有多余的空格或换行
3. 重新生成Token并更新配置

## 🔐 安全建议

⚠️ **重要提示**：
- 不要将 `.env` 文件提交到Git仓库
- 生产环境使用环境变量而非文件存储Token
- 定期轮换API Token
- 限制CORS来源，不要使用 `*`

## 📝 开发建议

### 添加新智能体

1. 在 `frontend/app.js` 的 `agentsData` 中添加新智能体数据
2. 确保 `id` 与扣子工作流中的 `choice` 参数对应
3. 刷新前端页面即可看到新智能体

### 修改样式

编辑 `frontend/index.html` 中的 `<style>` 标签

### 调试技巧

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签查看日志
3. 查看 Network 标签查看API请求
4. 后端日志查看 `logs/` 目录

## 📞 获取帮助

遇到问题时：
1. 查看后端控制台输出
2. 查看浏览器Console
3. 检查 `logs/` 目录日志
4. 参考建设指南和配置示例文档

## 🚀 部署说明

### GitHub Pages 部署

项目已配置 GitHub Actions 自动部署到 GitHub Pages：

1. 推送代码到 `main` 或 `master` 分支
2. GitHub Actions 会自动构建并部署
3. 在仓库 Settings > Pages 中启用 GitHub Pages
4. 访问 `https://<username>.github.io/superip/`

### Vercel 部署

项目已配置 `vercel.json`，支持一键部署到 Vercel：

1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. Vercel 会自动识别配置并部署
4. 配置环境变量（在 Vercel 项目设置中添加）：
   - `COZE_TOKEN`
   - `COZE_WORKFLOW_ID`
   - `PORT` (可选，默认 3000)
   - `CORS_ORIGIN` (可选)

### 环境变量配置

部署时需要配置以下环境变量：

```env
COZE_TOKEN=你的Token
COZE_WORKFLOW_ID=7599232922009583626
PORT=3000
CORS_ORIGIN=https://your-domain.com
```

## 📄 许可证

MIT License

---

**祝您使用愉快！** 🎉
