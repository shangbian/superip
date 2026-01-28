import { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Router } from 'express';
import { CozeService } from '../backend/src/services/cozeService';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();

// CORS 配置 - 支持多个来源
const getCorsOrigin = () => {
    const corsOrigin = process.env.CORS_ORIGIN;
    
    // 如果配置了多个来源（用逗号分隔）
    if (corsOrigin && corsOrigin.includes(',')) {
        return corsOrigin.split(',').map(origin => origin.trim());
    }
    
    // 单个来源或通配符
    return corsOrigin || '*';
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

// 创建路由
const cozeRouter = Router();
const cozeService = new CozeService();

// 执行工作流
cozeRouter.post('/workflow/execute', async (req: Request, res: Response) => {
    try {
        console.log('收到工作流执行请求:', JSON.stringify(req.body, null, 2));
        const { choice, userInput, topic } = req.body;
        
        if (!choice) {
            return res.status(400).json({ 
                success: false, 
                message: '缺少必填参数: choice' 
            });
        }
        
        if (!userInput) {
            return res.status(400).json({ 
                success: false, 
                message: '缺少必填参数: userInput' 
            });
        }
        
        const topicValue = topic || userInput;
        const result = await cozeService.executeWorkflow(choice, userInput, topicValue);
        
        res.json({ 
            success: true, 
            data: result 
        });
    } catch (error: any) {
        console.error('工作流执行失败:', error);
        res.status(500).json({
            success: false,
            message: error.message || '工作流执行失败',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 测试连接
cozeRouter.get('/test', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            status: 'ok',
            token: process.env.COZE_TOKEN ? '已配置' : '未配置',
            workflowId: process.env.COZE_WORKFLOW_ID || '未配置'
        },
        message: '连接正常'
    });
});

// 路由
app.use('/api/coze', cozeRouter);

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        cozeToken: process.env.COZE_TOKEN ? '已配置' : '未配置',
        workflowId: process.env.COZE_WORKFLOW_ID || '未配置'
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在',
        path: req.path
    });
});

// 错误处理
app.use((err: any, req: any, res: any, next: any) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Vercel serverless 函数导出
export default function handler(req: VercelRequest, res: VercelResponse) {
    // Vercel 会将 /api/coze/xxx 路由到这里
    // req.url 应该是完整的路径，如 /api/coze/workflow/execute
    // Express 路由 app.use('/api/coze', ...) 应该能正确匹配
    
    // 直接传递请求给 Express
    return app(req as any, res as any);
}
