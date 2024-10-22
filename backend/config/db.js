const mongoose = require("mongoose");

const connectMongoDB = async () => {
  return await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected!");
    })
    .catch((err) => {
      console.error(`ERROR: ${err.message}`);
      process.exit(1);
    });
};

module.exports = {
  connectMongoDB,
};
