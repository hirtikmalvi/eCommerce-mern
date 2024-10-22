const express = require("express");

const {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} = require("../controllers/userController");

const {
  isAuthenticated,
  isAdminAuthorized,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(isAuthenticated, isAdminAuthorized, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(isAuthenticated, getCurrentUserProfile)
  .put(isAuthenticated, updateCurrentUserProfile);

//Admin Routes
router
  .route("/:id")
  .delete(isAuthenticated, isAdminAuthorized, deleteUserById)
  .get(isAuthenticated, isAdminAuthorized, getUserById)
  .put(isAuthenticated, isAdminAuthorized, updateUserById);

module.exports = router;
