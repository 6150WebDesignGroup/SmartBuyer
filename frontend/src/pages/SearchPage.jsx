import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  useEffect(() => {
    const result = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, products]);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Search Products</h2>
      <div className="mb-4 text-center">
        <input
          type="text"
          className="form-control"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px', margin: '0 auto' }}
        />
      </div>
      <div className="row">
        {filtered.map(product => (
          <div key={product._id} className="col-md-4 col-sm-6 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
