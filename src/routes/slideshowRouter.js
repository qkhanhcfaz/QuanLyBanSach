const express = require("express");
const router = express.Router();

// Import models
const { Slideshow } = require("../models");
const { getPublicSlideshows } = require("../controllers/slideshowController");

// PUBLIC ROUTES
router.get("/public", getPublicSlideshows);
router.get("/", (req, res) => {
  res.json({ message: "Slideshow API Ready" });
});

module.exports = router;
