const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  [
    check("name", "Please Add Name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //Check if there is a user with same email
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User Already Exists" });
      }
      // If there is no user with email that came from req.body then create a new user instance
      user = new User({ name, email, password });
      // crypt the password with bcrpytjs
      const salt = await bcrpyt.genSalt(10);
      user.password = await bcrpyt.hash(password, salt);
      //save user to db
      await user.save();

      //set payload for sign to jwt
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
