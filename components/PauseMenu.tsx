import React from 'react';
import { useGame } from '../src/context/GameContext';
import { PlayIcon } from './icons/PlayIcon';
import { SettingsIcon } from './icons/SettingsIcon';

const PauseMenu: React.FC = () => {
    const { dispatch } = useGame();

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-40 p-4 animate-fade-in">
            <div className="text-center space-y-8">
                <h1 className="text-6xl font-black text-gray-400 uppercase tracking-widest">Paused</h1>
                <div className="flex flex-col gap-4">
                     <button 
                        onClick={() => dispatch({ type: 'RESUME_GAME' })}
                        className="inline-flex items-center justify-center gap-3 bg-[var(--color-primary)] text-white font-bold py-4 px-12 text-2xl rounded-lg transition-all transform hover:scale-105"
                     >
                        <PlayIcon />
                        Resume
                    </button>
                    <button 
                        onClick={() => dispatch({ type: 'END_GAME' })}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-10 text-xl rounded-lg transition-transform transform hover:scale-105"
                    >
                        End Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PauseMenu;