const mongoose = require("mongoose");
const Order = require("../model/Order");
const Product = require("../model/Product");

// 创建订单
exports.createOrder = async (req, res) => {
  try {
    console.log('Create order request body:', JSON.stringify(req.body, null, 2));

    let { userId, productList, totalAmount } = req.body;

    if (!userId || !Array.isArray(productList) || productList.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    userId = Number(userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const now = new Date();
    const deliveryDue = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

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
    console.error('Error creating order:', err);
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
};

// 获取用户所有订单
exports.getUserOrders = async (req, res) => {
  try {
    let { userId } = req.params;
    console.log('Fetching orders for userId:', userId);

    userId = Number(userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // 确保product正确填充
    const orders = await Order.find({ userId })
      .populate({
        path: 'productList.product',
        model: 'Product', // 确保这与你的Product模型名称匹配
        select: 'name price cardDesc ProductImages' // 选择要包含的字段
      });

    console.log(`Found ${orders.length} orders for user ${userId}`);

    // 检查填充是否成功
    if (orders.length > 0 && orders[0].productList && orders[0].productList.length > 0) {
      console.log('First product sample:', orders[0].productList[0].product);
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ error: "Server error: Unable to fetch orders", details: err.message });
  }
};

// exports.getUserOrders = async (req, res) => {
//   try {
//     let { userId } = req.params;
//     console.log('Fetching orders for userId:', userId);

//     userId = Number(userId);
//     if (isNaN(userId)) {
//       return res.status(400).json({ error: "Invalid userId format" });
//     }

//     // First, get all orders for the user
//     const orders = await Order.find({ userId }).populate('productList.product');
//     console.log(`Found ${orders.length} orders for user ${userId}`);

//     // Process each order and populate product data
//     const populatedOrders = await Promise.all(orders.map(async (order) => {
//       // Convert mongoose document to plain object
//       const orderObject = order.toObject();

//       // Process product items
//       if (orderObject.productList && Array.isArray(orderObject.productList)) {
//         // Use Promise.all to process all products in parallel
//         const populatedProductList = await Promise.all(orderObject.productList.map(async (item) => {
//           try {
//             // Convert the item to an object we can modify
//             const itemObject = { ...item };

//             // If product is just an ID string, fetch the actual product
//             if (item.product && typeof item.product === 'string') {
//               const productData = await Product.findById(item.product);
//               if (productData) {
//                 itemObject.product = productData.toObject();
//               } else {
//                 // If product not found, add a placeholder
//                 itemObject.productName = 'Product not found';
//               }
//             }

//             // If product object doesn't have name, add a placeholder
//             if (!itemObject.product || !itemObject.product.name) {
//               itemObject.productName = itemObject.productName || 'Unknown Product';
//             }

//             return itemObject;
//           } catch (err) {
//             console.error('Error processing product item:', err);
//             return {
//               ...item,
//               productName: 'Error loading product'
//             };
//           }
//         }));

//         orderObject.productList = populatedProductList;
//       }

//       return orderObject;
//     }));

//     console.log('Sending populated orders:', JSON.stringify(populatedOrders, null, 2));
//     res.status(200).json(populatedOrders);
//   } catch (err) {
//     console.error('Error fetching orders:', err.message);
//     res.status(500).json({ error: "Server error: Unable to fetch orders", details: err.message });
//   }
// };
// 支付订单
exports.payOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid orderId format" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true, paymentDate: new Date(), status: "paid" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error processing payment:', err.message);
    res.status(500).json({ error: "Payment failed", details: err.message });
  }
};

// 请求退款
exports.requestRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid orderId format" });
    }

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

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error requesting refund:', err.message);
    res.status(500).json({ error: "Failed to request refund", details: err.message });
  }
};

// 审核退款（admin）
exports.reviewRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid orderId format" });
    }

    const refundStatus = action === "approve" ? "approved" : "rejected";
    const status = action === "approve" ? "refunded" : "paid";

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { refundStatus, status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error reviewing refund:', err.message);
    res.status(500).json({ error: "Refund review failed", details: err.message });
  }
};

// 删除订单
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};



//Admin 去拿所有的refund请求
exports.getAllRefund = async (req, res) => {
  try {

    // 确保product正确填充
    const orders = await Order.find()
        .populate({
          path: 'productList.product',
          model: 'Product', // 确保这与你的Product模型名称匹配
          select: 'name price cardDesc ProductImages' // 选择要包含的字段
        });
    // 检查填充是否成功
    if (orders.length > 0 && orders[0].productList && orders[0].productList.length > 0) {
      console.log('First product sample:', orders[0].productList[0].product);
    }
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ error: "Server error: Unable to fetch orders", details: err.message });
  }
}