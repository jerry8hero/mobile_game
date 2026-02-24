/**
 * 用户账号模块 - user-account.js
 * 游客登录、用户名/头像设置、数据持久化
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_user';
    const CURRENCY_KEY = 'handheld_currency';

    // 预设头像列表
    const AVATARS = ['😀', '😎', '🤓', '🧑‍🎤', '🧑‍🎨', '🧑‍🚀', '🧑‍🔬', '👨‍💻', '👩‍💻', '🦸', '🦹', '🧙', '🧝', '🐱', '🐶', '🦊', '🐼', '🐨'];

    // 预设用户名
    const DEFAULT_NAMES = ['游客', '新手', '玩家', '挑战者', '王者', '达人', '高手', '传奇'];

    // 生成唯一ID
    function generateId() {
        return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // 获取用户数据
    function getUser() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    // 保存用户数据
    function saveUser(user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    // 游客自动登录
    function autoLogin() {
        let user = getUser();
        if (!user) {
            // 创建新游客
            user = {
                userId: generateId(),
                username: DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)] + Math.floor(Math.random() * 1000),
                avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
                createdAt: Date.now(),
                lastLogin: Date.now(),
                coins: 100  // 初始金币
            };
            saveUser(user);
        } else {
            // 更新最后登录时间
            user.lastLogin = Date.now();
            saveUser(user);
        }
        return user;
    }

    // 设置用户名
    function setUsername(name) {
        const user = getUser();
        if (user && name && name.trim().length > 0) {
            user.username = name.trim().substring(0, 12);  // 最多12字符
            saveUser(user);
            return user;
        }
        return null;
    }

    // 设置头像
    function setAvatar(avatar) {
        const user = getUser();
        if (user && AVATARS.includes(avatar)) {
            user.avatar = avatar;
            saveUser(user);
            return user;
        }
        return null;
    }

    // 获取金币
    function getCoins() {
        const user = getUser();
        return user ? (user.coins || 0) : 0;
    }

    // 添加金币
    function addCoins(amount) {
        const user = getUser();
        if (user) {
            user.coins = (user.coins || 0) + amount;
            saveUser(user);
            return user.coins;
        }
        return 0;
    }

    // 消费金币
    function spendCoins(amount) {
        const user = getUser();
        if (user && user.coins >= amount) {
            user.coins -= amount;
            saveUser(user);
            return user.coins;
        }
        return -1;  // 金币不足
    }

    // 检查是否已登录
    function isLoggedIn() {
        return getUser() !== null;
    }

    // 登出（清除用户数据）
    function logout() {
        localStorage.removeItem(STORAGE_KEY);
    }

    // 获取头像列表
    function getAvatarList() {
        return AVATARS;
    }

    // 导出
    window.UserAccount = {
        autoLogin: autoLogin,
        getUser: getUser,
        setUsername: setUsername,
        setAvatar: setAvatar,
        getCoins: getCoins,
        addCoins: addCoins,
        spendCoins: spendCoins,
        isLoggedIn: isLoggedIn,
        logout: logout,
        getAvatarList: getAvatarList
    };
})();
