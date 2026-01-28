import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class CozeService {
    private client: AxiosInstance;
    private token: string;
    private workflowId: string;

    constructor() {
        this.token = process.env.COZE_TOKEN || '';
        this.workflowId = process.env.COZE_WORKFLOW_ID || '';

        if (!this.token || !this.workflowId) {
            throw new Error('Coze Token 或 Workflow ID 未配置');
        }

        // 创建 axios 实例
        this.client = axios.create({
            baseURL: 'https://api.coze.cn/v1',
            timeout: 300000, // 5分钟超时（工作流可能需要较长时间执行）
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            }
        });

        // 请求拦截器
        this.client.interceptors.request.use(
            (config) => {
                console.log(`[Coze API] 请求: ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error('[Coze API] 请求错误:', error);
                return Promise.reject(error);
            }
        );

        // 响应拦截器
        this.client.interceptors.response.use(
            (response) => {
                console.log(`[Coze API] 响应状态: ${response.status}`);
                return response;
            },
            (error) => {
                console.error('[Coze API] 响应错误:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    /**
     * 执行工作流
     */
    async executeWorkflow(choice: number, userInput: string, topic?: string): Promise<any> {
        try {
            console.log('准备调用 Coze API...');
            console.log('参数:', { 
                choice, 
                userInput: userInput.substring(0, 100) + '...',
                topic: topic ? topic.substring(0, 100) + '...' : '未提供（将使用 userInput）'
            });

            // 构建parameters对象，包含工作流定义的所有必需输入参数
            // 根据正确的入参格式，需要以下参数：
            // - USER_INPUT (String): 用户输入
            // - choice (Integer): 智能体选择
            // - topic (String): 主题（取 USER_INPUT 的值）
            const parameters: any = {
                USER_INPUT: userInput.trim(),
                choice: Number(choice),  // 确保是整数类型
                topic: (topic && topic.trim()) ? topic.trim() : userInput.trim()  // topic 取 USER_INPUT 的值
            };
            
            // 确保 parameters 不为空对象（如果工作流需要参数但未提供，可能导致错误）
            console.log('构建的 parameters:', JSON.stringify(parameters, null, 2));
            console.log('parameters 包含的键:', Object.keys(parameters));
            console.log('parameters 值类型检查:', {
                USER_INPUT: typeof parameters.USER_INPUT,
                choice: typeof parameters.choice,
                topic: typeof parameters.topic
            });

            // 验证必需参数
            if (!this.workflowId) {
                throw new Error('Workflow ID 未配置，请检查环境变量 COZE_WORKFLOW_ID');
            }
            
            if (!userInput || !userInput.trim()) {
                throw new Error('userInput 不能为空');
            }
            
            // 构建请求体，确保包含所有必需参数
            const requestBody: any = {
                workflow_id: this.workflowId,
                parameters: parameters || {} // 确保 parameters 不为 undefined
            };
            
            // 添加 additional_messages（必需参数）
            // 注意：根据 Coze API 文档，additional_messages 中的消息必须包含 content 字段
            requestBody.additional_messages = [{
                content: userInput.trim(),
                content_type: 'text',
                role: 'user',
                type: 'question'
            }];
            
            // 验证请求体结构
            if (!requestBody.workflow_id) {
                throw new Error('workflow_id 不能为空');
            }
            if (!requestBody.additional_messages || requestBody.additional_messages.length === 0) {
                throw new Error('additional_messages 不能为空');
            }
            if (!requestBody.additional_messages[0].content) {
                throw new Error('additional_messages[0].content 不能为空');
            }
            
            console.log('========== Coze API 请求详情 ==========');
            console.log('Workflow ID:', this.workflowId);
            console.log('请求 URL:', 'https://api.coze.cn/v1/workflows/chat');
            console.log('请求方法:', 'POST');
            console.log('完整的请求体:', JSON.stringify(requestBody, null, 2));
            console.log('Parameters 对象:', JSON.stringify(parameters, null, 2));
            console.log('Parameters 键列表:', Object.keys(parameters));
            console.log('Parameters 值详情:', {
                'USER_INPUT': parameters.USER_INPUT ? `${parameters.USER_INPUT.substring(0, 50)}...` : 'undefined',
                'choice': parameters.choice,
                'topic': parameters.topic ? `${parameters.topic.substring(0, 50)}...` : 'undefined'
            });
            console.log('Additional Messages:', JSON.stringify(requestBody.additional_messages, null, 2));
            console.log('========================================');
            
            // 生成等效的 curl 命令用于调试
            const curlCommand = `curl -X POST 'https://api.coze.cn/v1/workflows/chat' \\
-H "Authorization: Bearer ${this.token.substring(0, 20)}..." \\
-H "Content-Type: application/json" \\
-d '${JSON.stringify(requestBody)}'`;
            console.log('等效的 curl 命令:', curlCommand);
            
            const response = await this.client.post('/workflows/chat', requestBody);

            console.log('Coze API 返回状态:', response.status);
            console.log('Coze API 响应头:', response.headers);
            console.log('Coze API Content-Type:', response.headers['content-type']);
            console.log('Coze API 返回数据类型:', typeof response.data);
            console.log('Coze API 返回数据键:', response.data ? Object.keys(response.data) : 'null');
            console.log('Coze API 返回数据（完整）:', JSON.stringify(response.data, null, 2));

            // 解析响应
            const parsedResult = this.parseResponse(response.data);
            console.log('解析后的结果:', {
                hasOutput: !!parsedResult.output,
                outputLength: parsedResult.output?.length || 0,
                outputPreview: parsedResult.output?.substring(0, 200) || 'empty'
            });
            return parsedResult;

        } catch (error: any) {
            console.error('========== Coze API 调用失败 ==========');
            console.error('错误类型:', error.name);
            console.error('错误消息:', error.message);
            
            // 检查是否是超时错误
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.message.includes('超时')) {
                console.error('工作流执行超时');
                throw new Error('工作流执行超时。工作流可能需要较长时间才能完成，请稍后重试。如果问题持续存在，请检查工作流配置或联系管理员。');
            }
            
            if (error.response) {
                console.error('响应状态:', error.response.status);
                console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
                console.error('响应头:', JSON.stringify(error.response.headers, null, 2));
                
                // 如果是 400 错误，可能是参数问题
                if (error.response.status === 400) {
                    console.error('400 错误 - 可能是参数问题');
                    console.error('请检查发送的 parameters 是否与工作流配置匹配');
                }
                
                // 检查响应中是否包含超时错误
                const responseData = error.response.data;
                if (responseData && (responseData.msg?.includes('timeout') || responseData.msg?.includes('超时') || responseData.message?.includes('timeout') || responseData.message?.includes('超时'))) {
                    throw new Error('工作流执行超时。工作流可能需要较长时间才能完成，请稍后重试。如果问题持续存在，请检查工作流配置或联系管理员。');
                }
                
                throw new Error(`API错误 (${error.response.status}): ${error.response.data?.msg || error.response.statusText || JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                console.error('请求对象:', error.request);
                throw new Error('网络错误: 无法连接到 Coze API');
            } else {
                console.error('错误详情:', error);
                throw new Error(`请求错误: ${error.message}`);
            }
        }
    }

    /**
     * 解析 Coze API 响应（支持SSE流式响应）
     */
    private parseResponse(data: any): any {
        console.log('开始解析响应数据...');
        console.log('响应数据类型:', typeof data);
        console.log('响应数据结构:', JSON.stringify(data, null, 2).substring(0, 1000));

        // 检查是否有错误码
        if (data.code !== undefined && data.code !== 0) {
            throw new Error(data.msg || data.message || '工作流执行失败');
        }

        let result: any = {
            output: '',
            raw: data
        };

        // 情况1: 如果data是字符串（可能是SSE流式响应）
        if (typeof data === 'string' || (data.data && typeof data.data === 'string')) {
            const sseData = typeof data === 'string' ? data : data.data;
            console.log('检测到SSE流式响应，开始解析...');
            
            // 先检查SSE流中是否包含错误
            if (sseData.includes('"code":4000') || sseData.includes('"code":') || sseData.includes('event: error')) {
                console.warn('SSE流中包含错误信息，尝试提取错误详情');
                const errorMatch = sseData.match(/"msg":\s*"([^"]+)"/);
                if (errorMatch) {
                    const errorMsg = errorMatch[1];
                    throw new Error(`Coze API错误: ${errorMsg}`);
                }
            }
            
            result.output = this.parseSSEResponse(sseData);
            
            if (result.output) {
                console.log('SSE解析成功，输出长度:', result.output.length);
                return result;
            }
        }

        // 情况2: 标准JSON响应 - 深度遍历查找可能的输出内容
        // 优先检查 data.data 结构
        if (data.data) {
            // data.data 是字符串
            if (typeof data.data === 'string') {
                result.output = data.data;
            }
            // data.data.output
            else if (data.data.output) {
                result.output = typeof data.data.output === 'string' ? data.data.output : JSON.stringify(data.data.output);
            }
            // data.data.result
            else if (data.data.result) {
                result.output = typeof data.data.result === 'string' ? data.data.result : JSON.stringify(data.data.result);
            }
            // data.data.messages 数组
            else if (data.data.messages && Array.isArray(data.data.messages)) {
                const lastMessage = data.data.messages[data.data.messages.length - 1];
                if (lastMessage) {
                    if (lastMessage.content) {
                        result.output = typeof lastMessage.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage.content);
                    } else if (lastMessage.text) {
                        result.output = lastMessage.text;
                    } else if (lastMessage.message) {
                        result.output = typeof lastMessage.message === 'string' ? lastMessage.message : JSON.stringify(lastMessage.message);
                    }
                }
            }
            // data.data.content
            else if (data.data.content) {
                result.output = typeof data.data.content === 'string' ? data.data.content : JSON.stringify(data.data.content);
            }
            // data.data.text
            else if (data.data.text) {
                result.output = data.data.text;
            }
            // data.data.answer
            else if (data.data.answer) {
                result.output = typeof data.data.answer === 'string' ? data.data.answer : JSON.stringify(data.data.answer);
            }
        }
        // 直接检查顶层属性
        else if (data.output) {
            result.output = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
        }
        else if (data.result) {
            result.output = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
        }
        else if (data.content) {
            result.output = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
        }
        else if (data.text) {
            result.output = data.text;
        }
        else if (data.answer) {
            result.output = typeof data.answer === 'string' ? data.answer : JSON.stringify(data.answer);
        }
        else if (data.messages && Array.isArray(data.messages)) {
            const lastMessage = data.messages[data.messages.length - 1];
            if (lastMessage) {
                if (lastMessage.content) {
                    result.output = typeof lastMessage.content === 'string' ? lastMessage.content : JSON.stringify(lastMessage.content);
                } else if (lastMessage.text) {
                    result.output = lastMessage.text;
                } else if (lastMessage.message) {
                    result.output = typeof lastMessage.message === 'string' ? lastMessage.message : JSON.stringify(lastMessage.message);
                }
            }
        }
        // 尝试从 workflow_output 或类似字段提取
        else if (data.workflow_output) {
            result.output = typeof data.workflow_output === 'string' ? data.workflow_output : JSON.stringify(data.workflow_output);
        }
        // 如果响应是一个对象，尝试提取所有字符串值
        else if (typeof data === 'object' && data !== null) {
            // 递归查找第一个非空字符串值
            const findStringValue = (obj: any, depth = 0): string => {
                if (depth > 5) return ''; // 防止无限递归
                if (typeof obj === 'string' && obj.trim().length > 0) {
                    return obj;
                }
                if (Array.isArray(obj)) {
                    for (const item of obj) {
                        const found = findStringValue(item, depth + 1);
                        if (found) return found;
                    }
                } else if (typeof obj === 'object' && obj !== null) {
                    for (const key in obj) {
                        if (key !== 'raw' && key !== 'code' && key !== 'msg' && key !== 'message') {
                            const found = findStringValue(obj[key], depth + 1);
                            if (found) return found;
                        }
                    }
                }
                return '';
            };
            result.output = findStringValue(data);
        }

        if (!result.output || result.output.trim() === '') {
            console.error('错误: 无法从响应中提取输出内容');
            console.error('完整响应数据:', JSON.stringify(data, null, 2));
            throw new Error('无法从API响应中提取内容，响应格式可能已变更。请查看后端控制台日志获取详细信息。');
        }

        console.log('解析完成，输出长度:', result.output.length);
        return result;
    }

    /**
     * 解析SSE（Server-Sent Events）流式响应
     */
    private parseSSEResponse(sseText: string): string {
        console.log('解析SSE流，原始长度:', sseText.length);
        console.log('SSE流前500字符:', sseText.substring(0, 500));
        
        // SSE格式: event: xxx\ndata: {...}\n\n
        const lines = sseText.split('\n');
        let content = '';
        let currentEvent = '';
        // 用于跟踪已添加的内容片段，避免重复
        const contentFragments = new Set<string>();
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // 检测事件类型
            if (line.startsWith('event:')) {
                currentEvent = line.substring(6).trim();
                continue;
            }
            
            // 检测数据行
            if (line.startsWith('data:')) {
                try {
                    const jsonStr = line.substring(5).trim(); // 去掉 "data:" 前缀
                    
                    // 跳过空数据
                    if (!jsonStr || jsonStr === '') continue;
                    
                    const messageData = JSON.parse(jsonStr);
                    console.log('解析SSE数据行，事件:', currentEvent, '数据类型:', typeof messageData, '消息类型:', messageData.msg_type || 'N/A');
                    
                    // 处理 msg_type 格式的消息（Coze API 的新格式）
                    if (messageData.msg_type) {
                        console.log('检测到 msg_type 消息:', messageData.msg_type);
                        
                        // 处理 generate_answer_finish 消息
                        if (messageData.msg_type === 'generate_answer_finish') {
                            try {
                                // data 字段可能是字符串化的 JSON
                                let finishData = messageData.data;
                                if (typeof finishData === 'string') {
                                    try {
                                        finishData = JSON.parse(finishData);
                                    } catch (e) {
                                        // 如果不是 JSON，直接使用字符串
                                    }
                                }
                                
                                // 提取 FinData
                                if (finishData && finishData.FinData && finishData.FinData.trim()) {
                                    const finData = finishData.FinData.trim();
                                    // 检查是否已添加过相同内容
                                    if (!contentFragments.has(finData)) {
                                        contentFragments.add(finData);
                                        if (content) {
                                            content += '\n\n' + finData;
                                        } else {
                                            content = finData;
                                        }
                                        console.log('从 generate_answer_finish 提取 FinData，当前总长度:', content.length);
                                    } else {
                                        console.log('跳过重复的 FinData 内容');
                                    }
                                } else {
                                    console.warn('generate_answer_finish 消息中 FinData 为空');
                                }
                            } catch (e) {
                                console.warn('解析 generate_answer_finish 数据失败:', e);
                            }
                        }
                        // 处理 empty result 消息
                        else if (messageData.msg_type === 'empty result') {
                            console.warn('收到 empty result 消息，可能工作流未返回内容');
                        }
                        // 处理其他 msg_type 消息
                        // 注意：不要将 msg_type 消息的 JSON 对象本身添加到内容中
                        // 只提取实际的内容数据，跳过技术性的消息格式
                        else if (messageData.data && typeof messageData.data === 'string' && messageData.data !== 'empty result') {
                            // 检查 data 是否是 JSON 字符串（技术性消息）
                            try {
                                const parsedData = JSON.parse(messageData.data);
                                // 如果是 JSON 对象，尝试提取 FinData 或其他内容字段
                                if (parsedData.FinData && parsedData.FinData.trim()) {
                                    const finData = parsedData.FinData.trim();
                                    // 检查是否已添加过相同内容
                                    if (!contentFragments.has(finData)) {
                                        contentFragments.add(finData);
                                        if (content) {
                                            content += '\n\n' + finData;
                                        } else {
                                            content = finData;
                                        }
                                        console.log('从 msg_type 消息的 data 中提取 FinData，当前总长度:', content.length);
                                    } else {
                                        console.log('跳过重复的 FinData 内容');
                                    }
                                }
                                // 如果是技术性消息（如 generate_answer_finish），不添加到内容中
                            } catch (e) {
                                // 如果不是 JSON，可能是实际内容，但也要小心处理
                                // 只有当 data 看起来像实际内容时才添加（不包含 msg_type 等关键词）
                                if (!messageData.data.includes('msg_type') && !messageData.data.includes('from_module')) {
                                    if (content) {
                                        content += '\n\n' + messageData.data;
                                    } else {
                                        content = messageData.data;
                                    }
                                    console.log('从 msg_type 消息提取 data，当前总长度:', content.length);
                                }
                            }
                        }
                    }
                    
                    // 处理错误事件 - 优先检查
                    if (currentEvent === 'error' || (messageData.code !== undefined && messageData.code !== 0)) {
                        const errorCode = messageData.code || messageData.last_error?.code || 4000;
                        const errorMsg = messageData.msg || messageData.last_error?.msg || messageData.message || '未知错误';
                        console.error('========== SSE流中包含错误 ==========');
                        console.error('事件类型:', currentEvent);
                        console.error('错误代码:', errorCode);
                        console.error('错误消息:', errorMsg);
                        console.error('完整错误数据:', JSON.stringify(messageData, null, 2));
                        console.error('====================================');
                        
                        // 如果是参数缺失错误，提供更详细的提示
                        if (errorMsg.includes('Missing required parameters') || errorMsg.includes('缺少必需参数')) {
                            throw new Error(`Coze API错误 (${errorCode}): ${errorMsg}\n\n提示：请检查工作流配置中的输入节点，确认所有必需参数都已通过 parameters 对象传递。请查看后端控制台日志中的 "构建的 parameters" 和 "完整的请求体" 来确认实际传递的参数。`);
                        } else {
                            throw new Error(`Coze API错误 (${errorCode}): ${errorMsg}`);
                        }
                    }
                    
                    // 检查 last_error 字段（即使 code 为 0）
                    if (messageData.last_error && messageData.last_error.code !== undefined && messageData.last_error.code !== 0) {
                        const errorCode = messageData.last_error.code;
                        const errorMsg = messageData.last_error.msg || '未知错误';
                        console.error('SSE数据中包含 last_error:', { code: errorCode, msg: errorMsg });
                        throw new Error(`Coze API错误 (${errorCode}): ${errorMsg}`);
                    }
                    
                    // 处理 conversation.message.completed 事件
                    if (currentEvent === 'conversation.message.completed') {
                        // 查找消息内容
                        if (messageData.message && messageData.message.content) {
                            const messageContent = typeof messageData.message.content === 'string'
                                ? messageData.message.content
                                : JSON.stringify(messageData.message.content);
                            if (messageContent) {
                                const cleanContent = messageContent.replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
                                // 检查是否已添加过相同内容
                                if (cleanContent && !contentFragments.has(cleanContent)) {
                                    contentFragments.add(cleanContent);
                                    if (content) {
                                        content += '\n\n' + cleanContent;
                                    } else {
                                        content = cleanContent;
                                    }
                                    console.log('从 conversation.message.completed 提取到内容，当前总长度:', content.length);
                                } else {
                                    console.log('跳过重复的 conversation.message.completed 内容');
                                }
                            }
                        }
                    }
                    
                    // 处理不同类型的消息
                    if (messageData.type === 'answer' || messageData.type === 'assistant') {
                        // 提取内容
                        let messageContent = '';
                        if (messageData.content) {
                            messageContent = typeof messageData.content === 'string' 
                                ? messageData.content 
                                : JSON.stringify(messageData.content);
                        } else if (messageData.text) {
                            messageContent = messageData.text;
                        } else if (messageData.message) {
                            messageContent = typeof messageData.message === 'string'
                                ? messageData.message
                                : JSON.stringify(messageData.message);
                        } else if (messageData.data && typeof messageData.data === 'string') {
                            messageContent = messageData.data;
                        }
                        
                        if (messageContent) {
                            // 处理转义的换行符
                            const cleanContent = messageContent.replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
                            // 检查是否已添加过相同内容
                            if (cleanContent && !contentFragments.has(cleanContent)) {
                                contentFragments.add(cleanContent);
                                if (content) {
                                    content += '\n\n' + cleanContent;
                                } else {
                                    content = cleanContent;
                                }
                                console.log('提取到内容，当前总长度:', content.length);
                            } else {
                                console.log('跳过重复的内容');
                            }
                        }
                    }
                    // 处理其他可能包含内容的事件
                    else if (messageData.content) {
                        // 检查是否是技术性消息，如果是则跳过
                        if (messageData.msg_type || (typeof messageData.content === 'object' && messageData.content !== null && 'msg_type' in messageData.content)) {
                            console.log('跳过技术性消息的 content 字段');
                            continue;
                        }
                        
                        const messageContent = typeof messageData.content === 'string'
                            ? messageData.content
                            : JSON.stringify(messageData.content);
                        
                        // 再次检查序列化后的内容是否包含技术性字段
                        if (messageContent && !messageContent.includes('"msg_type"') && !messageContent.includes('"from_module"')) {
                            const cleanContent = messageContent.replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
                            // 检查是否已添加过相同内容
                            if (cleanContent && !contentFragments.has(cleanContent)) {
                                contentFragments.add(cleanContent);
                                if (content) {
                                    content += '\n\n' + cleanContent;
                                } else {
                                    content = cleanContent;
                                }
                            } else {
                                console.log('跳过重复的 content');
                            }
                        } else {
                            console.log('跳过包含技术性字段的 content');
                        }
                    }
                    // 如果是字符串数据，检查是否是技术性消息，避免添加
                    else if (typeof messageData === 'string' && messageData.trim().length > 0) {
                        // 跳过包含 msg_type、from_module 等技术字段的 JSON 字符串
                        if (!messageData.includes('"msg_type"') && !messageData.includes('"from_module"') && !messageData.includes('"from_unit"')) {
                            if (content) {
                                content += '\n\n' + messageData;
                            } else {
                                content = messageData;
                            }
                        } else {
                            console.log('跳过技术性消息字符串:', messageData.substring(0, 100));
                        }
                    }
                } catch (e) {
                    console.warn('解析SSE data行失败:', e, '行内容:', line.substring(0, 100));
                    // 如果解析失败，尝试直接提取字符串内容
                    if (line.includes('"content"') || line.includes('"text"') || line.includes('"message"')) {
                        console.log('尝试从失败的行中提取内容...');
                    }
                }
            }
        }
        
        // 检查SSE流中是否包含错误（在返回前检查，无论是否有内容）
        if (sseText.includes('event: error') || (sseText.includes('"code":') && sseText.match(/"code":\s*[^0]/))) {
            console.error('SSE流中包含错误信息');
            // 尝试提取完整的错误信息
            const errorEventMatch = sseText.match(/event:\s*error\s*\ndata:\s*({[^}]+})/s);
            if (errorEventMatch) {
                try {
                    const errorData = JSON.parse(errorEventMatch[1]);
                    const errorCode = errorData.code || errorData.last_error?.code || 4000;
                    const errorMsg = errorData.msg || errorData.last_error?.msg || '缺少必需参数';
                    console.error('提取的错误信息:', { code: errorCode, msg: errorMsg });
                    throw new Error(`Coze API错误 (${errorCode}): ${errorMsg}`);
                } catch (parseError) {
                    // 如果JSON解析失败，使用正则提取
                    const msgMatch = sseText.match(/"msg":\s*"([^"]+)"/);
                    const codeMatch = sseText.match(/"code":\s*(\d+)/);
                    if (msgMatch) {
                        const errorCode = codeMatch ? codeMatch[1] : '4000';
                        throw new Error(`Coze API错误 (${errorCode}): ${msgMatch[1]}`);
                    }
                    throw new Error('Coze API返回错误，但无法解析错误详情。请查看后端日志获取完整SSE响应。');
                }
            } else {
                // 尝试直接提取错误消息
                const msgMatch = sseText.match(/"msg":\s*"([^"]+)"/);
                const codeMatch = sseText.match(/"code":\s*(\d+)/);
                if (msgMatch) {
                    const errorCode = codeMatch ? codeMatch[1] : '4000';
                    throw new Error(`Coze API错误 (${errorCode}): ${msgMatch[1]}`);
                }
            }
        }
        
        // 检查是否收到 empty result 消息
        if (sseText.includes('"msg_type":"empty result"') || sseText.includes('"FinData":""')) {
            console.warn('工作流返回空结果');
            if (!content || content.trim() === '') {
                throw new Error('工作流执行完成，但未返回任何内容。这可能是因为：\n1. 工作流配置问题\n2. 输入参数不正确\n3. 工作流内部逻辑未生成输出\n\n请检查工作流配置和输入参数。');
            }
        }
        
        // 清理内容：移除可能包含的技术性 JSON 消息
        if (content && content.trim()) {
            // 使用更强大的清理逻辑，支持嵌套 JSON 和转义字符
            // 匹配完整的 JSON 对象，包括嵌套的 data 字段
            const patterns = [
                // 匹配完整的 generate_answer_finish 消息（包括嵌套的 data JSON）
                /\{[^{}]*"msg_type"\s*:\s*"generate_answer_finish"[^{}]*\}[^}]*$/s,
                // 匹配包含 msg_type 和 from_module 的 JSON 对象
                /\{[^{}]*"msg_type"[^{}]*"from_module"[^{}]*\}[^}]*$/s,
                // 匹配包含 msg_type 的 JSON 对象（通用）
                /\{[^{}]*"msg_type"[^{}]*\}[^}]*$/s,
                // 匹配包含 from_module 的 JSON 对象
                /\{[^{}]*"from_module"[^{}]*\}[^}]*$/s,
                // 匹配包含 from_unit 的 JSON 对象
                /\{[^{}]*"from_unit"[^{}]*\}[^}]*$/s,
                // 匹配包含 finish_reason 和 FinData 的 JSON（可能在 data 字段中）
                /\{[^{}]*"finish_reason"[^{}]*"FinData"[^{}]*\}[^}]*$/s
            ];
            
            let previousContent = content;
            for (let i = 0; i < patterns.length; i++) {
                const pattern = patterns[i];
                content = content.replace(pattern, '').trim();
                if (content !== previousContent) {
                    console.log(`已移除匹配模式 ${i + 1} 的技术性消息`);
                    previousContent = content;
                }
            }
            
            // 如果还有残留，尝试更激进的清理：移除末尾任何以 { 开头且包含 msg_type 的内容
            if (content.includes('"msg_type"')) {
                // 找到最后一个 { 的位置
                const lastBraceIndex = content.lastIndexOf('{');
                if (lastBraceIndex !== -1) {
                    const afterBrace = content.substring(lastBraceIndex);
                    // 检查从最后一个 { 开始的内容是否是技术性消息
                    if (afterBrace.includes('"msg_type"') || afterBrace.includes('"from_module"')) {
                        content = content.substring(0, lastBraceIndex).trim();
                        console.log('已移除末尾包含技术性字段的内容');
                    }
                }
            }
            
            // 移除可能重复的 JSON 消息（如果整个内容就是 JSON 消息）
            if (content.trim().startsWith('{') && content.includes('"msg_type"')) {
                try {
                    const parsed = JSON.parse(content.trim());
                    // 如果是技术性消息，尝试提取实际内容
                    if (parsed.msg_type && parsed.data) {
                        if (typeof parsed.data === 'string') {
                            try {
                                const dataParsed = JSON.parse(parsed.data);
                                if (dataParsed.FinData && dataParsed.FinData.trim()) {
                                    content = dataParsed.FinData;
                                    console.log('从 JSON 消息中提取了 FinData');
                                } else {
                                    content = ''; // 如果没有实际内容，清空
                                }
                            } catch (e) {
                                // data 不是 JSON，可能是实际内容
                                if (!parsed.data.includes('msg_type')) {
                                    content = parsed.data;
                                } else {
                                    content = '';
                                }
                            }
                        }
                    }
                } catch (e) {
                    // 不是有效的 JSON，保持原样
                }
            }
            
            // 最终清理：移除末尾任何残留的 JSON 消息
            // 检查末尾是否有 JSON 格式的内容
            const lines = content.split('\n');
            const lastLine = lines[lines.length - 1];
            
            // 如果最后一行看起来像 JSON 消息，移除它
            if (lastLine && lastLine.trim().startsWith('{') && (lastLine.includes('"msg_type"') || lastLine.includes('"from_module"') || lastLine.includes('"from_unit"'))) {
                lines.pop();
                content = lines.join('\n').trim();
                console.log('已移除末尾的 JSON 消息行');
            }
            
            // 再次检查整个内容末尾是否有 JSON 消息
            const jsonAtEnd = content.match(/\{[^{}]*"msg_type"[^{}]*\}[^}]*$/s);
            if (jsonAtEnd) {
                content = content.substring(0, content.length - jsonAtEnd[0].length).trim();
                console.log('已移除末尾残留的 JSON 消息');
            }
            
            // 最终去重：移除重复的段落
            if (content && content.trim()) {
                // 按段落分割内容
                const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
                const uniqueParagraphs: string[] = [];
                const seenParagraphs = new Set<string>();
                
                for (const para of paragraphs) {
                    const trimmedPara = para.trim();
                    // 如果段落长度足够（至少10个字符）且未见过，则添加
                    if (trimmedPara.length >= 10 && !seenParagraphs.has(trimmedPara)) {
                        seenParagraphs.add(trimmedPara);
                        uniqueParagraphs.push(trimmedPara);
                    }
                }
                
                // 重新组合去重后的内容
                if (uniqueParagraphs.length > 0) {
                    content = uniqueParagraphs.join('\n\n');
                    console.log('去重前段落数:', paragraphs.length, '去重后段落数:', uniqueParagraphs.length);
                }
                
                console.log('SSE解析成功，提取内容长度:', content.length);
                console.log('内容预览（前200字符）:', content.substring(0, 200));
                console.log('内容预览（后200字符）:', content.length > 200 ? content.substring(content.length - 200) : content);
            } else {
                console.warn('清理后内容为空');
            }
        }
        
        if (content && content.trim()) {
            return content;
        } else {
            console.warn('SSE解析失败，未找到有效内容');
            console.warn('SSE流完整内容:', sseText);
            // 如果没有内容也没有明确的错误，抛出通用错误
            throw new Error('Coze API返回的SSE流中未找到有效内容。请检查工作流配置和参数是否正确。');
        }
    }

    /**
     * 健康检查
     */
    async healthCheck(): Promise<any> {
        return {
            status: 'ok',
            token: this.token ? '已配置' : '未配置',
            workflowId: this.workflowId || '未配置'
        };
    }
}
