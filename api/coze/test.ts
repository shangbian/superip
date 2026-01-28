import { VercelRequest, VercelResponse } from '@vercel/node';

// CORS 配置
function setCorsHeaders(res: VercelResponse) {
    const corsOrigin = process.env.CORS_ORIGIN || '*';
    const allowedOrigins = corsOrigin.includes(',') 
        ? corsOrigin.split(',').map(o => o.trim())
        : [corsOrigin];
    
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
    
    // 只允许 GET 请求
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    res.json({
        success: true,
        data: {
            status: 'ok',
            token: process.env.COZE_TOKEN ? '已配置' : '未配置',
            workflowId: process.env.COZE_WORKFLOW_ID || '未配置'
        },
        message: '连接正常'
    });
}
