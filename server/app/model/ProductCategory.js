const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductCategory = new mongoose.Schema({
    name:{type:String,required:true},
    desc:{type:String,required:true},

})
// this will add Id and growth it auto
ProductCategory.plugin(AutoIncrement, { inc_field: "ProductCateId" });
module.exports = mongoose.model("ProductCategory",ProductCategory);