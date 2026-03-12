/**
 * MODEL – Game
 * Encapsulates dice roll logic and round history
 */
const rounds = [];
let roundCounter = 1;

const FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];

class Round {
  constructor({ userId, betAmount, betSide, dice }) {
    this.id        = roundCounter++;
    this.userId    = userId;
    this.betAmount = betAmount;
    this.betSide   = betSide;           // 'tai' | 'xiu'
    this.dice      = dice;              // [v1, v2, v3]
    this.sum       = dice.reduce((a, b) => a + b, 0);
    this.result    = this.sum >= 11 ? 'tai' : 'xiu';
    this.won       = this.result === betSide;
    this.payout    = this.won ? Math.floor(betAmount * 1.95) : 0;
    this.profit    = this.won ? this.payout - betAmount : -betAmount;
    this.timestamp = new Date();
  }

  get diceEmoji() {
    return this.dice.map(v => FACES[v - 1]);
  }
}

const GameModel = {
  /** Roll 3 dice and record a round */
  play({ userId, betAmount, betSide }) {
    const dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    const round = new Round({ userId, betAmount, betSide, dice });
    rounds.push(round);
    return round;
  },

  /** Last N rounds for a specific user */
  historyByUser(userId, limit = 20) {
    return rounds
      .filter(r => r.userId === userId)
      .slice(-limit)
      .reverse();
  },

  /** All rounds – for admin */
  all(limit = 200) {
    return rounds.slice(-limit).reverse();
  },

  /** Aggregate stats for admin dashboard */
  stats() {
    const total      = rounds.length;
    const taiCount   = rounds.filter(r => r.result === 'tai').length;
    const xiuCount   = rounds.filter(r => r.result === 'xiu').length;
    const totalWagered = rounds.reduce((s, r) => s + r.betAmount, 0);
    const totalPayout  = rounds.reduce((s, r) => s + r.payout,    0);

    // Last 20 results for trend bar
    const recentResults = rounds.slice(-20).map(r => r.result);

    // Rounds per minute (last 60 s)
    const now = Date.now();
    const rpm = rounds.filter(r => now - new Date(r.timestamp).getTime() < 60000).length;

    return { total, taiCount, xiuCount, totalWagered, totalPayout, recentResults, rpm };
  },

  _rounds: rounds   // exposed for tests
};

module.exports = GameModel;
