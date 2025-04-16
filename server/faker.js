// scripts/faker.js
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Product = require("./app/model/Product");
const ProductCategory = require("./app/model/ProductCategory");
const User = require("./app/model/User");
const PayMethod = require("./app/model/PayMethod");
const Order = require("./app/model/Order");
const Delivery = require("./app/model/Delivery");
const Cart = require("./app/model/Cart");

mongoose.connect("mongodb://127.0.0.1:27017/smartbuyer");

async function seed() {
    await Product.deleteMany({});
    await ProductCategory.deleteMany({});
    await User.deleteMany({});
    await PayMethod.deleteMany({});
    await Order.deleteMany({});
    await Delivery.deleteMany({});
    await Cart.deleteMany({});

    // Categories (create one by one to ensure ProductCateId is assigned)
    const categoryData = [
        { name: "electronic", desc: "电子产品" },
        { name: "clothes", desc: "衣服服饰" },
        { name: "books", desc: "图书资料" }
    ];
    const categories = [];
    for (const data of categoryData) {
        const cat = await ProductCategory.create(data);
        categories.push(cat);
    }

    // Users (1 admin + 5 users)
    const users = [
        {
            name: "Admin User",
            email: "admin@example.com",
            phone: "10000000000",
            pwd: faker.internet.password({ length: 10 }),
            role: "Admin"
        }
    ];
    for (let i = 0; i < 5; i++) {
        users.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number("1##########"),
            pwd: faker.internet.password({ length: 10 }),
            role: "User"
        });
    }
    const insertedUsers = await User.insertMany(users);

    // Products
    const products = [];
    for (const cat of categories) {
        for (let i = 0; i < 10; i++) {
            products.push({
                name: faker.commerce.productName(),
                categoryId: cat.ProductCateId,
                categoryName: cat.name,
                cardDesc: faker.commerce.productDescription(),
                pageDesc: faker.lorem.paragraph(),
                price: parseFloat(faker.commerce.price(10, 999, 2)),
                ProductQuantity: faker.number.int({ min: 10, max: 100 }).toString(),
                ProductImages: ["imgs/Product/ProductImg-1744811460201.png"],
                ProductDeliveryTime: `${faker.number.int({ min: 1, max: 7 })} days`,
                deliveryTime: faker.number.int({ min: 1, max: 7 })
            });
        }
    }
    const insertedProducts = await Product.insertMany(products);

    // PayMethods (use insertedUsers[i]._id and insertedUsers[i].UserId)
    const payMethods = insertedUsers.map((user) => {
        return {
            userEmail: user.email,
            userId: user.UserId ?? 1, // fallback for safety if auto-increment fails
            paymentMethods: [
                {
                    _id: faker.string.uuid(),
                    type: "creditcard",
                    cardNumber: faker.finance.creditCardNumber(),
                    cardHolderName: user.name,
                    expiryMonth: faker.number.int({ min: 1, max: 12 }),
                    expiryYear: faker.number.int({ min: 2025, max: 2030 }),
                    billingAddress: faker.location.streetAddress(),
                    isDefault: true
                }
            ]
        };
    });
    console.log("PayMethods preview:", payMethods); // Debug
    await PayMethod.insertMany(payMethods);

    // Orders
    const orders = insertedUsers.map((user) => {
        const product = faker.helpers.arrayElement(insertedProducts);
        return {
            userId: user._id,
            productList: [
                {
                    product: product._id,
                    quantity: 1
                }
            ],
            totalAmount: product.price,
            isPaid: true,
            paymentDate: new Date(),
            refundRequested: false,
            status: "paid"
        };
    });
    const insertedOrders = await Order.insertMany(orders);

    // Delivery
    const deliveries = insertedOrders.map((order) => ({
        name: faker.company.name(),
        orderItem: { order: order._id },
        status: ["shipped"]
    }));
    await Delivery.insertMany(deliveries);

    // Cart
    const carts = insertedUsers.map((user) => {
        const product = faker.helpers.arrayElement(insertedProducts);
        const quantity = faker.number.int({ min: 1, max: 3 });
        return {
            userId: user._id,
            items: [
                {
                    productId: product._id,
                    quantity,
                    price: product.price,
                    totalPrice: quantity * product.price
                }
            ]
        };
    });
    await Cart.insertMany(carts);

    console.log("Fake data seeded successfully!");
    await mongoose.disconnect();
}

seed();