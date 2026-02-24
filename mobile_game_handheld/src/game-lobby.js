/**
 * 游戏大厅系统 - game-lobby.js
 * 网络游戏大厅、房间匹配、对战系统
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'handheld_lobby';

    // 游戏类型配置
    const GAME_TYPES = {
        'snake': {
            name: '贪吃蛇大作战',
            icon: '🐍',
            mode: ['单人练习', '双人同屏', '多人匹配'],
            minPlayers: 1,
            maxPlayers: 8
        },
        'shooter': {
            name: '飞行射击',
            icon: '✈️',
            mode: ['单人练习', '双人同屏'],
            minPlayers: 1,
            maxPlayers: 2
        },
        'tetris': {
            name: '俄罗斯方块对战',
            icon: '🧱',
            mode: ['单人练习', '双人对战'],
            minPlayers: 1,
            maxPlayers: 2
        },
        'gomoku': {
            name: '五子棋对战',
            icon: '⭕',
            mode: ['单机AI', '双人对战'],
            minPlayers: 1,
            maxPlayers: 2
        },
        'racing': {
            name: '赛车竞速',
            icon: '🏎️',
            mode: ['单人练习', '多人竞速'],
            minPlayers: 1,
            maxPlayers: 4
        }
    };

    // 模拟在线玩家数据
    const MOCK_ONLINE_PLAYERS = [
        '游戏高手', '快乐玩家', '萌新选手', '挑战者', '大师', '新手村',
        '极速小子', '神射手', '棋王', '赛车手', '蛇王', '方块侠'
    ];

    // 获取游戏配置
    function getGameConfig(gameType) {
        return GAME_TYPES[gameType] || null;
    }

    // 获取所有支持的游戏
    function getSupportedGames() {
        return Object.keys(GAME_TYPES);
    }

    // 获取模拟在线人数
    function getOnlineCount(gameType) {
        // 返回模拟的在线人数
        return Math.floor(Math.random() * 50) + 10;
    }

    // 获取模拟在线玩家列表
    function getOnlinePlayers(gameType, count = 5) {
        const shuffled = [...MOCK_ONLINE_PLAYERS].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    // 创建游戏房间
    function createRoom(gameType, mode, playerName) {
        const config = getGameConfig(gameType);
        if (!config) return null;

        const room = {
            id: 'room_' + Date.now(),
            gameType: gameType,
            mode: mode,
            host: playerName,
            players: [playerName],
            status: 'waiting', // waiting, playing, finished
            createdAt: Date.now()
        };

        // 保存房间信息
        saveRoom(room);
        return room;
    }

    // 加入房间
    function joinRoom(roomId, playerName) {
        const room = getRoom(roomId);
        if (!room) return { success: false, message: '房间不存在' };
        if (room.status !== 'waiting') return { success: false, message: '游戏已开始' };
        if (room.players.includes(playerName)) return { success: false, message: '您已在房间中' };

        const config = getGameConfig(room.gameType);
        if (room.players.length >= config.maxPlayers) return { success: false, message: '房间已满' };

        room.players.push(playerName);
        saveRoom(room);

        return { success: true, room: room };
    }

    // 离开房间
    function leaveRoom(roomId, playerName) {
        let room = getRoom(roomId);
        if (!room) return false;

        room.players = room.players.filter(p => p !== playerName);

        if (room.players.length === 0) {
            removeRoom(roomId);
        } else {
            // 如果房主离开，转移给下一个玩家
            if (room.host === playerName) {
                room.host = room.players[0];
            }
            saveRoom(room);
        }
        return true;
    }

    // 开始游戏
    function startGame(roomId) {
        const room = getRoom(roomId);
        if (!room) return { success: false, message: '房间不存在' };

        room.status = 'playing';
        saveRoom(room);

        return { success: true, room: room };
    }

    // 获取房间信息
    function getRoom(roomId) {
        const data = localStorage.getItem(STORAGE_KEY);
        const rooms = data ? JSON.parse(data) : {};
        return rooms[roomId] || null;
    }

    // 保存房间
    function saveRoom(room) {
        const data = localStorage.getItem(STORAGE_KEY);
        const rooms = data ? JSON.parse(data) : {};
        rooms[room.id] = room;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    }

    // 删除房间
    function removeRoom(roomId) {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return;
        const rooms = JSON.parse(data);
        delete rooms[roomId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    }

    // 获取可用房间列表
    function getAvailableRooms(gameType) {
        const data = localStorage.getItem(STORAGE_KEY);
        const allRooms = data ? JSON.parse(data) : {};

        return Object.values(allRooms)
            .filter(room => room.gameType === gameType && room.status === 'waiting')
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    // 导出
    window.GameLobby = {
        getGameConfig: getGameConfig,
        getSupportedGames: getSupportedGames,
        getOnlineCount: getOnlineCount,
        getOnlinePlayers: getOnlinePlayers,
        createRoom: createRoom,
        joinRoom: joinRoom,
        leaveRoom: leaveRoom,
        startGame: startGame,
        getRoom: getRoom,
        getAvailableRooms: getAvailableRooms
    };
})();
