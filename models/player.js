const mongoose = require('mongoose');

const { Schema } = mongoose;

const Player = new Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  }
  
});

module.exports = mongoose.model('Player', Player);
