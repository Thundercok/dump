'use strict';

// ── Constants ─────────────────────────────────────────────
const FACES      = ['⚀','⚁','⚂','⚃','⚄','⚅'];
const FAKE_NAMES = ['MixiFan**','ProGamer**','NightOwl**','Lucky**','Dragon**','StarPlayer**','VIPMember**'];
const FAKE_AMTS  = [500,1000,2000,5000,10000,20000,50000];

// ── Spin Wheel Config ─────────────────────────────────────
const SPIN_PRIZES = [
  { label:'500 🪙',    coins:500,   color:'#3a006f' },
  { label:'1,000 🪙',  coins:1000,  color:'#5c0099' },
  { label:'500 🪙',    coins:500,   color:'#3a006f' },
  { label:'X2 Cược',  coins:0,     color:'#8b0000', special:'x2' },
  { label:'2,000 🪙',  coins:2000,  color:'#7700cc' },
  { label:'500 🪙',    coins:500,   color:'#3a006f' },
  { label:'5,000 🪙',  coins:5000,  color:'#aa44ff' },
  { label:'1,000 🪙',  coins:1000,  color:'#5c0099' },
  { label:'10,000 🪙', coins:10000, color:'#ff6b00', special:'jackpot' },
  { label:'500 🪙',    coins:500,   color:'#3a006f' },
];
const SEG_COUNT = SPIN_PRIZES.length;
const SEG_ANGLE = (2 * Math.PI) / SEG_COUNT;
const SPIN_KEY  = 'mixi88_spin_ts';

// ── State ─────────────────────────────────────────────────
let betAmount = 0, betSide = null, isRolling = false;
let spinDeg   = 0, isSpinning = false;

// ── DOM refs ──────────────────────────────────────────────
const rollBtn     = document.getElementById('roll-btn');
const betDisp     = document.getElementById('bet-disp');
const d1El        = document.getElementById('d1');
const d2El        = document.getElementById('d2');
const d3El        = document.getElementById('d3');
const sumVal      = document.getElementById('sum-val');
const sumRes      = document.getElementById('sum-res');
const histRow     = document.getElementById('hist-row');
const tbody       = document.getElementById('history-tbody');
const navBal      = document.getElementById('navbar-balance');
const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));

// ══════════════════════════════════════════════════════════
//  SPIN WHEEL CANVAS
// ══════════════════════════════════════════════════════════
const spinCanvas = document.getElementById('spinCanvas');
const ctx        = spinCanvas.getContext('2d');
const CX = 120, CY = 120, R = 112;

function lighten(hex, amt) {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

function drawWheel(rotRad = 0) {
  ctx.clearRect(0, 0, 240, 240);

  // Glow ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, R + 6, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(180,78,255,.5)';
  ctx.lineWidth   = 10;
  ctx.shadowColor = '#b44eff';
  ctx.shadowBlur  = 18;
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < SEG_COUNT; i++) {
    const start = rotRad + i * SEG_ANGLE - Math.PI / 2;
    const end   = start + SEG_ANGLE;
    const p     = SPIN_PRIZES[i];

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R, start, end);
    ctx.closePath();
    const sg = ctx.createRadialGradient(CX, CY, 18, CX, CY, R);
    sg.addColorStop(0, lighten(p.color, 40));
    sg.addColorStop(1, p.color);
    ctx.fillStyle   = sg;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.45)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(start + SEG_ANGLE / 2);
    ctx.textAlign   = 'right';
    ctx.fillStyle   = '#fff';
    ctx.font        = p.special === 'jackpot' ? 'bold 11px Nunito,sans-serif' : '10px Nunito,sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,.9)';
    ctx.shadowBlur  = 5;
    ctx.fillText(p.label, R - 7, 4);
    ctx.restore();
  }

  // Hub
  const hg = ctx.createRadialGradient(CX, CY, 0, CX, CY, 24);
  hg.addColorStop(0, '#ffcc00');
  hg.addColorStop(1, '#ff6b00');
  ctx.beginPath();
  ctx.arc(CX, CY, 24, 0, 2 * Math.PI);
  ctx.fillStyle   = hg;
  ctx.shadowColor = '#ff6b00';
  ctx.shadowBlur  = 12;
  ctx.fill();
  ctx.shadowBlur  = 0;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth   = 2.5;
  ctx.stroke();

  ctx.font      = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText('🦊', CX, CY + 7);
}

