const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

// Arrays can be declared as const and have items pushed and popped from them
// cannot assign the array to an entirely new array, however
const items = [];
const workItems = [];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); // Tell express to load this folder and it's contents

app.set('view engine', 'ejs');

app.get("/", function(req, res) {

  const day = date.getDate(); // Put () to make the module run the function inside of it

  res.render("list", {
    listTitle: day,
    items: items
  });

});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    items: workItems
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/", function(req, res) {

  const item = req.body.newItem;

  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }

});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
