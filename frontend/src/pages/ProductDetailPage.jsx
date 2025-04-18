import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [productList, setProductList] = useState([]);
    const [product, setProduct] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5001/product/products/${productId}`);
            setProduct(res.data);
            setImageIndex(0); // 每次加载新商品时重置图片轮播到第一张
        } catch (error) {
            console.error("Failed to load product", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductList = async () => {
        try {
            const res = await axios.post("http://localhost:5001/product/getAllAndSort", {
                page: 1,
                limit: 100
            });
            setProductList(res.data.productLists || []);
        } catch (error) {
            console.error("Failed to load product list", error);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchProductList();
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [productId]);

    const handlePrevImage = () => {
        if (product?.ProductImages?.length > 0) {
            setImageIndex((prev) => (prev - 1 + product.ProductImages.length) % product.ProductImages.length);
        }
    };

    const handleNextImage = () => {
        if (product?.ProductImages?.length > 0) {
            setImageIndex((prev) => (prev + 1) % product.ProductImages.length);
        }
    };

    const handlePrev = () => {
        if (productList.length > 0) {
            const currentIndex = productList.findIndex(p => p._id === productId);
            const prevIndex = (currentIndex - 1 + productList.length) % productList.length;
            window.location.href = `/product/${productList[prevIndex]._id}`;
        }
    };

    const handleNext = () => {
        if (productList.length > 0) {
            const currentIndex = productList.findIndex(p => p._id === productId);
            const nextIndex = (currentIndex + 1) % productList.length;
            window.location.href = `/product/${productList[nextIndex]._id}`;
        }
    };

    const handleAddToCart = async () => {
        if (!user || !user.UserId) {
            alert("Please log in to add items to your cart.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5001/api/cart/addToCart", {
                userId: user.UserId,
                productId: productId,
                quantity: 1
            });

            if (res.status === 200) {
                alert("Product added to cart!");
            } else {
                alert("Failed to add to cart.");
            }
        } catch (error) {
            console.error("Error adding to cart", error);
            alert("Error adding to cart.");
        }
    };

    if (loading || !product) {
        return <div className="container text-center my-5"><div className="spinner-border" role="status"></div></div>;
    }

    const imagePath = product.ProductImages?.[imageIndex]
        ? `http://localhost:5001/${product.ProductImages[imageIndex]}`
        : "https://via.placeholder.com/400";

    return (
        <div className="container position-relative my-5">


            <h2 className="mb-4 text-center">{product.name}</h2>
            <div className="text-center">
                <img src={imagePath} alt={product.name} style={{ width: "400px", height: "auto", objectFit: "contain" }} />
                {/* 切换当前商品图片用的左右箭头 */}
                <div className="d-flex justify-content-center gap-2 mt-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={handlePrevImage}>← Prev Image</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={handleNextImage}>Next Image →</button>
                </div>
            </div>

            <div className="mt-4">
                <h5>Description:</h5>
                <p>{product.pageDesc}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Delivery:</strong> {product.deliveryTime}</p>
                <p><strong>Stock:</strong> {product.ProductQuantity}</p>
                <button
                    className={`btn ${!user ? "btn-secondary" : "btn-primary"}`}
                    onClick={handleAddToCart}
                    disabled={!user}
                >
                    Add to Cart
                </button>
                {/* 商品切换按钮，放在页面底部 */}
                <div className="mt-4 d-flex justify-content-center gap-3">
                    <button className="btn btn-outline-dark" onClick={handlePrev}>
                        ← Previous Product
                    </button>
                    <button className="btn btn-outline-dark" onClick={handleNext}>
                        Next Product →
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductDetailPage;
