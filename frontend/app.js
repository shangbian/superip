// API 配置 - 自动检测环境
// 开发环境：与页面同 host，后端端口 3003；生产环境：同域 /api/coze
const getApiBaseUrl = () => {
    var host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        return window.location.protocol + '//' + host + ':3003/api/coze';
    }
    return '/api/coze';
};

const API_BASE_URL = getApiBaseUrl();

// 所有智能体的原始数据
const allAgentsMap = {
    1: { id: 1, name: '7天选题', description: '一键产出每周选题清单，助力账号持续增长', fullDescription: '功能定义：输入账号定位，一键产出每周选题清单，保障内容高质量产出与账号增长。\n使用场景：每周内容策划时，快速产出兼具吸引力和商业价值的选题清单。\n核心价值：解决"拍什么"的难题，系统化保障内容质量与数量，维持账号活跃度与粉丝增长。', inputGuide: '请提供你的行业与核心产品信息（按以下格式），加上日期（可选）\n→ [行业类型]店/公司 + [核心产品/服务]\n例如：少儿编程培训（ToC教育服务）', welcomeMessage: '你好，我是【7天选题】智能体。你只需要输入日期，我能帮你生成一周的选题，比如：2025年11月8日。好的，你现在可以开始了。', suggestedPrompts: ['2026年3月17日', '帮我生成下周选题', '企业服务行业+商机平台'], functionDef: '自动生成一周的高效视频选题，涵盖吸引粉丝、建立人设和促进转化三类目标。' },
    2: { id: 2, name: '内容仿写', description: '套用爆款框架，一键创作风格融合文案', fullDescription: '功能定义：将客户喜欢的内容（A）转化为（B）爆款框架进行表达。\n使用场景：知识型、技术型、服务型企业创作科普类、教学类爆款短视频内容。\n核心价值：降低创作门槛，让小白也能做出爆款，同时解决抄袭举报问题。', inputGuide: '第1次先发A文案，核心主题或信息，第2次再发B文案，按照a的内容+ B的结构，创造出全新的文案。', welcomeMessage: '嗨，你好，我是【内容仿写】智能体。你要分两次把文本发给我。第1次先发A文案，核心主题或信息，第2次再发B文案，爆款结构的原文，好的，你现在可以开始了。', suggestedPrompts: ['生成行业内独特、前沿或反常识的观点与洞察'], functionDef: '将客户喜欢的内容（A）转化为（B）爆款框架进行表达。' },
    3: { id: 3, name: '爆款改写', description: '输入爆款文案，一键多风格改写翻新', fullDescription: '功能定义：对同行千万级大爆款文案或视频脚本进行多风格、多角度的高效重写与优化。\n使用场景：一条爆款视频需生成多个版本以测试效果，或旧内容需要翻新再次发布。\n核心价值：极大提升内容复用效率，实现"一鱼多吃"，持续挖掘单个选题的流量潜力。', inputGuide: '输入短视频文案，生成深度原创且风格高度相似的文案。', welcomeMessage: '嗨，你好，我是【爆款改写】智能体。你只需要把一条爆款文案发给我，我将为你生成深度原创且风格高度相似的新文案。好的，你现在可以开始了。', suggestedPrompts: ['帮我翻新一条旧视频文案', '我要改写同行爆款'], functionDef: '对同行千万级大爆款文案或视频脚本进行多风格、多角度的高效重写与优化。' },
    4: { id: 4, name: '热点二创', description: '输入热点事件，快速生成借势爆款脚本', fullDescription: '功能定义：输入实时热点关键词或扒皮文案，生成与人群相关的热点借势视频创意。\n使用场景：需要快速响应网络热点，获取短期流量爆发时，解决热点抓不住的问题。\n核心价值：抓住流量红利，低成本获取高曝光，为账号注入爆发性流量。', inputGuide: '输入热点事件相关信息，生成文案', welcomeMessage: '嗨，你好，我是【热点二创】智能体。你只需要输入热点事件的关键词或相关信息，我将为你生成与目标人群高度相关的二创文案。好的，你现在可以开始了。', suggestedPrompts: ['DeepSeek发布新模型引发关注', '帮我改写一条热点新闻', '小米汽车新款发布引爆全网'], functionDef: '输入实时热点关键词或扒皮文案，生成与人群相关的热点借势视频创意。' },
    5: { id: 5, name: '大字报（自我介绍）', description: '一键生成企业家成长感悟爆款文案', fullDescription: '功能定义：挖掘与目标用户息息相关的长期性话题，生成内容创作方向。\n使用场景：规划非热点类的常规视频内容，确保内容始终贴近用户兴趣。\n核心价值：保障账号基础流量，建立稳定的内容体系，强化用户粘性。', inputGuide: '输入1，直接生成【自我反思与成长】的爆款文案', welcomeMessage: '嗨，你好，我是【大字报（自我介绍）】智能体。你只需要输入数字 1，我将直接为你生成自我反思与成长主题的爆款大字报文案。好的，你现在可以开始了。', suggestedPrompts: ['1', '帮我生成情感共鸣类文案', '企业家自我成长故事'], functionDef: '用于生成短视频中自我介绍大字报内容文案与视觉提示。' },
    6: { id: 6, name: '大字报（行业类）', description: '行业视角大字报图文文案一键生成', fullDescription: '功能定义：专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。\n使用场景：制作信息密度高、观点冲击力强的图文视频或视频中的文字贴片。\n核心价值：在3秒内抓住用户注意力，提升视频完播率，适合传递核心观点和卖点。', inputGuide: '输入以下信息：\n核心行业/领域：(例如：美容美体)\n核心产品/服务名称或类型：(例如：纹绣技术)\n希望在首行突出的"形容词/核心卖点短语"：(请提供1-3个备选)\n产品/服务的主要优势、功能特点、能解决的用户痛点：(请列举至少3-5项)\n目标用户群体画像或主要适用场景：\n可选：希望加入的行动号召或相关话题标签：', welcomeMessage: '嗨，你好，我是【行业+形容词】智能体。你只需要提供行业/领域及【形容词/核心卖点】内容，我将生成适配短视频的图文贴片或大字报视频冲击力文案。好的，你现在可以开始了。', suggestedPrompts: ['教培行业+专业+家长群体', '美容美体行业+高端+爱美女性', '企业服务行业+精准+老板群体'], functionDef: '用于生成项目行业亮点的短视频视觉提示文案或大字报视频文案。' },
    7: { id: 7, name: '大字报（惊喜类）', description: '万万没想到惊喜风格大字报一键生成', fullDescription: '功能定义：专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。\n使用场景：制作信息密度高、观点冲击力强的图文视频或视频中的文字贴片。\n核心价值：在3秒内抓住用户注意力，提升视频完播率，适合传递核心观点和卖点。', inputGuide: '输入以下信息进行创作：\n核心体验/产品/服务：\n"万万没想到"的具体惊喜点/超预期效果：(这是文案的灵魂，请详细描述)\n希望引发的情感或用户反应：\n可选：目标用户群体希望触达的痛点：\n可选：希望加入的行动号召或相关话题标签：', welcomeMessage: '嗨，你好，我是【大字报（惊喜类）】智能体。你只需回复“1”，我就能生成天九相关的惊喜类文案；你也可以告诉我产品 / 体验的核心信息，以及它带来的超预期惊喜效果，我将为你生成订制爆款文案。现在就可以开始操作啦！', suggestedPrompts: ['1', '2', '帮我生成惊喜类大字报'], functionDef: '用于生成强烈惊喜开头，突出意想不到的效果的大字报或视频贴片文案。' },
    8: { id: 8, name: '大字报（发现类）', description: '发现新奇事物报道图文文案一键生成', fullDescription: '功能定义：专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。\n使用场景：制作信息密度高、观点冲击力强的图文视频或视频中的文字贴片。\n核心价值：在3秒内抓住用户注意力，提升视频完播率，适合传递核心观点和卖点。', inputGuide: '输入以下信息进行创作：\n具体地点名称（什么地方）：\n出现的新奇事物/现象/创新模式（什么东西）：\n"意外转折/影响"的具体内容：\n"用户/顾客反馈"的核心内容：\n"大众/网友呼吁/热议"的核心内容：', welcomeMessage: '嗨，你好，我是【大字报（发现类）】智能体。你只需要描述发现的具体地点、新奇事物，以及意外的转折或影响，我将为你生成爆款发现类大字报文案。好的，你现在可以开始了。', suggestedPrompts: ['北京出现了AI自习室', '上海发现无人驾驶洗车场'], functionDef: '用于生成【什么地方出现什么东西】大字报或视频贴片文案。' },
    9: { id: 9, name: '痛点共鸣', description: '企业家痛点与情感共鸣类爆款文案', fullDescription: '功能定义：专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。\n使用场景：制作信息密度高、观点冲击力强的图文视频或视频中的文字贴片。\n核心价值：在3秒内抓住用户注意力，提升视频完播率，适合传递核心观点和卖点。', inputGuide: '输入 1：直接生成企业家痛点与情感共鸣类爆款文案。\n如需更贴合你的情况，可补充：姓名、所在地、行业、从业年限、业务规模等信息后发送。', welcomeMessage: '嗨，你好，我是【痛点共鸣】智能体。你只需要输入“1”，我就能帮你生成戳中企业家痛点或引发深度共鸣的爆款文案。好的，你现在可以开始了。', suggestedPrompts: ['1', '我是教育行业做了15年', '企业家成长痛点'], functionDef: '挖掘与企业家成长相关话题，生成企业家痛点与情感共鸣类内容。' },
    10: { id: 10, name: '吸粉类口播（千万不要开头）', description: '输入主题生成「千万不要」口播脚本', fullDescription: '功能定义：生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。\n使用场景：为任何视频创作高效的开头与中间和结尾，完成4大数据指标。\n核心价值：提升视频的4个关键流量指标，是视频能否拿到海量客资的关键。', inputGuide: '把一条脚本内容发给我，改写成千万不要开头风格的吸粉口播文案。', welcomeMessage: '嗨，你好，我是【吸粉类口播（千万不要开头）】智能体。你只需要把一条脚本内容发给我，我将为你改写成千万不要开头风格的吸粉口播文案。好的，你现在可以开始了。', suggestedPrompts: ['千万不要在这个行业轻易入局', '帮我仿写一条口播文案'], functionDef: '用于生成「千万不要」句式钩子吸粉类型口播脚本。' },
    11: { id: 11, name: '吸粉口播（你敢信开头）', description: '输入主题生成「你敢相信吗」口播脚本', fullDescription: '功能定义：生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。\n使用场景：为任何视频创作高效的开头与中间和结尾，完成4大数据指标。\n核心价值：提升视频的4个关键流量指标，是视频能否拿到海量客资的关键。', inputGuide: '输入爆款文案进行改写创作：', welcomeMessage: '嗨，你好，我是【吸粉口播（你敢信开头）】智能体。你只需要把一条爆款文案发给我，我将为你改写成你敢信开头风格的吸粉口播文案。好的，你现在可以开始了。', suggestedPrompts: ['你敢信，我一条视频涨粉5万', '帮我生成一条口播开头'], functionDef: '用于生成「你敢相信吗」钩子吸粉类型口播脚本。' },
    12: { id: 12, name: '吸粉类口播脚本（你知道吗开头）', description: '输入主题生成「你知道有多牛」口播', fullDescription: '功能定义：生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。\n使用场景：为任何视频创作高效的开头与中间和结尾，完成4大数据指标。\n核心价值：提升视频的4个关键流量指标，是视频能否拿到海量客资的关键。', inputGuide: '输入爆款文案进行改写创作：', welcomeMessage: '嗨，你好，我是【吸粉类口播脚本（你知道吗开头）】智能体。你只需要把一条爆款文案发给我，我将为你改写成你知道吗开头风格的吸粉口播脚本。好的，你现在可以开始了。', suggestedPrompts: ['你知道企业合作有多牛吗', '帮我仿写一条口播'], functionDef: '用于生成「你知道什么有多牛吗」钩子吸粉类型脚本。' },
    13: { id: 13, name: '吸粉类口播脚本（马上大爆发开头）', description: '输入主题生成「马上大爆发」口播脚本', fullDescription: '功能定义：生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。\n使用场景：为任何视频创作高效的开头与中间和结尾，完成4大数据指标。\n核心价值：提升视频的4个关键流量指标，是视频能否拿到海量客资的关键。', inputGuide: '输入爆款文案进行改写创作：', welcomeMessage: '嗨，你好，我是【吸粉类口播脚本（马上大爆发开头）】智能体。你只需要把一条爆款文案发给我，我将为你改写成马上大爆发开头风格的吸粉口播脚本。好的，你现在可以开始了。', suggestedPrompts: ['企业服务行业马上迎来大爆发', '帮我仿写一条钩子口播'], functionDef: '用于生成「从现在开始，某产品/平台名马上迎来大爆发」类吸粉口播脚本。' },
    14: { id: 14, name: '视频标题', description: '输入文案一键生成标题与评论区引导语', fullDescription: '功能定义：自动生成短视频的标题、描述、评论区引导语等配套文案。\n使用场景：视频剪辑完成后，快速撰写能提升点击率、互动率和转化率的文案。\n核心价值：完善视频发布细节，提升算法推荐概率，引导用户完成点赞、评论、私信等动作。', inputGuide: '输入原文案', welcomeMessage: '嗨，你好，我是【视频标题】智能体。你只需要把视频脚本发给我，我将为你生成标题、描述、评论区引导语等9个配套文案。好的，你现在可以开始了。', suggestedPrompts: ['帮我生成5个爆款标题', '视频主题：企业转型'], functionDef: '自动生成短视频的标题、描述、评论区引导语等配套文案。' },
    15: { id: 15, name: '专业观点', description: '一键生成震撼洞察观点，打造专家IP形象', fullDescription: '功能定义：生成行业内独特、前沿或反常识的观点与洞察。\n使用场景：打造专家、创始人IP，需要输出震撼观点树立行业权威时。\n核心价值：通过信息差建立品牌心智，吸引高质量用户关注，实现"心智捕鱼"。', inputGuide: '回复 1：生成 10 种风格的专业观点供你选择。\n回复 2：按我提供的信息清单填写后，定制生成专属专业观点。', welcomeMessage: '嗨，你好，我是【专业观点】智能体。回复“1”，我将生成 10 种风格的专业观点供你选择；回复“2”，按要求填写我提供的信息清单，我将为你定制生成专属专业观点。现在回复对应数字，即刻开启创作！', suggestedPrompts: ['1', '2', '企业转型商业洞察'], functionDef: '生成行业内独特、前沿或反常识的观点与洞察。' },
    16: { id: 16, name: '观点金句', description: '将观点提炼成金句，强化内容记忆点', fullDescription: '功能定义：将复杂观点浓缩成一句朗朗上口、易于传播的金句或口号。\n使用场景：用于视频标题、结尾slogan、评论区互动，强化品牌记忆点。\n核心价值：降低传播成本，一句话让用户记住你，提升品牌影响力。', inputGuide: '输入一个观点或概念', welcomeMessage: '嗨，你好，我是【观点金句】智能体。你只需要输入一个观点或概念，我将为你生成一套高传播力的观点金句内容。好的，你现在可以开始了。', suggestedPrompts: ['1', '企业合作共赢的核心价值', '帮我把观点变成金句'], functionDef: '将复杂观点浓缩成一句朗朗上口、易于传播的金句或口号。' },
    17: { id: 17, name: '客户故事', description: '将客户案例转化为故事化视频，驱动转化', fullDescription: '功能定义：将客户成功案例转化为富有感染力的故事化叙述脚本。\n使用场景：创作客户见证、成果展示类视频，用事实说服潜在客户。\n核心价值：提供最强社会证明，有效打消用户疑虑，直接推动成交转化。', inputGuide: '输入1直接生成\n或用户提供一个真实案例的基本信息，包括：\n- 客户背景/行业\n- 初始问题/痛点\n- 采取的解决方案\n- 取得的具体成果\n- (可选)客户反馈或感言', welcomeMessage: '嗨，你好，我是【客户故事】智能体。你可以直接输入数字 1 生成示例，或提供客户背景、核心痛点和解决成果等真实案例信息。好的，你现在可以开始了。', suggestedPrompts: ['1', '2', '分享一个客户成功案例'], functionDef: '将客户成功案例转化为富有感染力的故事化叙述脚本。' },
    18: { id: 18, name: '账号定位', description: '输入个人信息快速生成账号名称与简介', fullDescription: '功能定义：为新账号快速生成奠定基础、明确调性的核心视频文案套装。\n使用场景：新账号冷启动阶段，快速发布首批定义账号价值的关键视频。\n核心价值：高效解决新账号"从0到1"的内容问题，快速完成账号定位传达。', inputGuide: '输入：你的网名或者姓名+你在哪里+你是做什么的+做了多少年+取得了什么成就等\n[您的行业]：\n[核心业务]：\n[最强成果]：\n[客户收益]：\n[行业情怀]：', welcomeMessage: '嗨，你好，我是【账号定位】智能体。你只需要提供网名或姓名、所在地区、从事行业、从业年限以及核心成就，我将为你生成专属账号定位文案。好的，你现在可以开始了。', suggestedPrompts: ['我是吕总+北京+企业服务+20年', '帮我优化账号名称和简介', '生成我的个人定位文案'], functionDef: '为新账号快速生成昵称和简介，明确调性的新账号定位内容。' },
    19: { id: 19, name: 'IP 故事', description: '生成故事化IP视频脚本，深化用户信任', fullDescription: '功能定义：为创始人/老板生成用于打造个人IP的故事化视频脚本。\n使用场景：创作账号置顶视频，讲述创业初心、品牌故事，建立信任。\n核心价值：以人为本，情感连接，将老板打造成品牌最佳代言人，深化信任。', inputGuide: '通过多轮对话信息完整后生成', welcomeMessage: '嗨，你好，我是【IP 故事】智能体。我会先向你提问，收集完整信息后，再为你生成专属IP故事脚本。回复“好的”，马上开始创作。', suggestedPrompts: ['你开始吧', '帮我创作逆袭故事文案', '帮我创作一个创业逆袭故事'], functionDef: '生成用于打造个人 IP 的故事化视频脚本。' },
    20: { id: 20, name: '产品故事', description: '生成产品差异化价值的种草视频脚本', fullDescription: '功能定义：生成突出产品核心价值与差异化的故事化视频脚本。\n使用场景：创作账号第二条置顶视频，清晰传达产品为何值得选择。\n核心价值：让产品自己说话，聚焦价值而非功能，激发用户购买欲望。', inputGuide: '回复“1”：直接生成天九平台案例故事示例。\n回复“好的”或其它说明：通过多轮对话收集产品信息后，生成打动人心的产品故事脚本。', welcomeMessage: '嗨，你好，我是【产品故事】智能体。回复“1”，我将直接生成天九平台案例故事；回复“好的”，我会先收集产品信息，为你生成打动人心的产品故事脚本。你现在可以开始操作啦！', suggestedPrompts: ['1', '好的', '帮我创作产品故事文案'], functionDef: '生成突出产品核心价值与差异化的故事化视频脚本。' },
    21: { id: 21, name: '联系引导', description: '生成引导用户咨询下单的行动号召脚本', fullDescription: '功能定义：生成引导用户主动咨询、私信或下单的行动号召型视频脚本。\n使用场景：创作账号第三条置顶视频，明确告知用户下一步行动路径。\n核心价值：完成临门一脚，将流量高效转化为客资，形成获客闭环。', inputGuide: '输入"姓名+行业"格式的信息', welcomeMessage: '嗨，你好，我是【联系引导】智能体。你只需要以姓名加行业的格式发给我，我将为你生成专业的联系引导类文案。好的，你现在可以开始了。', suggestedPrompts: ['吕总 企业服务', '张总 教育培训', '帮我生成引导联系的文案'], functionDef: '生成引导用户主动咨询、私信或下单的行动号召型视频脚本。' },
    22: { id: 22, name: '直播脚本', description: '一键生成分钟级直播话术，赋能转化', fullDescription: '功能定义：生成详细到分钟的单场直播话术脚本，包括互动、讲解、逼单环节。\n使用场景：直播前，为主播/嘉宾提供标准化、高转化的话术流程。\n核心价值：稳定直播质量，避免冷场或遗漏卖点，最大化直播期间的销售转化。', inputGuide: '用户需提供以下信息：\n直播主题/标题\n产品名称及类别\n产品主要功能/特点(3-5点)\n产品价格/活动信息\n目标受众群体\n直播预计时长(默认60分钟)\n(可选)品牌调性关键词\n(可选)主播个人特点', welcomeMessage: '嗨，你好，我是【直播脚本】智能体。你只需要提供直播主题、产品名称与特点、产品价格以及目标受众等信息，我将为你生成完整的直播脚本。好的，你现在可以开始了。', suggestedPrompts: ['1', '直播主题：企业转型分享', '帮我生成60分钟直播脚本'], functionDef: '生成详细到分钟的单场直播话术脚本，包括互动、讲解、逼单环节。' },
    23: { id: 23, name: '直播预热', description: '一键生成直播预告与推广引流文案', fullDescription: '功能定义：生成用于直播预告和直播付费推广的视频文案与素材创意。\n使用场景：直播开始前，制作引流视频，为直播间预热和拉流。\n核心价值：提升直播间的初始流量，解决"无人观看"的问题，放大直播效果。', inputGuide: '用户需提供以下基本信息：\n- 直播主题/标题\n- 目标客户群体(年龄、性别、兴趣等)\n- 直播时间\n- 直播主要内容/卖点(3-5点)\n- (可选)主播特点/风格\n- (可选)预期直播氛围\n- (可选)平台选择(抖音/视频号)', welcomeMessage: '嗨，你好，我是【直播预热】智能体。你只需要提供直播主题、时间、目标人群和核心卖点等基本信息，我将为你生成直播预热系列文案。好的，你现在可以开始了。', suggestedPrompts: ['直播主题：企业转型专场', '帮我生成直播预热素材'], functionDef: '生成用于直播预告和引流推广的视频文案与素材创意。' },
    24: { id: 24, name: '朋友圈文案', description: '一键生成朋友圈营销文案，经营私域', fullDescription: '功能定义：生成适用于多种营销目的（人设打造、产品宣发、活动预热）的朋友圈文案。\n使用场景：每日经营微信朋友圈，持续输出价值内容，维护客户关系。\n核心价值：高效经营私域阵地，潜移默化地影响客户决策，提升品牌好感度。', inputGuide: '1. 自由输入模式：输入任意事件/感悟，自动生成高质量朋友圈\n2. 数字指令模式：输入数字调用结构化问答模板（默认含6大场景）\n   输入 1 → 生活圈模板（展现真实自我）\n   输入 2 → 价值圈模板（输出干货观点）\n   输入 3 → 产品圈模板（发布产品/活动）\n   输入 4 → 证言圈模板（展示客户好评）\n   输入 5 → 交付圈模板（呈现服务过程）\n   输入 6 → 成交圈模板（促进行动转化）\n   输入 0 → 查看所有模板指令', welcomeMessage: '嗨，你好，我是【朋友圈文案】智能体。你可以自由输入任意事件或感悟，也可以输入数字（1-6）调用对应场景模板，我将为你生成高质量朋友圈文案。好的，你现在可以开始了。', suggestedPrompts: ['今天拜访了一位老客户', '帮我写一条产品推广朋友圈'], functionDef: '生成适用于多种营销目的（人设打造、产品宣发、活动预热）的朋友圈文案。' },
    25: { id: 25, name: '私域话术', description: '按客户意向度一键生成精准私域话术', fullDescription: '功能定义：针对不同意向度的客户，生成精准的1对1沟通话术或社群发言内容。\n使用场景：对微信好友进行标签分类后，进行差异化的精准内容触达和互动。\n核心价值：实现"千人千面"的精准培育，在不同阶段提供最合适的内容，大幅提升转化率与复购率。', inputGuide: '你只需要告诉我，你的目标人群级别1-5号：\n级别1（已成交）：行动阶段，高成熟度。\n级别2（2年内参加活动未成交）：决策阶段，中高成熟度。\n级别3（5年内成交但最近2年未成交）：兴趣或决策阶段，但成熟度可能下降。\n级别4（线上关注有行为）：兴趣阶段，中低成熟度。\n级别5（仅有联系方式）：认知阶段，低成熟度。\n\n产品/服务类别， 核心卖点(3-5点)， 目标客户特征(年龄、职业、痛点等)。\n沟通场景(1对1聊天/社群互动)', welcomeMessage: '嗨，你好，我是【私域话术】智能体。你只需要告诉我目标人群的成熟度级别（1-5号），我将为你生成针对性的私域跟进话术。好的，你现在可以开始了。', suggestedPrompts: ['级别2+企业服务+转型需求', '级别1+企业服务+成交后复购维护', '级别4+企业服务+激活线上关注用户'], functionDef: '针对不同意向度（如新添加、初步了解、深度兴趣、即将成交、已成交）的客户，生成精准的 1 对 1 沟通话术或社群发言内容。' },
    26: { id: 26, name: '批量文章', description: '一键生成公众号知乎深度长文内容', fullDescription: '功能定义：生成深度长文内容，适用于公众号，知乎等平台。\n使用场景：需要输出深度内容，建立专业权威，培育高价值用户。\n核心价值：以深度内容建立品牌壁垒，吸引和沉淀高质量用户，完成心智占领。', inputGuide: '用户需提供以下基本信息：\n- 文章主题/核心概念\n- (可选)目标受众群体\n- (可选)行业/领域\n- (可选)深度方向指引\n- (可选)品牌定位/调性\n- (可选)期望突出的专业角度', welcomeMessage: '嗨，你好，我是【批量文章】智能体。你只需要提供文章主题或核心概念，我将为你批量生成适用于公众号、知乎等平台的高质量深度长文。好的，你现在可以开始了。', suggestedPrompts: ['企业转型的5大误区', '如何打造企业第二增长曲线'], functionDef: '生成深度长文内容，适用于公众号、知乎等平台。' },
    27: { id: 27, name: '私域直播脚本', description: '一键生成私域专场直播完整话术脚本', fullDescription: '功能定义：生成详细到分钟的单场直播话术脚本，包括互动、讲解、逼单环节。\n使用场景：直播前，为主播/嘉宾提供标准化、高转化的话术流程。\n核心价值：稳定直播质量，避免冷场或遗漏卖点，最大化直播期间的销售转化。', inputGuide: '用户需提供以下基本信息：\n- 直播主题/产品名称\n- 直播目标(知识分享/产品介绍/问题解决/直接成交)\n- 目标受众特征(人群画像、痛点、需求)\n- 产品/服务核心卖点(3-5点)\n- 价格/活动方案\n- (可选)常见疑虑/反对点\n- (可选)直播预计时长(默认60分钟)\n- (可选)主播风格/特点', welcomeMessage: '嗨，你好，我是【私域直播脚本】智能体。你只需要提供直播主题、直播目标和目标受众等基本信息，我将为你生成私域专用直播脚本。好的，你现在可以开始了。', suggestedPrompts: ['主题：企业合作模式专场', '帮我生成90分钟私域直播稿'], functionDef: '生成适用于私域进行的专场直播 / 沙龙分享话术脚本。' },
    28: { id: 28, name: '直播跟单话术', description: '一键生成业务员跟单互动话术库', fullDescription: '功能定义：生成私域直播过程中，业务员在群内互动、答疑、烘托气氛、实时跟单的话术。\n使用场景：私域直播中，配合主播进行氛围营造和促单，应对客户各种问题。\n核心价值：形成团队协作，多对一服务，营造抢购氛围，提升直播成交率。', inputGuide: '用户需提供以下基本信息：\n- 直播主题/产品名称\n- 产品核心卖点(3-5点)\n- 直播特殊活动/优惠\n- 产品价格区间\n- 目标客户特征\n- (可选)主要竞品/替代方案\n- (可选)常见问题/顾虑\n- (可选)业务员人数\n- (可选)主播风格特点', welcomeMessage: '嗨，你好，我是【直播跟单话术】智能体。你只需要提供直播产品名称、核心卖点和优惠活动等信息，我将为你生成一套完整的直播跟单话术。好的，你现在可以开始了。', suggestedPrompts: ['直播主题：企业资源共享', '帮我生成跟单话术库'], functionDef: '生成私域直播过程中，业务员在群内互动、答疑、烘托气氛、实时跟单的话术。' },
    29: { id: 29, name: '大会销讲话术', description: '一键生成有感染力的招商演讲稿', fullDescription: '功能定义：为会议主讲人生成结构完整、富有感染力的招商演讲或产品发布稿。\n使用场景：筹备招商会、产品发布会、大型培训会等活动的讲师讲稿。\n核心价值：确保会议核心内容专业、流畅，有效影响听众决策，提升现场氛围。', inputGuide: '用户需提供以下基本信息：\n- 会议主题或产品名称\n- 目标受众(身份、背景、需求)\n- 核心卖点(3-5点)\n- 合作模式/价格方案\n- 演讲时长(默认45-90分钟)\n- (可选)行业背景/市场现状\n- (可选)讲师背景/风格偏好\n- (可选)预期达成目标\n- (可选)常见抵触点/顾虑', welcomeMessage: '嗨，你好，我是【大会销讲话术】智能体。你只需要提供会议主题、目标受众和核心卖点等基本信息，我将为你生成大会专用销讲话术。好的，你现在可以开始了。', suggestedPrompts: ['招商会：企业转型专场', '帮我生成60分钟演讲稿'], functionDef: '为会议主讲人生成结构完整、富有感染力的招商演讲或产品发布稿。' },
    30: { id: 30, name: '会议流程策划', description: '一键生成会议全流程执行方案', fullDescription: '功能定义：生成会议全流程执行方案，包括会前、会中、会后各环节的运营细节。\n使用场景：会议总策划人员统筹安排会议全流程执行工作。\n核心价值：确保会议井井有条，环节之间无缝衔接，提供卓越的参会体验。', inputGuide: '用户需提供以下基本信息：\n- 会议主题/招商项目名称\n- 会议规模(预计参会人数)\n- 会议时长与形式(线上/线下/混合)\n- 目标受众群体\n- 预期招商目标\n- (可选)会议地点/平台\n- (可选)主讲人信息\n- (可选)特殊要求或环节\n- (可选)预算范围', welcomeMessage: '嗨，你好，我是【会议流程策划】智能体。你只需要提供会议主题、规模、时长与形式等基本信息，我将为你生成完整的会议流程策划方案。好的，你现在可以开始了。', suggestedPrompts: ['100人线下招商会，企业转型主题，半天', '帮我策划一场招商会流程'], functionDef: '生成会议全流程执行方案，包括会前、会中、会后各环节的运营细节。' },
    31: { id: 31, name: '会销客户沟通话术', description: '生成会议期间客户群同步投喂话术', fullDescription: '功能定义：生成会议期间，业务员在客户群内同步内容、互动、答疑、促单的话术。\n使用场景：线下会议期间，在线上客户群内进行同步运营，强化现场氛围。\n核心价值：线上线下联动，放大会议影响力，覆盖更多客户，提升整体签约率。', inputGuide: '用户需提供以下基本信息：\n- 会议主题/招商项目名称\n- 会议流程与时间安排\n- 主讲核心内容要点(3-5点)\n- 合作模式/产品核心卖点\n- 目标客户群体特征\n- (可选)现场特殊活动/优惠\n- (可选)群内成员构成特点\n- (可选)常见问题与顾虑\n- (可选)群投喂节奏偏好', welcomeMessage: '嗨，你好，我是【会销客户沟通话术】智能体。你只需要提供会议主题、流程安排和核心内容要点等基本信息，我将为你生成一套针对客户的会销沟通话术。好的，你现在可以开始了。', suggestedPrompts: ['企业转型招商会，目标当场成交', '帮我生成社群投喂话术'], functionDef: '生成会议期间，业务员在客户群内同步内容、互动、答疑、促单的话术。' },
    32: { id: 32, name: '个人IP起号视频文案（教育创业者）', description: '为教育创业者定制个人IP起号文案', fullDescription: '功能定义：为教育创业者生成个人IP起号视频文案。', inputGuide: '基本信息：\n- 身份定位：\n- 转变历程：\n- 时间跨度：\n- 核心成果：', welcomeMessage: '你好，我是【个人IP起号视频文案（教育创业者）】智能体。请告诉我你的身份定位、转变历程、时间跨度、核心成果，我将为你生成专属起号视频文案。', suggestedPrompts: ['身份：教育培训创始人，从传统教培转型AI教育，历时3年', '我是从传统教培转型AI', '帮我生成起号文案'] },
    33: { id: 33, name: '个人IP起号视频文案（商机共享从业者）', description: '为商机共享从业者生成起号视频文案', fullDescription: '功能定义：为商机共享行业的资深从业者生成个人IP起号视频文案。', inputGuide: '基本信息：\n- 身份定位：\n- 转变历程：\n- 时间跨度：\n- 核心成果：', welcomeMessage: '你好，我是【个人IP起号视频文案（商机共享从业者）】智能体。请告诉我你的身份定位、转变历程、时间跨度、核心成果，我将为你生成专属起号视频文案。', suggestedPrompts: ['身份：商机共享顾问，从传统行业转型，服务500+企业', '我从传统行业转向商机共享', '帮我生成起号文案'] },
    34: { id: 34, name: '大会邀约', description: '定制高吸引力大会邀约短视频脚本', fullDescription: '功能定义：自动生成大会邀约短视频文案。', inputGuide: '请提供活动信息，时间，地点，主题，亮点，我将先为您生成5条完整文案供确认', welcomeMessage: '嗨，你好，我是【大会邀约】智能体。请提供活动的时间、地点、主题和亮点，我将为你定制5条高吸引力短视频邀约脚本。好的，你现在可以开始了。', suggestedPrompts: ['大会主题：企业创新转型峰会', '帮我生成5条邀约文案'], functionDef: '输入大会核心信息，定制5条高吸引力短视频脚本，赋能大会引流邀约' },
    35: { id: 35, name: '行业痛点短视频脚本', description: '生成适配行业痛点的场景化短视频脚本', fullDescription: '功能定义：选择对应行业（如医疗健康 / 消费生活），输入产品核心卖点，生成适配该行业用户痛点的场景化短视频脚本（含剧情、台词、镜头建议）。', inputGuide: '请提供以下信息（按格式填写）：\n→ [具体行业] + [核心产品/服务] + [核心目标人群] + [产品核心卖点1-3个]', welcomeMessage: '你好，我是【行业痛点短视频脚本】智能体。请提供：[具体行业] + [核心产品/服务] + [核心目标人群] + [产品核心卖点1-3个]，我将为你生成场景化短视频脚本。', suggestedPrompts: ['企业服务+商机平台+中小企业主+低成本获客', '教育行业+AI学习平台+家长群体+提升孩子成绩', '帮我生成痛点脚本'] },
    36: { id: 36, name: '短视频脚本平台适配', description: '自动调整脚本风格，适配多平台发布', fullDescription: '功能定义：选择发布平台（抖音 / 视频号 / 快手），输入基础视频脚本，自动调整内容风格、节奏、话术。', inputGuide: '输入原始脚本内容，以及要发布的平台（抖音 / 视频号 / 快手 / 小红书）', welcomeMessage: '你好，我是【短视频脚本平台适配】智能体。请输入你的原始脚本内容，以及要发布的平台（抖音 / 视频号 / 快手 / 小红书），我将自动调整内容风格和话术。', suggestedPrompts: ['帮我适配到抖音风格', '帮我适配到视频号风格', '帮我适配到小红书风格'] }
};

