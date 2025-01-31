const express = require ("express");
const router = express.Router();
const cartController = require("../controllers/cart.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");


// Cart
router.post("/",isLoggedIn, wrapAsync(cartController.cart));

//Show Cart
router.get("/",isLoggedIn, wrapAsync(cartController.showCart));

//Delete Cart
router.delete("/:id", wrapAsync(cartController.deleteCart));



module.exports = router;