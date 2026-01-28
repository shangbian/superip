// API 配置
const API_BASE_URL = 'http://localhost:3003/api/coze';

// 所有智能体的原始数据（用于提取）
const allAgentsMap = {
    1: { id: 1, name: '七天选题智能体', description: '自动生成一周的高效视频选题，涵盖吸引粉丝、建立人设和促进转化三类目标。', fullDescription: '功能定义：自动生成一周的高效视频选题，涵盖吸引粉丝、建立人设和促进转化三类目标。\n使用场景：每周内容策划时，快速产出兼具吸引力和商业价值的选题清单。\n核心价值：解决"拍什么"的难题，系统化保障内容质量与数量，维持账号活跃度与粉丝增长。', inputGuide: '请提供你的行业与核心产品信息（按以下格式），加上日期（可选）\n→ [行业类型]店/公司 + [核心产品/服务]\n例如：少儿编程培训（ToC教育服务）' },
    2: { id: 2, name: 'A融入B智能体', description: '将客户喜欢的内容（A）转化为（B）爆款框架进行表达。', fullDescription: '功能定义：将客户喜欢的内容（A）转化为（B）爆款框架进行表达。\n使用场景：知识型、技术型、服务型企业创作科普类、教学类爆款短视频内容。\n核心价值：降低创作门槛，让小白也能做出爆款，同时解决抄袭举报问题。', inputGuide: '第1次先发A文案，核心主题或信息，第2次再发B文案，按照a的内容+ B的结构，创造出全新的文案。' },
    3: { id: 3, name: '同行劲爆文案仿写智能体', description: '对同行千万级大爆款文案或视频脚本进行多风格、多角度的高效重写与优化。', fullDescription: '功能定义：对同行千万级大爆款文案或视频脚本进行多风格、多角度的高效重写与优化。\n使用场景：一条爆款视频需生成多个版本以测试效果，或旧内容需要翻新再次发布。\n核心价值：极大提升内容复用效率，实现"一鱼多吃"，持续挖掘单个选题的流量潜力。', inputGuide: '输入短视频文案，生成深度原创且风格高度相似的文案。' },
    4: { id: 4, name: '热点文案智能体', description: '输入实时热点关键词或扒皮文案，生成与人群相关的热点借势视频创意。', fullDescription: '功能定义：输入实时热点关键词或扒皮文案，生成与人群相关的热点借势视频创意。\n使用场景：需要快速响应网络热点，获取短期流量爆发时，解决热点抓不住的问题。\n核心价值：抓住流量红利，低成本获取高曝光，为账号注入爆发性流量。', inputGuide: '输入热点事件相关信息，生成文案' },
    5: { id: 5, name: '自我反思与成长话题智能体', description: '挖掘与目标用户息息相关的长期性话题，生成内容创作方向。', fullDescription: '功能定义：挖掘与目标用户息息相关的长期性话题，生成内容创作方向。\n使用场景：规划非热点类的常规视频内容，确保内容始终贴近用户兴趣。\n核心价值：保障账号基础流量，建立稳定的内容体系，强化用户粘性。', inputGuide: '输入1，直接生成【自我反思与成长】的爆款文案' },
    6: { id: 6, name: '行业+形容词大字报智能体', description: '专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。', fullDescription: '功能定义：专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。\n使用场景：制作信息密度高、观点冲击力强的图文视频或视频中的文字贴片。\n核心价值：在3秒内抓住用户注意力，提升视频完播率，适合传递核心观点和卖点。', inputGuide: '输入以下信息：\n核心行业/领域：(例如：美容美体)\n核心产品/服务名称或类型：(例如：纹绣技术)\n希望在首行突出的"形容词/核心卖点短语"：(请提供1-3个备选)\n产品/服务的主要优势、功能特点、能解决的用户痛点：(请列举至少3-5项)\n目标用户群体画像或主要适用场景：\n可选：希望加入的行动号召或相关话题标签：' },
    7: { id: 7, name: '万万没想到大字报智能体', description: '专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。', fullDescription: '功能定义：专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。\n使用场景：制作信息密度高、观点冲击力强的图文视频或视频中的文字贴片。\n核心价值：在3秒内抓住用户注意力，提升视频完播率，适合传递核心观点和卖点。', inputGuide: '输入以下信息进行创作：\n核心体验/产品/服务：\n"万万没想到"的具体惊喜点/超预期效果：(这是文案的灵魂，请详细描述)\n希望引发的情感或用户反应：\n可选：目标用户群体希望触达的痛点：\n可选：希望加入的行动号召或相关话题标签：' },
    8: { id: 8, name: '什么地方出现什么东西大字报智能体', description: '专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。', fullDescription: '功能定义：专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。\n使用场景：制作信息密度高、观点冲击力强的图文视频或视频中的文字贴片。\n核心价值：在3秒内抓住用户注意力，提升视频完播率，适合传递核心观点和卖点。', inputGuide: '输入以下信息进行创作：\n具体地点名称（什么地方）：\n出现的新奇事物/现象/创新模式（什么东西）：\n"意外转折/影响"的具体内容：\n"用户/顾客反馈"的核心内容：\n"大众/网友呼吁/热议"的核心内容：' },
    9: { id: 9, name: '人设体大字报智能体', description: '专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。', fullDescription: '功能定义：专门用于生成短视频中的图文类（大字报）内容文案与视觉提示。\n使用场景：制作信息密度高、观点冲击力强的图文视频或视频中的文字贴片。\n核心价值：在3秒内抓住用户注意力，提升视频完播率，适合传递核心观点和卖点。', inputGuide: '输入以下信息进行创作：\n1.姓名/称呼：\n2.家乡/所在地：\n3.年龄段/代际标签（可选）：\n4.从事行业/业务类型：\n5.从业年限：\n6.业务规模/场地描述：\n7.核心理念/价值观/目标：\n8.特定的请求/互动行为（可选）：\n9.投资金额：\n10.公司/品牌名：' },
    10: { id: 10, name: '千万不要钩子口播智能体', description: '生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。', fullDescription: '功能定义：生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。\n使用场景：为任何视频创作高效的开头与中间和结尾，完成4大数据指标。\n核心价值：提升视频的4个关键流量指标，是视频能否拿到海量客资的关键。', inputGuide: '输入爆款文案进行改写创作：' },
    11: { id: 11, name: '你敢相信吗钩子口播智能体', description: '生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。', fullDescription: '功能定义：生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。\n使用场景：为任何视频创作高效的开头与中间和结尾，完成4大数据指标。\n核心价值：提升视频的4个关键流量指标，是视频能否拿到海量客资的关键。', inputGuide: '输入爆款文案进行改写创作：' },
    12: { id: 12, name: '你知道什么有多牛吗钩子口播智能体', description: '生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。', fullDescription: '功能定义：生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。\n使用场景：为任何视频创作高效的开头与中间和结尾，完成4大数据指标。\n核心价值：提升视频的4个关键流量指标，是视频能否拿到海量客资的关键。', inputGuide: '输入爆款文案进行改写创作：' },
    13: { id: 13, name: '什么马上迎来大爆发钩子口播智能体', description: '生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。', fullDescription: '功能定义：生成短视频的打粉型口播脚本，旨在瞬间抓住用户注意力并完成吸粉。\n使用场景：为任何视频创作高效的开头与中间和结尾，完成4大数据指标。\n核心价值：提升视频的4个关键流量指标，是视频能否拿到海量客资的关键。', inputGuide: '输入爆款文案进行改写创作：' },
    14: { id: 14, name: '短视频配套文案智能体', description: '自动生成短视频的标题、描述、评论区引导语等配套文案。', fullDescription: '功能定义：自动生成短视频的标题、描述、评论区引导语等配套文案。\n使用场景：视频剪辑完成后，快速撰写能提升点击率、互动率和转化率的文案。\n核心价值：完善视频发布细节，提升算法推荐概率，引导用户完成点赞、评论、私信等动作。', inputGuide: '输入原文案' },
    15: { id: 15, name: '稀缺观点生成智能体', description: '生成行业内独特、前沿或反常识的观点与洞察。', fullDescription: '功能定义：生成行业内独特、前沿或反常识的观点与洞察。\n使用场景：打造专家、创始人IP，需要输出震撼观点树立行业权威时。\n核心价值：通过信息差建立品牌心智，吸引高质量用户关注，实现"心智捕鱼"。', inputGuide: '输入1，直接生成10种风格文案（针对城市大会）' },
    16: { id: 16, name: '独特观点性感传播语生成智能体', description: '将复杂观点浓缩成一句朗朗上口、易于传播的金句或口号。', fullDescription: '功能定义：将复杂观点浓缩成一句朗朗上口、易于传播的金句或口号。\n使用场景：用于视频标题、结尾slogan、评论区互动，强化品牌记忆点。\n核心价值：降低传播成本，一句话让用户记住你，提升品牌影响力。', inputGuide: '输入一个观点或概念' },
    17: { id: 17, name: '牛逼案例生成智能体', description: '将客户成功案例转化为富有感染力的故事化叙述脚本。', fullDescription: '功能定义：将客户成功案例转化为富有感染力的故事化叙述脚本。\n使用场景：创作客户见证、成果展示类视频，用事实说服潜在客户。\n核心价值：提供最强社会证明，有效打消用户疑虑，直接推动成交转化。', inputGuide: '输入1直接生成\n或用户提供一个真实案例的基本信息，包括：\n- 客户背景/行业\n- 初始问题/痛点\n- 采取的解决方案\n- 取得的具体成果\n- (可选)客户反馈或感言' },
    18: { id: 18, name: '起号3件套文案生成智能体', description: '为新账号快速生成奠定基础、明确调性的核心视频文案套装。', fullDescription: '功能定义：为新账号快速生成奠定基础、明确调性的核心视频文案套装。\n使用场景：新账号冷启动阶段，快速发布首批定义账号价值的关键视频。\n核心价值：高效解决新账号"从0到1"的内容问题，快速完成账号定位传达。', inputGuide: '输入：你的网名或者姓名+你在哪里+你是做什么的+做了多少年+取得了什么成就等\n[您的行业]：\n[核心业务]：\n[最强成果]：\n[客户收益]：\n[行业情怀]：' },
    19: { id: 19, name: '老板故事文案生成智能体', description: '为创始人/老板生成用于打造个人IP的故事化视频脚本。', fullDescription: '功能定义：为创始人/老板生成用于打造个人IP的故事化视频脚本。\n使用场景：创作账号置顶视频，讲述创业初心、品牌故事，建立信任。\n核心价值：以人为本，情感连接，将老板打造成品牌最佳代言人，深化信任。', inputGuide: '通过多轮对话信息完整后生成' },
    20: { id: 20, name: '产品故事文案生成智能体', description: '生成突出产品核心价值与差异化的故事化视频脚本。', fullDescription: '功能定义：生成突出产品核心价值与差异化的故事化视频脚本。\n使用场景：创作账号第二条置顶视频，清晰传达产品为何值得选择。\n核心价值：让产品自己说话，聚焦价值而非功能，激发用户购买欲望。', inputGuide: '通过多轮对话信息完整后生成' },
    21: { id: 21, name: '联系我们文案生成智能体', description: '生成引导用户主动咨询、私信或下单的行动号召型视频脚本。', fullDescription: '功能定义：生成引导用户主动咨询、私信或下单的行动号召型视频脚本。\n使用场景：创作账号第三条置顶视频，明确告知用户下一步行动路径。\n核心价值：完成临门一脚，将流量高效转化为客资，形成获客闭环。', inputGuide: '输入"姓名+行业"格式的信息' },
    22: { id: 22, name: '直播脚本生成智能体', description: '生成详细到分钟的单场直播话术脚本，包括互动、讲解、逼单环节。', fullDescription: '功能定义：生成详细到分钟的单场直播话术脚本，包括互动、讲解、逼单环节。\n使用场景：直播前，为主播/嘉宾提供标准化、高转化的话术流程。\n核心价值：稳定直播质量，避免冷场或遗漏卖点，最大化直播期间的销售转化。', inputGuide: '用户需提供以下信息：\n直播主题/标题\n产品名称及类别\n产品主要功能/特点(3-5点)\n产品价格/活动信息\n目标受众群体\n直播预计时长(默认60分钟)\n(可选)品牌调性关键词\n(可选)主播个人特点' },
    23: { id: 23, name: '直播投流素材文案生成智能体', description: '生成用于直播预告和直播付费推广的视频文案与素材创意。', fullDescription: '功能定义：生成用于直播预告和直播付费推广的视频文案与素材创意。\n使用场景：直播开始前，制作引流视频，为直播间预热和拉流。\n核心价值：提升直播间的初始流量，解决"无人观看"的问题，放大直播效果。', inputGuide: '用户需提供以下基本信息：\n- 直播主题/标题\n- 目标客户群体(年龄、性别、兴趣等)\n- 直播时间\n- 直播主要内容/卖点(3-5点)\n- (可选)主播特点/风格\n- (可选)预期直播氛围\n- (可选)平台选择(抖音/视频号)' },
    24: { id: 24, name: '万能朋友圈文案生成智能体', description: '生成适用于多种营销目的的朋友圈文案。', fullDescription: '功能定义：生成适用于多种营销目的（人设打造、产品宣发、活动预热）的朋友圈文案。\n使用场景：每日经营微信朋友圈，持续输出价值内容，维护客户关系。\n核心价值：高效经营私域阵地，潜移默化地影响客户决策，提升品牌好感度。', inputGuide: '1. 自由输入模式：输入任意事件/感悟，自动生成高质量朋友圈\n2. 数字指令模式：输入数字调用结构化问答模板（默认含6大场景）\n   输入 1 → 生活圈模板（展现真实自我）\n   输入 2 → 价值圈模板（输出干货观点）\n   输入 3 → 产品圈模板（发布产品/活动）\n   输入 4 → 证言圈模板（展示客户好评）\n   输入 5 → 交付圈模板（呈现服务过程）\n   输入 6 → 成交圈模板（促进行动转化）\n   输入 0 → 查看所有模板指令' },
    25: { id: 25, name: '群文案智能体', description: '针对不同意向度的客户，生成精准的1对1沟通话术或社群发言内容。', fullDescription: '功能定义：针对不同意向度的客户，生成精准的1对1沟通话术或社群发言内容。\n使用场景：对微信好友进行标签分类后，进行差异化的精准内容触达和互动。\n核心价值：实现"千人千面"的精准培育，在不同阶段提供最合适的内容，大幅提升转化率与复购率。', inputGuide: '你只需要告诉我，你的目标人群级别1-5号：\n级别1（已成交）：行动阶段，高成熟度。\n级别2（2年内参加活动未成交）：决策阶段，中高成熟度。\n级别3（5年内成交但最近2年未成交）：兴趣或决策阶段，但成熟度可能下降。\n级别4（线上关注有行为）：兴趣阶段，中低成熟度。\n级别5（仅有联系方式）：认知阶段，低成熟度。\n\n产品/服务类别， 核心卖点(3-5点)， 目标客户特征(年龄、职业、痛点等)。\n沟通场景(1对1聊天/社群互动)' },
    26: { id: 26, name: '公众号文案生成智能体', description: '生成深度长文内容，适用于公众号，知乎等平台。', fullDescription: '功能定义：生成深度长文内容，适用于公众号，知乎等平台。\n使用场景：需要输出深度内容，建立专业权威，培育高价值用户。\n核心价值：以深度内容建立品牌壁垒，吸引和沉淀高质量用户，完成心智占领。', inputGuide: '用户需提供以下基本信息：\n- 文章主题/核心概念\n- (可选)目标受众群体\n- (可选)行业/领域\n- (可选)深度方向指引\n- (可选)品牌定位/调性\n- (可选)期望突出的专业角度' },
    27: { id: 27, name: '私域直播稿生成智能体', description: '生成详细到分钟的单场直播话术脚本，包括互动、讲解、逼单环节。', fullDescription: '功能定义：生成详细到分钟的单场直播话术脚本，包括互动、讲解、逼单环节。\n使用场景：直播前，为主播/嘉宾提供标准化、高转化的话术流程。\n核心价值：稳定直播质量，避免冷场或遗漏卖点，最大化直播期间的销售转化。', inputGuide: '用户需提供以下基本信息：\n- 直播主题/产品名称\n- 直播目标(知识分享/产品介绍/问题解决/直接成交)\n- 目标受众特征(人群画像、痛点、需求)\n- 产品/服务核心卖点(3-5点)\n- 价格/活动方案\n- (可选)常见疑虑/反对点\n- (可选)直播预计时长(默认60分钟)\n- (可选)主播风格/特点' },
    28: { id: 28, name: '私域直播业务员跟单话术智能体', description: '生成私域直播过程中，业务员在群内互动、答疑、烘托气氛、实时跟单的话术。', fullDescription: '功能定义：生成私域直播过程中，业务员在群内互动、答疑、烘托气氛、实时跟单的话术。\n使用场景：私域直播中，配合主播进行氛围营造和促单，应对客户各种问题。\n核心价值：形成团队协作，多对一服务，营造抢购氛围，提升直播成交率。', inputGuide: '用户需提供以下基本信息：\n- 直播主题/产品名称\n- 产品核心卖点(3-5点)\n- 直播特殊活动/优惠\n- 产品价格区间\n- 目标客户特征\n- (可选)主要竞品/替代方案\n- (可选)常见问题/顾虑\n- (可选)业务员人数\n- (可选)主播风格特点' },
    29: { id: 29, name: '招商会/销讲话术生成智能体（讲师用）', description: '为会议主讲人生成结构完整、富有感染力的招商演讲或产品发布稿。', fullDescription: '功能定义：为会议主讲人生成结构完整、富有感染力的招商演讲或产品发布稿。生成会议全流程执行方案。\n使用场景：筹备招商会、产品发布会、大型培训会等活动的讲师讲稿。\n核心价值：确保会议核心内容专业、流畅，有效影响听众决策，提升现场氛围，确保会议井井有条。', inputGuide: '用户需提供以下基本信息：\n- 会议主题或产品名称\n- 目标受众(身份、背景、需求)\n- 核心卖点(3-5点)\n- 合作模式/价格方案\n- 演讲时长(默认45-90分钟)\n- (可选)行业背景/市场现状\n- (可选)讲师背景/风格偏好\n- (可选)预期达成目标\n- (可选)常见抵触点/顾虑' },
    30: { id: 30, name: '招商流程生成智能体（运营用）', description: '生成会议全流程执行方案，包括会前、会中、会后各环节的运营细节。', fullDescription: '功能定义：生成会议全流程执行方案，包括会前、会中、会后各环节的运营细节。\n使用场景：会议总策划人员统筹安排会议全流程执行工作。\n核心价值：确保会议井井有条，环节之间无缝衔接，提供卓越的参会体验。', inputGuide: '用户需提供以下基本信息：\n- 会议主题/招商项目名称\n- 会议规模(预计参会人数)\n- 会议时长与形式(线上/线下/混合)\n- 目标受众群体\n- 预期招商目标\n- (可选)会议地点/平台\n- (可选)主讲人信息\n- (可选)特殊要求或环节\n- (可选)预算范围' },
    31: { id: 31, name: '招商会客户群同步投喂话术智能体（业务员用）', description: '生成会议期间，业务员在客户群内同步内容、互动、答疑、促单的话术。', fullDescription: '功能定义：生成会议期间，业务员在客户群内同步内容、互动、答疑、促单的话术。\n使用场景：线下会议期间，在线上客户群内进行同步运营，强化现场氛围。\n核心价值：线上线下联动，放大会议影响力，覆盖更多客户，提升整体签约率。', inputGuide: '用户需提供以下基本信息：\n- 会议主题/招商项目名称\n- 会议流程与时间安排\n- 主讲核心内容要点(3-5点)\n- 合作模式/产品核心卖点\n- 目标客户群体特征\n- (可选)现场特殊活动/优惠\n- (可选)群内成员构成特点\n- (可选)常见问题与顾虑\n- (可选)群投喂节奏偏好' },
    32: { id: 32, name: '个人IP起号视频文案（教育创业者）', description: '为教育创业者生成个人IP起号视频文案。', fullDescription: '功能定义：为教育创业者生成个人IP起号视频文案。', inputGuide: '基本信息：\n- 身份定位：\n- 转变历程：\n- 时间跨度：\n- 核心成果：' },
    33: { id: 33, name: '个人IP起号视频文案（商机共享从业者）', description: '为商机共享行业的资深从业者生成个人IP起号视频文案。', fullDescription: '功能定义：为商机共享行业的资深从业者生成个人IP起号视频文案。', inputGuide: '基本信息：\n- 身份定位：\n- 转变历程：\n- 时间跨度：\n- 核心成果：' },
    34: { id: 34, name: '大会邀约短视频文案智能体', description: '自动生成大会邀约短视频文案。', fullDescription: '功能定义：自动生成大会邀约短视频文案。', inputGuide: '请提供活动信息，时间，地点，主题，亮点，我将先为您生成5条完整文案供确认' },
    35: { id: 35, name: '行业痛点短视频脚本生成智能体', description: '选择对应行业，输入产品核心卖点，生成适配该行业用户痛点的场景化短视频脚本。', fullDescription: '功能定义：选择对应行业（如医疗健康 / 消费生活），输入产品核心卖点，生成适配该行业用户痛点的场景化短视频脚本（含剧情、台词、镜头建议）。\n使用场景：为不同行业项目方定制内容时，解决 "脚本不贴合行业用户认知" 的问题。\n核心价值：精准戳中行业用户痛点，提升内容共鸣度，让不同赛道的产品脚本都能适配目标人群偏好。', inputGuide: '请提供以下信息（按格式填写）：\n→ [具体行业] + [核心产品/服务] + [核心目标人群] + [产品核心卖点1-3个]' },
    36: { id: 36, name: '短视频脚本不同平台适配智能体', description: '选择发布平台，输入基础视频脚本，自动调整内容风格、节奏、话术。', fullDescription: '功能定义：选择发布平台（抖音 / 视频号 / 快手），输入基础视频脚本，自动调整内容风格、节奏、话术（如抖音更紧凑、视频号更侧重私域引导）。\n使用场景：同一内容多平台分发时，解决 "平台算法 / 用户习惯不匹配" 的问题。\n核心价值：适配各平台流量规则，让单条内容在不同渠道都能获得最优推荐，提升跨平台曝光效率。', inputGuide: '输入原始脚本内容，以及要发布的平台（抖音 / 视频号 / 快手 / 小红书）' }
};

