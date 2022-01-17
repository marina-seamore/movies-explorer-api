const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        required: true,
        type: String,
        unique: true,
        validate: { validator: (e) => validator.isEmail(e) },
    },
    password: {
        required: true,
        type: String,
        select: false,
    },
});

module.exports = mongoose.model('user', userSchema);
