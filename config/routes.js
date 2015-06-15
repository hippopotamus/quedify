var express = require('express');
var router = express.Router();
var events = require('../app/controllers/events.js')

module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  app.get('/events', events.index);
  app.post('/events', events.create);
  app.get('/events/:id', events.show);
  app.get('/events/:id/edit', events.edit);
  app.put('/events/:id', events.update);
  app.delete('/events/:id', events.delete);
  app.get('/events/search/:title', events.searchTitle);

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
};