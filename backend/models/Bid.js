
const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  rfqId: mongoose.Schema.Types.ObjectId,
  supplier: String,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});
const newBid = {
  _id: Date.now().toString(),
  rfqId,
  supplier,
  price: Number(price),       
  carrierName,                   
  freightCharges,                
  originCharges,                 
  destinationCharges,           
  transitTime,                  
  validity,                       
  createdAt: new Date()
};
module.exports = mongoose.model("Bid", bidSchema);