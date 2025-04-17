import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';


// Mapping from category name (from URL) to categoryId (used in backend)
const categoryNameToId = {
  electronic: 1,
  clothes: 2,
  books: 3,
};

const PRODUCTS_PER_PAGE = 6;

const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const { category } = useParams(); // Gets 'books' from /category/books
  const categoryId = Number(searchParams.get("categoryId"));
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        // ===== BACKEND API INTEGRATION POINT =====
        // API: POST /api/product/byCategory
        // Body: { categoryId, page }
        //categoryId =1;
        const res = await axios.post('http://localhost:5001/product/byCategory', {
          categoryId,
          page,
        });
        setProducts(res.data.products || []);
        setHasMore((res.data.products || []).length === PRODUCTS_PER_PAGE);
      } catch (err) {
        console.error('Error fetching category products:', err);
      }
    };

    fetchProductsByCategory();
  }, [categoryId, page]);

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-capitalize">{category} Products</h2>

      <div className="row">
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="card h-100 shadow-sm">
                {product.ProductImages?.[0] && (
                  <img
                    src={`http://localhost:5001/${product.ProductImages[0]}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.cardDesc}</p>
                  <p className="card-text">
                    <strong>Price:</strong> ${product.price}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {products.length > 0 && (
        <div className="d-flex justify-content-between my-4">
          <button
            onClick={handlePrevious}
            className="btn btn-outline-secondary"
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={handleNext}
            className="btn btn-outline-primary"
            disabled={!hasMore}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;