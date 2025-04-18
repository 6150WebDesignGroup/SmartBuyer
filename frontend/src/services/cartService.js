import axios from 'axios';

const CART_API = 'http://localhost:5001/api/cart';

export const getCartByUserId = (userId) =>
  axios.get(`${CART_API}/${userId}`);

export const updateCartItemQuantity = (userId, productId, quantity) =>
  axios.put(`${CART_API}/${userId}`, { productId, quantity });

export const deleteCartItem = (userId, productId) =>
  axios.delete(`${CART_API}/${userId}/${productId}`);

export const clearCart = (userId) =>
  axios.delete(`${CART_API}/clear/${userId}`);

export const addToCart = (userId, productId, quantity = 1) =>
  axios.post(`${CART_API}/addToCart`, {
    userId,
    productId,
    quantity,
  });