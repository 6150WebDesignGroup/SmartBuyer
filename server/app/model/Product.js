const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Product = new mongoose.Schema({
    name:{type:String,required:true},
    categoryName:{type:String,required:true},
    desc:{type:String,required:true},
    price:{type:Number,required:true},
    ProductNumber:{type:String,required:true},
    // using array to store multi files
    ProductImages: [{ type: String, required: true }]
})

// this will add id and growth auto
Product.plugin(AutoIncrement, { inc_field: "Id" });
module.exports = mongoose.model("Product",Product);