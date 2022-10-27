const express = require('express');
const path = require('path');
const db = require('./db/db.json');

const PORT = 3000;

const app = express();
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  console.log("Received GET request for /notes");
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  console.log("GET request for * received");
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(PORT, console.log("Listening on Port 3000:"));
