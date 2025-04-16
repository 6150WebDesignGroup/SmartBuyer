import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import RefundPage from './pages/RefundPage';
import UserProfile from './pages/UserProfile';

const App = () => {
  // TODO: Replace this with dynamic user info fetched from backend/session
  const user = {
    firstName: "Qiyao"
  };

  // TODO: Replace with cart item count from backend or context
  const cartItemCount = 1;

  return (
    <Router>
      {/* NAVBAR */}
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
                  <li><Link className="dropdown-item" to="/category/electronics">Electronics</Link></li>
                  <li><Link className="dropdown-item" to="/category/clothing">Clothing</Link></li>
                  <li><Link className="dropdown-item" to="/category/books">Books</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/search">Search</Link>
              </li>
            </ul>
          </div>

          {/* RIGHT SECTION: User menu + Cart */}
          <div className="d-flex align-items-center gap-4">

            {/* ACCOUNT DROPDOWN */}
            <div className="dropdown">
              <span className="nav-link dropdown-toggle" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Hello, {user.firstName} / Account
              </span>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  {/* TODO: Wire this to logout logic */}
                  <button className="dropdown-item">Logout</button>
                </li>
              </ul>
            </div>

            {/* RETURNS & ORDERS */}
            <div>
              <Link className="nav-link" to="/orders">Returns & Orders</Link>
            </div>

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
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/refunds" element={<RefundPage />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;