import React from 'react';

export const RestartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 3a1 1 0 011 1v2.268A9.95 9.95 0 0112 22C6.477 22 2 17.523 2 12S6.477 2 12 2c2.895 0 5.546.99 7.583 2.617L18 6M9 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6" />
    </svg>
);