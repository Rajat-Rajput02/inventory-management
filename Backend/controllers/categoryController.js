const Category = require("../models/Category");
const Product = require("../models/Product");

const normalizeName = (value) => String(value || "").trim();

const sameNameFilter = (name) => ({
  name: { $regex: `^${normalizeName(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
});

//=====================
// Create
//=====================
exports.createCategory = async (req, res) => {
  try {
    const name = normalizeName(req.body.name);

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({
      user: req.user._id,
      ...sameNameFilter(name),
    });

    if (exists) {
      return res.status(409).json({
        message: `Category "${name}" already exists.`,
        field: "name",
      });
    }

    const category = await Category.create({
      name,
      description: req.body.description,
      color: req.body.color,
      user: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//=====================
// Get
//=====================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//=====================
// Update
//=====================
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const name = normalizeName(req.body.name);

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({
      user: req.user._id,
      ...sameNameFilter(name),
      _id: { $ne: category._id },
    });

    if (exists) {
      return res.status(409).json({
        message: `Category "${name}" already exists.`,
        field: "name",
      });
    }

    category.name = name;
    category.description = req.body.description ?? category.description;
    category.color = req.body.color ?? category.color;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//=====================
// Delete
//=====================
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const inUse = await Product.exists({
      category: category._id,
      owner: req.user._id,
    });

    if (inUse) {
      return res.status(409).json({
        message: `Cannot delete category "${category.name}" because it is used by one or more products.`,
      });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
