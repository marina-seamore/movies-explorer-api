const express = require('express');
require('dotenv').config();

console.log(process.env.NODE_ENV);
const { port = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');

const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const Err404 = require('./errors/Err404');
const { createUser } = require('./controllers/users');
const { login, logout } = require('./controllers/login');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/moviesdb', { useNewUrlParser: true });

app.use(cors({
  origin: [
    'http://movie.project.nomoredomains.work',
    'https://movie.project.nomoredomains.work',
    'http://api.movie.project.nomoredomains.work',
    'https://api.movie.project.nomoredomains.work',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: 'GET, PUT, PATCH, POST, DELETE',
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signout', logout);

// routes requiring authorization:
app.use(auth);
app.use('/users', userRoute);
app.use('/movies', movieRoute);

app.use('*', (req, res, next) => {
  next(new Err404('Page not found'));
});

// errors
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? err.message : message });
  next();
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