// 按业务分类组织的智能体数据（4大分类）
const agentsData = {
    'IP塑造': [
        allAgentsMap[1],
        allAgentsMap[18],
        allAgentsMap[19],
        allAgentsMap[20],
        allAgentsMap[21]
    ],
    '爆款工厂': [
        allAgentsMap[15],
        allAgentsMap[34],
        allAgentsMap[17],
        allAgentsMap[9],
        allAgentsMap[5],
        allAgentsMap[6],
        allAgentsMap[7],
        allAgentsMap[8],
        allAgentsMap[10],
        allAgentsMap[11],
        allAgentsMap[12],
        allAgentsMap[13],
        allAgentsMap[16],
        allAgentsMap[14],
        allAgentsMap[22],
        allAgentsMap[23],
        allAgentsMap[26]
    ],
    '热点仿写': [
        allAgentsMap[2],
        allAgentsMap[3],
        allAgentsMap[4]
    ],
    '私域成交': [
        allAgentsMap[25],
        allAgentsMap[24],
        allAgentsMap[27],
        allAgentsMap[28],
        allAgentsMap[29],
        allAgentsMap[30],
        allAgentsMap[31]
    ]
};

// 热门推荐智能体 ID 列表（首页展示）
const hotRecommendedAgentIds = [2, 3, 4, 34, 1, 14, 19, 24];

