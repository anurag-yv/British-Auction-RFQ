
const express = require("express");
const mongoose = require("mongoose");
const rfqRoutes = require("./routes/rfqRoutes");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/auction");

app.use("/api", rfqRoutes);

app.listen(5000, () => console.log("Server running"));