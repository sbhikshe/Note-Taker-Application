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
  console.log("Received GET request for /notes");
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

/* API routes */
app.get('/api/notes', (req, res) => {
  fs.readFile("./db/db.json", "utf8", function(error, data) {
    if (error) {
      console.log(error);
      res.error("Error getting notes");
    } else {
      console.log(data);
      notesArray = JSON.parse(data);
      res.json(notesArray);
    }
  });
});

app.post('/api/notes', (req, res) => {
  console.log(`${req.method} to /api/notes received`);
  let {title, text} = req.body;
  console.log("Request: " + title + ", " + text);

  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      res.error("Error reading notes from database");
    } else {
      //console.log(data);
      if(data) {
        notesArray = JSON.parse(data);
        /* create a new Note object with a unique id */
        newNote = new Note(title, text);

        /* add to notes array */
        notesArray.push(newNote);

        /* write all the notes to the db */
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err) => {
          if (err) {
            res.error("Error writing notes to database");
          } else {
            console.log(`new note has been added to db`);
            res.json(newNote);
          }
        });
      }
    }
  });

});

app.delete('/api/notes/:id', (req, res) => {
  console.log(`${req.method} request received`);
  console.log(`Request params: ${req.params.id}`);
  let id = req.params.id;

  if(id) {
    /* read db.json into notesArray*/
    /* iterate through the array and find the note with this id */
    /* delete that note */
    /* write the notes back to db.json */

    fs.readFile("./db/db.json", "utf8", (error, data) => {
      if (error) {
        res.error("Error reading notes from database");
      } else {
        //console.log(data);
        if(data) {
          notesArray = JSON.parse(data);

          for (let i = 0; i < notesArray.length; i++) {
            if (id == notesArray[i].id) {
              notesArray.splice(i,1);
            }
          }
          console.log(notesArray);
  
          /* write all the notes to the db */
          fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err) => {
            if (err) {
              res.error("Error writing notes to database");
            } else {
              console.log(`note deleted from db`);
              /* return id back to client */
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
  console.log("GET request for * received");
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, console.log("Listening on Port 3000:"));
