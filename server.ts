import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini Client:', err);
  }
} else {
  console.log('Running in Demo mode without a configured Gemini API Key.');
}

// Fallback lists for high-quality mock recommendations when Gemini API is offline/unavailable
const FALLBACK_TOYS_DOG = [
  {
    name: '极限破坏王·硬核实心耐咬骨',
    category: 'chew',
    categoryLabel: '耐咬系列',
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600',
    tags: ['超凡坚固', '牙龈按摩', '释压解闷'],
    description: '采用高密度天然航空级橡胶压制，经受数万次咬合测试。独特的骨骼仿真设计，专治精力过剩的拆家魔王，陪伴磨牙不伤牙。',
    playGuide: '1. 初次玩耍可在槽孔中填充少量花生酱或肉泥封口。\n2. 推荐每天游戏20-30分钟，可以有效降低焦虑并清洁齿垢。\n3. 在草地上抛出让爱犬衔回，加强体能释放。',
    safetyWarning: '虽然坚固无比，仍建议在主人视线范围内使用，若出现明显穿透裂纹请及时更换。',
    suitabilityScore: 98,
    matchReason: '针对爱犬高强度的咬合习惯和磨牙渴望，本款硬核骨骼玩具能提供无与伦比的撕咬快感，完美宣泄拆家精力！'
  },
  {
    name: '多仓连锁智力迷宫漏食盘',
    category: 'puzzle',
    categoryLabel: '益智系列',
    imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600',
    tags: ['十级烧脑', '探索慢食', '防止空虚'],
    description: '多层可旋转滑动盖板，爱犬需要通过“先转后滑”或“双向推移”的多重逻辑操作，才能解锁藏在底部的美味零食。',
    playGuide: '1. 初学者先不要扣紧滑板，露出零食诱导其推拨。\n2. 逐渐增加盖板锁定，用手演示用口鼻或脚掌推开的动作。\n3. 当它解开难题时，及时给予赞美奖励。\n4. 推荐在爱犬独自在家、容易无聊或焦虑时作为心智启发玩具。',
    safetyWarning: '请勿放入潮湿或易变质的熟食，游玩后及时清洗各滑动死角。',
    suitabilityScore: 96,
    matchReason: '作为聪明、需要饱满大脑刺激的高智商狗狗，这款迷宫漏食盘能充分调动它强大的探索欲望，有效解决智商闲置导致的心理焦虑。'
  },
  {
    name: '破风追逐高弹轻量橡胶飞盘',
    category: 'active',
    categoryLabel: '运动自嗨',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600',
    tags: ['滑行持久', '接火冲刺', '防滑手感'],
    description: '流线动力飞翼，能在空中形成平稳升力。超柔弹力橡胶不仅能在抛接时温柔缓冲爱犬的咬合，更带有抗撕裂编织层，结实耐用。',
    playGuide: '1. 先在低空滑抛，让狗熟悉咬合感。\n2. 熟练后进行中远距离滞空投掷，训练其空中跃起抛接的能力。\n3. 夏季可在泳池或河边浅水区玩耍，本产品具备良好的漂浮性。',
    safetyWarning: '请勿在坚硬水泥地上频繁玩耍接咬动作，防止爱犬降落时关节受损。',
    suitabilityScore: 95,
    matchReason: '爱犬具有惊人的运动天赋和爆发力。这款高滞空轻量飞盘能极致伸展其奔跑与弹跳曲线，充分享受户外狂飙的追风快乐！'
  },
  {
    name: '激萌BB哨软毛绒响纸鳄鱼',
    category: 'squeak',
    categoryLabel: '声响玩具',
    imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600',
    tags: ['解压捏捏', '陪伴安抚', '无毒无害'],
    description: '采用超柔水晶面料，内置优质气囊声响器。在爱犬啃咬或挤压时发出逼真“唧唧”声，瞬间激发爱犬的捕猎天性与玩耍兴趣。',
    playGuide: '1. 在爱犬注意力分散时，按压小鳄鱼发出“唧唧”声吸引它。\n2. 将玩具扔向远处，让其追逐抢夺。',
    safetyWarning: '若玩具被咬破，请立即清理并丢弃破损部分，防止误吞。',
    suitabilityScore: 93,
    matchReason: '爱犬对清脆的发声和温暖柔软的质地情有独钟，这款会发出响声的鳄鱼玩偶能够陪伴它度过温馨安静的时间，也是优秀的释压伙伴。'
  }
];

