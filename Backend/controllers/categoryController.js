const Category = require("../models/Category");

//=====================
// Create
//=====================
exports.createCategory = async (
    req,
    res
) => {
    try {
        const category =
            await Category.create({
                name: req.body.name,
                description: req.body.description,
                color: req.body.color,
                user: req.user._id,
            });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
//=====================
// Get
//=====================
exports.getCategories = async (
    req,
    res
) => {
    try {
        const categories =
            await Category.find({
                user: req.user._id
            }).sort({
                name: 1
            });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//=====================
// Update
//=====================

exports.updateCategory = async (
    req,
    res
) => {
    try {
        const category =
            await Category.findOne({
                _id: req.params.id,
                user: req.user._id,
            });
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        category.name = req.body.name;
        category.description = req.body.description;
        category.color = req.body.color;
        await category.save();
        res.json(category);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
//=====================
// Delete
//=====================
exports.deleteCategory = async (
    req,
    res
) => {
    try {
        await Category.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        res.json({
            message: "Category deleted"
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};