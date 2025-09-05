import React from 'react';

export const SettingsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v4M12 10v4M16 16v4"/>
  </svg>
);