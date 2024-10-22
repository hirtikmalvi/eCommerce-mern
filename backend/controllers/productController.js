const asyncHandler = require("../middlewares/asyncHandler");
const { checkId } = require("../middlewares/checkId");
const Product = require("../models/productModel");

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand } = req.fields;

  switch (true) {
    case !name:
      return res.json({ error: "Name is requires" });
    case !description:
      return res.json({ error: "description is requires" });
    case !price:
      return res.json({ error: "price is requires" });
    case !category:
      return res.json({ error: "category is requires" });
    case !quantity:
      return res.json({ error: "quantity is requires" });
    case !brand:
      return res.json({ error: "brand is requires" });
  }

  const product = new Product({ ...req.fields });
  await product.save();
  res.status(200).json(product);
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand } = req.fields;

  // Validation
  switch (true) {
    case !name:
      return res.json({ error: "Name is required" });
    case !brand:
      return res.json({ error: "Brand is required" });
    case !description:
      return res.json({ error: "Description is required" });
    case !price:
      return res.json({ error: "Price is required" });
    case !category:
      return res.json({ error: "Category is required" });
    case !quantity:
      return res.json({ error: "Quantity is required" });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.fields },
    { new: true }
  );

  if (product) {
    await product.save();
    return res.status(200).json(product);
  } else {
    return res.status(404).json({ message: "Product Not Found" });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (product) {
    return res.status(200).json(product);
  } else {
    return res.status(404).json({ message: "Product Not Found" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword }).limit(pageSize);

  if (products.length == 0) {
    return res.status(404).json({ message: "No Products Available" });
  } else {
    return res.status(200).json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.status(200).json(product);
  } else {
    return res.status(404).json({ message: "Product Not Found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .limit(12)
    .sort({ createAt: -1 });

  if (products.length == 0) {
    return res.status(404).json({ message: "No Products Available" });
  } else {
    return res.status(200).json(products);
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Review Already Added" });
    }

    const review = {
      name: req.user.userName,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.numReviews;
    await product.save();
    return res.status(201).json({ message: "Review Added" });
  } else {
    return res.status(400).json({ message: "Product Not Found" });
  }
});

const fetchtopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);

  if (products.length == 0) {
    return res.status(404).json({ message: "No Top Products Available" });
  } else {
    return res.status(200).json(products);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ _id: -1 });
  if (products.length == 0) {
    return res.status(404).json({ message: "No New Products Available" });
  } else {
    return res.status(200).json(products);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked, radio, checkedBrands } = req.body;

  let args = {};

  if (checked.length) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
  if (checkedBrands.length) args.brand = checkedBrands;

  const products = await Product.find(args);

  if (products.length == 0) {
    return res.status(404).json({ message: "No Products found" });
  } else {
    return res.status(200).json(products);
  }
});

module.exports = {
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
};
