import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import '../styles/auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    pwd: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const { email, pwd } = formData;

    // Email validation - using the same regex as backend
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Password validation
    if (!pwd) {
      newErrors.pwd = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setServerError('');
    
    try {
      const response = await loginUser(formData);
      console.log('登录成功，用户信息:', response);
      
      // 强制更新用户数据到localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // 添加一个小延迟，确保本地存储已更新
        setTimeout(() => {
          if (response.user.role === "Admin") {
            console.log('管理员登录成功，准备跳转');
            // 修改为产品管理页面路径
            window.location.href = '/admin/products';
          } else {
            // 普通用户跳转到首页
            window.location.href = '/';
          }
        }, 500);
      }
    } catch (error) {
      console.error('登录错误:', error);
      setServerError(error.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-logo">
          <img src="/logo.png" alt="SmartBuyer" />
        </div>
        
        <h1>Sign in</h1>
        
        {serverError && (
          <div className="auth-alert auth-alert-error">
            <div className="auth-alert-icon">!</div>
            <div className="auth-alert-message">
              <span>There was a problem</span>
              <p>{serverError}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="pwd">Password</label>
              <Link to="/forgot-password" className="forgot-password">Forgot your password?</Link>
            </div>
            <input 
              type="password" 
              id="pwd" 
              name="pwd" 
              value={formData.pwd}
              onChange={handleChange}
              className={errors.pwd ? 'error' : ''}
            />
            {errors.pwd && <p className="error-text">{errors.pwd}</p>}
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>New to SmartBuyer?</span>
        </div>
        
        <Link to="/register" className="auth-secondary-button">
          Create your SmartBuyer account
        </Link>
      </div>
      
      <div className="auth-footer">
        <div className="auth-footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <div className="auth-copyright">
          © 2025, SmartBuyer.com, Inc. or its affiliates
        </div>
      </div>
    </div>
  );
};

export default LoginPage;