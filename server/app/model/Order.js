const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const OrderSchema = new mongoose.Schema({

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
  deliveryDueDate: {
    type: Date,
    required: false
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", OrderSchema);