// 按新业务分类标准组织的智能体数据
const agentsData = {
    '认知唤醒层 (外域引流)': [
        allAgentsMap[1],
        allAgentsMap[4],
        allAgentsMap[15],
        allAgentsMap[16],
        allAgentsMap[18],
        allAgentsMap[23]
    ],
    '爆款内容与痛点触达': [
        allAgentsMap[2],
        allAgentsMap[3],
        allAgentsMap[5],
        allAgentsMap[35],
        allAgentsMap[36]
    ],
    '视觉冲击与"钩子"锁客': [
        allAgentsMap[6],
        allAgentsMap[7],
        allAgentsMap[8],
        allAgentsMap[9],
        allAgentsMap[10],
        allAgentsMap[11],
        allAgentsMap[12],
        allAgentsMap[13]
    ],
    '信任背书与IP人设': [
        allAgentsMap[17],
        allAgentsMap[19],
        allAgentsMap[20],
        allAgentsMap[32],
        allAgentsMap[33]
    ],
    '私域经营与精细培育': [
        allAgentsMap[14],
        allAgentsMap[24],
        allAgentsMap[25],
        allAgentsMap[26]
    ],
    '营销转化与招商成交': [
        allAgentsMap[21],
        allAgentsMap[22],
        allAgentsMap[27],
        allAgentsMap[28],
        allAgentsMap[29],
        allAgentsMap[30],
        allAgentsMap[31],
        allAgentsMap[34]
    ]
};

