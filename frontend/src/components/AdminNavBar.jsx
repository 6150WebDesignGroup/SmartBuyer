import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNavBar.css'; 

const AdminNavBar = ({ handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4 py-2">
      <Link className="navbar-brand fw-bold text-primary" to="/admin/products">
        Admin Panel
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/admin/products">Product Management</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/refunds">Refund Requests</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-outline-danger">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavBar;
