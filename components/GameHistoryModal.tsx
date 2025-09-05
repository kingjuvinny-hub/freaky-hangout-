import React from 'react';
import { useGame } from '../src/context/GameContext';
import Modal from './Modal';
import { CheckIcon } from './icons/CheckIcon';
import { SkipIcon } from './icons/SkipIcon';

const GameHistoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { state } = useGame();
  const { history } = state;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game History">
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {history.length > 0 ? (
          <ul className="space-y-3">
            {history.slice().reverse().map((turn, index) => (
              <li key={index} className="bg-black/20 p-3 rounded-md border border-[var(--border-color)]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 font-bold">
                      <span>{turn.player.avatar}</span>
                      <span>{turn.player.name}</span>
                    </div>
                    <p className="mt-1 text-gray-300">{turn.dare.text}</p>
                    {turn.isDoubleDown && <p className="text-xs font-bold text-yellow-400 mt-1">DOUBLE DOWN</p>}
                  </div>
                  {turn.completed ? (
                    <div className="flex-shrink-0 flex items-center gap-1 text-green-400" title="Completed">
                        <CheckIcon className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 flex items-center gap-1 text-red-400" title="Forfeited">
                        <SkipIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">No turns have been played yet.</p>
        )}
      </div>
    </Modal>
  );
};

export default GameHistoryModal;