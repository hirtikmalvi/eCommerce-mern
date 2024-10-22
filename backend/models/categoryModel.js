const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    maxLength: 32,
    trim: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
