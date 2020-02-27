const mongoose = require("mongoose");

var InvitationSchema = new mongoose.Schema({
   userId: String,
   accepted: Boolean
});

const EventSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
    unique: true,
  },
  end: {
    type: Date,
    required: true,
    unique: true
  },
  createdBy: {
    type: String,
    required: true
  },
  invitations: {
    type: [InvitationSchema],
    default: null,
  }
});

module.exports = mongoose.model("Event", EventSchema);


module.exports.addEvent = function(event, callback) {
  event.save(callback);
};

module.exports.deleteEvent = function(event, callback) {
  event.delete(callback);
};