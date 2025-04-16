const express = require('express');

const router = express.Router();
const {
    getCartByUserId,
    updateCartItemQuantity,
    deleteCartItem,
    clearCart
} = require('../controllers/cartController');

// 获取指定用户的购物车内容
// GET /api/cart/:userId
router.get('/:userId', getCartByUserId);

// 修改某个商品的数量（加减）
// PUT /api/cart/:userId
// body: { productId: ObjectId, quantity: Number }
router.put('/:userId', updateCartItemQuantity);

// 删除购物车中某个商品
// DELETE /api/cart/:userId/:productId
router.delete('/:userId/:productId', deleteCartItem);


// 清空整个购物车
// DELETE /api/cart/clear/:userId
router.delete('/clear/:userId', clearCart);

// router.delete('/clear/:userId', cartController.clearCart);


module.exports = router;


