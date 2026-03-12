/**
 * CONTROLLER – Admin Dashboard
 */
const GameModel        = require('../models/Game');
const UserModel        = require('../models/User');
const TransactionModel = require('../models/Transaction');

const AdminController = {
  /** GET /admin – main dashboard */
  dashboard(req, res) {
    const gameStats = GameModel.stats();
    const userStats = UserModel.stats();
    const txStats   = TransactionModel.stats();
    const recentRounds = GameModel.all(10);
    const recentTx     = TransactionModel.all().slice(0, 10);
    const allUsers     = UserModel.all().slice(0, 20);

    // Chart data: tai vs xiu distribution
    const chartData = {
      taiXiu: {
        labels: ['Tài', 'Xỉu'],
        values: [gameStats.taiCount, gameStats.xiuCount],
      },
      txStatus: {
        labels: ['Thành công', 'Đang chờ', 'Thất bại'],
        values: [txStats.success, txStats.pending, txStats.failed],
      },
    };

    res.render('admin/dashboard', {
      title:        'Admin Dashboard – SaigonRide',
      gameStats,
      userStats,
      txStats,
      recentRounds,
      recentTx,
      allUsers,
      chartData:    JSON.stringify(chartData),
    });
  },

  /** GET /admin/api/stats – live polling endpoint */
  liveStats(req, res) {
    res.json({
      game: GameModel.stats(),
      user: UserModel.stats(),
      tx:   TransactionModel.stats(),
      ts:   new Date().toISOString(),
    });
  },
};

module.exports = AdminController;
