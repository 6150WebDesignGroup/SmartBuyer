const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const PageSetup = new mongoose.Schema({
    BackgroundImg: [{ type: String, required: true }],
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    CarouselImg:[{type: String}],
    lastUpdated: {type: Date},
})
// this will add Id and growth it auto
PageSetup.plugin(AutoIncrement, { inc_field: "setUpId" });
module.exports = mongoose.model("PageSetup",PageSetup);