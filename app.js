//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);
const WorkItem = mongoose.model("WorkItem", itemSchema);

const item1 = new Item({
    name: "Welcome to your ToDoList!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];


app.get("/", function (req, res) {
    const currentDay = date.getDate();

    Item.find({}, function(err, listsFound){
        if (listsFound.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("sucessfully added default items");
                }
            });
            res.redirect("/");
        } else{
            res.render("list", {
                listTitle: currentDay,
                newListItems: listsFound,
                buttonAction: "/work",
                buttonTitle: "To Work List"
            });
       }
    });
});

app.get("/work", function (req, res) {
    WorkItem.find({}, function(err, workItemFound){
        res.render("list", { 
            listTitle: "Work List", 
            newListItems: workItemFound,
            buttonAction: "/main",
            buttonTitle: "To Main List"
         });
    });
});

app.post("/", function (req, res) {
    const itemName = req.body.newListItem;

    if (req.body.list === "Work") {
        WorkItem.create(new WorkItem({name: itemName}));
        res.redirect("/work");
    }
    else {
        Item.create(new Item({name: itemName}));
        res.redirect("/");
    }
});

app.post("/delete", function(req, res){
    const itemId = req.body.delete;

    console.log(itemId + ":");
    console.log(req.body.listName);
    if (req.body.listName === "Work List") {
        WorkItem.deleteOne({_id: itemId}, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log(itemId + ": has been removed from list");
            }
        });
        res.redirect("/work");
    }
    else {
        Item.deleteOne({_id: itemId}, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log(itemId + ": has been removed from list");
            }
        });
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