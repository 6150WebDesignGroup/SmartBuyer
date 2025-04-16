const Cart = require('../model/Cart');
const Product = require('../model/Product');

// 获取用户购物车
const getCartByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(200).json([]); // 没有购物车就返回空数组
        res.json(cart.items);
    } catch (err) {
        res.status(500).json({ error: '服务器错误：获取购物车失败' });
    }
};

// 更新某个商品的数量
const updateCartItemQuantity = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ error: '购物车不存在' });

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) return res.status(404).json({ error: '商品不在购物车中' });

        item.quantity = quantity;
        item.totalPrice = item.price * quantity;
        item.LastUpdate = Date.now();

        await cart.save();
        res.json({ message: '数量已更新' });
    } catch (err) {
        res.status(500).json({ error: '服务器错误：更新失败' });
    }
};

// 删除购物车中的某个商品
const deleteCartItem = async (req, res) => {
    const { userId, productId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ error: '购物车不存在' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.json({ message: '商品已移除' });
    } catch (err) {
        res.status(500).json({ error: '服务器错误：删除失败' });
    }
};

// 添加商品到购物车
const addItemToCart = async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: '商品不存在' });

        const price = product.price;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{
                    productId,
                    price,
                    quantity: 1,
                    totalPrice: price
                }]
            });
        } else {
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
                existingItem.LastUpdate = Date.now();
            } else {
                cart.items.push({
                    productId,
                    price,
                    quantity: 1,
                    totalPrice: price
                });
            }
        }

        await cart.save();
        res.json({ message: '商品已加入购物车' });
    } catch (err) {
        console.error('加入购物车失败:', err);
        res.status(500).json({ error: '服务器错误：无法加入购物车' });
    }
};

// ✅ 清空购物车函数（之前已写，但未导出）
const clearCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ error: '购物车不存在' });

        cart.items = []; // 清空商品
        await cart.save();

        res.json({ message: '购物车已清空' });
    } catch (err) {
        res.status(500).json({ error: '清空购物车失败', details: err });
    }
};

// ✅ 正确导出所有方法（包括 clearCart）
module.exports = {
    getCartByUserId,
    updateCartItemQuantity,
    deleteCartItem,
    addItemToCart,
    clearCart
};
