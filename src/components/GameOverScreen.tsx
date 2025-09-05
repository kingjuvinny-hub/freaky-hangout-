import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Player, GameMode, Team, GameAward } from '../types';
// FIX: Corrected import path for shared component.
import { RestartIcon } from '../../components/icons/RestartIcon';
// FIX: Corrected import path for shared component.
import { StarIcon } from '../../components/icons/StarIcon';
import { generateAwards } from '../../utils/helpers';
import { useSounds } from '../../hooks/useSounds';
// FIX: Corrected import path for shared component.
import { AwardIcon } from '../../components/icons/AwardIcon';
// FIX: Corrected import path for shared component.
import Confetti from '../../components/Confetti';

const GameOverScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playWinSound } = useSounds();
  
  React.useEffect(() => {
    playWinSound();
  }, [playWinSound]);

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const gameAwards = useMemo(() => generateAwards(state.history, state.players), [state.history, state.players]);

  const { winners, winnerText, winnerAvatars } = useMemo(() => {
     if (state.settings.gameMode === GameMode.TEAMS) {
        const teamScores = state.teams.map(team => {
            const score = team.players.reduce((sum, pId) => sum + (state.players.find(p => p.id === pId)?.score || 0), 0);
            return { ...team, score };
        });
        const highScore = Math.max(...teamScores.map(t => t.score));
        const winners = teamScores.filter(t => t.score === highScore && highScore > 0);
        
        const winnerText = winners.length > 1 ? `It's a tie between ${winners.map(w => w.name).join(' & ')}!` : `${winners[0]?.name} wins!`;
        const winnerAvatars = winners.flatMap(w => w.players.map(pId => state.players.find(p => p.id === pId)?.avatar || ''));
        return { winners, winnerText, winnerAvatars };
     } else {
        const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
        const highScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 0;
        const winners = sortedPlayers.filter(p => p.score === highScore && highScore > 0);
        
        const winnerText = winners.length === 0 ? "It's a draw!" : winners.length === 1 ? `${winners[0].name} is the winner!` : `It's a tie between ${winners.map(w => w.name).join(' & ')}!`;
        const winnerAvatars = winners.map(w => w.avatar);
        return { winners, winnerText, winnerAvatars };
     }
  }, [state.players, state.teams, state.settings.gameMode]);

  const copySummaryToClipboard = () => {
    let summary = `DARE GAME RESULTS\n\n--- WINNER(S) ---\n${winnerText}\n\n--- FINAL SCORES ---\n`;
    state.players.sort((a,b) => b.score - a.score).forEach(p => {
        summary += `${p.name}: ${p.score} points\n`;
    });
    if (gameAwards.length > 0) {
        summary += "\n--- AWARDS ---\n";
        gameAwards.forEach(award => {
            summary += `${award.type} (${award.player.name}): ${award.description}\n`;
        });
    }
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-fade-in relative">
      {winners.length > 0 && <Confetti />}
      <div className="w-full max-w-2xl bg-black/30 backdrop-blur-sm border border-[var(--border-color)] rounded-xl shadow-2xl shadow-purple-900/50 p-8">
        <h1 className="text-4xl font-black text-[var(--color-primary)] animate-neon-glow" style={{ color: 'var(--color-primary)' }}>Game Over!</h1>
        <div className="my-6">
          <p className="text-2xl font-bold text-yellow-300">{winnerText}</p>
          <div className="flex justify-center text-5xl sm:text-6xl my-4 flex-wrap">
            {winnerAvatars.length > 0 ? winnerAvatars.map((avatar, i) => <span key={i}>{avatar}</span>) : '🤝'}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">Final Scores</h2>
                <ul className="space-y-3 text-left">
                  {[...state.players].sort((a, b) => b.score - a.score).map((player, index) => (
                    <li key={player.id} className={`flex justify-between items-center p-3 rounded-lg ${index === 0 ? 'bg-yellow-800/30' : 'bg-black/20'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{player.avatar}</span>
                        <span className="font-medium text-lg">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400 font-semibold text-lg">
                          <StarIcon />
                          <span>{player.score}</span>
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">Game Awards</h2>
                {gameAwards.length > 0 ? (
                    <ul className="space-y-3 text-left">
                        {gameAwards.map((award) => (
                            <li key={award.type} className="bg-black/20 p-3 rounded-lg">
                                <div className="flex items-center gap-3 font-bold text-yellow-400">
                                    <AwardIcon />
                                    <span>{award.type}</span>
                                </div>
                                <p className="text-sm mt-1">{award.player.name}: {award.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 mt-8">No special awards this time!</p>
                )}
            </div>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
            onClick={copySummaryToClipboard}
            className="inline-flex items-center gap-3 bg-gray-600 text-white font-bold py-3 px-8 text-xl rounded-lg transition-transform transform hover:scale-105"
        >
            Copy Summary
        </button>
        <button
            onClick={handlePlayAgain}
            className="inline-flex items-center gap-3 bg-[var(--color-primary)] text-white font-bold py-3 px-8 text-xl rounded-lg transition-all transform hover:scale-105"
            style={{ boxShadow: `0 0 15px var(--color-primary)`, filter: `drop-shadow(0 0 15px var(--color-primary))`}}
        >
            <RestartIcon />
            {state.roomId ? 'Back to Lobby' : 'Play Again'}
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;