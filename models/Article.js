var mongoose = require("mongoose");
//note that schema is capitalized
var Schema = mongoose.Schema
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    //ref the Note.js file
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;