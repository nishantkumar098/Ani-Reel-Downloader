const express = require("express");

const router = express.Router();

const {
  downloadReel,
} = require("../controllers/reelController");

router.post("/download", downloadReel);

module.exports = router;