const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Get current logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // id: user.id
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Auth user and get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // Check email
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // check the password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // payload - the object which will be send in the token
      const payload = {
        user: {
          id: user.id,
        },
      };
      // sign generate a token, this takes
      // payload, secret, object options, callback(err, token)
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          // throw send what is in throw err to catch(err), look https://www.w3schools.com/jsref/jsref_throw.asp
          //  and the catch capture this error
          // console.log(token);
          // console.log({ token });
          res.json({ token });
          // Notice how we can send json with a data in a object
          // So json can be a javascript object
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
