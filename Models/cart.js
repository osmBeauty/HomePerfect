const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "listing",
    },
    quantity:{
        type:Number,
        default: 1,
    },
    price: Number,
});


const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;