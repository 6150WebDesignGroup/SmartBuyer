import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState('');

    const handleAddToCart = (productId) => {
        const userId = '123'; // ⚠️ 后期请替换
        axios.post(`/api/cart/${userId}`, { productId })
            .then(() => alert("✅ Added to cart!"))
            .catch(err => console.error("Add to cart failed:", err));
    };


    useEffect(() => {
        // getALL
        axios.get('/api/products')
            .then(res => {
                const mapped = res.data.map(p => ({
                    _id: p._id,
                    name: p.name,
                    category: p.categoryName,
                    price: p.price,
                    deliveryTime: '2025-04-15', // 等后端更新为动态数据
                    quantity: 100,              // 默认值
                    image: p.ProductImages[0] || '', // 取首图
                }));
                setProducts(mapped);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setLoading(false);
            });
    }, []);

    const sortProducts = (type) => {
        setSortType(type);
        const sorted = [...products];
        if (type === 'price') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (type === 'name') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (type === 'delivery') {
            sorted.sort((a, b) => new Date(a.deliveryTime) - new Date(b.deliveryTime));
        }
        setProducts(sorted);
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Welcome to Our Store</h2>

            {/* Sort selector */}
            <div className="mb-4 d-flex justify-content-center align-items-center">
                <label className="me-2 fw-bold">Sort by:</label>
                <select
                    className="form-select w-auto"
                    value={sortType}
                    onChange={(e) => sortProducts(e.target.value)}
                >
                    <option value="">-- Select --</option>
                    <option value="price">Price</option>
                    <option value="name">Product Name (Initial)</option>
                    <option value="delivery">Delivery Time</option>
                </select>
            </div>

            {/* Loading spinner or product list */}
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status"></div>
                </div>
            ) : (
                <div className="row">
                    {products.map(product => (
                        <div key={product._id} className="col-12 mb-4">
                            <div className="card h-100 flex-column flex-md-row">
                                {/* Image section */}
                                <div className="col-md-4 col-12">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="img-fluid w-100"
                                        style={{ objectFit: 'cover', height: '100%' }}
                                    />
                                </div>

                                {/* Content section */}
                                <div className="col-md-8 col-12 p-3 d-flex flex-column">
                                    <h5 className="fw-bold">{product.name}</h5>
                                    <p className="text-muted mb-1">Category: {product.category}</p>
                                    <p className="mb-1">${product.price.toFixed(2)}</p>
                                    <p className="mb-1">Delivery Date: {product.deliveryTime}</p>
                                    <p className="mb-3">Quantity: {product.quantity}</p>

                                    <div className="mt-auto d-flex flex-wrap gap-2">
                                        <button className="btn btn-primary" onClick={() => handleAddToCart(product._id)}>
                                            Add to Cart
                                        </button>

                                        <Link to={`/product/${product._id}`}>
                                            <button className="btn btn-outline-secondary">Learn More</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
