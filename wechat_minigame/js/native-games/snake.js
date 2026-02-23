// js/native-games/snake.js
// 贪吃蛇游戏

class SnakeGame {
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
        this.gameLoop = null;
        this.speed = 200; // 毫秒

        // 蛇
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };

        // 食物
        this.food = null;

        // 网格大小
        this.gridSize = 20;
        this.cols = Math.floor(this.width / this.gridSize);
        this.rows = Math.floor((this.height - 60) / this.gridSize);

        // 画布
        this.ctx = null;
        this.canvas = null;

        // 颜色
        this.colors = {
            background: '#1a1a2e',
            snake: '#1dd1a1',
            snakeHead: '#48dbfb',
            food: '#e94560',
            grid: 'rgba(255, 255, 255, 0.05)'
        };

        this.init();
    }

    async init() {
        this.canvas = wx.createCanvas ? wx.createCanvas() : document.getElementById(this.canvasId);

        if (this.canvas && this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.initGame();
            this.bindEvents();
        }
    }

    initGame() {
        this.score = 0;
        this.speed = 200;
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };

        // 初始化蛇（中间位置）
        const startX = Math.floor(this.cols / 2);
        const startY = Math.floor(this.rows / 2);
        this.snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];

        this.spawnFood();
        this.draw();
    }

    spawnFood() {
        let valid = false;
        while (!valid) {
            this.food = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };

            // 检查是否与蛇重叠
            valid = !this.snake.some(seg =>
                seg.x === this.food.x && seg.y === this.food.y
            );
        }
    }

    bindEvents() {
        if (typeof wx !== 'undefined') {
            wx.onTouchStart((e) => this.handleTouch(e));
        } else {
            const canvas = document.getElementById(this.canvasId);
            if (canvas) {
                canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
                canvas.addEventListener('keydown', (e) => this.handleKey(e));
            }
            document.addEventListener('keydown', (e) => this.handleKey(e));
        }
    }

    handleTouch(e) {
        if (!this.isRunning || this.isPaused) return;

        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX;
        const y = touch.clientY;

        // 简单控制：根据触摸区域判断方向
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        if (x < centerX - 30) {
            this.setDirection(-1, 0);
        } else if (x > centerX + 30) {
            this.setDirection(1, 0);
        } else if (y < centerY) {
            this.setDirection(0, -1);
        } else {
            this.setDirection(0, 1);
        }
    }

    handleKey(e) {
        if (!this.isRunning || this.isPaused) return;

        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.setDirection(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.setDirection(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.setDirection(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.setDirection(1, 0);
                break;
        }
    }

    setDirection(x, y) {
        // 防止反向移动
        if (this.direction.x === -x && x !== 0) return;
        if (this.direction.y === -y && y !== 0) return;
        this.nextDirection = { x, y };
    }

    start() {
        this.isRunning = true;
        this.gameLoop = setInterval(() => this.update(), this.speed);
        this.initGame();
    }

    restart() {
        this.stop();
        this.start();
    }

    pause() {
        this.isPaused = !this.isPaused;
    }

    stop() {
        this.isRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    destroy() {
        this.stop();
    }

    update() {
        if (!this.isRunning || this.isPaused) return;

        this.direction = { ...this.nextDirection };

        // 计算新蛇头位置
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // 检查碰撞（墙壁或自身）
        if (newHead.x < 0 || newHead.x >= this.cols ||
            newHead.y < 0 || newHead.y >= this.rows ||
            this.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            this.gameOver();
            return;
        }

        // 移动蛇
        this.snake.unshift(newHead);

        // 检查是否吃到食物
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            this.onScore(this.score);

            // 增加速度
            if (this.speed > 80) {
                this.speed -= 5;
                this.stop();
                this.gameLoop = setInterval(() => this.update(), this.speed);
            }

            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    gameOver() {
        this.stop();
        this.onGameOver();
        this.draw();
    }

    draw() {
        if (!this.ctx) return;

        const ctx = this.ctx;

        // 背景
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, this.width, this.height);

        // 网格线（可选）
        ctx.strokeStyle = this.colors.grid;
        ctx.lineWidth = 1;
        for (let x = 0; x <= this.cols; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.gridSize, 60);
            ctx.lineTo(x * this.gridSize, this.height);
            ctx.stroke();
        }
        for (let y = 0; y <= this.rows; y++) {
            ctx.beginPath();
            ctx.moveTo(0, 60 + y * this.gridSize);
            ctx.lineTo(this.width, 60 + y * this.gridSize);
            ctx.stroke();
        }

        // 标题
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐍 贪吃蛇', this.width / 2, 30);

        // 分数
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#48dbfb';
        ctx.fillText(`得分: ${this.score}`, this.width / 2, 50);

        // 绘制食物
        ctx.fillStyle = this.colors.food;
        ctx.beginPath();
        ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            60 + this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // 绘制蛇
        this.snake.forEach((seg, i) => {
            const x = seg.x * this.gridSize;
            const y = 60 + seg.y * this.gridSize;

            ctx.fillStyle = i === 0 ? this.colors.snakeHead : this.colors.snake;
            ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);

            // 蛇头眼睛
            if (i === 0) {
                ctx.fillStyle = '#fff';
                const eyeSize = 4;
                ctx.fillRect(x + 4, y + 5, eyeSize, eyeSize);
                ctx.fillRect(x + this.gridSize - 8, y + 5, eyeSize, eyeSize);
            }
        });

        // 游戏结束
        if (!this.isRunning && this.snake.length > 0) {
            this.drawGameOver();
        }
    }

    drawGameOver() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💀 游戏结束', this.width / 2, this.height / 2 - 30);

        ctx.fillStyle = '#fff';
        ctx.font = '20px sans-serif';
        ctx.fillText(`最终得分: ${this.score}`, this.width / 2, this.height / 2 + 20);

        ctx.fillStyle = '#a0a0a0';
        ctx.font = '14px sans-serif';
        ctx.fillText('点击重新开始', this.width / 2, this.height / 2 + 60);
    }
}

export default SnakeGame;
