//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const port = 3000;

const items = ["Eat Breakfast", "Eat Lunch", "Eat Dinner"];
const workItems = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {

    const currentDay = date.getDate();
    res.render("list", {
        listTitle: currentDay,
        newListItems: items,
        buttonAction: "/work",
        buttonTitle: "To Work List"
    });
});

app.get("/work", function (req, res) {
    res.render("list", { 
        listTitle: "Work List", 
        newListItems: workItems,
        buttonAction: "/main",
        buttonTitle: "To Main List"
     });
});

app.post("/", function (req, res) {
    const item = req.body.newListItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect("/");
    }
});

app.post("/work", function(req, res){
    res.redirect("/work");
});

app.post("/main", function(req, res){
    res.redirect("/");
});

app.listen(port, function () {
    console.log(`Server has started on port: ${port}`);
});