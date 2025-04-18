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
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted mt-4">You have no orders yet.</p>
      ) : (
        orders.map(order => (
          <div className="border rounded shadow-sm mb-4 p-3 bg-white" key={order._id}>
            <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
              <div>
                <strong>ORDER PLACED:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>TOTAL:</strong> ${order.totalAmount.toFixed(2)}
              </div>
              <div>
                <strong>STATUS:</strong> {order.status}
              </div>
            </div>

            <div className="d-flex align-items-center">
              <img
                src="/imgs/sample-product.png"
                alt="Product"
                style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '20px' }}
              />
              <div>
                <h5 className="mb-1">Sample Product</h5>
                <p className="mb-1 text-muted">Estimated delivery: {
                  order.isDelivered
                    ? <span className="text-success">Delivered</span>
                    : <span className="text-secondary">{getDaysRemaining(order.deliveryDueDate)} day(s) remaining</span>
                }</p>
                <div className="mt-2">
                  {!order.isPaid && (
                    <button className="btn btn-success btn-sm me-2" onClick={() => handlePay(order._id)}>
                      Pay Now
                    </button>
                  )}

                  {order.isPaid && order.refundStatus === 'none' && (
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleRefund(order._id)}>
                      Request Refund
                    </button>
                  )}

                  {order.refundStatus !== 'none' && (
                    <span className="text-info">Refund Status: {order.refundStatus}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;