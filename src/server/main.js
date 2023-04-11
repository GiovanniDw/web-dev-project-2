const express = require('express');
// import {ViteExpress} from 'vite-express';
const ViteExpress = require('vite-express');
const dotenv = require("dotenv").config;

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/hello', (req, res) => {
  res.send('Hello Vite!');
});

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port ${PORT}...`)
);
