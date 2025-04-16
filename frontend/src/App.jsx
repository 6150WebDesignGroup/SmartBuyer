import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import RefundPage from './pages/RefundPage';
import UserProfile from './pages/UserProfile';
import ProductDetailPage from './pages/ProductDetailPage';

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand d-flex align-items-center me-4" to="/">
              <img src="/logo.png" alt="Logo" height="40" className="me-2" />
              <span className="fw-bold fs-5">SmartBuyer</span>
            </Link>
            <ul className="navbar-nav flex-row gap-3">
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/search">Search</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-dark" href="#" id="categoryDropdown" role="button" data-bs-toggle="dropdown">
                  Categories
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/category/clothing">Clothing</Link></li>
                  <li><Link className="dropdown-item" to="/category/electronics">Electronics</Link></li>
                  <li><Link className="dropdown-item" to="/category/books">Books</Link></li>
                </ul>
              </li>
            </ul>
          </div>
          <ul className="navbar-nav flex-row gap-3">
            <li className="nav-item">
              <Link to="/cart" className="nav-link fs-4 text-primary" title="Cart">
                🛍️
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link fs-4 text-primary" title="Profile">
                👤
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:category" element={<CategoryPageWrapper />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/refunds" element={<RefundPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />

      </Routes>
    </Router>
  );
};

const CategoryPageWrapper = () => {
  const { category } = useParams();
  return <CategoryPage category={category} />;
};

export default App;
