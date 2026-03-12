/**
 * CONTROLLER – Payment (VNPay Sandbox)
 */
const VNPayHelper      = require('../utils/vnpay');
const TransactionModel = require('../models/Transaction');
const UserModel        = require('../models/User');

const PACKAGES = [
  { xu: 10000,  vnd: 10000,  label: '10K xu',  popular: false },
  { xu: 50000,  vnd: 50000,  label: '50K xu',  popular: true  },
  { xu: 100000, vnd: 100000, label: '100K xu', popular: false },
  { xu: 500000, vnd: 500000, label: '500K xu', popular: false },
];

const PaymentController = {
  /** GET /payment/deposit */
  depositPage(req, res) {
    const txHistory = TransactionModel.byUser(req.session.userId);
    res.render('payment/deposit', {
      title: 'Nạp Xu – SaigonRide',
      packages: PACKAGES,
      txHistory,
    });
  },

  /** POST /payment/create – create VNPay order & redirect */
  createPayment(req, res) {
    const { packageIndex } = req.body;
    const pkg = PACKAGES[parseInt(packageIndex, 10)];
    if (!pkg) return res.status(400).send('Gói nạp không hợp lệ.');

    const userId  = req.session.userId;
    const orderId = VNPayHelper.generateOrderId(userId);

    // Record pending tx
    TransactionModel.create({ userId, amount: pkg.vnd, orderId });

    const payUrl = VNPayHelper.createPaymentUrl({
      orderId,
      amount:    pkg.vnd,
      orderInfo: `NapXu_${pkg.xu}_SaigonRide`,
      ipAddr:    req.ip || '127.0.0.1',
    });

    res.redirect(payUrl);
  },

  /** GET /payment/vnpay-return – VNPay redirects here */
  vnpayReturn(req, res) {
    const { valid, responseCode } = VNPayHelper.verifyReturn(req.query);
    const orderId = req.query.vnp_TxnRef;
    const tx      = TransactionModel.findByOrderId(orderId);

    if (!tx) {
      return res.render('payment/return', {
        title: 'Kết quả thanh toán',
        success: false,
        message: 'Không tìm thấy đơn hàng.',
        tx: null,
      });
    }

    if (valid && responseCode === '00') {
      TransactionModel.complete(orderId, responseCode);
      // Top up user balance
      UserModel.updateBalance(tx.userId, tx.amount);
      return res.render('payment/return', {
        title: 'Nạp xu thành công!',
        success: true,
        message: `Nạp thành công ${tx.amount.toLocaleString('vi-VN')} xu!`,
        tx,
      });
    }

    TransactionModel.fail(orderId);
    return res.render('payment/return', {
      title: 'Thanh toán thất bại',
      success: false,
      message: `Giao dịch bị từ chối (mã: ${responseCode}).`,
      tx,
    });
  },

  /** GET /payment/vnpay-ipn – server-to-server IPN (optional) */
  vnpayIPN(req, res) {
    const { valid, responseCode } = VNPayHelper.verifyReturn(req.query);
    if (!valid) return res.json({ RspCode: '97', Message: 'Invalid signature' });

    const orderId = req.query.vnp_TxnRef;
    const tx      = TransactionModel.findByOrderId(orderId);
    if (!tx)      return res.json({ RspCode: '01', Message: 'Order not found' });
    if (tx.status === 'success') return res.json({ RspCode: '02', Message: 'Already confirmed' });

    if (responseCode === '00') {
      TransactionModel.complete(orderId, responseCode);
      UserModel.updateBalance(tx.userId, tx.amount);
    } else {
      TransactionModel.fail(orderId);
    }
    return res.json({ RspCode: '00', Message: 'Confirmed' });
  },
};

module.exports = PaymentController;