drawWheel(0);

// Animate spin
let animStart = null, animFrom = 0, animTo = 0, animDur = 4000;

function animSpin(ts) {
  if (!animStart) animStart = ts;
  const p   = Math.min((ts - animStart) / animDur, 1);
  const e   = 1 - Math.pow(1 - p, 3);
  const cur = animFrom + (animTo - animFrom) * e;
  spinDeg   = cur % 360;
  drawWheel((cur * Math.PI) / 180);
  if (p < 1) { requestAnimationFrame(animSpin); }
  else { isSpinning = false; document.getElementById('spin-btn').disabled = false; onSpinEnd(); }
}

// ── Lucky Spin ────────────────────────────────────────────
window.doSpin = function () {
  if (isSpinning) return;
  const last = parseInt(localStorage.getItem(SPIN_KEY) || '0', 10);
  const now  = Date.now();
  if (last && now - last < 86400000) {
    const rem  = 86400000 - (now - last);
    showCD(`⏳ Quay lại sau ${Math.floor(rem/3600000)}h ${Math.floor((rem%3600000)/60000)}m`);
    return;
  }
  isSpinning = true;
  document.getElementById('spin-btn').disabled = true;
  document.getElementById('spin-result-area').innerHTML = '';

  const idx      = weightedRandom();
  const targDeg  = 360 - (idx * (360 / SEG_COUNT)) - (360 / SEG_COUNT / 2);
  const fullSpin = 5 + Math.floor(Math.random() * 3);

  animFrom  = spinDeg;
  animTo    = spinDeg + fullSpin * 360 + targDeg;
  animStart = null;
  animDur   = 4000 + Math.random() * 700;
  doSpin._prize = SPIN_PRIZES[idx];
  localStorage.setItem(SPIN_KEY, String(now));
  showCD('🎡 Đang quay...');
  requestAnimationFrame(animSpin);
};

function weightedRandom() {
  const w   = SPIN_PRIZES.map(p => p.special === 'jackpot' ? 3 : p.special === 'x2' ? 8 : 11);
  const tot = w.reduce((a,b) => a+b, 0);
  let r     = Math.random() * tot;
  for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
  return 0;
}

function onSpinEnd() {
  const p    = doSpin._prize;
  const area = document.getElementById('spin-result-area');
  if (p.special === 'jackpot') {
    area.innerHTML = `<div class="mx-spin-result">🎉 JACKPOT! +${p.coins.toLocaleString('vi-VN')} 🪙</div>`;
    burst(true);
  } else if (p.special === 'x2') {
    area.innerHTML = `<div class="mx-spin-result" style="color:#ff2255">🔥 X2 ván tiếp theo!</div>`;
    localStorage.setItem('mixi88_x2','1');
    burst(false);
  } else {
    area.innerHTML = `<div class="mx-spin-result">🎁 +${p.coins.toLocaleString('vi-VN')} 🪙 đã được cộng!</div>`;
    burst(false);
  }
  addToast('🎡', `Lucky Spin: <span style="color:#ffaa00">+${p.coins.toLocaleString('vi-VN')} MixiCoins</span>!`, true);
  showCD('✅ Đã quay hôm nay – quay lại sau 24h.');
}

function showCD(msg) {
  const el = document.getElementById('spin-cooldown');
  if (el) el.textContent = msg;
}

(function checkCD() {
  const last = parseInt(localStorage.getItem(SPIN_KEY) || '0', 10);
  const now  = Date.now();
  if (last && now - last < 86400000) {
    const rem = 86400000 - (now - last);
    showCD(`⏳ Quay lại sau ${Math.floor(rem/3600000)}h ${Math.floor((rem%3600000)/60000)}m`);
    document.getElementById('spin-btn').disabled = true;
  }
})();

