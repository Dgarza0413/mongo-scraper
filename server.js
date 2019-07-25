var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars")
var mongoose = require("mongoose")
var PORT = process.env.PORT || 3000
var db = require("./models");
var app = express();
var logger = require("morgan");

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// var MONGODB_URI = process.env.MONGODB_URI || ("mongodb://localhost/mongo_scraper");
// mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/mongo_scraper", { useNewUrlParser: true });

app.get("/scrap", (req, res) => {
    axios.get("http://www.apnews.com/apf-topnews").then((response) => {
        var $ = cheerio.load(response.data);
        $(".FeedCard").each(function (i, element) {
            var results = {};

            //how we push our properties into results
            results.title = $(this).find("h1").text();
            results.description = $(this).find("p").text();
            results.link = $(this).find("a").attr("href");

            console.log(results)
            //how we push our properties to the database
            db.Article.create(results).then((dbArticle) => {
                console.log(dbArticle);
            }).catch((err) => {
                console.log(err);
            })
        });
        res.send("scrap complete");
    })
})

app.get("/articles", (req, res) => {
    db.Article.find({}, function (err, docs) {
        var obj = {
            articles: docs
        }
        res.render("index", obj);
    });
    // .catch((err) => {
    //     res.json(err);
    // })
});

app.get("/all", (req, res) => {
    db.Article.find({}).then((dbArticle) => {
        res.json(dbArticle)
    }).catch((err) => {
        res.json(err);
    })
});


app.listen(3000, () => {
    console.log("app is on http://localhost:" + PORT);
})