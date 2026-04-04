import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bk_token');
    const savedUser = localStorage.getItem('bk_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('bk_token', data.token);
    localStorage.setItem('bk_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}! 👑`);
    return data.user;
  };

  const signup = async (formData) => {
    const { data } = await authAPI.signup(formData);
    localStorage.setItem('bk_token', data.token);
    localStorage.setItem('bk_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome to BK Crown, ${data.user.name}! 🍔`);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('bk_token');
    localStorage.removeItem('bk_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    try {
      const { data } = await authAPI.me();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('bk_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
