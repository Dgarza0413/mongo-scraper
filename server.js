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

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo_scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost/mongo_scraper", { useNewUrlParser: true });

app.get("/scrape", (req, res) => {
    axios.get("http://www.apnews.com/apf-topnews").then((response) => {
        var $ = cheerio.load(response.data);
        $(".FeedCard").each(function (i, element) {
            var results = {};

            //how we push our properties into results
            results.title = $(this).find("h1").text();
            results.description = $(this).find("p").text();
            results.link = $(this).find("a").attr("href");
            results.author = $(this).find("span.byline").text();


            console.log(results)
            //how we push our properties to the database
            db.Article.create(results).then((dbArticle) => {
                console.log(dbArticle);
            }).catch((err) => {
                console.log(err);
            })
        });
        res.redirect("/");
    })
})

app.get("/", (req, res) => {
    db.Article.find({}, (err, docs) => {
        //we have to pass in the obj that 
        var obj = { articles: docs }
        res.render("index", obj);
    }).catch((err) => {
        res.json(err);
    })
});

//route to save articles
app.get("/articles/saved", (req, res) => {
    db.Article.find({ saved: true }, (err, docs) => {
        var obj = { articles: docs }
        res.render("index", obj)
    });
});

//route to save notes to articles
app.get("/articles/:id", (req, res) => {
    db.Article.findById({ _id: req.params.id }).populate("note")
        .then((dbArticle) => {
            res.json(dbArticle);
        }).catch((err) => {
            res.json(err)
        });
});

app.put("/articles/saved/:id", (req, res) => {
    db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { saved: true }).then((dbArticle) => {
            res.json(dbArticle);
        }).catch((err) => {
            res.json(err);
        })
});

app.put("/articles/unsaved/:id", (req, res) => {
    db.Article.findByIdAndUpdate(
        { _id: req.params.id },
        { saved: false }).then((dbArticle) => {
            res.json(dbArticle);
        }).catch((err) => {
            res.json(err);
        })
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then((dbNote) => {
            return db.Article.findOneAndUpdate(
                { _id: req.params.id },
                { note: dbNote._id },
                { new: true });
        }).then((dbArticle) => {
            res.json(dbArticle)
        }).catch((err) => {
            res.json(err);
        });
});

app.get("/drop", (req, res) => {
    db.Article.find({}, (err, docs) => {
        res.json(docs)
    }).catch((err) => {
        res.json(err);
    })
});

app.delete("/drop", function (req, res) {
    db.Article.deleteMany({}, function (err, result) {
        if (err) throw err;
        res.redirect("/");
    })
})


app.listen(3000, () => {
    console.log("app is on http://localhost:" + PORT);
})