'use client'
import { createContext, useContext, ReactNode, useState } from 'react';

interface AuthContextProps {
    token: string | null;
    setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

    return(
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
}