// Dependencies
var express = require("express");
var mongoose = require("mongoose")
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

//set port
var PORT = process.env.PORT || 3000;

// Instantiate the Express app
var app = express();

// Set up the Express router
var router = express.Router();

// Require our routes file pass router object
require("./config/routes")(router);

// Make public a static dir
app.use(express.static(__dirname + "/public"));

//Connect Handlebars to our Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use body parser in our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Use body parser with our app
app.use(router);

// If deployed, use the deployed database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

mongoose.connect(db, function (error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log("mongoose connection is successful");
  }
});


//Listen on the port localhost
app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
});