let currentAgent = null;
let agentHistory = {};
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
        
        // 检查当前智能体是否在此分类中，如果是则展开
        const hasCurrentAgent = currentAgent && agents.some(a => a.id === currentAgent.id);
        categoryGroup.className = hasCurrentAgent ? 'category-group' : 'category-group collapsed'; // 默认收起，当前智能体所在分类展开

        const agentCount = agents.length; // 获取智能体数量
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <span>${categoryName} <span style="opacity: 0.7; font-size: 0.85em;">(${agentCount})</span></span>
            <span class="category-toggle">${hasCurrentAgent ? '▼' : '▶'}</span>
        `;
        categoryHeader.onclick = () => {
            const isCollapsed = categoryGroup.classList.toggle('collapsed');
            // 更新图标
            const toggleIcon = categoryHeader.querySelector('.category-toggle');
            toggleIcon.textContent = isCollapsed ? '▶' : '▼';
        };

        const agentList = document.createElement('div');
        agentList.className = 'agent-list';

        agents.forEach(agent => {
            const agentItem = document.createElement('div');
            agentItem.className = 'agent-item';
            if (currentAgent && currentAgent.id === agent.id) {
                agentItem.classList.add('active');
            }
            if (agentHistory[agent.id]) {
                agentItem.classList.add('has-history');
            }
            agentItem.innerHTML = `<span class="agent-item-name">${agent.name}</span>`;
            agentItem.onclick = () => switchAgent(agent);
            agentList.appendChild(agentItem);
        });

        categoryGroup.appendChild(categoryHeader);
        categoryGroup.appendChild(agentList);
        sidebarContent.appendChild(categoryGroup);
    }
}

// 切换智能体（优化版）
function switchAgent(agent, saveCurrent = true) {
    console.log('========== switchAgent 开始 ==========');
    console.log('传入的智能体:', agent);
    console.log('智能体 ID:', agent?.id, '名称:', agent?.name);
    
    if (!agent || !agent.id) {
        console.error('switchAgent: 无效的智能体对象', agent);
        showToast('切换失败：智能体数据无效', 'error');
        return;
    }
    
    // 保存当前智能体状态
    if (saveCurrent && currentAgent) {
        const userInput = document.getElementById('userInput').value.trim();
        const resultCard = document.getElementById('resultCard');
        const hasOutput = resultCard.classList.contains('active');
        
        if (userInput || hasOutput) {
            if (!agentHistory[currentAgent.id]) {
                agentHistory[currentAgent.id] = {};
            }
            
            if (userInput) {
                agentHistory[currentAgent.id].input = userInput;
            }
            
            if (hasOutput && !agentHistory[currentAgent.id].output) {
                const resultContent = document.getElementById('resultContent');
                agentHistory[currentAgent.id].output = resultContent.innerText;
            }
        }
    }

    // 切换到新智能体
    currentAgent = agent;
    console.log('已设置 currentAgent:', currentAgent.name);
    
    // 隐藏首页指引，显示智能体信息卡片
    document.getElementById('homepageGuide').style.display = 'none';
    document.getElementById('agentInfoCard').style.display = 'block';
    document.getElementById('selectedAgentName').textContent = agent.name;
    
    const infoBox = document.getElementById('agentInfoBox');
    infoBox.innerHTML = `
        <h3>智能体介绍</h3>
        <p>${agent.fullDescription.replace(/\n/g, '<br>')}</p>
        <h3 style="margin-top: 20px;">输入要求</h3>
        <p>${agent.inputGuide.replace(/\n/g, '<br>')}</p>
    `;

    // 恢复历史记录
    const history = agentHistory[agent.id];
    if (history) {
        document.getElementById('userInput').value = history.input || '';
        if (history.output) {
            displayResult(history.output);
        } else {
            document.getElementById('resultCard').classList.remove('active');
        }
    } else {
        document.getElementById('userInput').value = '';
        document.getElementById('resultCard').classList.remove('active');
        document.getElementById('resultContent').innerHTML = '';
    }

    // 更新侧边栏高亮
    renderSidebar();
    
    // 关闭移动端侧边栏
    closeSidebar();

    console.log('switchAgent 完成，已切换到:', agent.name);
    console.log('========== switchAgent 结束 ==========');
    showToast('已切换到：' + agent.name, 'success');
}

// 切换智能体提示
function switchAgentPrompt() {
    document.getElementById('searchInput').focus();
    showToast('在搜索框中输入关键词或从侧边栏选择', 'success');
}

// 执行工作流
async function executeWorkflow() {
    if (!currentAgent) {
        showToast('请先选择一个智能体', 'error');
        return;
    }

    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) {
        showToast('请输入您的信息', 'error');
        return;
    }

    const submitButton = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const resultCard = document.getElementById('resultCard');

    submitButton.disabled = true;
    submitButton.textContent = '生成中...';
    loading.classList.add('active');
    resultCard.classList.remove('active');

    try {
        const response = await fetch(`${API_BASE_URL}/workflow/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                choice: currentAgent.id,
                userInput: userInput,
                topic: userInput  // 将USER_INPUT的值赋给topic
            })
        });

        const data = await response.json();
        console.log('后端返回数据:', data);

        if (data.success && data.data) {
            let outputContent = data.data.output || '';
            
            // 检查是否是错误消息
            if (outputContent && outputContent.includes('响应数据格式异常')) {
                console.error('后端返回格式异常:', data);
                showToast('数据响应格式异常，请查看浏览器控制台和后端日志', 'error');
                // 显示详细错误信息
                displayResult(`## ⚠️ 数据响应格式异常\n\n**错误信息：** ${outputContent}\n\n**请检查：**\n1. 后端控制台日志中的完整响应数据\n2. Coze API 返回的数据格式是否已变更\n3. 工作流配置是否正确\n\n**原始响应数据（前1000字符）：**\n\`\`\`json\n${JSON.stringify(data.data.raw || data.data, null, 2).substring(0, 1000)}\n\`\`\``);
                return;
            }
            
            if (outputContent && outputContent.trim() !== '') {
                agentHistory[currentAgent.id] = {
                    input: userInput,
                    output: outputContent,
                    timestamp: new Date().toISOString()
                };
                
                displayResult(outputContent);
                renderSidebar(); // 更新历史记录标识
                showToast('内容生成成功！', 'success');
            } else {
                console.warn('生成内容为空，完整响应:', data);
                showToast('生成内容为空，请查看控制台', 'error');
                // 显示原始数据以便调试
                displayResult(`## ⚠️ 生成内容为空\n\n**响应数据：**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``);
            }
        } else {
            console.error('API返回失败:', data);
            const errorMessage = data.message || '未知错误';
            showToast('生成失败：' + errorMessage, 'error');
            
            // 显示详细错误信息
            let errorDetails = `## ❌ 生成失败\n\n**错误信息：** ${errorMessage}\n\n`;
            
            // 如果是超时错误，显示友好的提示
            if (errorMessage.includes('超时') || errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
                errorDetails += `**可能的原因：**\n1. 工作流执行时间较长，超过了预设的超时时间\n2. 工作流中包含复杂的处理逻辑或大量数据处理\n3. 网络连接不稳定导致响应延迟\n\n`;
                errorDetails += `**建议解决方案：**\n1. 稍后重试（工作流可能需要更长时间才能完成）\n2. 检查工作流配置，优化长时间运行的操作\n3. 如果问题持续存在，请联系管理员检查工作流配置\n4. 可以尝试简化输入内容，减少处理时间\n\n`;
            }
            // 如果是 Coze API 错误，显示更详细的信息
            else if (errorMessage.includes('Missing required parameters') || errorMessage.includes('缺少必需参数')) {
                errorDetails += `**可能的原因：**\n1. 工作流配置中定义了必需参数，但请求中未提供\n2. parameters 对象中缺少工作流需要的参数\n3. 请检查工作流的输入节点配置，确认需要哪些参数\n\n`;
                errorDetails += `**建议解决方案：**\n1. 检查工作流配置，查看输入节点定义的必需参数\n2. 确保 parameters 对象包含所有必需字段\n3. 查看后端控制台日志中的完整请求和响应数据\n\n`;
            }
            
            if (data.error) {
                errorDetails += `**错误详情：**\n\`\`\`json\n${JSON.stringify(data.error, null, 2)}\n\`\`\`\n\n`;
            }
            
            errorDetails += `**完整响应数据：**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
            
            displayResult(errorDetails);
        }
    } catch (error) {
        console.error('API调用失败:', error);
        showToast('网络请求失败：' + error.message, 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = '生成内容';
        loading.classList.remove('active');
    }
}

// 显示结果
function displayResult(content) {
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');

    resultContent.innerHTML = marked.parse(content);
    resultCard.classList.add('active');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 复制结果
function copyResult() {
    const resultContent = document.getElementById('resultContent');
    const textToCopy = resultContent.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('内容已复制到剪贴板！', 'success');
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败，请手动复制', 'error');
    });
}

// 复制结果（包含输入）
function copyResultWithInput() {
    if (!currentAgent) return;
    
    const userInput = document.getElementById('userInput').value;
    const resultContent = document.getElementById('resultContent');
    const outputText = resultContent.innerText;
    
    const fullText = `【智能体】${currentAgent.name}\n\n【用户输入】\n${userInput}\n\n【生成结果】\n${outputText}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        showToast('完整内容已复制到剪贴板！', 'success');
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败，请手动复制', 'error');
    });
}

