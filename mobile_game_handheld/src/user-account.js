/**
 * 用户账号模块 - user-account.js
 * 游客登录、用户名/头像设置、数据持久化
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_user';
    const CURRENCY_KEY = 'handheld_currency';

    // 预设头像列表
    let AVATARS = ['😀', '😎', '🤓', '🧑‍🎤', '🧑‍🎨', '🧑‍🚀', '🧑‍🔬', '👨‍💻', '👩‍💻', '🦸', '🦹', '🧙', '🧝', '🐱', '🐶', '🦊', '🐼', '🐨'];

    // 预设用户名
    const DEFAULT_NAMES = ['游客', '新手', '玩家', '挑战者', '王者', '达人', '高手', '传奇'];

    // 等级配置
    const LEVEL_CONFIG = {
        1: { exp: 0, reward: 100, title: '新手' },
        2: { exp: 100, reward: 150, title: '入门' },
        3: { exp: 300, reward: 200, title: '熟练' },
        4: { exp: 600, reward: 300, title: '进阶' },
        5: { exp: 1000, reward: 500, title: '高手', bonus: '专属头像' },
        6: { exp: 1500, reward: 400, title: '精英' },
        7: { exp: 2200, reward: 500, title: '大师' },
        8: { exp: 3000, reward: 600, title: '宗师' },
        9: { exp: 4000, reward: 700, title: '传奇' },
        10: { exp: 5000, reward: 1000, title: '王者', bonus: 'VIP头像' },
        15: { exp: 10000, reward: 1500, title: '皇者' },
        20: { exp: 20000, reward: 2000, title: '神话' }
    };

    // 获取等级配置
    function getLevelConfig(level) {
        // 查找最近的配置
        const levels = Object.keys(LEVEL_CONFIG).map(Number).sort((a, b) => a - b);
        let config = LEVEL_CONFIG[1];
        for (const lvl of levels) {
            if (level >= lvl) {
                config = LEVEL_CONFIG[lvl];
            }
        }
        return config;
    }

    // 获取下一级所需经验
    function getNextLevelExp(level) {
        const nextLevel = level + 1;
        if (LEVEL_CONFIG[nextLevel]) {
            return LEVEL_CONFIG[nextLevel].exp;
        }
        // 超过配置等级后，每级增加50%需求
        const baseExp = LEVEL_CONFIG[20].exp;
        const extraLevels = level - 20;
        return Math.floor(baseExp * Math.pow(1.5, extraLevels));
    }

    // 计算当前等级
    function calculateLevel(exp) {
        let level = 1;
        const levels = Object.keys(LEVEL_CONFIG).map(Number).sort((a, b) => a - b);
        for (const lvl of levels) {
            if (exp >= LEVEL_CONFIG[lvl].exp) {
                level = lvl;
            }
        }
        // 检查是否超过当前配置的最高等级
        const maxConfiguredLevel = Math.max(...levels);
        if (level === maxConfiguredLevel && exp >= LEVEL_CONFIG[maxConfiguredLevel].exp) {
            // 计算超过配置等级后的等级
            const baseExp = LEVEL_CONFIG[maxConfiguredLevel].exp;
            level = maxConfiguredLevel + Math.floor((exp - baseExp) / (baseExp * 0.5));
        }
        return level;
    }

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

    // 更新头像列表（商城购买后调用）
    function updateAvatarList(avatars) {
        avatars.forEach(a => {
            if (!AVATARS.includes(a)) {
                AVATARS.push(a);
            }
        });
    }

    // ========== 等级系统 ==========

    // 获取经验值
    function getExp() {
        const user = getUser();
        return user ? (user.exp || 0) : 0;
    }

    // 获取当前等级
    function getLevel() {
        return calculateLevel(getExp());
    }

    // 获取当前等级信息
    function getLevelInfo() {
        const level = getLevel();
        const exp = getExp();
        const config = getLevelConfig(level);
        const nextExp = getNextLevelExp(level);
        const prevExp = config.exp;

        return {
            level: level,
            exp: exp,
            expForNext: nextExp,
            expForCurrent: prevExp,
            progress: ((exp - prevExp) / (nextExp - prevExp)) * 100,
            title: config.title,
            reward: config.reward,
            bonus: config.bonus || null
        };
    }

    // 添加经验值
    function addExp(amount) {
        const user = getUser();
        if (!user) return null;

        const oldLevel = getLevel();
        user.exp = (user.exp || 0) + amount;
        saveUser(user);

        const newLevel = getLevel();

        // 检查升级
        if (newLevel > oldLevel) {
            // 发放升级奖励
            let totalReward = 0;
            for (let l = oldLevel + 1; l <= newLevel; l++) {
                const config = getLevelConfig(l);
                if (config) {
                    user.coins = (user.coins || 0) + config.reward;
                    totalReward += config.reward;
                }
            }
            saveUser(user);

            return {
                leveledUp: true,
                oldLevel: oldLevel,
                newLevel: newLevel,
                reward: totalReward
            };
        }

        return { leveledUp: false, exp: user.exp };
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
        getAvatarList: getAvatarList,
        updateAvatarList: updateAvatarList,
        // 等级系统
        getExp: getExp,
        getLevel: getLevel,
        getLevelInfo: getLevelInfo,
        addExp: addExp
    };
})();
