const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");

// Route:  This route is a GET request to /api/profile/test
// Desc:   Test profile route
// Access: Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// Route:  This route is a GET request to /api/profile
// Desc:   Get current users profile
// Access: Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// Route:  This route is a GET request to /api/profile/all
// Desc:   Get all profiles
// Access: Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "Could not find any profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({ profile: "Could not find any profiles" })
    );
});

// Route:  This route is a GET request to /api/profile/handle/:handle
// Desc:   Get profile by handle
// Access: Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Could not find a profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// Route:  This route is a GET request to /api/profile/user/:user_id
// Desc:   Get profile by user ID
// Access: Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Could not find a profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// Route:  This route is a POST request to /api/profile
// Desc:   Create/edit/update user profile
// Access: Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// Route:  This route is a POST request to /api/profile/experience
// Desc:   Add experience to profile
// Access: Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// Route:  This route is a POST request to /api/profile/education
// Desc:   Add education to profile
// Access: Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// // @route   DELETE api/profile/experience/:exp_id
// // @desc    Delete experience from profile
// // @access  Private
// router.delete(
//   "/experience/:exp_id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     Profile.findOne({ user: req.user.id })
//       .then(profile => {
//         // Get remove index
//         const removeIndex = profile.experience
//           .map(item => item.id)
//           .indexOf(req.params.exp_id);

//         // Splice out of array
//         profile.experience.splice(removeIndex, 1);

//         // Save
//         profile.save().then(profile => res.json(profile));
//       })
//       .catch(err => res.status(404).json(err));
//   }
// );

// // @route   DELETE api/profile/education/:edu_id
// // @desc    Delete education from profile
// // @access  Private
// router.delete(
//   "/education/:edu_id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     Profile.findOne({ user: req.user.id })
//       .then(profile => {
//         // Get remove index
//         const removeIndex = profile.education
//           .map(item => item.id)
//           .indexOf(req.params.edu_id);

//         // Splice out of array
//         profile.education.splice(removeIndex, 1);

//         // Save
//         profile.save().then(profile => res.json(profile));
//       })
//       .catch(err => res.status(404).json(err));
//   }
// );

// // @route   DELETE api/profile
// // @desc    Delete user and profile
// // @access  Private
// router.delete(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     Profile.findOneAndRemove({ user: req.user.id }).then(() => {
//       User.findOneAndRemove({ _id: req.user.id }).then(() =>
//         res.json({ success: true })
//       );
//     });
//   }
// );

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const passport = require("passport");

// // Load validation
// const validateProfileInput = require("../../validation/profile");

// // Load profile model
// const Profile = require("../../models/Profile");

// // Load user profile
// const Usear = require("../../models/User");

// // Route:  This route is a GET request to /api/profile/test
// // Desc:   Test profile route
// // Access: Public
// router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

// // Route:  This route is a GET request to /api/profile
// // Desc:   Get current users profile
// // Access: Private
// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     const errors = {};
//     Profile.findOne({ user: req.user.id })
//       .then(profile => {
//         if (!profile) {
//           errors.noprofile = "There is no profile for this user";
//           return res.status(404).json(errors);
//         }
//         res.json(profile);
//       })
//       .catch(err => res.status(404).json(err));
//   }
// );

// // Route:  This route is a POST request to /api/profile
// // Desc:   Create/edit/update user profile
// // Access: Private
// router.post(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     const { errors, isValid } = validateProfileInput(req.body);

//     // Check validation
//     if (!isValid) {
//       return res.status(400).json(errors);
//     }
//     // Get fields
//     const profileFields = {};
//     profileFields.user = req.user.id;
//     if (req.body.handle) {
//       profileFields.handle = req.body.handle;
//     }
//     if (req.body.company) {
//       profileFields.company = req.body.company;
//     }
//     if (req.body.website) {
//       profileFields.website = req.body.website;
//     }
//     if (req.body.location) {
//       profileFields.location = req.body.location;
//     }
//     if (req.body.bio) {
//       profileFields.bio = req.body.bio;
//     }
//     if (req.body.status) {
//       profileFields.status = req.body.status;
//     }
//     if (req.body.githubusername) {
//       profileFields.githubusername = req.body.githubusername;
//     }
//     // Skills - split into array
//     if (typeof req.body.skills !== "undefined") {
//       profileFields.skills = req.body.skills.split(",");
//     }
//     // Social media
//     profileFields.social = {};
//     if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
//     if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
//     if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
//     if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
//     if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

//     Profile.findOne({ user: req.user.id }).then(profile => {
//       if (profile) {
//         // Update profile if found
//         Profile.findByIdAndUpdate(
//           { user: req.user.id },
//           { $set: profileFields },
//           { new: true }
//         ).then(profile => res.json(profile));
//       } else {
//         // Create profile is one is not found
//         // Check if handle exists
//         Profile.findOne({ handle: profileFields.handle }).then(profile => {
//           if (profile) {
//             errors.handle = "Handle already exists";
//             res.status(400).jason(errors);
//           }
//           // Save Profile if one is not found
//           new Profile(profileFields).save().then(profile => res.json(profile));
//         });
//       }
//     });
//   }
// );

// module.exports = router;
