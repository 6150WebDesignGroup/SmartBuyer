const express = require('express');
const router = express.Router();

// controller methods
const {
  getCartByUserId,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
  addToCart
} = require('../controllers/cartController');
// Empty the entire cart for a user
// DELETE /api/cart/clear/:userId
router.delete('/clear/:userId', clearCart);
// Get all items in a user's cart (with populated product details)
router.get('/:userId', getCartByUserId);

// Update the quantity of one cart item
// PUT /api/cart/:userId
// body: { productId, quantity }
router.put('/:userId', updateCartItemQuantity);

// Remove a specific product from the cart
// DELETE /api/cart/:userId/:productId
router.delete('/:userId/:productId', deleteCartItem);



// Add an item to the cart (or increment quantity if already present)
// POST /api/cart/addToCart
// body: { UserId, productId, quantity? }
router.post('/addToCart', addToCart);

module.exports = router;