// 清空当前智能体的历史记录
function clearCurrentHistory() {
    if (!currentAgent) {
        showToast('请先选择一个智能体', 'error');
        return;
    }
    
    if (confirm('确定要清空当前智能体的输入和输出记录吗？')) {
        delete agentHistory[currentAgent.id];
        document.getElementById('userInput').value = '';
        document.getElementById('resultCard').classList.remove('active');
        document.getElementById('resultContent').innerHTML = '';
        renderSidebar();
        showToast('历史记录已清空', 'success');
    }
}

// 清空所有历史记录
function clearAllHistory() {
    const historyCount = Object.keys(agentHistory).length;
    
    if (historyCount === 0) {
        showToast('当前没有历史记录', 'error');
        return;
    }
    
    if (confirm(`确定要清空所有智能体的历史记录吗？\n当前共有 ${historyCount} 个智能体有保存的记录。`)) {
        agentHistory = {};
        document.getElementById('userInput').value = '';
        document.getElementById('resultCard').classList.remove('active');
        document.getElementById('resultContent').innerHTML = '';
        renderSidebar();
        showToast(`已清空所有历史记录（${historyCount}个）`, 'success');
    }
}

// 显示历史记录面板
function showHistoryPanel() {
    const historyCount = Object.keys(agentHistory).length;
    if (historyCount === 0) {
        showToast('当前没有历史记录', 'error');
        return;
    }
    
    let message = `共有 ${historyCount} 个智能体有历史记录：\n\n`;
    for (const [agentId, history] of Object.entries(agentHistory)) {
        const agent = allAgents.find(a => a.id === parseInt(agentId));
        if (agent) {
            message += `• ${agent.name}\n`;
        }
    }
    alert(message);
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
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
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

    // Ctrl/Cmd + ←/→: 切换智能体（如果有历史记录）
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
});

