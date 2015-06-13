var assert = require('assert');
var http = require('http');
var app = require('../app.js');
var server = http.createServer(app);
var request = require('superagent')

var Meeting = require('../app/models/meeting.js')

describe('meetings', function(){
  describe('meeting model:', function(){
    after(function(){
      Meeting.collection.remove()
    })

    it('should create without error', function(done){
      var meeting = new Meeting({
        title: "visiting mom",
        from: "2015-04-25",
        to: "2015-04-27",
        location: "mom's house",
        description: "visiting momma!",
        participants: "mom, me, poppa"
      })

      meeting.save(function (err, meeting){
        if (err){ throw err; }
        else{
          done()
        }
      });
    })

    it('should save participants as an array', function(done){
      Meeting.findOne({"title": "visiting mom"}, function(err, meeting){
        if (err){ throw err; }
        // assert.equal(meeting.from, Date("2015-04-25"))
        assert.equal(meeting.participants[0], "mom")
        assert.equal(meeting.participants[1], "me")
        assert.equal(meeting.participants[2], "poppa")
        done()
      })
    })
  })

  describe('/meetings', function(){
    before(function(){
      server.listen(3001)
    });

    after(function(){
      server.close()
      Meeting.collection.remove()
    })

    it('should be an empty collection', function(done){
      Meeting.find(function(err, meetings){
        if (err){ throw err }
        assert.equal(meetings.length, 0)
        done()
      })
    })

    describe('GET /meetings', function(){
      it('should return a status code of 200', function(done){
        http.get('http://127.0.0.1:3001/meetings', function(res){
          assert.equal(res.statusCode, 200);
          done();
        });
      });
    })

    describe('POST /meetings', function(){
      it('should return a status code of 200', function(done){
        request.post('http://127.0.0.1:3001/meetings').send({
          title: "visiting mom",
          from: "2015-04-25",
          to: "2015-04-27",
          location: "mom's house",
          description: "visiting momma!",
          participants: "mom, me, poppa"
        }).end(function(err, res){
          if (err){ throw err; }
          assert.equal(res.statusCode, 200);
          done();
        });
      });
    })
  });
});