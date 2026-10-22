require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("MongoDB Error:", err.message));

app.get("/", (req, res) => {
  res.send("LinkVault Backend is Running!");
});
const { randomBytes } = require("crypto");

const linkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 }
});

const Link = mongoose.model("Link", linkSchema);

app.post("/api/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !/^https?:\/\/.+/i.test(url)) {
      return res.status(400).json({ error: "Enter a valid URL" });
    }

    const shortCode = randomBytes(6).toString("hex");

    const link = await Link.create({
      originalUrl: url,
      shortCode
    });

    res.json({
      shortUrl: `http://localhost:5000/${link.shortCode}`,
      shortCode: link.shortCode
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOneAndUpdate(
      { shortCode: req.params.code },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!link) return res.status(404).send("Link not found");

    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
app.get("/api/stats/:code", async (req, res) => {
  try {
    const link = await Link.findOne({
      shortCode: req.params.code
    });

    if (!link) {
      return res.status(404).json({
        error: "Link not found"
      });
    }

    res.json({
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      totalClicks: link.clicks
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error"
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