// ══════════════════════════════════════════════════════════
//  CORE GAME
// ══════════════════════════════════════════════════════════
window.pickChip = function (el) {
  document.querySelectorAll('.sr-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  betAmount = parseInt(el.dataset.val, 10);
  betDisp.textContent = betAmount.toLocaleString('vi-VN') + ' 🪙';
  checkReady();
};

window.pickSide = function (side) {
  betSide = side;
  document.querySelectorAll('.sr-cb').forEach(b => b.classList.remove('sel'));
  document.getElementById('btn-' + side).classList.add('sel');
  checkReady();
};

function checkReady() {
  rollBtn.disabled = !(betAmount > 0 && betSide && !isRolling);
}

window.doRoll = async function () {
  if (isRolling) return;
  isRolling = true;
  rollBtn.disabled = true;

  [d1El, d2El, d3El].forEach(d => d.classList.add('rolling'));
  const iv = setInterval(() => {
    d1El.textContent = FACES[Math.random() * 6 | 0];
    d2El.textContent = FACES[Math.random() * 6 | 0];
    d3El.textContent = FACES[Math.random() * 6 | 0];
  }, 65);

  try {
    const x2 = localStorage.getItem('mixi88_x2') === '1';
    if (x2) localStorage.removeItem('mixi88_x2');

    const res  = await fetch('/game/roll', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ betAmount, betSide }),
    });
    const data = await res.json();

    await delay(650);
    clearInterval(iv);
    [d1El, d2El, d3El].forEach(d => d.classList.remove('rolling'));

    if (!res.ok) { addToast('⚠️', data.error || 'Lỗi!', false); return; }

    const { round, balance } = data;

    d1El.textContent = FACES[round.dice[0] - 1];
    d2El.textContent = FACES[round.dice[1] - 1];
    d3El.textContent = FACES[round.dice[2] - 1];

    sumVal.textContent = round.sum;
    sumRes.textContent = round.result === 'tai' ? '🔥 TÀI' : '💎 XỈU';
    sumRes.className   = 'sr-sum-result ' + round.result;

    navBal.textContent = balance.toLocaleString('vi-VN') + ' 🪙';

    const chip = document.createElement('span');
    chip.className   = `sr-hc sr-hc-${round.result}`;
    chip.textContent = round.result === 'tai' ? 'T' : 'X';
    histRow.prepend(chip);
    if (histRow.children.length > 14) histRow.removeChild(histRow.lastChild);

    prependRow(round);
    await delay(200);
    showModal(round, x2);
  } catch (e) {
    clearInterval(iv);
    [d1El, d2El, d3El].forEach(d => d.classList.remove('rolling'));
    addToast('⚠️', 'Kết nối thất bại!', false);
  } finally {
    isRolling = false;
    checkReady();
  }
};

function prependRow(round) {
  const dice = round.dice.map(v => FACES[v - 1]).join(' ');
  const tr   = document.createElement('tr');
  tr.innerHTML = `
    <td class="text-muted">–</td><td>${dice}</td>
    <td class="fw-bold text-warning">${round.sum}</td>
    <td><span class="sr-hc sr-hc-${round.result}">${round.result==='tai'?'TÀI':'XỈU'}</span></td>
    <td class="text-muted">${betAmount.toLocaleString('vi-VN')}</td>
    <td class="fw-bold ${round.profit>=0?'text-success':'text-danger'}">
      ${round.profit>=0?'+':''}${round.profit.toLocaleString('vi-VN')}
    </td>`;
  const empty = tbody.querySelector('td[colspan]');
  if (empty) empty.closest('tr').remove();
  tbody.prepend(tr);
  if (tbody.rows.length > 15) tbody.deleteRow(tbody.rows.length - 1);
}

