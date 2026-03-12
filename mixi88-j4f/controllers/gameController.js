/**
 * CONTROLLER – Game
 */
const GameModel = require('../models/Game');
const UserModel = require('../models/User');

const GameController = {
  /** GET /game – render game page */
  index(req, res) {
    const history = GameModel.historyByUser(req.session.userId, 15);
    res.render('game', {
      title: 'TAIXIU88 – SaigonRide',
      history,
    });
  },

  /** POST /game/roll – JSON API */
  roll(req, res) {
    const { betAmount, betSide } = req.body;
    const userId = req.session.userId;

    // ── Validation ──────────────────────────────────────────
    const amount = parseInt(betAmount, 10);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Số tiền cược không hợp lệ.' });
    }
    if (!['tai', 'xiu'].includes(betSide)) {
      return res.status(400).json({ error: 'Chọn Tài hoặc Xỉu.' });
    }

    const user = UserModel.findById(userId);
    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Số dư không đủ.' });
    }

    // ── Play ─────────────────────────────────────────────────
    const round = GameModel.play({ userId, betAmount: amount, betSide });

    // ── Update user stats ─────────────────────────────────────
    UserModel.recordGame(userId, {
      betAmount: amount,
      won:       round.won,
      payout:    round.payout,
    });

    const updatedUser = UserModel.findById(userId);

    return res.json({
      success: true,
      round: {
        dice:    round.dice,
        sum:     round.sum,
        result:  round.result,
        won:     round.won,
        payout:  round.payout,
        profit:  round.profit,
      },
      balance: updatedUser.balance,
    });
  },

  /** GET /game/history – JSON, last 20 rounds for current user */
  history(req, res) {
    const history = GameModel.historyByUser(req.session.userId, 20);
    res.json({ history: history.map(r => ({
      id:     r.id,
      dice:   r.dice,
      sum:    r.sum,
      result: r.result,
      betSide: r.betSide,
      won:    r.won,
      profit: r.profit,
      ts:     r.timestamp,
    }))});
  },
};

module.exports = GameController;
