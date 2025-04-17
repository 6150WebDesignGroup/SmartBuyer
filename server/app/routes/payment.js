const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
//
// // 使用Stripe 作为测试支付api 需要官网插件挂载转接？？
// router.post("/create-payment-intent", paymentController.createPaymentIntent);
//
// // Webhook 回调，必须使用 raw body
// router.post(
//     "/webhook",
//     express.raw({ type: "application/json" }),
//     paymentController.handleStripeWebhook
// );

module.exports = router;