function showModal(round, wasX2) {
  document.getElementById('res-emoji').textContent = round.won ? '🎉' : '💸';
  const t = document.getElementById('res-title');
  t.textContent = round.won ? '🔥 THẮNG!' : 'THUA RỒI...';
  t.style.color = round.won ? '#ffaa00' : '#9988bb';

  document.getElementById('res-info').textContent =
    `Tổng: ${round.sum} → ${round.result==='tai'?'TÀI (11–17)':'XỈU (4–10)'}\n` +
    `Bạn chọn ${betSide==='tai'?'TÀI 🔥':'XỈU 💎'} – ${round.won?'ĐÚNG ✓':'SAI ✗'}` +
    (wasX2 ? '\n✨ X2 từ Lucky Spin!' : '');

  const a = document.getElementById('res-amount');
  a.textContent = (round.profit>=0?'+':'') + round.profit.toLocaleString('vi-VN') + ' 🪙';
  a.style.color = round.profit >= 0 ? '#00ff88' : '#ff2255';

  resultModal.show();
  if (round.won) burst(true);
}

// ── Particle burst ────────────────────────────────────────
function burst(big) {
  const colors = ['#ff6b00','#ffaa00','#b44eff','#00e5ff','#ff2255','#00ff88','#fff'];
  const count  = big ? 55 : 28;
  for (let i = 0; i < count; i++) {
    const el    = document.createElement('div');
    const angle = Math.random() * 2 * Math.PI;
    const dist  = 80 + Math.random() * (big ? 380 : 180);
    const dur   = 0.6 + Math.random() * 0.7;
    el.style.cssText = `
      position:fixed;z-index:9999;pointer-events:none;
      border-radius:${Math.random()>.5?'50%':'3px'};
      width:${big?10:7}px;height:${big?10:7}px;
      left:${25+Math.random()*50}vw;top:${15+Math.random()*35}vh;
      background:${colors[Math.random()*colors.length|0]};
      --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;
      animation:particleFly ${dur}s ease-out ${Math.random()*.3}s forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur+.5)*1000);
  }
}

// Inject keyframe once
if (!document.getElementById('_mx_kf')) {
  const s = document.createElement('style');
  s.id = '_mx_kf';
  s.textContent = `@keyframes particleFly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}`;
  document.head.appendChild(s);
}

// ── Toast ─────────────────────────────────────────────────
function addToast(icon, msg, win) {
  const c  = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast show align-items-center text-white border-0 mb-2';
  el.style.cssText = `background:rgba(14,0,24,.96);border-left:3px solid ${win?'#ff6b00':'#b44eff'} !important;max-width:260px;font-size:12px;font-family:'Nunito',sans-serif;border-radius:8px;`;
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${icon} ${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  c.appendChild(el);
  new bootstrap.Toast(el, { delay:4200 }).show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

// ── Fake winners ──────────────────────────────────────────
function fakeWinner() {
  const name = FAKE_NAMES[Math.random()*FAKE_NAMES.length|0];
  const amt  = FAKE_AMTS[Math.random()*FAKE_AMTS.length|0];
  const side = Math.random()>.5?'TÀI 🔥':'XỈU 💎';
  addToast('🏆', `<b>${name}</b> vừa thắng <span style="color:#ffaa00">+${amt.toLocaleString('vi-VN')} 🪙</span> (${side})`, true);
}
setTimeout(fakeWinner, 2000);
setInterval(() => setTimeout(fakeWinner, Math.random()*2000), 6000);

// ── Live stats ────────────────────────────────────────────
async function pollStats() {
  try {
    const d = await (await fetch('/admin/api/stats')).json();
    const e = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    e('stat-online',  (d.user.activeToday + 3800 + Math.floor(Math.random()*80)).toLocaleString('vi-VN'));
    e('stat-games',   d.game.total.toLocaleString('vi-VN'));
    e('stat-wagered', d.game.totalWagered.toLocaleString('vi-VN'));
  } catch (_) {}
}
pollStats();
setInterval(pollStats, 7000);

const delay = ms => new Promise(r => setTimeout(r, ms));
