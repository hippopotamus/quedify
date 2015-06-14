var mongoose = require('mongoose');

var getParticipants = function (tags) {
  return tags.join(', ');
};

var setParticipants = function (tags) {
  return tags.split(',').map(function(tag){ return tag.trim() });
};

var MeetingSchema = new mongoose.Schema({
  title: {type: String},
  from: {type: Date},
  to: {type: Date},
  location: {type: String, default: ''},
  description: {type: String, default: ''},
  participants: {type: [], get: getParticipants, set: setParticipants}
})

MeetingSchema.path('title').required(true, "'Title' field cannot be blank");
MeetingSchema.path('from').required(true, "'From' field cannot be blank");
MeetingSchema.path('to').required(true, "'To' field cannot be blank");
MeetingSchema.path('location').required(true, "'Location' field cannot be blank");

module.exports = mongoose.model('Meeting', MeetingSchema)