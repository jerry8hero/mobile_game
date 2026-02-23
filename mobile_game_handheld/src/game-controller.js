/**
 * 掌机游戏控制器 - game-controller.js
 * 处理键盘、虚拟按键和游戏手柄输入
 */

(function() {
    'use strict';

    // 控制器状态
    const ControllerState = {
        // 按键状态
        buttons: {
            up: false,
            down: false,
            left: false,
            right: false,
            a: false,
            b: false,
            x: false,
            y: false,
            start: false,
            select: false,
            l1: false,
            r1: false
        },
        // 摇杆状态
        axes: { x: 0, y: 0 },
        // 手柄连接状态
        gamepadConnected: false,
        gamepadId: null
    };

    // 回调函数
    const callbacks = {
        onButtonDown: [],
        onButtonUp: [],
        onAxisMove: [],
        onGamepadConnect: [],
        onGamepadDisconnect: []
    };

    // 游戏特定按键映射
    const gameMappings = {};

    // 轮询定时器
    let pollInterval = null;
    let lastButtons = {};

    /**
     * 初始化控制器
     */
    function init() {
        setupKeyboardInput();
        setupGamepad();
        startPolling();
        console.log('🎮 掌机控制器已初始化');
    }

    /**
     * 设置键盘输入
     */
    function setupKeyboardInput() {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'z': 'a',
            'x': 'b',
            'a': 'x',
            's': 'y',
            'Enter': 'start',
            'Shift': 'select',
            'q': 'l1',
            'w': 'r1'
        };

        document.addEventListener('keydown', (e) => {
            const button = keyMap[e.key];
            if (button && !ControllerState.buttons[button]) {
                ControllerState.buttons[button] = true;
                triggerButtonDown(button);
            }
        });

        document.addEventListener('keyup', (e) => {
            const button = keyMap[e.key];
            if (button) {
                ControllerState.buttons[button] = false;
                triggerButtonUp(button);
            }
        });
    }

    /**
     * 设置游戏手柄
     */
    function setupGamepad() {
        window.addEventListener('gamepadconnected', (e) => {
            ControllerState.gamepadConnected = true;
            ControllerState.gamepadId = e.gamepad.id;
            console.log('🎮 手柄已连接:', e.gamepad.id);
            callbacks.onGamepadConnect.forEach(cb => cb(e.gamepad));
            updateGamepadStatus(true, e.gamepad.id);
        });

        window.addEventListener('gamepaddisconnected', () => {
            ControllerState.gamepadConnected = false;
            ControllerState.gamepadId = null;
            console.log('🎮 手柄已断开');
            callbacks.onGamepadDisconnect.forEach(cb => cb());
            updateGamepadStatus(false);
        });
    }

    /**
     * 更新手柄状态显示
     */
    function updateGamepadStatus(connected, id = null) {
        const statusEl = document.getElementById('gamepadStatus');
        if (!statusEl) return;

        const dot = statusEl.querySelector('.status-dot');
        const text = statusEl.querySelector('.status-text');

        if (connected) {
            dot.classList.remove('disconnected');
            dot.classList.add('connected');
            text.textContent = `已连接: ${id.substring(0, 15)}`;
        } else {
            dot.classList.remove('connected');
            dot.classList.add('disconnected');
            text.textContent = '未连接手柄';
        }
    }

    /**
     * 开始轮询手柄状态
     */
    function startPolling() {
        pollInterval = setInterval(pollGamepad, 16); // 约60fps
    }

    /**
     * 轮询手柄
     */
    function pollGamepad() {
        const gamepads = navigator.getGamepads();
        if (!gamepads[0]) return;

        const gp = gamepads[0];
        const newButtons = {};

        // 读取按钮状态 (标准手柄映射)
        // 0: A, 1: B, 2: X, 3: Y
        // 12: 上, 13: 下, 14: 左, 15: 右
        // 9: Start, 8: Select
        // 4: L1, 5: R1

        const buttonMap = {
            0: 'a',
            1: 'b',
            2: 'x',
            3: 'y',
            12: 'up',
            13: 'down',
            14: 'left',
            15: 'right',
            9: 'start',
            8: 'select',
            4: 'l1',
            5: 'r1'
        };

        // 检查按钮变化
        gp.buttons.forEach((btn, index) => {
            const buttonName = buttonMap[index];
            if (buttonName) {
                const pressed = btn.pressed;
                newButtons[buttonName] = pressed;

                // 检测按下事件
                if (pressed && !lastButtons[buttonName]) {
                    ControllerState.buttons[buttonName] = true;
                    triggerButtonDown(buttonName);
                }
                // 检测释放事件
                else if (!pressed && lastButtons[buttonName]) {
                    ControllerState.buttons[buttonName] = false;
                    triggerButtonUp(buttonName);
                }
            }
        });

        // 读取摇杆 (axes 0, 1 通常是左摇杆)
        const deadzone = 0.15;
        let axisX = gp.axes[0] || 0;
        let axisY = gp.axes[1] || 0;

        // 应用死区
        if (Math.abs(axisX) < deadzone) axisX = 0;
        if (Math.abs(axisY) < deadzone) axisY = 0;

        // 检测摇杆方向
        const newDirection = {
            up: axisY < -0.5,
            down: axisY > 0.5,
            left: axisX < -0.5,
            right: axisX > 0.5
        };

        // 处理方向键（带死区）
        ['up', 'down', 'left', 'right'].forEach(dir => {
            if (newDirection[dir] && !lastButtons[dir]) {
                ControllerState.buttons[dir] = true;
                triggerButtonDown(dir);
            } else if (!newDirection[dir] && lastButtons[dir]) {
                ControllerState.buttons[dir] = false;
                triggerButtonUp(dir);
            }
        });

        ControllerState.axes = { x: axisX, y: axisY };
        lastButtons = { ...newButtons };

        // 触发摇杆移动回调
        if (Math.abs(axisX) > 0 || Math.abs(axisY) > 0) {
            callbacks.onAxisMove.forEach(cb => cb(ControllerState.axes));
        }
    }

    /**
     * 触发按钮按下事件
     */
    function triggerButtonDown(button) {
        callbacks.onButtonDown.forEach(cb => cb(button));
    }

    /**
     * 触发按钮释放事件
     */
    function triggerButtonUp(button) {
        callbacks.onButtonUp.forEach(cb => cb(button));
    }

    /**
     * 注册游戏按键映射
     * @param {string} gameId - 游戏ID
     * @param {Object} mapping - 按键映射
     */
    function registerGameMapping(gameId, mapping) {
        gameMappings[gameId] = mapping;
    }

    /**
     * 获取当前按键状态
     */
    function getButtonState(button) {
        return ControllerState.buttons[button];
    }

    /**
     * 获取摇杆状态
     */
    function getAxes() {
        return ControllerState.axes;
    }

    /**
     * 检查手柄是否连接
     */
    function isGamepadConnected() {
        return ControllerState.gamepadConnected;
    }

    /**
     * 注册回调
     */
    function on(event, callback) {
        if (callbacks[event]) {
            callbacks[event].push(callback);
        }
    }

    /**
     * 移除回调
     */
    function off(event, callback) {
        if (callbacks[event]) {
            const index = callbacks[event].indexOf(callback);
            if (index > -1) {
                callbacks[event].splice(index, 1);
            }
        }
    }

    // 导出控制器API
    window.GameController = {
        init,
        register: registerGameMapping,
        getButtonState,
        getAxes,
        isGamepadConnected,
        on,
        off,
        // 常量
        BUTTONS: {
            UP: 'up',
            DOWN: 'down',
            LEFT: 'left',
            RIGHT: 'right',
            A: 'a',
            B: 'b',
            X: 'x',
            Y: 'y',
            START: 'start',
            SELECT: 'select',
            L1: 'l1',
            R1: 'r1'
        }
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
