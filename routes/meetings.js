var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('meetingcollection');
  collection.find({},{},function(e,docs){
      res.render('meetings/index', {
          "collection" : docs
      });
  });
});

router.get('/new', function(req, res, next) {
  var db = req.db;
  var collection = db.get('meetingcollection');
  collection.find({},{},function(e,docs){
      res.render('meetings/new', {});
  });
});

router.post('/', function(req, res) {
  var db = req.db;

  var meetingTitle        = req.body.title;
  var meetingFrom         = req.body.from;
  var meetingTo           = req.body.to;
  var meetingLocation     = req.body.location;
  var meetingDescription  = req.body.description;
  var meetingParticipants = req.body.participants;

  var collection = db.get('meetingcollection');

  collection.insert({
    "title": meetingTitle,
    "from": meetingFrom,
    "to": meetingTo,
    "location": meetingLocation,
    "description": meetingDescription,
    "participants": meetingParticipants
  }, function (err, doc){
    if (err){ res.send("There was a problem adding the information to the database."); }
    else{
      res.redirect("meetings");
    }
  });
});

module.exports = router;