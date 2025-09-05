import { GameState, Action, Player } from '../types';
import { gameReducer, createInitialState } from '../context/GameContext';

const CHANNEL_NAME = 'freaky-hangout-game-sync';

// --- SERVICE STATE (DO NOT EXPORT) ---
let channel: BroadcastChannel | null = null;
let onStateUpdateCallback: ((newState: GameState) => void) | null = null;

// --- PRIVATE HELPERS ---

const getRooms = (): Record<string, GameState> => {
    const rooms = localStorage.getItem('game_rooms');
    return rooms ? JSON.parse(rooms) : {};
};

const saveRooms = (rooms: Record<string, GameState>) => {
    localStorage.setItem('game_rooms', JSON.stringify(rooms));
};

const generateRoomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure code is unique
    const rooms = getRooms();
    if (rooms[code]) {
        return generateRoomCode();
    }
    return code;
};

const broadcastState = (roomId: string, newState: GameState) => {
    if (!channel) return;
    channel.postMessage({ type: 'STATE_UPDATE', payload: { roomId, newState } });
};

// --- PUBLIC API ---

const initialize = (onUpdate: (newState: GameState) => void) => {
    onStateUpdateCallback = onUpdate;
    if (channel) {
        channel.close();
    }
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'STATE_UPDATE' && onStateUpdateCallback) {
            // Only update if we are in the same room
            const currentRoomId = sessionStorage.getItem('dare_game_room_id');
            if (currentRoomId === payload.roomId) {
                onStateUpdateCallback(payload.newState);
            }
        }
    };
};

const createRoom = async (hostName: string, hostAvatar: string): Promise<GameState> => {
    const rooms = getRooms();
    const roomId = generateRoomCode();
    const hostId = `player_${Date.now()}`;

    const initialState = createInitialState();
    const hostPlayer: Player = { id: hostId, name: hostName, avatar: hostAvatar, score: 0, streak: 0 };

    const newState: GameState = {
        ...initialState,
        roomId,
        hostId,
        playerId: hostId,
        players: [hostPlayer]
    };
    
    rooms[roomId] = newState;
    saveRooms(rooms);
    
    sessionStorage.setItem('dare_game_player_id', hostId);
    sessionStorage.setItem('dare_game_room_id', roomId);

    broadcastState(roomId, newState);
    return newState;
};

const joinRoom = async (roomId: string, playerName: string, playerAvatar: string): Promise<GameState> => {
    const rooms = getRooms();
    const roomState = rooms[roomId];

    if (!roomState) {
        throw new Error('Room not found.');
    }
    if (roomState.players.length >= 12) {
        throw new Error('Room is full.');
    }
    
    const playerId = `player_${Date.now()}`;
    const newPlayer: Omit<Player, 'score' | 'streak'> = { id: playerId, name: playerName, avatar: playerAvatar };
    
    const action: Action = { type: 'JOIN_ROOM', payload: { player: newPlayer } };
    const newState = gameReducer(roomState, action);
    
    rooms[roomId] = newState;
    saveRooms(rooms);
    
    sessionStorage.setItem('dare_game_player_id', playerId);
    sessionStorage.setItem('dare_game_room_id', roomId);
    
    broadcastState(roomId, newState);
    return newState;
};

const sendAction = (action: Action) => {
    const roomId = sessionStorage.getItem('dare_game_room_id');
    if (!roomId) return;

    const rooms = getRooms();
    const currentRoomState = rooms[roomId];
    if (!currentRoomState) return;

    const newState = gameReducer(currentRoomState, action);
    rooms[roomId] = newState;
    saveRooms(rooms);

    broadcastState(roomId, newState);
    
    // Also trigger local update immediately for responsiveness
    if (onStateUpdateCallback) {
        onStateUpdateCallback(newState);
    }
};

const reconnect = (): GameState | null => {
    const roomId = sessionStorage.getItem('dare_game_room_id');
    const playerId = sessionStorage.getItem('dare_game_player_id');
    if (roomId && playerId) {
        const rooms = getRooms();
        const roomState = rooms[roomId];
        if (roomState && roomState.players.some(p => p.id === playerId)) {
            // Update the local player ID in the state, as it's not saved in the "DB"
            return { ...roomState, playerId };
        }
    }
    // If reconnection fails, clean up session storage
    sessionStorage.removeItem('dare_game_room_id');
    sessionStorage.removeItem('dare_game_player_id');
    return null;
}

export const multiplayerService = {
    initialize,
    createRoom,
    joinRoom,
    sendAction,
    reconnect
};