// 分类说明数据
const categoryDescriptions = {
    '认知唤醒层 (外域引流)': {
        description: '针对级别5客户，第1级引流型产品。重点论证"行业下行，结论是合作"。严禁使用"最、独创"等词汇。',
        agents: ['七天选题', '热点文案', '稀缺观点', '传播金句', '起号3件套', '直播投流素材']
    },
    '爆款内容与痛点触达': {
        description: '针对级别4客户，认知与需求激发。唤醒内在动力，指明转型路径。内容需贴近客户熟悉的行业场景。',
        agents: ['A融入B', '同行文案仿写', '自我反思话题', '行业痛点脚本', '平台适配智能体']
    },
    '视觉冲击与"钩子"锁客': {
        description: '从认知转向兴趣，低门槛互动。突出"0投入"和"闪电式"优势。强调"三层风控"与"30天冷静期"逻辑。',
        agents: ['行业+形容词大字报', '万万没想到大字报', '地点+东西大字报', '人设体大字报', '千万不要钩子', '你敢相信吗钩子', '你知道有多牛钩子', '马上大爆发钩子']
    },
    '信任背书与IP人设': {
        description: '针对级别2客户，第2级信心催化剂。塑造"企业家成长陪跑者"人设。案例需脱敏，严禁承诺收益或成功率。',
        agents: ['牛逼案例', '老板故事', '产品故事', '个人IP起号（教育）', '个人IP起号（商机）']
    },
    '私域经营与精细培育': {
        description: '针对级别3客户（休眠）和级别4客户（关注）。以高频互动建立亲切感。针对不同成熟度等级提供差异化话术。',
        agents: ['短视频配套文案', '万能朋友圈', '群文案', '公众号文案']
    },
    '营销转化与招商成交': {
        description: '针对级别1/2客户，第3级价值实现体。核心载体为"线下合作说明会"。强调"流程透明、主权在握、风险共担"。',
        agents: ['联系我们', '直播脚本', '私域直播稿', '业务员跟单话术', '招商/销讲话术', '招商流程生成', '客户群同步投喂', '大会邀约文案']
    }
};

