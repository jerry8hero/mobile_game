// 平台检测与适配模块
// 用于区分微信小游戏和H5平台

const Platform = {
    // 平台类型
    platform: 'unknown',

    // 初始化平台检测
    init() {
        // 检测微信环境
        if (typeof wx !== 'undefined' && wx.getSystemInfo) {
            this.platform = 'wechat';
            this.adaptWechat();
        } else {
            this.platform = 'h5';
            this.adaptH5();
        }
        console.log('[Platform] 当前平台:', this.platform);
        return this.platform;
    },

    // 判断是否微信小游戏
    isWechat() {
        return this.platform === 'wechat';
    },

    // 判断是否H5
    isH5() {
        return this.platform === 'h5';
    },

    // 获取平台标识
    getPlatform() {
        return this.platform;
    },

    // 微信适配
    adaptWechat() {
        // 适配 wx.createCanvas
        if (!Canvas) {
            // 获取主画布
            const sysInfo = wx.getSystemInfoSync();
            const width = sysInfo.windowWidth;
            const height = sysInfo.windowHeight;

            // 创建主画布
            try {
                const canvas = wx.createCanvas();
                canvas.width = width * wx.getSystemInfoSync().pixelRatio;
                canvas.height = height * wx.getSystemInfoSync().pixelRatio;
                canvas.style = {
                    width: width + 'px',
                    height: height + 'px'
                };
                // 保存到全局
                if (typeof global !== 'undefined') {
                    global.canvas = canvas;
                }
                if (typeof window !== 'undefined') {
                    window.canvas = canvas;
                }
            } catch (e) {
                console.warn('[Platform] 创建Canvas失败:', e);
            }
        }

        // 适配存储API
        this.storage = {
            set: (key, value) => {
                try {
                    wx.setStorageSync(key, value);
                } catch (e) {
                    console.warn('[Platform] 存储失败:', e);
                }
            },
            get: (key, defaultValue) => {
                try {
                    return wx.getStorageSync(key) || defaultValue;
                } catch (e) {
                    return defaultValue;
                }
            },
            remove: (key) => {
                try {
                    wx.removeStorageSync(key);
                } catch (e) {
                    console.warn('[Platform] 删除失败:', e);
                }
            }
        };

        // 适配触摸事件
        this.touch = {
            onStart: (callback) => {
                wx.onTouchStart(callback);
            },
            onMove: (callback) => {
                wx.onTouchMove(callback);
            },
            onEnd: (callback) => {
                wx.onTouchEnd(callback);
            }
        };

        // 适配提示
        this.toast = (title, icon = 'none') => {
            wx.showToast({
                title: title,
                icon: icon,
                duration: 2000
            });
        };

        // 适配loading
        this.loading = {
            show: (title = '加载中') => {
                wx.showLoading({ title: title });
            },
            hide: () => {
                wx.hideLoading();
            }
        };

        // 适配导航
        this.navigate = (url) => {
            wx.navigateTo({ url: url });
        };

        // 分享
        this.share = (options = {}) => {
            return {
                title: options.title || '掌机游戏厅',
                path: options.path || '/pages/index/index',
                imageUrl: options.imageUrl || ''
            };
        };
    },

    // H5适配
    adaptH5() {
        // 存储适配
        this.storage = {
            set: (key, value) => {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (e) {
                    console.warn('[Platform] 存储失败:', e);
                }
            },
            get: (key, defaultValue) => {
                try {
                    const value = localStorage.getItem(key);
                    return value ? JSON.parse(value) : defaultValue;
                } catch (e) {
                    return defaultValue;
                }
            },
            remove: (key) => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    console.warn('[Platform] 删除失败:', e);
                }
            }
        };

        // 触摸事件适配
        this.touch = {
            onStart: (callback) => {
                document.addEventListener('touchstart', callback);
            },
            onMove: (callback) => {
                document.addEventListener('touchmove', callback);
            },
            onEnd: (callback) => {
                document.addEventListener('touchend', callback);
            }
        };

        // 提示适配
        this.toast = (title) => {
            alert(title);
        };

        // Loading适配
        this.loading = {
            show: (title) => {
                // H5可以显示自定义loading
                const loadingEl = document.createElement('div');
                loadingEl.id = 'platform-loading';
                loadingEl.innerHTML = `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:#fff;padding:20px 40px;border-radius:10px;z-index:9999;">${title}</div>`;
                document.body.appendChild(loadingEl);
            },
            hide: () => {
                const loadingEl = document.getElementById('platform-loading');
                if (loadingEl) loadingEl.remove();
            }
        };

        // 导航适配
        this.navigate = (url) => {
            window.location.href = url;
        };

        // 分享适配
        this.share = () => {
            return {
                title: document.title,
                path: window.location.pathname
            };
        };
    }
};

// 初始化平台
Platform.init();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Platform;
}
