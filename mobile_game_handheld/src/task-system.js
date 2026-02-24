/**
 * 任务系统 - task-system.js
 * 每日任务、成就任务、任务进度追踪、奖励领取
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_tasks';

    // 任务配置
    const TASK_CONFIG = {
        // 每日任务
        daily_play_1: {
            id: 'daily_play_1',
            name: '初试身手',
            desc: '每天玩1款游戏',
            type: 'daily',
            target: 1,
            rewardCoins: 20,
            rewardExp: 30
        },
        daily_play_3: {
            id: 'daily_play_3',
            name: '游戏达人',
            desc: '每天玩3款游戏',
            type: 'daily',
            target: 3,
            rewardCoins: 50,
            rewardExp: 50
        },
        daily_score: {
            id: 'daily_score',
            name: '高分选手',
            desc: '任意游戏得分≥1000',
            type: 'daily',
            target: 1,
            rewardCoins: 30,
            rewardExp: 40
        },
        daily_favorite: {
            id: 'daily_favorite',
            name: '收藏爱好者',
            desc: '收藏1款游戏',
            type: 'daily',
            target: 1,
            rewardCoins: 15,
            rewardExp: 20
        },
        // 成就任务
        continuous_login_3: {
            id: 'continuous_login_3',
            name: '忠实玩家',
            desc: '连续登录3天',
            type: 'achievement',
            target: 3,
            rewardCoins: 100,
            rewardExp: 100
        },
        continuous_login_7: {
            id: 'continuous_login_7',
            name: '坚持不懈',
            desc: '连续登录7天',
            type: 'achievement',
            target: 7,
            rewardCoins: 300,
            rewardExp: 200
        },
        collect_5_games: {
            id: 'collect_5_games',
            name: '收藏家',
            desc: '收藏5款游戏',
            type: 'achievement',
            target: 5,
            rewardCoins: 80,
            rewardExp: 80
        },
        play_10_games: {
            id: 'play_10_games',
            name: '游戏老手',
            desc: '累计玩过10款游戏',
            type: 'achievement',
            target: 10,
            rewardCoins: 150,
            rewardExp: 150
        },
        first_game: {
            id: 'first_game',
            name: '初出茅庐',
            desc: '第一次玩游戏',
            type: 'achievement',
            target: 1,
            rewardCoins: 50,
            rewardExp: 50
        },
        score_10000: {
            id: 'score_10000',
            name: '高分玩家',
            desc: '单次游戏得分≥10000',
            type: 'achievement',
            target: 1,
            rewardCoins: 200,
            rewardExp: 150
        }
    };

    // 获取任务数据
    function getTaskData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {
            tasks: {},
            lastDailyReset: null,
            playedGames: [],
            totalPlayedGames: []
        };
    }

    // 保存任务数据
    function saveTaskData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 检查是否需要重置每日任务
    function checkDailyReset() {
        const data = getTaskData();
        const today = new Date().toISOString().split('T')[0];

        if (data.lastDailyReset !== today) {
            // 重置每日任务进度
            Object.keys(TASK_CONFIG).forEach(taskId => {
                if (TASK_CONFIG[taskId].type === 'daily') {
                    if (!data.tasks[taskId]) {
                        data.tasks[taskId] = { progress: 0, completed: false, claimed: false };
                    }
                    // 重置进度但保留领取状态用于显示
                    data.tasks[taskId].progress = 0;
                }
            });
            data.lastDailyReset = today;
            saveTaskData(data);
        }
    }

    // 获取所有任务
    function getAllTasks() {
        checkDailyReset();
        const data = getTaskData();

        return Object.values(TASK_CONFIG).map(task => {
            const taskData = data.tasks[task.id] || { progress: 0, completed: false, claimed: false };
            return {
                ...task,
                progress: taskData.progress,
                completed: taskData.completed,
                claimed: taskData.claimed
            };
        });
    }

    // 获取每日任务
    function getDailyTasks() {
        return getAllTasks().filter(t => t.type === 'daily');
    }

    // 获取成就任务
    function getAchievementTasks() {
        return getAllTasks().filter(t => t.type === 'achievement');
    }

    // 更新任务进度
    function updateProgress(taskId, amount = 1) {
        const task = TASK_CONFIG[taskId];
        if (!task) return false;

        const data = getTaskData();

        if (!data.tasks[taskId]) {
            data.tasks[taskId] = { progress: 0, completed: false, claimed: false };
        }

        // 成就任务只计算一次
        if (task.type === 'achievement' && data.tasks[taskId].progress >= task.target) {
            return false;
        }

        data.tasks[taskId].progress = Math.min(data.tasks[taskId].progress + amount, task.target);

        // 检查是否完成
        if (data.tasks[taskId].progress >= task.target) {
            data.tasks[taskId].completed = true;
        }

        // 记录玩过的游戏
        if (taskId === 'daily_play_1' || taskId === 'daily_play_3' || taskId === 'play_10_games') {
            const today = new Date().toISOString().split('T')[0];
            if (!data.playedGames.includes(today)) {
                data.playedGames.push(today);
            }
            // 累计玩过的游戏（去重）
            const uniqueGames = [...new Set(data.totalPlayedGames)];
            data.totalPlayedGames = uniqueGames;
        }

        saveTaskData(data);
        return data.tasks[taskId].completed;
    }

    // 更新分数任务
    function updateScoreTask(score) {
        if (score >= 1000) {
            updateProgress('daily_score', 1);
        }
        if (score >= 10000) {
            updateProgress('score_10000', 1);
        }
    }

    // 记录玩游戏
    function recordPlayGame(gameName) {
        const data = getTaskData();
        const today = new Date().toISOString().split('T')[0];

        // 首次游戏
        if (!data.totalPlayedGames.includes(gameName)) {
            data.totalPlayedGames.push(gameName);
            updateProgress('first_game', 1);
            updateProgress('play_10_games', 1);
        }

        // 今日游戏
        if (!data.playedGames.includes(today)) {
            data.playedGames.push(today);
            updateProgress('daily_play_1', 1);
            updateProgress('daily_play_3', 1);
        }

        saveTaskData(data);
    }

    // 更新收藏任务
    function updateFavoriteTask() {
        const favorites = window.Favorites ? window.Favorites.get() : [];
        const data = getTaskData();

        // 成就任务：收藏5款游戏
        if (favorites.length >= 5) {
            updateProgress('collect_5_games', 5);
        } else {
            updateProgress('collect_5_games', favorites.length);
        }

        // 每日任务：收藏1款游戏
        updateProgress('daily_favorite', favorites.length > 0 ? 1 : 0);
    }

    // 更新连续登录任务
    function updateContinuousLoginTask() {
        const continuousDays = window.DailyCheckin ? window.DailyCheckin.getContinuousDays() : 0;
        updateProgress('continuous_login_3', continuousDays);
        updateProgress('continuous_login_7', continuousDays);
    }

    // 领取任务奖励
    function claimReward(taskId) {
        const task = TASK_CONFIG[taskId];
        if (!task) {
            return { success: false, message: '任务不存在' };
        }

        const data = getTaskData();
        const taskData = data.tasks[taskId] || { progress: 0, completed: false, claimed: false };

        if (!taskData.completed) {
            return { success: false, message: '任务未完成' };
        }

        if (taskData.claimed) {
            return { success: false, message: '奖励已领取' };
        }

        // 发放奖励
        if (window.UserAccount) {
            window.UserAccount.addCoins(task.rewardCoins);
            if (window.UserAccount.addExp) {
                window.UserAccount.addExp(task.rewardExp);
            }
        }

        // 标记已领取
        data.tasks[taskId].claimed = true;
        saveTaskData(data);

        return {
            success: true,
            message: `奖励领取成功！${task.rewardCoins}金币 + ${task.rewardExp}经验`,
            coins: task.rewardCoins,
            exp: task.rewardExp
        };
    }

    // 获取可领取的任务数量
    function getClaimableCount() {
        const tasks = getAllTasks();
        return tasks.filter(t => t.completed && !t.claimed).length;
    }

    // 导出
    window.TaskSystem = {
        getAllTasks: getAllTasks,
        getDailyTasks: getDailyTasks,
        getAchievementTasks: getAchievementTasks,
        updateProgress: updateProgress,
        updateScoreTask: updateScoreTask,
        recordPlayGame: recordPlayGame,
        updateFavoriteTask: updateFavoriteTask,
        updateContinuousLoginTask: updateContinuousLoginTask,
        claimReward: claimReward,
        getClaimableCount: getClaimableCount
    };
})();
