const Cart = require('../model/Cart');
const Product = require('../model/Product');

/**
 * Get the shopping cart for a given user ID.
 * Returns an array of cart items, each with populated product details.
 */
const getCartByUserId = async (req, res) => {
  const { userId } = req.params; // 小写 userId
  try {
    const cart = await Cart.findOne({ userId })
                           .populate('items.productId');
    if (!cart) {
      return res.status(200).json([]);
    }
    return res.status(200).json(cart.items);
  } catch (err) {
    console.error('Error fetching cart:', err);
    return res.status(500).json({ error: 'Server error: failed to fetch cart' });
  }
};

/**
 * Update the quantity of a specific item in the cart.
 */
const updateCartItemQuantity = async (req, res) => {
  const { userId } = req.params; // 小写 userId
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;
    item.totalPrice = item.price * quantity;
    item.LastUpdate = new Date();

    await cart.save();
    return res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (err) {
    console.error('Error updating cart item quantity:', err);
    return res.status(500).json({ error: 'Server error: failed to update quantity' });
  }
};

/**
 * Delete a single item from the cart.
 */
const deleteCartItem = async (req, res) => {
  const { userId, productId } = req.params; // 小写 userId

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    return res.status(200).json({ message: 'Item removed successfully' });
  } catch (err) {
    console.error('Error removing item from cart:', err);
    return res.status(500).json({ error: 'Server error: failed to remove item' });
  }
};

/**
 * Clear all items in a user's cart.
 */
const clearCart = async (req, res) => {
  const { userId } = req.params; // 小写 userId

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();


    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    return res.status(500).json({ error: 'Server error: failed to clear cart' });
  }
};


/**
 * Add an item to a user's cart (or increment quantity if it already exists).
 */
const addToCart = async (req, res) => {
  try {
    // 1) 将原来的大写 UserId 改为小写 userId
    // const { UserId, productId, quantity = 1 } = req.body;
    const { userId, productId, quantity = 1 } = req.body;
    // 校验产品是否存在
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const price = product.price;
    const totalPrice = price * quantity;

    // 查找或创建购物车（都用小写 userId）
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,               // ── 修改：这里也用小写 userId
        items: [{
          productId,
          quantity,
          price,
          totalPrice,
        }],
        LastUpdate: new Date()
      });
    } else {
      const existingItem = cart.items.find(item => item.productId.equals(productId));
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * price;
        existingItem.LastUpdate = new Date();
      } else {
        cart.items.push({ productId, quantity, price, totalPrice });
      }
      cart.LastUpdate = new Date();
    }

    await cart.save();
    return res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return res.status(500).json({ error: 'Server error: failed to add item to cart' });
  }
};

module.exports = {
  getCartByUserId,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
  addToCart,
};