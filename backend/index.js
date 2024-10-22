//Packages
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

//Utils
const { connectMongoDB } = require("./config/db");
const userRoute = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
const PORT = process.env.PORT || 5000;

//MongoDB Connection
connectMongoDB();

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/users", userRoute); // User Routes
app.use("/api/category", categoryRoutes); //Category Routes
app.use("/api/products", productRoutes); //Product Routes
app.use("/api/upload", uploadRoutes); //File/Image Upload Route
app.use("/api/orders", orderRoutes); //Order Routes

//Paypal configuration
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.use("/uploads", express.static(path.join(path.resolve() + "/uploads")));

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
