/**
 * 通用游戏手柄支持脚本 - gamepad-helper.js
 * 将此脚本添加到游戏页面，为游戏添加手柄控制支持
 *
 * 使用方法：
 * 1. 在游戏 HTML 文件末尾添加：<script src="gamepad-helper.js"></script>
 * 2. 或者通过 Tauri 的 window 注入
 */

(function() {
    'use strict';

    // 配置文件
    const CONFIG = {
        // 按键映射（可自定义）
        buttonMap: {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'Enter': 'a',      // 确认
            'Backspace': 'b',  // 返回/取消
            ' ': 'a',          // 空格也是确认
            'z': 'a',
            'x': 'b',
            'ShiftRight': 'select',
            'ControlRight': 'start'
        },
        // 手柄按键映射（标准手柄）
        gamepadMap: {
            0: 'a',      // A 按钮
            1: 'b',      // B 按钮
            2: 'x',      // X 按钮
            3: 'y',      // Y 按钮
            12: 'up',    // 方向上
            13: 'down',  // 方向下
            14: 'left',  // 方向左
            15: 'right', // 方向右
            9: 'start',  // Start
            8: 'select', // Select
            4: 'l1',     // L1
            5: 'r1'      // R1
        },
        // 死区设置
        deadzone: 0.2,
        // 是否显示虚拟按键
        showVirtualControls: false,
        // 自动检测游戏类型
        autoDetect: true
    };

    // 状态
    let state = {
        buttons: {},
        axes: { x: 0, y: 0 },
        gamepadConnected: false,
        lastButtons: {}
    };

    // 事件回调
    const callbacks = {
        onButtonDown: [],
        onButtonUp: [],
        onAxis: [],
        onConnect: [],
        onDisconnect: []
    };

    /**
     * 初始化
     */
    function init(options = {}) {
        // 合并配置
        Object.assign(CONFIG, options);

        // 键盘事件
        setupKeyboard();

        // 手柄事件
        setupGamepad();

        // 开始轮询
        startPolling();

        console.log('🎮 手柄支持已初始化');
    }

    /**
     * 设置键盘输入
     */
    function setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            const button = CONFIG.buttonMap[e.key];
            if (button && !state.buttons[button]) {
                state.buttons[button] = true;
                trigger('onButtonDown', button);
            }
        });

        document.addEventListener('keyup', (e) => {
            const button = CONFIG.buttonMap[e.key];
            if (button) {
                state.buttons[button] = false;
                trigger('onButtonUp', button);
            }
        });
    }

    /**
     * 设置手柄事件
     */
    function setupGamepad() {
        window.addEventListener('gamepadconnected', (e) => {
            state.gamepadConnected = true;
            console.log('🎮 手柄已连接:', e.gamepad.id);
            trigger('onConnect', e.gamepad);
        });

        window.addEventListener('gamepaddisconnected', () => {
            state.gamepadConnected = false;
            console.log('🎮 手柄已断开');
            trigger('onDisconnect');
        });
    }

    /**
     * 轮询手柄状态
     */
    function startPolling() {
        setInterval(poll, 16);
    }

    /**
     * 轮询
     */
    function poll() {
        if (!state.gamepadConnected) return;

        const gamepads = navigator.getGamepads();
        const gp = gamepads[0];
        if (!gp) return;

        // 检查按钮
        gp.buttons.forEach((btn, index) => {
            const button = CONFIG.gamepadMap[index];
            if (button) {
                const pressed = btn.pressed;

                if (pressed && !state.lastButtons[button]) {
                    state.buttons[button] = true;
                    trigger('onButtonDown', button);
                } else if (!pressed && state.lastButtons[button]) {
                    state.buttons[button] = false;
                    trigger('onButtonUp', button);
                }

                state.lastButtons[button] = pressed;
            }
        });

        // 摇杆
        const axisX = Math.abs(gp.axes[0]) > CONFIG.deadzone ? gp.axes[0] : 0;
        const axisY = Math.abs(gp.axes[1]) > CONFIG.deadzone ? gp.axes[1] : 0;

        if (axisX !== state.axes.x || axisY !== state.axes.y) {
            state.axes = { x: axisX, y: axisY };
            trigger('onAxis', state.axes);
        }
    }

    /**
     * 触发回调
     */
    function trigger(event, data) {
        if (callbacks[event]) {
            callbacks[event].forEach(cb => cb(data));
        }
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
     * 获取按钮状态
     */
    function getButton(button) {
        return state.buttons[button] || false;
    }

    /**
     * 获取摇杆状态
     */
    function getAxes() {
        return state.axes;
    }

    /**
     * 检查是否按下了按钮
     */
    function isPressed(button) {
        return !!state.buttons[button];
    }

    /**
     * 检查手柄是否连接
     */
    function isConnected() {
        return state.gamepadConnected || navigator.getGamepads()[0] !== null;
    }

    // 自动初始化
    const GamepadHelper = {
        init,
        on,
        getButton,
        getAxes,
        isPressed,
        isConnected,
        // 常用按钮别名
        BUTTONS: {
            UP: 'up', DOWN: 'down', LEFT: 'left', RIGHT: 'right',
            A: 'a', B: 'b', X: 'x', Y: 'y',
            START: 'start', SELECT: 'select', L1: 'l1', R1: 'r1'
        }
    };

    // 导出到全局
    window.GamepadHelper = GamepadHelper;

    // 自动初始化（如果页面加载完成）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init());
    } else {
        init();
    }
})();
