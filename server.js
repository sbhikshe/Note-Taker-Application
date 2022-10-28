const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./db/db.json');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let notesArray = [];
class Note {
  constructor(title, text) {
    this.title = title;
    this.text = text;
    this.id = uuidv4();
  }
}
let newNote = undefined;

/* HTML routes */
app.get('/notes', (req, res) => {
  console.log(`${req.method} request for /notes received`);
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

/* API routes */
app.get('/api/notes', (req, res) => {
  console.log(`${req.method} request for /api/notes received`);
  fs.readFile("./db/db.json", "utf8", function(error, data) {
    if (error) {
      res.error("Error getting notes");
    } else {
      notesArray = JSON.parse(data);
      res.json(notesArray);
    }
  });
});

app.post('/api/notes', (req, res) => {
  console.log(`${req.method} to /api/notes received`);
  let {title, text} = req.body;

  /* read the saved notes from the database */
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      res.error("Error reading notes from database");
    } else {
      if(data) {
        /* read the notes into an array */
        notesArray = JSON.parse(data);

        /* create a new Note object with a unique id */
        newNote = new Note(title, text);

        /* add to notes array */
        notesArray.push(newNote);

        /* save all the notes back to the db */
        /* and return the new note to the client with the id */
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err) => {
          if (err) {
            res.error("Error writing notes to database");
          } else {
            res.json(newNote);
          }
        });
      }
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  console.log(`${req.method} request for /api/notes/:id received`);

  /* get the id of the note to be deleted from the request */
  let id = req.params.id;

  if(id) {
    /* read the saved notes from the database into notesArray*/
    fs.readFile("./db/db.json", "utf8", (error, data) => {
      if (error) {
        res.error("Error reading notes from database");
      } else {
        if(data) {
          notesArray = JSON.parse(data);

          /* Iterate through the array and find the note with this id. */
          /* Delete that note from the array. */

          for (let i = 0; i < notesArray.length; i++) {
            if (id == notesArray[i].id) {
              notesArray.splice(i,1);
            }
          }
  
          /* write all the notes back to the database */
          fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err) => {
            if (err) {
              res.error("Error writing notes to database");
            } else {
              /* return the id back to client */
              /* client is not really handling the id. It gets the notes again. */
              res.json(id);
            }
          });
        }
      }
    });
  }
});

/* Wild card get */
app.get('*', (req, res) => {
  console.log(`${req.method} for * received`);
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, console.log("Listening on Port 3000:"));
