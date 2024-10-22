const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  isAdminAuthorized,
} = require("../middlewares/authMiddleware");
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} = require("../controllers/orderController");

router
  .route("/")
  .post(isAuthenticated, createOrder)
  .get(isAuthenticated, isAdminAuthorized, getAllOrders);

router.route("/mine").get(isAuthenticated, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);

router.route("/:id").get(isAuthenticated, getOrderById);
router.route("/:id/pay").put(isAuthenticated, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(isAuthenticated, isAdminAuthorized, markOrderAsDelivered);

module.exports = router;
