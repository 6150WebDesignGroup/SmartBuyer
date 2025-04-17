import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import RefundPage from './pages/RefundPage';
import UserProfile from './pages/UserProfile';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductManagementPage from './pages/ProductManagementPage';
import AuthLayout from './components/AuthLayout';
import DefaultLayout from './components/DefaultLayout';
import { AuthProvider } from './AuthContext';
import { getCurrentUser, logoutUser } from './services/authService';
import './styles/auth.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0); // 可以从后端获取或从本地存储获取

  // 检查用户登录状态
  useEffect(() => {
    const checkUserStatus = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    };

    // 初始化时检查
    checkUserStatus();

    // 添加事件监听器处理存储变化
    const handleStorageChange = () => {
      checkUserStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:statusChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:statusChange', handleStorageChange);
    };
  }, []);

  // 处理登出
  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);

      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    } catch (error) {
      console.error('Logout error:', error);
      setCurrentUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthProvider>
      <Router>


        {/* ROUTES */}
        <Routes>
          {/* 公共页面 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />

          {/* 认证页面 */}
          <Route path="/login" element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          } />
          <Route path="/register" element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          } />

          {/* 需要登录的页面 */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/refunds" element={<RefundPage />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* 管理员页面 */}
          <Route path="/admin/products" element={<ProductManagementPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;