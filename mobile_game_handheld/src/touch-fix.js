/**
 * Switch 触控优化 - touch-fix.js
 * 优化触摸响应和手势操作
 */

(function() {
    'use strict';

    // 禁用默认的触摸行为
    function init() {
        // 禁用双指缩放
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // 禁用长按菜单
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // 禁用双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // 优化触摸事件
        optimizeTouchEvents();

        // 添加触摸反馈
        addTouchFeedback();

        console.log('👆 触控优化已应用');
    }

    // 优化触摸事件
    function optimizeTouchEvents() {
        // 为所有可点击元素添加 touch 优化
        const clickableElements = document.querySelectorAll('button, a, .game-card, .category-card');

        clickableElements.forEach(el => {
            // 移除默认的 touch 样式
            el.style.webkitTapHighlightColor = 'transparent';
            el.style.touchAction = 'manipulation';
        });
    }

    // 添加触摸反馈
    function addTouchFeedback() {
        const style = document.createElement('style');
        style.textContent = `
            /* 快速触摸反馈 */
            button, a, .game-card, .category-card {
                -webkit-tap-highlight-color: transparent;
                touch-action: manipulation;
            }

            button:active, a:active, .game-card:active, .category-card:active {
                transform: scale(0.96);
                opacity: 0.8;
            }

            /* 禁用文本选择 */
            body {
                -webkit-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
            }

            /* 禁用惯性滚动 */
            html, body {
                overscroll-behavior: none;
                overflow: hidden;
            }

            /* 游戏区域可以滚动 */
            .game-area, main {
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
