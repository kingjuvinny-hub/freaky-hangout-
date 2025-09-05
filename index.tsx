import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// FIX: Use GameProvider from src/context which has multiplayer support.
import { GameProvider } from './src/context/GameContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);
