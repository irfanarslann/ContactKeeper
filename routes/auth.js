const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const config = require("config");

// @route   GET api/auth
// @desc    Auth
// @access  Private
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more charater"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Bad Credientals" });
      }
      const isMatch = await bcrpyt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Bad Credientals" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get("jwtSecret"), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("SERVER Error");
    }
  }
);
// @route   GET api/auth
// @desc    Get logged in users
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
  }
});
module.exports = router;
