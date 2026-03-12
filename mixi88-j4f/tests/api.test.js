/**
 * INTEGRATION TESTS – Express API Routes
 * Uses supertest to hit the actual Express app
 */
'use strict';

const request = require('supertest');

// Use fresh modules per test suite
let app, UserModel, GameModel;
beforeAll(() => {
  jest.resetModules();
  app       = require('../app');
  UserModel = require('../models/User');
  GameModel = require('../models/Game');
});

// ══════════════════════════════════════════════════════════
//  GET /game  – renders game page
// ══════════════════════════════════════════════════════════
describe('GET /game', () => {
  test('responds 200 and contains TAIXIU88 in HTML', async () => {
    const res = await request(app).get('/game');
    expect(res.status).toBe(200);
    expect(res.text).toContain('TAIXIU88');
  });

  test('responds 200 and contains LĂN NGAY button', async () => {
    const res = await request(app).get('/game');
    expect(res.text).toContain('LĂN NGAY');
  });
});

// ══════════════════════════════════════════════════════════
//  POST /game/roll  – JSON API
// ══════════════════════════════════════════════════════════
describe('POST /game/roll', () => {
  // Reuse the same session cookie across roll tests
  let agent;
  beforeEach(() => { agent = request.agent(app); });

  test('valid bet returns 200 with round data', async () => {
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: 500, betSide: 'tai' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.round).toHaveProperty('dice');
    expect(res.body.round).toHaveProperty('sum');
    expect(res.body.round).toHaveProperty('result');
    expect(res.body.round).toHaveProperty('won');
    expect(res.body).toHaveProperty('balance');
  });

  test('round.dice is array of 3 integers 1–6', async () => {
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: 100, betSide: 'xiu' });
    const { dice } = res.body.round;
    expect(dice).toHaveLength(3);
    dice.forEach(v => {
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    });
  });

  test('round.sum equals sum of dice', async () => {
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: 100, betSide: 'tai' });
    const { dice, sum } = res.body.round;
    expect(sum).toBe(dice[0] + dice[1] + dice[2]);
  });

  test('result is "tai" when sum >= 11, "xiu" otherwise', async () => {
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: 100, betSide: 'tai' });
    const { sum, result } = res.body.round;
    expect(result).toBe(sum >= 11 ? 'tai' : 'xiu');
  });

  test('balance decreases after a loss', async () => {
    // Force a loss: bet xiu but force tai result
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.99); // always 6 → tai
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: 1000, betSide: 'xiu' });
    spy.mockRestore();
    expect(res.body.round.won).toBe(false);
    expect(res.body.balance).toBeLessThan(10000);
  });

  test('balance increases after a win', async () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.99); // always tai
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: 1000, betSide: 'tai' });
    spy.mockRestore();
    expect(res.body.round.won).toBe(true);
    expect(res.body.balance).toBeGreaterThan(10000);
  });

  test('invalid betSide returns 400', async () => {
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: 500, betSide: 'invalid' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('negative betAmount returns 400', async () => {
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: -999, betSide: 'tai' });
    expect(res.status).toBe(400);
  });

  test('zero betAmount returns 400', async () => {
    const res = await agent
      .post('/game/roll')
      .send({ betAmount: 0, betSide: 'tai' });
    expect(res.status).toBe(400);
  });
});

