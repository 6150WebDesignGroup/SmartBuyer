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


// addToCart
const addToCart = async (req, res) => {
    try {
        const { UserId, productId, quantity=1 } = req.body;

        // 1. 获取商品详情
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const price = product.price;
        const totalPrice = price * quantity;

        // 2. 查询用户购物车
        let cart = await Cart.findOne({ UserId });

        if (!cart) {
            // 3. 如果购物车不存在，创建新购物车
            cart = new Cart({
                UserId,
                items: [{
                    productId,
                    quantity,
                    price,
                    totalPrice,
                }],
                LastUpdate: new Date()
            });
        } else {
            // 4. 检查商品是否已在购物车中
            const existingItem = cart.items.find(item => item.productId.equals(productId));
            if (existingItem) {
                // 如果存在，更新数量和总价
                existingItem.quantity += quantity;
                existingItem.totalPrice = existingItem.quantity * price;
                existingItem.LastUpdate = new Date();
            } else {
                // 否则添加新商品
                cart.items.push({
                    productId,
                    quantity,
                    price,
                    totalPrice,
                });
            }

            cart.LastUpdate = new Date();
        }

        await cart.save();
        return res.status(200).json({ message: "Item added to cart", cart });

    } catch (err) {
        console.error("Add to cart error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};


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


module.exports = {
    getCartByUserId,
    updateCartItemQuantity,
    deleteCartItem,
    //addItemToCart,
    clearCart,
    addToCart,
};
