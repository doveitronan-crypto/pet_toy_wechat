import { Toy } from '../types';

export const CURATED_TOYS: Toy[] = [
  {
    id: 'toy_1',
    name: '不倒翁智能漏食球',
    category: 'puzzle',
    categoryLabel: '益智系列',
    imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    tags: ['缓食慢吞', '智力开发', '互动游乐'],
    description: '通过物理倾斜与重力不倒翁设计，让宠物在推拨玩具的过程中逐步获取零食，有效减缓进食速度，开发大脑潜能。',
    playGuide: '1. 打开顶盖，放入宠物平时最爱的小颗粒冻干或干粮。\n2. 调节底部的漏食孔大小（初学者建议开到最大）。\n3. 摆在宠物面前，用手轻轻推拨一下，演示漏食原理。\n4. 引导宠物用鼻子或爪子推触，享受边玩边吃的乐趣。',
    safetyWarning: '本产品适用于干性宠物食品。请定期拆卸清洗，防止食物残渣变质，影响宠物健康。'
  },
  {
    id: 'toy_2',
    name: '天然高弹耐咬飞盘',
    category: 'active',
    categoryLabel: '耐咬系列',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    tags: ['户外高弹', '安全环保', '体能训练'],
    description: '采用天然环保橡胶材质，柔软不伤宠物牙龈，独特的流线型设计保证空中稳定滑行，是消耗中高运动量宠物精力的神器。',
    playGuide: '1. 初次使用时，可在飞盘边缘涂抹少量营养膏，让宠物对飞盘产生好感。\n2. 在室内或草地上进行近距离滚地抛接，训练宠物的追逐欲望。\n3. 当宠物学会捡回后，可进行中远距离的空中抛接。\n4. 每次接住飞盘后，给予口头鼓励或零食奖励。',
    safetyWarning: '飞盘为抛接训练玩具，非啃咬型玩具。请勿在无人监管的情况下留给宠物疯狂啃咬。'
  },
  {
    id: 'toy_3',
    name: '纯棉编织耐咬双拉环双结绳',
    category: 'chew',
    categoryLabel: '耐咬系列',
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    tags: ['洁齿磨牙', '拔河互动', '解闷耐咬'],
    description: '采用无毒彩色棉绳紧密编织而成，在宠物啃咬时能有效摩擦牙齿表面，清除牙垢，非常适合换牙期、磨牙需求旺盛的毛孩子。',
    playGuide: '1. 手握一端拉环，引导宠物咬住另一端绳结。\n2. 轻轻进行左右或前后的拔河拉扯，力量需适度，避免拉伤宠物颈椎。\n3. 拔河过程中可适时“认输”，让宠物获得占领战利品的成就感。\n4. 拔河完毕后，可用来作为扔接玩具让它捡回。',
    safetyWarning: '一旦发现棉绳出现严重抽丝或断股，请及时修剪或更换，防止宠物误吞棉纤维。'
  },
  {
    id: 'toy_4',
    name: '声响发声毛绒小火鸡',
    category: 'squeak',
    categoryLabel: '声响玩具',
    imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    tags: ['内置BB哨', '陪伴安抚', '柔软亲肤'],
    description: '采用超柔水晶绒面料，内置优质气囊声响器。在宠物啃咬或挤压时发出逼真的“唧唧”声，瞬间激发宠物的捕猎天性与玩耍兴趣。',
    playGuide: '1. 在宠物注意力分散时，按压小火鸡发出“唧唧”声吸引它。\n2. 将玩具扔向远处，让宠物追逐抢夺。\n3. 睡觉时可将玩具放在宠物垫子旁，提供熟悉的安全感与安抚。\n4. 对于容易拆家的毛孩子，可当做转移注意力的正向引导工具。',
    safetyWarning: '内部含有发声器与填充棉，若玩具被宠物咬破，请立即收回，清理并丢弃破损部分，防止误吞。'
  },
  {
    id: 'toy_5',
    name: '猫咪薄荷互动转盘',
    category: 'puzzle',
    categoryLabel: '益智系列',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    tags: ['猫薄荷诱导', '360°旋转', '自嗨解闷'],
    description: '专为猫咪设计的转盘玩具，顶部与转盘中藏有天然猫薄荷球，轻触即可高速旋转，并带有闪光球吸引视线，猫咪自嗨一整天。',
    playGuide: '1. 将底部的吸盘固定在光滑的地面、瓷砖墙面或玻璃上。\n2. 在旋转舱内放入赠送的天然高纯度猫薄荷球。\n3. 用手指拨动叶片旋转，演示旋转效果，其上的风铃和闪光球会自动触发。\n4. 引导猫咪用爪子拍打，让它们享受薄荷的兴奋感与扑咬乐趣。',
    safetyWarning: '吸盘在粗糙表面可能无法吸附。请避免让幼猫过度吸入猫薄荷，建议每日游戏时间不超过20分钟。'
  },
  {
    id: 'toy_6',
    name: '交互式智能激光逗猫仪',
    category: 'active',
    categoryLabel: '声响玩具',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    tags: ['自动红外', '多重轨迹', '智能定时'],
    description: '智能激光路径规划算法，自动生成无规则旋转轨迹，多档速度可调，彻底解放铲屎官双手，满足猫咪天生的狩猎追逐欲望。',
    playGuide: '1. 将逗猫仪放置在较高的台面或书架上，以便投影覆盖更大的地面区域。\n2. 选择自动模式（高/低速档）或手动手持模式。\n3. 观察红点轨迹在地面上的晃动，引导猫咪扑打。\n4. 智能芯片运行15分钟后会自动关闭，防止猫咪体力过度透支。',
    safetyWarning: '本产品采用安全级别红外激光，但请勿长时间用激光直射宠物或人眼，避免发生视网膜损伤。'
  }
];
