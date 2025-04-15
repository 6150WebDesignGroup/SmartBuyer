import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(`/api/products/category/${category}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-capitalize">{category} Products</h2>
      <div className="row">
        {products.map(product => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100">
              <img
                src={product.imageUrl}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Pagination Section (Only for UI Testing) */}
      <TempPagination />
    </div>
  );
};

// --- Temporary Pagination Test Code (for frontend layout testing only) ---
const TempPagination = () => {
  const [page, setPage] = useState(1);

  const productsPage1 = [
    { id: 1, name: 'Sample Product 1', price: '$19.99' },
    { id: 2, name: 'Sample Product 2', price: '$29.99' },
    { id: 3, name: 'Sample Product 3', price: '$39.99' }
  ];

  const productsPage2 = [
    { id: 4, name: 'Product 4', price: '$49.99' },
    { id: 5, name: 'Product 5', price: '$59.99' },
    { id: 6, name: 'Product 6', price: '$69.99' }
  ];

  const products = page === 1 ? productsPage1 : productsPage2;

  return (
    <div className="mt-5">
      <h4>🧪 Pagination Test Only</h4>
      <div className="row mt-3">
        {products.map(product => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="card p-3 shadow-sm">
              <h5>{product.name}</h5>
              <p>{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => setPage(2)}
          disabled={page === 2}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;