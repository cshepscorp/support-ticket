const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
// @desc   Register a new user
// @route  /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    // 400 level error
    res.status(400);
    throw new Error('Please include all fields');
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });

  // if user exists
  if (userExists) {
    res.status(400);
    throw new Error('user already exists');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('invalid user data');
  }
  //res.send('Register Route');
});

// @desc   Login a user
// @route  /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // check user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // unauth
    throw new Error('Invalid credentials');
  }
  //res.send('Login Route');
});

// @desc   Get my own data as logged in user
// @route  /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(user);
  // wouldjust return ALL data
  //  res.status(200).json(req.user);
  //res.send('the only me is me!');
});

// @desc   Get all users
// @route  /api/users
// @access Public just for testing
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
  // wouldjust return ALL data
  //  res.status(200).json(req.user);
  //res.send('the only me is me!');
});

// Generate JSON web token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
};
