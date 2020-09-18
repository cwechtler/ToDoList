//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = { name: String };
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({ name: "Welcome to your ToDoList!" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "<-- Hit this to delete an item" });
const defaultItems = [item1, item2, item3];

const listSchema ={ name: String, items: [itemSchema] };
const List = mongoose.model("List", listSchema);
const list1 = new List({ name: "Home", items: defaultItems });
const list2 = new List({ name: "Work", items: defaultItems });
const defaultLists = [list1, list2];

app.get("/", function (req, res) {
    const currentDay = date.getDate();
    List.find({}, function(err, listsFound){
        if (listsFound.length === 0){
            List.insertMany(defaultLists, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("sucessfully added default items");
                }
            });
            res.redirect("/");
        } 
        else{
            res.render("main", {
                listTitle: currentDay,
                newListItems: listsFound,
            });
       }
    });
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, function(err, listFound){
        if(!err){
            if(!listFound){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });           
                list.save();
                res.redirect("/" + customListName);
            }
            else{
                res.render("list", {
                    listTitle: listFound.name,
                    newListItems: listFound.items,
                    buttonAction: "/Main",
                    buttonTitle: "Main Menu"
                });
            }
        }
    });
});

app.post("/", function (req, res) {
    const itemName = _.capitalize(req.body.newListItem);
    const listName = req.body.listName;

    if (req.body.list === listName) {
        List.findOne({name: listName}, function(err, listFound){
            listFound.items.push(new Item({name: itemName}));
            listFound.save();        
        });
    
        res.redirect("/" + listName);
    }
    else {
        List.create(new List({name: itemName, items: defaultItems}));
        res.redirect("/");
    }
});

app.post("/delete", function(req, res){
    const currentDay = date.getDate();
    const itemId = req.body.delete;
    const listName = req.body.listName;

    if(listName === currentDay){
        List.deleteOne({_id: itemId}, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("List Id " + itemId + ": has been removed from list");
            }
        });
        res.redirect("/");
    }
    else {
        List.updateOne({name: listName}, {$pull: {items: {_id: itemId}}}, function(err, listFound){
            if(!err){
                res.redirect("/" + listName);
            }
        });    
    }
});

app.post("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    if(customListName === "Main"){
        res.redirect("/");
    }else{
        res.redirect("/" + customListName);
    }
});

app.listen(port, function () {
    console.log(`Server has started on port: ${port}`);
});