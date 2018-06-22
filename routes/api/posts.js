const express = require("express");
const router = express.Router();

// Route:  This route is a GET request to /api/posts/test
// Desc:   Test posts route
// Access: Public

router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

module.exports = router;
