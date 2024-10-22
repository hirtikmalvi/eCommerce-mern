const asyncHandler = require("../middlewares/asyncHandler"); //Middleware
const Category = require("../models/categoryModel"); //Category Model

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Category Name is required",
      });
    }
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        message: `${name} category already exists`,
      });
    }
    const category = await new Category({ name }).save();
    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Category Couldn't be created!",
      error: error,
    });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const categoryToRemove = await Category.findByIdAndDelete(
    req.params.categoryId
  );
  if (categoryToRemove) {
    return res.status(200).json(categoryToRemove);
  } else {
    return res.status(200).json({
      message: "Category Not Exists",
    });
  }
});

const listCategories = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({});
  if (allCategories.length == 0) {
    return res.status(404).json({
      message: "No Category Found",
    });
  }
  return res.status(200).json(allCategories);
});

const readCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById({ _id: req.params.categoryId });

  if (!category) {
    return res.status(404).json({
      message: "No Category Found",
    });
  }
  return res.status(200).json(category);
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  readCategory,
};
