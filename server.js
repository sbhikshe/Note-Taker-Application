const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

let notesArray = [];
class Note {
  constructor(title, text) {
    this.title = title;
    this.text = text;
  }
}

/* HTML routes */
app.get('/notes', (req, res) => {
  console.log("Received GET request for /notes");
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

/* API routes */
app.get('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    console.log(data);
    notesArray = JSON.parse(data);
  });
  res.json(notesArray);
});

app.post('/api/notes', (req, res) => {
  console.log(`${req.method} to /api/notes received`);

  console.log("New note received: " + req.body);
  let {title, text} = req.body;
  console.log(title, text);
  saveNewNote(title, text);

  res.send("new Note received");
});

function saveNewNote (title, text) {
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      if(data) {
        notesArray = JSON.parse(data);
        // Write the string to a file
        notesArray.push(new Note(title, text));

        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err) => {
          err? console.error(err): console.log(`new note for ${title} has been added to db`);
        });
      }
    }
  });
}

/* Wild card get */
app.get('*', (req, res) => {
  console.log("GET request for * received");
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, console.log("Listening on Port 3000:"));
