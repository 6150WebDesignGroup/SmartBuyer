import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCartByUserId,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart
} from '../services/cartService';
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';

const CartPage = () => {

  const userId = localStorage.getItem('userId');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await getCartByUserId(userId);
        setCartItems(res.data || []);
      } catch (err) {
        console.error('Failed to fetch cart', err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchCart();
  }, [userId]);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItemQuantity(userId, productId, newQty);
      setCartItems(items =>
        items.map(i =>
          i.productId._id === productId
            ? { ...i, quantity: newQty, totalPrice: i.price * newQty }
            : i
        )
      );
    } catch (err) {
      console.error('Error updating quantity', err);
    }
  };

  const handleDelete = async productId => {
    try {
      await deleteCartItem(userId, productId);
      setCartItems(items => items.filter(i => i.productId._id !== productId));
    } catch (err) {
      console.error('Error deleting item', err);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart(userId);
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart', err);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { items: cartItems } });
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>

    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <Alert variant="info">
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </Alert>
      ) : (
        <>
          {cartItems.map((item, idx) => (
            <Row
              key={item.productId._id}
              className="align-items-center py-3 border-top"
            >
           
           <Col xs={3} md={2}>
                <Image
                
                  src={
                    `http://localhost:5001/${item.productId.ProductImages[0]}`
                  }
                  alt={item.productId.name}
                  rounded
                  fluid
                />
              </Col>

              {/* 名称 & 单价 & 操作 */}
              <Col xs={8} md={6}>
                <h5>{item.productId.name}</h5>
                <p className="text-muted mb-1">
                  Unit Price: ${item.price.toFixed(2)}
                </p>
                <div className="d-flex align-items-center">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(item.productId._id, item.quantity - 1)
                    }
                  >
                    −
                  </Button>
                  <span className="px-3">{item.quantity}</span>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(item.productId._id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="ms-3 text-danger p-0"
                    onClick={() => handleDelete(item.productId._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Col>

              {/* 小计 */}
              <Col xs={12} md={4} className="mt-3 mt-md-0 text-end">
                <p className="mb-1">Subtotal</p>
                <h5>${item.totalPrice.toFixed(2)}</h5>
              </Col>
            </Row>
          ))}

          {/* 底部操作栏 */}
          <Row className="align-items-center py-4">
            <Col xs={12} md={4}>
              <Button variant="outline-danger" onClick={handleClear}>
                Clear Cart
              </Button>
            </Col>
            <Col xs={12} md={8} className="text-end">
              <Link to="/" className="btn btn-outline-primary me-2">
                Continue Shopping
              </Link>
              <Button variant="success" onClick={handleCheckout}>
                Checkout
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );

  
};
export default CartPage;