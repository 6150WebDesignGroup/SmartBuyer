import React from 'react';
import { Link } from 'react-router-dom';

const UserNavbar = ({ currentUser, handleLogout, cartItemCount }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* LEFT SECTION: Logo + Nav */}
                <div className="d-flex align-items-center">
                    <Link to="/" className="navbar-brand d-flex align-items-center me-4">
                        <img src="/logo.png" alt="Logo" height="40" className="me-2" />
                        <span className="fw-bold fs-5">SmartBuyer</span>
                    </Link>

                    <ul className="navbar-nav flex-row gap-3">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item dropdown">
                            <span className="nav-link dropdown-toggle" id="categoryDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Categories</span>
                            <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                                <li><Link className="dropdown-item" to="/category/books?categoryId=3">Books</Link></li>
                                <li><Link className="dropdown-item" to="/category/clothing?categoryId=2">Clothing</Link></li>
                                <li><Link className="dropdown-item" to="/category/electronics?categoryId=1">Electronics</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item"><Link className="nav-link" to="/search">Search</Link></li>
                    </ul>
                </div>

                {/* RIGHT SECTION */}
                <div className="d-flex align-items-center gap-4">
                    {currentUser ? (
                        <div className="dropdown">
              <span className="nav-link dropdown-toggle" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Hello, {currentUser.name} / Account
              </span>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-link">Sign In</Link>
                    )}
                    {currentUser && <Link className="nav-link" to="/orders">Returns & Orders</Link>}
                    <div className="position-relative">
                        <Link to="/cart" className="nav-link d-flex align-items-center">
                            <i className="bi bi-cart4 fs-4 text-dark"></i>
                            {cartItemCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      style={{ fontSize: '0.7rem', padding: '4px 6px', minWidth: '20px' }}>
                  {cartItemCount}
                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;
