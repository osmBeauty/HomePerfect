const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    icon: String,
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Category", categorySchema);