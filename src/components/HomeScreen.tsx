import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { multiplayerService } from '../services/multiplayerService';
// FIX: Corrected import path for shared component.
import AvatarPicker from '../../components/AvatarPicker';
// FIX: Corrected import path for shared component.
import Modal from '../../components/Modal';
// FIX: Corrected import path for shared component.
import { Spinner } from '../../components/Spinner';
import { GamePhase } from '../types';

const HomeScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [isJoinModalOpen, setJoinModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [playerAvatar, setPlayerAvatar] = useState('😀');
    const [roomCode, setRoomCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const resetForms = () => {
        setPlayerName('');
        setPlayerAvatar('😀');
        setRoomCode('');
        setError('');
        setIsLoading(false);
    }

    const handleCreateGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!playerName.trim()) return;
        setIsLoading(true);
        try {
            const newState = await multiplayerService.createRoom(playerName.trim(), playerAvatar);
            // This component is unmounted, but for safety, we can dispatch
            dispatch({ type: 'SET_STATE', payload: newState });
        } catch (err) {
            setError((err as Error).message);
            setIsLoading(false);
        }
        // The context listener will handle transitioning to the lobby
    };

    const handleJoinGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!playerName.trim() || !roomCode.trim()) return;
        setIsLoading(true);
        try {
            const newState = await multiplayerService.joinRoom(roomCode.toUpperCase(), playerName.trim(), playerAvatar);
            dispatch({ type: 'SET_STATE', payload: newState });
        } catch(err) {
            setError((err as Error).message);
            setIsLoading(false);
        }
        // The context listener will handle transitioning to the lobby
    };
    
    const handlePlayOffline = () => {
        dispatch({ type: 'RESET_GAME' }); // Go to offline player setup
    }
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in space-y-6">
            <h2 className="text-2xl sm:text-3xl text-gray-300">Welcome to the Party!</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                    onClick={() => { setCreateModalOpen(true); resetForms(); }}
                    className="flex-1 bg-[var(--color-primary)] text-white font-black py-4 px-8 text-xl rounded-lg transition-all transform hover:scale-105"
                    style={{ boxShadow: `0 0 15px var(--color-primary)`, filter: `drop-shadow(0 0 15px var(--color-primary))`}}
                >
                    Create Online Game
                </button>
                <button
                    onClick={() => { setJoinModalOpen(true); resetForms(); }}
                    className="flex-1 bg-[var(--color-secondary)] text-white font-black py-4 px-8 text-xl rounded-lg transition-all transform hover:scale-105"
                    style={{ boxShadow: `0 0 15px var(--color-secondary)`, filter: `drop-shadow(0 0 15px var(--color-secondary))`}}
                >
                    Join Online Game
                </button>
            </div>
             <button onClick={handlePlayOffline} className="text-gray-400 hover:text-white font-bold py-2 px-6 transition-colors">
                Play Offline (Same Device)
            </button>
            
            {/* Create Game Modal */}
            <Modal title="Create Online Game" isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
                <form onSubmit={handleCreateGame} className="space-y-4">
                    <p className="text-sm text-gray-400">Enter your details to host a new game. A room code will be generated for you to share.</p>
                    <div className="flex gap-3">
                        <AvatarPicker selectedAvatar={playerAvatar} onSelectAvatar={setPlayerAvatar} />
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="flex-1 bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            maxLength={20}
                        />
                    </div>
                     {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-md hover:scale-105 transition-transform disabled:bg-gray-600">
                        {isLoading ? <Spinner /> : "Create Lobby"}
                    </button>
                </form>
            </Modal>
            
            {/* Join Game Modal */}
            <Modal title="Join Online Game" isOpen={isJoinModalOpen} onClose={() => setJoinModalOpen(false)}>
                 <form onSubmit={handleJoinGame} className="space-y-4">
                    <div className="flex gap-3">
                        <AvatarPicker selectedAvatar={playerAvatar} onSelectAvatar={setPlayerAvatar} />
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="flex-1 bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            maxLength={20}
                        />
                    </div>
                     <input
                        type="text"
                        placeholder="Room Code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        className="w-full bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white uppercase text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        maxLength={4}
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-[var(--color-secondary)] text-white font-bold py-3 rounded-md hover:scale-105 transition-transform disabled:bg-gray-600">
                        {isLoading ? <Spinner /> : "Join Game"}
                    </button>
                </form>
            </Modal>
        </div>
    )
}

export default HomeScreen;
