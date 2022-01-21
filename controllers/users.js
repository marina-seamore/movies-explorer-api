const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Err404 = require('../errors/Err404');
const Err400 = require('../errors/Err400');
const Err409 = require('../errors/Err409');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Err404('User not found'))
    .then((user) => {
      res.send(user);
    })
    .catch((next));
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .orFail(new Err404('User not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new Err400('Information about the user was filled incorrectly'));
      } if (err.code === 11000) {
        next(new Err409('Email already exists'));
      } else { next(err); }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash })
      .then(() => res.send({ name, email }))
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          throw new Err400('Information about the new user was filled incorrectly');
        } if (err.code === 11000) {
          throw new Err409('Email already exists');
        } else { next(err); }
      }));
};
