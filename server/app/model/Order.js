const mongoose = require("mongoose");
// ref productSchema to update info automatically

const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const OrderSchema = new mongoose.Schema({
    status: { type: String, required: true }, // paid, refunding, refunded, refused
    productList: [OrderItemSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
