import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
// FIX: Corrected import path for shared component.
import { SettingsIcon } from '../../components/icons/SettingsIcon';
// FIX: Corrected import path for shared component.
import Modal from '../../components/Modal';
import Settings from './Settings';
import { multiplayerService } from '../services/multiplayerService';
import { GameMode, Player } from '../types';
import { UserIcon } from './icons/UserIcon';
import { CrownIcon } from './icons/CrownIcon';

const LobbyScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const { roomId, players, hostId, playerId } = state;
    const isHost = playerId === hostId;

    const handleStartGame = () => {
        multiplayerService.sendAction({ type: 'START_GAME' });
    }
    
    const handleCopyCode = () => {
        if (!roomId) return;
        navigator.clipboard.writeText(roomId);
        dispatch({ type: 'ADD_TOAST', payload: { message: 'Room code copied!', type: 'success' } });
    }
    
    return (
        <div className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-sm border border-[var(--border-color)] p-6 rounded-xl shadow-lg shadow-purple-900/20 animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[var(--color-primary)]">Game Lobby</h1>
                 {isHost && (
                    <button onClick={() => setIsSettingsOpen(true)} className="text-[var(--color-secondary)] hover:text-opacity-80 transition-colors p-2 rounded-full hover:bg-black/20" title="Settings">
                        <SettingsIcon />
                    </button>
                 )}
            </div>
            
            <div className="text-center bg-black/20 border border-[var(--border-color)] p-4 rounded-lg">
                <p className="text-gray-400">Share this code with your friends:</p>
                <div 
                    className="text-4xl font-black tracking-widest my-2 text-yellow-300 cursor-pointer"
                    onClick={handleCopyCode}
                    title="Click to copy"
                >
                    {roomId}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-3 flex items-center gap-2">
                    <UserIcon />
                    Players ({players.length}/12)
                </h2>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {players.map(player => (
                        <div key={player.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-[var(--border-color)]">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{player.avatar}</span>
                                <span className="font-medium text-lg">{player.name}</span>
                            </div>
                            {player.id === hostId && (
                                <div className="text-yellow-400" title="Host">
                                    <CrownIcon />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {isHost ? (
                <button
                    onClick={handleStartGame}
                    disabled={players.length < 2}
                    className="w-full bg-[var(--color-primary)] text-white font-black py-4 text-2xl rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ boxShadow: `0 0 15px var(--color-primary)`, filter: `drop-shadow(0 0 15px var(--color-primary))`}}
                >
                    Start Game
                </button>
            ) : (
                <p className="text-center text-gray-400 text-lg animate-pulse">Waiting for the host to start the game...</p>
            )}

            <Modal title="Game Settings" isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
                <Settings />
            </Modal>
        </div>
    )
};

export default LobbyScreen;
