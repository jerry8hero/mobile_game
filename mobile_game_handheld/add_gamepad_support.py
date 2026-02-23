#!/usr/bin/env python3
"""
游戏手柄支持批量注入脚本
用于为现有游戏添加手柄控制支持
"""

import os
import re
import sys
from pathlib import Path

# 要处理的目录
GAME_DIRS = [
    '益智类',
    '街机类',
    '编程启蒙类',
    '知识类',
    'RPG冒险',
    '敏捷类',
    '模拟经营',
    '运动类',
    '运动竞技类',
    '棋类',
    '创意艺术类',
    '模拟体验类',
    '音乐类',
    '射击类',
    '运气类',
    '策略塔防',
    '放置挂机',
    '卡牌收集',
    '记忆类',
    '娱乐休闲类'
]

# 脚本注入模板
SCRIPT_TAG = '''<script src="../gamepad-helper.js"></script>'''

# 虚拟按键UI模板（可选）
VIRTUAL_CONTROLS = '''
<!-- 虚拟按键 (掌机模式) -->
<div class="handheld-virtual-controls" id="handheldVC" style="display:none;">
    <div class="vc-dpad">
        <button class="vc-btn" data-dir="up">▲</button>
        <button class="vc-btn" data-dir="left">◀</button>
        <button class="vc-btn" data-dir="center">●</button>
        <button class="vc-btn" data-dir="right">▶</button>
        <button class="vc-btn" data-dir="down">▼</button>
    </div>
    <div class="vc-action-btns">
        <button class="vc-btn vc-a" data-action="a">A</button>
        <button class="vc-btn vc-b" data-action="b">B</button>
    </div>
</div>
'''

def get_gamepad_helper_path():
    """获取 gamepad-helper.js 的相对路径"""
    # 假设脚本在项目的 src 目录，游戏在 src 的子目录
    return '../gamepad-helper.js'

def process_file(filepath):
    """处理单个游戏文件"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否已经包含手柄支持
        if 'gamepad-helper.js' in content:
            print(f"  ⏭️  跳过 (已有手柄支持): {filepath.name}")
            return False

        # 检查是否是游戏页面（有 canvas 或游戏逻辑）
        if '<canvas' not in content and 'gameLoop' not in content and 'addEventListener' not in content:
            print(f"  ⏭️  跳过 (非游戏页面): {filepath.name}")
            return False

        # 在 </body> 前注入脚本
        if '</body>' in content:
            content = content.replace('</body>', f'{SCRIPT_TAG}\n</body>')
        elif '</script>' in content:
            # 如果没有 body 标签，在最后一个 script 后添加
            content = content.replace('</script>', f'</script>\n{SCRIPT_TAG}')
        else:
            # 直接添加到文件末尾
            content += f'\n{SCRIPT_TAG}'

        # 写回文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"  ✅ 已添加手柄支持: {filepath.name}")
        return True

    except Exception as e:
        print(f"  ❌ 错误: {filepath.name} - {e}")
        return False

def scan_directory(base_path, directory):
    """扫描目录下的所有 HTML 文件"""
    dir_path = base_path / directory
    if not dir_path.exists():
        print(f"⚠️ 目录不存在: {directory}")
        return []

    html_files = list(dir_path.glob('*.html'))
    return html_files

def main():
    """主函数"""
    # 获取脚本所在目录
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent / 'mobile_game_handheld' / 'src'

    print("🎮 游戏手柄支持批量注入工具")
    print("=" * 50)
    print(f"项目目录: {project_dir}")
    print()

    total_files = 0
    processed_files = 0

    for directory in GAME_DIRS:
        print(f"📁 处理目录: {directory}")
        html_files = scan_directory(project_dir, directory)

        for filepath in html_files:
            total_files += 1
            if process_file(filepath):
                processed_files += 1

        print()

    print("=" * 50)
    print(f"📊 统计: 共扫描 {total_files} 个文件, 处理 {processed_files} 个文件")
    print("✅ 完成!")

if __name__ == '__main__':
    main()
