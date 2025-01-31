const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    quantity:{
        type:Number,
        default: 1,
    },
    payment: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    payment_status: String,
    payment_method: String,
    status:{
        type:String,
        default: "pending",
    },
});


const Order = mongoose.model("Order", orderSchema);
module.exports = Order;