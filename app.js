//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let items = ["Buy Food", "Cook Food", "Eat Food"];

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    let currentDay = today.toLocaleDateString("en-US", options);
    
    res.render("list", {
        dayOfWeek: currentDay,
        newListItems: items
    });

});

app.post("/", function(req, res){
    var item = req.body.newListItem;
    items.push(item);

    res.redirect("/");
});

app.listen(port, function () {
    console.log(`Server has started on port: ${port}`);
});