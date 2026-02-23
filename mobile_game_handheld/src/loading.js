/**
 * 加载界面优化 - loading.js
 * 提供更好的游戏加载体验
 */

(function() {
    'use strict';

    // 创建加载界面
    function createLoadingScreen() {
        // 检查是否已存在
        if (document.getElementById('game-loading')) return;

        const loader = document.createElement('div');
        loader.id = 'game-loading';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">加载中...</div>
                <div class="loader-progress">
                    <div class="loader-bar"></div>
                </div>
                <div class="loader-tip">首次加载后即可离线游玩</div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #game-loading {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                font-family: 'Segoe UI', sans-serif;
            }

            .loader-content {
                text-align: center;
                color: #fff;
            }

            .loader-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255,255,255,0.1);
                border-top-color: #e94560;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .loader-text {
                font-size: 18px;
                margin-bottom: 15px;
                color: #eaeaea;
            }

            .loader-progress {
                width: 200px;
                height: 6px;
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
                margin: 0 auto 15px;
                overflow: hidden;
            }

            .loader-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #e94560, #ff6b6b);
                border-radius: 3px;
                transition: width 0.3s;
            }

            .loader-tip {
                font-size: 12px;
                color: rgba(255,255,255,0.5);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(loader);
    }

    // 显示加载界面
    function showLoading(text = '加载中...') {
        createLoadingScreen();
        const loader = document.getElementById('game-loading');
        const textEl = loader.querySelector('.loader-text');
        const barEl = loader.querySelector('.loader-bar');

        if (textEl) textEl.textContent = text;
        if (barEl) barEl.style.width = '30%';

        loader.style.display = 'flex';
    }

    // 更新加载进度
    function updateProgress(percent, text) {
        const loader = document.getElementById('game-loading');
        if (!loader) return;

        const textEl = loader.querySelector('.loader-text');
        const barEl = loader.querySelector('.loader-bar');

        if (textEl && text) textEl.textContent = text;
        if (barEl) barEl.style.width = percent + '%';
    }

    // 隐藏加载界面
    function hideLoading() {
        const loader = document.getElementById('game-loading');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }

    // 自动拦截链接点击
    function interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('#')) {
                const href = link.href;

                // 显示加载界面
                showLoading('正在进入游戏...');

                // 延迟跳转，让加载界面显示
                e.preventDefault();
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        }, true);
    }

    // 初始化
    function init() {
        // 自动拦截链接
        interceptLinks();

        // 页面加载完成后隐藏
        window.addEventListener('load', () => {
            setTimeout(hideLoading, 500);
        });
    }

    // 导出
    window.GameLoader = {
        show: showLoading,
        update: updateProgress,
        hide: hideLoading,
        init
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
