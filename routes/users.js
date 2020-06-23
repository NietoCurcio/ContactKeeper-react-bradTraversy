const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register an user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Valid email please').isEmail(),
    check('password', 'Enter password with 6 or more characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      // array of errors
    }
    const { name, email, password } = req.body;

    try {
      //  everything that fetch, get some date, or transform like mongoose or bcrypt takes a promise
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      // as we create a new istance of User we can use his methods

      const payload = {
        // payload - the object which will be send in the token
        user: {
          id: user.id,
        },
      };

      // sign generate a token, which takes parameters like: payload, jwtSecret, object of options, callback with err and token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
          // send backjson web token
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
      // The user don't need to know what happens, so console.error is that
    }
  }
);

module.exports = router;