// 智能体图标映射 - 为每个智能体分配不同的图标
const agentIcons = {
    1: '📅',   // 七天选题智能体 - 日历
    2: '🔄',   // A融入B智能体 - 循环/转换
    3: '✍️',   // 同行劲爆文案仿写智能体 - 写作
    4: '🔥',   // 热点文案智能体 - 火焰
    5: '💭',   // 自我反思与成长话题智能体 - 思考
    6: '📊',   // 行业+形容词大字报智能体 - 图表
    7: '💡',   // 万万没想到大字报智能体 - 灯泡
    8: '📍',   // 什么地方出现什么东西大字报智能体 - 位置
    9: '👤',   // 人设体大字报智能体 - 人物
    10: '⚠️',  // 千万不要钩子口播智能体 - 警告
    11: '❓',  // 你敢相信吗钩子口播智能体 - 问号
    12: '💪',  // 你知道什么有多牛吗钩子口播智能体 - 力量
    13: '🚀',  // 什么马上迎来大爆发钩子口播智能体 - 火箭
    14: '📝',  // 短视频配套文案智能体 - 笔记
    15: '💎',  // 稀缺观点生成智能体 - 钻石
    16: '✨',  // 独特观点性感传播语生成智能体 - 星星
    17: '🏆',  // 牛逼案例生成智能体 - 奖杯
    18: '🎯',  // 起号3件套文案生成智能体 - 目标
    19: '👔',  // 老板故事文案生成智能体 - 领带
    20: '📦',  // 产品故事文案生成智能体 - 盒子
    21: '📞',  // 联系我们文案生成智能体 - 电话
    22: '📺',  // 直播脚本生成智能体 - 电视
    23: '📢',  // 直播投流素材文案生成智能体 - 喇叭
    24: '💬',  // 万能朋友圈文案生成智能体 - 对话
    25: '👥',  // 群文案智能体 - 人群
    26: '📰',  // 公众号文案生成智能体 - 报纸
    27: '🎙️',  // 私域直播稿生成智能体 - 麦克风
    28: '🤝',  // 私域直播业务员跟单话术智能体 - 握手
    29: '🎤',  // 招商会/销讲话术生成智能体（讲师用） - 麦克风
    30: '📋',  // 招商流程生成智能体（运营用） - 剪贴板
    31: '💼',  // 招商会客户群同步投喂话术智能体（业务员用） - 公文包
    32: '🎓',  // 个人IP起号视频文案（教育创业者） - 毕业帽
    33: '💼',  // 个人IP起号视频文案（商机共享从业者） - 公文包
    34: '🎪',  // 大会邀约短视频文案智能体 - 帐篷
    35: '🎬',  // 行业痛点短视频脚本生成智能体 - 电影
    36: '📱'   // 短视频脚本不同平台适配智能体 - 手机
};

