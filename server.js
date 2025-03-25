const express = require("express");
const app = express();
const port =  3000;
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const bodyParser =  require('body-parser');
const routes = require('./app/routes/routes');
const cors = require("cors");


const MongoUrl = 'mongodb://localhost:27017/Assignment8';
// const MongoPort = 5000;
mongoose.connect(MongoUrl,{useNewUrlParser:true,useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/user",require("./app/routes/routes"));
app.use("/imgs",express.static("imgs"));
app.get("/", (req, res) => {
    res.send("test project API");
})



// swagger config  ps: from swagger doc
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Assignment8",
            version: "1.0.0",
            description: "RESTful API for managing users",
        },
        servers: [
            {
                url: "http://localhost:3000", // 你的后端地址
            },
        ],
    },
    apis: ["./app/routes/*.js"], // ⭐ 写你路由文件的路径
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
