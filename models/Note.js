var mongoose = require("mongoose");
//note that schema is capitalized
var Schema = mongoose.Schema;
var NoteSchema = new Schema({
    title: String,
    body: String
});
var Note = mongoose.model("Note", NoteSchema);
//This module gets imported by article
module.exports = Note;