const PayMethod = require("../model/PayMethod");
const { v4: uuidv4 } = require("uuid"); // 用于唯一 ID
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../model/Order"); // 根据你的路径调整


// 添加支付方式
exports.addPaymentMethod = async (req, res) => {
    try {
        const { userEmail, userId, method } = req.body;

        if (!method || !method.type) {
            return res.status(400).json({ error: "Invalid payment method format" });
        }

        const user = await PayMethod.findOne({ userEmail });

        const newMethod = {
            ...method,
            _id: uuidv4()
        };

        if (!user) {
            const newUserPay = new PayMethod({
                userEmail,
                userId,
                paymentMethods: [newMethod]
            });
            await newUserPay.save();
            return res.status(201).json({ message: "Created new payment record", data: newUserPay });
        } else {
            user.paymentMethods.push(newMethod);
            await user.save();
            return res.status(200).json({ message: "Payment method added", data: user });
        }
    } catch (err) {
        console.error("Add payment error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// 删除支付方式
exports.deletePaymentMethod = async (req, res) => {
    try {
        const { userEmail, methodId } = req.body;

        const user = await PayMethod.findOne({ userEmail });
        if (!user) return res.status(404).json({ error: "User not found" });

        user.paymentMethods = user.paymentMethods.filter(pm => pm._id !== methodId);
        await user.save();

        res.status(200).json({ message: "Payment method deleted", data: user });
    } catch (err) {
        console.error("Delete payment error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// 编辑支付方式（仅支持更新已有字段 & 设置默认）
exports.editPaymentMethod = async (req, res) => {
    try {
        const { userEmail, methodId, updateData } = req.body;

        const user = await PayMethod.findOne({ userEmail });
        if (!user) return res.status(404).json({ error: "User not found" });

        const target = user.paymentMethods.find(pm => pm._id === methodId);
        if (!target) return res.status(404).json({ error: "Payment method not found" });

        // 如果设置默认，将其他设置为 false
        if (updateData.isDefault === true) {
            user.paymentMethods.forEach(pm => {
                pm.isDefault = false;
            });
        }

        // 更新字段
        Object.assign(target, updateData);

        await user.save();
        res.status(200).json({ message: "Payment method updated", data: user });
    } catch (err) {
        console.error("Edit payment error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getpaymentMethod = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const userPayment = await PayMethod.findOne({ userEmail: email });

        if (!userPayment) {
            return res.status(404).json({ error: "No payment methods found for this email" });
        }

        return res.status(200).json({
            message: "Payment methods fetched successfully",
            paymentMethods: userPayment.paymentMethods,
        });
    } catch (err) {
        console.error("Error fetching payment methods:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

// 1. 创建 PaymentIntent
exports.createPaymentIntent = async (req, res) => {
    const { amount, orderId, userId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe 使用的是“分”
            currency: "usd",
            metadata: {
                orderId: orderId,
                userId: userId
            },
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        console.error("Stripe PaymentIntent 错误:", err);
        res.status(500).send({ error: "Payment failed." });
    }
};

// 2. Stripe Webhook 回调
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook 签名验证失败：", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 根据事件类型处理
    switch (event.type) {
        case "payment_intent.succeeded":
            const intent = event.data.object;
            const orderId = intent.metadata.orderId;

            console.log(`订单已支付: ${orderId}`);
            // 更新数据库订单状态
            await Order.findByIdAndUpdate(orderId, {
                isPaid: true,
                status: "paid",
                paymentDate: new Date()
            });
            break;

        case "payment_intent.payment_failed":
            const failed = event.data.object;
            console.log(`支付失败: ${failed.id}`);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
};
