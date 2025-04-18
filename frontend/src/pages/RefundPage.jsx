import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestRefund } from '../services/orderService';

const RefundPage = () => {
  const { orderId } = useParams();
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    requestRefund(orderId, reason)
        .then(()=> {
          alert('退款申请已提交成功');
          navigate('/orders');
        })
      .catch(err => console.error('Failed to request refund', err));
  };

  return (
    <div className="container mt-4">
      <h3>Refund Request</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reason" className="form-label">Reason for Refund</label>
          <textarea
            id="reason"
            className="form-control"
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please briefly explain the reason for your refund request..."
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Request</button>
      </form>
    </div>
  );
};

export default RefundPage;