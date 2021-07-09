const mongoose = require('mongoose');

userSchema = new mongoose.Schema({
  name: string,
});

module.exports = User = mongoose.model('User', userSchema);
