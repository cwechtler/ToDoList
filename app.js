//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

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
        dayOfWeek: currentDay
    });

});

app.listen(port, function () {
    console.log(`Server has started on port: ${port}`);
});