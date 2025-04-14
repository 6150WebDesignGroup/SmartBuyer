const mongoose = require("mongoose");

const PayMethodSchema = new mongoose.Schema({
    userEmail: { type: String, unique: true, required: true },
    userId: { type: Number, required: true },

    // 支持多种支付方式
    paymentMethods: [
        {
            type: {
                type: String,
                enum: ["paypal", "creditcard"],
                required: true
            },
            // PayPal 专属字段
            paypalEmail: {
                type: String,
                required: function () {
                    return this.type === "paypal";
                }
            },
            // 信用卡专属字段
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
