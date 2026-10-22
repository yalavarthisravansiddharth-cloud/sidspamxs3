import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types.ts';
import {
  apiGetCurrentUser,
  apiLogin,
  apiRegister,
  apiLogout,
  apiUpdateProfile,
  apiUpdatePassword
} from '../api.ts';
import { useToast } from './ToastContext.tsx';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  quickLogin: (role: 'USER' | 'ADMIN') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  updatePassword: (currentPass: string, newPass: string) => Promise<void>;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup';
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const { showToast } = useToast();

  useEffect(() => {
    async function initUser() {
      try {
        const u = await apiGetCurrentUser();
        setUser(u);
      } catch (err) {
        console.error('Failed fetching current user:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await apiLogin({ email, password: pass });
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${res.user.display_name}!`, 'success', 'Authenticated');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error', 'Authentication Error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await apiRegister({ displayName: name, email, password: pass });
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast(`Account created! Welcome, ${res.user.display_name}!`, 'success', 'Registration Successful');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error', 'Registration Error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: 'USER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      await login('admin@spamshield.org', 'AdminShield2026!');
    } else {
      await login('user@spamshield.org', 'CyberShield2026!');
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      showToast('You have been logged out securely.', 'info', 'Logged Out');
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
    }
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      const updated = await apiUpdateProfile({ displayName: name, email });
      setUser(updated);
      showToast('Profile updated successfully', 'success', 'Profile Updated');
    } catch (err: any) {
      showToast(err.message || 'Failed updating profile', 'error', 'Update Error');
      throw err;
    }
  };

  const updatePassword = async (currentPass: string, newPass: string) => {
    try {
      await apiUpdatePassword({ currentPassword: currentPass, newPassword: newPass });
      showToast('Password changed successfully', 'success', 'Security Updated');
    } catch (err: any) {
      showToast(err.message || 'Failed changing password', 'error', 'Password Error');
      throw err;
    }
  };

  const openAuthModal = useCallback((tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        quickLogin,
        logout,
        updateProfile,
        updatePassword,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
