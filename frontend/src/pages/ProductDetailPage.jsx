import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {

    const [imageIndex, setImageIndex] = useState(0);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productList, setProductList] = useState([]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5001/product/products/${id}`);
            setProduct(res.data);
        } catch (error) {
            console.error("Failed to load product", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductList = async () => {
        try {
            const res = await axios.get("http://localhost:5001/product/products");
            setProductList(res.data);
        } catch (error) {
            console.error("Failed to fetch product list", error);
        }
    };

    const handlePrev = () => {
        if (productList.length === 0) return;
        const random = productList[Math.floor(Math.random() * productList.length)];
        window.location.href = `/product/${random._id}`;
    };

    const handleNext = () => {
        handlePrev();
    };

    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.UserId) {
            alert("Please log in to add items to your cart.");
            return;
        }

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
        } catch (err) {
            console.error("Add to cart error:", err);
            alert("Error adding to cart.");
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchProductList();
    }, [id]);



    if (loading) return <div className="text-center my-5">Loading...</div>;

    if (!product) return <div className="text-center my-5">Product not found</div>;

    const imagePath = product?.ProductImages?.[imageIndex]
        ? `http://localhost:5001/${product.ProductImages[imageIndex]}`
        : '';


    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">{product.name}</h2>
            <div className="row">
                <div className="col-md-6 text-center">
                    <img
                        src={imagePath}
                        alt={product.name}
                        className="img-fluid mb-3"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                    <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-outline-secondary" onClick={handlePrev}>
                            &larr;
                        </button>
                        <button className="btn btn-outline-secondary" onClick={handleNext}>
                            &rarr;
                        </button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <h5 className="mb-3">Product Description</h5>
                        <p>{product.description || "No description available."}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Delivery Date:</strong> {product.deliveryTime || "N/A"}</p>
                        <p><strong>Stock:</strong> {product.ProductQuantity || 0}</p>
                        <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
