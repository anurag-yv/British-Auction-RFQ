// controllers/bidController.js
const RFQ = require("../models/RFQ");
const Bid = require("../models/Bid");
const Log = require("../models/Log");
const { shouldExtend } = require("../utils/auctionUtils");

exports.placeBid = async (req, res) => {
  try {
    const { rfqId, supplier, price } = req.body;
    const currentTime = new Date();

    // Save bid
    const bid = await Bid.create({ rfqId, supplier, price });

    const rfq = await RFQ.findById(rfqId);

    let extended = false;

    if (shouldExtend(currentTime, rfq.closeTime, rfq.triggerWindow)) {

      let newClose = new Date(rfq.closeTime.getTime() + rfq.extensionDuration * 60000);

      // IMPORTANT constraint
      if (newClose > rfq.forcedCloseTime) {
        newClose = rfq.forcedCloseTime;
      }

      if (newClose > rfq.closeTime) {
        rfq.closeTime = newClose;
        await rfq.save();
        extended = true;

        await Log.create({
          rfqId,
          type: "EXTENSION",
          message: "Auction extended due to last-minute bid"
        });
      }
    }

    // Log bid
    await Log.create({
      rfqId,
      type: "BID",
      message: `${supplier} placed bid ₹${price}`
    });

    res.json({ success: true, extended });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};