const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const User = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:String,unique:true},
    pwd:{type:String,required:true},
    role:{type:String,default:null},
})
// this will add Id and growth it auto
User.plugin(AutoIncrement, { inc_field: "Id" });
module.exports = mongoose.model("User",User);
