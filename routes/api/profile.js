const express = require("express");
const router = express.Router();

// This route includes /api/users from server.js routes
router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

module.exports = router;