import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Spinner } from './Spinner';

const DareSubmissionScreen: React.FC = () => {
    const { state, dispatch } = useGame();
    const [isReadyForInput, setIsReadyForInput] = useState(false);
    const [dareText, setDareText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [daresAddedCount, setDaresAddedCount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const { players, dareSubmissionIndex } = state;
    const currentPlayer = players[dareSubmissionIndex];

    useEffect(() => {
        // When the player changes, reset the local state for the new player
        setIsReadyForInput(false);
        setDaresAddedCount(0);
        setDareText('');
    }, [dareSubmissionIndex]);

    const handleAddDare = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dareText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setTimeout(() => {
            dispatch({ type: 'SUBMIT_PERSONAL_DARE', payload: { dare: { text: dareText.trim(), type: 'text', difficulty: 2 } } });
            setDareText('');
            setDaresAddedCount(prev => prev + 1);
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }, 300);
    };

    const handleDoneAndPass = () => {
        if (daresAddedCount === 0) return;
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
    
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
            {!isReadyForInput ? (
                <div className="w-full max-w-2xl bg-black/30 backdrop-blur-sm border border-[var(--border-color)] rounded-xl shadow-2xl shadow-purple-900/50 p-8">
                    <h1 className="text-3xl font-bold text-[var(--color-secondary)]">Pass the Device To</h1>
                    <div className="flex items-center justify-center gap-4 my-6">
                        <span className="text-6xl">{currentPlayer.avatar}</span>
                        <p className="text-6xl font-black text-white">{currentPlayer.name}</p>
                    </div>
                    <button 
                        onClick={() => setIsReadyForInput(true)}
                        className="bg-[var(--color-primary)] text-white font-black py-3 px-12 text-2xl rounded-lg transition-all transform hover:scale-105"
                        style={{ boxShadow: `0 0 15px var(--color-primary)`, filter: `drop-shadow(0 0 15px var(--color-primary))`}}
                    >
                        I'm Ready
                    </button>
                </div>
            ) : (
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
                        onClick={handleDoneAndPass}
                        disabled={daresAddedCount === 0}
                        className="mt-8 w-full bg-[var(--color-primary)] text-white font-bold py-3 px-8 text-xl rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-700 disabled:opacity-50 disabled:transform-none"
                    >
                        Done & Pass Device ({daresAddedCount} added)
                    </button>
                </div>
            )}

            <div className="text-gray-400">
                <p>Submission Progress</p>
                <p className="font-bold text-lg">{dareSubmissionIndex + 1} / {players.length}</p>
            </div>
        </div>
    );
};

export default DareSubmissionScreen;