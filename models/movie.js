const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: { validator: (e) => validator.isUrl(e) },
    },
    trailer: {
        type: String,
        required: true,
        validate: { validator: (e) => validator.isUrl(e) },
    },
    thumbnail: {
        type: String,
        required: true,
        validate: { validator: (e) => validator.isUrl(e) },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    movieId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
    },
    nameRU: {
        type: String,
        required: true,
    },
    nameEN: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('movie', movieSchema);
