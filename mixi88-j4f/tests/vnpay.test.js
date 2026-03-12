/**
 * UNIT TESTS – VNPay Helper Utility
 */
'use strict';

process.env.VNPAY_TMN_CODE    = 'TESTCODE';
process.env.VNPAY_HASH_SECRET = 'TESTSECRET';
process.env.VNPAY_RETURN_URL  = 'http://localhost:3000/payment/vnpay-return';

const crypto = require('crypto');
const qs     = require('qs');
const VNPay  = require('../utils/vnpay');

function sign(params, secret) {
  const sorted = Object.keys(params).sort().reduce((acc, k) => { acc[k] = params[k]; return acc; }, {});
  const raw    = qs.stringify(sorted, { encode: false });
  return crypto.createHmac('sha512', secret).update(raw).digest('hex');
}

describe('VNPayHelper', () => {

  test('createPaymentUrl() returns a URL starting with VNPay sandbox host', () => {
    const url = VNPay.createPaymentUrl({ orderId: 'ORDER_001', amount: 50000, orderInfo: 'Test', ipAddr: '127.0.0.1' });
    expect(url).toMatch(/^https:\/\/sandbox\.vnpayment\.vn/);
  });

  test('createPaymentUrl() includes vnp_TxnRef equal to orderId', () => {
    const url = VNPay.createPaymentUrl({ orderId: 'ORDER_XYZ', amount: 10000, orderInfo: 'Test', ipAddr: '127.0.0.1' });
    expect(url).toContain('vnp_TxnRef=ORDER_XYZ');
  });

  test('createPaymentUrl() multiplies amount by 100 for VNPay', () => {
    const url = VNPay.createPaymentUrl({ orderId: 'ORDER_AMT', amount: 50000, orderInfo: 'Test', ipAddr: '127.0.0.1' });
    expect(url).toContain('vnp_Amount=5000000');
  });

  test('createPaymentUrl() includes a valid vnp_SecureHash', () => {
    const url  = VNPay.createPaymentUrl({ orderId: 'ORDER_HASH', amount: 10000, orderInfo: 'X', ipAddr: '127.0.0.1' });
    const params = Object.fromEntries(new URLSearchParams(url.split('?')[1]));
    expect(params.vnp_SecureHash).toHaveLength(128); // SHA-512 hex = 128 chars
  });

  test('verifyReturn() returns valid=true for a correctly signed response', () => {
    const params = {
      vnp_TxnRef:      'ORDER_001',
      vnp_ResponseCode:'00',
      vnp_Amount:      '5000000',
      vnp_BankCode:    'NCB',
    };
    const hash = sign(params, 'TESTSECRET');
    const { valid, responseCode } = VNPay.verifyReturn({ ...params, vnp_SecureHash: hash });
    expect(valid).toBe(true);
    expect(responseCode).toBe('00');
  });

  test('verifyReturn() returns valid=false for tampered data', () => {
    const params = {
      vnp_TxnRef:      'ORDER_002',
      vnp_ResponseCode:'00',
      vnp_Amount:      '5000000',
    };
    const { valid } = VNPay.verifyReturn({ ...params, vnp_SecureHash: 'bad_hash_value' });
    expect(valid).toBe(false);
  });

  test('generateOrderId() starts with SR and contains timestamp', () => {
    const id = VNPay.generateOrderId('user_abcdef');
    expect(id).toMatch(/^SR\d+/);
    expect(id.length).toBeGreaterThan(8);
  });

  test('generateOrderId() produces unique IDs on successive calls', async () => {
    const id1 = VNPay.generateOrderId('user_1');
    await new Promise(r => setTimeout(r, 5));
    const id2 = VNPay.generateOrderId('user_1');
    expect(id1).not.toBe(id2);
  });
});
