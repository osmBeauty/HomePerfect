const express = require ("express");
const router = express.Router();
const {isLoggedIn, isOwner} = require("../middleware.js");
const {listingSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require ("../cloudConfig.js");
const upload = multer({storage});




const validateListing = (req,res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
};



//Index Route

router.get("/", wrapAsync(listingController.index));

// Search Route
router.get("/search", wrapAsync(listingController.searchListing));

// Category Search Route
router.get("/category", wrapAsync(listingController.categorySearch));


//New Route

router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//Show Route

router.get("/:id", wrapAsync(listingController.showListing));

//Create Route

router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

//Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route

router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

// Delete Route

router.delete("/:id", isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing));


module.exports = router;