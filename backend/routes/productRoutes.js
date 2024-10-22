const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  isAdminAuthorized,
} = require("../middlewares/authMiddleware");
const { checkId } = require("../middlewares/checkId");
const formidable = require("express-formidable");

const {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchtopProducts,
  fetchNewProducts,
  filterProducts,
} = require("../controllers/productController");

router
  .route("/")
  .get(fetchProducts)
  .post(isAuthenticated, isAdminAuthorized, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);

router.route("/:id/reviews").post(isAuthenticated, checkId, addProductReview);

router.route("/top").get(fetchtopProducts);
router.route("/new").get(fetchNewProducts);
router.route("/filtered-products").post(filterProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(isAuthenticated, isAdminAuthorized, formidable(), updateProductDetails)
  .delete(isAuthenticated, isAdminAuthorized, removeProduct);

module.exports = router;
