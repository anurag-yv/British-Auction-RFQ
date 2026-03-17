// models/RFQ.js
const mongoose = require("mongoose");

const rfqSchema = new mongoose.Schema({
  name: String,
  startTime: Date,
  closeTime: Date,
  forcedCloseTime: Date,
  triggerWindow: Number, // X
  extensionDuration: Number, // Y
  status: { type: String, default: "ACTIVE" }
});

module.exports = mongoose.model("RFQ", rfqSchema);