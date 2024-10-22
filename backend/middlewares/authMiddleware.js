const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("./asyncHandler");

//To check whether the User is Authenticated Or Not
const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;

  //Read the token from the cookies
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

//To check whether the user is Admin Or Not.
const isAdminAuthorized = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).send("Not Authorized As An Admin");
  }
};

module.exports = { isAuthenticated, isAdminAuthorized };
