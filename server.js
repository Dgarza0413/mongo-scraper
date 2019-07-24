var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path")

var PORT = process.env.PORT || 3000

var app = express();
var databaseUrl = "news";
var collections = ["media"];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var db = mongojs(databaseUrl, collections);
db.on("error", (error) => {
    console.log("Database Error:", error);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/landing.html"));
})

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
    // axios.get("http://www.apnews.com").then((response) => {
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