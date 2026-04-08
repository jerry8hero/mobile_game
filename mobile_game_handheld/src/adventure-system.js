/**
 * 冒险旅程系统 - adventure-system.js
 * 核心系统：进度追踪、章节解锁、奖励发放、分支选择
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_adventure';

    // ========== 核心数据管理 ==========

    // 获取冒险数据
    function getAdventureData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {
            currentChapter: 'chapter_1',
            completedChapters: [],
            completedTasks: {},
            taskProgress: {},
            totalProgress: 0,
            startedAt: null,
            finishedAt: null,
            choices: {},
            unlockedChapters: ['chapter_1'],
            currentPath: ['chapter_1'],
            endingUnlocked: null
        };
    }

    // 保存冒险数据
    function saveAdventureData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 初始化冒险（如果从未开始）
    function initAdventure() {
        const data = getAdventureData();
        if (!data.startedAt) {
            data.startedAt = Date.now();
            saveAdventureData(data);
        }
        return data;
    }

    // ========== 章节管理 ==========

    // 获取章节信息
    function getChapterInfo(chapterId) {
        const chapter = window.AdventureData.CHAPTERS[chapterId];
        if (!chapter) return null;

        const data = getAdventureData();
        const isUnlocked = data.unlockedChapters.includes(chapterId);
        const isCompleted = data.completedChapters.includes(chapterId);
        const tasks = getChapterTasks(chapterId);
        const completedTasks = tasks.filter(t => data.completedTasks[t.id]).length;

        return {
            ...chapter,
            isUnlocked,
            isCompleted,
            progress: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
            completedTasks,
            totalTasks: tasks.length,
            hasChoice: chapter.hasChoice || false,
            choiceMade: data.choices[chapter.choiceId] ? true : false
        };
    }

    // 获取所有章节（带状态）
    function getAllChapters() {
        const chapterIds = Object.keys(window.AdventureData.CHAPTERS);
        return chapterIds.map(id => getChapterInfo(id));
    }

    // 检查章节是否应该解锁
    function checkChapterUnlock(chapterId) {
        const chapter = window.AdventureData.CHAPTERS[chapterId];
        if (!chapter) return false;

        const data = getAdventureData();

        // 检查是否已经解锁
        if (data.unlockedChapters.includes(chapterId)) return true;

        const unlockCondition = chapter.unlockCondition;

        if (unlockCondition.type === 'none') {
            return true;
        }

        if (unlockCondition.type === 'chapter_complete') {
            return data.completedChapters.includes(unlockCondition.chapterId);
        }

        if (unlockCondition.type === 'either_chapter') {
            return unlockCondition.chapters.some(ch => data.completedChapters.includes(ch));
        }

        if (unlockCondition.type === 'choice') {
            return data.choices[unlockCondition.choiceId] === unlockCondition.value;
        }

        return false;
    }

    // 解锁章节
    function unlockChapter(chapterId) {
        const data = getAdventureData();
        if (!data.unlockedChapters.includes(chapterId)) {
            data.unlockedChapters.push(chapterId);
            data.currentPath.push(chapterId);
            saveAdventureData(data);
        }
    }

    // 获取章节任务列表
    function getChapterTasks(chapterId) {
        const chapter = window.AdventureData.CHAPTERS[chapterId];
        if (!chapter || !chapter.tasks) return [];

        return chapter.tasks.map(taskId => getTaskInfo(taskId)).filter(Boolean);
    }

    // ========== 任务管理 ==========

    // 获取任务信息
    function getTaskInfo(taskId) {
        const task = window.AdventureData.TASKS[taskId];
        if (!task) return null;

        const data = getAdventureData();
        const progress = data.taskProgress[taskId] || 0;
        const isCompleted = !!data.completedTasks[taskId];

        return {
            ...task,
            progress,
            isCompleted,
            targetCount: task.targetCount || 1
        };
    }

    // 更新任务进度
    function updateTaskProgress(gameName, score) {
        const data = getAdventureData();
        const chapterId = data.currentChapter;

        // 跳过未解锁的章节
        if (!data.unlockedChapters.includes(chapterId)) {
            return { completed: [], progressed: [] };
        }

        const tasks = getChapterTasks(chapterId);
        let completedTasks = [];
        let progressedTasks = [];

        tasks.forEach(task => {
            if (task.gameName === gameName && !task.isCompleted) {
                // 增加进度
                data.taskProgress[task.id] = (data.taskProgress[task.id] || 0) + 1;
                progressedTasks.push(task);

                // 检查是否完成
                if (data.taskProgress[task.id] >= task.targetCount) {
                    data.completedTasks[task.id] = Date.now();
                    completedTasks.push(task);

                    // 发放任务奖励
                    grantTaskReward(task);
                }
            }
        });

        // 重新计算整体进度
        updateTotalProgress();

        // 检查章节是否完成
        const chapterCompleted = checkAndCompleteChapter();

        saveAdventureData(data);

        return {
            completed: completedTasks,
            progressed: progressedTasks,
            chapterCompleted
        };
    }

    // 更新整体进度
    function updateTotalProgress() {
        const data = getAdventureData();
        const allTasks = Object.keys(window.AdventureData.TASKS);
        const completedCount = Object.keys(data.completedTasks).length;
        data.totalProgress = Math.round((completedCount / allTasks.length) * 100);
    }

    // 检查并完成章节
    function checkAndCompleteChapter() {
        const data = getAdventureData();
        const chapter = window.AdventureData.CHAPTERS[data.currentChapter];

        if (!chapter) return { completed: false, hasChoice: false, transition: null };

        const tasks = chapter.tasks || [];
        const allCompleted = tasks.every(taskId => data.completedTasks[taskId]);

        if (allCompleted && !data.completedChapters.includes(data.currentChapter)) {
            // 章节完成
            data.completedChapters.push(data.currentChapter);

            // 发放章节奖励
            grantChapterReward(data.currentChapter);

            // 检查是否有分支选择
            if (chapter.hasChoice && !data.choices[chapter.choiceId]) {
                // 需要玩家做选择
                saveAdventureData(data);
                return {
                    completed: true,
                    hasChoice: true,
                    choiceId: chapter.choiceId,
                    transition: getChapterTransition(data.currentChapter + '_complete')
                };
            }

            // 解锁下一章节
            const nextChapter = getNextChapter(chapter.id);
            if (nextChapter) {
                unlockChapter(nextChapter);
                data.currentChapter = nextChapter;
            } else {
                // 全部完成
                data.finishedAt = Date.now();
            }

            saveAdventureData(data);

            return {
                completed: true,
                hasChoice: false,
                nextChapter,
                transition: getChapterTransition(data.currentChapter + '_to_' + nextChapter)
            };
        }

        return { completed: false, hasChoice: false };
    }

    // 获取下一章节
    function getNextChapter(currentChapterId) {
        const data = getAdventureData();
        const allChapters = Object.keys(window.AdventureData.CHAPTERS);
        const currentIndex = allChapters.indexOf(currentChapterId);

        if (currentIndex === -1 || currentIndex >= allChapters.length - 1) {
            return null;
        }

        // 检查下一个章节是否应该解锁
        for (let i = currentIndex + 1; i < allChapters.length; i++) {
            const nextId = allChapters[i];
            if (checkChapterUnlock(nextId)) {
                return nextId;
            }
        }

        return null;
    }

    // 获取章节过渡动画
    function getChapterTransition(key) {
        return window.AdventureData.CHAPTER_TRANSITIONS[key] || null;
    }

    // ========== 分支选择管理 ==========

    // 获取选择信息
    function getChoiceInfo(choiceId) {
        const choice = window.AdventureData.CHOICES[choiceId];
        if (!choice) return null;

        const data = getAdventureData();
        const madeChoice = data.choices[choiceId];

        return {
            ...choice,
            madeChoice: !!madeChoice,
            selectedOption: madeChoice ? choice.options.find(o => o.id === madeChoice) : null
        };
    }

    // 做出选择
    function makeChoice(choiceId, optionId) {
        const choice = window.AdventureData.CHOICES[choiceId];
        if (!choice) return { success: false, error: 'Choice not found' };

        const data = getAdventureData();
        const option = choice.options.find(o => o.id === optionId);
        if (!option) return { success: false, error: 'Option not found' };

        // 记录选择
        data.choices[choiceId] = optionId;

        // 解锁对应章节
        if (option.nextChapter) {
            unlockChapter(option.nextChapter);
            data.currentChapter = option.nextChapter;
        }

        // 检查是否有结局
        if (option.endingId) {
            data.endingUnlocked = option.endingId;
            unlockEnding(option.endingId);
        }

        saveAdventureData(data);

        return {
            success: true,
            option,
            narrative: option.narrative
        };
    }

    // 获取当前可用的选择
    function getAvailableChoice() {
        const data = getAdventureData();

        for (const [choiceId, choice] of Object.entries(window.AdventureData.CHOICES)) {
            const chapter = window.AdventureData.CHAPTERS[choice.chapter];
            if (data.completedChapters.includes(chapter.id) && !data.choices[choiceId]) {
                return getChoiceInfo(choiceId);
            }
        }

        return null;
    }

    // ========== 结局管理 ==========

    // 解锁结局
    function unlockEnding(endingId) {
        const ending = window.AdventureData.ENDINGS[endingId];
        if (!ending) return;

        const data = getAdventureData();
        data.endingUnlocked = endingId;
        data.finishedAt = Date.now();

        // 发放最终奖励
        if (window.UserAccount) {
            window.UserAccount.addCoins(ending.rewards.coins);
            if (window.UserAccount.addExp) {
                window.UserAccount.addExp(ending.rewards.exp);
            }
            // 设置称号
            if (window.UserAccount.setTitle) {
                window.UserAccount.setTitle(ending.title);
            }
            // 设置头像
            if (window.UserAccount.setAvatar) {
                window.UserAccount.setAvatar(ending.avatar);
            }
        }

        saveAdventureData(data);
    }

    // 获取结局信息
    function getEndingInfo(endingId) {
        return window.AdventureData.ENDINGS[endingId] || null;
    }

    // 获取当前结局
    function getCurrentEnding() {
        const data = getAdventureData();
        if (!data.endingUnlocked) return null;
        return getEndingInfo(data.endingUnlocked);
    }

    // ========== 奖励系统 ==========

    // 发放任务奖励
    function grantTaskReward(task) {
        if (window.UserAccount) {
            window.UserAccount.addCoins(task.rewards.coins);
            if (window.UserAccount.addExp) {
                window.UserAccount.addExp(task.rewards.exp);
            }
        }

        // 触发奖励提示
        showRewardNotification(task);
    }

    // 发放章节奖励
    function grantChapterReward(chapterId) {
        const chapter = window.AdventureData.CHAPTERS[chapterId];
        if (!chapter || !chapter.rewards) return;

        if (window.UserAccount) {
            window.UserAccount.addCoins(chapter.rewards.coins);
            if (window.UserAccount.addExp) {
                window.UserAccount.addExp(chapter.rewards.exp);
            }
        }
    }

    // 显示奖励通知
    function showRewardNotification(task) {
        const notification = document.createElement('div');
        notification.className = 'adventure-reward-notification';
        notification.innerHTML = `
            <div class="reward-icon">🎁</div>
            <div class="reward-content">
                <div class="reward-title">任务完成：${task.name}</div>
                <div class="reward-desc">${task.desc}</div>
                <div class="reward-items">
                    <span>💰 +${task.rewards.coins}</span>
                    <span>✨ +${task.rewards.exp}经验</span>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ========== 对话系统 ==========

    // 获取任务对话
    function getTaskDialog(taskId, dialogType) {
        const task = window.AdventureData.TASKS[taskId];
        if (!task) return null;

        const key = dialogType === 'before' ? 'dialogBefore' : 'dialogAfter';
        return task[key] || null;
    }

    // 获取NPC信息
    function getNPCInfo(npcName) {
        return window.AdventureData.NPS[npcName] || null;
    }

    // ========== 统计信息 ==========

    // 获取冒险统计
    function getAdventureStats() {
        const data = getAdventureData();
        return {
            totalProgress: data.totalProgress,
            completedChapters: data.completedChapters.length,
            totalChapters: Object.keys(window.AdventureData.CHAPTERS).length,
            completedTasks: Object.keys(data.completedTasks).length,
            totalTasks: Object.keys(window.AdventureData.TASKS).length,
            currentChapter: data.currentChapter,
            currentChapterInfo: getChapterInfo(data.currentChapter),
            startedAt: data.startedAt,
            finishedAt: data.finishedAt,
            isFinished: !!data.finishedAt,
            choices: data.choices,
            endingUnlocked: data.endingUnlocked,
            unlockedChapters: data.unlockedChapters
        };
    }

    // ========== 重置功能 ==========

    // 重置冒险进度
    function resetAdventure() {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    }

    // ========== 导出API ==========
    window.AdventureSystem = {
        // 初始化
        initAdventure,

        // 数据获取
        getCurrentChapter: () => getAdventureData().currentChapter,
        getChapterInfo,
        getAllChapters,
        getTaskInfo,
        getChapterTasks,
        getAdventureStats,

        // 进度更新
        updateTaskProgress,
        checkChapterUnlock,
        unlockChapter,

        // 分支选择
        getChoiceInfo,
        makeChoice,
        getAvailableChoice,

        // 结局
        getEndingInfo,
        getCurrentEnding,

        // 对话
        getTaskDialog,
        getNPCInfo,

        // 工具
        getChapterTransition,

        // 管理
        resetAdventure
    };
})();
