const path = require("path");
const express = require("express");
const app = express();
const port =  5001;
const mongoose = require("mongoose");
const session = require("express-session");
// const swaggerUi = require("swagger-ui-express");
// const swaggerJsdoc = require("swagger-jsdoc");
const orderRoutes = require('./app/routes/orderRoutes');
const bodyParser =  require('body-parser');
const cors = require("cors");
// const session = require('express-session');

// app.use(
//   "/images", 
//   express.static(path.join(__dirname, "app/model/imgs/Product"))
// );

app.use("/imgs",express.static("imgs"));
app.use('/imgs/Product', express.static("imgs"));

// using env files
require('dotenv').config();


// session settings
app.use(session({
    secret: 'smartbuyer-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // 若启用 https 可设为 true
}));



const MongoUrl = 'mongodb://localhost:27017/smartbuyer';
// const MongoPort = 5000;
mongoose.connect(MongoUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

  // Session 配置 - 必须在 cors 和路由之前


app.use(session({
  secret: 'your_secret_key', // 用于签名会话 ID cookie 的密钥
  resave: false,             // 即使会话没有被修改也不强制保存
  saveUninitialized: false,  // 不保存未初始化的会话
  cookie: { 
    secure: false,           // 开发环境中为 false，生产环境为 true（HTTPS）
    maxAge: 24 * 60 * 60 * 1000 // 会话有效期，这里设置为 1 天
  }
}));

// 确保CORS配置正确
app.use(cors({
    origin: 'http://localhost:3000', // 明确指定前端 origin，避免潜在 CSRF 风险
    credentials: true,
}));


app.use(express.json());
// set Routes
app.use("/api/user", require("./app/routes/userRoutes"));
app.use("/admin",require("./app/routes/adminRoutes"));
app.use('/api/cart', require('./app/routes/cartRoutes'));
app.use('/product', require('./app/routes/productRoutes'));
app.use('/order', require('./app/routes/orderRoutes'));

app.use("/payment/webhook", express.raw({ type: "application/json" }));
// app.use("/paymentTest", require("./app/routes/payment"));




app.get("/", (req, res) => {
    res.send("test project API");
})



// swagger config  ps: from swagger doc


// const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app._router.stack
    .filter(r => r.route)
    .forEach(r => {
        const methods = Object.keys(r.route.methods).join(',').toUpperCase();
        const path = r.route.path;
        console.log(`[${methods}] ${path}`);
    });

