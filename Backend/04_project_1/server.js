require('dotenv').config()
const express = require("express");
const connectToDB = require('./src/db/db.js')
connectToDB()// will call it here

const app = express();
app.use(express.json()); // by default express not read req.body

const notes = [];

app.post("/notes", (req, res) => {
  notes.push(req.body);
  res.json({
    message: "Notes added successfully!",
    notes,
  });
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.delete("/notes/:index", (req, res) => {
  const index = req.params.index;
  delete notes[index];
  res.json({
    message: "note deleted successfully",
  });
});

app.patch("/notes/:index", (req, res) => {
  const index = req.params.index;
  const { title } = req.body;
  console.log(title)
  notes[index].title = title;
  res.json({
    message: "note deleted successfully",
    updatedNote : notes[index]
  });
});

app.listen(3000, () => {
  console.log("server is runnning...");
});
