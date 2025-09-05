import { useCallback } from 'react';

// This is a placeholder for a real audio implementation.
// In a real app, you would use a library like Howler.js or the Web Audio API.

const playSound = (type: string) => {
  // console.log(`Playing sound: ${type}`);
  // In a real implementation:
  // const audio = new Audio(`/sounds/${type}.mp3`);
  // audio.play();
};

export const useSounds = () => {
  const playCompleteSound = useCallback(() => {
    playSound('complete');
  }, []);

  const playForfeitSound = useCallback(() => {
    playSound('forfeit');
  }, []);

  const playWinSound = useCallback(() => {
    playSound('win');
  }, []);

  const playTickSound = useCallback(() => {
    playSound('tick');
  }, []);

  return { playCompleteSound, playForfeitSound, playWinSound, playTickSound };
};