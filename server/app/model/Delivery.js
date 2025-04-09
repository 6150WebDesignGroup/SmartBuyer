const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const DeliveryItemSchema=new mongoose.Schema({
    order:{type: mongoose.Schema.Types.ObjectId, ref: "Order",required:true},
})


const DeliverySchema = new mongoose.Schema({
    name:{type:String,required:true},
    orderItem: DeliveryItemSchema,
    status:[{type:String,required:true}],// shipped, moving , out for delivery, delivered

})

// this will add Id and growth it auto
DeliverySchema.plugin(AutoIncrement, { inc_field: "DeliveryId" });
module.exports = mongoose.model("Delivery",DeliverySchema);