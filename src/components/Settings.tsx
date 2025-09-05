import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
// FIX: Corrected import path for constants.
import { CORE_PACKS } from '../../constants/dares';
// FIX: Corrected import path for constants.
import { ADULT_PACK } from '../../constants/adultPack';
// FIX: Corrected import path for shared component.
import CustomPackManager from '../../components/CustomPackManager';
import { GameMode } from '../types';

const Settings: React.FC = () => {
  const { state, dispatch } = useGame();
  const { settings } = state;
  const [showAdultWarning, setShowAdultWarning] = useState(false);

  const handlePackToggle = (packId: string) => {
    const selectedPacks = settings.selectedPacks.includes(packId)
      ? settings.selectedPacks.filter(id => id !== packId)
      : [...settings.selectedPacks, packId];
    dispatch({ type: 'UPDATE_SETTINGS', payload: { selectedPacks } });
  };
  
  const handleAdultModeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    if (isEnabled && !settings.adultMode) {
      setShowAdultWarning(true);
    } else {
      dispatch({ type: 'UPDATE_SETTINGS', payload: { adultMode: false } });
    }
  };

  const confirmAdultMode = () => {
     dispatch({ type: 'UPDATE_SETTINGS', payload: { adultMode: true } });
     setShowAdultWarning(false);
  }
  
  const allPacks = [...CORE_PACKS, ...state.customPacks];

  return (
    <div className="space-y-6 text-gray-300 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <h3 className="font-bold text-lg text-[var(--color-secondary)] mb-2">Theme</h3>
        <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={() => dispatch({type: 'UPDATE_SETTINGS', payload: {theme: 'neon'}})} className={`w-full p-2 rounded-md font-bold transition-colors ${settings.theme === 'neon' ? 'bg-pink-600 text-white' : 'bg-black/20'}`}>Neon Arcade</button>
            <button onClick={() => dispatch({type: 'UPDATE_SETTINGS', payload: {theme: 'spooky'}})} className={`w-full p-2 rounded-md font-bold transition-colors ${settings.theme === 'spooky' ? 'bg-orange-600 text-white' : 'bg-black/20'}`}>Spooky</button>
        </div>
      </div>

      {state.settings.gameMode !== GameMode.HOT_SEAT && (
        <>
            <div>
              <h3 className="font-bold text-lg text-[var(--color-secondary)] mb-2">Dare Packs</h3>
              <div className="space-y-2">
                {allPacks.map(pack => (
                  <label key={pack.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-md cursor-pointer hover:bg-black/40 transition-colors border border-[var(--border-color)]">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      checked={settings.selectedPacks.includes(pack.id)}
                      onChange={() => handlePackToggle(pack.id)}
                      disabled={settings.selectedPacks.length === 1 && settings.selectedPacks.includes(pack.id)}
                    />
                    <div>
                      <span className="font-semibold">{pack.name}</span>
                      <p className="text-sm text-gray-400">{pack.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <CustomPackManager />
        </>
      )}

      <div>
        <h3 className="font-bold text-lg text-[var(--color-secondary)] mb-2">Game Rules</h3>
        <div className="bg-black/20 p-3 rounded-md border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">Forfeit Penalty</span>
                <p className="text-sm text-gray-400">Points lost for skipping a turn.</p>
              </div>
              <input type="number" min="0" max="5" value={settings.forfeitPenalty} onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { forfeitPenalty: parseInt(e.target.value) }})} className="w-20 bg-black/20 border border-[var(--border-color)] rounded-md px-2 py-1 text-white"/>
            </div>
             <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">Dare Timer</span>
                <p className="text-sm text-gray-400">Time limit per dare (in seconds).</p>
              </div>
              <input type="number" min="0" step="5" value={settings.timerDuration} onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { timerDuration: parseInt(e.target.value) }})} className="w-20 bg-black/20 border border-[var(--border-color)] rounded-md px-2 py-1 text-white"/>
            </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg text-red-500 mb-2">Content Settings</h3>
         <div className="bg-black/20 p-3 rounded-md border border-red-800/50">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-red-400">Adult Mode (18+)</span>
                <p className="text-sm text-gray-400">Enable spicy dares.</p>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={settings.adultMode}
                onChange={handleAdultModeToggle}
              />
            </label>
        </div>
      </div>
      
      {showAdultWarning && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
              <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg text-center max-w-sm animate-pop-in">
                  <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
                  <p className="mb-6">This content is intended for players 18 years of age or older. Please confirm all players are of legal age.</p>
                  <div className="flex gap-4 justify-center">
                      <button onClick={() => setShowAdultWarning(false)} className="bg-gray-600 px-6 py-2 rounded-md font-semibold">Cancel</button>
                      <button onClick={confirmAdultMode} className="bg-red-600 px-6 py-2 rounded-md font-semibold">I Confirm</button>
                  </div>
              </div>
          </div>
      )}

      <style>{`
        .toggle-checkbox {
          appearance: none;
          width: 40px;
          height: 24px;
          background-color: #374151;
          border-radius: 9999px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
          border: 1px solid var(--border-color);
        }
        .toggle-checkbox::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background-color: white;
          border-radius: 9999px;
          top: 2px;
          left: 3px;
          transition: transform 0.2s ease-in-out;
        }
        .toggle-checkbox:checked {
          background-color: var(--color-primary);
        }
        .toggle-checkbox:checked::before {
          transform: translateX(16px);
        }
      `}</style>
    </div>
  );
};

export default Settings;
