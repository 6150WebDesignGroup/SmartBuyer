const express = require("express");
const app = express();
const port =  3000;
const mongoose = require("mongoose");
// const swaggerUi = require("swagger-ui-express");
// const swaggerJsdoc = require("swagger-jsdoc");
const orderRoutes = require('./app/routes/orderRoutes');
const bodyParser =  require('body-parser');
const cors = require("cors");


const MongoUrl = 'mongodb://localhost:27017/Assignment8';
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



app.use("/imgs",express.static("imgs"));


app.get("/", (req, res) => {
    res.send("test project API");
})



// swagger config  ps: from swagger doc


// onst swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/orders', orderRoutes);