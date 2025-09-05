import React from 'react';

export const CrownIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.338 10.125l1.522-6.086a1 1 0 01.963-.739h8.354a1 1 0 01.962.739l1.523 6.086M12 21v-8.25M8.25 21V12M15.75 21V12M3 10.125h18" />
    </svg>
);
