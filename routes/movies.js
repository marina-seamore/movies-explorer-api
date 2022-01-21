const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, removeMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        } return helpers.message('Image should be a URL');
      }),
      trailer: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        } return helpers.message('Trailer should be a URL');
      }),
      thumbnail: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        } return helpers.message('Thumbnail should be a URL');
      }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().regex(/[а-яё\d\s]/),
      nameEN: Joi.string().required().regex(/[\w\s]/),
    }),
  }),
  createMovie,
);
router.delete(
  '/:movieId',
  celebrate({ params: Joi.object().keys({ movieId: Joi.string().length(24).hex() }) }),
  removeMovie,
);

module.exports = router;
