/**
 * UTILITY – VNPay Sandbox
 * Builds payment URL + verifies return checksum
 * Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 */
const crypto = require('crypto');
const qs     = require('qs');
const moment = require('moment');

const TMN_CODE    = process.env.VNPAY_TMN_CODE    || 'DEMO1234';
const HASH_SECRET = process.env.VNPAY_HASH_SECRET || 'DEMOSECRET';
const VNPAY_URL   = process.env.VNPAY_URL         || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const RETURN_URL  = process.env.VNPAY_RETURN_URL  || 'http://localhost:3000/payment/vnpay-return';

/**
 * Sort object keys, build raw hash string, sign with HMAC-SHA512
 */
function sign(params) {
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, k) => { acc[k] = params[k]; return acc; }, {});
  const rawStr = qs.stringify(sorted, { encode: false });
  return crypto.createHmac('sha512', HASH_SECRET).update(rawStr).digest('hex');
}

const VNPayHelper = {
  /**
   * Build a redirect URL to VNPay sandbox
   * @param {object} opts
   * @param {string} opts.orderId   – unique order ID
   * @param {number} opts.amount    – amount in VND (integer)
   * @param {string} opts.orderInfo – description
   * @param {string} opts.ipAddr    – client IP
   * @returns {string} redirect URL
   */
  createPaymentUrl({ orderId, amount, orderInfo, ipAddr }) {
    const createDate = moment().format('YYYYMMDDHHmmss');
    const expireDate = moment().add(15, 'minutes').format('YYYYMMDDHHmmss');

    const params = {
      vnp_Version:    '2.1.0',
      vnp_Command:    'pay',
      vnp_TmnCode:    TMN_CODE,
      vnp_Locale:     'vn',
      vnp_CurrCode:   'VND',
      vnp_TxnRef:     orderId,
      vnp_OrderInfo:  orderInfo,
      vnp_OrderType:  'other',
      vnp_Amount:     amount * 100,   // VNPay expects amount × 100
      vnp_ReturnUrl:  RETURN_URL,
      vnp_IpAddr:     ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    params.vnp_SecureHash = sign(params);
    return `${VNPAY_URL}?${qs.stringify(params, { encode: false })}`;
  },

  /**
   * Verify the return checksum from VNPay
   * @param {object} query – req.query from return URL
   * @returns {{ valid: boolean, responseCode: string }}
   */
  verifyReturn(query) {
    const { vnp_SecureHash, ...rest } = query;
    // Remove extra params not part of the signature
    delete rest.vnp_SecureHashType;

    const expected = sign(rest);
    const valid    = expected === vnp_SecureHash;
    return { valid, responseCode: query.vnp_ResponseCode };
  },

  /** Helper: generate a unique order ID */
  generateOrderId(userId) {
    return `SR${Date.now()}${userId.slice(-4).toUpperCase()}`;
  },
};

module.exports = VNPayHelper;
