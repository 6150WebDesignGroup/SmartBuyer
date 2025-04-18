import React from 'react';

const ProductCard = ({ product, onAddToCart, onLearnMore }) => {
    return (
        <div className="card h-100 d-flex flex-column justify-content-between">
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Category: {product.category}</p>
                <p className="card-text">Price: ${product.price}</p>
                <p className="card-text">Delivery: {product.deliveryTime}</p>
                <p className="card-text">Qty: {product.stock}</p>
            </div>
            <div className="card-footer bg-transparent border-top-0 d-flex gap-2">
                <button className="btn btn-primary flex-fill" onClick={onAddToCart}>
                    Add to Cart
                </button>
                <button className="btn btn-outline-secondary flex-fill" onClick={onLearnMore}>
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