const FALLBACK_TOYS_CAT = [
  {
    name: '猫咪薄荷互动转盘',
    category: 'puzzle',
    categoryLabel: '益智系列',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    tags: ['猫薄荷诱导', '360°旋转', '自嗨解闷'],
    description: '专为猫咪设计的转盘玩具，顶部与转盘中藏有天然猫薄荷球，轻触即可高速旋转，并带有闪光球吸引视线，猫咪自嗨一整天。',
    playGuide: '1. 将底部的吸盘固定在光滑的表面。\n2. 用手指拨动叶片旋转，演示效果。\n3. 引导猫咪用爪子拍打。',
    safetyWarning: '吸盘在粗糙表面可能无法吸附。请避免让幼猫过度吸入猫薄荷。',
    suitabilityScore: 97,
    matchReason: '这款极具诱惑的转盘完美契合猫咪的好奇天性，猫薄荷的加持更让它爱不释手！'
  },
  {
    name: '交互式智能激光逗猫仪',
    category: 'active',
    categoryLabel: '运动自嗨',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600',
    tags: ['自动红外', '多重轨迹', '智能定时'],
    description: '智能激光路径规划算法，自动生成无规则旋转轨迹，多档速度可调，彻底解放铲屎官双手。',
    playGuide: '1. 将逗猫仪放置在较高的台面。\n2. 选择自动模式或手动模式。\n3. 观察红点轨迹在地面上的晃动。',
    safetyWarning: '请勿长时间用激光直射宠物或人眼。',
    suitabilityScore: 94,
    matchReason: '无规则的激光路径能最大程度激发猫咪作为捕猎者敏锐本能，玩耍体验棒棒哒！'
  }
];

