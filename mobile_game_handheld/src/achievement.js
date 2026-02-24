/**
 * 成就系统 - achievement.js
 * 成就解锁、成就展示、成就奖励
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_achievements';

    // 成就配置
    const ACHIEVEMENTS = {
        // 游戏类成就
        'play_1_game': {
            id: 'play_1_game',
            name: '初试身手',
            desc: '完成第一款游戏',
            icon: '🎮',
            category: '游戏',
            rewardCoins: 10,
            rewardExp: 20
        },
        'play_10_games': {
            id: 'play_10_games',
            name: '游戏达人',
            desc: '累计完成10款游戏',
            icon: '🎯',
            category: '游戏',
            rewardCoins: 50,
            rewardExp: 100
        },
        'play_50_games': {
            id: 'play_50_games',
            name: '骨灰玩家',
            desc: '累计完成50款游戏',
            icon: '🏆',
            category: '游戏',
            rewardCoins: 200,
            rewardExp: 500
        },
        // 分数类成就
        'score_1000': {
            id: 'score_1000',
            name: '初露锋芒',
            desc: '单次游戏得分达到1000',
            icon: '💯',
            category: '分数',
            rewardCoins: 30,
            rewardExp: 50
        },
        'score_5000': {
            id: 'score_5000',
            name: '高分选手',
            desc: '单次游戏得分达到5000',
            icon: '⭐',
            category: '分数',
            rewardCoins: 80,
            rewardExp: 150
        },
        'score_10000': {
            id: 'score_10000',
            name: '顶尖高手',
            desc: '单次游戏得分达到10000',
            icon: '👑',
            category: '分数',
            rewardCoins: 150,
            rewardExp: 300
        },
        // 收藏类成就
        'favorite_1': {
            id: 'favorite_1',
            name: '收藏爱好者',
            desc: '收藏第一款游戏',
            icon: '❤️',
            category: '收藏',
            rewardCoins: 10,
            rewardExp: 20
        },
        'favorite_10': {
            id: 'favorite_10',
            name: '收藏家',
            desc: '累计收藏10款游戏',
            icon: '💎',
            category: '收藏',
            rewardCoins: 50,
            rewardExp: 100
        },
        'favorite_30': {
            id: 'favorite_30',
            name: '收藏大师',
            desc: '累计收藏30款游戏',
            icon: '🏅',
            category: '收藏',
            rewardCoins: 150,
            rewardExp: 300
        },
        // 签到类成就
        'checkin_3': {
            id: 'checkin_3',
            name: '坚持不懈',
            desc: '连续签到3天',
            icon: '📅',
            category: '签到',
            rewardCoins: 30,
            rewardExp: 50
        },
        'checkin_7': {
            id: 'checkin_7',
            name: '周冠军',
            desc: '连续签到7天',
            icon: '🌟',
            category: '签到',
            rewardCoins: 100,
            rewardExp: 200
        },
        'checkin_30': {
            id: 'checkin_30',
            name: '签到王者',
            desc: '连续签到30天',
            icon: '👑',
            category: '签到',
            rewardCoins: 500,
            rewardExp: 1000
        },
        // 等级类成就
        'level_5': {
            id: 'level_5',
            name: '小有名气',
            desc: '达到5级',
            icon: '🎖️',
            category: '等级',
            rewardCoins: 100,
            rewardExp: 0
        },
        'level_10': {
            id: 'level_10',
            name: '声名鹊起',
            desc: '达到10级',
            icon: '🥈',
            category: '等级',
            rewardCoins: 200,
            rewardExp: 0
        },
        'level_20': {
            id: 'level_20',
            name: '传奇人物',
            desc: '达到20级',
            icon: '🥇',
            category: '等级',
            rewardCoins: 500,
            rewardExp: 0
        },
        // 社交类成就
        'first_share': {
            id: 'first_share',
            name: '分享达人',
            desc: '首次分享游戏',
            icon: '📢',
            category: '社交',
            rewardCoins: 20,
            rewardExp: 30
        },
        // 任务类成就
        'first_task': {
            id: 'first_task',
            name: '任务新手',
            desc: '完成第一个任务',
            icon: '✅',
            category: '任务',
            rewardCoins: 15,
            rewardExp: 30
        },
        'complete_10_tasks': {
            id: 'complete_10_tasks',
            name: '任务达人',
            desc: '累计完成10个任务',
            icon: '📋',
            category: '任务',
            rewardCoins: 80,
            rewardExp: 150
        },
        // 充值类成就（模拟）
        'spend_coins': {
            id: 'spend_coins',
            name: '购物达人',
            desc: '累计消费500金币',
            icon: '🛒',
            category: '消费',
            rewardCoins: 50,
            rewardExp: 100
        },
        // 探索类成就
        'all_categories': {
            id: 'all_categories',
            name: '全部分类',
            desc: '游玩过所有游戏分类',
            icon: '🗂️',
            category: '探索',
            rewardCoins: 200,
            rewardExp: 400
        }
    };

    // 获取成就数据
    function getAchievementData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {
            achievements: {},
            totalEarned: 0,
            earnedCoins: 0,
            earnedExp: 0
        };
    }

    // 保存成就数据
    function saveAchievementData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 获取所有成就
    function getAllAchievements() {
        const data = getAchievementData();
        return Object.values(ACHIEVEMENTS).map(ach => ({
            ...ach,
            unlocked: !!data.achievements[ach.id],
            unlockedAt: data.achievements[ach.id] || null
        }));
    }

    // 获取已解锁成就
    function getUnlockedAchievements() {
        return getAllAchievements().filter(a => a.unlocked);
    }

    // 获取未解锁成就
    function getLockedAchievements() {
        return getAllAchievements().filter(a => !a.unlocked);
    }

    // 检查并解锁成就
    function checkAndUnlock(achievementId) {
        const achievement = ACHIEVEMENTS[achievementId];
        if (!achievement) return null;

        const data = getAchievementData();

        // 如果已经解锁，直接返回
        if (data.achievements[achievementId]) {
            return { already: true, achievement };
        }

        // 解锁成就
        data.achievements[achievementId] = Date.now();
        data.totalEarned += 1;
        data.earnedCoins += achievement.rewardCoins;
        data.earnedExp += achievement.rewardExp;
        saveAchievementData(data);

        // 发放奖励
        if (achievement.rewardCoins > 0 && window.UserAccount) {
            window.UserAccount.addCoins(achievement.rewardCoins);
        }
        if (achievement.rewardExp > 0 && window.UserAccount && window.UserAccount.addExp) {
            window.UserAccount.addExp(achievement.rewardExp);
        }

        return {
            unlocked: true,
            achievement,
            rewardCoins: achievement.rewardCoins,
            rewardExp: achievement.rewardExp
        };
    }

    // 检查多个成就
    function checkAchievements(achievementIds) {
        const results = [];
        achievementIds.forEach(id => {
            const result = checkAndUnlock(id);
            if (result && result.unlocked) {
                results.push(result);
            }
        });
        return results;
    }

    // 检查游戏完成成就
    function checkGameComplete() {
        const favorites = window.Favorites ? window.Favorites.get() : [];
        const results = [];

        // 收藏成就
        const favResults = checkAchievements([
            'favorite_1',
            'favorite_10',
            'favorite_30'
        ]);
        results.push(...favResults);

        return results;
    }

    // 检查分数成就
    function checkScoreAchievement(score) {
        const results = [];

        if (score >= 1000) results.push(checkAndUnlock('score_1000'));
        if (score >= 5000) results.push(checkAndUnlock('score_5000'));
        if (score >= 10000) results.push(checkAndUnlock('score_10000'));

        return results.filter(r => r && r.unlocked);
    }

    // 检查等级成就
    function checkLevelAchievement(level) {
        const results = [];

        if (level >= 5) results.push(checkAndUnlock('level_5'));
        if (level >= 10) results.push(checkAndUnlock('level_10'));
        if (level >= 20) results.push(checkAndUnlock('level_20'));

        return results.filter(r => r && r.unlocked);
    }

    // 检查签到成就
    function checkCheckinAchievement(continuousDays) {
        const results = [];

        if (continuousDays >= 3) results.push(checkAndUnlock('checkin_3'));
        if (continuousDays >= 7) results.push(checkAndUnlock('checkin_7'));
        if (continuousDays >= 30) results.push(checkAndUnlock('checkin_30'));

        return results.filter(r => r && r.unlocked);
    }

    // 获取成就统计
    function getStats() {
        const data = getAchievementData();
        const total = Object.keys(ACHIEVEMENTS).length;
        const unlocked = Object.keys(data.achievements).length;

        return {
            total,
            unlocked,
            locked: total - unlocked,
            progress: Math.round((unlocked / total) * 100),
            totalEarnedCoins: data.earnedCoins,
            totalEarnedExp: data.earnedExp
        };
    }

    // 按分类获取成就
    function getAchievementsByCategory() {
        const achievements = getAllAchievements();
        const categories = {};

        achievements.forEach(ach => {
            if (!categories[ach.category]) {
                categories[ach.category] = [];
            }
            categories[ach.category].push(ach);
        });

        return categories;
    }

    // 导出
    window.Achievement = {
        getAllAchievements: getAllAchievements,
        getUnlockedAchievements: getUnlockedAchievements,
        getLockedAchievements: getLockedAchievements,
        checkAndUnlock: checkAndUnlock,
        checkAchievements: checkAchievements,
        checkGameComplete: checkGameComplete,
        checkScoreAchievement: checkScoreAchievement,
        checkLevelAchievement: checkLevelAchievement,
        checkCheckinAchievement: checkCheckinAchievement,
        getStats: getStats,
        getAchievementsByCategory: getAchievementsByCategory
    };
})();
