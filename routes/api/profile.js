const express = require("express");
const router = express.Router();

// Route:  This route is a GET request to /api/profile/test
// Desc:   Test profile route
// Access: Public

router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

module.exports = router;
