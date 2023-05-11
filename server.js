const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET notes from storage
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// POST new notes to storage
app.post('/api/notes', (req, res) => {
  console.log(req.body);
  
  // Deconstruct body
  const { title, text } = req.body

  if (req.body) {
    // Build new note from body
    const newNote = {
      title,
      text
      // TODO add unique ID
    }

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        throw err
      } else {
        console.log('file read successfully');
      }

      // add the new note to the file
      const parsed = JSON.parse(data);

      parsed.push(newNote);

      // Write the updated data to the file
      fs.writeFile('./db/db.json', JSON.stringify(parsed), (err) => {
        if (err) {
          throw err;
        } else {
          console.log('file updated successfully');
        }
      });
    });

    res.json('Note posted successfully');
  } else {
    res.json('Error in posting note');
  }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
