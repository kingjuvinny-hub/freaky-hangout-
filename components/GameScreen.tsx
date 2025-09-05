import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { GameMode, GamePhase, Player, Team } from '../types';
import Modal from './Modal';
import { SkipIcon } from './icons/SkipIcon';
import { StarIcon } from './icons/StarIcon';
import { CheckIcon } from './icons/CheckIcon';
import { Spinner } from './Spinner';
import { useSounds } from '../hooks/useSounds';
import { PlusIcon } from './icons/PlusIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import Settings from './Settings';
import GameHistoryModal from './GameHistoryModal';
import { PauseIcon } from './icons/PauseIcon';

const TeamScoreboard: React.FC<{ teams: Team[], players: Player[], currentPlayerId: string, nextPlayerId: string }> = ({ teams, players, currentPlayerId, nextPlayerId }) => {
    const getTeamScore = (team: Team) => {
        return team.players.reduce((total, playerId) => {
            const player = players.find(p => p.id === playerId);
            return total + (player?.score || 0);
        }, 0);
    };

    const sortedTeams = useMemo(() => teams.map(team => ({...team, score: getTeamScore(team)})).sort((a,b) => b.score - a.score), [teams, players]);

    return (
      <div className="w-full max-w-2xl bg-black/30 backdrop-blur-sm border border-[var(--border-color)] p-4 rounded-xl shadow-lg shadow-purple-900/20">
        <h3 className="text-lg font-bold mb-3 text-[var(--color-secondary)] animate-neon-glow" style={{ color: 'var(--color-secondary)' }}>Scoreboard</h3>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
            {sortedTeams.map(team => (
                 <li key={team.id}>
                    <div className="flex justify-between items-center p-2 rounded-md bg-purple-900/30">
                        <span className="font-bold">{team.name}</span>
                        <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                            <StarIcon />
                            <span>{getTeamScore(team)}</span>
                        </div>
                    </div>
                    <ul className="pl-4 pt-1 space-y-1">
                        {team.players.map(playerId => {
                            const player = players.find(p => p.id === playerId);
                            if (!player) return null;
                            const isCurrent = player.id === currentPlayerId;
                            const isNext = player.id === nextPlayerId;
                            return (
                                <li key={player.id} className={`flex justify-between items-center pr-2 pl-1 rounded-md transition-colors text-sm ${isCurrent ? 'bg-pink-900/50' : ''}`}>
                                    <div className="flex items-center gap-2 font-medium">
                                        <span>{player.avatar}</span>
                                        <span>{player.name}</span>
                                        {isNext && <span className="text-xs text-gray-400">(Next)</span>}
                                    </div>
                                    <span>{player.score}</span>
                                </li>
                            )
                        })}
                    </ul>
                 </li>
            ))}
        </ul>
    </div>
    )
}


const SoloScoreboard: React.FC<{ players: Player[], currentPlayerId: string, nextPlayerId: string }> = ({ players, currentPlayerId, nextPlayerId }) => (
    <div className="w-full max-w-2xl bg-black/30 backdrop-blur-sm border border-[var(--border-color)] p-4 rounded-xl shadow-lg shadow-purple-900/20">
        <h3 className="text-lg font-bold mb-3 text-[var(--color-secondary)] animate-neon-glow" style={{ color: 'var(--color-secondary)' }}>Scoreboard</h3>
        <ul className="space-y-2 max-h-40 overflow-y-auto">
            {players.sort((a, b) => b.score - a.score).map(player => {
                const isCurrent = player.id === currentPlayerId;
                const isNext = player.id === nextPlayerId;
                return(
                    <li key={player.id} className={`flex justify-between items-center p-2 rounded-md transition-colors ${isCurrent ? 'bg-pink-900/50' : ''}`}>
                        <div className="flex items-center gap-3 font-medium">
                            <span>{player.avatar}</span>
                            <span>{player.name}</span>
                             {isNext && <span className="text-xs text-gray-400">(Next)</span>}
                        </div>
                        <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                            <StarIcon />
                            <span>{player.score}</span>
                        </div>
                    </li>
                )
            })}
        </ul>
    </div>
);

