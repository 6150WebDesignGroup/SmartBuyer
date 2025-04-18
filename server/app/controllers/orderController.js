const Order = require("../model/Order");

// 创建订单
exports.createOrder = async (req, res) => {
  try {
    const { userId, productList, totalAmount } = req.body;

    if (!userId || !Array.isArray(productList) || productList.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const now = new Date();
    const deliveryDue = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 当前时间 + 3 天

    const newOrder = new Order({
      userId,
      productList,
      totalAmount,
      status: "pending",
      isPaid: false,
      refundStatus: "none",
      refundRequested: false,
      deliveryDueDate: deliveryDue,
      isDelivered: false
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order", details: err });
  }
};

// 获取用户的所有订单
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate("productList.product");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", details: err });
  }
};

// 模拟支付操作（更新状态）
exports.payOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true, paymentDate: new Date(), status: "paid" },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Payment failed", details: err });
  }
};

// 用户发起退款
exports.requestRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        refundRequested: true,
        refundReason: reason,
        refundStatus: "pending",
        status: "refunding"
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to request refund", details: err });
  }
};

// Admin 审核退款请求
exports.reviewRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action } = req.body; // action: 'approve' or 'reject'
    const refundStatus = action === "approve" ? "approved" : "rejected";
    const status = action === "approve" ? "refunded" : "paid";
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { refundStatus, status },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Refund review failed", details: err });
  }
};
//Admin 去拿所有的refund请求
exports.getAllRefund = async (req, res) => {


}