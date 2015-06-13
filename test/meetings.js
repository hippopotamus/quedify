var assert = require('assert');
var http = require('http');
var app = require('../app.js');
var server = http.createServer(app);

describe('meetings unit tests:', function(){
  before(function(){
    server.listen(3001)
  });

  after(function(){
    server.close()
  })

  describe('GET /meetings', function(){
    it('should return a status code of 200', function(done){
      http.get('http://127.0.0.1:3001/meetings', function(res){
        assert.equal(res.statusCode, 200);
        done();
      });
    });
  });
});