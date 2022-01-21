const express = require('express');
require('dotenv').config();

console.log(process.env.NODE_ENV);
const { port = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

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

app.use('/', routes);

// errors
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
