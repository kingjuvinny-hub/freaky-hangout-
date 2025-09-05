export interface Dare {
  text: string;
  type: 'text';
  difficulty: 1 | 2 | 3;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  teamId?: string;
  streak: number;
  title?: PlayerTitle;
}

export interface Team {
  id:string;
  name: string;
  players: string[]; // array of player IDs
}

export enum GamePhase {
  SETUP = 'setup',
  DARE_SUBMISSION = 'dare_submission',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
}

export enum GameMode {
  SOLO = 'solo',
  TEAMS = 'teams',
  HOT_SEAT = 'hot_seat',
}

export interface DarePack {
  id: string;
  name: string;
  description: string;
  dares: Dare[];
}

export interface CustomDarePack extends Omit<DarePack, 'dares'> {
  dares: Dare[]; 
  isCustom: true;
}

export interface WinCondition {
  type: 'score' | 'rounds';
  value: number;
}

export interface GameSettings {
  selectedPacks: string[]; // array of pack IDs
  forfeitPenalty: number; // can be 0 or more
  adultMode: boolean;
  gameMode: GameMode;
  winCondition: WinCondition;
  timerDuration: number; // in seconds, 0 for off
  theme: 'neon' | 'spooky' | 'pirate';
  soundVolume: number; // 0 to 1
}

export interface Turn {
  player: Player;
  dare: Dare;
  completed: boolean;
  isDoubleDown: boolean;
}

export enum GameAwardType {
  DAREDEVIL = 'Daredevil', // Most dares completed
  MOST_CAUTIOUS = 'Most Cautious', // Most forfeits
  HIGH_ROLLER = 'High Roller', // Most double downs
  STREAK_MASTER = 'Streak Master', // Longest streak
}

export interface GameAward {
  type: GameAwardType;
  player: Player;
  description: string;
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'info' | 'error';
}

export interface LifetimeStats {
    [playerId: string]: {
        gamesPlayed: number;
        wins: number;
        daresCompleted: number;
        perfectGames: number; // games won with 0 forfeits
    }
}

export enum PlayerTitle {
    ROOKIE = 'Rookie',
    VETERAN = 'Veteran',
    DARE_CONQUEROR = 'Dare Conqueror',
}

export interface GameState {
  players: Player[];
  teams: Team[];
  gamePhase: GamePhase;
  settings: GameSettings;
  currentPlayerIndex: number;
  currentTurn: { player: Player; dare: Dare; isDoubleDown: boolean; } | null;
  history: Turn[];
  availableDares: Dare[];
  customPacks: CustomDarePack[];
  currentRound: number;
  turnStartTime: number | null; // For timer
  personalDares: Dare[];
  dareSubmissionIndex: number;
  toasts: Toast[];
  lifetimeStats: LifetimeStats;
}

// Reducer action types
export type Action =
  | { type: 'ADD_PLAYER'; payload: { name: string; avatar: string; title?: PlayerTitle } }
  | { type: 'REMOVE_PLAYER'; payload: { id: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'SET_DARE'; payload: { isDoubleDown: boolean } }
  | { type: 'COMPLETE_TURN'; payload: { completed: boolean; } }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'SETUP_TEAMS'; payload: { teams: Team[], players: Player[] } }
  | { type: 'SAVE_CUSTOM_PACK'; payload: CustomDarePack }
  | { type: 'DELETE_CUSTOM_PACK'; payload: { id: string } }
  | { type: 'LOAD_CUSTOM_PACKS'; payload: CustomDarePack[] }
  | { type: 'ADD_CUSTOM_DARE_TO_GAME'; payload: { dare: Dare } }
  | { type: 'SUBMIT_PERSONAL_DARE'; payload: { dare: Dare } }
  | { type: 'NEXT_DARE_SUBMITTER' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: { id: number } }
  | { type: 'LOAD_LIFETIME_STATS'; payload: LifetimeStats }
  | { type: 'UPDATE_PLAYER_TITLE'; payload: { playerId: string, title: PlayerTitle } };