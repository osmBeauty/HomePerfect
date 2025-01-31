const express = require ("express");
const router = express.Router();
const categoryController = require("../controllers/category.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require('../utils/expressError.js');
const {isLoggedIn} = require("../middleware.js");
const {categorySchema} = require("../schema.js");



const validateCategory = (req,res, next) => {
    let {error} = categorySchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
};


// Category Form
router.get("/newCategory", isLoggedIn, wrapAsync(categoryController.newCategoryForm));

//Create Category
router.post("/", isLoggedIn, validateCategory, wrapAsync(categoryController.createCategory));


module.exports = router;