const express = require("express");
const router = express.Router();

// ===== IN-MEMORY STORAGE =====
let rfqs = [];
let bids = [];
let logs = [];

// ===== CREATE RFQ =====
router.post("/rfq", (req, res) => {
  const {
    name,
    startTime,
    closeTime,
    forcedCloseTime,
    triggerWindow,
    extensionDuration
  } = req.body;

  // ===== VALIDATION =====
  if (!name || !startTime || !closeTime || !forcedCloseTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (new Date(startTime) >= new Date(closeTime)) {
    return res.status(400).json({
      error: "Start time must be before close time"
    });
  }

  if (new Date(forcedCloseTime) <= new Date(closeTime)) {
    return res.status(400).json({
      error: "Forced close must be after close time"
    });
  }

  const newRFQ = {
    _id: Date.now().toString(),
    name,
    startTime: new Date(startTime),
    closeTime: new Date(closeTime),
    forcedCloseTime: new Date(forcedCloseTime),
    triggerWindow: Number(triggerWindow) || 5,
    extensionDuration: Number(extensionDuration) || 2,
    status: "Active",
    lowestBid: null
  };

  rfqs.push(newRFQ);

  logs.push({
    _id: Date.now().toString(),
    rfqId: newRFQ._id,
    message: `📢 RFQ Created: ${name}`,
    createdAt: new Date()
  });

  res.json({ message: "RFQ created successfully", rfq: newRFQ });
});

// ===== GET ALL RFQs =====
router.get("/rfqs", (req, res) => {
  res.json(rfqs);
});

// ===== GET SINGLE RFQ =====
router.get("/rfq/:id", (req, res) => {
  const rfq = rfqs.find(r => r._id === req.params.id);

  if (!rfq) {
    return res.status(404).json({ error: "RFQ not found" });
  }

  res.json(rfq);
});

// ===== GET BIDS =====
router.get("/bids/:rfqId", (req, res) => {
  const rfqBids = bids
    .filter(b => b.rfqId === req.params.rfqId)
    .sort((a, b) => a.price - b.price)
    .map((b, index) => ({
      ...b,
      rank: "L" + (index + 1)
    }));

  res.json(rfqBids);
});

// ===== GET LOGS =====
router.get("/logs/:rfqId", (req, res) => {
  const rfqLogs = logs.filter(l => l.rfqId === req.params.rfqId);
  res.json(rfqLogs);
});

// ===== PLACE BID =====
// ===== PLACE BID WITH EXTENSION REASONS =====
router.post("/bid", (req, res) => {
  const { rfqId, supplier, price } = req.body;

  if (!rfqId || !supplier || !price) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const rfq = rfqs.find(r => r._id === rfqId);
  if (!rfq) return res.status(404).json({ error: "RFQ not found" });

  const now = new Date();

  if (now < new Date(rfq.startTime)) return res.status(400).json({ error: "Auction not started yet" });
  if (now > new Date(rfq.forcedCloseTime)) {
    rfq.status = "Closed";
    return res.status(400).json({ error: "Auction forcibly closed" });
  }
  if (now > new Date(rfq.closeTime)) return res.status(400).json({ error: "Auction is closed" });

  // ===== PLACE BID =====
  const newBid = { _id: Date.now().toString(), rfqId, supplier, price: Number(price) };
  bids.push(newBid);

  // ===== GET LOWEST BEFORE BID =====
  const previousLowest = rfq.lowestBid;
  const rfqBids = bids.filter(b => b.rfqId === rfqId);
  const minBid = Math.min(...rfqBids.map(b => b.price));
  rfq.lowestBid = minBid;

  // ===== DETERMINE TRIGGER =====
  const timeLeft = (new Date(rfq.closeTime) - now) / 60000;
  let extensionReason = null;

  if (timeLeft <= rfq.triggerWindow && now < new Date(rfq.forcedCloseTime)) {
    // a) Bid received in trigger window
    extensionReason = "Bid received in trigger window";

    // b) Any supplier rank change in trigger window
    // We'll check if L1 (lowest bid) changed
    const sortedBids = [...rfqBids].sort((a, b) => a.price - b.price);
    const newLowestSupplier = sortedBids[0]?.supplier;
    if (previousLowest !== null && previousLowest !== sortedBids[0].price) {
      extensionReason = "Lowest bidder (L1) rank change in trigger window";
    }

    // Extend the auction
    const oldClose = new Date(rfq.closeTime);
    rfq.closeTime = new Date(oldClose.getTime() + rfq.extensionDuration * 60000);

    logs.push({
      _id: Date.now().toString(),
      rfqId,
      message: `⏱ Auction extended by ${rfq.extensionDuration} minute(s) due to: ${extensionReason}`,
      createdAt: new Date(),
      reason: extensionReason,
      type: "extension",
      oldCloseTime: oldClose,
      newCloseTime: rfq.closeTime
    });
  }

  // ===== LOG BID =====
  logs.push({
    _id: Date.now().toString(),
    rfqId,
    message: `${supplier} placed bid ₹${price}`,
    createdAt: new Date(),
    type: "bid",
    bidPrice: price,
    supplier
  });

  res.json({ message: "Bid placed successfully" });
});

module.exports = router;