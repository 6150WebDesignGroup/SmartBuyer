import React, { useState } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchResults = async (pageNumber = 1) => {
    try {
      const response = await axios.post('http://localhost:5001/product/searchProduct', {
        keyword: query,
        page: pageNumber,
        limit: 6
      });

      setResults(response.data.productLists || []);
      setTotalPages(response.data.pagination.pages || 1);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearch = () => {
    setPage(1); // 每次搜索都从第一页开始
    fetchResults(1);
  };


  const handleNextPage = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchResults(prevPage);
    }
  };

  return (
      <div className="container mt-4">
        <h2>Search Products</h2>

        {/* Search Bar */}
        <div className="input-group mb-3">
          <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Go
          </button>
        </div>


        {/* Search Results */}
        <div className="row">
          {results.length === 0 ? (
              <p>No products found.</p>
          ) : (
              results.map(product => (
                  <div className="col-md-4 mb-4" key={product._id}>
                    <div className="card h-100">
                      <img
                          src={product.ProductImages?.[0] || 'default.jpg'}
                          className="card-img-top"
                          alt={product.name}
                          style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">${product.price}</p>
                      </div>
                    </div>
                  </div>
              ))
          )}
        </div>

        {/* Pagination */}
        {results.length > 0 && (
            <div className="d-flex justify-content-between my-4">
              <button
                  className="btn btn-outline-secondary"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                  className="btn btn-outline-primary"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
              >
                Next
              </button>
            </div>
        )}
      </div>
  );
};

export default SearchPage;
