/**
 * UNIT TESTS – Models
 * Coverage: User, Game, Transaction
 */
'use strict';

// ─────────────────────────────────────────────────────────
// Isolate in-memory stores per test file
jest.isolateModules(() => {});
beforeEach(() => {
  jest.resetModules();
});

// ══════════════════════════════════════════════════════════
//  USER MODEL
// ══════════════════════════════════════════════════════════
describe('UserModel', () => {
  let UserModel;
  beforeEach(() => { UserModel = require('../models/User'); UserModel._store.clear(); });

  test('create() creates a user with default balance 10000', () => {
    const u = UserModel.create('user_001');
    expect(u.id).toBe('user_001');
    expect(u.balance).toBe(10000);
    expect(u.gamesPlayed).toBe(0);
  });

  test('findById() returns user or null', () => {
    UserModel.create('user_002');
    expect(UserModel.findById('user_002')).not.toBeNull();
    expect(UserModel.findById('nonexistent')).toBeNull();
  });

  test('updateBalance() increases balance by delta', () => {
    UserModel.create('user_003');
    UserModel.updateBalance('user_003', 5000);
    expect(UserModel.findById('user_003').balance).toBe(15000);
  });

  test('updateBalance() does not go below zero', () => {
    UserModel.create('user_004');
    UserModel.updateBalance('user_004', -99999);
    expect(UserModel.findById('user_004').balance).toBe(0);
  });

  test('recordGame() WIN: increases balance and totalWins', () => {
    UserModel.create('user_005');
    UserModel.recordGame('user_005', { betAmount: 1000, won: true, payout: 1950 });
    const u = UserModel.findById('user_005');
    expect(u.gamesPlayed).toBe(1);
    expect(u.balance).toBe(10000 + 1950);
    expect(u.totalWins).toBe(1950);
  });

  test('recordGame() LOSE: decreases balance and totalLosses', () => {
    UserModel.create('user_006');
    UserModel.recordGame('user_006', { betAmount: 1000, won: false, payout: 0 });
    const u = UserModel.findById('user_006');
    expect(u.gamesPlayed).toBe(1);
    expect(u.balance).toBe(9000);
    expect(u.totalLosses).toBe(1000);
  });

  test('winRate computed correctly', () => {
    UserModel.create('user_007');
    UserModel.recordGame('user_007', { betAmount: 500, won: true,  payout: 975 });
    UserModel.recordGame('user_007', { betAmount: 500, won: false, payout: 0   });
    expect(UserModel.findById('user_007').winRate).toBe('50.0');
  });

  test('stats() returns aggregate totals', () => {
    UserModel.create('u_a');
    UserModel.create('u_b');
    const stats = UserModel.stats();
    expect(stats.totalUsers).toBe(2);
  });
});

