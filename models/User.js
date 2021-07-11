const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (!user.isModified('password')) return next(); // only hash the password if it has been modified (or is new)

    const hash = await bcrypt.hash(user.password, 12);
    user.password = hash; // override the cleartext password with the hashed one
    return next();
  } catch (e) {
    next(e);
  }
});

userSchema.methods.verifyPassword = async function (pw) {
  const match = await bcrypt.compare(pw, this.password);
  return match;
};

module.exports = User = mongoose.model('User', userSchema);
