const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Err401 = require('../errors/Err401');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }).send(user);
    })
    .catch((err) => {
      if (err.message.includes('password')) {
        next(new Err401('Email or password is incorrect'));
      } else { next(err); }
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'user is logged out' });
};
