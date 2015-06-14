var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Meeting = require('../models/meeting.js')

exports.index = function(req, res, next) {
  Meeting.find(function(e, docs){
    return res.json(docs);
  });
};

exports.new = function(req, res, next) {
  res.render('meetings/new');
};

exports.create = function(req, res) {
  var meeting = new Meeting({
    title: req.body.title,
    from: req.body.from,
    to: req.body.to,
    location: req.body.location,
    description: req.body.description,
    participants: req.body.participants
  })

  meeting.save(function (err, meeting){
    if (err){ return res.status(500).render("error"); }
    else{
      return res.json({"success": true});
    }
  });
};

exports.show = function(req, res){
  Meeting.findOne({"_id": req.params.id}, function(err, meeting){
    if (err){ return res.status(404).render("404"); }
    else{
      return res.json(meeting)
    }
  })
};

exports.edit = function(req, res){
  Meeting.findOne({"_id": req.params.id}, function(err, meeting){
    if (err){ return res.status(404).render("404"); }
    else{
      return res.json(meeting)
    }
  })
};

exports.update = function(req, res){
  Meeting.findOne({"_id": req.params.id}, function(err, meeting){
    if (err){ return res.status(404).render("404"); }
    else{
      meeting.update({
        title: req.body.title,
        from: req.body.from,
        to: req.body.to,
        location: req.body.location,
        description: req.body.description,
        participants: req.body.participants
      }, function (err, meeting){
        if (err){ return res.status(500).render("error"); }
        else{
          res.json({"success": true});
        }
      })
    }
  })
};

exports.delete = function(req, res){
  Meeting.remove({"_id": req.params.id}, function(err, doc){
    if (err){ return res.status(404).render("404"); }
    else{
      res.json({"success": true})
    }
  })

exports.searchTitle = function(req, res){
  Meeting.find({$text: {$search: req.params.title}}).limit(10).exec(function(err, meetings){
    if (err){ return res.status(500).send("Internal server error") }
    else{
      return res.json(meetings)
    }
  })
}
};