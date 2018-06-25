const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load profile model
const Profile = require("../../models/Profile");

// Load user profile
const Usear = require("../../models/User");

// Route:  This route is a GET request to /api/profile/test
// Desc:   Test profile route
// Access: Public
router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

// Route:  This route is a GET request to /api/profile
// Desc:   Get current users profile
// Access: Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    });
  }
);

module.exports = router;
