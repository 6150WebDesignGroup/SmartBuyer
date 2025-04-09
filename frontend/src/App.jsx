import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';

const App = () => {
  return (
    <Router>
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

          <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <Link to="/search" className="btn btn-outline-light">Go</Link>
          </form>
        </div>
      </nav>

      {/* Page routing */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:category" element={<CategoryPageWrapper />} />
      </Routes>
    </Router>
  );
};

// Wrapper for category route
const CategoryPageWrapper = () => {
  const { category } = useParams();
  return <CategoryPage category={category} />;
};

export default App;
