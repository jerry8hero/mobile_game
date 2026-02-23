#!/usr/bin/env python3
"""
Switch 触摸控件注入脚本
为游戏添加 Switch 触摸按键支持
"""

import os
import re
import sys
from pathlib import Path

# 要处理的目录
GAME_DIRS = [
    '益智类', '街机类', '编程启蒙类', '知识类', 'RPG冒险',
    '敏捷类', '模拟经营', '运动类', '运动竞技类', '棋类',
    '创意艺术类', '模拟体验类', '音乐类', '射击类', '运气类',
    '策略塔防', '放置挂机', '卡牌收集', '记忆类', '娱乐休闲类'
]

# Switch 控件脚本
SWITCH_SCRIPT = '''<script src="../switch-controls.js"></script>'''

def process_file(filepath):
    """处理单个游戏文件"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否已经包含 Switch 控件
        if 'switch-controls.js' in content:
            print(f"  ⏭️  跳过: {filepath.name}")
            return False

        # 在 </body> 前注入脚本
        if '</body>' in content:
            content = content.replace('</body>', f'{SWITCH_SCRIPT}\n</body>')
        elif '</script>' in content:
            content = content.replace('</script>', f'</script>\n{SWITCH_SCRIPT}')
        else:
            content += f'\n{SWITCH_SCRIPT}'

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"  ✅ 已添加: {filepath.name}")
        return True

    except Exception as e:
        print(f"  ❌ 错误: {filepath.name} - {e}")
        return False

def scan_directory(base_path, directory):
    """扫描目录下的所有 HTML 文件"""
    dir_path = base_path / directory
    if not dir_path.exists():
        return []
    return list(dir_path.glob('*.html'))

def main():
    """主函数"""
    script_dir = Path(__file__).parent
    project_dir = script_dir / 'src'

    print("🎮 Switch 触摸控件注入工具")
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
