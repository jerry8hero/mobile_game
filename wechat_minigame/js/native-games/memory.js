// js/native-games/memory.js
// 记忆配对游戏

class MemoryGame {
    constructor(options) {
        this.canvasId = options.canvasId;
        this.width = options.width || 300;
        this.height = options.height || 500;
        this.onScore = options.onScore || (() => {});
        this.onGameOver = options.onGameOver || (() => {});

        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.moves = 0;
        this.pairsFound = 0;
        this.totalPairs = 8;

        // 卡片数组
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = [];

        // 动画状态
        this.animating = false;
        this.animationDelay = 500;

        // 画布上下文
        this.ctx = null;
        this.canvas = null;

        // 颜色配置
        this.colors = {
            background: '#1a1a2e',
            cardBack: '#e94560',
            cardFront: '#16213e',
            matched: '#1dd1a1',
            text: '#ffffff',
            accent: '#48dbfb'
        };

        // emoji表情
        this.emojis = ['🎮', '🎯', '🎲', '🎸', '🎨', '🎭', '🎪', '🎬'];

        this.init();
    }

    async init() {
        // 获取canvas
        this.canvas = wx.createCanvas ? wx.createCanvas() : document.getElementById(this.canvasId);

        if (this.canvas && this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');

            // 初始化游戏
            this.initGame();

            // 绑定事件
            this.bindEvents();
        }
    }

    // 初始化游戏
    initGame() {
        this.score = 0;
        this.moves = 0;
        this.pairsFound = 0;
        this.flippedCards = [];
        this.matchedPairs = [];
        this.animating = false;

        // 创建卡片对
        const pairs = [...this.emojis, ...this.emojis];
        this.shuffle(pairs);

        // 生成4x4卡片网格
        this.cards = [];
        const cols = 4;
        const rows = 4;
        const cardWidth = (this.width - 40) / cols;
        const cardHeight = (this.height - 150) / rows;
        const padding = 10;

        for (let i = 0; i < pairs.length; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            this.cards.push({
                emoji: pairs[i],
                x: padding + col * (cardWidth + padding / 2),
                y: padding + row * (cardHeight + padding / 2) + 60,
                width: cardWidth - padding / 2,
                height: cardHeight - padding / 2,
                flipped: false,
                matched: false,
                index: i
            });
        }

        this.draw();
    }

    // 洗牌算法
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 绑定触摸事件
    bindEvents() {
        if (typeof wx !== 'undefined') {
            wx.onTouchStart((e) => this.handleTouch(e));
        } else {
            // H5环境
            const canvas = document.getElementById(this.canvasId);
            if (canvas) {
                canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
                canvas.addEventListener('click', (e) => this.handleClick(e));
            }
        }
    }

    // 处理触摸
    handleTouch(e) {
        if (!this.isRunning || this.isPaused || this.animating) return;

        const touch = e.touches[0];
        this.handleTap(touch.clientX, touch.clientY);
    }

    // 处理点击
    handleClick(e) {
        if (!this.isRunning || this.isPaused || this.animating) return;

        const rect = e.target.getBoundingClientRect();
        this.handleTap(e.clientX - rect.left, e.clientY - rect.top);
    }

    // 处理点击位置
    handleTap(x, y) {
        // 检查点击了哪个卡片
        for (const card of this.cards) {
            if (!card.flipped && !card.matched) {
                if (x >= card.x && x <= card.x + card.width &&
                    y >= card.y && y <= card.y + card.height) {
                    // 翻转卡片
                    this.flipCard(card);
                    break;
                }
            }
        }
    }

    // 翻转卡片
    flipCard(card) {
        if (this.flippedCards.length >= 2) return;

        card.flipped = true;
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.checkMatch();
        }

        this.draw();
    }

    // 检查匹配
    checkMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.emoji === card2.emoji) {
            // 匹配成功
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs.push(card1.index, card2.index);
            this.pairsFound++;
            this.score += 10;
            this.onScore(this.score);

            this.flippedCards = [];

            // 检查是否完成
            if (this.pairsFound === this.totalPairs) {
                setTimeout(() => {
                    this.gameComplete();
                }, 500);
            }

            this.draw();
        } else {
            // 匹配失败，延迟翻转回去
            this.animating = true;
            setTimeout(() => {
                card1.flipped = false;
                card2.flipped = false;
                this.flippedCards = [];
                this.animating = false;
                this.draw();
            }, this.animationDelay);
        }
    }

    // 游戏完成
    gameComplete() {
        this.isRunning = false;
        // 计算最终得分
        const bonus = Math.max(0, 50 - this.moves * 2);
        this.score += bonus;
        this.onScore(this.score);
        this.onGameOver();
        this.draw();
    }

    // 开始游戏
    start() {
        this.isRunning = true;
        this.initGame();
    }

    // 重新开始
    restart() {
        this.initGame();
        this.start();
    }

    // 暂停
    pause() {
        this.isPaused = !this.isPaused;
    }

    // 销毁
    destroy() {
        this.isRunning = false;
    }

    // 绘制
    draw() {
        if (!this.ctx) return;

        const ctx = this.ctx;

        // 背景
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, this.width, this.height);

        // 标题
        ctx.fillStyle = this.colors.text;
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎴 记忆配对', this.width / 2, 30);

        // 信息栏
        ctx.font = '14px sans-serif';
        ctx.fillStyle = this.colors.accent;
        ctx.fillText(`得分: ${this.score}`, this.width / 2 - 50, 50);
        ctx.fillStyle = '#a0a0a0';
        ctx.fillText(`步数: ${this.moves}`, this.width / 2 + 50, 50);

        // 绘制卡片
        for (const card of this.cards) {
            this.drawCard(card);
        }

        // 游戏完成提示
        if (this.pairsFound === this.totalPairs) {
            this.drawWinOverlay();
        }
    }

    // 绘制卡片
    drawCard(card) {
        const ctx = this.ctx;
        const { x, y, width, height, flipped, matched } = card;

        // 卡片背景
        ctx.fillStyle = matched ? this.colors.matched :
                       (flipped ? this.colors.cardFront : this.colors.cardBack);

        // 圆角矩形
        this.roundRect(ctx, x, y, width, height, 8);
        ctx.fill();

        // 边框
        if (matched) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // 显示内容
        if (flipped || matched) {
            ctx.font = '28px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(card.emoji, x + width / 2, y + height / 2);
        } else {
            // 卡片背面图案
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', x + width / 2, y + height / 2);
        }
    }

    // 绘制胜利界面
    drawWinOverlay() {
        const ctx = this.ctx;

        // 半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);

        // 胜利文字
        ctx.fillStyle = '#1dd1a1';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 恭喜过关!', this.width / 2, this.height / 2 - 40);

        // 得分
        ctx.fillStyle = '#fff';
        ctx.font = '20px sans-serif';
        ctx.fillText(`最终得分: ${this.score}`, this.width / 2, this.height / 2 + 10);
        ctx.fillText(`总步数: ${this.moves}`, this.width / 2, this.height / 2 + 40);
    }

    // 圆角矩形
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

// 导出
export default MemoryGame;
