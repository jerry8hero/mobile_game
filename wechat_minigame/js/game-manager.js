// js/game-manager.js
// 游戏管理器 - 负责加载和管理游戏

const GameManager = {
    // 游戏注册表
    games: {},

    // 当前运行的游戏
    currentGame: null,

    // 初始化游戏管理器
    init() {
        this.registerGames();
    },

    // 注册所有游戏
    registerGames() {
        // 益智类
        this.register('memory', {
            name: '记忆配对',
            icon: '🎴',
            type: '翻牌找相同',
            category: '益智类',
            load: () => import('./native-games/memory.js')
        });

        this.register('puzzle', {
            name: '拼图游戏',
            icon: '🧩',
            type: '拼图挑战',
            category: '益智类',
            load: () => import('./native-games/puzzle.js')
        });

        this.register('link', {
            name: '连连看',
            icon: '🔗',
            type: '连线消除',
            category: '益智类',
            load: () => import('./native-games/link.js')
        });

        this.register('24points', {
            name: '24点',
            icon: '🧮',
            type: '数学运算',
            category: '益智类',
            load: () => import('./native-games/24points.js')
        });

        this.register('hanoi', {
            name: '汉诺塔',
            icon: '🗼',
            type: '智力解谜',
            category: '益智类',
            load: () => import('./native-games/hanoi.js')
        });

        this.register('minesweeper', {
            name: '扫雷',
            icon: '💣',
            type: '排雷冒险',
            category: '益智类',
            load: () => import('./native-games/minesweeper.js')
        });

        // 街机类
        this.register('tetris', {
            name: '俄罗斯方块',
            icon: '🧱',
            type: '经典方块',
            category: '街机类',
            load: () => import('./native-games/tetris.js')
        });

        this.register('snake', {
            name: '贪吃蛇',
            icon: '🐍',
            type: '贪吃蛇',
            category: '街机类',
            load: () => import('./native-games/snake.js')
        });

        this.register('brick', {
            name: '打砖块',
            icon: '🧱',
            type: '打砖块',
            category: '街机类',
            load: () => import('./native-games/brick.js')
        });

        this.register('2048', {
            name: '2048',
            icon: '🔢',
            type: '数字合并',
            category: '街机类',
            load: () => import('./native-games/2048.js')
        });

        // 棋类
        this.register('tictactoe', {
            name: '井字棋',
            icon: '❌',
            type: '三子棋',
            category: '棋类',
            load: () => import('./native-games/tictactoe.js')
        });

        this.register('gomoku', {
            name: '五子棋',
            icon: '⭕',
            type: '五子棋',
            category: '棋类',
            load: () => import('./native-games/gomoku.js')
        });

        console.log(`[GameManager] 已注册 ${Object.keys(this.games).length} 个游戏`);
    },

    // 注册游戏
    register(id, game) {
        this.games[id] = game;
    },

    // 获取游戏信息
    getGame(id) {
        return this.games[id];
    },

    // 获取所有游戏
    getAllGames() {
        return Object.entries(this.games).map(([id, game]) => ({
            id,
            ...game
        }));
    },

    // 按分类获取游戏
    getGamesByCategory(category) {
        return Object.entries(this.games)
            .filter(([id, game]) => game.category === category)
            .map(([id, game]) => ({
                id,
                ...game
            }));
    },

    // 保存游戏分数
    saveScore(gameId, score) {
        const key = `score_${gameId}`;
        const highScore = wx.getStorageSync(key) || 0;
        if (score > highScore) {
            wx.setStorageSync(key, score);
            return true; // 新高分
        }
        return false;
    },

    // 获取最高分
    getHighScore(gameId) {
        const key = `score_${gameId}`;
        return wx.getStorageSync(key) || 0;
    }
};

// 导出
module.exports = GameManager;
