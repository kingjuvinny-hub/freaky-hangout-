import React from 'react';

export const TrophyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a3 3 0 116 0 3 3 0 01-6 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
