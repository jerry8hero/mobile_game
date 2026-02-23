/**
 * 收藏功能 - favorites.js
 * 游戏收藏和最近游玩记录
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_favorites';
    const RECENT_KEY = 'handheld_recent';

    // 获取收藏列表
    function getFavorites() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // 保存收藏列表
    function saveFavorites(favorites) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }

    // 添加收藏
    function addFavorite(game) {
        const favorites = getFavorites();
        // 检查是否已收藏
        if (!favorites.some(f => f.file === game.file)) {
            favorites.unshift({
                name: game.name,
                icon: game.icon,
                type: game.type,
                file: game.file,
                category: game.category,
                addedAt: Date.now()
            });
            saveFavorites(favorites);
        }
        return favorites;
    }

    // 移除收藏
    function removeFavorite(gameFile) {
        let favorites = getFavorites();
        favorites = favorites.filter(f => f.file !== gameFile);
        saveFavorites(favorites);
        return favorites;
    }

    // 检查是否已收藏
    function isFavorite(gameFile) {
        return getFavorites().some(f => f.file === gameFile);
    }

    // 获取最近游玩
    function getRecent() {
        const data = localStorage.getItem(RECENT_KEY);
        return data ? JSON.parse(data) : [];
    }

    // 添加最近游玩
    function addRecent(game) {
        let recent = getRecent();
        // 移除重复
        recent = recent.filter(r => r.file !== game.file);
        // 添加到开头
        recent.unshift({
            name: game.name,
            icon: game.icon,
            type: game.type,
            file: game.file,
            category: game.category,
            playedAt: Date.now()
        });
        // 保留最近 10 个
        recent = recent.slice(0, 10);
        localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
        return recent;
    }

    // 清除所有数据
    function clearAll() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(RECENT_KEY);
    }

    // 导出
    window.Favorites = {
        get: getFavorites,
        add: addFavorite,
        remove: removeFavorite,
        isFavorite: isFavorite,
        getRecent: getRecent,
        addRecent: addRecent,
        clear: clearAll
    };
})();