// 分类颜色配置
const categoryColors = {
    // bg: 图标纯色背景（深色，白色图标叠上去）
    // accent: Tab/标签文字/强调色
    // light: 卡片图片区域背景（极浅）
    // shadow: 图标阴影
    'IP塑造':  { bg: '#3b82f6', accent: '#2563eb', light: '#eff6ff', shadow: 'rgba(59,130,246,.28)' },
    '爆款工厂': { bg: '#f59e0b', accent: '#d97706', light: '#fffbeb', shadow: 'rgba(245,158,11,.28)' },
    '热点仿写': { bg: '#10b981', accent: '#059669', light: '#ecfdf5', shadow: 'rgba(16,185,129,.28)' },
    '私域成交': { bg: '#8b5cf6', accent: '#7c3aed', light: '#f5f3ff', shadow: 'rgba(139,92,246,.28)' }
};

let currentAgent = null;
let agentHistory = {};
let agentChatMessages = {};
// 记录用户手动折叠/展开的分类状态（key=分类名，value=true表示折叠）
let collapsedCategories = {};
var agentConversationIds = {};  // 每个智能体当前会话 ID，用于多轮上下文；清空对话时清除

/**
 * 扣子工作流 choice 与前端 id 映射（与 fangyangge_agent_test114 选择器一致）：
 * - 前端 id 5「大字报（自我介绍）」→ choice 9（调用 LLM 9）
 * - 前端 id 9「痛点共鸣」→ choice 5（调用 LLM 5，勿再传 9 否则会进自我介绍分支）
 */
