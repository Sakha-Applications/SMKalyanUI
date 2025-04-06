const express = require("express");
const { getNakshatras } = require("../controllers/nakshatraController");

const router = express.Router();

// Route to fetch all Gotras
router.get("/nakshatras", getNakshatras);

module.exports = router;
