import { Router, Request, Response } from 'express';
import { CozeService } from '../services/cozeService';

const router = Router();
const cozeService = new CozeService();

// 执行工作流
router.post('/workflow/execute', async (req: Request, res: Response) => {
    try {
        console.log('收到工作流执行请求:', JSON.stringify(req.body, null, 2));

        const { choice, userInput, topic, history, conversation_id: conversationId } = req.body;

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
        const historyList = Array.isArray(history) ? history : undefined;
        const convId = typeof conversationId === 'string' ? conversationId.trim() || undefined : undefined;
        const result = await cozeService.executeWorkflow(choice, userInput, topicValue, historyList, convId);

        res.json({
            success: true,
            data: {
                output: result.output,
                raw: result.raw,
                conversation_id: result.conversation_id
            },
            message: '工作流执行成功'
        });

    } catch (error: any) {
        console.error('工作流执行失败:', error);

        res.status(500).json({
            success: false,
            message: error.message || '工作流执行失败',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

// 测试连接
router.get('/test', async (req: Request, res: Response) => {
    try {
        const health = await cozeService.healthCheck();
        res.json({
            success: true,
            data: health,
            message: '连接正常'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || '连接测试失败'
        });
    }
});

export default router;
