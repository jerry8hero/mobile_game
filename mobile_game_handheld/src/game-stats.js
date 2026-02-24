/**
 * 游戏统计系统 - game-stats.js
 * 游戏时长统计、游玩记录、数据分析
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_stats';
    const PLAY_SESSION_KEY = 'handheld_play_session';

    // 获取统计数据
    function getStats() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {
            totalPlayTime: 0,      // 总游戏时长（秒）
            totalGamesPlayed: 0,   // 总游戏次数
            gamesPlayed: {},       // 各游戏游玩次数
            gamePlayTime: {},      // 各游戏时长
            scores: {},           // 各游戏最高分
            firstPlayed: null,    // 第一次玩游戏的时间
            lastPlayed: null,     // 最后一次玩游戏的时间
            dailyStats: {},       // 每日统计
            categoryStats: {}     // 分类统计
        };
    }

    // 保存统计数据
    function saveStats(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 开始游戏会话
    function startPlaySession(gameName, category) {
        const session = {
            gameName,
            category,
            startTime: Date.now(),
            startDate: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem(PLAY_SESSION_KEY, JSON.stringify(session));
        return session;
    }

    // 结束游戏会话
    function endPlaySession(score) {
        const sessionData = localStorage.getItem(PLAY_SESSION_KEY);
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);
        const playTime = Math.floor((Date.now() - session.startTime) / 1000); // 秒

        // 更新统计
        const stats = getStats();

        // 基本统计
        stats.totalPlayTime += playTime;
        stats.totalGamesPlayed += 1;

        // 游戏次数
        if (!stats.gamesPlayed[session.gameName]) {
            stats.gamesPlayed[session.gameName] = 0;
        }
        stats.gamesPlayed[session.gameName] += 1;

        // 游戏时长
        if (!stats.gamePlayTime[session.gameName]) {
            stats.gamePlayTime[session.gameName] = 0;
        }
        stats.gamePlayTime[session.gameName] += playTime;

        // 最高分
        if (!stats.scores[session.gameName] || score > stats.scores[session.gameName]) {
            stats.scores[session.gameName] = score;
        }

        // 时间记录
        if (!stats.firstPlayed) {
            stats.firstPlayed = session.startDate;
        }
        stats.lastPlayed = session.startDate;

        // 每日统计
        if (!stats.dailyStats[session.startDate]) {
            stats.dailyStats[session.startDate] = {
                playTime: 0,
                gamesCount: 0,
                scores: []
            };
        }
        stats.dailyStats[session.startDate].playTime += playTime;
        stats.dailyStats[session.startDate].gamesCount += 1;
        if (score > 0) {
            stats.dailyStats[session.startDate].scores.push(score);
        }

        // 分类统计
        if (!stats.categoryStats[session.category]) {
            stats.categoryStats[session.category] = {
                playTime: 0,
                gamesCount: 0
            };
        }
        stats.categoryStats[session.category].playTime += playTime;
        stats.categoryStats[session.category].gamesCount += 1;

        saveStats(stats);
        localStorage.removeItem(PLAY_SESSION_KEY);

        return {
            playTime,
            totalPlayTime: stats.totalPlayTime,
            totalGamesPlayed: stats.totalGamesPlayed,
            highScore: stats.scores[session.gameName]
        };
    }

    // 获取当前会话
    function getCurrentSession() {
        const sessionData = localStorage.getItem(PLAY_SESSION_KEY);
        return sessionData ? JSON.parse(sessionData) : null;
    }

    // 获取最常玩的游戏
    function getMostPlayedGames(limit = 5) {
        const stats = getStats();
        const games = Object.entries(stats.gamesPlayed)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        return games;
    }

    // 获取游戏时长最长的游戏
    function getMostPlayedByTime(limit = 5) {
        const stats = getStats();
        const games = Object.entries(stats.gamePlayTime)
            .map(([name, time]) => ({ name, time }))
            .sort((a, b) => b.time - a.time)
            .slice(0, limit);
        return games;
    }

    // 获取最高分游戏
    function getHighScoreGames(limit = 5) {
        const stats = getStats();
        const games = Object.entries(stats.scores)
            .map(([name, score]) => ({ name, score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
        return games;
    }

    // 获取今日统计
    function getTodayStats() {
        const stats = getStats();
        const today = new Date().toISOString().split('T')[0];
        return stats.dailyStats[today] || { playTime: 0, gamesCount: 0, scores: [] };
    }

    // 获取本周统计
    function getWeekStats() {
        const stats = getStats();
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        let playTime = 0;
        let gamesCount = 0;

        Object.entries(stats.dailyStats).forEach(([date, data]) => {
            if (new Date(date) >= weekAgo) {
                playTime += data.playTime;
                gamesCount += data.gamesCount;
            }
        });

        return { playTime, gamesCount };
    }

    // 获取游戏统计数据
    function getGameStats(gameName) {
        const stats = getStats();
        return {
            playCount: stats.gamesPlayed[gameName] || 0,
            playTime: stats.gamePlayTime[gameName] || 0,
            highScore: stats.scores[gameName] || 0
        };
    }

    // 格式化时长
    function formatPlayTime(seconds) {
        if (seconds < 60) {
            return seconds + '秒';
        } else if (seconds < 3600) {
            return Math.floor(seconds / 60) + '分钟';
        } else {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            return hours + '小时' + mins + '分钟';
        }
    }

    // 获取总统计摘要
    function getSummary() {
        const stats = getStats();
        return {
            totalPlayTime: stats.totalPlayTime,
            totalPlayTimeFormatted: formatPlayTime(stats.totalPlayTime),
            totalGamesPlayed: stats.totalGamesPlayed,
            uniqueGamesPlayed: Object.keys(stats.gamesPlayed).length,
            firstPlayed: stats.firstPlayed,
            lastPlayed: stats.lastPlayed,
            today: getTodayStats(),
            week: getWeekStats()
        };
    }

    // 导出
    window.GameStats = {
        startPlaySession,
        endPlaySession,
        getCurrentSession,
        getStats,
        getMostPlayedGames,
        getMostPlayedByTime,
        getHighScoreGames,
        getTodayStats,
        getWeekStats,
        getGameStats,
        getSummary,
        formatPlayTime
    };
})();
