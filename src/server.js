require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const port = process.env.PORT || 7800;

const app = express();

app.use(helmet());

app.use(express.static(path.join(__dirname, '../public')));

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
