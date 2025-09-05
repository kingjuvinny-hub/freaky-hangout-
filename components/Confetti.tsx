import React from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    className="absolute w-2 h-4"
    style={{ ...style, willChange: 'transform, opacity' }}
  />
);

const CONFETTI_COUNT = 100;

const Confetti: React.FC = () => {
  const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, index) => {
    const colors = ['#ec4899', '#f59e0b', '#84cc16', '#3b82f6', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomDelay = Math.random() * 2;
    const randomDuration = 2 + Math.random() * 3;
    const randomRotation = Math.random() * 360;
    const randomScale = 0.5 + Math.random();

    const style: React.CSSProperties = {
      left: `${randomX}vw`,
      top: `-20px`,
      backgroundColor: randomColor,
      transform: `rotate(${randomRotation}deg) scale(${randomScale})`,
      animation: `fall ${randomDuration}s linear ${randomDelay}s forwards`,
    };

    return <ConfettiPiece key={index} style={style} />;
  });

  return (
    <>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-50">{confetti}</div>
    </>
  );
};

export default Confetti;