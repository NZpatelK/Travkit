'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

interface RefreshContextType {
    refreshFlag: boolean;
    triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const useRefresh = (): RefreshContextType => {
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error("useRefresh must be used within a RefreshProvider");
    }
    return context;
};

interface RefreshProviderProps {
    children: ReactNode;
}

export const RefreshProvider: React.FC<RefreshProviderProps> = ({ children }) => {
    const [refreshFlag, setRefreshFlag] = useState(false);

    const triggerRefresh = () => { 
        setRefreshFlag(prev => !prev) 
        console.log("Refresh triggered");
    };

    return (
        <RefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};
