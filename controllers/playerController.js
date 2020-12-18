const Player = require('../models/player');

exports.getAllPlayer = async () => await Player.find()
