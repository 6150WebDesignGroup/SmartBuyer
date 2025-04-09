import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const userId = '123'; // ⚠️ 实际项目中请替换为动态获取的当前用户 ID
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // 载入购物车数据
    useEffect(() => {
        axios.get(`/api/cart/${userId}`)
            .then(res => {
                setCartItems(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching cart:", err);
                setLoading(false);
            });
    }, []);

    // 修改数量
    const updateQuantity = (productId, delta) => {
        const item = cartItems.find(i => i.productId === productId);
        if (!item) return;

        const newQuantity = Math.max(1, item.quantity + delta);

        axios.put(`/api/cart/${userId}`, {
            productId,
            quantity: newQuantity
        }).then(() => {
            setCartItems(prev =>
                prev.map(i =>
                    i.productId === productId
                        ? { ...i, quantity: newQuantity, totalPrice: i.price * newQuantity }
                        : i
                )
            );
        }).catch(err => {
            console.error("Failed to update quantity:", err);
        });
    };

    // 删除商品
    const removeItem = (productId) => {
        axios.delete(`/api/cart/${userId}/${productId}`)
            .then(() => {
                setCartItems(prev => prev.filter(i => i.productId !== productId));
            })
            .catch(err => {
                console.error("Failed to delete item:", err);
            });
    };

    // 总价
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="container my-5">
            {/* 导航栏（保持之前的） */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 mb-4">
                <Link className="navbar-brand fs-4 fw-bold" to="/">🛒 SmartBuyer</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">🏠 Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/search">🔍 Search</Link></li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">📂 Categories</a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/category/clothing">Clothing</Link></li>
                                <li><Link className="dropdown-item" to="/category/electronics">Electronics</Link></li>
                                <li><Link className="dropdown-item" to="/category/books">Books</Link></li>
                            </ul>
                        </li>
                    </ul>
                    <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                        <input className="form-control me-2" type="search" placeholder="Search" />
                        <Link to="/search" className="btn btn-outline-light">Go</Link>
                    </form>
                </div>
            </nav>

            {/* 主体内容 */}
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border" role="status"></div>
                </div>
            ) : cartItems.length === 0 ? (
                <div className="text-center my-5">
                    <h4>Your cart is empty 🛒</h4>
                </div>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item.productId} className="d-flex flex-column flex-md-row align-items-start border rounded mb-3 p-3 gap-3">
                            {/* 商品信息 */}
                            <div className="position-relative flex-fill" style={{ minWidth: '250px' }}>
                                <div className="border p-2 rounded bg-light">
                                    <h6 className="fw-bold mb-1">{item.name}</h6>
                                    <p className="mb-1 text-muted">${item.price.toFixed(2)}</p>
                                    <p className="mb-0">Delivery: {item.deliveryTime}</p>
                                </div>
                                <button
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                    onClick={() => removeItem(item.productId)}
                                    style={{ transform: 'translate(50%, -50%)' }}
                                >
                                    🗑️
                                </button>
                            </div>

                            {/* 数量控制器 */}
                            <div className="d-flex align-items-center justify-content-center flex-nowrap gap-2">
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.productId, -1)}>▲</button>
                                <span className="fs-5">{item.quantity}</span>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.productId, 1)}>▼</button>
                            </div>

                            {/* 小计 */}
                            <div className="flex-grow-1 text-end fw-bold fs-5 mt-2 mt-md-0">
                                ${(item.quantity * item.price).toFixed(2)}
                            </div>
                        </div>
                    ))}

                    {/* 总价与按钮 */}
                    <div className="d-flex flex-column align-items-end mt-4">
                        <h5 className="me-1">Total: ${totalPrice.toFixed(2)}</h5>
                        <div className="d-flex flex-column flex-md-row gap-3 mt-2">
                            <Link to="/" className="btn btn-outline-primary">🛍️ Shop More</Link>
                            <button className="btn btn-success">✅ Place Order</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
