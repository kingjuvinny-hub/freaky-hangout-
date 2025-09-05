import React, { useState, useRef, useEffect } from 'react';

const AVATARS = [
  '😀', '😎', '😂', '🥳', '🤯', '😈', '👻', '👽', '🤖', '👑', '🦄', '🍕',
  '🐙', '🍔', '😂', '🔥', '💀', '🤡', '🐸', '🦊', '🐼', '🐲', '🧙', '🧑‍🚀'
];

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatar, onSelectAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (avatar: string) => {
    onSelectAvatar(avatar);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/20 border-2 border-[var(--color-accent)] rounded-md p-2 text-3xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {selectedAvatar}
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-64 bg-gray-900/80 backdrop-blur-md border border-[var(--color-accent)] rounded-lg shadow-lg p-2 grid grid-cols-6 gap-2 z-10 animate-pop-in">
          {AVATARS.map(avatar => (
            <button
              key={avatar}
              type="button"
              onClick={() => handleSelect(avatar)}
              className="text-3xl p-1 rounded-md hover:bg-black/40 transition-colors"
            >
              {avatar}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarPicker;