const express        = require('express');
const router         = express.Router();
const GameController = require('../controllers/gameController');

router.get('/',        GameController.index);
router.post('/roll',   GameController.roll);
router.get('/history', GameController.history);

module.exports = router;