// 渲染首页页签和智能体卡片
function renderHomepageCategories() {
    const tabsNav = document.getElementById('tabsNav');
    const tabsContent = document.getElementById('tabsContent');
    
    // 清空内容
    tabsNav.innerHTML = '';
    tabsContent.innerHTML = '';
    
    const categories = Object.keys(agentsData);
    
    // 创建页签按钮（简单文本标签形式，Coze风格）
    categories.forEach((categoryName, index) => {
        const agents = agentsData[categoryName];
        const tabButton = document.createElement('button');
        tabButton.className = `tab-button ${index === activeTabIndex ? 'active' : ''}`;
        tabButton.innerHTML = `
            ${categoryName}
            ${agents.length > 0 ? `<span class="tab-count">(${agents.length})</span>` : ''}
        `;
        tabButton.onclick = () => switchTab(index);
        tabsNav.appendChild(tabButton);
    });
    
    // 创建页签内容面板
    categories.forEach((categoryName, index) => {
        const agents = agentsData[categoryName];
        const tabPanel = document.createElement('div');
        tabPanel.className = `tab-panel ${index === activeTabIndex ? 'active' : ''}`;
        tabPanel.id = `tabPanel-${index}`;
        
        // 创建智能体卡片网格
        const agentsGrid = document.createElement('div');
        agentsGrid.className = 'agents-grid';
        
        // 为每个智能体创建卡片（Coze风格）
        agents.forEach(agent => {
            const agentCard = document.createElement('div');
            agentCard.className = 'agent-card';
            
            // 生成随机渐变色作为卡片顶部图片背景
            const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
            ];
            const randomGradient = gradients[agent.id % gradients.length];
            
            // 获取该智能体对应的图标，如果没有则使用默认图标
            const agentIcon = agentIcons[agent.id] || '🤖';
            
            agentCard.innerHTML = `
                <div class="agent-card-image" style="background: ${randomGradient};">
                    <span class="icon-placeholder">${agentIcon}</span>
                </div>
                <div class="agent-card-content">
                    <div class="agent-card-header">
                        <div class="agent-card-name">${agent.name}</div>
                        <span class="agent-card-type agent">智能体</span>
                    </div>
                    <div class="agent-card-provider">超级IP内容工厂</div>
                    <div class="agent-card-description">${agent.description}</div>
                    <div class="agent-card-footer">
                        <span class="agent-card-action">立即使用</span>
                        <span class="agent-card-category">${categoryName}</span>
                    </div>
                </div>
            `;
            
            // 点击卡片切换到智能体
            agentCard.onclick = () => {
                switchAgent(agent);
            };
            
            agentsGrid.appendChild(agentCard);
        });
        
        tabPanel.appendChild(agentsGrid);
        tabsContent.appendChild(tabPanel);
    });
}

// 切换页签
function switchTab(index) {
    if (index === activeTabIndex) return;
    
    // 更新页签按钮状态
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新页签面板状态
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach((panel, i) => {
        if (i === index) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
    
    activeTabIndex = index;
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // 隐藏智能体信息卡片，显示首页指引
    document.getElementById('agentInfoCard').style.display = 'none';
    document.getElementById('homepageGuide').style.display = 'block';
    
    // 隐藏结果卡片
    document.getElementById('resultCard').classList.remove('active');
    
    // 更新侧边栏（取消所有高亮）
    renderSidebar();
    
    // 重置到第一个页签
    if (activeTabIndex !== 0) {
        switchTab(0);
    }
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showToast('已返回首页', 'success');
}

// 初始化页面
function initializePage() {
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
    }, false); // 使用冒泡阶段
}

// 页面加载完成后初始化
window.onload = initializePage;
