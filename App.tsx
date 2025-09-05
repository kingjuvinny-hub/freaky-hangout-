import React, { useEffect } from 'react';
// FIX: Use types from src which include multiplayer properties.
import { GamePhase } from './src/types';
// FIX: Use components from src which are designed for the multiplayer flow.
import PlayerSetup from './src/components/PlayerSetup';
import GameScreen from './src/components/GameScreen';
import Header from './components/Header';
// FIX: Use context from src which provides multiplayer state.
import { useGame } from './src/context/GameContext';
import GameOverScreen from './src/components/GameOverScreen';
import DareSubmissionScreen from './src/components/DareSubmissionScreen';
import PauseMenu from './components/PauseMenu';
import Toast from './components/Toast';
import HomeScreen from './src/components/HomeScreen';
import LobbyScreen from './src/components/LobbyScreen';

const App: React.FC = () => {
  const { state } = useGame();

  useEffect(() => {
    const body = document.body;
    body.className = ''; // Reset classes
    if (state.settings.theme) {
      body.classList.add(`theme-${state.settings.theme}`);
    }
  }, [state.settings.theme]);


  const renderContent = () => {
    // If there's a room ID, we are in an online game.
    if (state.roomId) {
        switch (state.gamePhase) {
            case GamePhase.LOBBY:
                return <LobbyScreen />;
            case GamePhase.DARE_SUBMISSION:
                return <DareSubmissionScreen />;
            case GamePhase.PLAYING:
            case GamePhase.PAUSED:
                return <GameScreen />;
            case GamePhase.GAME_OVER:
                return <GameOverScreen />;
            default:
                return <LobbyScreen />; // Default to lobby if in a weird state
        }
    }
    
    // Offline mode flow
    switch (state.gamePhase) {
      case GamePhase.HOME:
        return <HomeScreen />;
      case GamePhase.SETUP:
        return <PlayerSetup />;
      case GamePhase.DARE_SUBMISSION:
        return <DareSubmissionScreen />;
      case GamePhase.PLAYING:
      case GamePhase.PAUSED:
        return <GameScreen />;
      case GamePhase.GAME_OVER:
        return <GameOverScreen />;
      default:
        return <HomeScreen />;
    }
  };
  
  const getFontClass = () => {
    switch (state.settings.theme) {
        case 'spooky': return 'font-creepster';
        case 'pirate': return 'font-pirate';
        default: return 'font-poppins';
    }
  }

  return (
    <div className={`min-h-screen bg-transparent text-gray-100 p-4 sm:p-6 lg:p-8 selection:bg-pink-500 selection:text-white ${getFontClass()}`}>
      <div className="max-w-4xl mx-auto relative">
        <Header />
        <main className="mt-8">{renderContent()}</main>
        {state.gamePhase === GamePhase.PAUSED && <PauseMenu />}
        <Toast />
      </div>
    </div>
  );
};

export default App;