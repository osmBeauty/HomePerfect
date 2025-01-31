const Category = require("../Models/category.js");

module.exports.newCategoryForm = async(req,res) => {
    res.render('./listings/newCategory.ejs');
};

module.exports.createCategory = async(req, res) => {
    const { name } = req.body.category;
    const existingCategory = await Category.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (existingCategory) {
        req.flash("error", "Category already exists!");
        return res.redirect("/listing");
    }
    
    const newCategory = new Category(req.body.category);
    newCategory.owner = req.user._id;
    await newCategory.save();
    req.flash("success", "New Category Created!");
    res.redirect("/listing");
};