var WORKFLOW_CHOICE_OVERRIDE = { 5: 9, 9: 5 };
function resolveWorkflowChoice(agentId) {
    if (agentId == null || agentId === '') return 0;
    var n = Number(agentId);
    if (Object.prototype.hasOwnProperty.call(WORKFLOW_CHOICE_OVERRIDE, n)) {
        return WORKFLOW_CHOICE_OVERRIDE[n];
    }
    return n;
}
let searchResults = [];
let selectedSearchIndex = -1;
let allAgents = []; // 扁平化的所有智能体列表
let activeTabIndex = 0; // 当前激活的页签索引

// 初始化：扁平化智能体数据
function flattenAgents() {
    allAgents = [];
    for (const [categoryName, agents] of Object.entries(agentsData)) {
        agents.forEach(agent => {
            allAgents.push({
                ...agent,
                category: categoryName
            });
        });
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 高亮关键词
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(37, 99, 235, 0.3); padding: 2px 4px; border-radius: 3px;">$1</mark>');
}

// 搜索智能体
function searchAgents(query) {
    if (!query || query.trim() === '') {
        document.getElementById('searchResults').classList.remove('active');
        return;
    }

    const lowerQuery = query.toLowerCase().trim();
    searchResults = [];

    allAgents.forEach(agent => {
        const nameMatch = agent.name.toLowerCase().includes(lowerQuery);
        const descMatch = agent.description.toLowerCase().includes(lowerQuery);
        const categoryMatch = agent.category.toLowerCase().includes(lowerQuery);
        const inputMatch = agent.inputGuide.toLowerCase().includes(lowerQuery);

        if (nameMatch || descMatch || categoryMatch || inputMatch) {
            let score = 0;
            if (agent.name.toLowerCase().startsWith(lowerQuery)) score += 10;
            if (nameMatch) score += 5;
            if (descMatch) score += 3;
            if (categoryMatch) score += 2;
            if (inputMatch) score += 1;

            searchResults.push({
                ...agent,
                score
            });
        }
    });

    // 按分数排序
    searchResults.sort((a, b) => b.score - a.score);

    // 渲染搜索结果
    renderSearchResults();
    selectedSearchIndex = -1;
}

// 渲染搜索结果
function renderSearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    
    if (searchResults.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-empty" style="color: var(--text-light); text-align: center; padding: 20px;">未找到匹配的智能体</div>';
        resultsContainer.classList.add('active');
        return;
    }

    // 获取搜索关键词
    const searchQuery = document.getElementById('searchInput').value;
    
    // 构建 HTML
    let html = '';
    searchResults.forEach((agent, index) => {
        html += `
            <div class="search-result-item ${index === selectedSearchIndex ? 'selected' : ''}" 
                 data-agent-index="${index}" 
                 data-agent-id="${agent.id}">
                <div class="result-item-name">${highlightText(agent.name, searchQuery)}</div>
                <div class="result-item-desc">${highlightText(agent.description, searchQuery)}</div>
                <span class="result-item-category">${agent.category}</span>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('active');
    
    // 为每个结果项添加鼠标悬停事件（只更新样式，不重新渲染）
    const items = resultsContainer.querySelectorAll('.search-result-item[data-agent-index]');
    items.forEach((item, idx) => {
        item.addEventListener('mouseenter', () => {
            // 移除所有选中状态
            items.forEach(i => i.classList.remove('selected'));
            // 添加当前选中状态
            item.classList.add('selected');
            selectedSearchIndex = idx;
        });
    });
}

// 处理搜索结果点击事件（使用事件委托）
function handleSearchResultsClick(e) {
    // 查找被点击的搜索结果项
    const clickedItem = e.target.closest('.search-result-item[data-agent-index]');
    
    if (!clickedItem) {
        console.log('点击的不是搜索结果项');
        return;
    }
    
    console.log('========== 搜索结果项被点击（事件委托）==========');
    
    // 阻止事件冒泡和默认行为
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // 获取索引
    const index = parseInt(clickedItem.getAttribute('data-agent-index'), 10);
    const agentId = parseInt(clickedItem.getAttribute('data-agent-id'), 10);
    
    console.log('点击的索引:', index, '智能体ID:', agentId);
    
    if (isNaN(index) || index < 0 || index >= searchResults.length) {
        console.error('无效的索引:', index);
        return;
    }
    
    // 立即关闭搜索结果弹窗
    const searchResultsEl = document.getElementById('searchResults');
    if (searchResultsEl) {
        searchResultsEl.classList.remove('active');
        console.log('已关闭搜索结果弹窗');
    }
    
    // 清空搜索输入
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        console.log('已清空搜索输入');
    }
    
    // 重置选中索引
    selectedSearchIndex = -1;
    
    // 选择智能体
    console.log('准备调用 selectAgentFromSearch, index:', index);
    selectAgentFromSearch(index);
}

// 从搜索结果选择智能体
function selectAgentFromSearch(index) {
    console.log('========== selectAgentFromSearch 开始 ==========');
    console.log('index:', index, '搜索结果长度:', searchResults.length);
    console.log('allAgents 长度:', allAgents.length);
    
    if (index < 0 || index >= searchResults.length) {
        console.error('无效的索引:', index, '搜索结果长度:', searchResults.length);
        showToast('选择失败：无效的索引', 'error');
        return;
    }
    
    const selectedAgent = searchResults[index];
    console.log('选中的智能体:', selectedAgent);
    console.log('智能体 ID:', selectedAgent.id, '名称:', selectedAgent.name);
    
    if (!selectedAgent || !selectedAgent.id) {
        console.error('选中的智能体数据无效:', selectedAgent);
        showToast('选择失败：智能体数据无效', 'error');
        return;
    }
    
    // 从 allAgents 中找到完整的 agent 对象，确保所有属性都存在
    const fullAgent = allAgents.find(a => a.id === selectedAgent.id);
    if (!fullAgent) {
        console.error('未找到完整的智能体对象');
        console.error('搜索的 ID:', selectedAgent.id);
        console.error('allAgents 列表:', allAgents.map(a => ({ id: a.id, name: a.name })));
        showToast('切换智能体失败，请重试', 'error');
        return;
    }
    
    console.log('找到完整智能体对象:', fullAgent.name, 'ID:', fullAgent.id);
    
    // 确保搜索弹窗已关闭
    const searchResultsEl = document.getElementById('searchResults');
    if (searchResultsEl) {
        searchResultsEl.classList.remove('active');
        console.log('已关闭搜索结果弹窗');
    }
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        console.log('已清空搜索输入');
    }
    selectedSearchIndex = -1;
    
    // 切换到智能体
    try {
        console.log('准备调用 switchAgent...');
        switchAgent(fullAgent);
        console.log('智能体切换成功:', fullAgent.name);
        console.log('========== selectAgentFromSearch 完成 ==========');
        
        // 滚动到顶部
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    } catch (error) {
        console.error('切换智能体时出错:', error);
        console.error('错误堆栈:', error.stack);
        showToast('切换智能体失败：' + error.message, 'error');
    }
}

// 渲染侧边栏
function renderSidebar() {
    const sidebarContent = document.getElementById('sidebarContent');
    sidebarContent.innerHTML = '';

    for (const [categoryName, agents] of Object.entries(agentsData)) {
        const categoryGroup = document.createElement('div');
        
        // 当前智能体是否在此分类中
        const hasCurrentAgent = currentAgent && agents.some(a => a.id === currentAgent.id);
        // 优先使用用户手动保存的折叠状态；若无记录，则当前分类默认展开，其余折叠
        let isCollapsed;
        if (collapsedCategories[categoryName] !== undefined) {
            isCollapsed = collapsedCategories[categoryName];
        } else {
            isCollapsed = !hasCurrentAgent;
        }
        categoryGroup.className = isCollapsed ? 'category-group collapsed' : 'category-group';

        const agentCount = agents.length; // 获取智能体数量
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <span>${categoryName} <span style="opacity: 0.7; font-size: 0.85em;">(${agentCount})</span></span>
            <span class="category-toggle">${isCollapsed ? '▶' : '▼'}</span>
        `;
        categoryHeader.onclick = () => {
            const willCollapse = !categoryGroup.classList.contains('collapsed');
            collapsedCategories[categoryName] = willCollapse; // 持久保存用户手动操作
            categoryGroup.classList.toggle('collapsed');
            const toggleIcon = categoryHeader.querySelector('.category-toggle');
            toggleIcon.textContent = willCollapse ? '▶' : '▼';
        };

        const agentList = document.createElement('div');
        agentList.className = 'agent-list';

        agents.forEach(agent => {
            const agentItem = document.createElement('div');
            agentItem.className = 'agent-item';
            if (currentAgent && currentAgent.id === agent.id) {
                agentItem.classList.add('active');
            }
            const hasChat = (agentChatMessages[agent.id] && agentChatMessages[agent.id].length > 0);
            if (hasChat || agentHistory[agent.id]) {
                agentItem.classList.add('has-history');
            }
            const sideIcon = agentIcons[agent.id] || 'cpu';
            agentItem.innerHTML = `<span class="agent-item-icon" aria-hidden="true">${getIconSVG(sideIcon, 16)}</span><span class="agent-item-name">${agent.name}</span>`;
            agentItem.onclick = () => switchAgent(agent);
            agentList.appendChild(agentItem);
        });

        categoryGroup.appendChild(categoryHeader);
        categoryGroup.appendChild(agentList);
        sidebarContent.appendChild(categoryGroup);
    }
}

// 获取最多 3 条推荐点击提示词，优先使用 agent.suggestedPrompts 字段
function getSuggestedPrompts(agent) {
    if (agent && agent.suggestedPrompts && agent.suggestedPrompts.length > 0) {
        return agent.suggestedPrompts.slice(0, 3);
    }
    var out = [];
    if (agent && agent.inputGuide) {
        var guide = agent.inputGuide;
        var lines = guide.split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
        for (var i = 0; i < lines.length && out.length < 3; i++) {
            var line = lines[i];
            if (line.indexOf('例如') !== -1 || line.indexOf('→') !== -1) {
                var example = line.replace(/^[^：:]*[：:]?\s*/, '').trim();
                if (example.length > 5 && example.length < 50) out.push(example);
            }
        }
        if (out.length < 3 && lines.length > 0) {
            for (var j = 0; j < lines.length && out.length < 3; j++) {
                var s = lines[j].replace(/^[-*•]\s*/, '').trim();
                if (s.length >= 8 && s.length <= 40 && out.indexOf(s) === -1) out.push(s);
            }
        }
    }
    if (out.length === 0) out.push('请直接输入你的需求');
    return out.slice(0, 3);
}

/** HTML 转义（解析失败时兜底） */
function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * 预处理 AI 返回的 Markdown：统一换行、压掉过多空行，减轻「一段一换行」+ breaks 造成的巨大留白
 */
function sanitizeMarkdownInput(raw) {
    if (!raw || typeof raw !== 'string') return '';
    var s = raw.replace(/\r\n/g, '\n');
    // 连续 3 个及以上换行压成 2 个（仅保留段落间一空行）
    s = s.replace(/\n{3,}/g, '\n\n');
    return s.trim();
}

/**
 * 将助手消息解析为 HTML（GFM，单换行不按 <br> 展开，避免与 CSS 叠加出现「一行一巨缝」）
 */
function parseAssistantMarkdown(raw) {
    if (typeof marked === 'undefined') {
        return '<p>' + escapeHtml(String(raw || '')) + '</p>';
    }
    var text = sanitizeMarkdownInput(raw);
    try {
        return marked.parse(text);
    } catch (e) {
        console.warn('markdown parse failed', e);
        return '<p>' + escapeHtml(text) + '</p>';
    }
}

// 渲染当前智能体的对话消息（Coze 风格：无消息时显示空状态+引导+提示词）
// 创建消息行：AI消息带小头像左对齐，用户消息靠右
function createMsgRow(role, iconName) {
    if (role === 'assistant') {
        var row = document.createElement('div');
        row.className = 'msg-row';
        var avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = getIconSVG(iconName || 'cpu', 15);
        var bubble = document.createElement('div');
        bubble.className = 'chat-message assistant';
        row.appendChild(avatar);
        row.appendChild(bubble);
        return { row: row, bubble: bubble };
    } else {
        var div = document.createElement('div');
        div.className = 'chat-message user';
        return { row: div, bubble: div };
    }
}

function renderChatMessages(agentId) {
    var container = document.getElementById('chatMessages');
    if (!container) return;
    try {
        var list = agentChatMessages[agentId];
        var agent = allAgentsMap[agentId] || allAgents.find(function (a) { return a.id === agentId; });

        // 始终更新引导区内容（切换智能体时同步更新，且不随对话出现而隐藏）
        var titleEl = document.getElementById('cozeAgentTitle');
        var welcomeEl = document.getElementById('cozeWelcomeBubble');
        var promptsEl = document.getElementById('cozeSuggestedPrompts');
        var avatarEl = document.getElementById('cozeAgentAvatar');
        var funcHintEl = document.getElementById('cozeAgentFuncHint');
        if (titleEl && agent) titleEl.textContent = agent.name;
        if (funcHintEl) {
            var fd = agent && agent.functionDef;
            funcHintEl.textContent = fd || '';
        }
        if (avatarEl && agent) {
            var iconName = (typeof agentIcons !== 'undefined' && agentIcons[agent.id]) || 'cpu';
            var iconSpan = avatarEl.querySelector('.coze-avatar-icon');
            if (iconSpan) iconSpan.innerHTML = getIconSVG(iconName, 18);
        }
        if (welcomeEl) {
            var welcome = (agent && agent.welcomeMessage)
                ? agent.welcomeMessage
                : (agent && agent.inputGuide
                    ? '你好，我是【' + (agent.name || '智能体') + '】。请根据下方提示输入内容，或直接输入你的需求。'
                    : '你好，请直接输入你的需求，按发送或 Enter 提交。');
            welcomeEl.textContent = welcome;
        }
        // 引导词区域留空（功能定义已移至标题括号）
        if (promptsEl) promptsEl.innerHTML = '';

        // 清除旧的消息行（保留 intro / loading / stop-wrap 节点）
        var emptyState = document.getElementById('cozeEmptyState');
        var loadingEl2 = document.getElementById('chatLoading');
        var stopWrap2 = document.getElementById('cozeStopWrap');
        Array.from(container.children).forEach(function(child) {
            if (child !== emptyState && child !== loadingEl2 && child !== stopWrap2) {
                container.removeChild(child);
            }
        });

        if (!list || list.length === 0) {
            container.scrollTop = 0;
            return;
        }

        var msgIcon = (agent && agentIcons[agent.id]) || 'cpu';
        // 消息插在 loading 节点之前，保持 loading/stop-wrap 在末尾
        var beforeNode = loadingEl2 || null;
        list.forEach(function (msg) {
            var item = createMsgRow(msg.role, msgIcon);
            if (msg.role === 'assistant' && typeof marked !== 'undefined') {
                item.bubble.innerHTML = '<div class="markdown-body">' + parseAssistantMarkdown(msg.content || '') + '</div>';
            } else {
                item.bubble.textContent = msg.content || '';
            }
            if (beforeNode && beforeNode.parentNode === container) {
                container.insertBefore(item.row, beforeNode);
            } else {
                container.appendChild(item.row);
            }
        });
        container.scrollTop = container.scrollHeight;
    } catch (e) {
        console.warn('renderChatMessages:', e);
    }
}

// 流式打字机效果：将最后一条 assistant 消息逐字显示，并显示「停止响应」按钮
var streamingTimerId = null;
var streamingStopRequested = false;

function renderWithStreamingEffect(agentId, fullContent, onDone) {
    var container = document.getElementById('chatMessages');
    var stopWrap = document.getElementById('cozeStopWrap');
    var submitBtn = document.getElementById('submitBtn');
    var loadingEl = document.getElementById('chatLoading');
    if (!container) { if (onDone) onDone(); return; }
    if (streamingTimerId) clearInterval(streamingTimerId);
    streamingStopRequested = false;
    var list = agentChatMessages[agentId];
    var idx = list ? list.length - 1 : -1;
    if (idx < 0 || !list[idx] || list[idx].role !== 'assistant') {
        if (onDone) onDone();
        return;
    }
    list[idx].content = fullContent;
    // 清除旧消息行，保留 intro / loading / stop-wrap 节点
    var streamEmptyState = document.getElementById('cozeEmptyState');
    var streamLoadingEl = document.getElementById('chatLoading');
    var streamStopWrap = document.getElementById('cozeStopWrap');
    Array.from(container.children).forEach(function(child) {
        if (child !== streamEmptyState && child !== streamLoadingEl && child !== streamStopWrap) {
            container.removeChild(child);
        }
    });
    var streamAgent = allAgentsMap[agentId] || allAgents.find(function(a) { return a.id === agentId; });
    var streamIcon = (streamAgent && agentIcons[streamAgent.id]) || 'cpu';
    // 消息插在 loading 前，保持 loading/stop-wrap 在末尾
    var streamBeforeNode = streamLoadingEl || null;
    for (var i = 0; i < list.length - 1; i++) {
        var msg = list[i];
        var item = createMsgRow(msg.role, streamIcon);
        if (msg.role === 'assistant' && typeof marked !== 'undefined') {
            item.bubble.innerHTML = '<div class="markdown-body">' + parseAssistantMarkdown(msg.content || '') + '</div>';
        } else {
            item.bubble.textContent = msg.content || '';
        }
        if (streamBeforeNode && streamBeforeNode.parentNode === container) {
            container.insertBefore(item.row, streamBeforeNode);
        } else {
            container.appendChild(item.row);
        }
    }
    var streamItem = createMsgRow('assistant', streamIcon);
    streamItem.bubble.innerHTML = '<div class="markdown-body"></div>';
    if (streamBeforeNode && streamBeforeNode.parentNode === container) {
        container.insertBefore(streamItem.row, streamBeforeNode);
    } else {
        container.appendChild(streamItem.row);
    }
    var streamDiv = streamItem.bubble;
    var inner = streamDiv.querySelector('.markdown-body');
    if (stopWrap) stopWrap.style.display = 'block';
    var pos = 0;
    var intervalMs = 45;
    function tick() {
        if (streamingStopRequested || pos >= fullContent.length) {
            clearInterval(streamingTimerId);
            streamingTimerId = null;
            inner.innerHTML = typeof marked !== 'undefined' ? parseAssistantMarkdown(fullContent) : escapeHtml(fullContent);
            if (stopWrap) stopWrap.style.display = 'none';
            if (submitBtn) submitBtn.disabled = false;
            if (loadingEl) loadingEl.classList.remove('active');
            container.scrollTop = container.scrollHeight;
            if (onDone) onDone();
            return;
        }
        pos += 1;
        var part = fullContent.substring(0, pos);
        // 流式阶段也走 Markdown 解析，避免长时间显示未转义的 **、### 等
        inner.innerHTML = typeof marked !== 'undefined' ? parseAssistantMarkdown(part) : escapeHtml(part);
        container.scrollTop = container.scrollHeight;
    }
    streamingTimerId = setInterval(tick, intervalMs);
    tick();
}

function stopStreaming() {
    streamingStopRequested = true;
}

// 切换智能体（Coze 风格对话界面）
function switchAgent(agent, saveCurrent) {
    if (saveCurrent === undefined) saveCurrent = true;
    if (!agent || !agent.id) {
        showToast('切换失败：智能体数据无效', 'error');
        return;
    }
    var homepageGuide = document.getElementById('homepageGuide');
    var agentInfoCard = document.getElementById('agentInfoCard');
    var selectedAgentName = document.getElementById('selectedAgentName');
    var userInput = document.getElementById('userInput');
    if (!agentInfoCard) {
        showToast('页面结构异常，请刷新后重试', 'error');
        return;
    }
    currentAgent = agent;
    // 打开新智能体时，清除其所在分类的折叠状态，使其自动展开
    const agentCategory = Object.keys(agentsData).find(cat => agentsData[cat].some(a => a.id === agent.id));
    if (agentCategory) delete collapsedCategories[agentCategory];
    if (homepageGuide) homepageGuide.style.display = 'none';
    agentInfoCard.style.display = 'flex';
    if (selectedAgentName) selectedAgentName.textContent = agent.name || '智能体';
    if (document.body) document.body.classList.add('in-chat-view');
    if (userInput) {
        userInput.value = '';
        userInput.placeholder = '发送消息...';
    }
    renderChatMessages(agent.id);
    renderSidebar();
    closeSidebar();
}

// 切换智能体提示
function switchAgentPrompt() {
    document.getElementById('searchInput').focus();
    showToast('在搜索框中输入关键词或从侧边栏选择', 'success');
}

// 使用指定文案直接发送（如点击提示气泡时调用，不填入输入框）
function sendChatMessageWithText(text) {
    var t = (text || '').trim();
    if (!t) return;
    if (!currentAgent) {
        showToast('请先选择一个智能体', 'error');
        return;
    }
    doSendMessage(t);
}

// 发送对话消息（多轮对话；支持 conversation_id 保持会话）
function sendChatMessage() {
    if (!currentAgent) {
        showToast('请先选择一个智能体', 'error');
        return;
    }
    var inputEl = document.getElementById('userInput');
    var userInput = (inputEl && inputEl.value) ? inputEl.value.trim() : '';
    if (!userInput) {
        if (inputEl) {
            inputEl.classList.remove('shake');
            void inputEl.offsetWidth; // 强制重排以重播动画
            inputEl.classList.add('shake');
        }
        return;
    }
    if (inputEl) inputEl.value = '';
    doSendMessage(userInput);
}

// 去重：每次对话（含第二轮及多轮）都去掉「上边分段+间隔大+重复」，只保留下边正常对话格式
function dedupeAssistantOutput(text) {
    if (!text) return text;
    var s = text.trim();
    s = s.replace(/^[.，、；：\s]+/, '');
    if (s.length < 80) return s;
    var head = s.substring(0, 80);
    var repeatAt = s.indexOf(head, 80);
    if (repeatAt > 0) {
        var kept = s.substring(0, repeatAt).trim();
        var lastChar = kept.charAt(kept.length - 1);
        if (/[。！？.!?\n]/.test(lastChar)) return kept;
    }
    var segments = s.split(/\n\s*\n/);
    if (segments.length < 2) {
        return tryDedupeBySingleNewline(s);
    }
    var last = segments[segments.length - 1].trim();
    if (/^[.，、；：\s]/.test(last)) return s;
    var rest = segments.slice(0, -1).join('\n\n');
    var restWords = rest.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').split(/\s+/).filter(function (w) { return w.length >= 2; });
    var lastNorm = last.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');
    var matchCount = 0;
    for (var i = 0; i < restWords.length; i++) {
        if (lastNorm.indexOf(restWords[i]) !== -1) matchCount++;
    }
    var firstSegment = segments[0].trim();
    // 修复：只要早期段含有句中换行（碎片特征），最后段没有换行（完整特征），且有词重叠，优先保留最后段
    var earlyHasMidNewline = segments.slice(0, -1).some(function (seg) { return seg.indexOf('\n') !== -1; });
    var lastIsClean = last.indexOf('\n') === -1;
    var overlapRatio = restWords.length > 0 ? matchCount / restWords.length : 0;
    if (earlyHasMidNewline && lastIsClean && last.length >= 15 && (overlapRatio >= 0.2 || matchCount >= 2)) {
        return last.replace(/^[.，、；：\s]+/, '') || last;
    }
    // 降低阈值：firstFragmented 只需有1个换行（>= 2段），last 只需 >= 30 字符
    var firstFragmented = firstSegment.split(/\n/).length >= 2;
    var keepLast = last.length >= 30 && (overlapRatio >= 0.25 || (segments.length === 2 && firstFragmented && last.length >= 40));
    if (keepLast && (matchCount >= 3 || (firstFragmented && last.length >= 40))) {
        return last.replace(/^[.，、；：\s]+/, '') || last;
    }
    if (matchCount >= 4 && overlapRatio >= 0.35) return last.replace(/^[.，、；：\s]+/, '') || last;
    return s;
}

// 无 \n\n 时：尝试识别「多行零散 + 一段正常」，只保留正常段
function tryDedupeBySingleNewline(s) {
    var lines = s.split(/\n/).map(function (l) { return l.trim(); });
    if (lines.length < 3) return s;
    var i = lines.length - 1;
    var tailLen = 0;
    while (i >= 0 && tailLen < 60) {
        tailLen += lines[i].length;
        i--;
    }
    i++;
    if (tailLen < 20) return s;
    var tail = lines.slice(i).join('');
    if (/^[.，、；：\s]/.test(tail)) return s;
    var head = lines.slice(0, i).join('');
    var headWords = head.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').split(/\s+/).filter(function (w) { return w.length >= 2; });
    if (headWords.length < 3) return s;
    var tailNorm = tail.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');
    var matchCount = 0;
    for (var j = 0; j < headWords.length; j++) {
        if (tailNorm.indexOf(headWords[j]) !== -1) matchCount++;
    }
    if (matchCount >= 3 && matchCount >= headWords.length * 0.2) return tail.replace(/^[.，、；：\s]+/, '') || tail;
    return s;
}

function doSendMessage(userInput) {
    var id = currentAgent.id;
    if (!agentChatMessages[id]) agentChatMessages[id] = [];
    agentChatMessages[id].push({ role: 'user', content: userInput });
    renderChatMessages(id);

    var submitBtn = document.getElementById('submitBtn');
    var loadingEl = document.getElementById('chatLoading');
    if (submitBtn) submitBtn.disabled = true;
    if (loadingEl) loadingEl.classList.add('active');

    var history = agentChatMessages[id].slice(0, -1).map(function (m) { return { role: m.role, content: m.content }; });
    var convId = agentConversationIds[id] || undefined;

    fetch(API_BASE_URL + '/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            choice: resolveWorkflowChoice(currentAgent.id),
            userInput: userInput,
            topic: userInput,
            history: history,
            conversation_id: convId
        })
    })
    .then(function (response) { return response.json(); })
    .then(function (data) {
        if (data.success && data.data) {
            var outputContent = (data.data.output || '').trim();
            outputContent = dedupeAssistantOutput(outputContent);
            if (data.data.conversation_id) agentConversationIds[id] = data.data.conversation_id;
            if (outputContent && outputContent.indexOf('响应数据格式异常') === -1) {
                agentChatMessages[id].push({ role: 'assistant', content: outputContent });
                if (currentAgent && currentAgent.id === id) agentHistory[id] = { output: outputContent };
                if (loadingEl) loadingEl.classList.remove('active');
                renderWithStreamingEffect(id, outputContent, function () {
                    renderSidebar();
                    // 不再在右侧顶部弹出「回复完成」提示
                });
                return;
            }
            var errMsg = outputContent || data.message || '生成内容为空';
            agentChatMessages[id].push({ role: 'assistant', content: '⚠️ ' + errMsg });
            showToast(errMsg.substring(0, 50), 'error');
        } else {
            var msg = data.message || '请求失败';
            agentChatMessages[id].push({ role: 'assistant', content: '❌ ' + msg });
            showToast(msg, 'error');
        }
        renderChatMessages(id);
        renderSidebar();
        if (submitBtn) submitBtn.disabled = false;
        if (loadingEl) loadingEl.classList.remove('active');
    })
    .catch(function (err) {
        var msg = err && err.message ? err.message : '请稍后重试';
        if (msg === 'Failed to fetch' || msg.indexOf('fetch') !== -1) {
            msg = '无法连接后端服务，请确认后端已启动（端口 3003）';
        }
        agentChatMessages[id].push({ role: 'assistant', content: '❌ 网络错误：' + msg });
        showToast('请求失败，请检查后端是否已启动', 'error');
        renderChatMessages(id);
        renderSidebar();
        if (submitBtn) submitBtn.disabled = false;
        if (loadingEl) loadingEl.classList.remove('active');
    });
}

