const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  deliveryDueDate: { type: Date },
  refundStatus: { type: String, default: 'none' },// None, Pending, Accept,Reject
  createdAt: { type: Date, default: Date.now },
  productList: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' }, 
      quantity: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model("Order", orderSchema);