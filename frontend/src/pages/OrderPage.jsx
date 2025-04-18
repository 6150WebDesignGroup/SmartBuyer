import React, { useEffect, useState } from 'react';
import { getUserOrders, payOrder, deleteOrder } from '../services/orderService'; 
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date()); // For countdown refresh
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Fetch orders
  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);
      getUserOrders(userId)
        .then(res => {
          console.log('Order API response:', res.data);
          setOrders(res.data);
        })
        .catch(err => {
          console.error('Failed to fetch orders:', err);
          setError(err.response?.data?.error || "Could not load orders");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  // Refresh time every minute (for countdown)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePay = (orderId) => {
    payOrder(orderId)
        .then(() => {
          // 不刷新整个页面，而是重新获取订单数据
          getUserOrders(userId)
              .then(res => setOrders(res.data))
              .catch(err => console.error('Failed to fetch orders', err));
        })
        .catch(err => console.error('Payment failed', err));
  };

  const handleRefund = (orderId) => {
    navigate(`/refund/${orderId}`);
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert("Failed to delete order.");
    }
  };

  // Get product name from potentially different data structures
  const getProductName = (item) => {
  
    if (item.product && typeof item.product === 'object' && item.product.name) {
      return item.product.name;
    } else if (item.productName) {
      return item.productName;
    } else if (typeof item.product === 'string') {
    
      return `Product ID: ${item.product.substring(0, 8)}...`;
    } else {
      return `Product Item`;
    }
  };

  // Countdown calculation logic
  const getDaysRemaining = (deliveryDueDate) => {
    if (!deliveryDueDate) return 0;
    const due = new Date(deliveryDueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Hours and minutes remaining for countdown
  const getTimeRemaining = (deliveryDueDate) => {
    if (!deliveryDueDate) return { hours: 0, minutes: 0 };
    
    const due = new Date(deliveryDueDate);
    const diffTime = due.getTime() - now.getTime();
    
    if (diffTime <= 0) return { hours: 0, minutes: 0 };
    
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours: diffHours, minutes: diffMinutes };
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
      <div className="container mt-4">
        <h2>Your Orders</h2>

      {error && (
        <Alert variant="danger">
          {error}
          <button 
            className="btn btn-outline-primary ms-3" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </Alert>
      )}

      {!error && orders.length === 0 ? (
        <p className="text-muted mt-4">You have no orders yet.</p>
      ) : (
        orders.map(order => (
          <div 
            key={order._id}
            className="border rounded shadow-sm mb-4 p-3 bg-white"
          >
            <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
              <div>
                <strong>ORDER PLACED:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>TOTAL:</strong> ${order.totalAmount.toFixed(2)}
              </div>
              <div>
                <strong>STATUS:</strong>{" "}
                <span className={order.isPaid ? "text-success" : "text-warning"}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Show product names */}
            {order.productList?.map((item, index) => {
              console.log('Product item:', item);
              return (
                <div className="py-2 border-bottom" key={index}>
                  <div className="d-flex justify-content-between">
                    <strong>{getProductName(item)}</strong>
                    <span>Quantity: {item.quantity}</span>
                  </div>
                  <div className="text-muted mt-1">
                    {order.isDelivered ? (
                      <span className="text-success">Delivered</span>
                    ) : (
                      <div>
                        Estimated delivery: 
                        <span className="ms-1 fw-bold">
                          {getDaysRemaining(order.deliveryDueDate)} day(s) 
                          {getDaysRemaining(order.deliveryDueDate) > 0 && (
                            <span className="ms-1 fw-bold text-primary">
                              {getTimeRemaining(order.deliveryDueDate).hours}h 
                              {getTimeRemaining(order.deliveryDueDate).minutes}m remaining
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="mt-3 d-flex flex-wrap gap-2">
              {!order.isPaid && (
                <button className="btn btn-success btn-sm" onClick={() => handlePay(order._id)}>
                  Pay Now
                </button>
              )}

              {order.isPaid && (!order.refundStatus || order.refundStatus === 'none') && (
                <button className="btn btn-warning btn-sm" onClick={() => handleRefund(order._id)}>
                  Request Refund
                </button>
              )}

              {order.refundStatus && order.refundStatus !== 'none' && (
                <span className="text-info">Refund Status: {order.refundStatus}</span>
              )}

              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(order._id)}>
                Delete Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;