// 复制当前对话最后一条助手回复
function copyResult() {
    if (!currentAgent || !agentChatMessages[currentAgent.id]) {
        showToast('暂无内容可复制', 'error');
        return;
    }
    var list = agentChatMessages[currentAgent.id];
    for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].role === 'assistant') {
            navigator.clipboard.writeText(list[i].content).then(function () {
                showToast('已复制到剪贴板', 'success');
            }).catch(function (err) {
                showToast('复制失败', 'error');
            });
            return;
        }
    }
    showToast('暂无回复可复制', 'error');
}

// 复制当前对话全文（智能体名 + 所有消息）
function copyResultWithInput() {
    if (!currentAgent || !agentChatMessages[currentAgent.id]) {
        showToast('暂无对话可复制', 'error');
        return;
    }
    var lines = ['【智能体】' + currentAgent.name, ''];
    agentChatMessages[currentAgent.id].forEach(function (m) {
        lines.push((m.role === 'user' ? '用户：' : '助手：') + '\n' + (m.content || ''));
        lines.push('');
    });
    navigator.clipboard.writeText(lines.join('\n').trim()).then(function () {
        showToast('对话已复制到剪贴板', 'success');
    }).catch(function () {
        showToast('复制失败', 'error');
    });
}

// 清空当前智能体的对话记录
function clearCurrentHistory() {
    if (!currentAgent) {
        showToast('请先选择一个智能体', 'error');
        return;
    }
    if (confirm('确定要清空与「' + currentAgent.name + '」的对话记录吗？')) {
        delete agentHistory[currentAgent.id];
        delete agentChatMessages[currentAgent.id];
        delete agentConversationIds[currentAgent.id];
        document.getElementById('userInput').value = '';
        renderChatMessages(currentAgent.id);
        renderSidebar();
        showToast('对话已清空', 'success');
    }
}

