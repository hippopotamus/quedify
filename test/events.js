var assert = require('assert');
var http = require('http');
var app = require('../app.js');
var server = http.createServer(app);
var request = require('superagent')

var Event = require('../app/models/event.js')

describe('events', function(){
  describe('event model:', function(){
    after(function(){
      Event.collection.remove()
    })

    it('should create without error', function(done){
      var event = new Event({
        title: "visiting mom",
        from: "2015-04-25",
        to: "2015-04-27",
        location: "mom's house",
        description: "visiting momma!",
        participants: "mom, me, poppa"
      })

      event.save(function (err, event){
        if (err){ throw err; }
        else{
          done()
        }
      });
    })

    it('should save participants as an array', function(done){
      Event.findOne({"title": "visiting mom"}, function(err, event){
        if (err){ throw err; }
        assert.equal(event.participants[0], "mom")
        assert.equal(event.participants[1], "me")
        assert.equal(event.participants[2], "poppa")
        done()
      })
    })
  })

  describe('/events', function(){
    before(function(){
      server.listen(3001)
    });

    after(function(){
      server.close()
      Event.collection.remove()
    })

    it('should be an empty collection', function(done){
      Event.find(function(err, events){
        if (err){ throw err }
        assert.equal(events.length, 0)
        done()
      })
    })

    describe('GET /', function(){
      it('should return a status code of 200', function(done){
        request.get('http://127.0.0.1:3001/events').end(function(err, res){
          if (err){ throw err; }
          assert.equal(res.statusCode, 200);
          done();
        });
      });
    })

    describe('POST /', function(){
      it('should return a status code of 200', function(done){
        request.post('http://127.0.0.1:3001/events').send({
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

      it('should have an instance of the event', function(done){
        Event.find(function(err, events){
          if (err){ throw err }
          assert.equal(events.length, 1)
          done()
        })
      })
    })

    describe('GET /:id', function(done){
      it('should render 404 on bad id', function(done){
        request.get('http://127.0.0.1:3001/events/lolsup').end(function(err, res){
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
        Event.findOne({title: "tea with teddy bear"}, function(err, event){
          if (err){ throw err }
          request.get('http://127.0.0.1:3001/events/'+event._id).end(function(err, res){
            if (err){ throw err }
            assert.equal(res.statusCode, 200)
            done()
          })
        })
      })
    })

    describe('PUT /:id', function(done){
      it('should render 404 on bad id', function(done){
        request.put('http://127.0.0.1:3001/events/lolsup').send({
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
        Event.findOne({title: "tea with teddy bear"}, function(err, event){
          if (err){ throw err }
          request.put('http://127.0.0.1:3001/events/'+event._id).send({
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

      it('should have updated the event', function(done){
        Event.findOne({"title": "tea with friends"}, function(err, event){
          if (err){ throw err; }
          assert.equal(event.location, "mom's house")
          done()
        })
      })
    })

    describe('DELETE /:id', function(){
      it('should render 404 on bad id', function(done){
        request.del('http://127.0.0.1:3001/events/lolsup').end(function(err, res){
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
        Event.findOne({"title": "tea with friends"}, function(err, event){
          if (err){ throw err; }
          request.del('http://127.0.0.1:3001/events/'+event._id).end(function(err, res){
            if (err){ throw err; }
            assert.equal(res.statusCode, 200);
            done();
          });
        })
      })

      it('should have deleted the event', function(done){
        Event.findOne({"title": "tea with friends"}, function(err, event){
          if (err){ throw err; }
          assert.equal(event, null)
          done()
        })
      })
    })
    describe('DELETE /', function(){
      before(function(){
        var events = [
          {
            title: "tea with teddy bear",
            from: "2015-04-28",
            to: "2015-04-29",
            location: "mom's house",
            description: "TEA TIME",
            participants: "mom, teddy bear"
          },
          {
            title: "coffee with dog",
            from: "2015-04-28",
            to: "2015-04-29",
            location: "living room",
            description: "coffe time",
            participants: "me, doge"
          },
          {
            title: "chill",
            from: "2015-04-28",
            to: "2015-04-29",
            location: "computer",
            description: "yo",
            participants: "just me"
          },
        ]
        Event.collection.insert(events, function(err, docs){
          if (err){ throw err; }
        })
      })

      it('should render 200', function(done){
        Event.find(function(err, events){
          if (err){ throw err; }
          assert.equal(events.length, 3)
          request.del('http://127.0.0.1:3001/events/').end(function(err, res){
            if (err){ throw err; }
            assert.equal(res.statusCode, 200);
            done();
          });
        })
      })

      it('should have deleted the events', function(done){
        Event.find(function(err, events){
          if (err){ throw err; }
          assert.equal(events.length, 0)
          done()
        })
      })
    })

    describe('title search', function(){
      before(function(){
        var events = [
          {
            title: "tea with teddy bear",
            from: "2015-04-28",
            to: "2015-04-29",
            location: "mom's house",
            description: "TEA TIME",
            participants: "mom, teddy bear"
          },
          {
            title: "coffee with dog",
            from: "2015-04-28",
            to: "2015-04-29",
            location: "living room",
            description: "coffe time",
            participants: "me, doge"
          },
          {
            title: "coffee",
            from: "2015-04-28",
            to: "2015-04-29",
            location: "computer",
            description: "yo",
            participants: "just me"
          },
        ]
        Event.collection.insert(events, function(err, docs){
          if (err){ throw err; }
        })
      })

      it('should return only all matching items', function(done){
        request.get('http://127.0.0.1:3001/events/search/coff').end(function(err, res){
          if (err){ throw err; }
          assert.equal(res.body.length, 2)
          done()
        });
      });

      it('should return an empty list when no matches are found', function(done){
        request.get('http://127.0.0.1:3001/events/search/hello').end(function(err, res){
          if (err){ throw err; }
          assert.equal(res.body.length, 0)
          done()
        });
      });
    });
  });
});