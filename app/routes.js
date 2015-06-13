var express = require('express');
var router = express.Router();
var meetings = require('./controllers/meetings.js')

module.exports = function(app){
  app.get('/meetings', meetings.index)
  app.get('/meetings/new', meetings.new);
  app.post('/meetings/', meetings.create)
  app.get('/meetings/:id', meetings.show)
  app.get('/meetings/:id/edit', meetings.edit)
  app.put('/meetings/:id', meetings.update)
  app.delete('/meetings/:id', meetings.delete)

  app.use(function (req, res, next) {
    res.status(404).send("404");
  });
}