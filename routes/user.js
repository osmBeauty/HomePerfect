const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

// Index Page For Website
router.get("/", (req, res)=>{
    res.redirect("/listing");
});

// User SignUp Form
router.get("/signUp", userController.renderSignupForm);

//Signup
router.post("/signUp", wrapAsync(userController.signUp));

// User Login
router.get("/login", userController.renderLoginForm);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash:true}), userController.login);

// Logout User

router.get("/logout", userController.logout);

module.exports = router;
