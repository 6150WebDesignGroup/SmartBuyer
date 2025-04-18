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
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">

            {/* LEFT SECTION: Logo + Nav */}
            <div className="d-flex align-items-center">
                <Link to="/" className="navbar-brand d-flex align-items-center me-4">
                    <img src="/logo.png" alt="Logo" height="40" className="me-2" />
                    <span className="fw-bold fs-5">SmartBuyer</span>
                </Link>

                {/* Main nav */}
                <ul className="navbar-nav flex-row gap-3">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>

                    <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle" id="categoryDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Categories
                  </span>
                        <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                            {/* TODO: Replace these with categories from backend */}
                            <li><Link className="dropdown-item" to="/category/books?categoryId=3">Books</Link></li>
                            <li><Link className="dropdown-item" to="/category/clothing?categoryId=2">Clothing</Link></li>
                            <li><Link className="dropdown-item" to="/category/electronics?categoryId=1">Electronics</Link></li>
                        </ul>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/search">Search</Link>
                    </li>
                </ul>
            </div>

            {/* RIGHT SECTION: User menu + Cart */}
            <div className="d-flex align-items-center gap-4">

                {/* ACCOUNT DROPDOWN - 根据登录状态显示不同内容 */}
                {currentUser ? (
                    <div className="dropdown">
                  <span className="nav-link dropdown-toggle" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Hello, {currentUser.name} / Account
                  </span>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                            {/* 只保留Logout选项 */}
                            <li>
                                <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" className="nav-link">Sign In</Link>
                    </div>
                )}

                {/* RETURNS & ORDERS - 仅登录用户可见 */}
                {currentUser && (
                    <div>
                        <Link className="nav-link" to="/orders">Returns & Orders</Link>
                    </div>
                )}

                {/* CART */}
                <div className="position-relative">
                    <Link to="/cart" className="nav-link d-flex align-items-center">
                        <i className="bi bi-cart4 fs-4 text-dark"></i>
                        {cartItemCount > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: '0.7rem', padding: '4px 6px', minWidth: '20px' }}
                            >
                      {cartItemCount}
                    </span>
                        )}
                    </Link>
                </div>

            </div>
        </div>
    </nav>
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