// 清空所有历史记录
function clearAllHistory() {
    var count = Object.keys(agentChatMessages).length || Object.keys(agentHistory).length;
    if (count === 0) {
        showToast('当前没有历史记录', 'error');
        return;
    }
    if (confirm('确定要清空所有智能体的对话记录吗？共 ' + count + ' 个。')) {
        agentHistory = {};
        agentChatMessages = {};
        agentConversationIds = {};
        document.getElementById('userInput').value = '';
        if (currentAgent) renderChatMessages(currentAgent.id);
        renderSidebar();
        showToast('已清空所有记录', 'success');
    }
}

// 显示历史记录面板（右侧抽屉）
function showHistoryPanel() {
    var body = document.getElementById('historyPanelBody');
    var ids = Array.from(new Set(
        Object.keys(agentChatMessages).concat(Object.keys(agentHistory))
    ));

    if (ids.length === 0) {
        body.innerHTML = '<div class="history-panel-empty">' +
            '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
            '<p>暂无对话记录</p><p style="font-size:0.78rem;margin-top:4px;">选择一个智能体开始对话吧</p></div>';
    } else {
        body.innerHTML = '';
        ids.forEach(function (agentId) {
            var agent = allAgents.find(function (a) { return a.id === parseInt(agentId, 10); });
            if (!agent) return;

            var messages = agentChatMessages[agent.id] || [];
            var lastPreview = '暂无消息';
            for (var i = messages.length - 1; i >= 0; i--) {
                if (messages[i].role === 'user') {
                    var raw = messages[i].content || '';
                    lastPreview = raw.length > 28 ? raw.substring(0, 28) + '…' : raw;
                    break;
                }
            }
            var userMsgCount = messages.filter(function (m) { return m.role === 'user'; }).length;

            // 获取分类颜色
            var catEntry = Object.entries(agentsData).find(function (entry) {
                return entry[1].some(function (a) { return a.id === agent.id; });
            });
            var catName = catEntry ? catEntry[0] : '';
            var color = (categoryColors[catName] || {}).bg || '#6366f1';

            var item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML =
                '<div class="history-item-icon" style="background:' + color + ';">' +
                    getIconSVG(agentIcons[agent.id] || 'star', 18) +
                '</div>' +
                '<div class="history-item-body">' +
                    '<div class="history-item-name">' + agent.name + '</div>' +
                    '<div class="history-item-preview">' + lastPreview + '</div>' +
                '</div>' +
                (userMsgCount > 0 ? '<span class="history-item-badge">' + userMsgCount + '条</span>' : '');

            (function (a) {
                item.onclick = function () {
                    closeHistoryPanel();
                    switchAgent(a);
                };
            })(agent);
            body.appendChild(item);
        });
    }

    document.getElementById('historyOverlay').classList.add('active');
    document.getElementById('historyPanel').classList.add('open');
}

