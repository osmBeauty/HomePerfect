const Order = require("../Models/order");
const Cart = require("../Models/cart");


module.exports.order = async (req, res) => {
    try {
        let totalPayment = req.body.payment;
        let itemQuantity = req.body.quantity;
        const cartItems = await Cart.find({ user: req.user._id });

        if (cartItems.length === 0) {
            req.flash("error", "Your cart is empty!");
            return res.redirect("/cart");
        }

        // let totalPayment = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 200);

        const newOrder = new Order({
            user: req.user._id,
            quantity: itemQuantity,
            payment: totalPayment, 
            payment_status: "pending",
            payment_method: "Online",
            status: "pending",
        });

        await newOrder.save();
        await Cart.deleteMany({ user: req.user._id });

        req.flash("success", "Order placed successfully!");
        res.redirect("/listing");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong! Please try again.");
        res.redirect("/cart");
    }
};


module.exports.receivedOrder = async(req, res) => {
    let orders = await Order.find({}).populate("user");
    res.render("./listings/receivedOrder.ejs", {orders});
};

module.exports.myOrder = async (req, res) => {
    try {
        let userOrder = await Order.find({ user: req.user._id }).populate('user');
        res.render("listings/myOrder.ejs", { userOrder });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Server Error");
    }
};