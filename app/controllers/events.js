var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Event = require('../models/event.js')

exports.index = function(req, res, next) {
  Event.find(function(e, docs){
    return res.json(docs);
  });
};

exports.create = function(req, res) {
  var event = new Event({
    title: req.body.title,
    from: req.body.from,
    to: req.body.to,
    location: req.body.location,
    description: req.body.description,
    participants: req.body.participants
  })

  event.save(function (err, event){
    if (err){ return res.status(500).render("error"); }
    else{
      return res.json({"success": true});
    }
  });
};

exports.show = function(req, res){
  Event.findOne({"_id": req.params.id}, function(err, event){
    if (err){ return res.status(404).render("404"); }
    else{
      return res.json(event)
    }
  })
};

exports.edit = function(req, res){
  Event.findOne({"_id": req.params.id}, function(err, event){
    if (err){ return res.status(404).render("404"); }
    else{
      return res.json(event)
    }
  })
};

exports.update = function(req, res){
  Event.findOne({"_id": req.params.id}, function(err, event){
    if (err){ return res.status(404).render("404"); }
    else{
      event.update({
        title: req.body.title,
        from: req.body.from,
        to: req.body.to,
        location: req.body.location,
        description: req.body.description,
        participants: req.body.participants
      }, function (err, data){
        if (err){ return res.status(500).render("error"); }
        else{
          res.json({"success": true});
        }
      })
    }
  })
};

exports.delete = function(req, res){
  Event.remove({"_id": req.params.id}, function(err, doc){
    if (err){ return res.status(404).render("404"); }
    else{
      res.json({"success": true})
    }
  })
};

exports.searchTitle = function(req, res){
  Event.find({title: new RegExp("^"+req.params.title)}).limit(10).exec(function(err, events){
    if (err){ return res.status(500).render("error"); }
    else{
      return res.json(events);
    };
  });
};