// Helper to select a toy based on pet parameters
function getFallbackToy(pet: any, category?: string, isMatched?: boolean) {
  const useMatched = isMatched !== false && pet;
  const isDog = useMatched ? (pet.type === 'dog') : (Math.random() > 0.5);
  const list = isDog ? FALLBACK_TOYS_DOG : FALLBACK_TOYS_CAT;
  
  let filtered = list;
  if (category && category !== 'all') {
    filtered = list.filter(t => t.category === category);
    if (filtered.length === 0) {
      filtered = list;
    }
  }

  // Choose based on chewStrength or energyLevel
  let chosen = filtered[Math.floor(Math.random() * filtered.length)];
  if (useMatched) {
    chosen = filtered[0];
    if (pet.chewStrength === 'aggressive' && isDog) {
      chosen = filtered.find(t => t.category === 'chew') || chosen;
    } else if (pet.energyLevel === 'high') {
      chosen = filtered.find(t => t.category === 'active') || chosen;
    } else if (pet.energyLevel === 'low') {
      chosen = filtered.find(t => t.category === 'squeak' || t.category === 'puzzle') || chosen;
    }
  }

  // Personalize details
  const personalized = {
    ...chosen,
    id: `toy_dynamic_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
    matchReason: !useMatched
      ? "当前未开启专属宠物智能匹配，此玩具为“玩具情报站”精心挑选的通用人气爆款，适合所有喜欢新奇探索的毛孩子！"
      : chosen.matchReason
        .replace(/爱犬/g, `“${pet.name}”`)
        .replace(/猫咪/g, `“${pet.name}”`)
  };

  return personalized;
}

// 1. API: Analyze Pet Profile
app.post('/api/gemini/analyze', async (req, res) => {
  const { pet } = req.body;
  if (!pet) {
    return res.status(400).json({ error: 'Pet profile data is required' });
  }

  if (!ai) {
    // Return high-quality localized mock response
    const advice = pet.type === 'dog' 
      ? `针对“${pet.name}”（${pet.breed}，${pet.age}岁，${pet.energyLevel === 'high' ? '高' : pet.energyLevel === 'medium' ? '中' : '低'}运动量，${pet.chewStrength === 'aggressive' ? '强力' : pet.chewStrength === 'normal' ? '普通' : '温和'}啃咬级）：\n\n1. **玩耍偏好**：作为精力旺盛的犬类，建议每日进行2次不少于30分钟的互动体能训练，如长线追逐或拔河拉扯。\n2. **材质选择**：建议选用天然环保实心耐咬橡胶，避开易咬碎的硬质塑料或易抽丝的廉价化纤绳。\n3. **智力开发**：它的好奇心强烈，可穿插多通道漏食盘，通过食物引导其开发探索逻辑，能显著改善精力闲置导致的撕咬家具习惯。\n4. **安全警示**：换牙或啃咬剧烈期避免让其玩耍过硬的尼龙骨头，防止牙齿折断或牙龈创伤。`
      : `针对“${pet.name}”（${pet.breed}，${pet.age}岁，${pet.energyLevel === 'high' ? '高' : pet.energyLevel === 'medium' ? '中' : '低'}运动量）：\n\n1. **玩耍偏好**：猫咪天生喜爱垂直运动与暗处探伏。多角度摇摆的逗猫棒以及随机路径的感应球非常适合它。\n2. **材质选择**：天然羽毛、剑麻编织、无污染无化学印染毛绒是最佳材质。可以配合微量猫薄荷增加游戏粘性。\n3. **游戏习惯**：每天清晨和傍晚是其捕猎本能高发期，此时进行5-15分钟的互动逗弄可以模拟真实捕猎，释放天性。\n4. **安全警示**：务必将带有细线、橡皮筋、丝带的玩具收纳好，谨防猫咪在无人看管下误吞引发严重的肠套叠危险。`;
    return res.json({ analysis: advice });
  }

  try {
    const prompt = `你是一位世界顶级的宠物行为学家 and 玩具推荐专家。
请根据以下宠物特征进行全面、深度的科学分析，给出专业玩耍建议 and 玩具材质避坑指南：
- 宠物姓名: ${pet.name}
- 宠物种类: ${pet.type === 'dog' ? '狗' : '猫'}
- 品种: ${pet.breed}
- 年龄: ${pet.age}岁
- 运动量级别: ${pet.energyLevel} (high/medium/low)
- 撕咬破坏力: ${pet.chewStrength} (aggressive/normal/gentle)

请返回一个富有亲和力、科学专业、排版清晰的Markdown格式的分析报告。
请在报告中突出：
1. **玩耍习惯与核心偏好预测**
2. **黄金玩耍时间与时长建议**
3. **玩具材质避抗与安全红线**
4. **益智开发方向与推荐策略**
请用温暖而专业的中文书写，称呼宠物时要使用它的姓名“${pet.name}”。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: 'Failed to generate AI analysis' });
  }
});

