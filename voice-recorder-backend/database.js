const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    text: String,
    date: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', noteSchema);

async function saveNote(note) {
    const newNote = new Note(note);
    return await newNote.save();
}

async function getNotes() {
    return await Note.find();
}

module.exports = { saveNote, getNotes, Note };
