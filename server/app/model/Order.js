const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const OrderSchema = new mongoose.Schema({
<<<<<<< HEAD
    status: { type: String, required: true }, // paid, refunding, refunded, refused
    productList: [OrderItemSchema],
    createdAt: { type: Date, default: Date.now }
=======
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productList: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentDate: {
    type: Date
  },
  refundRequested: {
    type: Boolean,
    default: false
  },
  refundReason: {
    type: String
  },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  status: {
    type: String,
    required: true,
    default: 'pending' // paid、refunding、refunded
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
>>>>>>> 6f07c996f43dbbff0e6f63d1291e2fd843f53010
});

module.exports = mongoose.model("Order", OrderSchema);