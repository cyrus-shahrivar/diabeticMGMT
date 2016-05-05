var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  bg: Number
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
