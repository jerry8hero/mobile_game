/**
 * 推荐系统 - recommendation.js
 * 热门推荐、猜你喜欢、分类推荐
 */

(function() {
    'use strict';

    // 获取热门游戏（基于模拟数据）
    function getHotGames(limit = 5) {
        // 模拟热门游戏数据
        const hotGames = [
            { name: '俄罗斯方块', icon: '🧱', type: '经典方块', playCount: 1523 },
            { name: '贪吃蛇', icon: '🐍', type: '贪吃蛇', playCount: 1342 },
            { name: '五子棋', icon: '⭕', type: '五子棋', playCount: 987 },
            { name: '投篮大赛', icon: '🏀', type: '篮球游戏', playCount: 856 },
            { name: '酷跑冒险', icon: '🏃', type: '跑酷游戏', playCount: 743 }
        ];
        return hotGames.slice(0, limit);
    }

    // 获取猜你喜欢（基于用户历史）
    function getRecommendedGames(limit = 5) {
        const favorites = window.Favorites ? window.Favorites.get() : [];
        const stats = window.GameStats ? window.GameStats.getStats() : { gamesPlayed: {} };

        // 获取用户玩过的游戏
        const playedGames = Object.keys(stats.gamesPlayed || {});

        // 获取收藏的游戏分类
        const favoriteCategories = favorites.map(f => f.category).filter(Boolean);

        // 从所有游戏中筛选
        const allGames = getAllGames();
        const recommended = [];

        allGames.forEach(game => {
            // 排除已玩过的
            if (playedGames.includes(game.name)) return;

            // 计算推荐分数
            let score = 0;

            // 如果收藏了同类游戏，加分
            if (favoriteCategories.includes(game.category)) {
                score += 10;
            }

            // 随机加分
            score += Math.random() * 5;

            recommended.push({ ...game, score });
        });

        // 按分数排序
        return recommended
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(({ score, ...game }) => game);
    }

    // 获取所有游戏
    function getAllGames() {
        // 从 index.html 获取游戏数据
        // 这里硬编码常用游戏，实际可以从页面获取
        const games = [];

        // 添加各类游戏
        const categories = {
            '益智类': ['记忆配对', '拼图游戏', '连连看', '24点', '汉诺塔', '扫雷'],
            '街机类': ['俄罗斯方块', '贪吃蛇', '打砖块', '2048', '宝石消除'],
            '运动类': ['酷跑冒险', '极速赛车', '点球大战', '投篮大赛'],
            '棋类': ['井字棋', '五子棋', '国际象棋'],
            '敏捷类': ['切水果', '打地鼠', '见缝插针'],
            'RPG冒险': ['勇者冒险', '地下城探险']
        };

        const icons = {
            '记忆配对': '🎴', '拼图游戏': '🧩', '连连看': '🔗', '24点': '🧮', '汉诺塔': '🗼', '扫雷': '💣',
            '俄罗斯方块': '🧱', '贪吃蛇': '🐍', '打砖块': '🧱', '2048': '🔢', '宝石消除': '💎',
            '酷跑冒险': '🏃', '极速赛车': '🏎️', '点球大战': '⚽', '投篮大赛': '🏀',
            '井字棋': '❌', '五子棋': '⭕', '国际象棋': '♟️',
            '切水果': '🔪', '打地鼠': '🔨', '见缝插针': '📍',
            '勇者冒险': '🗡️', '地下城探险': '🏰'
        };

        Object.entries(categories).forEach(([category, gameNames]) => {
            gameNames.forEach(name => {
                games.push({
                    name,
                    icon: icons[name] || '🎮',
                    category
                });
            });
        });

        return games;
    }

    // 获取分类推荐
    function getCategoryRecommendations(category, limit = 3) {
        const allGames = getAllGames();
        return allGames
            .filter(game => game.category === category)
            .slice(0, limit);
    }

    // 获取最近更新（模拟）
    function getNewGames(limit = 5) {
        const newGames = [
            { name: '节奏大师', icon: '🎵', type: '音乐节奏', category: '音乐节奏' },
            { name: '卡牌对战', icon: '🃏', type: '卡牌对战', category: '卡牌策略' },
            { name: '抽卡召唤', icon: '🎰', type: '抽卡养成', category: '抽卡养成' },
            { name: '放置矿工', icon: '⛏️', type: '放置', category: '放置挂机' }
        ];
        return newGames.slice(0, limit);
    }

    // 获取每日推荐
    function getDailyRecommendation() {
        const user = window.UserAccount ? window.UserAccount.getUser() : null;
        const day = new Date().getDate();

        // 基于日期和用户名生成固定推荐
        const dailyGames = getAllGames();
        const index = user ? (day + user.userId.length) % dailyGames.length : day % dailyGames.length;

        return dailyGames[index];
    }

    // 获取综合推荐数据
    function getAllRecommendations() {
        return {
            hot: getHotGames(5),
            recommended: getRecommendedGames(5),
            new: getNewGames(4),
            daily: getDailyRecommendation()
        };
    }

    // 导出
    window.Recommendation = {
        getHotGames,
        getRecommendedGames,
        getCategoryRecommendations,
        getNewGames,
        getDailyRecommendation,
        getAllRecommendations
    };
})();
