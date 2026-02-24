/**
 * 礼包码模块 - giftcode.js
 * 礼包码兑换、金币系统
 */

(function() {
    'use strict';

    const RECORD_KEY = 'handheld_gift_records';

    // 预设礼包码
    const GIFT_CODES = {
        'LAUNCHER2024': {
            coins: 100,
            name: '启动器奖励',
            desc: '感谢使用掌机游戏厅！'
        },
        'NEWPLAYER': {
            coins: 50,
            name: '新手礼包',
            desc: '欢迎新手玩家！',
            avatars: ['🎉', '🎊', '🌟']
        },
        'VIP888': {
            coins: 888,
            name: 'VIP礼包',
            desc: '尊贵的VIP用户专属'
        },
        'CNY2024': {
            coins: 2024,
            name: '春节礼包',
            desc: '新春快乐！'
        },
        'TESTCODE': {
            coins: 10,
            name: '测试礼包',
            desc: '仅供测试使用'
        }
    };

    // 获取兑换记录
    function getRecords() {
        const data = localStorage.getItem(RECORD_KEY);
        return data ? JSON.parse(data) : [];
    }

    // 保存兑换记录
    function saveRecords(records) {
        localStorage.setItem(RECORD_KEY, JSON.stringify(records));
    }

    // 兑换礼包码
    function redeemCode(code) {
        const user = window.UserAccount ? window.UserAccount.getUser() : null;
        if (!user) {
            return { success: false, message: '请先登录' };
        }

        const normalizedCode = code.trim().toUpperCase();
        const gift = GIFT_CODES[normalizedCode];

        if (!gift) {
            return { success: false, message: '礼包码无效' };
        }

        // 检查是否已兑换
        const records = getRecords();
        const alreadyRedeemed = records.some(r => r.code === normalizedCode && r.userId === user.userId);

        if (alreadyRedeemed) {
            return { success: false, message: '您已兑换过此礼包码' };
        }

        // 执行兑换
        if (gift.coins && window.UserAccount) {
            window.UserAccount.addCoins(gift.coins);
        }

        // 记录兑换
        records.push({
            code: normalizedCode,
            userId: user.userId,
            giftName: gift.name,
            coins: gift.coins || 0,
            redeemedAt: Date.now()
        });
        saveRecords(records);

        return {
            success: true,
            message: `兑换成功！获得 ${gift.coins} 金币`,
            gift: gift
        };
    }

    // 检查礼包码是否存在
    function isValidCode(code) {
        return !!GIFT_CODES[code.trim().toUpperCase()];
    }

    // 获取礼包码信息
    function getCodeInfo(code) {
        return GIFT_CODES[code.trim().toUpperCase()] || null;
    }

    // 获取所有可用礼包码（用于展示）
    function getAllCodes() {
        return Object.keys(GIFT_CODES);
    }

    // 获取用户兑换记录
    function getUserRecords() {
        const user = window.UserAccount ? window.UserAccount.getUser() : null;
        if (!user) return [];

        const records = getRecords();
        return records.filter(r => r.userId === user.userId);
    }

    // 导出
    window.GiftCode = {
        redeem: redeemCode,
        isValid: isValidCode,
        getInfo: getCodeInfo,
        getAll: getAllCodes,
        getUserRecords: getUserRecords
    };
})();
