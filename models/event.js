const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");

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
  }
});

module.exports = mongoose.model("Event", EventSchema);

module.exports.addEvent = function(event, callback) {
  event.save(callback);
};