// ══════════════════════════════════════════════════════════
//  GAME MODEL
// ══════════════════════════════════════════════════════════
describe('GameModel', () => {
  let GameModel;
  beforeEach(() => {
    GameModel = require('../models/Game');
    GameModel._rounds.length = 0;
  });

  test('play() returns a round with 3 dice values 1–6', () => {
    const r = GameModel.play({ userId: 'u1', betAmount: 1000, betSide: 'tai' });
    expect(r.dice).toHaveLength(3);
    r.dice.forEach(v => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    });
  });

  test('play() sum equals dice[0]+dice[1]+dice[2]', () => {
    const r = GameModel.play({ userId: 'u1', betAmount: 500, betSide: 'xiu' });
    expect(r.sum).toBe(r.dice[0] + r.dice[1] + r.dice[2]);
  });

  test('play() result is "tai" when sum >= 11', () => {
    // Force a tai result by mocking Math.random
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.99); // always returns 6
    const r = GameModel.play({ userId: 'u2', betAmount: 100, betSide: 'tai' });
    expect(r.result).toBe('tai');
    expect(r.sum).toBeGreaterThanOrEqual(11);
    spy.mockRestore();
  });

  test('play() result is "xiu" when sum <= 10', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0); // always returns 1
    const r = GameModel.play({ userId: 'u3', betAmount: 100, betSide: 'xiu' });
    expect(r.result).toBe('xiu');
    expect(r.sum).toBeLessThanOrEqual(10);
    spy.mockRestore();
  });

  test('play() won=true when betSide matches result', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
    const r = GameModel.play({ userId: 'u4', betAmount: 1000, betSide: 'tai' });
    expect(r.won).toBe(true);
    expect(r.payout).toBe(Math.floor(1000 * 1.95));
    spy.mockRestore();
  });

  test('play() won=false and payout=0 when betSide does not match', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.99); // tai result
    const r = GameModel.play({ userId: 'u5', betAmount: 1000, betSide: 'xiu' });
    expect(r.won).toBe(false);
    expect(r.payout).toBe(0);
    spy.mockRestore();
  });

  test('historyByUser() returns only rounds for that user', () => {
    GameModel.play({ userId: 'alice', betAmount: 100, betSide: 'tai' });
    GameModel.play({ userId: 'bob',   betAmount: 100, betSide: 'xiu' });
    GameModel.play({ userId: 'alice', betAmount: 200, betSide: 'xiu' });
    const hist = GameModel.historyByUser('alice');
    expect(hist).toHaveLength(2);
    hist.forEach(r => expect(r.userId).toBe('alice'));
  });

  test('stats() counts tai/xiu correctly', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99); // all tai
    GameModel.play({ userId: 'x', betAmount: 100, betSide: 'tai' });
    GameModel.play({ userId: 'x', betAmount: 100, betSide: 'tai' });
    jest.spyOn(Math, 'random').mockRestore();
    jest.spyOn(Math, 'random').mockReturnValue(0);    // all xiu
    GameModel.play({ userId: 'x', betAmount: 100, betSide: 'xiu' });
    jest.spyOn(Math, 'random').mockRestore();
    const s = GameModel.stats();
    expect(s.taiCount).toBe(2);
    expect(s.xiuCount).toBe(1);
    expect(s.total).toBe(3);
  });
});

// ══════════════════════════════════════════════════════════
//  TRANSACTION MODEL
// ══════════════════════════════════════════════════════════
describe('TransactionModel', () => {
  let TransactionModel;
  beforeEach(() => {
    TransactionModel = require('../models/Transaction');
    TransactionModel._store.clear();
  });

  test('create() creates a pending transaction', () => {
    const tx = TransactionModel.create({ userId: 'u1', amount: 50000, orderId: 'ORDER_001' });
    expect(tx.status).toBe('pending');
    expect(tx.amount).toBe(50000);
    expect(tx.orderId).toBe('ORDER_001');
  });

  test('findByOrderId() returns the correct tx', () => {
    TransactionModel.create({ userId: 'u1', amount: 10000, orderId: 'ORDER_002' });
    const tx = TransactionModel.findByOrderId('ORDER_002');
    expect(tx).not.toBeNull();
    expect(tx.amount).toBe(10000);
  });

  test('findByOrderId() returns null for unknown order', () => {
    expect(TransactionModel.findByOrderId('GHOST_ORDER')).toBeNull();
  });

  test('complete() sets status to success', () => {
    TransactionModel.create({ userId: 'u2', amount: 100000, orderId: 'ORDER_003' });
    const tx = TransactionModel.complete('ORDER_003', '00');
    expect(tx.status).toBe('success');
    expect(tx.vnpayCode).toBe('00');
  });

  test('fail() sets status to failed', () => {
    TransactionModel.create({ userId: 'u3', amount: 50000, orderId: 'ORDER_004' });
    const tx = TransactionModel.fail('ORDER_004');
    expect(tx.status).toBe('failed');
  });

  test('stats() aggregates correctly', () => {
    TransactionModel.create({ userId: 'u1', amount: 100000, orderId: 'TX_1' });
    TransactionModel.create({ userId: 'u2', amount: 50000,  orderId: 'TX_2' });
    TransactionModel.create({ userId: 'u3', amount: 200000, orderId: 'TX_3' });
    TransactionModel.complete('TX_1', '00');
    TransactionModel.fail('TX_2');
    const s = TransactionModel.stats();
    expect(s.total).toBe(3);
    expect(s.success).toBe(1);
    expect(s.failed).toBe(1);
    expect(s.pending).toBe(1);
    expect(s.totalVND).toBe(100000);
  });
});
