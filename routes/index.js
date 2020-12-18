const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController')



/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { Score: await playerController.getAllPlayer() });
});
router.post('/saveplayer', async (req, res, next) => {
  const users = await playerController.saveAllPlayer(req, res);
  res.status(200).send(users)
});

module.exports = router;
