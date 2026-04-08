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
        const msg = (error && error.message) ? String(error.message) : '工作流执行失败';
        const code = (error && error.code) ? String(error.code) : '';

        // 把可预期的外部依赖故障映射为更准确的 HTTP 状态，前端可按状态给出友好提示
        const isTimeout = msg.includes('超时') || msg.toLowerCase().includes('timeout') || code === 'ECONNABORTED';
        const isNetwork =
            msg.includes('无法连接 Coze API') ||
            msg.includes('网络错误') ||
            ['ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'].includes(code);

        const statusCode = isTimeout ? 504 : (isNetwork ? 502 : 500);

        res.status(statusCode).json({
            success: false,
            message: msg,
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
