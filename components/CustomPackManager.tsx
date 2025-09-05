import React, { useState } from 'react';
import { useGame } from '../src/context/GameContext';
import { CustomDarePack } from '../src/types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import Modal from './Modal';

const CustomPackManager: React.FC = () => {
  const { state, dispatch } = useGame();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packName, setPackName] = useState('');
  const [packDescription, setPackDescription] = useState('');
  const [dares, setDares] = useState('');

  const handleSavePack = () => {
    if (!packName.trim() || !dares.trim()) return;
    const newPack: CustomDarePack = {
      id: `custom_${Date.now()}`,
      name: packName.trim(),
      description: packDescription.trim(),
      dares: dares.split('\n').map(d => d.trim()).filter(Boolean).map(text => ({ text, type: 'text', difficulty: 2 })),
      isCustom: true,
    };
    dispatch({ type: 'SAVE_CUSTOM_PACK', payload: newPack });
    setIsModalOpen(false);
    setPackName('');
    setPackDescription('');
    setDares('');
  };
  
  const handleDeletePack = (id: string) => {
    // Also remove it from selected packs if it's selected
    const newSelectedPacks = state.settings.selectedPacks.filter(packId => packId !== id);
    dispatch({ type: 'UPDATE_SETTINGS', payload: { selectedPacks: newSelectedPacks }});
    dispatch({ type: 'DELETE_CUSTOM_PACK', payload: { id } });
  }

  return (
    <div>
      <h3 className="font-bold text-lg text-[var(--color-secondary)] mb-2">My Dare Packs</h3>
      <div className="space-y-2">
         {state.customPacks.map(pack => (
          <div key={pack.id} className="flex items-center justify-between bg-black/20 p-3 rounded-md border border-[var(--border-color)]">
              <div>
                <span className="font-semibold">{pack.name}</span>
                <p className="text-sm text-gray-400">{pack.dares.length} dares</p>
              </div>
              <button onClick={() => handleDeletePack(pack.id)} className="text-[var(--color-primary)] hover:text-opacity-80 p-1">
                <TrashIcon />
              </button>
          </div>
        ))}
        <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 p-3 bg-black/20 rounded-md border border-dashed border-[var(--border-color)] hover:bg-black/40 transition-colors">
          <PlusIcon /> Create New Pack
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Custom Dare Pack">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Pack Name"
            value={packName}
            onChange={(e) => setPackName(e.target.value)}
            className="w-full bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={packDescription}
            onChange={(e) => setPackDescription(e.target.value)}
             className="w-full bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <textarea
            placeholder="Enter one dare per line..."
            value={dares}
            onChange={(e) => setDares(e.target.value)}
            rows={5}
             className="w-full bg-black/20 border-2 border-[var(--color-accent)] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button onClick={handleSavePack} className="w-full bg-[var(--color-primary)] text-white font-bold py-2 rounded-md hover:scale-105 transition-transform">
            Save Pack
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomPackManager;