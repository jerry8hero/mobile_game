// 掌机游戏厅 - 微信小游戏入口
// 游戏大厅入口

App({
    onLaunch() {
        // 初始化平台
        this.initPlatform();
    },

    onShow() {
        // 页面显示
    },

    onHide() {
        // 页面隐藏
    },

    // 全局数据
    globalData: {
        platform: 'wechat',  // 平台标识
        isLogin: false,
        userInfo: null
    },

    // 初始化平台
    initPlatform() {
        // 检测是否在微信环境
        if (typeof wx !== 'undefined') {
            this.globalData.platform = 'wechat';
            console.log('平台: 微信小游戏');
        } else {
            this.globalData.platform = 'h5';
            console.log('平台: H5网页');
        }
    }
});
