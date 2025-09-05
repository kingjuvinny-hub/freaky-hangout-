import React from 'react';

export const SkipIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 18V6l8.5 6L6 18zm6.5-6L13 6v12l8.5-6L13 12z"/>
    </svg>
);