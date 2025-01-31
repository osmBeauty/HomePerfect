const Category = require("../Models/category");
const Listing = require("../Models/listing");

module.exports.index = async (req, res) => {
    const { query } = req.query;
    let allListing;

    if (query) {
        allListing = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ]
        }).populate("category");
    } else {
        allListing = await Listing.find({}).populate("category");
    }

    res.render('./listings/index.ejs', { allListing, query });
};

module.exports.renderNewForm = async(req,res) => {
    let category = await Category.find({});
    res.render('./listings/new.ejs', {category});
};

module.exports.showListing = async(req, res)=> {
    let {id} = req.params;
    const listings = await Listing.findById(id).populate({path: "review", populate: {path: "author"}}).populate("owner").populate("category");
    if(!listings){
        req.flash("error", "Listing You Requested Does Not Exist!");
        res.redirect("/listing");
    }
    res.render('./listings/show.ejs', {listings});
};


module.exports.searchListing = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.redirect("/listing");
        }


        const listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ]
        });

        // Pass 'query' to the view
        res.render("listings/index", { listings, query });
    } catch (err) {
        req.flash("error", "Something went wrong while searching.");
        res.redirect("/listing");
    }
};

module.exports.categorySearch = async (req, res) => {
    try {
        const { category } = req.query;  // Get the category from the query string

        if (!category) {
            req.flash("error", "No category specified!");
            return res.redirect("/listing"); // Redirect to listings if no category is specified
        }

        // Assuming category is an ID that links to the category collection
        const categoryObj = await Category.findById(category); // Retrieve category object
        const listings = await Listing.find({ category: category }).populate("category");

        // Check if any listings were found
        if (listings.length === 0) {
            req.flash("error", "No products found for the selected category!");
            return res.redirect("/listing"); // Redirect if no products found for the category
        }

        // Render the listings according to the category
        res.render("./listings/showcategory.ejs", { listings, category: categoryObj }); // Pass categoryObj to the view
    } catch (err) {
        req.flash("error", "Something went wrong while searching.");
        res.redirect("/listing"); // Handle error and redirect to the listings page
    }
};




module.exports.createListing = async(req, res) => {
    let url = req.file.path;
    let fileName = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, fileName};
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
};

module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    let category = await Category.find({});
    const listings = await Listing.findById(id).populate("category");
    if(!listings){
        req.flash("error", "Listing You Requested Does Not Exist!");
        res.redirect("/listing");
    }
    res.render("./listings/edit.ejs", {listings, category});
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
        };
    req.flash("success", "Listing Edited!");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
};

