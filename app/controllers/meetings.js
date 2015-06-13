var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Meeting = require('../models/meeting.js')

exports.index = function(req, res, next) {
  Meeting.find(function(e, docs){
      res.render('meetings/index', {
          "collection" : docs
      });
  });
};

exports.new = function(req, res, next) {
  res.render('meetings/new', {});
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
    if (err){ res.send("There was a problem adding the information to the database."); }
    else{
      res.redirect("meetings");
    }
  });
};

exports.show = function(req, res){
  Meeting.findOne({"_id": req.params.id}, function(err, meeting){
    if (err){ res.status(404).send("404 doesn't exist"); }
    else{
      res.render('meetings/show', {"meeting": meeting})
    }
  })
};

exports.edit = function(req, res){
  Meeting.findOne({"_id": req.params.id}, function(err, meeting){
    if (err){ res.status(404).send("404 doesn't exist"); }
    else{
      res.render('meetings/edit', {"meeting": meeting})
    }
  })
};

exports.update = function(req, res){
  Meeting.findOne({"_id": req.params.id}, function(err, meeting){
    if (err){ res.status(404).send("404 doesn't exist"); }
    else{
      meeting.update({
        title: req.body.title,
        from: req.body.from,
        to: req.body.to,
        location: req.body.location,
        description: req.body.description,
        participants: req.body.participants
      }, function (err, meeting){
        if (err){ res.send("There was a problem saving the information to the database."); }
        else{
          res.redirect("/meetings");
        }
      })
    }
  })
};

exports.delete = function(req, res){
  Meeting.remove({"_id": req.params.id}, function(err, doc){
    if (err){ res.status(404).send("404 doesn't exist"); }
    else{
      res.redirect('/meetings')
    }
  })
};