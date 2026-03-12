/**
 * MODEL – User
 * In-memory store (swap with DB for production)
 */
const users = new Map();

class User {
  constructor(id) {
    this.id        = id;
    this.balance   = 10000;       // starting chips
    this.totalBets   = 0;
    this.totalWins   = 0;   // total payout xu received
    this.winsCount   = 0;   // number of winning rounds
    this.totalLosses = 0;
    this.gamesPlayed = 0;
    this.createdAt = new Date();
    this.lastActive = new Date();
  }

  get winRate() {
    if (this.gamesPlayed === 0) return 0;
    return ((this.winsCount / this.gamesPlayed) * 100).toFixed(1);
  }

  get netProfit() {
    return this.totalWins - this.totalLosses;
  }
}

const UserModel = {
  create(id) {
    const u = new User(id);
    users.set(id, u);
    return u;
  },

  findById(id) {
    return users.get(id) || null;
  },

  updateBalance(id, delta) {
    const u = users.get(id);
    if (!u) return null;
    u.balance = Math.max(0, u.balance + delta);
    u.lastActive = new Date();
    return u;
  },

  recordGame(id, { betAmount, won, payout }) {
    const u = users.get(id);
    if (!u) return null;
    u.gamesPlayed++;
    u.totalBets += betAmount;
    if (won) {
      u.winsCount  += 1;
      u.totalWins  += payout;
      u.balance    += payout;
    } else {
      u.totalLosses += betAmount;
      u.balance     = Math.max(0, u.balance - betAmount);
    }
    u.lastActive = new Date();
    return u;
  },

  /** Admin: return all users as array */
  all() {
    return Array.from(users.values());
  },

  /** Stats for admin dashboard */
  stats() {
    const all   = UserModel.all();
    const totalBets   = all.reduce((s, u) => s + u.totalBets,    0);
    const totalPayout = all.reduce((s, u) => s + u.totalWins,    0);
    const houseEdge   = totalBets > 0
      ? (((totalBets - totalPayout) / totalBets) * 100).toFixed(2)
      : 0;
    return {
      totalUsers:   all.length,
      activeToday:  all.filter(u => {
        const diff = Date.now() - new Date(u.lastActive).getTime();
        return diff < 24 * 60 * 60 * 1000;
      }).length,
      totalBets,
      totalPayout,
      houseEdge,
      totalGames: all.reduce((s, u) => s + u.gamesPlayed, 0),
    };
  },

  _store: users   // exposed for tests
};

module.exports = UserModel;
