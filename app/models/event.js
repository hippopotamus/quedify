var mongoose = require('mongoose');

var setParticipants = function (tags) {
  return tags.split(',').map(function(tag){ return tag.trim() });
};

var EventSchema = new mongoose.Schema({
  title: {type: String},
  from: {type: Date},
  to: {type: Date},
  location: {type: String, default: ''},
  description: {type: String, default: ''},
  participants: {type: [], set: setParticipants}
})

EventSchema.path('title').required(true, "'Title' field cannot be blank");
EventSchema.path('from').required(true, "'From' field cannot be blank");
EventSchema.path('to').required(true, "'To' field cannot be blank");
EventSchema.path('location').required(true, "'Location' field cannot be blank");

module.exports = mongoose.model('Event', EventSchema)