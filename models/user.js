var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  bg: Number,
  updated_at: { type: Date },
  created_at: { type: Date, default: Date.now }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
