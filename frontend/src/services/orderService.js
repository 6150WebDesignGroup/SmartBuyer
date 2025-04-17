import axios from 'axios';

const API = 'http://localhost:5001/api/orders';

export const createOrder = (orderData) => axios.post(`${API}/create`, orderData);

export const getUserOrders = (userId) => axios.get(`${API}/user/${userId}`);

export const payOrder = (orderId) => axios.put(`${API}/pay/${orderId}`);

export const requestRefund = (orderId, reason) =>
  axios.put(`${API}/refund/${orderId}`, { reason });

export const reviewRefund = (orderId, action) =>
  axios.put(`${API}/review-refund/${orderId}`, { action });