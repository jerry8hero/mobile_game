// pages/game/game.js
// 游戏页面 - 通用游戏容器

const GameManager = require('../../js/game-manager.js');

Page({
    data: {
        gameId: '',
        gameInfo: null,
        gameLoaded: false,
        score: 0,
        highScore: 0,
        showMenu: false
    },

    onLoad(options) {
        const gameId = options.gameId;
        if (!gameId) {
            wx.showToast({
                title: '游戏不存在',
                icon: 'none'
            });
            setTimeout(() => {
                wx.navigateBack();
            }, 1500);
            return;
        }

        const gameInfo = GameManager.getGame(gameId);
        if (!gameInfo) {
            wx.showToast({
                title: '游戏加载中...',
                icon: 'none'
            });
            return;
        }

        const highScore = GameManager.getHighScore(gameId);

        this.setData({
            gameId,
            gameInfo,
            highScore
        });

        // 初始化游戏管理器
        GameManager.init();

        // 加载游戏
        this.loadGame(gameId);
    },

    onUnload() {
        // 清理游戏
        if (this.gameInstance && this.gameInstance.destroy) {
            this.gameInstance.destroy();
        }
    },

    // 加载游戏
    async loadGame(gameId) {
        const gameInfo = GameManager.getGame(gameId);
        if (!gameInfo || !gameInfo.load) {
            wx.showToast({
                title: '游戏暂未开放',
                icon: 'none'
            });
            return;
        }

        try {
            wx.showLoading({ title: '加载中...' });

            // 动态加载游戏模块
            const gameModule = await gameInfo.load();
            const GameClass = gameModule.default || gameModule;

            // 创建游戏实例
            this.gameInstance = new GameClass({
                canvasId: 'gameCanvas',
                width: 300,
                height: 500,
                onScore: (score) => {
                    this.setData({ score });
                    // 保存分数
                    const isNewHigh = GameManager.saveScore(this.data.gameId, score);
                    if (isNewHigh) {
                        this.setData({ highScore: score });
                    }
                },
                onGameOver: () => {
                    this.setData({ gameLoaded: false });
                }
            });

            // 启动游戏
            this.gameInstance.start();

            this.setData({ gameLoaded: true });
            wx.hideLoading();

        } catch (err) {
            console.error('[Game] 加载失败:', err);
            wx.hideLoading();
            wx.showToast({
                title: '游戏加载失败',
                icon: 'none'
            });
        }
    },

    // 重新开始
    onRestart() {
        if (this.gameInstance) {
            this.gameInstance.restart();
            this.setData({ score: 0, gameLoaded: true });
        }
    },

    // 暂停/继续
    onPause() {
        if (this.gameInstance) {
            this.gameInstance.pause();
        }
    },

    // 菜单切换
    onToggleMenu() {
        this.setData({
            showMenu: !this.data.showMenu
        });
    },

    // 返回大厅
    onBackToHall() {
        wx.navigateBack();
    },

    // 分享
    onShareAppMessage() {
        return {
            title: `🎮 ${this.data.gameInfo?.name || '游戏'}`,
            path: `/pages/game/game?gameId=${this.data.gameId}`
        };
    }
});
