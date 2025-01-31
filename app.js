if(process.env.Node_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require ("express-session");
const Path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./Models/user.js");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const Category = require("./Models/category");
const Cart = require("./Models/cart");


const orderRouter = require("./routes/order.js");
const categoryRouter = require("./routes/category.js");
const cartRouter = require("./routes/cart.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

//Database URL
const dbURL = process.env.ATLASDB_URL;

// Connecting to dataBase

main().then(()=>{
    console.log("Connected to Database");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbURL);
}

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error", (err) => {
    console.log("Error in Store", err);
});


const sessionOption ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};



app.set('view engine', 'ejs');
app.set('views', Path.join(__dirname, 'views'));
app.use(session(sessionOption));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(Path.join(__dirname, '/public')));
app.use(passport.initialize());

app.use(passport.session());
app.use(flash());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Flash Messages
app.use(async(req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    res.locals.categories = await Category.find({});
    res.locals.cartNum = req.user ? await Cart.countDocuments({ user: req.user._id }) : 0;
    next();
});

app.use("/listing", listingRouter);
app.use("/categories", categoryRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Error Handling

app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let{statusCode=500, message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

//Server Setup

app.listen(8080, ()=>{
    console.log("Server Started");
});