const router = require('express').Router();
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
      image: Joi.string().required().regex(/https?:\/\/(w{3}.)?[\w-]+\.\S+[^><]/),
      trailer: Joi.string().required().regex(/https?:\/\/(w{3}.)?[\w-]+\.\S+[^><]/),
      thumbnail: Joi.string().required().regex(/https?:\/\/(w{3}.)?[\w-]+\.\S+[^><]/),
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
