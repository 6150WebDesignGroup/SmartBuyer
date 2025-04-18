const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  payOrder,
  requestRefund,
  reviewRefund,
  deleteOrder,
  getAllRefund
} = require("../controllers/orderController");

// 创建订单
router.post("/create", createOrder);

// 获取指定用户的所有订单
router.get("/user/:userId", getUserOrders);

// 支付订单
router.put("/pay/:orderId", payOrder);

// 用户申请退款
router.put("/refund/:orderId", requestRefund);

// 管理员审核退款
router.put("/review-refund/:orderId", reviewRefund);

// 删除订单
router.delete("/:id", deleteOrder);
// Admin 获得所有的退款请求
router.get("/getAllRefund",getAllRefund);


module.exports = router;