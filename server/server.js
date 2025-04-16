const express = require("express");
const app = express();
const port =  3000;
const mongoose = require("mongoose");
const session = require("express-session");
// const swaggerUi = require("swagger-ui-express");
// const swaggerJsdoc = require("swagger-jsdoc");
const orderRoutes = require('./app/routes/orderRoutes');
const bodyParser =  require('body-parser');
const cors = require("cors");

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

app.use(cors());
app.use(express.json());
// set Routes
app.use("/user",require("./app/routes/userRoutes"));
app.use("/admin",require("./app/routes/adminRoutes"));
app.use('/api/cart', require('./app/routes/cartRoutes'));
app.use('/product', require('./app/routes/productRoutes'));
app.use('/order', require('./app/routes/orderRoutes'));


app.use("/imgs",express.static("imgs"));


app.get("/", (req, res) => {
    res.send("test project API");
})



// swagger config  ps: from swagger doc


// onst swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api/orders', orderRoutes);
app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
