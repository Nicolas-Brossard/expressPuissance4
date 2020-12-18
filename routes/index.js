var express = require('express');
var router = express.Router();

const Score = [{'player':'Premier', 'score':3},{'player':'Deuxième', 'score':5},{'player':'Troisième', 'score':9}]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { Score: Score });
});

module.exports = router;
