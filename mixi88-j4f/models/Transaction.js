/**
 * MODEL – Transaction
 * Stores VNPay deposit records
 */
const transactions = new Map();
let txCounter = 1;

class Transaction {
  constructor({ userId, amount, orderId }) {
    this.id        = txCounter++;
    this.userId    = userId;
    this.amount    = amount;          // VND → converted to xu 1:1 for demo
    this.orderId   = orderId;
    this.status    = 'pending';       // pending | success | failed
    this.vnpayCode = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

const TransactionModel = {
  create({ userId, amount, orderId }) {
    const tx = new Transaction({ userId, amount, orderId });
    transactions.set(orderId, tx);
    return tx;
  },

  findByOrderId(orderId) {
    return transactions.get(orderId) || null;
  },

  complete(orderId, vnpayCode) {
    const tx = transactions.get(orderId);
    if (!tx) return null;
    tx.status    = 'success';
    tx.vnpayCode = vnpayCode;
    tx.updatedAt = new Date();
    return tx;
  },

  fail(orderId) {
    const tx = transactions.get(orderId);
    if (!tx) return null;
    tx.status    = 'failed';
    tx.updatedAt = new Date();
    return tx;
  },

  byUser(userId) {
    return Array.from(transactions.values()).filter(t => t.userId === userId);
  },

  all() {
    return Array.from(transactions.values()).reverse();
  },

  stats() {
    const all = TransactionModel.all();
    return {
      total:      all.length,
      success:    all.filter(t => t.status === 'success').length,
      pending:    all.filter(t => t.status === 'pending').length,
      failed:     all.filter(t => t.status === 'failed').length,
      totalVND:   all.filter(t => t.status === 'success').reduce((s,t) => s + t.amount, 0),
    };
  },

  _store: transactions
};

module.exports = TransactionModel;
