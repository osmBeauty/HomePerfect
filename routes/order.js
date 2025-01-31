const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware");
const orderController = require("../controllers/order.js");

// Order
router.post("/checkout", isLoggedIn, wrapAsync(orderController.order));

// Show Received Orders
router.get("/receivedOrder", wrapAsync(orderController.receivedOrder));

// Show My Orders
router.get("/myOrder", isLoggedIn, wrapAsync(orderController.myOrder));

module.exports = router;
