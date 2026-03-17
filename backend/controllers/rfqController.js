// controllers/rfqController.js
const Bid = require("../models/Bid");

exports.getBids = async (req, res) => {
  const { rfqId } = req.params;

  const bids = await Bid.find({ rfqId }).sort({ price: 1 });

  const ranked = bids.map((b, i) => ({
    ...b._doc,
    rank: `L${i + 1}`
  }));

  res.json(ranked);
};