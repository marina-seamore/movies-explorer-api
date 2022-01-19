const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const Err401 = require('../errors/Err401');

module.exports.auth = (req, res, next) => {
    const token = req.cookies.jwt;
    let payload;
    try {
        payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    } catch (err) {
        throw new Err401('Authorization required');
    }

    req.user = payload;
    next();
};
