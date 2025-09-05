import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useGame } from '../src/context/GameContext';

const Toast: React.FC = () => {
  const { state, dispatch } = useGame();
  const { toasts } = state;
  const toastContainer = document.getElementById('toast-container');

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: { id: toasts[0].id } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  if (!toastContainer) return null;

  return ReactDOM.createPortal(
    <>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-lg animate-slide-up mb-2 border border-green-400"
        >
          {toast.message}
        </div>
      ))}
    </>,
    toastContainer
  );
};

export default Toast;