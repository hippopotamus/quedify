var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Meeting = require('../app/models/meeting.js')
/* GET home page. */
router.get('/', function(req, res, next) {
  Meeting.find(function(e, docs){
      res.render('meetings/index', {
          "collection" : docs
      });
  });
});

router.get('/new', function(req, res, next) {
  res.render('meetings/new', {});
});

router.post('/', function(req, res) {
  var meeting = new Meeting({  
    title: req.body.title,
    from: req.body.from,
    to: req.body.to,
    location: req.body.location,
    description: req.body.description,
    participants: req.body.participants
  })


  meeting.save(function (err, meeting){
    if (err){ res.send("There was a problem adding the information to the database."); }
    else{
      res.redirect("meetings");
    }
  });
});

router.get('/:id', function(req, res, next){
  var collection = db.get('meetingcollection');

  collection.find({"_id": req.params.id}, function(err, doc){
    if (err){ res.send("There was a problem getting the information from the database."); }
    else{
      res.render('meetings/show', {"meeting": doc})
    }
  })
})

module.exports = router;