import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser, editUserProfile } from './services/authService';

// Create context
const AuthContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in when the app loads
    const checkUserStatus = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };
    
    // 初始检查
    checkUserStatus();
    
    // 监听存储变化
    const handleStorageChange = () => {
      checkUserStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 添加一个自定义事件监听器，用于在同一页面内触发状态更新
    window.addEventListener('auth:statusChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:statusChange', handleStorageChange);
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await loginUser(credentials);
      setCurrentUser(response.user);
      
      // 触发自定义事件来更新状态
      window.dispatchEvent(new Event('auth:statusChange'));
      
      return response;
    } catch (err) {
      setError(err.error || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await registerUser(userData);
      
      // 如果注册后自动登录，更新用户状态
      if (response.user) {
        setCurrentUser(response.user);
        window.dispatchEvent(new Event('auth:statusChange'));
      }
      
      return response;
    } catch (err) {
      setError(err.error || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      
      // 触发自定义事件来更新状态
      window.dispatchEvent(new Event('auth:statusChange'));
    } catch (err) {
      setError(err.error || 'Logout failed');
      
      // 即使失败也清除状态
      setCurrentUser(null);
      window.dispatchEvent(new Event('auth:statusChange'));
      
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await editUserProfile(userData);
      setCurrentUser(response.user);
      
      // 触发自定义事件来更新状态
      window.dispatchEvent(new Event('auth:statusChange'));
      
      return response;
    } catch (err) {
      setError(err.error || 'Profile update failed');
      throw err;
    }
  };

  // 提供检查是否是管理员的函数
  const isAdmin = () => {
    return currentUser && currentUser.role === 'Admin';
  };

  // Provide the context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;