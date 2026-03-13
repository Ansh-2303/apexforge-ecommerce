const Category = require("../models/category.model");

exports.createCategory = async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json(category);
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};


exports.updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  category.name = req.body.name || category.name;

  const updated = await category.save();
  res.json(updated);
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await category.deleteOne();
  res.json({ message: "Category deleted" });
};