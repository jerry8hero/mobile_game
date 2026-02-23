// pages/index/index.js
// 游戏大厅逻辑

const app = getApp();

// 游戏分类数据
const gameCategories = [
    { name: '益智类', icon: '🧩', count: 14, color: '#ff6b6b', dir: 'puzzle' },
    { name: '街机类', icon: '🎮', count: 10, color: '#48dbfb', dir: 'arcade' },
    { name: '编程启蒙类', icon: '🤖', count: 17, color: '#1dd1a1', dir: 'coding' },
    { name: '知识类', icon: '📚', count: 16, color: '#feca57', dir: 'knowledge' },
    { name: 'RPG冒险', icon: '⚔️', count: 4, color: '#ff9ff3', dir: 'rpg' },
    { name: '敏捷类', icon: '⚡', count: 8, color: '#54a0ff', dir: 'action' },
    { name: '模拟经营', icon: '🏠', count: 6, color: '#5f27cd', dir: 'simulation' },
    { name: '运动类', icon: '🏃', count: 4, color: '#ee5a24', dir: 'sports' },
    { name: '棋类', icon: '♟️', count: 3, color: '#009432', dir: 'board' },
    { name: '创意艺术', icon: '🎨', count: 3, color: '#ffc312', dir: 'art' }
];

// 分类游戏映射
const categoryGames = {
    '益智类': [
        { name: '记忆配对', icon: '🎴', type: '翻牌找相同', gameId: 'memory' },
        { name: '拼图游戏', icon: '🧩', type: '拼图挑战', gameId: 'puzzle' },
        { name: '连连看', icon: '🔗', type: '连线消除', gameId: 'link' },
        { name: '24点', icon: '🧮', type: '数学运算', gameId: '24points' },
        { name: '汉诺塔', icon: '🗼', type: '智力解谜', gameId: 'hanoi' },
        { name: '扫雷', icon: '💣', type: '排雷冒险', gameId: 'minesweeper' }
    ],
    '街机类': [
        { name: '俄罗斯方块', icon: '🧱', type: '经典方块', gameId: 'tetris' },
        { name: '贪吃蛇', icon: '🐍', type: '贪吃蛇', gameId: 'snake' },
        { name: '打砖块', icon: '🧱', type: '打砖块', gameId: 'brick' },
        { name: '2048', icon: '🔢', type: '数字合并', gameId: '2048' }
    ],
    '编程启蒙类': [
        { name: '可视化编程', icon: '💻', type: '编程入门', gameId: 'visualcode' },
        { name: '迷宫探险', icon: '🗺️', type: '迷宫解谜', gameId: 'maze' }
    ],
    'RPG冒险': [
        { name: '勇者冒险', icon: '🗡️', type: 'RPG冒险', gameId: 'hero' },
        { name: '地下城探险', icon: '🏰', type: '地下城', gameId: 'dungeon' }
    ],
    '敏捷类': [
        { name: '切水果', icon: '🔪', type: '水果切割', gameId: 'fruit' },
        { name: '打地鼠', icon: '🔨', type: '打地鼠', gameId: 'whack' }
    ],
    '模拟经营': [
        { name: '小小农场', icon: '🌾', type: '农场经营', gameId: 'farm' },
        { name: '小小餐厅', icon: '🍳', type: '餐厅经营', gameId: 'restaurant' }
    ],
    '运动类': [
        { name: '酷跑冒险', icon: '🏃', type: '跑酷游戏', gameId: 'runner' },
        { name: '极速赛车', icon: '🏎️', type: '赛车游戏', gameId: 'racing' }
    ],
    '棋类': [
        { name: '井字棋', icon: '❌', type: '三子棋', gameId: 'tictactoe' },
        { name: '五子棋', icon: '⭕', type: '五子棋', gameId: 'gomoku' }
    ],
    '知识类': [
        { name: '单词速记', icon: '📝', type: '背单词', gameId: 'words' },
        { name: '找不同', icon: '🔍', type: '找茬游戏', gameId: 'diff' }
    ],
    '创意艺术': [
        { name: '魔法画板', icon: '🖌️', type: '绘画', gameId: 'draw' },
        { name: '换装小游戏', icon: '👕', type: '换装', gameId: 'dressup' }
    ]
};

