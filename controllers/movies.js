const Movie = require('../models/movie');
const Err404 = require('../errors/Err404');
const Err400 = require('../errors/Err400');
const Err403 = require('../errors/Err403');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((next));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    },
  )
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Err400('Information for new movie was filled incorrectly'));
      } else { next(err); }
    });
};

module.exports.removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Err404('Movie not found'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new Err403('Not authorized to delete movies of other users'));
      } return movie.remove()
        .then(() => res.send({ message: 'Movie was successfully removed' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Err400('Incorrect movie id'));
      } else { next(err); }
    });
};
