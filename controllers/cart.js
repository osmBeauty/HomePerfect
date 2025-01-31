const Cart = require("../Models/cart");
const Listing = require("../Models/listing");


module.exports.cart = async (req, res) => {
    try {
        const productId = req.body.product;
        const product = await Listing.findById(productId);

        let cartItem = await Cart.findOne({ user: req.user._id, product: product._id });

        if (cartItem) {
            cartItem.quantity += 1;
            cartItem.price = cartItem.quantity * product.price;
            await cartItem.save();
        } else {
            cartItem = new Cart({
                user: req.user._id,
                product: product._id,
                quantity: 1,
                price: product.price,
                status: "pending"
            });
            await cartItem.save();
            
        }
        req.flash("success", "Product added to cart!");
        res.redirect("/listing");
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong.");
        res.redirect("/listing");
    }
};

module.exports.showCart = async(req, res) => {
    let cart = await Cart.find({ user: req.user._id }).populate("user").populate("product");
    res.render("./listings/cart.ejs", {cart});
};

module.exports.deleteCart = async(req, res) => {
    let {id} = req.params;
    let deleteCart = await Cart.findByIdAndDelete(id);
    console.log(deleteCart);
    req.flash("success", "Product Deleted From Cart!");
    res.redirect("/cart");
};