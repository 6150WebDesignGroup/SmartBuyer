import React, { useEffect, useState } from 'react';
import { getUserOrders, payOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    if (userId) {
      getUserOrders(userId)
        .then(res => setOrders(res.data))
        .catch(err => console.error('Failed to fetch orders', err));
    }
  }, [userId]);
  const handlePay = (orderId) => {
    payOrder(orderId)
      .then(() => window.location.reload())
      .catch(err => console.error('Payment failed', err));
  };

  const handleRefund = (orderId) => {
    navigate(`/refund/${orderId}`);
  };

  const getDaysRemaining = (deliveryDueDate) => {
    const now = new Date();
    const due = new Date(deliveryDueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mt-4">
      <h2>My Orders</h2>
      {orders.map(order => (
        <div className="card mb-3" key={order._id}>
          <div className="card-body">
            <h5 className="card-title">Order ID: {order._id}</h5>
            <p className="card-text">Total Amount: ${order.totalAmount}</p>
            <p className="card-text">Status: {order.status}</p>

            {order.isDelivered ? (
              <p className="card-text text-success">Delivered</p>
            ) : (
              <p className="card-text text-secondary">
                ⏳ {getDaysRemaining(order.deliveryDueDate)} day(s) remaining for delivery
              </p>
            )}


            {!order.isPaid && (
              <button className="btn btn-success me-2" onClick={() => handlePay(order._id)}>
                Pay Now
              </button>
            )}

            {order.isPaid && order.refundStatus === 'none' && (
              <button className="btn btn-warning" onClick={() => handleRefund(order._id)}>
                Request Refund
              </button>
            )}

            {order.refundStatus !== 'none' && (
              <p className="mt-2 text-info">Refund Status: {order.refundStatus}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;