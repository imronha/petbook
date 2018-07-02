const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load post model
const post = require("../../models/post");

// Load validation file
const validatePostInput = require("../../validation/post");

// Route:  This route is a GET request to /api/posts/test
// Desc:   Test posts route
// Access: Public
router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

// Route:  POST request to /api/posts
// Desc:   Create Post
// Access: Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
