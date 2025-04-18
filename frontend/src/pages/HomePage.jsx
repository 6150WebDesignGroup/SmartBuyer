import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';



const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState('price');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const { currentUser } = useAuth();
    const isLoggedIn = !!currentUser;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:5001/product/getAllAndSort',
                {
                    page,
                    limit: 6,
                    sortBy: sortType
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            const json = res.data;

            const data = json.productLists.map(p => ({
                _id: p._id,
                name: p.productName,
                category: p.categoryName,
                price: p.price,
                deliveryTime: p.deliveryTime || 'N/A',
                quantity: p.ProductQuantity,
                image: p.ProductImages?.[0] || '',
            }));

            setProducts(data);
            setTotalPages(json.pagination.pages);
        } catch (err) {
            console.error('Error fetching products (axios):', err);
        } finally {
            setLoading(false);
        }
    };

    const handelAddToCart = async (product) => {
        const user = await JSON.parse(localStorage.getItem("user"));
        console.log("LocalStorage user:", localStorage.getItem("user"));
        if (!user || !user.UserId) {
            alert("Please log in to add items to your cart.");
            return;
        }

        const payload = {
            userId: user.UserId,
            productId: product._id,
            quantity: 1
        };
        try {
            const res = await axios.post("http://localhost:5001/api/cart/addToCart", payload);

            if (res.status === 200) {
                alert("Product added to cart!");
            } else {
                alert("Failed to add: " + res.data.error);
            }
        } catch (error) {
            console.error("Axios error:", error);
            alert("Error adding to cart.");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [sortType, page]);

    const handlePageChange = (dir) => {
        if (dir === 'prev' && page > 1) setPage(page - 1);
        if (dir === 'next' && page < totalPages) setPage(page + 1);
    };
    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Welcome to Our Store</h2>
            {/* 排序选项 */}
            <div className="mb-4 d-flex justify-content-center align-items-center">
                <label className="me-2 fw-bold">Sort by:</label>
                <select
                    className="form-select w-auto"
                    value={sortType}
                    onChange={e => setSortType(e.target.value)}
                >
                    <option value="price">Price</option>
                    <option value="productName">Name</option>
                    <option value="deliveryTime">Delivery Time</option>
                </select>
            </div>

            {/* 加载中 */}
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status"></div>
                </div>
            ) : (
                <>
                    {/* 商品展示 */}
                    <div className="row">
                        {products.map(product => (
                            <div key={product._id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300'}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text text-muted">Category: {product.category}</p>
                                        <p className="card-text">Price: ${product.price}</p>
                                        <p className="card-text">Delivery: {product.deliveryTime}</p>
                                        <p className="card-text">Qty: {product.quantity}</p>

                                        <button
                                            className="btn mt-auto mb-2"
                                            style={{
                                                backgroundColor: isLoggedIn ? '#0d6efd' : '#adb5bd',
                                                color: isLoggedIn ? 'white' : 'black',
                                                cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                                            }}
                                            disabled={!isLoggedIn}
                                            onClick={() => handleAddToCart(product)} // 注意：拼写改对
                                        >
                                            Add to Cart
                                        </button>

                                        <button
                                            className="btn btn-outline-info"
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        >
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 分页按钮 */}
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <button
                            className="btn btn-outline-secondary me-2"
                            onClick={() => handlePageChange('prev')}
                            disabled={page === 1}
                        >
                            Prev
                        </button>
                        <span className="fw-bold mx-2">{page} / {totalPages}</span>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => handlePageChange('next')}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;
