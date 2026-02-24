/**
 * 排行榜模块 - leaderboard.js
 * 本地排行榜和模拟网络排行榜
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_leaderboard';

    // 预设模拟网络数据（演示用）
    const MOCK_ONLINE_DATA = {
        '记忆配对': [
            { rank: 1, username: '高手张三', score: 15800, date: '2024-01-15' },
            { rank: 2, username: '玩家李四', score: 14200, date: '2024-01-14' },
            { rank: 3, username: '达人王五', score: 13500, date: '2024-01-13' },
            { rank: 4, username: '挑战者', score: 12800, date: '2024-01-12' },
            { rank: 5, username: '新手小白', score: 12000, date: '2024-01-11' },
            { rank: 6, username: '游戏迷', score: 11500, date: '2024-01-10' },
            { rank: 7, username: '玩家七', score: 10800, date: '2024-01-09' },
            { rank: 8, username: '休闲玩家', score: 10000, date: '2024-01-08' },
            { rank: 9, username: '竞技选手', score: 9500, date: '2024-01-07' },
            { rank: 10, username: '闯关达人', score: 8800, date: '2024-01-06' }
        ],
        '俄罗斯方块': [
            { rank: 1, username: '传奇玩家', score: 99999, date: '2024-01-15' },
            { rank: 2, username: '方块大师', score: 88888, date: '2024-01-14' },
            { rank: 3, username: '消除高手', score: 77777, date: '2024-01-13' },
            { rank: 4, username: '砖块达人', score: 66666, date: '2024-01-12' },
            { rank: 5, username: '玩家甲', score: 55555, date: '2024-01-11' },
            { rank: 6, username: '玩家乙', score: 44444, date: '2024-01-10' },
            { rank: 7, username: '玩家丙', score: 33333, date: '2024-01-09' },
            { rank: 8, username: '玩家丁', score: 22222, date: '2024-01-08' },
            { rank: 9, username: '新手玩家', score: 11111, date: '2024-01-07' },
            { rank: 10, username: '试试手气', score: 10000, date: '2024-01-06' }
        ],
        '贪吃蛇大作战': [
            { rank: 1, username: '蛇王', score: 5200, date: '2024-01-15' },
            { rank: 2, username: ' snake ', score: 4800, date: '2024-01-14' },
            { rank: 3, username: '小蛇快跑', score: 4500, date: '2024-01-13' },
            { rank: 4, username: '贪吃蛇', score: 4200, date: '2024-01-12' },
            { rank: 5, username: '蛇形走位', score: 4000, date: '2024-01-11' },
            { rank: 6, username: '玩家1号', score: 3800, date: '2024-01-10' },
            { rank: 7, username: '玩家2号', score: 3500, date: '2024-01-09' },
            { rank: 8, username: '新手上路', score: 3000, date: '2024-01-08' },
            { rank: 9, username: '体验玩家', score: 2500, date: '2024-01-07' },
            { rank: 10, username: '试试看', score: 2000, date: '2024-01-06' }
        ]
    };

    // 获取本地排行榜数据
    function getLocalScores(gameName) {
        const data = localStorage.getItem(STORAGE_KEY);
        const allScores = data ? JSON.parse(data) : {};
        return allScores[gameName] || [];
    }

    // 保存本地分数
    function saveLocalScore(gameName, score) {
        const user = window.UserAccount ? window.UserAccount.getUser() : null;
        if (!user) return null;

        const data = localStorage.getItem(STORAGE_KEY);
        const allScores = data ? JSON.parse(data) : {};

        if (!allScores[gameName]) {
            allScores[gameName] = [];
        }

        // 添加新分数
        allScores[gameName].push({
            rank: 0,  // 稍后计算
            username: user.username,
            avatar: user.avatar,
            score: score,
            date: new Date().toISOString().split('T')[0]
        });

        // 按分数降序排序
        allScores[gameName].sort((a, b) => b.score - a.score);

        // 保留前20名
        allScores[gameName] = allScores[gameName].slice(0, 20);

        // 更新排名
        allScores[gameName].forEach((item, index) => {
            item.rank = index + 1;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allScores));

        // 返回玩家排名
        const playerEntry = allScores[gameName].find(e => e.username === user.username && e.score === score);
        return playerEntry ? playerEntry.rank : null;
    }

    // 获取网络排行榜（模拟）
    function getOnlineScores(gameName) {
        // 返回预设的模拟数据
        return MOCK_ONLINE_DATA[gameName] || [];
    }

    // 获取混合排行榜（本地 + 网络）
    function getMixedScores(gameName) {
        const online = getOnlineScores(gameName);
        const local = getLocalScores(gameName);

        // 合并并去重
        const merged = [...online];

        // 添加本地玩家数据（不在网络榜上的）
        local.forEach(localEntry => {
            if (!merged.some(e => e.username === localEntry.username && e.avatar === localEntry.avatar)) {
                merged.push({
                    ...localEntry,
                    isLocal: true
                });
            }
        });

        // 重新排序并限制10名
        merged.sort((a, b) => b.score - a.score);
        return merged.slice(0, 10);
    }

    // 提交分数
    function submitScore(gameName, score) {
        // 保存本地
        const rank = saveLocalScore(gameName, score);

        // 添加金币奖励
        if (window.UserAccount && rank && rank <= 10) {
            const bonus = Math.max(10, 50 - rank * 5);  // 排名越高金币越多
            window.UserAccount.addCoins(bonus);
        }

        return rank;
    }

    // 获取游戏排行榜
    function getLeaderboard(gameName) {
        return getMixedScores(gameName);
    }

    // 获取所有有排行榜的游戏
    function getSupportedGames() {
        return Object.keys(MOCK_ONLINE_DATA);
    }

    // 导出
    window.Leaderboard = {
        getLocalScores: getLocalScores,
        saveLocalScore: saveLocalScore,
        getOnlineScores: getOnlineScores,
        getMixedScores: getMixedScores,
        submitScore: submitScore,
        getLeaderboard: getLeaderboard,
        getSupportedGames: getSupportedGames
    };
})();
