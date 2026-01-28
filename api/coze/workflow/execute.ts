import { VercelRequest, VercelResponse } from '@vercel/node';
import { CozeService } from '../../../backend/src/services/cozeService';

const cozeService = new CozeService();

// CORS 配置
function setCorsHeaders(res: VercelResponse) {
    const corsOrigin = process.env.CORS_ORIGIN || '*';
    const allowedOrigins = corsOrigin.includes(',') 
        ? corsOrigin.split(',').map(o => o.trim())
        : [corsOrigin];
    
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] === '*' ? '*' : allowedOrigins.join(','));
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        return res.status(200).end();
    }
    
    setCorsHeaders(res);
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

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
}
