const express          = require('express');
const router           = express.Router();
const AdminController  = require('../controllers/adminController');

router.get('/',          AdminController.dashboard);
router.get('/api/stats', AdminController.liveStats);

module.exports = router;
