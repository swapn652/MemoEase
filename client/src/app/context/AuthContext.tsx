'use client'
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { setCookie, parseCookies } from 'nookies'; // Install 'nookies' using npm or yarn

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialToken = parseCookies().token || null;
  const [token, setToken] = useState<string | null>(initialToken);

  useEffect(() => {
    // Update the cookie whenever the token changes
    setCookie(null, 'token', token || '', {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};