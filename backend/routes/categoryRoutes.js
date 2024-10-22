const express = require("express");
const router = express.Router();

//From Category Controller
const {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  readCategory,
} = require("../controllers/categoryController");

const {
  isAuthenticated,
  isAdminAuthorized,
} = require("../middlewares/authMiddleware");

router.route("/").post(isAuthenticated, isAdminAuthorized, createCategory);

router.route("/categories").get(listCategories);

router
  .route("/:categoryId")
  .put(isAuthenticated, isAdminAuthorized, updateCategory)
  .delete(isAuthenticated, isAdminAuthorized, deleteCategory)
  .get(readCategory);

module.exports = router;
