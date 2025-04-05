const mongoose = require('mongoose');

//todo need to design it later
const PayMethod = new mongoose.Schema({
    userEmail: { type: String, unique: true, required: true },
})
module.exports = mongoose.model("PayMethod",PayMethod);