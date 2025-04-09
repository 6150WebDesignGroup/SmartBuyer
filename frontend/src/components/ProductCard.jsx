import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="card h-100">
      <img
        src={product.image || 'https://via.placeholder.com/150'}
        className="card-img-top"
        alt={product.name}
        style={{ objectFit: 'cover', height: '200px' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted">${product.price.toFixed(2)}</p>
        <p className="card-text">{product.description?.slice(0, 60)}...</p>
        <button className="btn btn-primary mt-auto">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
