"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LeaderboardContext = createContext({
    showLeaderboard: false,
    toggleLeaderboard: () => { },
});

export const LeaderboardProvider = ({ children }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load setting from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('showLeaderboard');
            if (saved !== null) {
                setShowLeaderboard(saved === 'true');
            }
            setIsInitialized(true);
        }
    }, []);

    // Save setting to localStorage when changed
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            localStorage.setItem('showLeaderboard', String(showLeaderboard));
        }
    }, [showLeaderboard, isInitialized]);

    const toggleLeaderboard = () => {
        setShowLeaderboard(prev => !prev);
    };

    return (
        <LeaderboardContext.Provider value={{ showLeaderboard, toggleLeaderboard }}>
            {children}
        </LeaderboardContext.Provider>
    );
};

export const useLeaderboard = () => {
    const context = useContext(LeaderboardContext);
    if (!context) {
        throw new Error('useLeaderboard must be used within a LeaderboardProvider');
    }
    return context;
};

export default LeaderboardContext;
