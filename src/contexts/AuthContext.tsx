// src/contexts/AuthContext.tsx - UPDATED VERSION

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'company_admin' | 'hr_manager' | 'manager' | 'team_lead' | 'employee' | 'hr'; // ✅ ADDED 'hr'

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  designation?: string;
  status?: 'active' | 'inactive';
  company_id?: string;
  company_name?: string;
  full_name?: string;
  personal_email?: string;
  temp_password?: boolean;
  company_setup_completed?: boolean;  // ✅ ADD THIS
  profile_completed?: boolean;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUserData: (userData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('refresh_token')
  );
  const [loading, setLoading] = useState(true); // Start as loading

  // On mount, check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('access_token');
    
    console.log('🔍 AuthContext: Checking stored credentials...');
    console.log('Stored user:', storedUser);
    console.log('Stored token:', storedAccessToken ? 'EXISTS' : 'NONE');
    
    if (storedUser && storedAccessToken) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('✅ User loaded from localStorage:', userData);
        console.log('🔑 Temp password:', userData.temp_password);
        setUser(userData);
        setAccessToken(storedAccessToken);
      } catch (error) {
        console.error('❌ Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } else {
      console.log('ℹ️ No stored credentials found');
    }
    
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string, role: UserRole) => {
      setLoading(true);
      try {
        // Backend call is handled in Login.tsx
        // This function is called after successful login
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        if (storedUser && storedAccessToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
        }
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    console.log('🚪 Logging out...');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  }, [user]);

  const updateUserData = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ User data updated:', updatedUser);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!accessToken,
    accessToken,
    refreshToken,
    login,
    logout,
    switchRole,
    updateUserData,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
