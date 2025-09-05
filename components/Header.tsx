import React, { useState } from 'react';
import { FireIcon } from './icons/FireIcon';
import { QuestionIcon } from './icons/QuestionIcon';
import Modal from './Modal';
import { useGame } from '../src/context/GameContext';
import { GamePhase } from '../src/types';

const HowToPlayContent: React.FC = () => (
  <div className="space-y-4 text-left text-gray-300">
    <div>
      <h3 className="font-bold text-lg text-[var(--color-primary)]">1. Setup</h3>
      <p>Add 2 to 12 players, pick avatars, and choose your game mode. Visit Settings to select Dare packs, set a win condition (score or rounds), enable a timer, and more!</p>
    </div>
     <div>
      <h3 className="font-bold text-lg text-[var(--color-primary)]">Game Modes</h3>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li><span className="font-semibold">Solo:</span> Every player for themselves!</li>
        <li><span className="font-semibold">Teams:</span> Players are split into teams and scores are combined.</li>
        <li><span className="font-semibold">Hot Seat:</span> Players anonymously submit their own dares to the game pool before the game starts!</li>
      </ul>
    </div>
    <div>
      <h3 className="font-bold text-lg text-[var(--color-secondary)]">2. Playing the Game</h3>
      <p>On your turn, you'll be given a random dare. Feeling lucky? Hit "Double Down" BEFORE the dare is revealed to double the stakes. Complete the dare before the timer runs out!</p>
    </div>
    <div>
      <h3 className="font-bold text-lg text-yellow-400">3. Scoring</h3>
      <p>Complete a dare to earn points. If you forfeit, you'll lose points based on the penalty setting. A Double Down doubles both the reward and the penalty!</p>
    </div>
     <div>
      <h3 className="font-bold text-lg text-green-400">4. Winning</h3>
      <p>The game ends when the win condition is met. The player or team with the most points wins. Check out the end-game awards for bragging rights!</p>
    </div>
  </div>
);

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useGame();

  const getGameStatusText = () => {
    if (state.gamePhase !== GamePhase.PLAYING) {
      return "The ultimate party game!";
    }
    const { type, value } = state.settings.winCondition;
    if (type === 'rounds') {
      return `Round ${state.currentRound} of ${value}`;
    }
    return `First to ${value} Points`;
  };

  return (
    <header className="text-center relative">
       <button 
        onClick={() => setIsModalOpen(true)} 
        className="absolute top-0 right-0 text-gray-400 hover:text-[var(--color-secondary)] transition-colors p-2 rounded-full hover:bg-black/30"
        aria-label="How to play"
      >
        <QuestionIcon />
      </button>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter" style={{ fontFamily: state.settings.theme === 'spooky' ? 'Creepster' : 'Poppins' }}>
        <div className="inline-block transform rotate-[-15deg] mr-2 -mt-4 text-[var(--color-primary)] animate-neon-glow" style={{ color: 'var(--color-primary)' }}>
            <FireIcon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
        </div>
        Freaky Hangout
      </h1>
      <p className="mt-2 text-lg text-gray-400 font-poppins">{getGameStatusText()}</p>

      <Modal title="How to Play" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HowToPlayContent />
      </Modal>
    </header>
  );
};

export default Header;