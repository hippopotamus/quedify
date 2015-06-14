var express = require('express');
var router = express.Router();
var meetings = require('../app/controllers/meetings.js')

module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.get('/meetings', meetings.index);
  app.get('/meetings/new', meetings.new);
  app.post('/meetings/', meetings.create);
  app.get('/meetings/:id', meetings.show);
  app.get('/meetings/:id/edit', meetings.edit);
  app.put('/meetings/:id', meetings.update);
  app.delete('/meetings/:id', meetings.delete);
  app.get('/meetings/:id/search_title/:title', meetings.searchTitle)

  app.use(function (req, res, next) {
    res.status(404);
    res.render("404");
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  };

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}