const DareTimer: React.FC<{ duration: number; onTimeout: () => void }> = ({ duration, onTimeout }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const progress = (timeLeft / duration) * 100;

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeout();
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, onTimeout]);
    
    const isUrgent = timeLeft <= 10;

    return (
        <div className={`relative w-20 h-20 flex items-center justify-center font-bold text-2xl rounded-full ${isUrgent ? 'animate-timer-pulse text-red-500' : ''}`}
            style={{ background: `radial-gradient(closest-side, #1a1a2e 79%, transparent 80% 100%), conic-gradient(var(--color-secondary) ${progress}%, #4b5563 0)`}}
        >
            {timeLeft}
        </div>
    )
}

const GameScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
    const [isDoubleDown, setDoubleDown] = useState(false);
    const [newDareText, setNewDareText] = useState("");
    const [isAddDareModalOpen, setAddDareModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const { playCompleteSound, playForfeitSound } = useSounds();
    const currentPlayer = state.players[state.currentPlayerIndex];
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    const nextPlayer = state.players[nextPlayerIndex];

    useEffect(() => {
        if (!state.currentTurn && state.gamePhase === GamePhase.PLAYING) {
            setDoubleDown(false); // Reset double down state for new turn
            const timer = setTimeout(() => {
                dispatch({ type: 'SET_DARE', payload: { isDoubleDown } });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [state.currentTurn, state.gamePhase, dispatch]);
    
    const handleTurnCompletion = (completed: boolean) => {
        if (completed) playCompleteSound();
        else playForfeitSound();
        dispatch({ type: 'COMPLETE_TURN', payload: { completed } });
    };

    const handleEndGameConfirm = () => {
        dispatch({ type: 'END_GAME' });
        setIsEndGameModalOpen(false);
    };

    const handleAddDareSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newDareText.trim()){
            dispatch({ type: 'ADD_CUSTOM_DARE_TO_GAME', payload: { dare: { text: newDareText.trim(), type: 'text', difficulty: 1 } } });
            setNewDareText("");
            setAddDareModalOpen(false);
        }
    }
    
    const showDareReveal = !state.currentTurn;

    if (!currentPlayer) {
        return <div>Loading player...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
             <div className="w-full flex justify-end gap-2 -mb-4">
                <button onClick={() => dispatch({type: 'PAUSE_GAME'})} className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors p-2 rounded-full hover:bg-black/20" title="Pause Game">
                    <PauseIcon />
                </button>
                <button onClick={() => setAddDareModalOpen(true)} className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors p-2 rounded-full hover:bg-black/20" title="Add a Dare">
                    <PlusIcon />
                </button>
                 <button onClick={() => setIsHistoryOpen(true)} className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors p-2 rounded-full hover:bg-black/20" title="Game History">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                 <button onClick={() => setIsSettingsOpen(true)} className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors p-2 rounded-full hover:bg-black/20" title="Settings">
                    <SettingsIcon />
                </button>
            </div>
            <div className="w-full max-w-2xl text-center">
                <p className="text-xl text-gray-400">It's your turn,</p>
                <div className="flex items-center justify-center gap-4 mt-1">
                    <span className="text-5xl">{currentPlayer.avatar}</span>
                    <h1 className="text-5xl font-black text-[var(--color-secondary)] drop-shadow-[0_0_10px_var(--color-secondary)]">{currentPlayer.name}</h1>
                </div>
            </div>

            <div className="w-full max-w-2xl min-h-[250px] bg-black/30 backdrop-blur-sm border border-[var(--border-color)] rounded-xl shadow-2xl shadow-purple-900/50 p-8 flex flex-col items-center justify-center text-center">
                {showDareReveal ? (
                    <div className="space-y-6">
                        <div className="animate-pulse flex flex-col items-center justify-center space-y-4 text-gray-400">
                            <Spinner />
                            <h2 className="text-2xl font-bold">Thinking of a dare...</h2>
                        </div>
                        <button onClick={() => { setDoubleDown(true); dispatch({ type: 'SET_DARE', payload: { isDoubleDown: true } }) }} 
                                className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-md transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30">
                            DOUBLE DOWN!
                            <p className="text-xs font-normal">(+2 points, or -2 if you forfeit)</p>
                        </button>
                    </div>
                ) : (
                    <div>
                        {state.currentTurn.isDoubleDown && <p className="text-yellow-400 font-bold text-lg animate-pulse mb-2">DOUBLE DOWN!</p>}
                        <h3 className="text-lg font-bold uppercase tracking-widest text-[var(--color-primary)] mb-4 animate-fade-in animate-neon-glow" style={{ color: 'var(--color-primary)', animationDuration: '400ms' }}>DARE</h3>
                        <p 
                            className="text-2xl md:text-3xl font-medium leading-relaxed animate-slide-up"
                            style={{ animationDelay: '200ms' }}
                        >
                            {state.currentTurn.dare.text}
                        </p>
                        {state.settings.timerDuration > 0 && 
                            <div className="mt-6 flex justify-center">
                                <DareTimer duration={state.settings.timerDuration} onTimeout={() => handleTurnCompletion(false)} />
                            </div>
                        }
                    </div>
                )}
            </div>

            {state.currentTurn && (
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl animate-fade-in">
                    <button onClick={() => handleTurnCompletion(false)} className="flex-1 inline-flex items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 px-8 text-xl rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <SkipIcon />
                        Forfeit
                    </button>
                    <button onClick={() => handleTurnCompletion(true)} className="flex-1 inline-flex items-center justify-center gap-3 bg-[var(--color-primary)] text-white font-bold py-4 px-8 text-xl rounded-lg transition-all transform hover:scale-105"
                         style={{ boxShadow: `0 0 15px var(--color-primary)`, filter: `drop-shadow(0 0 15px var(--color-primary))`}}>
                        <CheckIcon />
                        Completed!
                    </button>
                </div>
            )}
             {state.currentTurn && state.settings.forfeitPenalty > 0 &&
                 <p className="text-sm text-yellow-400">Forfeiting will cost you {state.settings.forfeitPenalty} point{state.settings.forfeitPenalty > 1 && 's'}!</p>
             }
             {state.availableDares.length < 10 && state.availableDares.length > 0 &&
                <p className="text-sm text-orange-400 animate-pulse">Warning: Only {state.availableDares.length} dares left!</p>
             }

            {state.settings.gameMode === GameMode.TEAMS ? (
                <TeamScoreboard teams={state.teams} players={state.players} currentPlayerId={currentPlayer.id} nextPlayerId={nextPlayer.id} />
            ) : (
                <SoloScoreboard players={state.players} currentPlayerId={currentPlayer.id} nextPlayerId={nextPlayer.id} />
            )}


            <button onClick={() => setIsEndGameModalOpen(true)} className="mt-6 text-gray-500 hover:text-red-400 transition-colors font-semibold">
                End Game
            </button>
            
            <Modal title="End Game?" isOpen={isEndGameModalOpen} onClose={() => setIsEndGameModalOpen(false)}>
                <div className="text-center">
                    <p className="text-lg mb-6">Are you sure you want to end the current game?</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setIsEndGameModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded-md transition">Cancel</button>
                        <button onClick={handleEndGameConfirm} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-8 rounded-md transition">End Game</button>
                    </div>
                </div>
            </Modal>
             <Modal title="Add a Quick Dare" isOpen={isAddDareModalOpen} onClose={() => setAddDareModalOpen(false)}>
                <form onSubmit={handleAddDareSubmit}>
                    <textarea value={newDareText} onChange={e => setNewDareText(e.target.value)}
                        className="w-full bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        rows={3}
                        placeholder="Enter your dare text..."
                    ></textarea>
                    <button type="submit" className="mt-4 w-full bg-[var(--color-primary)] text-white font-bold py-2 px-6 rounded-md transition-transform transform hover:scale-105">Add Dare</button>
                </form>
             </Modal>
              <Modal title="Game Settings" isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
                <Settings />
            </Modal>
            <GameHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </div>
    );
};

export default GameScreen;