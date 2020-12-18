const Player = require('../models/player');

exports.getAllPlayer = async () => await Player.find();
exports.saveAllPlayer = async (req, res) => {
  let players = [];
  for (const player of req.body.human) {
    players.push(player);
    const user = await Player.findOne({ name: player });
    if (!user) {
      Player.create({ name: player });
    }
  }
  res.send(players);
};
exports.playerWin = async (req, res, i) => {
  console.log(req.body.human[i]);
  const winner = await Player.findOne({ name: req.body.human[i] });
  winner.score += 1;
  winner.save();
  res.send(winner);
};
