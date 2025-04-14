const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// 创建订单
router.post("/create", orderController.createOrder);

// 获取用户订单
router.get("/user/:userId", orderController.getUserOrders);

// 支付订单（模拟）
router.put("/pay/:orderId", orderController.payOrder);

// 用户申请退款
router.put("/refund/:orderId", orderController.requestRefund);

// Admin 审核退款
router.put("/review-refund/:orderId", orderController.reviewRefund);

//

module.exports = router;