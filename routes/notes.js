const notes = require("express").Router();
const fs = require("fs");
const util = require("util");
const { readAndAppend, readFromFile } = require("../helpers/fsUtils");
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

module.exports = notes;
