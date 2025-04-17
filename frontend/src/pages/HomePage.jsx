import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from "../components/userNavbar";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState('price');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
                name: p.name,
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

    // add product to cart
    const handelAddToCart = async (product) => {
        const user = await JSON.parse(localStorage.getItem("user"));
        console.log("LocalStorage user:", localStorage.getItem("user"));
        if (!user || ! user.UserId) {
            alert("Please log in to add items to your cart.");
            return;
        }

        const payload = {
            userId: user.UserId,
            productId: product._id,
            quantity: 1
        };
        try {
            const res = await axios.post("http://localhost:5001/api/cart/addToCart", {
                userId: user.UserId,
                productId: product._id,
                quantity: 1
            });

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
        <di>
            <UserNavbar />
            <div className="container my-5">
                <h2 className="mb-4 text-center">Welcome to Our Store</h2>

                <div className="mb-4 d-flex justify-content-center align-items-center">
                    <label className="me-2 fw-bold">Sort by:</label>
                    <select className="form-select w-auto" value={sortType} onChange={e => setSortType(e.target.value)}>
                        <option value="price">Price</option>
                        <option value="name">Name</option>
                        <option value="time">Delivery Time</option>
                    </select>
                </div>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                ) : (
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
                                        <button className="btn btn-primary mt-auto" onClick={() => handelAddToCart(product)}>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-center align-items-center mt-4">
                    <button className="btn btn-outline-secondary me-2" onClick={() => handlePageChange('prev')} disabled={page === 1}>
                        Prev
                    </button>
                    <span className="fw-bold mx-2">{page} / {totalPages}</span>
                    <button className="btn btn-outline-secondary" onClick={() => handlePageChange('next')} disabled={page === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </di>
    );
};

export default HomePage;
