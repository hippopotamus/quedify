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
  res.render('meetings/form', {});
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

router.get('/:id', function(req, res){
  Meeting.findOne({"_id": req.params.id}, function(err, doc){
    if (err){ res.status(404).send("404 doesn't exist"); }
    else{
      res.render('meetings/show', {"meeting": doc})
    }
  })
})

router.put('/:id', function(req, res){
  Meeting.findOne({"_id": req.params.id}, function(err, doc){
    if (err){ res.status(404).send("404 doesn't exist"); }
    else{
      res.render('meetings/form', {"meeting": doc})
    }
  })
})

module.exports = router;