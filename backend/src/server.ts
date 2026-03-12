import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cozeRoutes from './routes/cozeRoutes';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 配置 - 支持多个来源；开发环境下始终允许本地前端常用端口
const getCorsOrigin = () => {
    const corsOrigin = process.env.CORS_ORIGIN;
    const devOrigins = [
        'http://localhost:8085',
        'http://127.0.0.1:8085',
        'http://localhost:8080',
        'http://127.0.0.1:8080'
    ];
    let origins: string[] = [];
    if (corsOrigin && corsOrigin.trim()) {
        origins = corsOrigin.split(',').map(o => o.trim()).filter(Boolean);
    }
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
        devOrigins.forEach(o => { if (!origins.includes(o)) origins.push(o); });
    }
    if (origins.length === 0) return '*';
    return origins.length === 1 ? origins[0] : origins;
};

// 中间件
app.use(cors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// 路由
app.use('/api/coze', cozeRoutes);

// 健康检查
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        cozeToken: process.env.COZE_TOKEN ? '已配置' : '未配置',
        workflowId: process.env.COZE_WORKFLOW_ID || '未配置'
    });
});

// 404 处理
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// 错误处理
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 服务器启动成功！`);
    console.log(`📍 端口: ${PORT}`);
    console.log(`🌐 地址: http://localhost:${PORT}`);
    console.log(`🔑 Coze Token: ${process.env.COZE_TOKEN ? '已配置 ✓' : '未配置 ✗'}`);
    console.log(`📊 Workflow ID: ${process.env.COZE_WORKFLOW_ID || '未配置'}`);
    console.log(`========================================\n`);
});

export default app;
