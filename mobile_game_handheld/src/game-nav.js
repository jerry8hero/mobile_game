/**
 * 游戏内导航栏 - game-nav.js
 * 悬浮导航栏，方便在游戏中返回和操作
 */

(function() {
    'use strict';

    // 创建导航栏
    function create() {
        if (document.getElementById('game-nav')) return;

        const nav = document.createElement('div');
        nav.id = 'game-nav';
        nav.innerHTML = `
            <button class="nav-btn" id="nav-back" title="返回">
                <span>🏠</span>
            </button>
            <button class="nav-btn" id="nav-home" title="主页">
                <span>🔙</span>
            </button>
            <button class="nav-btn" id="nav-pause" title="暂停">
                <span>⏸</span>
            </button>
            <button class="nav-btn" id="nav-fullscreen" title="全屏">
                <span>⛶</span>
            </button>
        `;

        // 样式
        const style = document.createElement('style');
        style.textContent = `
            #game-nav {
                position: fixed;
                top: 10px;
                left: 10px;
                display: flex;
                gap: 8px;
                z-index: 999999;
                opacity: 0.3;
                transition: opacity 0.3s;
            }

            #game-nav:hover, #game-nav:active {
                opacity: 1;
            }

            #game-nav .nav-btn {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                background: rgba(0,0,0,0.7);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            #game-nav .nav-btn:active {
                transform: scale(0.9);
                background: rgba(233,69,96,0.8);
            }

            /* 暂停遮罩 */
            #game-pause-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 999998;
                flex-direction: column;
            }

            #game-pause-overlay.show {
                display: flex;
            }

            #game-pause-overlay h2 {
                color: white;
                font-size: 2rem;
                margin-bottom: 20px;
            }

            #game-pause-overlay .pause-buttons {
                display: flex;
                gap: 20px;
            }

            #game-pause-overlay button {
                padding: 15px 30px;
                font-size: 1.2rem;
                border-radius: 10px;
                border: none;
                cursor: pointer;
            }

            .resume-btn {
                background: #27ae60;
                color: white;
            }

            .home-btn {
                background: #e74c3c;
                color: white;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(nav);

        // 暂停遮罩
        const overlay = document.createElement('div');
        overlay.id = 'game-pause-overlay';
        overlay.innerHTML = `
            <h2>⏸️ 游戏暂停</h2>
            <div class="pause-buttons">
                <button class="resume-btn" id="pause-resume">继续游戏</button>
                <button class="home-btn" id="pause-home">返回主页</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // 绑定事件
        bindEvents();
    }

    // 绑定事件
    function bindEvents() {
        // 返回
        document.getElementById('nav-back').addEventListener('click', () => {
            history.back();
        });

        // 主页
        document.getElementById('nav-home').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // 暂停
        document.getElementById('nav-pause').addEventListener('click', togglePause);

        // 全屏
        document.getElementById('nav-fullscreen').addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });

        // 继续
        document.getElementById('pause-resume').addEventListener('click', togglePause);

        // 返回主页
        document.getElementById('pause-home').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                togglePause();
            }
        });
    }

    // 切换暂停
    function togglePause() {
        const overlay = document.getElementById('game-pause-overlay');
        overlay.classList.toggle('show');

        // 发送暂停事件
        const event = new CustomEvent('gamepause', {
            detail: { paused: overlay.classList.contains('show') }
        });
        window.dispatchEvent(event);
    }

    // 初始化
    function init() {
        create();
    }

    // 导出
    window.GameNav = {
        init,
        togglePause
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
