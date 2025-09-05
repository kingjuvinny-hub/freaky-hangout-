import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { GameState, Action, GamePhase, DarePack, CustomDarePack, GameMode, Team, Player, PlayerTitle, LifetimeStats, GameAwardType } from '../types';
import { shuffleArray, getRandomItem } from '../utils/helpers';
import { CORE_PACKS } from '../constants/dares';
import { ADULT_PACK } from '../constants/adultPack';

const initialState: GameState = {
  players: [],
  teams: [],
  gamePhase: GamePhase.SETUP,
  settings: {
    selectedPacks: ['classic'],
    forfeitPenalty: 1,
    adultMode: false,
    gameMode: GameMode.SOLO,
    winCondition: { type: 'score', value: 10 },
    timerDuration: 0, // off by default
    theme: 'neon',
    soundVolume: 1,
  },
  currentPlayerIndex: 0,
  currentTurn: null,
  history: [],
  availableDares: [],
  customPacks: [],
  currentRound: 1,
  turnStartTime: null,
  personalDares: [],
  dareSubmissionIndex: 0,
  toasts: [],
  lifetimeStats: {},
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'ADD_PLAYER':
      if (state.players.length >= 12) return state;
      const newPlayer: Player = {
        id: `player_${Date.now()}`,
        name: action.payload.name,
        avatar: action.payload.avatar,
        title: action.payload.title,
        score: 0,
        streak: 0,
      };
      return { ...state, players: [...state.players, newPlayer] };

    case 'REMOVE_PLAYER':
      return { ...state, players: state.players.filter(p => p.id !== action.payload.id) };
      
    case 'SETUP_TEAMS':
        return {...state, teams: action.payload.teams, players: action.payload.players };

    case 'UPDATE_SETTINGS': {
        const newSettings = { ...state.settings, ...action.payload };
        if (action.payload.adultMode === false && newSettings.selectedPacks.includes(ADULT_PACK.id)) {
            newSettings.selectedPacks = newSettings.selectedPacks.filter(id => id !== ADULT_PACK.id);
        }
        if (action.payload.adultMode === true && !newSettings.selectedPacks.includes(ADULT_PACK.id)) {
            newSettings.selectedPacks.push(ADULT_PACK.id);
        }
        return { ...state, settings: newSettings };
    }

    case 'START_GAME': {
      if (state.players.length < 2) return state;
      const shuffledPlayers = shuffleArray(state.players.map(p => ({ ...p, score: 0, streak: 0 })));

      if (state.settings.gameMode === GameMode.HOT_SEAT) {
        return {
          ...state,
          gamePhase: GamePhase.DARE_SUBMISSION,
          players: shuffledPlayers,
          currentPlayerIndex: 0,
          currentRound: 1,
          history: [],
          personalDares: [],
          dareSubmissionIndex: 0,
          teams: [],
        };
      }

      const allPacks: DarePack[] = [...CORE_PACKS, ...state.customPacks];
      if (state.settings.adultMode) {
        allPacks.push(ADULT_PACK);
      }

      const selectedPacks = allPacks.filter(p => state.settings.selectedPacks.includes(p.id));
      const availableDares = selectedPacks.flatMap(p => p.dares);

      return {
        ...state,
        gamePhase: GamePhase.PLAYING,
        players: shuffledPlayers,
        currentPlayerIndex: 0,
        currentRound: 1,
        history: [],
        availableDares,
      };
    }
    
    case 'SUBMIT_PERSONAL_DARE': {
      return {
        ...state,
        personalDares: [...state.personalDares, action.payload.dare],
      };
    }

    case 'NEXT_DARE_SUBMITTER': {
      const nextIndex = state.dareSubmissionIndex + 1;
      
      if (nextIndex >= state.players.length) {
        return {
          ...state,
          gamePhase: GamePhase.PLAYING,
          availableDares: shuffleArray(state.personalDares),
        };
      }
      
      return {
        ...state,
        dareSubmissionIndex: nextIndex,
      };
    }
    
    case 'SET_DARE': {
      const dare = getRandomItem(state.availableDares);
      if (!dare) {
        return { ...state, currentTurn: { player: state.players[state.currentPlayerIndex], dare: { text: 'No more dares available!', type: 'text', difficulty: 1 }, isDoubleDown: false }};
      }
      return { 
          ...state, 
          currentTurn: { player: state.players[state.currentPlayerIndex], dare, isDoubleDown: action.payload.isDoubleDown },
          turnStartTime: Date.now(),
      };
    }
    
    case 'ADD_CUSTOM_DARE_TO_GAME': {
      return { ...state, availableDares: [action.payload.dare, ...state.availableDares] };
    }

    case 'COMPLETE_TURN': {
        if (!state.currentTurn) return state;
        const { completed } = action.payload;

        const updatedPlayers = [...state.players];
        const player = updatedPlayers[state.currentPlayerIndex];
        let currentScore = player.score;
        const penalty = state.settings.forfeitPenalty;
        const points = state.currentTurn.isDoubleDown ? 2 : 1;
        
        if (completed) {
            currentScore += points;
            player.streak += 1;
        } else {
            currentScore = Math.max(0, currentScore - (state.currentTurn.isDoubleDown ? penalty * 2 : penalty));
            player.streak = 0;
        }
        player.score = currentScore;
        
        const isNewRound = (state.currentPlayerIndex + 1) % state.players.length === 0;
        const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        const newRound = isNewRound ? state.currentRound + 1 : state.currentRound;

        const newHistory = [...state.history, { ...state.currentTurn, completed }];
        const newAvailableDares = state.availableDares.filter(d => d !== state.currentTurn!.dare);
        
        let gameShouldEnd = false;
        if (state.settings.winCondition.type === 'score' && currentScore >= state.settings.winCondition.value) {
            gameShouldEnd = true;
        }
        if (state.settings.winCondition.type === 'rounds' && isNewRound && newRound > state.settings.winCondition.value) {
            gameShouldEnd = true;
        }
        if (newAvailableDares.length === 0 && state.settings.gameMode !== GameMode.HOT_SEAT) {
            gameShouldEnd = true;
        }

        return {
            ...state,
            players: updatedPlayers,
            history: newHistory,
            currentPlayerIndex: nextPlayerIndex,
            currentTurn: null,
            availableDares: newAvailableDares,
            currentRound: newRound,
            gamePhase: gameShouldEnd ? GamePhase.GAME_OVER : state.gamePhase,
        };
    }

    case 'END_GAME': {
        const { lifetimeStats, players, history } = state;
        const newLifetimeStats: LifetimeStats = JSON.parse(JSON.stringify(lifetimeStats)); // deep copy

        const sortedPlayers = [...players].sort((a,b) => b.score - a.score);
        const winners = sortedPlayers.filter(p => p.score === sortedPlayers[0].score);

        players.forEach(player => {
            if (!newLifetimeStats[player.id]) {
                newLifetimeStats[player.id] = { gamesPlayed: 0, wins: 0, daresCompleted: 0, perfectGames: 0 };
            }
            const stats = newLifetimeStats[player.id];
            stats.gamesPlayed += 1;
            stats.daresCompleted += history.filter(h => h.player.id === player.id && h.completed).length;

            if(winners.some(w => w.id === player.id)) {
                stats.wins +=1;
                const hadForfeits = history.some(h => h.player.id === player.id && !h.completed);
                if (!hadForfeits) {
                    stats.perfectGames += 1;
                }
            }
        });

      return { ...state, gamePhase: GamePhase.GAME_OVER, lifetimeStats: newLifetimeStats };
    }
      
    case 'RESET_GAME':
        const playersToKeep = state.players.map(({id, name, avatar, title}) => ({id, name, avatar, score: 0, streak: 0, title}));
        return { 
            ...initialState, 
            players: playersToKeep, 
            settings: state.settings,
            customPacks: state.customPacks,
            lifetimeStats: state.lifetimeStats,
        };

    case 'LOAD_STATE':
        return { ...initialState, ...action.payload };
    
    case 'SAVE_CUSTOM_PACK': {
        const existingIndex = state.customPacks.findIndex(p => p.id === action.payload.id);
        let newCustomPacks = [...state.customPacks];
        if (existingIndex > -1) {
            newCustomPacks[existingIndex] = action.payload;
        } else {
            newCustomPacks.push(action.payload);
        }
        return { ...state, customPacks: newCustomPacks };
    }
    
    case 'DELETE_CUSTOM_PACK': {
        return { ...state, customPacks: state.customPacks.filter(p => p.id !== action.payload.id) };
    }

    case 'LOAD_CUSTOM_PACKS':
        return { ...state, customPacks: action.payload };
        
    case 'PAUSE_GAME':
        return { ...state, gamePhase: GamePhase.PAUSED };
    
    case 'RESUME_GAME':
        return { ...state, gamePhase: GamePhase.PLAYING };

    case 'ADD_TOAST':
        const newToast = { ...action.payload, id: Date.now() };
        return { ...state, toasts: [...state.toasts, newToast] };

    case 'REMOVE_TOAST':
        return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload.id) };

    case 'LOAD_LIFETIME_STATS':
        return { ...state, lifetimeStats: action.payload };
        
    case 'UPDATE_PLAYER_TITLE': {
        const updatedPlayers = state.players.map(p => p.id === action.payload.playerId ? {...p, title: action.payload.title} : p);
        return { ...state, players: updatedPlayers };
    }

    default:
      return state;
  }
};

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const loadGameState = useCallback(() => {
    try {
        const savedState = localStorage.getItem('dareGameState_v2');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsedState } });
        }
    } catch(e) {
        console.error("Failed to load game state from storage", e);
    }
  }, []);

  const loadCustomPacks = useCallback(() => {
     try {
        const savedPacks = localStorage.getItem('dareGameCustomPacks_v2');
        if (savedPacks) {
            dispatch({ type: 'LOAD_CUSTOM_PACKS', payload: JSON.parse(savedPacks) });
        }
    } catch(e) {
        console.error("Failed to load custom packs from storage", e);
    }
  }, []);
  
  const loadLifetimeStats = useCallback(() => {
     try {
        const savedStats = localStorage.getItem('dareGameLifetimeStats_v1');
        if (savedStats) {
            dispatch({ type: 'LOAD_LIFETIME_STATS', payload: JSON.parse(savedStats) });
        }
    } catch(e) {
        console.error("Failed to load lifetime stats from storage", e);
    }
  }, []);

  useEffect(() => {
    loadGameState();
    loadCustomPacks();
    loadLifetimeStats();
  }, [loadGameState, loadCustomPacks, loadLifetimeStats]);

  useEffect(() => {
    // Avoid saving during the setup phase to prevent incomplete state saves on refresh
    if (state.gamePhase !== GamePhase.SETUP) {
        localStorage.setItem('dareGameState_v2', JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    localStorage.setItem('dareGameCustomPacks_v2', JSON.stringify(state.customPacks));
  }, [state.customPacks]);
  
  useEffect(() => {
    localStorage.setItem('dareGameLifetimeStats_v1', JSON.stringify(state.lifetimeStats));
  }, [state.lifetimeStats]);


  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};