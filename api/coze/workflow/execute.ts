import { VercelRequest, VercelResponse } from '@vercel/node';
import { CozeService } from '../../../backend/src/services/cozeService';

const cozeService = new CozeService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
