// models/Bid.js
const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  rfqId: mongoose.Schema.Types.ObjectId,
  supplier: String,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bid", bidSchema);