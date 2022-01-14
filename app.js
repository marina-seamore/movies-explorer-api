const express = require('express');

const { port = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/moviesdb', { useNewUrlParser: true });

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});
