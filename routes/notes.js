const notes = require("express").Router();
const fs = require("fs");
const util = require("util");
const { readAndAppend, readFromFile, writeToFile } = require("../helpers/fsUtils");
const { v4: uuidv4 } = require("uuid");

//GET route for retrieving notes
notes.get("/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

//POST route for new notes
notes.post("/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting note");
  }
});

notes.delete("/notes/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = notes;
