const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { require: true, type: String },
  username: { require: true, type: String },
  password: { require: true, type: String },
});

module.exports = mongoose.model('User', UserSchema);
