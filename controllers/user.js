const User = require("../Models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("./user/signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    let {name, username, email, password}= req.body;
    const newUser = new User({name, email, username});
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.flash("success", "Welcome to HomePerfects");
    res.redirect("/listing"); 
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('./user/login.ejs');
};

module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome Back to HomePerfects!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl); 
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err){
            next(err);
        }
        req.flash("success", "You are Logged Out!");
        res.redirect("/listing");
    });
}