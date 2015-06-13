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

    describe('GET /', function(){
      it('should return a status code of 200', function(done){
        request.get('http://127.0.0.1:3001/meetings').end(function(err, res){
          if (err){ throw err; }
          assert.equal(res.statusCode, 200);
          done();
        });
      });
    })

    describe('POST /', function(){
      it('should return a status code of 200', function(done){
        request.post('http://127.0.0.1:3001/meetings').send({
          title: "tea with teddy bear",
          from: "2015-04-28",
          to: "2015-04-29",
          location: "mom's house",
          description: "TEA TIME",
          participants: "mom, teddy bear"
        }).end(function(err, res){
          if (err){ throw err; }
          assert.equal(res.statusCode, 200);
          done();
        });
      });

      it('should have an instance of the meeting', function(done){
        Meeting.find(function(err, meetings){
          if (err){ throw err }
          assert.equal(meetings.length, 1)
          done()
        })
      })
    })

    describe('GET /:id', function(done){
      it('should render 404 on bad id', function(done){
        request.get('http://127.0.0.1:3001/meetings/lolsup').end(function(err, res){
          if (err){
            assert.equal(res.statusCode, 404);
            done();
          }
          else{
            throw err;
          }
        });
      })

      it('should render 200', function(done){
        Meeting.findOne({title: "tea with teddy bear"}, function(err, meeting){
          if (err){ throw err }
          request.get('http://127.0.0.1:3001/meetings/'+meeting._id).end(function(err, res){
            if (err){ throw err }
            assert.equal(res.statusCode, 200)
            done()
          })
        })
      })
    })

    describe('GET /:id/edit', function(done){
      it('should render 200', function(done){
        Meeting.findOne({title: "tea with teddy bear"}, function(err, meeting){
          if (err){ throw err }
          request.get('http://127.0.0.1:3001/meetings/'+meeting._id+'/edit').end(function(err, res){
            if (err){ throw err }
            assert.equal(res.statusCode, 200)
            done()
          })
        })
      })
    })

    describe('PUT /:id', function(done){
      it('should render 404 on bad id', function(done){
        request.put('http://127.0.0.1:3001/meetings/lolsup').send({
          title: "SHOULDNT WORK",
          from: "2015-04-28",
          to: "2015-04-29",
          location: "mom's house",
          description: "TEA TIME",
          participants: "mom, teddy bear"
        }).end(function(err, res){
          if (err){
            assert.equal(res.statusCode, 404);
            done();
          }
          else{
            throw err;
          }
        });
      })

      it('should render 200', function(done){
        Meeting.findOne({title: "tea with teddy bear"}, function(err, meeting){
          if (err){ throw err }
          request.put('http://127.0.0.1:3001/meetings/'+meeting._id).send({
          title: "tea with friends",
          from: "2015-04-28",
          to: "2015-04-29",
          location: "mom's house",
          description: "TEA TIME",
          participants: "mom, teddy bear"
        }).end(function(err, res){
            if (err){ throw err }
            assert.equal(res.statusCode, 200)
            done()
          })
        })
      })

      it('should have updated the meeting', function(done){
        Meeting.findOne({"title": "tea with friends"}, function(err, meeting){
          if (err){ throw err; }
          assert.equal(meeting.location, "mom's house")
          done()
        })
      })
    })

    describe('DELETE /:id', function(){
      it('should render 404 on bad id', function(done){
        request.del('http://127.0.0.1:3001/meetings/lolsup').end(function(err, res){
          if (err){
            assert.equal(res.statusCode, 404);
            done();
          }
          else{
            throw err;
          }
        });
      })

      it('should render 200', function(done){
        Meeting.findOne({"title": "tea with friends"}, function(err, meeting){
          if (err){ throw err; }
          request.del('http://127.0.0.1:3001/meetings/'+meeting._id).end(function(err, res){
            if (err){ throw err; }
            assert.equal(res.statusCode, 200);
            done();
          });
        })
      })

      it('should have deleted the meeting', function(done){
        Meeting.findOne({"title": "tea with friends"}, function(err, meeting){
          if (err){ throw err; }
          assert.equal(meeting, null)
          done()
        })

      })
    })
  });
});