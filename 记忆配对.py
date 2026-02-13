#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
记忆配对游戏 - 适合6-10岁孩子
"""

import tkinter as tk
from tkinter import messagebox
import random
import time

# 游戏配置
CARD_SIZE = 100  # 卡片大小
GAP = 10        # 卡片间距
COLS = 3        # 列数
ROWS = 4        # 行数
TOTAL_PAIRS = 6 # 配对数量

# 图案列表（使用emoji，兼容性好）
PATTERNS = ['🍎', '🍊', '🍇', '🍓', '🍌', '🍉']

class MemoryGame:
    def __init__(self, root):
        self.root = root
        self.root.title("记忆配对游戏")
        self.root.resizable(False, False)

        # 居中显示
        window_width = COLS * (CARD_SIZE + GAP) + GAP + 200
        window_height = ROWS * (CARD_SIZE + GAP) + GAP + 80
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        x = (screen_width - window_width) // 2
        y = (screen_height - window_height) // 2
        self.root.geometry(f"{window_width}x{window_height}+{x}+{y}")

        # 游戏变量
        self.score = 0
        self.matched_pairs = 0
        self.first_card = None
        self.second_card = None
        self.locked = False  # 锁定状态，防止连续点击
        self.start_time = None
        self.cards = []
        self.card_buttons = []

        # 创建界面
        self.create_widgets()
        self.init_game()

    def create_widgets(self):
        """创建游戏界面"""
        # 顶部信息栏
        top_frame = tk.Frame(self.root, bg="#f0f0f0")
        top_frame.pack(fill=tk.X, pady=10)

        self.score_label = tk.Label(
            top_frame, text="得分: 0",
            font=("Arial", 16, "bold"),
            bg="#f0f0f0", fg="#333"
        )
        self.score_label.pack(side=tk.LEFT, padx=20)

        self.time_label = tk.Label(
            top_frame, text="时间: 0秒",
            font=("Arial", 16, "bold"),
            bg="#f0f0f0", fg="#333"
        )
        self.time_label.pack(side=tk.RIGHT, padx=20)

        # 游戏区域
        game_frame = tk.Frame(self.root, bg="#2c3e50")
        game_frame.pack(padx=20, pady=10)

        # 创建卡片网格
        for i in range(ROWS * COLS):
            btn = tk.Button(
                game_frame,
                text="?",
                font=("Arial", 32),
                width=4,
                height=2,
                bg="#3498db",
                fg="white",
                relief=tk.RAISED,
                command=lambda idx=i: self.on_card_click(idx)
            )
            row = i // COLS
            col = i % COLS
            btn.grid(row=row, column=col, padx=GAP, pady=GAP)
            self.card_buttons.append(btn)
            self.cards.append({
                'pattern': None,
                'revealed': False,
                'matched': False,
                'button': btn
            })

        # 底部按钮
        btn_frame = tk.Frame(self.root, bg="#f0f0f0")
        btn_frame.pack(fill=tk.X, pady=10)

        restart_btn = tk.Button(
            btn_frame,
            text="🔄 重新开始",
            font=("Arial", 14),
            command=self.init_game,
            bg="#27ae60",
            fg="white",
            padx=20,
            pady=5
        )
        restart_btn.pack()

    def init_game(self):
        """初始化游戏"""
        self.score = 0
        self.matched_pairs = 0
        self.first_card = None
        self.second_card = None
        self.locked = False
        self.start_time = time.time()

        # 更新显示
        self.score_label.config(text=f"得分: {self.score}")
        self.time_label.config(text="时间: 0秒")

        # 随机分配图案
        patterns = PATTERNS * 2  # 每种图案两张
        random.shuffle(patterns)

        # 重置卡片
        for i in range(ROWS * COLS):
            self.cards[i]['pattern'] = patterns[i]
            self.cards[i]['revealed'] = False
            self.cards[i]['matched'] = False
            btn = self.card_buttons[i]
            btn.config(text="?", bg="#3498db", state=tk.NORMAL)

        # 启动计时器
        self.update_timer()

    def update_timer(self):
        """更新计时器"""
        if self.matched_pairs < TOTAL_PAIRS:
            elapsed = int(time.time() - self.start_time)
            self.time_label.config(text=f"时间: {elapsed}秒")
            self.root.after(1000, self.update_timer)

    def on_card_click(self, idx):
        """卡片点击事件"""
        card = self.cards[idx]

        # 如果锁定或卡片已翻开或已配对，忽略点击
        if self.locked or card['revealed'] or card['matched']:
            return

        # 翻开卡片
        self.reveal_card(idx)

        if self.first_card is None:
            # 第一次点击
            self.first_card = idx
        else:
            # 第二次点击
            self.second_card = idx
            self.check_match()

    def reveal_card(self, idx):
        """翻开卡片"""
        card = self.cards[idx]
        card['revealed'] = True
        btn = card['button']
        btn.config(text=card['pattern'], bg="#f39c12")

    def hide_card(self, idx):
        """隐藏卡片"""
        card = self.cards[idx]
        card['revealed'] = False
        btn = card['button']
        btn.config(text="?", bg="#3498db")

    def check_match(self):
        """检查配对"""
        self.locked = True  # 锁定，等待动画完成

        card1 = self.cards[self.first_card]
        card2 = self.cards[self.second_card]

        if card1['pattern'] == card2['pattern']:
            # 配对成功
            card1['matched'] = True
            card2['matched'] = True
            self.score += 10
            self.matched_pairs += 1
            self.score_label.config(text=f"得分: {self.score}")

            # 配对成功的动画效果
            card1['button'].config(bg="#27ae60")  # 绿色
            card2['button'].config(bg="#27ae60")

            self.first_card = None
            self.second_card = None
            self.locked = False

            # 检查是否全部配对
            if self.matched_pairs >= TOTAL_PAIRS:
                self.game_win()
        else:
            # 配对失败，延迟翻回去
            self.root.after(1000, self.flip_back)

    def flip_back(self):
        """翻回背面"""
        self.hide_card(self.first_card)
        self.hide_card(self.second_card)
        self.first_card = None
        self.second_card = None
        self.locked = False

    def game_win(self):
        """游戏胜利"""
        elapsed = int(time.time() - self.start_time)
        messagebox.showinfo(
            "🎉 恭喜你!",
            f"太棒了！你配对成功了！\n\n"
            f"用时: {elapsed}秒\n"
            f"得分: {self.score}分"
        )

def main():
    root = tk.Tk()
    game = MemoryGame(root)
    root.mainloop()

if __name__ == "__main__":
    main()
