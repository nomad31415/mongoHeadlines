// Controller for our headlines

// Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// Bring in the Headline and Note mongoose models
var Headline = require("../models/Headline");

module.exports = {
  fetch: function (cb) {

    // Run scrape function
    scrape(function (data) {
      var articles = data;
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      // Headline.collection lets us access the native Mongo insertMany method.
      Headline.collection.insertMany(articles, { ordered: false }, function (err, docs) {
        cb(err, docs);
      });
    });
  },
  // Create function to delete any headline
  delete: function (query, cb) {
    Headline.remove(query, cb);
  },
  // Create function to prepare a query to get the data we scraped
  get: function (query, cb) {
    Headline.find(query)
      .sort({
        _id: -1
      })
      // Create function to execute this query
      .exec(function (err, doc) {
        // Once finished, pass the list into the callback function
        cb(doc);
      });
  },
  // Create function to update the headline
  update: function (query, cb) {
    Headline.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
};

