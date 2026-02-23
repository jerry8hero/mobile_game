/**
 * Switch 触摸控制器 - switch-controls.js
 * 专为 Switch 浏览器优化的虚拟按键
 */

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        // 是否显示虚拟按键
        showControls: true,
        // 按键大小
        buttonSize: 60,
        // 透明度
        opacity: 0.6
    };

    // 创建虚拟按键容器
    function createControls() {
        // 检查是否已存在
        if (document.getElementById('switch-controls')) return;

        const container = document.createElement('div');
        container.id = 'switch-controls';
        container.innerHTML = `
            <!-- 左侧十字键 -->
            <div class="switch-dpad">
                <button class="switch-btn dpad-up" data-dir="up">▲</button>
                <button class="switch-btn dpad-left" data-dir="left">◀</button>
                <button class="switch-btn dpad-center">●</button>
                <button class="switch-btn dpad-right" data-dir="right">▶</button>
                <button class="switch-btn dpad-down" data-dir="down">▼</button>
            </div>

            <!-- 右侧 ABXY 按钮 -->
            <div class="switch-abxy">
                <button class="switch-btn btn-y" data-action="y">Y</button>
                <button class="switch-btn btn-x" data-action="x">X</button>
                <button class="switch-btn btn-b" data-action="b">B</button>
                <button class="switch-btn btn-a" data-action="a">A</button>
            </div>

            <!-- 底部系统按钮 -->
            <div class="switch-system">
                <button class="switch-btn sys-btn" data-action="select">SELECT</button>
                <button class="switch-btn sys-btn" data-action="start">START</button>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #switch-controls {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 200px;
                pointer-events: none;
                z-index: 9999;
                display: flex;
                justify-content: space-between;
                padding: 20px 30px;
                background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
            }

            .switch-dpad {
                display: grid;
                grid-template-columns: repeat(3, 50px);
                grid-template-rows: repeat(3, 50px);
                gap: 5px;
                pointer-events: auto;
            }

            .switch-btn {
                width: 50px;
                height: 50px;
                border-radius: 10px;
                background: rgba(255,255,255,0.3);
                border: 2px solid rgba(255,255,255,0.5);
                color: white;
                font-size: 16px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            }

            .switch-btn:active {
                background: rgba(233,69,96,0.8);
                transform: scale(0.95);
            }

            .switch-abxy {
                display: grid;
                grid-template-columns: repeat(2, 55px);
                grid-template-rows: repeat(2, 55px);
                gap: 8px;
                pointer-events: auto;
                transform: rotate(30deg);
            }

            .switch-abxy .switch-btn {
                border-radius: 50%;
            }

            .btn-a { background: rgba(255,107,107,0.7); }
            .btn-b { background: rgba(78,205,196,0.7); }
            .btn-x { background: rgba(69,183,209,0.7); }
            .btn-y { background: rgba(150,206,180,0.7); }

            .switch-system {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 30px;
                pointer-events: auto;
            }

            .sys-btn {
                width: 70px;
                height: 30px;
                border-radius: 15px;
                font-size: 12px;
                background: rgba(255,255,255,0.2);
            }

            /* 隐藏摇杆中心点 */
            .dpad-center {
                background: transparent;
                border: none;
            }

            /* 横屏模式 */
            @media (orientation: landscape) {
                #switch-controls {
                    height: 100vh;
                    width: 180px;
                    left: auto;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    flex-direction: column;
                    background: linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 100%);
                    padding: 50px 20px;
                }

                .switch-system {
                    position: static;
                    transform: none;
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(container);

        // 绑定事件
        bindEvents(container);
    }

    // 绑定触摸事件
    function bindEvents(container) {
        // 十字键
        container.querySelectorAll('.dpad-up, .dpad-down, .dpad-left, .dpad-right').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const dir = btn.dataset.dir;
                triggerButton('down', dir);
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const dir = btn.dataset.dir;
                triggerButton('up', dir);
            });
        });

        // ABXY 按钮
        container.querySelectorAll('.btn-a, .btn-b, .btn-x, .btn-y').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                triggerButton('down', action);
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                triggerButton('up', action);
            });
        });

        // 系统按钮
        container.querySelectorAll('.sys-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                triggerButton('down', action);
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                triggerButton('up', action);
            });
        });
    }

    // 触发按钮事件
    function triggerButton(type, button) {
        // 发送到 GameController
        if (window.GameController) {
            if (type === 'down') {
                GameController.onButtonDown.forEach(cb => cb(button));
            } else {
                GameController.onButtonUp.forEach(cb => cb(button));
            }
        }

        // 发送自定义事件
        const event = new CustomEvent('switchbutton', {
            detail: { type, button }
        });
        window.dispatchEvent(event);
    }

    // 初始化
    function init() {
        // 延迟创建，确保 DOM 加载完成
        setTimeout(() => {
            if (CONFIG.showControls) {
                createControls();
            }
        }, 500);
    }

    // 显示/隐藏控制
    function show() {
        const controls = document.getElementById('switch-controls');
        if (controls) controls.style.display = 'flex';
    }

    function hide() {
        const controls = document.getElementById('switch-controls');
        if (controls) controls.style.display = 'none';
    }

    // 导出
    window.SwitchControls = {
        init,
        show,
        hide
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
