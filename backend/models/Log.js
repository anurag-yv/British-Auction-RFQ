
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  rfqId: mongoose.Schema.Types.ObjectId,
  type: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);