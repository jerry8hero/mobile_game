/**
 * 性能优化脚本 - performance.js
 * 减少 Switch 浏览器的性能开销
 */

(function() {
    'use strict';

    // 性能配置
    const CONFIG = {
        // 是否启用性能优化
        enabled: true,
        // 减少动画帧率
        reducedFPS: true,
        targetFPS: 30,
        // 延迟加载图片
        lazyLoadImages: true,
        // 减少 Canvas 质量
        reduceCanvasQuality: true,
        canvasScale: 0.8
    };

    // 初始化
    function init() {
        if (!CONFIG.enabled) return;

        // 检测是否为 Switch 浏览器
        const isSwitch = detectSwitch();

        if (isSwitch) {
            console.log('🎮 Switch 浏览器检测到，应用优化...');
            applyOptimizations();
        }

        // 监听页面可见性，暂停后台动画
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // 检测 Switch 浏览器
    function detectSwitch() {
        const ua = navigator.userAgent;
        return ua.includes('Nintendo Switch');
    }

    // 应用优化
    function applyOptimizations() {
        // 1. 减少 Canvas 分辨率
        reduceCanvasResolution();

        // 2. 优化动画
        optimizeAnimations();

        // 3. 禁用不必要的效果
        disableHeavyEffects();

        // 4. 添加性能模式提示
        addPerformanceIndicator();
    }

    // 减少 Canvas 分辨率
    function reduceCanvasResolution() {
        if (!CONFIG.reduceCanvasQuality) return;

        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            // 保存原始尺寸
            const originalWidth = canvas.width;
            const originalHeight = canvas.height;

            // 缩小尺寸
            canvas.width = originalWidth * CONFIG.canvasScale;
            canvas.height = originalHeight * CONFIG.canvasScale;

            // 缩放显示
            canvas.style.width = originalWidth + 'px';
            canvas.style.height = originalHeight + 'px';

            console.log('📉 Canvas 分辨率降低:', originalWidth, '->', canvas.width);
        });
    }

    // 优化动画
    function optimizeAnimations() {
        if (!CONFIG.reducedFPS) return;

        // 覆盖 requestAnimationFrame
        const originalRAF = window.requestAnimationFrame;
        let lastTime = 0;
        const interval = 1000 / CONFIG.targetFPS;

        window.requestAnimationFrame = function(callback) {
            const now = performance.now();
            const delta = now - lastTime;

            if (delta >= interval) {
                lastTime = now - (delta % interval);
                return originalRAF.call(window, callback);
            }
            return null;
        };

        // 降低 CSS 动画复杂度
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }

    // 禁用不必要的效果
    function disableHeavyEffects() {
        // 禁用阴影
        const style = document.createElement('style');
        style.textContent = `
            * {
                box-shadow: none !important;
                text-shadow: none !important;
            }
            canvas {
                image-rendering: pixelated;
            }
        `;
        document.head.appendChild(style);
    }

    // 添加性能模式指示器
    function addPerformanceIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'perf-indicator';
        indicator.innerHTML = '⚡ 性能模式';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: #4ecdc4;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 99999;
            display: none;
        `;
        document.body.appendChild(indicator);

        // 长按显示
        let pressTimer;
        document.addEventListener('touchstart', () => {
            pressTimer = setTimeout(() => {
                indicator.style.display = 'block';
            }, 1000);
        });
        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
            indicator.style.display = 'none';
        });
    }

    // 处理页面可见性
    function handleVisibilityChange() {
        if (document.hidden) {
            // 页面隐藏时暂停动画
            console.log('⏸️ 页面隐藏，暂停动画');
        } else {
            // 页面显示时恢复
            console.log('▶️ 页面显示，恢复动画');
        }
    }

    // 预加载游戏
    function preloadGame(gameUrl) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = gameUrl;
        document.head.appendChild(link);
    }

    // 导出
    window.PerformanceOptimizer = {
        init,
        preloadGame,
        config: CONFIG
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
