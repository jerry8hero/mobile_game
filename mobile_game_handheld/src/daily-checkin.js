/**
 * 每日签到系统 - daily-checkin.js
 * 每日签到、连续签到奖励、签到日历
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_checkin';

    // 签到奖励配置（按连续天数）
    const CHECKIN_REWARDS = {
        1: 10,
        2: 15,
        3: 20,
        4: 25,
        5: 30,
        6: 40,
        7: 50  // 第7天及以上都是50
    };

    // 额外奖励（第7天）
    const EXTRA_REWARD_DAY = 7;
    const EXTRA_REWARD_COINS = 100;

    // 获取今天日期字符串
    function getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    // 获取签到数据
    function getCheckinData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {
            lastCheckinDate: null,
            totalDays: 0,
            continuousDays: 0,
            history: []
        };
    }

    // 保存签到数据
    function saveCheckinData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 检查今天是否已签到
    function isCheckedInToday() {
        const data = getCheckinData();
        return data.lastCheckinDate === getTodayString();
    }

    // 获取今日签到奖励
    function getTodayReward() {
        const data = getCheckinData();
        const days = Math.min(data.continuousDays + 1, 7);  // 明天是第几天
        let coins = CHECKIN_REWARDS[days] || CHECKIN_REWARDS[7];

        // 第7天额外奖励
        if (days === EXTRA_REWARD_DAY) {
            coins += EXTRA_REWARD_COINS;
        }

        return {
            coins: coins,
            isExtra: days === EXTRA_REWARD_DAY,
            continuousDays: days
        };
    }

    // 执行签到
    function checkin() {
        const user = window.UserAccount ? window.UserAccount.getUser() : null;
        if (!user) {
            return { success: false, message: '请先登录' };
        }

        if (isCheckedInToday()) {
            return { success: false, message: '今日已签到' };
        }

        const data = getCheckinData();
        const today = getTodayString();
        const yesterday = getYesterdayString();

        // 计算连续签到
        if (data.lastCheckinDate === yesterday) {
            // 昨天已签到，连续天数+1
            data.continuousDays += 1;
        } else if (data.lastCheckinDate === null || data.lastCheckinDate !== yesterday) {
            // 断签了，重新开始
            data.continuousDays = 1;
        }

        // 计算奖励
        const reward = getTodayReward();

        // 添加金币
        if (window.UserAccount) {
            window.UserAccount.addCoins(reward.coins);
        }

        // 添加经验
        if (window.UserAccount && window.UserAccount.addExp) {
            window.UserAccount.addExp(20);
        }

        // 更新数据
        data.lastCheckinDate = today;
        data.totalDays += 1;
        data.history.push(today);
        saveCheckinData(data);

        return {
            success: true,
            message: `签到成功！获得 ${reward.coins} 金币${reward.isExtra ? '（含额外奖励）' : ''}`,
            coins: reward.coins,
            continuousDays: data.continuousDays,
            totalDays: data.totalDays
        };
    }

    // 获取昨天日期字符串
    function getYesterdayString() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    }

    // 获取签到历史（最近30天）
    function getCheckinHistory() {
        const data = getCheckinData();
        return data.history || [];
    }

    // 获取连续签到天数
    function getContinuousDays() {
        const data = getCheckinData();
        // 检查今天是否签到，如果是，连续天数应该是已存储的+1
        if (isCheckedInToday()) {
            return data.continuousDays;
        }
        // 检查昨天是否签到，如果是，今天还没签但连续未断
        const yesterday = getYesterdayString();
        if (data.lastCheckinDate === yesterday) {
            return data.continuousDays;
        }
        // 否则连续已断开
        return 0;
    }

    // 获取总签到天数
    function getTotalDays() {
        const data = getCheckinData();
        return data.totalDays;
    }

    // 导出
    window.DailyCheckin = {
        checkin: checkin,
        isCheckedInToday: isCheckedInToday,
        getTodayReward: getTodayReward,
        getContinuousDays: getContinuousDays,
        getTotalDays: getTotalDays,
        getCheckinHistory: getCheckinHistory
    };
})();
