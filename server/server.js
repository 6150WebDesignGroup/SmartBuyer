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
const session = require('express-session');

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
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
// set Routes
app.use("/api/user", require("./app/routes/userRoutes"));
app.use("/admin",require("./app/routes/adminRoutes"));
app.use('/api/cart', require('./app/routes/cartRoutes'));
app.use('/product', require('./app/routes/productRoutes'));


app.use("/imgs",express.static("imgs"));


app.get("/", (req, res) => {
    res.send("test project API");
})



// swagger config  ps: from swagger doc


// onst swaggerDocs = swaggerJsdoc(swaggerOptions);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // 在开发环境中设为false
}));