Page({
    data: {
        categories: [],
        currentCategory: null,
        games: [],
        showCategory: false,
        searchQuery: '',
        searchResults: [],
        showSearch: false,
        platform: 'wechat'
    },

    onLoad() {
        // 加载分类数据
        this.setData({
            categories: gameCategories,
            platform: app.globalData.platform || 'wechat'
        });

        // 加载收藏数据
        this.loadFavorites();
    },

    onShow() {
        // 每次显示刷新收藏状态
        this.loadFavorites();
    },

    // 加载收藏
    loadFavorites() {
        const favorites = wx.getStorageSync('favorites') || [];
        this.setData({ favorites });
    },

    // 点击分类
    onCategoryTap(e) {
        const { index } = e.currentTarget.dataset;
        const category = gameCategories[index];
        const games = categoryGames[category.name] || [];

        this.setData({
            currentCategory: category,
            games: games,
            showCategory: true
        });
    },

    // 返回分类
    onBackToCategories() {
        this.setData({
            currentCategory: null,
            games: [],
            showCategory: false,
            searchQuery: '',
            searchResults: [],
            showSearch: false
        });
    },

    // 搜索输入
    onSearchInput(e) {
        const query = e.detail.value;
        this.setData({ searchQuery: query });

        if (query.length > 0) {
            this.doSearch(query);
        } else {
            this.setData({
                showSearch: false,
                searchResults: []
            });
        }
    },

    // 执行搜索
    doSearch(query) {
        const results = [];
        query = query.toLowerCase();

        for (const [category, games] of Object.entries(categoryGames)) {
            games.forEach(game => {
                if (game.name.toLowerCase().includes(query) ||
                    game.type.toLowerCase().includes(query)) {
                    results.push({ ...game, category });
                }
            });
        }

        this.setData({
            searchResults: results,
            showSearch: true,
            showCategory: false,
            currentCategory: null
        });
    },

    // 关闭搜索
    onCloseSearch() {
        this.setData({
            searchQuery: '',
            searchResults: [],
            showSearch: false
        });
    },

    // 点击游戏
    onGameTap(e) {
        const { gameid } = e.currentTarget.dataset;
        // 跳转到游戏页面
        wx.navigateTo({
            url: `/pages/game/game?gameId=${gameid}`
        });
    },

    // 收藏/取消收藏
    onToggleFavorite(e) {
        const { gameid, gamename, gameicon, gametype, category } = e.currentTarget.dataset;
        let favorites = wx.getStorageSync('favorites') || [];

        const index = favorites.findIndex(f => f.gameId === gameid);
        if (index >= 0) {
            // 取消收藏
            favorites.splice(index, 1);
            wx.showToast({ title: '已取消收藏', icon: 'none' });
        } else {
            // 添加收藏
            favorites.push({
                gameId: gameid,
                name: gamename,
                icon: gameicon,
                type: gametype,
                category: category
            });
            wx.showToast({ title: '收藏成功', icon: 'success' });
        }

        wx.setStorageSync('favorites', favorites);
        this.loadFavorites();

        // 如果在游戏列表页面，刷新显示
        if (this.data.currentCategory) {
            this.setData({ games: categoryGames[this.data.currentCategory.name] || [] });
        }
    },

    // 切换全屏
    onToggleFullscreen() {
        if (wx.getDeviceInfo) {
            const info = wx.getDeviceInfo();
            // 微信小游戏全屏API有限制
            wx.showToast({
                title: '请点击右上角菜单全屏',
                icon: 'none'
            });
        }
    },

    // 分享
    onShareAppMessage() {
        return {
            title: '🎮 掌机游戏厅 - 经典游戏集合',
            path: '/pages/index/index',
            imageUrl: ''
        };
    }
});
