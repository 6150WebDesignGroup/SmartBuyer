import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);

    const handleAddToCart = () => {
        const userId = '123'; // ⚠️ 后期请改为真实登录用户 ID
        axios.post(`/api/cart/${userId}`, { productId: product._id })
            .then(() => alert('Added to cart!'))
            .catch(err => console.error("Add to cart failed:", err));
    };

    useEffect(() => {
        // 获取当前商品信息
        axios.get(`/api/products/${productId}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error("Failed to load product", err));

        // 获取所有商品用于切换
        axios.get('/api/products')
            .then(res => setAllProducts(res.data))
            .catch(err => console.error("Failed to fetch product list", err));
    }, [productId]);

    const switchRandomProduct = () => {
        if (allProducts.length === 0) return;
        const random = allProducts[Math.floor(Math.random() * allProducts.length)];
        navigate(`/product/${random._id}`);
    };

    if (!product) {
        return <div className="text-center my-5">Loading...</div>;
    }

    return (
        <div>
            <div className="container my-4 position-relative">
                {/* 商品名称 */}
                <h2 className="text-center fw-bold mb-4">{product.name}</h2>

                {/* 左右箭头按钮 */}
                <button onClick={switchRandomProduct} className="btn btn-outline-secondary position-absolute top-50 start-0 translate-middle-y">
                    ◀
                </button>
                <button onClick={switchRandomProduct} className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y">
                    ▶
                </button>

                {/* 商品图片 */}
                <div className="text-center mb-4">
                    <img
                        src={product.ProductImages?.[0] || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '400px' }}
                    />
                </div>

                {/* 商品详细介绍（单独区域） */}
                <div className="bg-white p-4 mb-4 rounded shadow-sm border">
                    <h4 className="mb-3">Product Description</h4>
                    <p style={{ whiteSpace: 'pre-line' }}>{product.pageDesc}</p>
                </div>

                {/* 商品其他信息 */}
                <div className="bg-light p-4 rounded shadow-sm">
                    <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    <p><strong>Delivery Date:</strong> {product.ProductDeliveryTime}</p>
                    <p><strong>Stock:</strong> {product.ProductQuantity}</p>

                    <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
                        Add to Cart
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
