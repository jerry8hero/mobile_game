/**
 * 冒险旅程数据配置 - adventure-data.js
 * 故事线、章节、任务、对话、NPC配置
 */

(function() {
    'use strict';

    // ========== 故事背景 ==========
    const STORY_BACKGROUND = {
        title: "勇者的试炼之路",
        prologue: `传说在远古时代，游戏之神创造了"掌机王国"。
王国中有一座高耸入云的神塔，塔中藏有无数游戏的奥秘。
每个渴望成为冒险者的年轻勇士，都必须通过游戏试炼来证明自己的实力。
如今，一位新的冒险者踏入了这个世界...`,
        epilogue_justice: `恭喜你，勇敢的冒险者！你选择了正义之道，成为了传说中的"传奇王者"。游戏之神的祝福将永远伴随着你！`,
        epilogue_power: `恭喜你，勇敢的冒险者！你选择了力量之道，成为了传说中的"力量之王"！你的实力无人能敌！`,
        epilogue_wisdom: `恭喜你，勇敢的冒险者！你选择了智慧之道，成为了传说中的"智慧贤者"！你的学识渊博无比！`,
        epilogue_balance: `恭喜你，勇敢的冒险者！你选择了平衡之道，成为了传说中的"平衡勇者"！你找到了游戏与生活的完美平衡！`
    };

    // ========== NPC配置 ==========
    const NPS = {
        '新手导师': {
            name: '新手导师',
            icon: '🧙',
            avatar: '🧙‍♂️',
            title: '新手村守护者',
            dialogues: {
                greeting: '欢迎来到冒险世界，年轻的勇士！',
                guide: '选择左边的任务开始你的冒险吧！',
                reward: '干得漂亮！这是你的奖励，继续加油！'
            }
        },
        '记忆长老': {
            name: '记忆长老',
            icon: '🧩',
            avatar: '👴',
            title: '记忆神殿守护者',
            dialogues: {
                greeting: '欢迎来到记忆神殿，这里考验你的记忆力...',
                guide: '完成记忆配对游戏来证明你的实力！',
                reward: '你的记忆力令人惊叹！'
            }
        },
        '敏捷之神': {
            name: '敏捷之神',
            icon: '⚡',
            avatar: '🏃‍♂️',
            title: '敏捷试炼场之主',
            dialogues: {
                greeting: '想要证明你的敏捷吗？来接受挑战吧！',
                guide: '完成敏捷类游戏，展现你的反应速度！',
                reward: '太迅速了！你的反应堪比闪电！'
            }
        },
        '智慧女神': {
            name: '智慧女神',
            icon: '📚',
            avatar: '👩‍🏫',
            title: '知识殿堂之主',
            dialogues: {
                greeting: '知识的力量是无穷的，来这里证明你的智慧吧！',
                guide: '完成知识类游戏，开启你的智慧之路！',
                reward: '你的智慧令人敬佩！'
            }
        },
        '棋王': {
            name: '棋王',
            icon: '♟️',
            avatar: '👑',
            title: '棋类大师',
            dialogues: {
                greeting: '想要成为策略大师吗？先过我这一关！',
                guide: '完成棋类游戏，证明你的策略头脑！',
                reward: '精妙的策略！你有成为大师的潜质！'
            }
        },
        '街机传奇': {
            name: '街机传奇',
            icon: '🎮',
            avatar: '👴',
            title: '街机时代的传说',
            dialogues: {
                greeting: '欢迎来到街机回忆录！这里是经典游戏的圣地！',
                guide: '重温经典街机游戏，找回当年的感觉！',
                reward: '太棒了！经典永不褪色！'
            }
        },
        '运动健将': {
            name: '运动健将',
            icon: '🏆',
            avatar: '🏅',
            title: '竞技场冠军',
            dialogues: {
                greeting: '想要在竞技场证明自己吗？',
                guide: '完成运动类游戏，挑战你的极限！',
                reward: '这就是冠军的实力！'
            }
        },
        '创意大师': {
            name: '创意大师',
            icon: '🎨',
            avatar: '🧑‍🎨',
            title: '创意工坊掌门',
            dialogues: {
                greeting: '欢迎来到创意工坊！这里释放你的想象力！',
                guide: '完成创意艺术类游戏，展现你的才华！',
                reward: '绝妙的创意！你有艺术家的天赋！'
            }
        },
        '游戏之神': {
            name: '游戏之神',
            icon: '🎮',
            avatar: '⭐',
            title: '掌机王国之主',
            dialogues: {
                greeting: '勇敢的冒险者，你终于来了！',
                guide: '完成最终试炼，证明你配得上"王者"的称号！',
                reward: '你已证明了自己！欢迎成为传奇！'
            }
        }
    };

    // ========== 章节配置 ==========
    const CHAPTERS = {
        'chapter_1': {
            id: 'chapter_1',
            name: '新手村的考验',
            icon: '🏠',
            description: '踏入冒险世界的第一步，学习基础游戏技能',
            unlockCondition: { type: 'none' },
            tasks: ['task_1_1', 'task_1_2', 'task_1_3', 'task_1_4', 'task_1_5'],
            rewards: { coins: 100, exp: 50 },
            npc: '新手导师'
        },
        'chapter_2': {
            id: 'chapter_2',
            name: '记忆的迷宫',
            icon: '🧩',
            description: '进入记忆神殿，锻炼你的记忆力',
            unlockCondition: { type: 'chapter_complete', chapterId: 'chapter_1' },
            tasks: ['task_2_1', 'task_2_2', 'task_2_3', 'task_2_4'],
            rewards: { coins: 150, exp: 80 },
            npc: '记忆长老'
        },
        'chapter_3': {
            id: 'chapter_3',
            name: '第一次抉择',
            icon: '⚡',
            description: '敏捷试炼场还是知识殿堂？你的选择将影响未来...',
            unlockCondition: { type: 'chapter_complete', chapterId: 'chapter_2' },
            tasks: ['task_3_1', 'task_3_2', 'task_3_3', 'task_3_4', 'task_3_5'],
            rewards: { coins: 200, exp: 100 },
            npc: '敏捷之神',
            hasChoice: true,
            choiceId: 'choice_1'
        },
        // 敏捷之道分支
        'chapter_4_agility': {
            id: 'chapter_4_agility',
            name: '速度竞技场',
            icon: '⚡',
            description: '敏捷之神的进阶挑战，速度决定一切！',
            unlockCondition: { type: 'choice', choiceId: 'choice_1', value: 'path_agility' },
            tasks: ['task_4a_1', 'task_4a_2', 'task_4a_3', 'task_4a_4'],
            rewards: { coins: 250, exp: 120 },
            npc: '敏捷之神'
        },
        // 智慧之道分支
        'chapter_4_wisdom': {
            id: 'chapter_4_wisdom',
            name: '知识的殿堂',
            icon: '📚',
            description: '智慧女神的知识宝库，思考带来力量',
            unlockCondition: { type: 'choice', choiceId: 'choice_1', value: 'path_wisdom' },
            tasks: ['task_4w_1', 'task_4w_2', 'task_4w_3', 'task_4w_4'],
            rewards: { coins: 250, exp: 120 },
            npc: '智慧女神'
        },
        'chapter_5': {
            id: 'chapter_5',
            name: '编程启蒙之路',
            icon: '💻',
            description: '进入机械堡垒，学习编程思维',
            unlockCondition: { type: 'either_chapter', chapters: ['chapter_4_agility', 'chapter_4_wisdom'] },
            tasks: ['task_5_1', 'task_5_2', 'task_5_3', 'task_5_4', 'task_5_5'],
            rewards: { coins: 300, exp: 150 },
            npc: '新手导师'
        },
        'chapter_6': {
            id: 'chapter_6',
            name: '策略与战术',
            icon: '♟️',
            description: '棋类大师的残局挑战，策略决定胜负',
            unlockCondition: { type: 'chapter_complete', chapterId: 'chapter_5' },
            tasks: ['task_6_1', 'task_6_2', 'task_6_3', 'task_6_4'],
            rewards: { coins: 350, exp: 180 },
            npc: '棋王',
            hasChoice: true,
            choiceId: 'choice_2'
        },
        'chapter_7': {
            id: 'chapter_7',
            name: '街机回忆录',
            icon: '🎮',
            description: '回到80年代，经典街机挑战',
            unlockCondition: { type: 'chapter_complete', chapterId: 'chapter_6' },
            tasks: ['task_7_1', 'task_7_2', 'task_7_3', 'task_7_4', 'task_7_5'],
            rewards: { coins: 400, exp: 200 },
            npc: '街机传奇'
        },
        'chapter_8': {
            id: 'chapter_8',
            name: '竞技场/智慧塔',
            icon: '🏆',
            description: '第二次抉择后的挑战',
            unlockCondition: { type: 'chapter_complete', chapterId: 'chapter_7' },
            tasks: ['task_8_1', 'task_8_2', 'task_8_3', 'task_8_4'],
            rewards: { coins: 450, exp: 220 },
            npc: '运动健将',
            hasChoice: true,
            choiceId: 'choice_3'
        },
        'chapter_9': {
            id: 'chapter_9',
            name: '创意工坊',
            icon: '🎨',
            description: '发挥创意，艺术与音乐的结合',
            unlockCondition: { type: 'chapter_complete', chapterId: 'chapter_8' },
            tasks: ['task_9_1', 'task_9_2', 'task_9_3', 'task_9_4'],
            rewards: { coins: 500, exp: 250 },
            npc: '创意大师'
        },
        'chapter_10': {
            id: 'chapter_10',
            name: '终极试炼',
            icon: '👑',
            description: '最终Boss战，证明你配得上王者称号',
            unlockCondition: { type: 'chapter_complete', chapterId: 'chapter_9' },
            tasks: ['task_10_1', 'task_10_2', 'task_10_3', 'task_10_4', 'task_10_5', 'task_10_6'],
            rewards: { coins: 1000, exp: 500 },
            npc: '游戏之神'
        }
    };

    // ========== 任务配置 ==========
    const TASKS = {
        // 第1章任务
        'task_1_1': {
            id: 'task_1_1', name: '记忆的觉醒', desc: '完成记忆配对游戏', type: 'main',
            chapter: 'chapter_1', gameName: '记忆配对', targetCount: 1,
            rewards: { coins: 20, exp: 15 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '年轻的冒险者，欢迎来到新手村！首先，让我测试你的记忆力...' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '不错！你的记忆力相当出色。继续努力吧！' }
        },
        'task_1_2': {
            id: 'task_1_2', name: '拼图入门', desc: '完成拼图游戏', type: 'main',
            chapter: 'chapter_1', gameName: '拼图游戏', targetCount: 1,
            rewards: { coins: 20, exp: 15 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '拼图考验的是观察力和耐心，你准备好了吗？' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '很好！你的空间感知能力很强！' }
        },
        'task_1_3': {
            id: 'task_1_3', name: '连连看', desc: '完成连连看游戏', type: 'main',
            chapter: 'chapter_1', gameName: '连连看', targetCount: 1,
            rewards: { coins: 20, exp: 15 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '连连看需要敏锐的观察力，找出相同的图案！' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '太棒了！你的眼力非常锐利！' }
        },
        'task_1_4': {
            id: 'task_1_4', name: '24点挑战', desc: '完成24点游戏', type: 'main',
            chapter: 'chapter_1', gameName: '24点', targetCount: 1,
            rewards: { coins: 20, exp: 15 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '24点游戏能锻炼你的数学思维，来试试吧！' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '数学能力不错！你有成为智者的潜质！' }
        },
        'task_1_5': {
            id: 'task_1_5', name: '华容道', desc: '完成华容道游戏', type: 'main',
            chapter: 'chapter_1', gameName: '华容道', targetCount: 1,
            rewards: { coins: 20, exp: 15 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '华容道是古老的智力游戏，需要巧妙的步骤安排！' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '聪明的头脑！你的逻辑思维能力很强！' }
        },

        // 第2章任务
        'task_2_1': {
            id: 'task_2_1', name: '颜色记忆', desc: '完成颜色记忆游戏', type: 'main',
            chapter: 'chapter_2', gameName: '颜色记忆', targetCount: 1,
            rewards: { coins: 30, exp: 20 },
            dialogBefore: { npc: '记忆长老', npcIcon: '🧩', text: '欢迎来到记忆神殿！这里的第一课是颜色记忆...' },
            dialogAfter: { npc: '记忆长老', npcIcon: '🧩', text: '颜色记忆掌握得很好！继续前进！' }
        },
        'task_2_2': {
            id: 'task_2_2', name: '迷宫探险', desc: '完成迷宫探险游戏', type: 'main',
            chapter: 'chapter_2', gameName: '迷宫探险', targetCount: 1,
            rewards: { coins: 30, exp: 20 },
            dialogBefore: { npc: '记忆长老', npcIcon: '🧩', text: '迷宫探险需要记住走过的路，你能找到出口吗？' },
            dialogAfter: { npc: '记忆长老', npcIcon: '🧩', text: '方向感很强！迷宫对你来说不难！' }
        },
        'task_2_3': {
            id: 'task_2_3', name: '高级配对', desc: '记忆配对获得3次胜利', type: 'main',
            chapter: 'chapter_2', gameName: '记忆配对', targetCount: 3,
            rewards: { coins: 40, exp: 25 },
            dialogBefore: { npc: '记忆长老', npcIcon: '🧩', text: '现在挑战升级，需要连续完成3次配对！' },
            dialogAfter: { npc: '记忆长老', npcIcon: '🧩', text: '惊人的记忆力！你已经掌握了记忆的奥秘！' }
        },
        'task_2_4': {
            id: 'task_2_4', name: '汉诺塔挑战', desc: '完成汉诺塔游戏', type: 'main',
            chapter: 'chapter_2', gameName: '汉诺塔', targetCount: 1,
            rewards: { coins: 30, exp: 25 },
            dialogBefore: { npc: '记忆长老', npcIcon: '🧩', text: '汉诺塔是记忆与策略的完美结合！' },
            dialogAfter: { npc: '记忆长老', npcIcon: '🧩', text: '完美的策略！你已经准备好了迎接更多挑战！' }
        },

        // 第3章任务（敏捷试炼场）
        'task_3_1': {
            id: 'task_3_1', name: '切水果', desc: '完成切水果游戏', type: 'main',
            chapter: 'chapter_3', gameName: '切水果', targetCount: 1,
            rewards: { coins: 35, exp: 18 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '敏捷试炼开始！切水果考验的是反应速度！' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '快如闪电！你的反应速度惊人！' }
        },
        'task_3_2': {
            id: 'task_3_2', name: '打地鼠', desc: '完成打地鼠游戏', type: 'main',
            chapter: 'chapter_3', gameName: '打地鼠', targetCount: 1,
            rewards: { coins: 35, exp: 18 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '打地鼠需要精准的时机判断！' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '精准命中！你的手眼协调很出色！' }
        },
        'task_3_3': {
            id: 'task_3_3', name: '弹球达人', desc: '完成弹球达人游戏', type: 'main',
            chapter: 'chapter_3', gameName: '弹球达人', targetCount: 1,
            rewards: { coins: 35, exp: 18 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '弹球达人考验你的预判能力！' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '预判精准！你有运动员的潜质！' }
        },
        'task_3_4': {
            id: 'task_3_4', name: '接水果', desc: '完成接水果游戏', type: 'main',
            chapter: 'chapter_3', gameName: '接水果', targetCount: 1,
            rewards: { coins: 35, exp: 18 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '接水果需要快速移动和预判！' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '身手敏捷！你的速度让我印象深刻！' }
        },
        'task_3_5': {
            id: 'task_3_5', name: '敏捷试炼完成', desc: '完成任意敏捷游戏2次', type: 'main',
            chapter: 'chapter_3', gameName: '切水果', targetCount: 2,
            rewards: { coins: 50, exp: 28 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '现在面临选择：走敏捷之道还是智慧之道？' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '无论你选择哪条路，记住：速度与智慧同样重要！' }
        },

        // 第4章敏捷分支任务
        'task_4a_1': {
            id: 'task_4a_1', name: '极速挑战', desc: '完成俄罗斯方块游戏', type: 'main',
            chapter: 'chapter_4_agility', gameName: '俄罗斯方块', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '极速挑战！俄罗斯方块需要超快的反应！' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '极速王者！你的速度无人能及！' }
        },
        'task_4a_2': {
            id: 'task_4a_2', name: '贪吃蛇大师', desc: '完成贪吃蛇游戏', type: 'main',
            chapter: 'chapter_4_agility', gameName: '贪吃蛇', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '贪吃蛇需要迅速的方向控制！' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '操控自如！你的反应真的很快！' }
        },
        'task_4a_3': {
            id: 'task_4a_3', name: '挑战2048', desc: '完成挑战2048游戏', type: 'main',
            chapter: 'chapter_4_agility', gameName: '挑战2048', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '挑战2048需要快速决策！' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '决策果断！你是敏捷的化身！' }
        },
        'task_4a_4': {
            id: 'task_4a_4', name: '速度巅峰', desc: '完成任意敏捷游戏3次', type: 'main',
            chapter: 'chapter_4_agility', gameName: '弹球达人', targetCount: 3,
            rewards: { coins: 80, exp: 45 },
            dialogBefore: { npc: '敏捷之神', npcIcon: '⚡', text: '成为真正的速度之王吧！' },
            dialogAfter: { npc: '敏捷之神', npcIcon: '⚡', text: '你已成为速度的传奇！' }
        },

        // 第4章智慧分支任务
        'task_4w_1': {
            id: 'task_4w_1', name: '扫雷专家', desc: '完成扫雷游戏', type: 'main',
            chapter: 'chapter_4_wisdom', gameName: '扫雷', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '智慧女神', npcIcon: '📚', text: '扫雷需要逻辑推理能力...' },
            dialogAfter: { npc: '智慧女神', npcIcon: '📚', text: '逻辑清晰！你有敏锐的洞察力！' }
        },
        'task_4w_2': {
            id: 'task_4w_2', name: '猜数字大师', desc: '完成猜数字游戏', type: 'main',
            chapter: 'chapter_4_wisdom', gameName: '猜数字', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '智慧女神', npcIcon: '📚', text: '猜数字需要分析和推理...' },
            dialogAfter: { npc: '智慧女神', npcIcon: '📚', text: '分析能力强！你能找到规律！' }
        },
        'task_4w_3': {
            id: 'task_4w_3', name: '一笔画挑战', desc: '完成一笔画游戏', type: 'main',
            chapter: 'chapter_4_wisdom', gameName: '一笔画', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '智慧女神', npcIcon: '📚', text: '一笔画需要空间想象能力...' },
            dialogAfter: { npc: '智慧女神', npcIcon: '📚', text: '想象力丰富！你的思维很活跃！' }
        },
        'task_4w_4': {
            id: 'task_4w_4', name: '智慧结晶', desc: '完成知识类游戏3次', type: 'main',
            chapter: 'chapter_4_wisdom', gameName: '扫雷', targetCount: 3,
            rewards: { coins: 80, exp: 45 },
            dialogBefore: { npc: '智慧女神', npcIcon: '📚', text: '证明你的智慧吧！' },
            dialogAfter: { npc: '智慧女神', npcIcon: '📚', text: '智慧超群！你已领悟知识的真谛！' }
        },

        // 第5章任务
        'task_5_1': {
            id: 'task_5_1', name: '数字排序', desc: '完成数字排序游戏', type: 'main',
            chapter: 'chapter_5', gameName: '数字排序', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '编程的第一步是理解排序逻辑...' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '逻辑清晰！继续探索编程的奥秘！' }
        },
        'task_5_2': {
            id: 'task_5_2', name: '数字华容道', desc: '完成数字华容道游戏', type: 'main',
            chapter: 'chapter_5', gameName: '数字华容道', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '华容道教会我们系统性思考...' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '系统性思维很强！你有工程师的潜质！' }
        },
        'task_5_3': {
            id: 'task_5_3', name: '24点进阶', desc: '完成24点游戏获得2次胜利', type: 'main',
            chapter: 'chapter_5', gameName: '24点', targetCount: 2,
            rewards: { coins: 60, exp: 35 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '24点需要灵活的数学思维...' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '数学天赋惊人！你已掌握数字的奥秘！' }
        },
        'task_5_4': {
            id: 'task_5_4', name: 'Emoji消消乐', desc: '完成Emoji消消乐游戏', type: 'main',
            chapter: 'chapter_5', gameName: 'Emoji消消乐', targetCount: 1,
            rewards: { coins: 50, exp: 25 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '消消乐需要观察pattern...' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: 'Pattern识别能力很强！' }
        },
        'task_5_5': {
            id: 'task_5_5', name: '编程入门完成', desc: '完成编程启蒙全部挑战', type: 'main',
            chapter: 'chapter_5', gameName: '数字排序', targetCount: 2,
            rewards: { coins: 80, exp: 40 },
            dialogBefore: { npc: '新手导师', npcIcon: '🧙', text: '你已经具备了编程思维的基础！' },
            dialogAfter: { npc: '新手导师', npcIcon: '🧙', text: '编程基础扎实！可以继续前进了！' }
        },

        // 第6章任务
        'task_6_1': {
            id: 'task_6_1', name: '井字棋挑战', desc: '完成井字棋游戏', type: 'main',
            chapter: 'chapter_6', gameName: '井字棋', targetCount: 1,
            rewards: { coins: 70, exp: 35 },
            dialogBefore: { npc: '棋王', npcIcon: '♟️', text: '井字棋是策略的起点...' },
            dialogAfter: { npc: '棋王', npcIcon: '♟️', text: '不错的策略思维！' }
        },
        'task_6_2': {
            id: 'task_6_2', name: '五子棋对决', desc: '完成五子棋游戏', type: 'main',
            chapter: 'chapter_6', gameName: '五子棋', targetCount: 1,
            rewards: { coins: 80, exp: 45 },
            dialogBefore: { npc: '棋王', npcIcon: '♟️', text: '五子棋需要深远的预判能力...' },
            dialogAfter: { npc: '棋王', npcIcon: '♟️', text: '预判深远！你有大师之風！' }
        },
        'task_6_3': {
            id: 'task_6_3', name: '国际象棋入门', desc: '完成国际象棋游戏', type: 'main',
            chapter: 'chapter_6', gameName: '国际象棋', targetCount: 1,
            rewards: { coins: 80, exp: 45 },
            dialogBefore: { npc: '棋王', npcIcon: '♟️', text: '国际象棋是策略的巅峰挑战...' },
            dialogAfter: { npc: '棋王', npcIcon: '♟️', text: '巅峰策略！你已接近大师水平！' }
        },
        'task_6_4': {
            id: 'task_6_4', name: '策略大师', desc: '完成所有棋类游戏', type: 'main',
            chapter: 'chapter_6', gameName: '五子棋', targetCount: 2,
            rewards: { coins: 100, exp: 55 },
            dialogBefore: { npc: '棋王', npcIcon: '♟️', text: '你面临新的选择：成为竞技之王还是策略大师？' },
            dialogAfter: { npc: '棋王', npcIcon: '♟️', text: '无论选择哪条路，你的策略能力都会助你成功！' }
        },

        // 第7章任务
        'task_7_1': {
            id: 'task_7_1', name: '经典俄罗斯方块', desc: '完成俄罗斯方块游戏', type: 'main',
            chapter: 'chapter_7', gameName: '俄罗斯方块', targetCount: 1,
            rewards: { coins: 60, exp: 30 },
            dialogBefore: { npc: '街机传奇', npcIcon: '🎮', text: '经典永流传！俄罗斯方块是街机的传奇！' },
            dialogAfter: { npc: '街机传奇', npcIcon: '🎮', text: '经典掌握得很好！' }
        },
        'task_7_2': {
            id: 'task_7_2', name: '贪吃蛇怀旧', desc: '完成贪吃蛇游戏', type: 'main',
            chapter: 'chapter_7', gameName: '贪吃蛇', targetCount: 1,
            rewards: { coins: 60, exp: 30 },
            dialogBefore: { npc: '街机传奇', npcIcon: '🎮', text: '贪吃蛇，80后的童年回忆！' },
            dialogAfter: { npc: '街机传奇', npcIcon: '🎮', text: '童年游戏大师！' }
        },
        'task_7_3': {
            id: 'task_7_3', name: '打砖块回忆', desc: '完成打砖块游戏', type: 'main',
            chapter: 'chapter_7', gameName: '打砖块', targetCount: 1,
            rewards: { coins: 60, exp: 30 },
            dialogBefore: { npc: '街机传奇', npcIcon: '🎮', text: '打砖块考验精准度！' },
            dialogAfter: { npc: '街机传奇', npcIcon: '🎮', text: '精准无误！' }
        },
        'task_7_4': {
            id: 'task_7_4', name: '2048挑战', desc: '完成2048游戏达到500分', type: 'main',
            chapter: 'chapter_7', gameName: '2048', targetCount: 1,
            rewards: { coins: 60, exp: 30 },
            dialogBefore: { npc: '街机传奇', npcIcon: '🎮', text: '2048需要策略与速度的结合！' },
            dialogAfter: { npc: '街机传奇', npcIcon: '🎮', text: '完美结合！你已超越经典！' }
        },
        'task_7_5': {
            id: 'task_7_5', name: '街机大师', desc: '完成所有街机游戏', type: 'main',
            chapter: 'chapter_7', gameName: '俄罗斯方块', targetCount: 2,
            rewards: { coins: 100, exp: 50 },
            dialogBefore: { npc: '街机传奇', npcIcon: '🎮', text: '成为真正的街机大师吧！' },
            dialogAfter: { npc: '街机传奇', npcIcon: '🎮', text: '街机传奇就是你！' }
        },

        // 第8章任务
        'task_8_1': {
            id: 'task_8_1', name: '酷跑冒险', desc: '完成酷跑冒险游戏', type: 'main',
            chapter: 'chapter_8', gameName: '酷跑冒险', targetCount: 1,
            rewards: { coins: 80, exp: 40 },
            dialogBefore: { npc: '运动健将', npcIcon: '🏆', text: '竞技场挑战开始！' },
            dialogAfter: { npc: '运动健将', npcIcon: '🏆', text: '运动天赋惊人！' }
        },
        'task_8_2': {
            id: 'task_8_2', name: '极速赛车', desc: '完成极速赛车游戏', type: 'main',
            chapter: 'chapter_8', gameName: '极速赛车', targetCount: 1,
            rewards: { coins: 80, exp: 40 },
            dialogBefore: { npc: '运动健将', npcIcon: '🏆', text: '极速挑战！' },
            dialogAfter: { npc: '运动健将', npcIcon: '🏆', text: '速度惊人！你有赛车的天赋！' }
        },
        'task_8_3': {
            id: 'task_8_3', name: '投篮大赛', desc: '完成投篮大赛游戏', type: 'main',
            chapter: 'chapter_8', gameName: '投篮大赛', targetCount: 1,
            rewards: { coins: 80, exp: 40 },
            dialogBefore: { npc: '运动健将', npcIcon: '🏆', text: '投篮需要精准控制！' },
            dialogAfter: { npc: '运动健将', npcIcon: '🏆', text: '精准命中！你有运动员的手感！' }
        },
        'task_8_4': {
            id: 'task_8_4', name: '最终抉择', desc: '面临最终道路选择', type: 'main',
            chapter: 'chapter_8', gameName: '点球大战', targetCount: 1,
            rewards: { coins: 100, exp: 60 },
            dialogBefore: { npc: '运动健将', npcIcon: '🏆', text: '你面临最终选择：正义之道还是力量之道？' },
            dialogAfter: { npc: '运动健将', npcIcon: '🏆', text: '无论哪条路，你都是真正的勇者！' }
        },

        // 第9章任务
        'task_9_1': {
            id: 'task_9_1', name: '创意绘画', desc: '完成创意绘画游戏', type: 'main',
            chapter: 'chapter_9', gameName: '创意绘画', targetCount: 1,
            rewards: { coins: 90, exp: 50 },
            dialogBefore: { npc: '创意大师', npcIcon: '🎨', text: '创意工坊开放！释放你的想象力！' },
            dialogAfter: { npc: '创意大师', npcIcon: '🎨', text: '创意无限！你有艺术家的灵魂！' }
        },
        'task_9_2': {
            id: 'task_9_2', name: '音乐挑战', desc: '完成音乐游戏', type: 'main',
            chapter: 'chapter_9', gameName: '音乐', targetCount: 1,
            rewards: { coins: 90, exp: 50 },
            dialogBefore: { npc: '创意大师', npcIcon: '🎨', text: '音乐是灵魂的表达...' },
            dialogAfter: { npc: '创意大师', npcIcon: '🎨', text: '乐感十足！你能感受到音乐的脉搏！' }
        },
        'task_9_3': {
            id: 'task_9_3', name: '模拟经营', desc: '完成模拟经营游戏', type: 'main',
            chapter: 'chapter_9', gameName: '模拟经营', targetCount: 1,
            rewards: { coins: 90, exp: 50 },
            dialogBefore: { npc: '创意大师', npcIcon: '🎨', text: '经营需要创造性的思维...' },
            dialogAfter: { npc: '创意大师', npcIcon: '🎨', text: '经营有方！你有企业家的头脑！' }
        },
        'task_9_4': {
            id: 'task_9_4', name: '创意大师之路', desc: '完成创意工坊全部挑战', type: 'main',
            chapter: 'chapter_9', gameName: '创意绘画', targetCount: 2,
            rewards: { coins: 150, exp: 80 },
            dialogBefore: { npc: '创意大师', npcIcon: '🎨', text: '你即将完成创意之旅！' },
            dialogAfter: { npc: '创意大师', npcIcon: '🎨', text: '创意无极限！你已成为创意大师！' }
        },

        // 第10章任务
        'task_10_1': {
            id: 'task_10_1', name: 'RPG冒险', desc: '完成RPG冒险游戏', type: 'main',
            chapter: 'chapter_10', gameName: 'RPG冒险', targetCount: 1,
            rewards: { coins: 150, exp: 80 },
            dialogBefore: { npc: '游戏之神', npcIcon: '⭐', text: '最终试炼开始！你准备好了吗？' },
            dialogAfter: { npc: '游戏之神', npcIcon: '⭐', text: '勇气的证明！你已迈出第一步！' }
        },
        'task_10_2': {
            id: 'task_10_2', name: '卡牌收集', desc: '完成卡牌收集游戏', type: 'main',
            chapter: 'chapter_10', gameName: '卡牌收集', targetCount: 1,
            rewards: { coins: 150, exp: 80 },
            dialogBefore: { npc: '游戏之神', npcIcon: '⭐', text: '收集卡牌需要智慧与运气...' },
            dialogAfter: { npc: '游戏之神', npcIcon: '⭐', text: '收集高手！你已接近终点！' }
        },
        'task_10_3': {
            id: 'task_10_3', name: '放置挂机', desc: '完成放置挂机游戏', type: 'main',
            chapter: 'chapter_10', gameName: '放置挂机', targetCount: 1,
            rewards: { coins: 150, exp: 80 },
            dialogBefore: { npc: '游戏之神', npcIcon: '⭐', text: '挂机之道：有时候休息也是一种智慧...' },
            dialogAfter: { npc: '游戏之神', npcIcon: '⭐', text: '劳逸结合！这是智者的选择！' }
        },
        'task_10_4': {
            id: 'task_10_4', name: '射击挑战', desc: '完成射击游戏', type: 'main',
            chapter: 'chapter_10', gameName: '飞行射击', targetCount: 1,
            rewards: { coins: 150, exp: 80 },
            dialogBefore: { npc: '游戏之神', npcIcon: '⭐', text: '射击考验精准与冷静...' },
            dialogAfter: { npc: '游戏之神', npcIcon: '⭐', text: '弹无虚发！你的专注力令人敬佩！' }
        },
        'task_10_5': {
            id: 'task_10_5', name: '抽卡养成', desc: '完成抽卡养成游戏', type: 'main',
            chapter: 'chapter_10', gameName: '抽卡养成', targetCount: 1,
            rewards: { coins: 150, exp: 80 },
            dialogBefore: { npc: '游戏之神', npcIcon: '⭐', text: '养成需要耐心与策略...' },
            dialogAfter: { npc: '游戏之神', npcIcon: '⭐', text: '养成大师！你的耐心得到了回报！' }
        },
        'task_10_6': {
            id: 'task_10_6', name: '王者之路', desc: '完成最终试炼', type: 'main',
            chapter: 'chapter_10', gameName: 'RPG冒险', targetCount: 2,
            rewards: { coins: 500, exp: 200 },
            dialogBefore: { npc: '游戏之神', npcIcon: '⭐', text: '证明你配得上"王者"的称号！' },
            dialogAfter: { npc: '游戏之神', npcIcon: '⭐', text: '你已证明了自己！欢迎成为传奇！' }
        }
    };

    // ========== 分支选择配置 ==========
    const CHOICES = {
        'choice_1': {
            id: 'choice_1',
            name: '第一次抉择',
            description: '敏捷之道还是智慧之道？你的选择将影响后续章节...',
            chapter: 'chapter_3',
            afterChapterComplete: true,
            options: [
                {
                    id: 'path_agility',
                    name: '敏捷之道',
                    icon: '⚡',
                    description: '速度与反应，你的反射神经无人能及',
                    nextChapter: 'chapter_4_agility',
                    narrative: '你选择了敏捷之道，敏捷之神对你的速度印象深刻...'
                },
                {
                    id: 'path_wisdom',
                    name: '智慧之道',
                    icon: '📚',
                    description: '知识就是力量，你的头脑比肌肉更强大',
                    nextChapter: 'chapter_4_wisdom',
                    narrative: '你选择了智慧之道，智慧女神为你的求知欲感到欣喜...'
                }
            ]
        },
        'choice_2': {
            id: 'choice_2',
            name: '第二次抉择',
            description: '成为竞技之王还是策略大师？',
            chapter: 'chapter_6',
            afterChapterComplete: true,
            options: [
                {
                    id: 'path_arena',
                    name: '竞技之王',
                    icon: '🏆',
                    description: '在竞技场上证明你的实力',
                    nextChapter: 'chapter_8',
                    narrative: '你选择了竞技之王之路...'
                },
                {
                    id: 'path_strategy',
                    name: '策略大师',
                    icon: '♟️',
                    description: '用智慧战胜一切对手',
                    nextChapter: 'chapter_8',
                    narrative: '你选择了策略大师之路...'
                }
            ]
        },
        'choice_3': {
            id: 'choice_3',
            name: '最终抉择',
            description: '正义之道还是力量之道？这将决定你的最终结局',
            chapter: 'chapter_8',
            afterChapterComplete: true,
            options: [
                {
                    id: 'path_justice',
                    name: '正义之道',
                    icon: '⚖️',
                    description: '守护正义，成为传奇王者',
                    endingId: 'ending_justice',
                    narrative: '你选择了正义之道...'
                },
                {
                    id: 'path_power',
                    name: '力量之道',
                    icon: '💪',
                    description: '追求绝对的力量',
                    endingId: 'ending_power',
                    narrative: '你选择了力量之道...'
                }
            ]
        }
    };

    // ========== 结局配置 ==========
    const ENDINGS = {
        'ending_justice': {
            id: 'ending_justice',
            name: '传奇王者（正义）',
            icon: '👑',
            description: '你选择了正义之道，成为了传说中的"传奇王者"',
            title: '传奇王者',
            avatar: '👑',
            rewards: { coins: 5000, exp: 2000 }
        },
        'ending_power': {
            id: 'ending_power',
            name: '力量之王',
            icon: '⚔️',
            description: '你选择了力量之道，成为了传说中的"力量之王"',
            title: '力量之王',
            avatar: '⚔️',
            rewards: { coins: 5000, exp: 2000 }
        },
        'ending_wisdom': {
            id: 'ending_wisdom',
            name: '智慧贤者',
            icon: '📚',
            description: '你选择了智慧之道，成为了传说中的"智慧贤者"',
            title: '智慧贤者',
            avatar: '📚',
            rewards: { coins: 5000, exp: 2000 }
        },
        'ending_balance': {
            id: 'ending_balance',
            name: '平衡勇者',
            icon: '🎖️',
            description: '你找到了游戏与生活的完美平衡',
            title: '平衡勇者',
            avatar: '🎖️',
            rewards: { coins: 3000, exp: 1500 }
        }
    };

    // ========== 章节过渡动画配置 ==========
    const CHAPTER_TRANSITIONS = {
        'chapter_1_to_2': {
            title: '第一章 完成！',
            text: '恭喜你完成了新手村的考验！\n现在，你将进入记忆的迷宫...',
            nextChapter: 'chapter_2'
        },
        'chapter_2_to_3': {
            title: '第二章 完成！',
            text: '记忆神殿的试炼已结束！\n前方是敏捷试炼场...',
            nextChapter: 'chapter_3'
        },
        'chapter_3_complete': {
            title: '面临抉择！',
            text: '敏捷试炼场和知识殿堂都在召唤你...\n你的选择将决定未来的道路！'
        },
        'chapter_4_agility_to_5': {
            title: '速度之道 完成！',
            text: '你的速度已经达到了巅峰！\n编程的奥秘等待着你...',
            nextChapter: 'chapter_5'
        },
        'chapter_4_wisdom_to_5': {
            title: '智慧之道 完成！',
            text: '你的智慧已经超越了常人！\n编程的奥秘等待着你...',
            nextChapter: 'chapter_5'
        },
        'chapter_5_to_6': {
            title: '第五章 完成！',
            text: '编程思维已掌握！\n现在接受棋类的策略挑战...',
            nextChapter: 'chapter_6'
        },
        'chapter_6_complete': {
            title: '面临抉择！',
            text: '竞技场和智慧塔都在召唤你...\n选择你的道路吧！'
        },
        'chapter_7_to_8': {
            title: '第七章 完成！',
            text: '街机回忆之旅结束！\n准备好迎接新的挑战了吗？',
            nextChapter: 'chapter_8'
        },
        'chapter_8_complete': {
            title: '最终抉择！',
            text: '正义之道还是力量之道？\n这个选择将决定你的最终命运...'
        },
        'chapter_9_to_10': {
            title: '第九章 完成！',
            text: '创意工坊的试炼结束！\n最终试炼在等待着你...',
            nextChapter: 'chapter_10'
        },
        'adventure_complete': {
            title: '冒险完成！',
            text: '恭喜你完成了所有试炼！\n你已成为了传说...'
        }
    };

    // ========== 导出 ==========
    window.AdventureData = {
        STORY_BACKGROUND,
        NPS,
        CHAPTERS,
        TASKS,
        CHOICES,
        ENDINGS,
        CHAPTER_TRANSITIONS
    };
})();
