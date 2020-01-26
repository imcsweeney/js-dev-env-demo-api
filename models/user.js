const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

// authenticate input against database
userSchema.statics.authenticate = function (email, password, callback) {
  // eslint-disable-next-line no-use-before-define
  User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } if (!user) {
        const error = new Error('User not found.');
        error.status = 401;
        return callback(error);
      }
      bcrypt.compare(password, user.password, (error, result) => {
        if (result === true) {
          return callback(null, user);
        }
        return callback();
      });
    });
};

// hashing a password before saving it to the database
userSchema.pre('save', function (next) {
  const user = this;
  // eslint-disable-next-line consistent-return
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});
const User = mongoose.model('User', userSchema);
module.exports = User;
