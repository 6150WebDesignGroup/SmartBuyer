const mongoose = require("mongoose");

const PayMethodSchema = new mongoose.Schema({
    userEmail: { type: String, unique: true, required: true },
    userId: { type: Number, required: true },

    // 支持多种支付方式
    paymentMethods: [
        {
            _id: {
                type: String, // 👈 允许你传 uuid 作为 _id
                required: true
            },
            type: {
                type: String,
                enum: ["paypal", "creditcard"],
                required: true
            },
            paypalEmail: {
                type: String,
                required: function () {
                    return this.type === "paypal";
                }
            },
            cardNumber: {
                type: String,
                required: function () {
                    return this.type === "creditcard";
                }
            },
            cardHolderName: {
                type: String,
                required: function () {
                    return this.type === "creditcard";
                }
            },
            expiryMonth: {
                type: Number,
                min: 1,
                max: 12,
                required: function () {
                    return this.type === "creditcard";
                }
            },
            expiryYear: {
                type: Number,
                required: function () {
                    return this.type === "creditcard";
                }
            },
            billingAddress: {
                type: String
            },
            isDefault: {
                type: Boolean,
                default: false
            }
        }
    ],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PayMethod", PayMethodSchema);
