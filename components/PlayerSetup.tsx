import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { TrashIcon } from './icons/TrashIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { Player, GameMode, Team, PlayerTitle } from '../types';
import Modal from './Modal';
import Settings from './Settings';
import { TrophyIcon } from './icons/TrophyIcon';
import LifetimeStatsModal from './LifetimeStatsModal';

const PlayerListItem: React.FC<{ player: Player; onRemove: (id: string) => void }> = React.memo(({ player, onRemove }) => (
  <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg animate-slide-up border border-[var(--border-color)]">
    <div className="flex items-center gap-3">
      <span className="text-3xl">{player.avatar}</span>
      <div className="flex flex-col">
        <span className="font-medium text-lg">{player.name}</span>
        {player.title && <span className="text-xs text-yellow-400">{player.title}</span>}
      </div>
    </div>
    <button onClick={() => onRemove(player.id)} className="text-[var(--color-primary)] hover:text-opacity-80 transition-colors duration-200 p-1 rounded-full hover:bg-black/20">
      <TrashIcon />
    </button>
  </div>
));

const PlayerSetup: React.FC = () => {
  const { state, dispatch } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('😀');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [numTeams, setNumTeams] = useState(2);
  
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerAvatar.trim() || state.players.length >= 12) return;
    dispatch({ type: 'ADD_PLAYER', payload: { name: playerName.trim(), avatar: playerAvatar } });
    setPlayerName('');
    setPlayerAvatar('😀');
  };

  const handleRemovePlayer = (id: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: { id } });
  };
  
  const handleStartGame = () => {
    if (state.settings.gameMode === GameMode.TEAMS) {
      const shuffledPlayers = [...state.players].sort(() => Math.random() - 0.5);
      const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({ id: `team_${i+1}`, name: `Team ${i+1}`, players: [] }));
      const playersWithTeams: Player[] = [];
      
      shuffledPlayers.forEach((player, index) => {
        const teamIndex = index % numTeams;
        teams[teamIndex].players.push(player.id);
        playersWithTeams.push({ ...player, teamId: teams[teamIndex].id });
      });

      dispatch({ type: 'SETUP_TEAMS', payload: { teams, players: playersWithTeams } });
    }
    dispatch({ type: 'START_GAME' });
  };
  
  const handleGameModeChange = (mode: GameMode) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { gameMode: mode } });
  }
  
  const gameModeDescription = useMemo(() => {
    switch(state.settings.gameMode) {
      case GameMode.SOLO: return "Every player for themselves. Last one standing wins!";
      case GameMode.TEAMS: return "Players are split into teams. The team with the highest combined score wins.";
      case GameMode.HOT_SEAT: return "Players anonymously submit their own dares to the game pool!";
      default: return "";
    }
  }, [state.settings.gameMode]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-black/30 backdrop-blur-sm border border-[var(--border-color)] p-6 rounded-xl shadow-lg shadow-purple-900/20">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)] flex justify-between items-center">
            Add Players
             <button onClick={() => setIsStatsOpen(true)} className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 rounded-full hover:bg-black/20" title="Lifetime Stats">
                <TrophyIcon />
            </button>
          </h2>
          <form onSubmit={handleAddPlayer} className="flex gap-2">
            <input
              type="text"
              value={playerAvatar}
              onChange={(e) => setPlayerAvatar(e.target.value)}
              className="w-16 bg-black/20 border-2 border-[var(--color-accent)] rounded-md p-2 text-3xl text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              maxLength={2}
            />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Player Name"
              className="flex-1 bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              maxLength={20}
            />
            <button type="submit" className="bg-[var(--color-primary)] text-white font-bold p-3 rounded-md transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:transform-none"
                    disabled={!playerName.trim() || state.players.length >= 12}>
              Add
            </button>
          </form>
          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
            {state.players.map(player => (
              <PlayerListItem key={player.id} player={player} onRemove={handleRemovePlayer} />
            ))}
             {state.players.length === 0 && <p className="text-gray-400 text-center py-4">Add some players to get started!</p>}
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-[var(--border-color)] p-6 rounded-xl shadow-lg shadow-purple-900/20">
           <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)] flex justify-between items-center">
            Game Setup
            <button onClick={() => setIsSettingsOpen(true)} className="text-[var(--color-secondary)] hover:text-opacity-80 transition-colors p-2 rounded-full hover:bg-black/20" title="Settings">
              <SettingsIcon />
            </button>
          </h2>

          <div className="space-y-4">
              <div>
                  <label className="font-bold text-lg text-[var(--color-secondary)]">Game Mode</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(Object.values(GameMode)).map(mode => (
                         <button key={mode} onClick={() => handleGameModeChange(mode)} 
                                className={`p-3 rounded-md font-semibold transition-colors text-sm ${state.settings.gameMode === mode ? 'bg-[var(--color-accent)] text-white' : 'bg-black/20 hover:bg-black/40'}`}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-2 h-10">{gameModeDescription}</p>
              </div>
              
              {state.settings.gameMode === GameMode.TEAMS && (
                <div>
                  <label htmlFor="numTeams" className="font-bold text-lg text-[var(--color-secondary)]">Number of Teams</label>
                  <input type="range" id="numTeams" min="2" max={Math.max(2, Math.floor(state.players.length / 2))} 
                         value={numTeams} onChange={(e) => setNumTeams(parseInt(e.target.value))}
                         className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2"
                         disabled={state.players.length < 4}
                   />
                   <div className="flex justify-between text-sm text-gray-400">
                        <span>2</span>
                        <span>{numTeams}</span>
                        <span>{Math.max(2, Math.floor(state.players.length / 2))}</span>
                   </div>
                   {state.players.length < 4 && <p className="text-xs text-yellow-500">Need at least 4 players for teams.</p>}
                </div>
              )}
              
               <div>
                  <label className="font-bold text-lg text-[var(--color-secondary)]">Win Condition</label>
                  <div className="flex gap-2 mt-2">
                      <div className="flex-1">
                          <select value={state.settings.winCondition.type} onChange={e => dispatch({type: 'UPDATE_SETTINGS', payload: { winCondition: {...state.settings.winCondition, type: e.target.value as 'score' | 'rounds'} }})}
                                  className="w-full bg-black/20 border border-[var(--border-color)] rounded-md px-2 py-2 text-white">
                              <option value="score">First to Score</option>
                              <option value="rounds">After Rounds</option>
                          </select>
                      </div>
                       <input type="number" min="1" max="100" 
                              value={state.settings.winCondition.value} onChange={e => dispatch({type: 'UPDATE_SETTINGS', payload: { winCondition: {...state.settings.winCondition, value: parseInt(e.target.value) || 1} }})}
                              className="w-24 bg-black/20 border border-[var(--border-color)] rounded-md px-2 py-2 text-white text-center"/>
                  </div>
              </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleStartGame}
          disabled={state.players.length < 2 || (state.settings.gameMode === GameMode.TEAMS && state.players.length < 4)}
          className="bg-[var(--color-primary)] text-white font-black py-4 px-16 text-2xl rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
          style={{ boxShadow: `0 0 15px var(--color-primary)`, filter: `drop-shadow(0 0 15px var(--color-primary))`}}
        >
          Start Game
        </button>
      </div>
      <Modal title="Game Settings" isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <Settings />
      </Modal>
      <LifetimeStatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
    </div>
  );
};

export default PlayerSetup;