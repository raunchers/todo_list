const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = [];
let workItems = [];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); // Tell express to load this folder and it's contents

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let day = today.toLocaleDateString("en-US", options);

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

  let item = req.body.newItem;

  if(req.body.list === "Work"){
    workItems.push(item);
    console.log("Work push");
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }

});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
