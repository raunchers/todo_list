const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public")); // Tell express to load this folder and it's contents

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); // Connecting to DB, if it doesn't exist, it is created

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Requires a name to be saved."]
  }
});

const day = date.getDate(); // Put () to make the module run the function inside of it

// Model
const Item = mongoose.model("Item", itemSchema);

const itemOne = new Item({
  name: "Welcome to your todolist!"
});

const itemTwo = new Item({
  name: "Hit the + button to add a new item."
});

const itemThree = new Item({
  name: "<---- Hit this button to delete an item."
});

const defaultItems = [itemOne, itemTwo, itemThree];

const listSchema = {
  name: {
    type: String,
    required: [true, "Requires a name to be saved."]
  },
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted successfully");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        items: foundItems
      });
    }
  });
});

app.get("/:customListName", function(req, res) {

  const customListName = req.params.customListName;

  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {

      if (!foundList) {

        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();

        res.redirect("/" + customListName);

      } else {
        res.render("list", {listTitle: foundList.name, items: foundList.items});
      }
    }

  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today" ){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function(req, res) {
  const checkedItemID = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemID, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Item " + checkedItemID + " has been successfully removed.");
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
