const Cart = require('../model/Cart');
const Product = require('../model/Product'); //

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
        // 查找商品信息
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: '商品不存在' });

        const price = product.price;

        // 查找用户购物车
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // 如果没有购物车，则新建一个
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
            // 检查商品是否已存在
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                // 已存在：数量+1，总价更新
                existingItem.quantity += 1;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
                existingItem.LastUpdate = Date.now();
            } else {
                // 不存在：新建商品项
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

module.exports = {
    getCartByUserId,
    updateCartItemQuantity,
    deleteCartItem,
    addItemToCart
};
