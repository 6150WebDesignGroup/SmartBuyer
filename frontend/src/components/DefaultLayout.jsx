import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const DefaultLayout = ({ children }) => {
  const { currentUser, loading, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // 将重定向目标从主页改为登录页
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Fancy dark navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand fs-4 fw-bold" to="/">🛒 SmartBuyer</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">🏠 Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">🔍 Search</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="categoryDropdown" role="button" data-bs-toggle="dropdown">
                📂 Categories
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/category/clothing">Clothing</Link></li>
                <li><Link className="dropdown-item" to="/category/electronics">Electronics</Link></li>
                <li><Link className="dropdown-item" to="/category/books">Books</Link></li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <form className="d-flex me-3" role="search" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <Link to="/search" className="btn btn-outline-light">Go</Link>
            </form>
            
            {!loading && currentUser && (
              <>
                {currentUser.role === "Admin" ? (
                  <div className="dropdown">
                    <button className="btn btn-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      Hello, Admin
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li><button className="dropdown-item" onClick={handleLogout}>Sign Out</button></li>
                    </ul>
                  </div>
                ) : (
                  <div className="dropdown">
                    <button className="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      Hello, {currentUser.name}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li><Link className="dropdown-item" to="/profile">Your Profile</Link></li>
                      <li><Link className="dropdown-item" to="/orders">Your Orders</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={handleLogout}>Sign Out</button></li>
                    </ul>
                  </div>
                )}
              </>
            )}
            
            {!loading && !currentUser && (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline-light me-2">Sign In</Link>
                <Link to="/register" className="btn btn-warning">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main>
        {children}
      </main>
    </>
  );
};

export default DefaultLayout;