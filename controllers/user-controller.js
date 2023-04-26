const User = require('../models/user-model');
const HttpError = require('../models/http-error');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (req, res, next) => {
  let user;
  const { name, username, password } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await Bcrypt.hash(password, 12);
  } catch (err) {}
  const newUser = new User({
    name,
    username,
    password: hashedPassword,
  });
  let token;
  try {
    token = jwt.sign(
      { username: username, userid: newUser.id },
      'EyasuSecret_Code'
    );
  } catch (err) {
    console.log(err);
  }

  try {
    user = await newUser.save();
  } catch (err) {
    console.log(err);
  }
  res.json({ userid: newUser.id, username: newUser.username, token: token });
};
const login = async (req, res, next) => {
  const { username, password } = req.body;
  let existUser;
  try {
    existUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError('Login Faild', 500);
    return next(error);
  }
  if (!existUser) {
    const error = new HttpError('Username is not corect please try again', 500);
    return next(error);
  }
  let isValidPassword;
  try {
    isValidPassword = await Bcrypt.compare(password, existUser.password);
  } catch (err) {
    const error = new HttpError('Login Faild', 500);
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError('Login Faild', 500);
    return next(error);
  }
  let token;

  try {
    token = jwt.sign(
      { userId: existUser.id, username: existUser.username },
      'EyasuSecret_Code'
      // { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('Login Faild', 500);
    return next(error);
  }
  res
    .status(202)
    .json({ userId: existUser.id, username: existUser.username, token: token });
};
const logout = (req, res, next) => {};

exports.register = register;
exports.login = login;
exports.logout = logout;
