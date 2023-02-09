const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helper/uuid');
const PORT = process.env.PORT || 3000;
const app = express();
// parsing JSON from data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// routes
app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './db/db.json'))
);
app.post('/api/notes', (req, res) => {
    const note = JSON.parse(fs.readFileSync('./db/db.json'));
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        note.push(newNote);
        const response = {
            status: 'Note Saved',
            body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(note), "utf-8");
    res.json(note);
});

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET Route
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.listen(PORT, () =>
    console.log(`Listening on http://localhost:${PORT}`)
);
