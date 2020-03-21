const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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

// Model
const Item = mongoose.model("Item", itemSchema);

const dayOne = new Item({
  name: "Day 1"
});

const dayTwo = new Item({
  name: "Day 2"
});

const dayThree = new Item({
  name: "Day 3"
});

const defaultItems = [dayOne, dayTwo, dayThree];

app.get("/", function(req, res) {

  const day = date.getDate(); // Put () to make the module run the function inside of it

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted successful");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        items: foundItems
      });
    }
  });
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    items: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemID = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemID, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Item " + checkedItemID + " has been successfully removed.");
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