// 2. API: Open Blind Box (Dynamic Custom Recommendation)
app.post('/api/gemini/blindbox', async (req, res) => {
  const { pet, category, isMatched } = req.body;
  const useMatched = isMatched !== false && pet;

  if (useMatched && !pet) {
    return res.status(400).json({ error: 'Pet profile data is required' });
  }

  if (!ai) {
    // Generate high-quality personalized mock toy
    const mockToy = getFallbackToy(pet, category, isMatched);
    return res.json({ toy: mockToy });
  }

  try {
    let prompt = '';
    if (useMatched) {
      const categoryQuery = category && category !== 'all' ? `玩具类别必须属于: ${category} (对应可选: puzzle/chew/squeak/active)` : '最适合它的玩具类别';
      prompt = `你是一位充满创意的宠物玩具发明家，要为一只宠物开发一款独一无二、极其契合其特性的“智能玩具盲盒”。
宠物资料如下：
- 宠物姓名: ${pet.name}
- 宠物种类: ${pet.type === 'dog' ? '狗' : '猫'}
- 品种: ${pet.breed}
- 年龄: ${pet.age}岁
- 运动量级别: ${pet.energyLevel} (high/medium/low)
- 撕咬破坏力: ${pet.chewStrength} (aggressive/normal/gentle)
- ${categoryQuery}

请你针对这只宠物量身定制发明一款创意玩具，并以精巧的JSON格式返回玩具情报：
请严格遵循以下JSON Schema：
{
  "name": "玩具名称 (例如: 破风飞奔智能闪光飞盘，要求极富创意且迎合其天性)",
  "category": "分类标识，必须是 'puzzle' (益智), 'chew' (耐咬), 'squeak' (声响), 'active' (运动互动) 之一",
  "categoryLabel": "对应的分类中文标签，如 益智系列、耐咬系列、声响玩具、运动自嗨",
  "imageUrl": "请不要返回随机链接，直接在以下精选图库中根据你设计的玩具类型挑选一个最契合的URL返回：
    - 益智/探索类: https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600
    - 耐咬/啃咬类: https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600
    - 声响/发声/毛绒类: https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600
    - 户外/运动/自嗨类: https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600
    - 猫咪通用逗趣类: https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
  "rating": 4.9, // 浮点数，4.5-5.0之间
  "tags": ["三个短小精悍的标签，每个2-4个字"],
  "description": "详细的产品介绍，用生动、具象的文字说明它采用了什么独特设计、什么材质、为什么好玩。",
  "playGuide": "分步骤指导主人如何引导宠物玩耍，1. 2. 3. 4. 每步写得非常生动有互动感。",
  "safetyWarning": "该宠物玩耍时的重要安全警戒红线，例如防止吞咽细线或避免在过于坚硬的地面落地等。",
  "matchReason": "结合其品种特征、年龄阶段、运动量及撕咬力，向主人深度解释为什么这款玩具是最完美的专属选择（3行左右，亲切温暖，用中文）。",
  "suitabilityScore": 95 // 90-100之间的整数
}

请确保只返回纯JSON，不要包含任何\`\`\`json或其它包裹符号。用中文书写全部中文文本。`;
    } else {
      const isDog = Math.random() > 0.5;
      const categoryQuery = category && category !== 'all' ? `玩具类别必须属于: ${category} (对应可选: puzzle/chew/squeak/active)` : '任选一个最有趣、受大众欢迎的类别';
      prompt = `你是一位充满创意的顶级宠物玩具设计师。由于用户没有开启个性化宠物匹配，请针对“${isDog ? '狗狗' : '猫咪'}”设计一款备受全网宠主推荐、通用性极强的人气爆款或极具脑洞的大众玩具，作为“智能玩具盲盒”。
要求：
- 请勿提及任何特定的宠物姓名、具体年龄或独特的运动量等级，保持对所有 ${isDog ? '狗狗' : '猫咪'} 的通用和包容。
- ${categoryQuery}

请以精巧的JSON格式返回玩具情报，并严格遵循以下JSON Schema：
{
  "name": "玩具名称 (要求极富创意且充满吸引力)",
  "category": "分类标识，必须是 'puzzle' (益智), 'chew' (耐咬), 'squeak' (声响), 'active' (运动互动) 之一",
  "categoryLabel": "对应的分类中文标签，如 益智系列、耐咬系列、声响玩具、运动自嗨",
  "imageUrl": "请不要返回随机链接，直接在以下精选图库中根据你设计的玩具类型挑选一个最契合的URL返回：
    - 益智/探索类: https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600
    - 耐咬/啃咬类: https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600
    - 声响/发声/毛绒类: https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600
    - 户外/运动/自嗨类: https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600
    - 猫咪通用逗趣类: https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
  "rating": 4.9, // 浮点数，4.5-5.0之间
  "tags": ["三个短小精悍的标签，每个2-4个字"],
  "description": "详细的产品介绍，用生动、具象的文字说明它采用了什么独特设计、什么材质、为什么好玩。",
  "playGuide": "分步骤指导主人如何引导宠物玩耍，1. 2. 3. 4. 每步写得非常生动有互动感。",
  "safetyWarning": "该类玩具游玩时的重要通用安全警戒红线。",
  "matchReason": "因为未开启专属宠物智能匹配，请直接深度且生动地解释为什么这款玩具是一款经典的畅销爆款，适合绝大多数 ${isDog ? '毛孩子' : '猫咪'} 游玩（3行左右，亲切温暖，用中文，绝不包含任何特定宠物姓名）。",
  "suitabilityScore": 95 // 90-100之间的整数
}

请确保只返回纯JSON，不要包含任何\`\`\`json或其它包裹符号。用中文书写全部中文文本。`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            categoryLabel: { type: Type.STRING },
            imageUrl: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            description: { type: Type.STRING },
            playGuide: { type: Type.STRING },
            safetyWarning: { type: Type.STRING },
            matchReason: { type: Type.STRING },
            suitabilityScore: { type: Type.INTEGER },
          },
          required: [
            'name',
            'category',
            'categoryLabel',
            'imageUrl',
            'rating',
            'tags',
            'description',
            'playGuide',
            'safetyWarning',
            'matchReason',
            'suitabilityScore',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text.trim());
    parsed.id = `toy_dynamic_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    res.json({ toy: parsed });
  } catch (err: any) {
    console.error('Gemini API error during blindbox opening:', err);
    // Graceful fallback on error so the button always successfully delivers a toy!
    const mockToy = getFallbackToy(pet, category, isMatched);
    res.json({ toy: mockToy, isFallback: true });
  }
});

// 3. API: Chat with Pet Specialist
app.post('/api/gemini/chat', async (req, res) => {
  const { messages, pet } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages history is required' });
  }

  const activePetInfo = pet 
    ? `你现在正在针对主人的宠物“${pet.name}”（${pet.type === 'dog' ? '狗' : '猫'}，品种: ${pet.breed}，年龄: ${pet.age}岁，运动量: ${pet.energyLevel}，破坏力: ${pet.chewStrength}）提供专属玩乐咨询。`
    : '';

  const systemInstruction = `你是一位拥有20年临床经验的“玩具情报站”智能宠物行为学专家和趣味运动规划大师。
你的任务是以温柔、细心、专业、拟人化（极富幽默感与爱心）的语气，解答宠主关于宠物玩具选购、游玩引导、拆家行为纠正、智力开发等多维度的疑问。
- 如果主人询问了具体的玩耍问题，请基于宠物行为学原理，给出切实可行的分步引导指南（如“正向脱敏”、“动作奖励联结”等）。
- 永远把宠物安全放在第一位，警告 those 潜在 of 误吞或窒息危险。
- 适当用爱心、爪子等文字表情增添亲和力（如 🐾, 🐶, 🐱, ✨）。
${activePetInfo}
请用中文书写，字数控制在150-250字以内，保持结构清晰、重点突出。`;

  if (!ai) {
    // Elegant localized chatbot fallback
    const lastUserMessage = messages[messages.length - 1]?.text || '你好';
    let reply = `🐾 汪呜/喵呜！我是你的专属宠物玩乐顾问。目前我正运行在离线守护模式下。\n\n`;
    
    if (pet) {
      reply += `我已经记录了小宝贝 **${pet.name}** (${pet.breed}) 的萌宠档案！关于你刚才提到的“${lastUserMessage}”，我有几个贴心建议：\n\n`;
      if (pet.type === 'dog') {
        reply += `1. **释放天性**：作为精力充沛的毛孩子，如果它有咬东西的倾向，建议给它坚硬实心的橡胶结绳，配合扔接游戏消耗多余精力。\n`;
        reply += `2. **玩耍引导**：主人可以用磨牙零食塞进漏食玩具里，在它面前摇晃，发出鼓励，让它尝试用手抓。`;
      } else {
        reply += `1. **藏匿探索**：猫咪对隐藏的猎物有天生敏感。可以准备一个旧纸箱，开几个小洞，把玩具放进去，让它体验掏洞掏猎物的快乐！\n`;
        reply += `2. **陪伴自嗨**：自动滚动的闪光小球能极大延长自嗨时间。`;
      }
    } else {
      reply += `对于你的提问“${lastUserMessage}”，最好的方法是选用符合宠物成长阶段的益智撕咬玩具。如果你在下方配置好萌宠资料，我将能为你进行 100% 极具针对性的专业玩耍规划哦！`;
    }

    return res.json({ reply });
  }

  try {
    // Map existing history to Gemini format
    const formattedContents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Gemini API Error in Chat:', err);
    res.status(500).json({ error: 'Failed to obtain AI response' });
  }
});

// Setup Vite and Static Server based on Node environment
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
