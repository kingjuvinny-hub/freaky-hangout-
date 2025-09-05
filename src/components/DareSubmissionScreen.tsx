import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
// FIX: Corrected import path for shared component.
import { Spinner } from '../../components/Spinner';

const DareSubmissionScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [dareText, setDareText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [daresAddedCount, setDaresAddedCount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const { players, dareSubmissionIndex, playerId, hostId } = state;
    const currentPlayer = players[dareSubmissionIndex];
    const isMyTurnToSubmit = !state.roomId || playerId === currentPlayer?.id;
    const isHost = playerId === hostId;

    const handleAddDare = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dareText.trim() || isSubmitting || !isMyTurnToSubmit) return;

        setIsSubmitting(true);
        // In a real online game, this would be an API call.
        // With our service, it's synchronous but we simulate delay.
        setTimeout(() => {
            dispatch({ type: 'SUBMIT_PERSONAL_DARE', payload: { dare: { text: dareText.trim(), type: 'text', difficulty: 2 } } });
            setDareText('');
            setDaresAddedCount(prev => prev + 1);
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }, 300);
    };

    const handleDone = () => {
        if (!isMyTurnToSubmit || daresAddedCount === 0) return;
        setIsDone(true);
        dispatch({ type: 'NEXT_DARE_SUBMITTER' });
    };

    if (!currentPlayer) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Spinner />
                <p className="mt-4 text-xl">Starting Hot Seat round...</p>
            </div>
        );
    }
    
    if (!isMyTurnToSubmit || isDone) {
        return (
             <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
                <div className="w-full max-w-2xl bg-black/30 backdrop-blur-sm border border-[var(--border-color)] rounded-xl shadow-2xl shadow-purple-900/50 p-8">
                     <h1 className="text-3xl font-bold text-[var(--color-secondary)]">Waiting for Players</h1>
                     <p className="text-gray-400 mt-2">Dares are being submitted anonymously...</p>
                     <div className="my-6">
                        <Spinner />
                     </div>
                     <p className="text-lg font-bold">{dareSubmissionIndex} / {players.length} players have submitted.</p>
                     {isHost && dareSubmissionIndex >= players.length && (
                        <button onClick={() => dispatch({type: 'NEXT_DARE_SUBMITTER'})} className="mt-6 w-full bg-[var(--color-primary)] text-white font-bold py-3 px-8 text-xl rounded-lg">
                            All Dares Submitted! Start Game
                        </button>
                     )}
                </div>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
             <div className="w-full max-w-2xl bg-black/30 backdrop-blur-sm border border-[var(--border-color)] rounded-xl shadow-2xl shadow-purple-900/50 p-8 animate-fade-in">
                <h1 className="text-2xl font-bold">
                    <span className="text-[var(--color-secondary)]">{currentPlayer.name}</span>, add dares for the group.
                </h1>
                <p className="text-gray-400 mt-1">No one will know you wrote them!</p>
                
                <form onSubmit={handleAddDare} className="mt-6 space-y-4">
                    <div className="relative">
                        <textarea
                            value={dareText}
                            onChange={(e) => setDareText(e.target.value)}
                            placeholder="e.g. Do your best chicken dance..."
                            rows={3}
                            className="w-full bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                            maxLength={200}
                        />
                         {showSuccess && <p className="absolute -bottom-6 left-0 right-0 text-green-400 animate-fade-in text-sm">Dare Added!</p>}
                    </div>
                    <button 
                        type="submit"
                        disabled={!dareText.trim() || isSubmitting}
                        className="w-full bg-[var(--color-secondary)] text-white font-black py-3 text-xl rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
                        style={{ boxShadow: `0 0 15px var(--color-secondary)`, filter: `drop-shadow(0 0 15px var(--color-secondary))`}}
                    >
                        {isSubmitting ? <Spinner /> : 'Add This Dare'}
                    </button>
                </form>

                 <button 
                    onClick={handleDone}
                    disabled={daresAddedCount === 0}
                    className="mt-8 w-full bg-[var(--color-primary)] text-white font-bold py-3 px-8 text-xl rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-700 disabled:opacity-50 disabled:transform-none"
                >
                    Done Submitting ({daresAddedCount} added)
                </button>
            </div>
            
            <div className="text-gray-400">
                <p>Submission Progress</p>
                <p className="font-bold text-lg">{dareSubmissionIndex + 1} / {players.length}</p>
            </div>
        </div>
    );
};

export default DareSubmissionScreen;
