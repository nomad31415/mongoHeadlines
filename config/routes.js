// Server routes

// Bring the Scrape function from the scripts directory
var scrape = require("../scripts/scrape");

// Bring headlines and notes from the controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function (router) {
  // This route renders the homepage
  router.get("/", function (req, res) {
    res.render("home");
  });

  // This route renders the saved handledbars page
  router.get("/saved", function (req, res) {
    res.render("saved");
  });

  // This route handles scraping more articles to add to our db and scrap new articles
  router.get("/api/fetch", function (req, res) {
    headlinesController.fetch(function (err, docs) {
      // If we don't get any articles back send message back to the user
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles today. Check back tomorrow!"
        });
      }
      else {
        // Send back a count of how many new articles
        res.json({
          message: "Added " + docs.insertedCount + " new articles!"
        });
      }
    });
  });

  // This route handles getting all headlines from our database
  router.get("/api/headlines", function (req, res) {
    headlinesController.get(req.query, function (data) {
      res.json(data);
    });
  });

  // This route handles deleting a specified headline
  router.delete("/api/headlines/:id", function (req, res) {
    // Set the _id property of the query object to the id in req.params
    var query = { _id: req.params.id };

    // Run the headlinesController delete method and pass in our query object containing
    headlinesController.delete(query, function (err, data) {
      res.json(data);
    });
  });

  // This route handles updating a headline
  router.put("/api/headlines", function (req, res) {
    headlinesController.update(req.body, function (err, data) {
      res.json(data);
    });
  });

  // This route handles getting notes for a particular headline id
  router.get("/api/notes/", function (req, res) {
    // Get all notes
    notesController.get({}, function (err, data) {
      res.json(data);
    });
  });

  // This route handles getting notes for a particular headline id
  router.get("/api/notes/:headline_id", function (req, res) {
    var query = { _id: req.params.headline_id };

    // Get all notes that match our query using the notesController get method
    notesController.get(query, function (err, data) {
      res.json(data);
    });
  });

  // This route handles deleting a note of a particular note id
  router.delete("/api/notes/:id", function (req, res) {
    var query = { _id: req.params.id };

    notesController.delete(query, function (err, data) {
      res.json(data);
    });
  });

  // This route handles saving a new note
  router.post("/api/notes", function (req, res) {
    notesController.save(req.body, function (data) {
      res.json(data);
    });
  });
};
