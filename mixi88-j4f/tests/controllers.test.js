/**
 * UNIT TESTS – Controllers (mocked dependencies)
 */
'use strict';

// ── mock req/res helpers ──────────────────────────────────
function mockReq(overrides = {}) {
  return {
    session: { userId: 'test_user_ctrl' },
    body:    {},
    query:   {},
    ip:      '127.0.0.1',
    ...overrides,
  };
}

function mockRes() {
  const res = {
    _status: 200,
    _json:   null,
    _redirect: null,
    _render: null,
  };
  res.status   = (code) => { res._status = code; return res; };
  res.json     = (data) => { res._json   = data; return res; };
  res.redirect = (url)  => { res._redirect = url; return res; };
  res.render   = (view, data) => { res._render = { view, data }; return res; };
  return res;
}

// ══════════════════════════════════════════════════════════
//  GAME CONTROLLER
// ══════════════════════════════════════════════════════════
describe('GameController.roll', () => {
  let GameController, UserModel, GameModel;

  beforeEach(() => {
    jest.resetModules();
    UserModel      = require('../models/User');
    GameModel      = require('../models/Game');
    GameController = require('../controllers/gameController');
    UserModel._store.clear();
    GameModel._rounds.length = 0;
    UserModel.create('test_user_ctrl');
  });

  test('returns 400 if betAmount is 0', () => {
    const req = mockReq({ body: { betAmount: 0, betSide: 'tai' } });
    const res = mockRes();
    GameController.roll(req, res);
    expect(res._status).toBe(400);
    expect(res._json.error).toBeTruthy();
  });

  test('returns 400 if betSide is invalid', () => {
    const req = mockReq({ body: { betAmount: 500, betSide: 'middle' } });
    const res = mockRes();
    GameController.roll(req, res);
    expect(res._status).toBe(400);
  });

  test('returns 400 if balance is insufficient', () => {
    UserModel.findById('test_user_ctrl').balance = 50;
    const req = mockReq({ body: { betAmount: 1000, betSide: 'tai' } });
    const res = mockRes();
    GameController.roll(req, res);
    expect(res._status).toBe(400);
    expect(res._json.error).toMatch(/số dư/i);
  });

  test('returns 200 with round and balance on valid bet', () => {
    const req = mockReq({ body: { betAmount: 500, betSide: 'tai' } });
    const res = mockRes();
    GameController.roll(req, res);
    expect(res._json.success).toBe(true);
    expect(res._json.round).toBeDefined();
    expect(res._json.balance).toBeDefined();
  });

  test('balance changes by correct amount on win', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99); // force tai
    const req = mockReq({ body: { betAmount: 1000, betSide: 'tai' } });
    const res = mockRes();
    GameController.roll(req, res);
    jest.spyOn(Math, 'random').mockRestore();
    expect(res._json.round.won).toBe(true);
    expect(res._json.balance).toBeGreaterThan(10000);
  });
});

// ══════════════════════════════════════════════════════════
//  PAYMENT CONTROLLER
// ══════════════════════════════════════════════════════════
describe('PaymentController.createPayment', () => {
  let PaymentController;

  beforeEach(() => {
    jest.resetModules();
    PaymentController = require('../controllers/paymentController');
  });

  test('redirects to VNPay for valid package', () => {
    const req = mockReq({ body: { packageIndex: '0' } });
    const res = mockRes();
    PaymentController.createPayment(req, res);
    expect(res._redirect).toMatch(/sandbox\.vnpayment\.vn/);
  });

  test('returns 400 for invalid package index', () => {
    const req = mockReq({ body: { packageIndex: '99' } });
    const res = mockRes();
    // send() is called on invalid pkg
    res.send = (msg) => { res._json = { msg }; return res; };
    PaymentController.createPayment(req, res);
    expect(res._status).toBe(400);
  });
});

// ══════════════════════════════════════════════════════════
//  ADMIN CONTROLLER
// ══════════════════════════════════════════════════════════
describe('AdminController.liveStats', () => {
  let AdminController;

  beforeEach(() => {
    jest.resetModules();
    AdminController = require('../controllers/adminController');
  });

  test('returns JSON with game, user, tx, ts keys', () => {
    const req = mockReq();
    const res = mockRes();
    AdminController.liveStats(req, res);
    expect(res._json).toHaveProperty('game');
    expect(res._json).toHaveProperty('user');
    expect(res._json).toHaveProperty('tx');
    expect(res._json).toHaveProperty('ts');
  });
});
