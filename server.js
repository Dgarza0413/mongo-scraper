var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
var exphbs = require("express-handlebars")
var mongoose = require("mongoose")

var PORT = process.env.PORT || 3000

var app = express();
var databaseUrl = "news";
var collections = ["media"];

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo_scraper";

mongoose.connect(MONGODB_URI);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = mongojs(databaseUrl, collections);
db.on("error", (error) => {
    console.log("Database Error:", error);
});

app.get("/", (req, res) => {
    db.Article.find({}).then((dbArticle) => {
        res.render("index", dbArticle)
    }).catch((err) => {
        res.json(err);
    })
});

app.get("/all", (req, res) => {
    db.media.find({}, (error, found) => {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            res.json(found);
        }
    })
})

app.get("/scrap", (req, res) => {
    res.send("this the scraped page")
    axios.get("http://www.apnews.com/apf-topnews").then((response) => {
        var $ = cheerio.load(response.data);
        var results = [];
        $(".FeedCard").each(function (i, element) {
            var title = $(element).find("h1").text();
            var description = $(element).find("p").text();
            var link = $(element).find("a").attr("href");
            if (title && link) {
                results.push({
                    title,
                    description,
                    link
                }, function (err, inserted) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("inserted instead")
                    }
                })
            }
            console.log(results)
        });
    })
})

app.listen(3000, () => {
    console.log("app is on http://localhost:" + PORT);
})