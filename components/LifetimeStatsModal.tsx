import React, { useMemo } from 'react';
import { useGame } from '../src/context/GameContext';
import { PlayerTitle } from '../src/types';
import Modal from './Modal';
import { AwardIcon } from './icons/AwardIcon';

const LifetimeStatsModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useGame();
    const { lifetimeStats, players } = state;

    const availableTitlesForPlayer = (playerId: string): PlayerTitle[] => {
        const stats = lifetimeStats[playerId];
        if (!stats) return [PlayerTitle.ROOKIE];
        const titles = [PlayerTitle.ROOKIE];
        if (stats.gamesPlayed >= 10) titles.push(PlayerTitle.VETERAN);
        if (stats.wins >= 5) titles.push(PlayerTitle.DARE_CONQUEROR);
        return titles;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Player Lifetime Stats">
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                {players.length > 0 ? players.map(player => (
                    <div key={player.id} className="bg-black/20 p-4 rounded-lg border border-[var(--border-color)]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{player.avatar}</span>
                                <div>
                                    <p className="font-bold text-lg">{player.name}</p>
                                    <div className="flex items-center gap-1 text-xs text-yellow-400">
                                        <AwardIcon className="w-4 h-4" />
                                        <span>{player.title || 'Rookie'}</span>
                                    </div>
                                </div>
                            </div>
                            <select 
                                value={player.title || PlayerTitle.ROOKIE} 
                                onChange={(e) => dispatch({ type: 'UPDATE_PLAYER_TITLE', payload: { playerId: player.id, title: e.target.value as PlayerTitle } })}
                                className="bg-black/30 border border-gray-600 rounded-md px-2 py-1 text-xs"
                            >
                                {availableTitlesForPlayer(player.id).map(title => (
                                    <option key={title} value={title}>{title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mt-4 text-sm">
                            <div>
                                <p className="font-bold text-xl text-[var(--color-secondary)]">{lifetimeStats[player.id]?.gamesPlayed || 0}</p>
                                <p className="text-gray-400">Played</p>
                            </div>
                             <div>
                                <p className="font-bold text-xl text-[var(--color-secondary)]">{lifetimeStats[player.id]?.wins || 0}</p>
                                <p className="text-gray-400">Wins</p>
                            </div>
                             <div>
                                <p className="font-bold text-xl text-[var(--color-secondary)]">{lifetimeStats[player.id]?.daresCompleted || 0}</p>
                                <p className="text-gray-400">Dares Done</p>
                            </div>
                             <div>
                                <p className="font-bold text-xl text-[var(--color-secondary)]">{lifetimeStats[player.id]?.perfectGames || 0}</p>
                                <p className="text-gray-400">Perfect Games</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-400">No players added yet.</p>
                )}
            </div>
        </Modal>
    )
}

export default LifetimeStatsModal;