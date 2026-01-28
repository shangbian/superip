import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
