/**
 * 冒险旅程UI组件 - adventure-ui.js
 * 故事界面、对话展示、章节导航
 */

(function() {
    'use strict';

    // ========== 主面板 ==========

    // 显示冒险旅程主面板
    function showAdventurePanel() {
        const existing = document.getElementById('adventurePanel');
        if (existing) {
            existing.remove();
            return;
        }

        // 初始化冒险
        window.AdventureSystem.initAdventure();

        const stats = window.AdventureSystem.getAdventureStats();
        const chapters = window.AdventureSystem.getAllChapters();
        const currentChapter = stats.currentChapterInfo;

        const panel = document.createElement('div');
        panel.className = 'modal show';
        panel.id = 'adventurePanel';
        panel.innerHTML = `
            <div class="adventure-panel">
                <div class="adventure-header">
                    <div class="adventure-icon">⚔️</div>
                    <h3>勇者的试炼之路</h3>
                    <div class="adventure-progress">
                        <div class="progress-text">冒险进度: ${stats.totalProgress}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${stats.totalProgress}%"></div>
                        </div>
                        <div class="progress-stats">
                            <span>已完成章节: ${stats.completedChapters}/${stats.totalChapters}</span>
                            <span>已完成任务: ${stats.completedTasks}/${stats.totalTasks}</span>
                        </div>
                    </div>
                </div>

                <div class="adventure-story-intro">
                    <button class="story-toggle" onclick="toggleStoryText(this)">
                        📖 展开故事背景
                    </button>
                    <div class="story-text" style="display: none;">
                        ${window.AdventureData.STORY_BACKGROUND.prologue}
                    </div>
                </div>

                <div class="chapter-list">
                    ${chapters.map(chapter => renderChapterCard(chapter)).join('')}
                </div>

                <div class="adventure-footer">
                    <button class="adventure-start-btn ${stats.completedChapters > 0 ? 'has-progress' : ''}"
                            onclick="AdventureUI.continueAdventure()">
                        ${stats.completedChapters > 0 ? '继续冒险' : '开始冒险'}
                    </button>
                </div>

                <button class="close-btn-adventure" onclick="document.getElementById('adventurePanel').remove()">✕</button>
            </div>
        `;

        document.body.appendChild(panel);
    }

    // 切换故事文本显示
    window.toggleStoryText = function(btn) {
        const text = btn.nextElementSibling;
        const isHidden = text.style.display === 'none';
        text.style.display = isHidden ? 'block' : 'none';
        btn.textContent = isHidden ? '📖 收起故事背景' : '📖 展开故事背景';
    };

    // 渲染章节卡片
    function renderChapterCard(chapter) {
        let statusClass = 'locked';
        let onclick = '';

        if (chapter.isCompleted) {
            statusClass = 'completed';
            onclick = `AdventureUI.showChapterDetail('${chapter.id}')`;
        } else if (chapter.isUnlocked) {
            statusClass = 'unlocked';
            onclick = `AdventureUI.showChapterDetail('${chapter.id}')`;
        }

        return `
            <div class="chapter-card ${statusClass}" data-chapter="${chapter.id}" onclick="${onclick}">
                <div class="chapter-icon">
                    ${chapter.isCompleted ? '✅' : chapter.isUnlocked ? chapter.icon : '🔒'}
                </div>
                <div class="chapter-info">
                    <div class="chapter-name">${chapter.name}</div>
                    <div class="chapter-desc">${chapter.desc}</div>
                    ${chapter.isUnlocked ? `
                        <div class="chapter-progress-bar">
                            <div class="chapter-progress-fill" style="width: ${chapter.progress}%"></div>
                        </div>
                        <div class="chapter-progress-text">${chapter.completedTasks}/${chapter.totalTasks} 任务</div>
                    ` : `
                        <div class="chapter-locked-text">
                            ${getUnlockConditionText(chapter)}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    // 获取解锁条件文本
    function getUnlockConditionText(chapter) {
        const chapterData = window.AdventureData.CHAPTERS[chapter.id];
        if (!chapterData || !chapterData.unlockCondition) return '';

        const condition = chapterData.unlockCondition;

        if (condition.type === 'chapter_complete') {
            const reqChapter = window.AdventureData.CHAPTERS[condition.chapterId];
            return `完成「${reqChapter ? reqChapter.name : condition.chapterId}」后解锁`;
        }

        if (condition.type === 'choice') {
            return '需要做出选择后解锁';
        }

        if (condition.type === 'either_chapter') {
            return '完成前置章节后解锁';
        }

        return '前置条件未满足';
    }

    // ========== 章节详情面板 ==========

    // 显示章节详情
    function showChapterDetail(chapterId) {
        const existing = document.getElementById('chapterDetailPanel');
        if (existing) existing.remove();

        const chapter = window.AdventureSystem.getChapterInfo(chapterId);
        const tasks = window.AdventureSystem.getChapterTasks(chapterId);
        const stats = window.AdventureSystem.getAdventureStats();
        const isCurrentChapter = stats.currentChapter === chapterId;

        const panel = document.createElement('div');
        panel.className = 'modal show';
        panel.id = 'chapterDetailPanel';
        panel.innerHTML = `
            <div class="chapter-detail-panel">
                <div class="chapter-detail-header">
                    <div class="chapter-detail-icon">${chapter.icon}</div>
                    <h3>${chapter.name}</h3>
                    <p>${chapter.description}</p>
                    ${chapter.isCompleted ? '<div class="chapter-completed-badge">✅ 已完成</div>' : ''}
                </div>

                <div class="task-list-container">
                    <h4>任务列表</h4>
                    <div class="adventure-task-list">
                        ${tasks.map(task => renderTaskItem(task, isCurrentChapter)).join('')}
                    </div>
                </div>

                <div class="chapter-rewards-preview">
                    <h4>章节奖励</h4>
                    <div class="rewards-row">
                        <span>💰 ${chapter.rewards.coins} 金币</span>
                        <span>✨ ${chapter.rewards.exp} 经验</span>
                    </div>
                </div>

                <div class="chapter-detail-buttons">
                    ${chapter.isUnlocked && !chapter.isCompleted ? `
                        <button class="start-chapter-btn" onclick="AdventureUI.startChapter('${chapterId}')">
                            ${chapter.progress > 0 ? '继续任务' : '开始挑战'}
                        </button>
                    ` : ''}
                    <button class="back-btn" onclick="document.getElementById('chapterDetailPanel').remove()">
                        返回
                    </button>
                </div>

                <button class="close-btn-detail" onclick="document.getElementById('chapterDetailPanel').remove()">✕</button>
            </div>
        `;

        document.body.appendChild(panel);
    }

    // 渲染任务项
    function renderTaskItem(task, isCurrentChapter) {
        let statusClass = '';
        let statusIcon = '📋';

        if (task.isCompleted) {
            statusClass = 'completed';
            statusIcon = '✅';
        } else if (task.progress > 0) {
            statusClass = 'in-progress';
            statusIcon = '🔄';
        }

        const isTarget = isCurrentChapter && !task.isCompleted;

        return `
            <div class="adventure-task-item ${statusClass} ${isTarget ? 'current-target' : ''}" data-task="${task.id}">
                <div class="task-status-icon">${statusIcon}</div>
                <div class="task-details">
                    <div class="task-name">${task.name} ${isTarget ? '<span class="current-tag">当前</span>' : ''}</div>
                    <div class="task-desc">${task.desc}</div>
                    <div class="task-game-tag">🎮 ${task.gameName}</div>
                </div>
                <div class="task-progress-info">
                    <div class="task-progress-text">${task.progress}/${task.targetCount}</div>
                    <div class="task-rewards-small">
                        💰${task.rewards.coins} ✨${task.rewards.exp}
                    </div>
                </div>
            </div>
        `;
    }

    // ========== 对话系统 ==========

    // 显示任务对话
    function showTaskDialog(taskId, dialogType) {
        const dialog = window.AdventureSystem.getTaskDialog(taskId, dialogType);
        if (!dialog) return null;

        const npcInfo = window.AdventureSystem.getNPCInfo(dialog.npc);

        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.innerHTML = `
            <div class="dialog-box">
                <div class="dialog-npc">
                    <div class="npc-avatar">${npcInfo ? npcInfo.avatar : dialog.npcIcon || '❓'}</div>
                    <div class="npc-name">${npcInfo ? npcInfo.name : dialog.npc || '神秘人'}</div>
                </div>
                <div class="dialog-content">
                    <div class="dialog-text">${dialog.text}</div>
                </div>
                <button class="dialog-continue" onclick="this.closest('.dialog-overlay').remove()">
                    确定 →
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        return overlay;
    }

    // ========== 分支选择面板 ==========

    // 显示分支选择面板
    function showChoicePanel(choiceId) {
        const existing = document.getElementById('choicePanel');
        if (existing) existing.remove();

        const choice = window.AdventureSystem.getChoiceInfo(choiceId);
        if (!choice) return;

        const panel = document.createElement('div');
        panel.className = 'modal show';
        panel.id = 'choicePanel';
        panel.innerHTML = `
            <div class="choice-panel">
                <div class="choice-header">
                    <div class="choice-icon">⚡</div>
                    <h3>${choice.name}</h3>
                    <p>${choice.description}</p>
                </div>

                <div class="choice-options">
                    ${choice.options.map(option => `
                        <div class="choice-option" onclick="AdventureUI.makeChoice('${choice.id}', '${option.id}')">
                            <div class="option-icon">${option.icon}</div>
                            <div class="option-info">
                                <div class="option-name">${option.name}</div>
                                <div class="option-desc">${option.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <button class="close-btn-choice" onclick="document.getElementById('choicePanel').remove()">✕</button>
            </div>
        `;

        document.body.appendChild(panel);
    }

    // 做出选择
    function makeChoice(choiceId, optionId) {
        const result = window.AdventureSystem.makeChoice(choiceId, optionId);

        if (result.success) {
            // 关闭选择面板
            document.getElementById('choicePanel')?.remove();

            // 显示叙事文本
            if (result.narrative) {
                showNarrativePanel(result.narrative, result.option);
            }
        }
    }

    // 显示叙事面板
    function showNarrativePanel(narrative, option) {
        const panel = document.createElement('div');
        panel.className = 'narrative-overlay';
        panel.innerHTML = `
            <div class="narrative-box">
                <div class="narrative-icon">${option.icon}</div>
                <div class="narrative-text">${narrative}</div>
                <button class="narrative-continue" onclick="AdventureUI.closeNarrativeAndContinue(this)">
                    继续 →
                </button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    // 关闭叙事面板并继续
    window. AdventureUI.closeNarrativeAndContinue = function(btn) {
        btn.closest('.narrative-overlay').remove();
        // 显示章节详情或冒险面板
        const stats = window.AdventureSystem.getAdventureStats();
        showChapterDetail(stats.currentChapter);
    };

    // ========== 章节完成动画 ==========

    // 显示章节完成动画
    function showChapterCompleteAnimation(chapterId, transition) {
        const chapter = window.AdventureData.CHAPTERS[chapterId];

        const overlay = document.createElement('div');
        overlay.className = 'chapter-complete-overlay';
        overlay.innerHTML = `
            <div class="chapter-complete-content">
                <div class="chapter-complete-icon">${chapter ? chapter.icon : '🎉'}</div>
                <h2>${transition ? transition.title : '章节完成！'}</h2>
                <div class="chapter-complete-text">
                    ${transition ? transition.text : '恭喜完成本章！'}
                </div>
                ${chapter ? `
                    <div class="chapter-reward-preview">
                        <span>💰 +${chapter.rewards.coins}</span>
                        <span>✨ +${chapter.rewards.exp}经验</span>
                    </div>
                ` : ''}
                <button class="continue-btn" onclick="this.closest('.chapter-complete-overlay').remove()">
                    继续 →
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // ========== 结局展示 ==========

    // 显示结局
    function showEndingPanel(endingId) {
        const ending = window.AdventureSystem.getEndingInfo(endingId);
        if (!ending) return;

        const panel = document.createElement('div');
        panel.className = 'ending-overlay';
        panel.innerHTML = `
            <div class="ending-content">
                <div class="ending-icon">${ending.icon}</div>
                <h2>${ending.name}</h2>
                <div class="ending-desc">${ending.description}</div>
                <div class="ending-rewards">
                    <span>💰 +${ending.rewards.coins} 金币</span>
                    <span>✨ +${ending.rewards.exp} 经验</span>
                </div>
                <div class="ending-title-award">
                    获得称号：<span class="title-badge">${ending.title}</span>
                </div>
                <div class="ending-avatar-award">
                    解锁头像：<span class="avatar-badge">${ending.avatar}</span>
                </div>
                <button class="ending-btn" onclick="AdventureUI.closeEndingPanel(this)">
                    回顾冒险旅程
                </button>
            </div>
        `;
        panel.onclick = (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        };
        document.body.appendChild(panel);
    }

    // 关闭结局面板
    window. AdventureUI.closeEndingPanel = function(btn) {
        btn.closest('.ending-overlay').remove();
        // 显示冒险面板
        showAdventurePanel();
    };

    // ========== 冒险继续/开始 ==========

    // 继续冒险（跳转到当前章节的第一个未完成任务）
    function continueAdventure() {
        const stats = window.AdventureSystem.getAdventureStats();
        const currentChapter = window.AdventureSystem.getChapterInfo(stats.currentChapter);

        if (!currentChapter || !currentChapter.isUnlocked) {
            // 如果当前章节未解锁，尝试找第一个已解锁的章节
            const chapters = window.AdventureSystem.getAllChapters();
            const unlocked = chapters.find(c => c.isUnlocked && !c.isCompleted);
            if (unlocked) {
                navigateToChapter(unlocked.id);
            }
            return;
        }

        navigateToChapter(stats.currentChapter);
    }

    // 导航到指定章节
    function navigateToChapter(chapterId) {
        const chapter = window.AdventureSystem.getChapterInfo(chapterId);
        if (!chapter || !chapter.isUnlocked) return;

        // 关闭冒险面板
        document.getElementById('adventurePanel')?.remove();

        // 显示章节详情
        showChapterDetail(chapterId);
    }

    // 开始章节
    function startChapter(chapterId) {
        const stats = window.AdventureSystem.getAdventureStats();
        const tasks = window.AdventureSystem.getChapterTasks(chapterId);

        // 关闭章节详情面板
        document.getElementById('chapterDetailPanel')?.remove();

        // 找到第一个未完成的任务
        const nextTask = tasks.find(t => !t.isCompleted);
        if (nextTask) {
            // 显示任务开始前的对话
            const dialog = window.AdventureSystem.getTaskDialog(nextTask.id, 'before');
            if (dialog) {
                showTaskDialog(nextTask.id, 'before');
            }

            // 导航到游戏
            setTimeout(() => {
                navigateToGame(nextTask.gameName);
            }, dialog ? 100 : 0);
        }
    }

    // 根据游戏名称导航到游戏
    function navigateToGame(gameName) {
        // 在游戏列表中查找游戏
        if (window.categoryGames) {
            for (const [category, games] of Object.entries(window.categoryGames)) {
                const game = games.find(g => g.name === gameName);
                if (game) {
                    // 关闭所有面板
                    document.getElementById('adventurePanel')?.remove();
                    document.getElementById('chapterDetailPanel')?.remove();

                    // 跳转到游戏
                    window.location.href = game.file;
                    return true;
                }
            }
        }

        alert(`游戏 "${gameName}" 未找到`);
        return false;
    }

    // ========== 导出 ==========
    window.AdventureUI = {
        showAdventurePanel,
        showChapterDetail,
        showTaskDialog,
        showChoicePanel,
        makeChoice,
        showNarrativePanel,
        showChapterCompleteAnimation,
        showEndingPanel,
        continueAdventure,
        navigateToChapter,
        startChapter,
        navigateToGame
    };
})();
