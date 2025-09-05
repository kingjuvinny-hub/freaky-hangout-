import React from 'react';

export const AwardIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" transform="rotate(180 12 12)" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M10 16h4M12 21v-2M8 19.5c-1.5-1-2-3-2-5M16 19.5c1.5-1 2-3 2-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5A2.5 2.5 0 0114.5 9 2.5 2.5 0 0112 11.5 2.5 2.5 0 019.5 9 2.5 2.5 0 0112 6.5z" />
    </svg>
);