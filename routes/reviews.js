const express = require ("express");
const router = express.Router({mergeParams: true});
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require('../utils/expressError.js');
const reviewController = require("../controllers/reviews.js");


const validateReview = (req,res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
};

// Add Review

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;