function closeHistoryPanel() {
    document.getElementById('historyPanel').classList.remove('open');
    document.getElementById('historyOverlay').classList.remove('active');
}

// 从历史面板清空（不用 confirm，直接清空并关闭）
function clearAllHistoryFromPanel() {
    var count = Object.keys(agentChatMessages).length;
    if (count === 0) { closeHistoryPanel(); return; }
    if (confirm('确定要清空所有 ' + count + ' 个智能体的对话记录吗？')) {
        agentHistory = {};
        agentChatMessages = {};
        agentConversationIds = {};
        document.getElementById('userInput').value = '';
        if (currentAgent) renderChatMessages(currentAgent.id);
        renderSidebar();
        closeHistoryPanel();
        showToast('已清空所有记录', 'success');
    }
}

// 显示提示消息
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} active`;

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// 切换侧边栏（移动端）
function toggleSidebar() {
    if (window.innerWidth > 1024) {
        // 桌面端：切换 body.sidebar-hidden 类，侧边栏平滑折叠/展开
        document.body.classList.toggle('sidebar-hidden');
    } else {
        // 移动端/平板：抽屉式开关
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

function closeSidebar() {
    if (window.innerWidth > 1024) {
        // 桌面端：隐藏侧边栏
        // （通常不主动调用，保留兼容）
    } else {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }

    // Esc: 关闭搜索/侧边栏
    if (e.key === 'Escape') {
        document.getElementById('searchResults').classList.remove('active');
        document.getElementById('searchInput').blur();
        closeSidebar();
    }

    // 搜索框中的键盘导航
    const searchResults = document.getElementById('searchResults');
    if (searchResults.classList.contains('active') && searchResults.children.length > 0) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSearchIndex = Math.min(selectedSearchIndex + 1, searchResults.children.length - 1);
            renderSearchResults();
            searchResults.children[selectedSearchIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSearchIndex = Math.max(selectedSearchIndex - 1, -1);
            renderSearchResults();
        } else if (e.key === 'Enter' && selectedSearchIndex >= 0) {
            e.preventDefault();
            selectAgentFromSearch(selectedSearchIndex);
        }
    }

    // Ctrl/Cmd + ←/→: 切换智能体
    if ((e.ctrlKey || e.metaKey) && currentAgent) {
        const agentIds = allAgents.map(a => a.id);
        const currentIndex = agentIds.indexOf(currentAgent.id);
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            switchAgent(allAgents[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < allAgents.length - 1) {
            e.preventDefault();
            switchAgent(allAgents[currentIndex + 1]);
        }
    }

    // 对话输入框：Enter 发送，Shift+Enter 换行
    const userInputEl = document.getElementById('userInput');
    if (userInputEl && document.activeElement === userInputEl && e.key === 'Enter') {
        if (!e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    }
});

// 分类说明数据
const categoryDescriptions = {
    'IP塑造': { description: '账号基础与人设包装，快速锚定账号价值，构建专属IP形象' },
    '爆款工厂': { description: '原创爆款内容生产，覆盖大字报、口播脚本、观点金句等多种内容形式' },
    '热点仿写': { description: '爆款仿写与热点借势，低成本快速产出高流量内容' },
    '私域成交': { description: '私域流量经营与转化，从朋友圈到会销全流程话术支持' }
};

// 内联 SVG 图标库（无需 CDN，stroke-width 统一 1.75）
const SVG_PATHS = {
    'calendar':       `<rect x="3" y="4" width="18" height="18" rx="2.5" fill="currentColor" fill-opacity="0.2"/><line x1="16" y1="2" x2="16" y2="7"/><line x1="8" y1="2" x2="8" y2="7"/><rect x="3" y="4" width="18" height="18" rx="2.5"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="7 14.5 9 16.5 12.5 13" stroke-linecap="round" stroke-linejoin="round"/><line x1="14" y1="15" x2="17" y2="15" stroke-linecap="round"/><line x1="7" y1="20" x2="17" y2="20" stroke-linecap="round" stroke-opacity="0.5"/>`,
    'copy':           `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="currentColor" fill-opacity="0.18"/><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="currentColor" fill-opacity="0.3"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
    'rotate-cw':      `<circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.15"/><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="14" x2="13" y2="14"/>`,
    'trending-up':    `<path d="M1 20 8.5 11 13.5 16 21 5" fill="none"/><path d="M0 21 8.5 11 13.5 16 22 5 22 21Z" fill="currentColor" fill-opacity="0.15"/><polyline points="17 5 23 5 23 11"/><circle cx="8.5" cy="11" r="2" fill="currentColor"/><circle cx="13.5" cy="16" r="1.5" fill="currentColor" fill-opacity="0.7"/>`,
    'type':           `<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>`,
    'grid':           `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
    'zap':            `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    'map-pin':        `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
    'user':           `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    'alert-triangle': `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
    'help-circle':    `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
    'star':           `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
    'rocket':         `<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>`,
    'file-text':      `<rect x="2" y="5" width="20" height="14" rx="2.5" fill="currentColor" fill-opacity="0.2"/><rect x="2" y="5" width="20" height="14" rx="2.5"/><rect x="5" y="9" width="14" height="2.5" rx="1.25" fill="currentColor"/><line x1="5" y1="15" x2="17" y2="15" stroke-linecap="round"/><line x1="5" y1="17.5" x2="12" y2="17.5" stroke-linecap="round"/>`,
    'lightbulb':      `<line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>`,
    'message-square': `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
    'award':          `<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`,
    'target':         `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
    'heart':          `<circle cx="12" cy="7" r="3.2" fill="currentColor" fill-opacity="0.9"/><path d="M5.5 21c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" fill="currentColor" fill-opacity="0.28"/><path d="M5.5 21c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"/><path d="M19 2l.9 1.8 1.9.9-1.9.9L19 7.4l-.9-1.8-1.9-.9 1.9-.9z" fill="currentColor"/>`,
    'box':            `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
    'phone':          `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>`,
    'video':          `<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>`,
    'radio':          `<circle cx="12" cy="12" r="2"/><path d="M4.93 4.93l4.24 4.24"/><path d="M14.83 9.17l4.24-4.24"/><path d="M14.83 14.83l4.24 4.24"/><path d="M9.17 14.83l-4.24 4.24"/><circle cx="12" cy="12" r="8"/>`,
    'send':           `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
    'users':          `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    'book-open':      `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
    'mic':            `<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>`,
    'headphones':     `<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>`,
    'volume-2':       `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`,
    'clipboard':      `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>`,
    'message-circle': `<circle cx="12" cy="12" r="10"/><path d="m14.31 8 5.74 9.94"/><path d="M9.69 8h11.48"/><path d="m7.38 12 5.74-9.94"/><path d="M9.69 16 3.95 6.06"/><path d="M14.31 16H2.83"/><path d="m16.62 12-5.74 9.94"/>`,
    'briefcase':      `<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
    'megaphone':      `<path d="m3 11 18-5v12L3 14v-3z" fill="currentColor" fill-opacity="0.2"/><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/><line x1="22" y1="7" x2="22" y2="8"/><line x1="22" y1="10.5" x2="22" y2="11.5"/>`,
    'film':           `<rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>`,
    'smartphone':     `<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>`,
    'graduation-cap': `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
    'search':         `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
    'menu':           `<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>`,
    'trash-2':        `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>`,
    'cpu':            `<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>`,
    'x':              `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`
};

