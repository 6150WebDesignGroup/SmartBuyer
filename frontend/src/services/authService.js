import axios from 'axios';

const API_URL = '/api/user';

// 只添加了这个辅助函数，确保彻底清除所有状态
const clearAuthStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('isLoggedIn');
  sessionStorage.clear();
  
  // 清除可能的认证相关cookie
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/RegUser`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

export const loginUser = async (credentials) => {
  try {
    // 先彻底清除所有旧数据
    clearAuthStorage();
    
    const response = await axios.post(`${API_URL}/Login`, credentials);
    console.log('API登录响应:', response.data);
    
    // 只使用 sessionStorage，不使用 localStorage
    if (response.data.user) {
      const userData = JSON.stringify(response.data.user);
      sessionStorage.setItem('user', userData);
      sessionStorage.setItem('isLoggedIn', 'true');
      
      if (response.data.user.role === 'Admin') {
        sessionStorage.setItem('adminAuth', 'true');
      }
    }
    
    window.dispatchEvent(new Event('storage'));
    
    return response.data;
  } catch (error) {
    console.error('登录API错误:', error);
    throw error.response?.data || { error: "Login failed" };
  }
};

export const logoutUser = async () => {
    try {
      // 清除所有存储，包括管理员标记
      clearAuthStorage();
      
      const response = await axios.post(`${API_URL}/logout`);
      
      // 增加延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 触发存储事件，确保其他组件能够感知到变化
      window.dispatchEvent(new Event('storage'));
      
      return response.data;
    } catch (error) {
      // 即使API调用失败也清除本地存储
      clearAuthStorage();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 触发存储事件，确保其他组件能够感知到变化
      window.dispatchEvent(new Event('storage'));
      
      throw error.response?.data || { error: "Logout failed" };
    }
  };

export const editUserProfile = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/editUser`, userData);
    // Update stored user data if edit is successful
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // 触发存储事件，确保其他组件能够感知到变化
      window.dispatchEvent(new Event('storage'));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Profile update failed" };
  }
};

export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('解析用户数据错误', error);
      return null;
    }
  }
  return null;
};

// 添加一个函数来检查是否是管理员
export const isAdminUser = () => {
  const user = getCurrentUser();
  return user && user.role === 'Admin';
};

// Set up axios to include credentials (cookies) with requests
axios.defaults.withCredentials = true;