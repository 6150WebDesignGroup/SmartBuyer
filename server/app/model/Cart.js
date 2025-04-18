const mongoose = require("mongoose");
// using cartItem and cart to identify the cart in app

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    LastUpdate: { type: Date, default: Date.now }
});

const CartSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },  // 每个用户一个 cart
    items: [CartItemSchema], // 商品列表
    LastUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", CartSchema);