function getIconSVG(name, size) {
    var s = size || 20;
    var p = SVG_PATHS[name] || SVG_PATHS['cpu'];
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
}

// 智能体图标映射（使用 SVG_PATHS 键名）
const agentIcons = {
    1: 'calendar',       2: 'copy',          3: 'rotate-cw',    4: 'trending-up',
    5: 'type',           6: 'grid',          7: 'zap',          8: 'map-pin',
    9: 'user',           10: 'alert-triangle', 11: 'help-circle', 12: 'star',
    13: 'rocket',        14: 'file-text',    15: 'lightbulb',   16: 'message-square',
    17: 'award',         18: 'target',       19: 'heart',       20: 'box',
    21: 'phone',         22: 'video',        23: 'radio',       24: 'message-circle',
    25: 'users',         26: 'book-open',    27: 'mic',         28: 'headphones',
    29: 'volume-2',      30: 'clipboard',    31: 'message-square', 32: 'graduation-cap',
    33: 'briefcase',     34: 'megaphone',    35: 'film',        36: 'smartphone'
};

// 热门推荐图标配色（App Icon 风格，每个智能体独立品牌色）
var hotAgentColors = {
    1:  { bg: '#6366f1', shadow: 'rgba(99,102,241,.35)' },   // 7天选题    - Indigo
    2:  { bg: '#3b82f6', shadow: 'rgba(59,130,246,.35)' },   // 内容仿写   - Blue
    3:  { bg: '#8b5cf6', shadow: 'rgba(139,92,246,.35)' },   // 爆款改写   - Purple
    4:  { bg: '#f97316', shadow: 'rgba(249,115,22,.35)' },   // 热点二创   - Orange
    14: { bg: '#ec4899', shadow: 'rgba(236,72,153,.35)' },   // 视频标题   - Pink
    19: { bg: '#f43f5e', shadow: 'rgba(244,63,94,.35)' },    // IP故事     - Rose
    24: { bg: '#0ea5e9', shadow: 'rgba(14,165,233,.35)' },   // 朋友圈文案 - Cyan
    34: { bg: '#14b8a6', shadow: 'rgba(20,184,166,.35)' },   // 大会邀约   - Teal
};
// 通用回退色池（索引顺序）
var fallbackColors = [
    { bg: '#6366f1', shadow: 'rgba(99,102,241,.35)' },
    { bg: '#3b82f6', shadow: 'rgba(59,130,246,.35)' },
    { bg: '#8b5cf6', shadow: 'rgba(139,92,246,.35)' },
    { bg: '#f97316', shadow: 'rgba(249,115,22,.35)' },
    { bg: '#ec4899', shadow: 'rgba(236,72,153,.35)' },
    { bg: '#14b8a6', shadow: 'rgba(20,184,166,.35)' },
    { bg: '#f43f5e', shadow: 'rgba(244,63,94,.35)' },
    { bg: '#0ea5e9', shadow: 'rgba(14,165,233,.35)' },
];

// 渲染首页热门推荐区块
function renderHotRecommendations() {
    var hotGrid = document.getElementById('hotAgentsGrid');
    if (!hotGrid) return;
    hotGrid.innerHTML = '';
    hotRecommendedAgentIds.forEach(function(agentId, idx) {
        var agent = allAgentsMap[agentId];
        if (!agent) return;
        var iconName = agentIcons[agentId] || 'cpu';
        var color = hotAgentColors[agentId] || fallbackColors[idx % fallbackColors.length];
        var card = document.createElement('div');
        card.className = 'hot-agent-card';
        card.innerHTML =
            '<div class="hot-agent-icon" style="background:' + color.bg + ';box-shadow:0 6px 16px ' + color.shadow + ';">' +
                getIconSVG(iconName, 24) +
            '</div>' +
            '<div class="hot-agent-name">' + agent.name + '</div>' +
            '<div class="hot-agent-desc">' + agent.description + '</div>';
        card.onclick = function() { switchAgent(agent); };
        hotGrid.appendChild(card);
    });
}

// 渲染首页页签和智能体卡片
function renderHomepageCategories() {
    const tabsNav = document.getElementById('tabsNav');
    const tabsContent = document.getElementById('tabsContent');
    
    tabsNav.innerHTML = '';
    tabsContent.innerHTML = '';
    
    const categories = Object.keys(agentsData);
    
    // 创建页签按钮
    categories.forEach((categoryName, index) => {
        const agents = agentsData[categoryName];
        const color = categoryColors[categoryName] || { accent: '#2563eb' };
        const tabButton = document.createElement('button');
        tabButton.className = `tab-button ${index === activeTabIndex ? 'active' : ''}`;
        if (index === activeTabIndex) {
            tabButton.style.background = color.accent;
            tabButton.style.borderColor = color.accent;
        }
        tabButton.setAttribute('data-category', categoryName);
        tabButton.innerHTML = `${categoryName}<span class="tab-count">${agents.length}</span>`;
        tabButton.onclick = () => switchTab(index);
        tabsNav.appendChild(tabButton);
    });
    
    // 创建页签内容面板
    categories.forEach((categoryName, index) => {
        const agents = agentsData[categoryName];
        const color = categoryColors[categoryName] || { bg: '#eff6ff', accent: '#2563eb', light: 'rgba(37,99,235,0.08)' };
        const tabPanel = document.createElement('div');
        tabPanel.className = `tab-panel ${index === activeTabIndex ? 'active' : ''}`;
        tabPanel.id = `tabPanel-${index}`;
        
        const agentsGrid = document.createElement('div');
        agentsGrid.className = 'agents-grid';
        
        agents.forEach(function(agent) {
            var iconName = agentIcons[agent.id] || 'cpu';
            var agentCard = document.createElement('div');
            agentCard.className = 'agent-card';
            agentCard.innerHTML =
                '<div class="agent-card-image" style="background:' + color.light + ';">' +
                    '<div class="agent-icon-wrap" style="background:' + color.bg + ';box-shadow:0 4px 12px ' + (color.shadow || 'rgba(0,0,0,.15)') + ';">' +
                        getIconSVG(iconName, 24) +
                    '</div>' +
                '</div>' +
                '<div class="agent-card-content">' +
                    '<div class="agent-card-header">' +
                        '<div class="agent-card-name">' + agent.name + '</div>' +
                        '<span class="agent-card-type" style="background:' + color.light + ';color:' + color.accent + ';">' + categoryName + '</span>' +
                    '</div>' +
                    '<div class="agent-card-description">' + agent.description + '</div>' +
                    '<div class="agent-card-footer"><span class="agent-card-action">立即使用 →</span></div>' +
                '</div>';
            agentCard.onclick = function() { switchAgent(agent); };
            agentsGrid.appendChild(agentCard);
        });
        
        tabPanel.appendChild(agentsGrid);
        tabsContent.appendChild(tabPanel);
    });

    // 渲染热门推荐
    renderHotRecommendations();
}

// 切换页签
function switchTab(index) {
    if (index === activeTabIndex) return;

    // 切换前记录滚动位置，切换后立即还原，防止内容高度变化引起页面跳动
    const savedScrollY = window.scrollY;

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('active');
            const cat = btn.getAttribute('data-category');
            const color = categoryColors[cat] || { accent: '#2563eb' };
            btn.style.background = color.accent;
            btn.style.borderColor = color.accent;
        } else {
            btn.classList.remove('active');
            btn.style.background = '';
            btn.style.borderColor = '';
        }
    });

    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach((panel, i) => {
        panel.classList.toggle('active', i === index);
    });

    activeTabIndex = index;

    // 在浏览器完成布局重排、下一帧绘制前还原滚动位置
    requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    });
}

// 展开侧边栏中的分类
function expandCategoryInSidebar(categoryName) {
    const categoryGroups = document.querySelectorAll('.category-group');
    categoryGroups.forEach(group => {
        const header = group.querySelector('.category-header');
        if (header && header.textContent.includes(categoryName)) {
            group.classList.remove('collapsed');
            const toggle = header.querySelector('.category-toggle');
            if (toggle) toggle.textContent = '▼';
        }
    });
}

// 回到首页
function goToHomepage() {
    console.log('========== 回到首页 ==========');
    
    // 清空当前智能体
    currentAgent = null;
    
    document.getElementById('agentInfoCard').style.display = 'none';
    document.getElementById('homepageGuide').style.display = 'block';
    if (document.body) document.body.classList.remove('in-chat-view');
    renderSidebar();
    
    // 重置到第一个页签
    if (activeTabIndex !== 0) {
        switchTab(0);
    }
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 不再在右侧顶部弹出「已返回首页」提示
}

// 初始化页面
function initializePage() {
    if (typeof marked !== 'undefined') {
        // breaks: false — 单换行按 CommonMark 合并为空格，避免模型「一句一行」变成大量 <br> 与 CSS 叠加出巨缝
        if (typeof marked.use === 'function') {
            marked.use({ gfm: true, breaks: false });
        } else {
            marked.setOptions({ gfm: true, breaks: false });
        }
    }
    flattenAgents();
    renderSidebar();
    renderHomepageCategories();
    
    // 搜索框事件
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce((e) => {
        searchAgents(e.target.value);
    }, 300));

    // 为搜索结果容器添加事件委托监听器（使用捕获阶段确保优先处理）
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.addEventListener('click', handleSearchResultsClick, true);
    console.log('已为搜索结果容器添加事件委托监听器');

    // 为左上角标题添加点击事件（回到首页）
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.style.cursor = 'pointer';
        navLogo.addEventListener('click', goToHomepage);
        console.log('已为标题添加回到首页点击事件');
    }

    // 点击外部关闭搜索结果
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.nav-search');
        const searchResultsEl = document.getElementById('searchResults');
        
        // 如果点击的是搜索结果项或其子元素，不关闭搜索结果（让事件委托处理）
        if (e.target.closest('.search-result-item')) {
            return;
        }
        
        // 如果点击不在搜索容器内，关闭搜索结果
        if (searchContainer && !searchContainer.contains(e.target)) {
            if (searchResultsEl && searchResultsEl.classList.contains('active')) {
                searchResultsEl.classList.remove('active');
            }
        }
    }, false);

    var sendBtn = document.getElementById('submitBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof sendChatMessage === 'function') sendChatMessage();
        });
    }
    var stopBtn = document.getElementById('cozeStopBtn');
    if (stopBtn) stopBtn.addEventListener('click', function () { if (typeof stopStreaming === 'function') stopStreaming(); });

}

// 页面加载完成后初始化
window.onload = initializePage;
