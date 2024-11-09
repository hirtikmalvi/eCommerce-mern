const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const asyncHandler = require("../middlewares/asyncHandler");
const timers = new Map(); // Stores timers for each order

//Utility Function
const calculatePrices = (orderItems) => {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
};

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );

    if (!matchingItemFromDB) {
      res.status(404);
      throw new Error(`Product not found: ${itemFromClient._id}`);
    }
    return {
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.price,
      _id: undefined,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calculatePrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Start a timer to delete the order if it is not paid within 1.5 minutes
  const deleteTimeOut = setTimeout(async () => {
    const foundOrder = await Order.findById(createdOrder._id);
    if (foundOrder && !foundOrder.isPaid) {
      await Order.findByIdAndDelete(createdOrder._id);
      console.log(`Order ${createdOrder._id} has been deleted due to timeout.`);
    }
    timers.delete(createdOrder._id.toString());
  }, 60 * 1000);
  timers.set(createdOrder._id.toString(), deleteTimeOut);

  return res.status(200).json(createdOrder);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find({}).populate("user", "id userName");
  if (allOrders.length == 0) {
    return res.status(404).json({
      message: "No Orders Found",
    });
  } else {
    return res.status(200).json(allOrders);
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userOrders = await Order.find({ user: req.user._id }).populate(
    "user",
    "id userName"
  );
  if (userOrders.length == 0) {
    return res.status(404).json({
      message: "No Orders Found",
    });
  } else {
    return res.status(200).json(userOrders);
  }
});

const countTotalOrders = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  return res.status(200).json({ totalOrders });
});

const calculateTotalSales = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return res
    .status(200)
    .json({ totalSales: parseFloat(totalSales.toFixed(2)) });
});

const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  const salesByDate = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
        },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  return res.status(200).json(salesByDate);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "userName email"
  );

  if (order) {
    return res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Cancel the deletion timer if payment is successful
    const timer = timers.get(order._id.toString());
    if (timer) {
      clearTimeout(timer);
      timers.delete(order._id.toString());
    }

    order.orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      console.log("Before: ", product.countInStock);
      product.countInStock = product.countInStock - item.quantity;
      console.log("After: ", product.countInStock);

      await product.save();
    });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    return res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
