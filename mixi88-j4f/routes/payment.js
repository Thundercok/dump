const express            = require('express');
const router             = express.Router();
const PaymentController  = require('../controllers/paymentController');

router.get('/deposit',      PaymentController.depositPage);
router.post('/create',      PaymentController.createPayment);
router.get('/vnpay-return', PaymentController.vnpayReturn);
router.get('/vnpay-ipn',    PaymentController.vnpayIPN);

module.exports = router;
