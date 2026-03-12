require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morgan  = require('morgan');
const path    = require('path');

const indexRoute   = require('./routes/index');
const gameRoute    = require('./routes/game');
const adminRoute   = require('./routes/admin');
const paymentRoute = require('./routes/payment');

const app = express();

// ── View Engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Middleware ────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Inject balance into every view via res.locals
app.use((req, res, next) => {
  const UserModel = require('./models/User');
  if (!req.session.userId) {
    req.session.userId = 'guest_' + Date.now();
    UserModel.create(req.session.userId);
  }
  res.locals.user = UserModel.findById(req.session.userId);
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/',        indexRoute);
app.use('/game',    gameRoute);
app.use('/admin',   adminRoute);
app.use('/payment', paymentRoute);

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: '404 – Không tìm thấy' });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Lỗi Server', message: err.message });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`🛵 SaigonRide running on http://localhost:${PORT}`));
}

module.exports = app;
