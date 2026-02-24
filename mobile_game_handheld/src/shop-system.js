/**
 * 商城系统 - shop-system.js
 * 金币购买道具、头像、称号、皮肤
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_shop';

    // 商品配置
    const SHOP_ITEMS = {
        // 头像包
        avatar_vip: {
            id: 'avatar_vip',
            name: 'VIP头像包',
            desc: '包含10个VIP专属头像',
            type: 'avatar_pack',
            price: 500,
            items: ['👑', '💎', '🔥', '⭐', '🌟', '💫', '🎭', '🎪', '🎯', '🎲']
        },
        avatar_animal: {
            id: 'avatar_animal',
            name: '动物头像包',
            desc: '包含10个可爱动物头像',
            type: 'avatar_pack',
            price: 300,
            items: ['🐱', '🐶', '🐼', '🐨', '🦊', '🐰', '🐻', '🐸', '🦁', '🐯']
        },
        avatar_sport: {
            id: 'avatar_sport',
            name: '运动头像包',
            desc: '包含10个运动相关头像',
            type: 'avatar_pack',
            price: 250,
            items: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🏸', '🥊']
        },
        // 称号
        title_pro: {
            id: 'title_pro',
            name: 'PRO称号',
            desc: '显示PRO尊贵标识',
            type: 'title',
            price: 800,
            items: ['PRO']
        },
        title_master: {
            id: 'title_master',
            name: '大师称号',
            desc: '显示大师荣誉标识',
            type: 'title',
            price: 1500,
            items: ['大师']
        },
        title_legend: {
            id: 'title_legend',
            name: '传奇称号',
            desc: '显示传奇最高荣誉',
            type: 'title',
            price: 3000,
            items: ['传奇']
        },
        // 皮肤/背景
        bg_summer: {
            id: 'bg_summer',
            name: '夏日主题',
            desc: '清爽夏日主题背景',
            type: 'background',
            price: 400,
            items: ['summer']
        },
        bg_space: {
            id: 'bg_space',
            name: '太空主题',
            desc: '炫酷太空主题背景',
            type: 'background',
            price: 600,
            items: ['space']
        },
        bg_neon: {
            id: 'bg_neon',
            name: '霓虹主题',
            desc: '赛博朋克霓虹背景',
            type: 'background',
            price: 800,
            items: ['neon']
        },
        // 单个头像
        avatar_crown: {
            id: 'avatar_crown',
            name: '皇冠头像',
            desc: '尊贵皇冠头像',
            type: 'avatar',
            price: 200,
            items: ['👑']
        },
        avatar_fire: {
            id: 'avatar_fire',
            name: '火焰头像',
            desc: '热血火焰头像',
            type: 'avatar',
            price: 150,
            items: ['🔥']
        },
        avatar_star: {
            id: 'avatar_star',
            name: '星星头像',
            desc: '闪亮星星头像',
            type: 'avatar',
            price: 100,
            items: ['⭐']
        }
    };

    // 获取商城数据
    function getShopData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {
            owned: {
                avatars: ['😀', '😎', '🤓', '🧑‍🎤', '🧑‍🎨', '🧑‍🚀', '🧑‍🔬', '👨‍💻', '👩‍💻', '🦸', '🦹', '🧙', '🧝', '🐱', '🐶', '🦊', '🐼', '🐨'],  // 初始头像
                titles: [],
                backgrounds: []
            },
            purchaseHistory: []
        };
    }

    // 保存商城数据
    function saveShopData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 获取所有商品
    function getAllItems() {
        return Object.values(SHOP_ITEMS);
    }

    // 按类型获取商品
    function getItemsByType(type) {
        return getAllItems().filter(item => item.type === type);
    }

    // 检查是否已拥有
    function isOwned(itemId) {
        const data = getShopData();
        const item = SHOP_ITEMS[itemId];
        if (!item) return false;

        switch (item.type) {
            case 'avatar_pack':
            case 'avatar':
                return item.items.every(avatar => data.owned.avatars.includes(avatar));
            case 'title':
                return item.items.every(title => data.owned.titles.includes(title));
            case 'background':
                return item.items.every(bg => data.owned.backgrounds.includes(bg));
            default:
                return false;
        }
    }

    // 购买商品
    function purchase(itemId) {
        const user = window.UserAccount ? window.UserAccount.getUser() : null;
        if (!user) {
            return { success: false, message: '请先登录' };
        }

        const item = SHOP_ITEMS[itemId];
        if (!item) {
            return { success: false, message: '商品不存在' };
        }

        if (isOwned(itemId)) {
            return { success: false, message: '已拥有此商品' };
        }

        const coins = window.UserAccount.getCoins();
        if (coins < item.price) {
            return { success: false, message: `金币不足，需要 ${item.price} 金币` };
        }

        // 扣除金币
        window.UserAccount.spendCoins(item.price);

        // 添加到拥有列表
        const data = getShopData();

        switch (item.type) {
            case 'avatar_pack':
            case 'avatar':
                item.items.forEach(avatar => {
                    if (!data.owned.avatars.includes(avatar)) {
                        data.owned.avatars.push(avatar);
                    }
                });
                // 同时更新用户头像列表
                if (window.UserAccount.getAvatarList) {
                    const currentList = window.UserAccount.getAvatarList();
                    item.items.forEach(avatar => {
                        if (!currentList.includes(avatar)) {
                            currentList.push(avatar);
                        }
                    });
                }
                break;
            case 'title':
                item.items.forEach(title => {
                    if (!data.owned.titles.includes(title)) {
                        data.owned.titles.push(title);
                    }
                });
                break;
            case 'background':
                item.items.forEach(bg => {
                    if (!data.owned.backgrounds.includes(bg)) {
                        data.owned.backgrounds.push(bg);
                    }
                });
                break;
        }

        // 记录购买历史
        data.purchaseHistory.push({
            itemId: itemId,
            purchasedAt: Date.now()
        });

        saveShopData(data);

        return {
            success: true,
            message: `购买成功！${item.name}`,
            item: item
        };
    }

    // 获取已拥有的商品
    function getOwned() {
        const data = getShopData();
        return data.owned;
    }

    // 设置当前称号
    function setTitle(title) {
        const data = getShopData();
        if (data.owned.titles.includes(title)) {
            const user = window.UserAccount.getUser();
            if (user) {
                user.title = title;
                localStorage.setItem('handheld_user', JSON.stringify(user));
                return { success: true, message: `称号已设置为：${title}` };
            }
        }
        return { success: false, message: '未拥有此称号' };
    }

    // 获取当前称号
    function getCurrentTitle() {
        const user = window.UserAccount ? window.UserAccount.getUser() : null;
        return user ? user.title : null;
    }

    // 设置背景
    function setBackground(bg) {
        const data = getShopData();
        if (data.owned.backgrounds.includes(bg)) {
            // 应用背景样式
            const bgMap = {
                'summer': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'space': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                'neon': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
            };
            document.body.style.background = bgMap[bg] || 'var(--bg-dark)';
            return { success: true, message: '背景已更换' };
        }
        return { success: false, message: '未拥有此背景' };
    }

    // 导出
    window.ShopSystem = {
        getAllItems: getAllItems,
        getItemsByType: getItemsByType,
        isOwned: isOwned,
        purchase: purchase,
        getOwned: getOwned,
        setTitle: setTitle,
        getCurrentTitle: getCurrentTitle,
        setBackground: setBackground
    };
})();