// ══════════════════════════════════════════════════════════
//  GET /game/history
// ══════════════════════════════════════════════════════════
describe('GET /game/history', () => {
  test('returns JSON with history array', async () => {
    const agent = request.agent(app);
    // Play one round first
    await agent.post('/game/roll').send({ betAmount: 100, betSide: 'tai' });
    const res = await agent.get('/game/history');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('history');
    expect(Array.isArray(res.body.history)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════
//  GET /admin
// ══════════════════════════════════════════════════════════
describe('GET /admin', () => {
  test('responds 200 with Admin Dashboard HTML', async () => {
    const res = await request(app).get('/admin');
    expect(res.status).toBe(200);
    expect(res.text).toContain('ADMIN DASHBOARD');
  });
});

// ══════════════════════════════════════════════════════════
//  GET /admin/api/stats
// ══════════════════════════════════════════════════════════
describe('GET /admin/api/stats', () => {
  test('returns JSON with game, user, tx stats', async () => {
    const res = await request(app).get('/admin/api/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('game');
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('tx');
    expect(res.body).toHaveProperty('ts');
  });

  test('stats.game has taiCount and xiuCount', async () => {
    const res = await request(app).get('/admin/api/stats');
    expect(res.body.game).toHaveProperty('taiCount');
    expect(res.body.game).toHaveProperty('xiuCount');
    expect(res.body.game).toHaveProperty('total');
  });
});

// ══════════════════════════════════════════════════════════
//  GET /payment/deposit
// ══════════════════════════════════════════════════════════
describe('GET /payment/deposit', () => {
  test('responds 200 and shows VNPAY content', async () => {
    const res = await request(app).get('/payment/deposit');
    expect(res.status).toBe(200);
    expect(res.text).toContain('VNPAY');
  });

  test('shows all 4 xu packages', async () => {
    const res = await request(app).get('/payment/deposit');
    expect(res.text).toContain('10.000 xu');
    expect(res.text).toContain('50.000 xu');
    expect(res.text).toContain('100.000 xu');
    expect(res.text).toContain('500.000 xu');
  });
});

// ══════════════════════════════════════════════════════════
//  POST /payment/create
// ══════════════════════════════════════════════════════════
describe('POST /payment/create', () => {
  test('valid package redirects to VNPay sandbox', async () => {
    const res = await request(app)
      .post('/payment/create')
      .send('packageIndex=1')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    expect(res.status).toBe(302);
    expect(res.headers.location).toMatch(/sandbox\.vnpayment\.vn/);
  });

  test('invalid package returns 400', async () => {
    const res = await request(app)
      .post('/payment/create')
      .send('packageIndex=999')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    expect(res.status).toBe(400);
  });
});

// ══════════════════════════════════════════════════════════
//  GET /payment/vnpay-return  – success simulation
// ══════════════════════════════════════════════════════════
describe('GET /payment/vnpay-return', () => {
  const qs     = require('qs');
  const crypto = require('crypto');

  function signParams(params) {
    const secret = process.env.VNPAY_HASH_SECRET || 'DEMOSECRET';
    const sorted = Object.keys(params).sort().reduce((a,k)=>{ a[k]=params[k]; return a; }, {});
    const raw    = qs.stringify(sorted, { encode: false });
    return crypto.createHmac('sha512', secret).update(raw).digest('hex');
  }

  test('returns success page for responseCode 00 with valid signature', async () => {
    // Create a pending transaction first via POST /payment/create
    const agnt = request.agent(app);
    const createRes = await agnt
      .post('/payment/create')
      .send('packageIndex=0')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    // Parse the orderId from the redirect URL
    const redirectUrl  = createRes.headers.location;
    const urlParams    = Object.fromEntries(new URLSearchParams(new URL(redirectUrl).search));
    const orderId      = urlParams.vnp_TxnRef;

    const returnParams = {
      vnp_TxnRef:      orderId,
      vnp_ResponseCode:'00',
      vnp_Amount:      '1000000',
      vnp_BankCode:    'NCB',
    };
    returnParams.vnp_SecureHash = signParams(returnParams);

    const res = await agnt.get('/payment/vnpay-return?' + qs.stringify(returnParams, { encode: false }));
    expect(res.status).toBe(200);
    expect(res.text).toContain('NẠP THÀNH CÔNG');
  });

  test('returns failure page for unknown order', async () => {
    const params = {
      vnp_TxnRef:      'UNKNOWN_ORDER',
      vnp_ResponseCode:'00',
      vnp_SecureHash:  'invalidsig',
    };
    const res = await request(app).get('/payment/vnpay-return?' + qs.stringify(params));
    expect(res.status).toBe(200);
    expect(res.text).toContain('THANH TOÁN THẤT BẠI');
  });
});

// ══════════════════════════════════════════════════════════
//  GET /* – 404 page
// ══════════════════════════════════════════════════════════
describe('404 handler', () => {
  test('unknown route returns 404 page', async () => {
    const res = await request(app).get('/this-page-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.text).toContain('404');
  });
});
