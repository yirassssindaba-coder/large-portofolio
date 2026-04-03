import * as THREE from './vendor/three/build/three.module.js';

const canvas = document.getElementById('farmCanvas');
const stage = document.getElementById('gameStage');
const loader = document.getElementById('gameLoader');
const loaderBar = document.getElementById('gameLoaderBar');
const loaderCount = document.getElementById('gameLoaderCount');
const loaderText = document.getElementById('gameLoaderText');
const panelTitle = document.getElementById('panelTitle');
const panelText = document.getElementById('panelText');
const panelMeta = document.getElementById('panelMeta');
const panelActions = document.getElementById('panelActions');
const gameHint = document.getElementById('gameHint');
const toast = document.getElementById('gameToast');
const weatherValue = document.getElementById('weatherValue');
const seasonValue = document.getElementById('seasonValue');
const storageValue = document.getElementById('storageValue');
const ordersValue = document.getElementById('ordersValue');
const clockValue = document.getElementById('clockValue');
const dayValue = document.getElementById('dayValue');
const levelValue = document.getElementById('levelValue');
const coinValue = document.getElementById('coinValue');
const xpFill = document.getElementById('xpFill');
const xpLabel = document.getElementById('xpLabel');
const questText = document.getElementById('questText');
const questProgress = document.getElementById('questProgress');
const floatLayer = document.getElementById('floatLayer');
const fullscreenButton = document.getElementById('fullscreenButton');
const toggleUiButton = document.getElementById('toggleUiButton');
const focusTownButton = document.getElementById('focusTownButton');
const focusBarnButton = document.getElementById('focusBarnButton');
const inputModeEl = document.getElementById('gameInputMode');
const mobileControls = document.getElementById('gameMobileControls');
const moveStick = document.getElementById('moveStick');
const moveStickKnob = document.getElementById('moveStickKnob');
const actionButton = document.getElementById('actionButton');
const jumpButton = document.getElementById('jumpButton');
const zapButton = document.getElementById('zapButton');
const waveButton = document.getElementById('waveButton');
const runButton = document.getElementById('runButton');
const gameHelpTrigger = document.getElementById('gameHelpTrigger');
const gameCamArea = document.getElementById('gameCamArea');
const gameMenuToggle = document.getElementById('gameMenuToggle');
const gameMobileMenu = document.getElementById('gameMobileMenu');

/* ─── State ─────────────────────────────── */
const state = {
  weather: 'Cerah',
  season: 'Panen',
  storage: 24,
  storageCap: 80,
  orders: 3,
  day: 1,
  minutes: 10 * 60,
  coins: 1800,
  milkReady: 2,
  eggsReady: 5,
  fruitReady: 4,
  vegReady: 3,
  riceReady: 6,
  honeyReady: 1,
  breadReady: 0,
  mana: 100,
  xp: 0,
  level: 1,
  xpToNext: 100,
  currentSelection: 'town',
  questActive: null,
  questProgress: 0,
  questGoal: 0,
  questType: '',
  pets: [],
};

const weatherCycle = ['Cerah', 'Berawan', 'Hujan ringan', 'Kabut pagi', 'Cerah berawan', 'Berangin'];
const seasonCycle = ['Panen', 'Semi', 'Panas', 'Gugur'];

const world = {
  interactives: [],
  clickable: [],
  hovered: null,
  selected: null,
  effects: [],
  animals: [],
  clouds: [],
  windmillParts: [],
  interior: false,
  interiorType: null,
  interiorOrigin: new THREE.Vector3(),
  lightningBolts: [],
  waterRipples: [],
  cropPlots: [],
  petMeshes: [],
};

const input = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
  jumpQueued: false,
  interactQueued: false,
  spellLightningQueued: false,
  spellWaterQueued: false,
  pointerDown: false,
  usingTouch: false,
  moveTouch: { x: 0, y: 0 },
  lookDelta: { x: 0, y: 0 },
};

/* ─── Sound System ───────────────────────── */
const SND = (() => {
  let ctx = null;
  let master = null;
  let ambientStarted = false;

  function init() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
    if (!ambientStarted) { ambientStarted = true; _startAmbient(); }
    return ctx;
  }

  function _tone(freq, type, dur, vol, delay = 0) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    const t0 = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }

  function _noise(dur, vol, filterType, freq, delay = 0) {
    if (!ctx) return;
    const sz = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const flt = ctx.createBiquadFilter(); flt.type = filterType; flt.frequency.value = freq;
    const g = ctx.createGain();
    const t0 = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(flt); flt.connect(g); g.connect(master);
    src.start(t0);
  }

  function _startAmbient() {
    if (!ctx) return;
    const sz = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 320;
    const g = ctx.createGain(); g.gain.value = 0.035;
    src.connect(flt); flt.connect(g); g.connect(master); src.start();
    (function chirp() {
      setTimeout(() => {
        if (ctx && ctx.state === 'running') {
          _tone(1100 + Math.random() * 700, 'sine', 0.06, 0.04);
          _tone(1400 + Math.random() * 400, 'sine', 0.05, 0.03, 0.07);
        }
        chirp();
      }, (4 + Math.random() * 10) * 1000);
    }());
  }

  function footstep() {
    if (!ctx) return;
    _noise(0.08, 0.09, 'highpass', 180 + Math.random() * 80);
  }

  function lightning() {
    if (!ctx) return;
    _noise(0.04, 0.7, 'highpass', 3000);
    for (let i = 0; i < 6; i++) {
      _noise(0.5, 0.18 - i * 0.025, 'lowpass', 60 + Math.random() * 50, 0.05 + i * 0.32);
    }
  }

  function water() {
    if (!ctx) return;
    for (let i = 0; i < 4; i++) {
      _noise(0.22, 0.07, 'bandpass', 350 + Math.random() * 250, i * 0.055);
      _tone(280 + Math.random() * 180, 'sine', 0.18, 0.05, i * 0.055);
    }
  }

  function animal(type) {
    if (!ctx) return;
    if (type === 'cow') {
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.45);
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.13, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(g); g.connect(master); osc.start(); osc.stop(ctx.currentTime + 0.55);
    } else if (type === 'chicken') {
      _tone(620 + Math.random() * 200, 'triangle', 0.09, 0.09);
      _tone(480 + Math.random() * 140, 'triangle', 0.07, 0.07, 0.11);
    } else if (type === 'pig') {
      _tone(220 + Math.random() * 90, 'sawtooth', 0.18, 0.1);
    } else if (type === 'sheep') {
      _tone(360 + Math.random() * 70, 'triangle', 0.22, 0.09);
      _tone(290 + Math.random() * 60, 'triangle', 0.16, 0.07, 0.18);
    }
  }

  function door() {
    if (!ctx) return;
    _tone(330, 'sine', 0.18, 0.12);
    _tone(420, 'sine', 0.14, 0.09, 0.12);
  }

  function harvest() {
    if (!ctx) return;
    _tone(440, 'triangle', 0.1, 0.1);
    _tone(550, 'triangle', 0.1, 0.1, 0.09);
    _tone(660, 'triangle', 0.12, 0.1, 0.18);
  }

  function click() {
    if (!ctx) return;
    _tone(900, 'sine', 0.04, 0.07);
  }

  function sleep() {
    if (!ctx) return;
    _tone(220, 'sine', 0.5, 0.1);
    _tone(330, 'sine', 0.4, 0.07, 0.3);
    _tone(440, 'sine', 0.6, 0.05, 0.6);
  }

  function fire() {
    if (!ctx) return;
    _noise(0.35, 0.06, 'bandpass', 220 + Math.random() * 180);
    _tone(80 + Math.random() * 40, 'sawtooth', 0.28, 0.03, 0.05);
  }

  function wind() {
    if (!ctx) return;
    _noise(1.2, 0.04, 'lowpass', 120 + Math.random() * 80);
    _noise(0.8, 0.025, 'lowpass', 200 + Math.random() * 60, 0.4);
  }

  function forestAmbience() {
    if (!ctx) return;
    _noise(2.0, 0.03, 'lowpass', 300);
    _tone(600 + Math.random() * 300, 'sine', 0.12, 0.025, Math.random() * 0.5);
    _tone(800 + Math.random() * 400, 'sine', 0.08, 0.018, Math.random() * 0.8);
    _tone(1200 + Math.random() * 600, 'sine', 0.06, 0.012, Math.random() * 1.0);
  }

  function dungeonAmbience() {
    if (!ctx) return;
    _noise(1.5, 0.045, 'lowpass', 80 + Math.random() * 40);
    _tone(55 + Math.random() * 20, 'sawtooth', 0.6, 0.02, Math.random() * 0.3);
    for (let i = 0; i < 3; i++) {
      _noise(0.3, 0.015, 'bandpass', 180 + Math.random() * 100, 0.2 + i * 0.35);
    }
  }

  function ripple() {
    if (!ctx) return;
    for (let i = 0; i < 3; i++) {
      _noise(0.18, 0.055, 'bandpass', 300 + Math.random() * 200, i * 0.045);
      _tone(200 + Math.random() * 120, 'sine', 0.14, 0.04, i * 0.045);
    }
  }

  function thunderBolt() {
    if (!ctx) return;
    _noise(0.02, 1.0, 'highpass', 4000);
    _noise(0.08, 0.9, 'highpass', 2500, 0.02);
    for (let i = 0; i < 8; i++) {
      _noise(0.6, 0.22 - i * 0.022, 'lowpass', 55 + Math.random() * 40, 0.04 + i * 0.28);
    }
    _noise(0.4, 0.4, 'bandpass', 180, 0.1);
  }

  return { init, footstep, lightning, thunderBolt, water, ripple, animal, door, harvest, click, sleep, fire, wind, forestAmbience, dungeonAmbience };
})();

document.addEventListener('pointerdown', () => SND.init(), { once: true });
document.addEventListener('keydown', () => SND.init(), { once: true });

/* ─── Animal Sound Timers ─────────────────── */
const animalSoundTimers = new Map();

/* ─── Quest Definitions ─────────────────── */
const QUEST_POOL = [
  { id: 'harvest5', label: 'Panen 5 item dari ladang', type: 'harvest', goal: 5, reward: { coins: 120, xp: 40 } },
  { id: 'sell3', label: 'Jual hasil panen 3 kali', type: 'sell', goal: 3, reward: { coins: 200, xp: 60 } },
  { id: 'milk3', label: 'Kumpulkan susu 3 kali', type: 'milk', goal: 3, reward: { coins: 150, xp: 50 } },
  { id: 'order5', label: 'Buka 5 order baru', type: 'order', goal: 5, reward: { coins: 180, xp: 55 } },
  { id: 'process4', label: 'Olah 4 produk di Creamery/Bakery', type: 'process', goal: 4, reward: { coins: 250, xp: 80 } },
  { id: 'harvest10', label: 'Panen besar: 10 item', type: 'harvest', goal: 10, reward: { coins: 300, xp: 100 } },
  { id: 'honey2', label: 'Panen madu 2 kali', type: 'honey', goal: 2, reward: { coins: 130, xp: 45 } },
];

function startNewQuest() {
  const pool = QUEST_POOL;
  const q = pool[Math.floor(Math.random() * pool.length)];
  state.questActive = q;
  state.questProgress = 0;
  state.questGoal = q.goal;
  state.questType = q.type;
  syncQuestUI();
  showToast(`Quest baru: ${q.label}`);
}

function progressQuest(type, amount = 1) {
  if (!state.questActive || state.questType !== type) return;
  state.questProgress = Math.min(state.questGoal, state.questProgress + amount);
  syncQuestUI();
  if (state.questProgress >= state.questGoal) {
    const q = state.questActive;
    showToast(`Quest selesai! +${q.reward.coins} koin, +${q.reward.xp} XP`);
    gainCoins(q.reward.coins, window.innerWidth / 2, window.innerHeight / 2);
    gainXP(q.reward.xp);
    state.questActive = null;
    setTimeout(startNewQuest, 4000);
  }
}

function syncQuestUI() {
  if (!state.questActive) {
    if (questText) questText.textContent = 'Semua quest selesai! Quest baru akan muncul…';
    if (questProgress) questProgress.innerHTML = '';
    return;
  }
  const q = state.questActive;
  if (questText) questText.textContent = q.label;
  if (questProgress) {
    const pct = Math.round((state.questProgress / state.questGoal) * 100);
    questProgress.innerHTML = `<span class="hud-quest__tag ${state.questProgress >= state.questGoal ? 'done' : ''}">${state.questProgress}/${state.questGoal} · ${pct}%</span><span class="hud-quest__tag">+${q.reward.coins}🪙 +${q.reward.xp}XP</span>`;
  }
}

/* ─── XP & Level ────────────────────────── */
function gainXP(amount) {
  state.xp += amount;
  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = Math.round(state.xpToNext * 1.45);
    showToast(`Level Up! Sekarang Level ${state.level} ✨`);
    spawnHarvestFloat(`✨ Level ${state.level}!`, window.innerWidth / 2, window.innerHeight / 3);
  }
  syncHud();
}

function gainCoins(amount, cx = window.innerWidth / 2, cy = window.innerHeight / 2) {
  state.coins += amount;
  spawnHarvestFloat(`+${amount} 🪙`, cx, cy, true);
  syncHud();
}

/* ─── Float Particles ───────────────────── */
function spawnHarvestFloat(text, cx, cy, isCoin = false) {
  if (!floatLayer) return;
  const el = document.createElement('div');
  el.className = 'harvest-float' + (isCoin ? ' coin-float' : '');
  el.textContent = text;
  el.style.left = `${cx + (Math.random() - 0.5) * 60}px`;
  el.style.top = `${cy + (Math.random() - 0.5) * 30}px`;
  floatLayer.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

/* ─── Loader ────────────────────────────── */
const loaderState = { value: 0 };
function setLoader(value, text) {
  const pct = Math.max(loaderState.value, Math.max(0, Math.min(100, Math.round(value))));
  loaderState.value = pct;
  if (loaderBar) loaderBar.style.width = `${pct}%`;
  if (loaderCount) loaderCount.textContent = String(pct).padStart(3, '0');
  if (loaderText && text) loaderText.textContent = text;
}

function hideLoader() {
  loader?.classList.add('is-hidden');
}

/* ─── Toast ─────────────────────────────── */
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

/* ─── HUD Sync ──────────────────────────── */
function syncHud() {
  if (weatherValue) weatherValue.textContent = state.weather;
  if (seasonValue) seasonValue.textContent = state.season;
  if (storageValue) storageValue.textContent = `${state.storage}/${state.storageCap}`;
  if (ordersValue) ordersValue.textContent = `${state.orders} aktif`;
  if (clockValue) clockValue.textContent = `${pad(Math.floor(state.minutes / 60) % 24)}:${pad(Math.floor(state.minutes % 60))}`;
  if (dayValue) dayValue.textContent = `Day ${pad(state.day)}`;
  if (levelValue) levelValue.textContent = state.level;
  if (coinValue) coinValue.textContent = new Intl.NumberFormat('id-ID').format(state.coins);
  if (xpFill) xpFill.style.width = `${Math.min(100, (state.xp / state.xpToNext) * 100).toFixed(1)}%`;
  if (xpLabel) xpLabel.textContent = `${state.xp} / ${state.xpToNext} XP`;
}

setLoader(18, 'Membuat scene Three.js dan kontrol kamera…');

/* ─── WebGL Support Check ────────────────── */
function checkWebGL() {
  try {
    const testCanvas = document.createElement('canvas');
    const ctx = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    return !!ctx;
  } catch { return false; }
}
if (!checkWebGL()) {
  const msg = document.createElement('div');
  msg.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0b0908;color:#e7bf86;text-align:center;padding:32px;z-index:300;gap:16px;';
  msg.innerHTML = '<div style="font-size:3rem">🌾</div><h2 style="font-size:1.4rem;font-weight:800">Farm World</h2><p style="color:#a89880;max-width:360px;line-height:1.7">Browser kamu tidak mendukung WebGL yang diperlukan untuk render 3D. Coba buka di Chrome / Edge / Firefox terbaru, atau aktifkan hardware acceleration di pengaturan browser.</p><button onclick="location.reload()" style="padding:12px 28px;background:#e7bf86;color:#140f0a;border:none;border-radius:999px;font-weight:800;font-size:1rem;cursor:pointer;margin-top:8px">Coba Lagi</button>';
  stage?.appendChild(msg);
  throw new Error('WebGL not available');
}

/* ─── Renderer & Scene ──────────────────── */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: window.devicePixelRatio < 2,
  alpha: false,
  powerPreference: 'high-performance',
  failIfMajorPerformanceCaveat: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.0;

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  console.warn('WebGL context lost — pausing render loop.');
}, false);
canvas.addEventListener('webglcontextrestored', () => {
  console.info('WebGL context restored — resuming render loop.');
  animate();
}, false);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2('#8ab0d4', 0.009);

const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 500);
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const cameraRig = {
  yaw: Math.PI * 0.22,
  pitch: 0.48,
  distance: 15,
  minDistance: 8,
  maxDistance: 24,
};

/* ─── Dynamic Lighting ──────────────────── */
const hemi = new THREE.HemisphereLight('#b0d0f0', '#5b4632', 1.6);
scene.add(hemi);

const ambientFill = new THREE.AmbientLight('#ffffff', 0.45);
scene.add(ambientFill);

const sun = new THREE.DirectionalLight('#fff3d6', 3.2);
sun.position.set(-18, 30, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -55;
sun.shadow.camera.right = 55;
sun.shadow.camera.top = 55;
sun.shadow.camera.bottom = -55;
sun.shadow.bias = -0.001;
scene.add(sun);

const moonLight = new THREE.DirectionalLight('#8899cc', 0);
moonLight.position.set(20, 25, -10);
scene.add(moonLight);

/* ─── Sky System ─────────────────────────  */
const SKY_TIMES = [
  { t: 0,    sky: '#18142e', fog: '#1a1828', sunColor: '#4a3d70', hemiSky: '#1e2440', hemiGnd: '#1a1610', sunInt: 0.25, moonInt: 1.1 },
  { t: 5,    sky: '#2e2060', fog: '#342860', sunColor: '#5a4880', hemiSky: '#302860', hemiGnd: '#201608', sunInt: 0.4,  moonInt: 0.8 },
  { t: 6,    sky: '#f4762a', fog: '#c46030', sunColor: '#ffb050', hemiSky: '#f0803a', hemiGnd: '#5b4632', sunInt: 1.4,  moonInt: 0.0 },
  { t: 7,    sky: '#f0a058', fog: '#d8804a', sunColor: '#ffd070', hemiSky: '#e0a060', hemiGnd: '#5b4830', sunInt: 2.2,  moonInt: 0.0 },
  { t: 9,    sky: '#5fa8e8', fog: '#8ab0d4', sunColor: '#fff3d6', hemiSky: '#b0d0f0', hemiGnd: '#5b4632', sunInt: 3.0,  moonInt: 0.0 },
  { t: 13,   sky: '#4899e0', fog: '#7fa8cc', sunColor: '#fffaf0', hemiSky: '#c0d8f0', hemiGnd: '#4a4028', sunInt: 3.4,  moonInt: 0.0 },
  { t: 17,   sky: '#e87030', fog: '#c06030', sunColor: '#ffa040', hemiSky: '#e07838', hemiGnd: '#5b4632', sunInt: 2.2,  moonInt: 0.0 },
  { t: 19,   sky: '#c83850', fog: '#903050', sunColor: '#ff7060', hemiSky: '#c84060', hemiGnd: '#381820', sunInt: 1.0,  moonInt: 0.2 },
  { t: 20,   sky: '#3c2060', fog: '#301848', sunColor: '#605088', hemiSky: '#402868', hemiGnd: '#201818', sunInt: 0.45, moonInt: 0.6 },
  { t: 22,   sky: '#1a1038', fog: '#18103a', sunColor: '#302050', hemiSky: '#1e2240', hemiGnd: '#141210', sunInt: 0.28, moonInt: 1.0 },
  { t: 24,   sky: '#18142e', fog: '#1a1828', sunColor: '#4a3d70', hemiSky: '#1e2440', hemiGnd: '#1a1610', sunInt: 0.25, moonInt: 1.1 },
];

function getSkyValues(minutes) {
  const hour = (minutes / 60) % 24;
  let lo = SKY_TIMES[SKY_TIMES.length - 2];
  let hi = SKY_TIMES[SKY_TIMES.length - 1];
  for (let i = 0; i < SKY_TIMES.length - 1; i += 1) {
    if (hour >= SKY_TIMES[i].t && hour < SKY_TIMES[i + 1].t) {
      lo = SKY_TIMES[i];
      hi = SKY_TIMES[i + 1];
      break;
    }
  }
  const span = hi.t - lo.t || 1;
  const f = (hour - lo.t) / span;
  return { lo, hi, f };
}

function lerpColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t);
}

function updateSky(minutes) {
  const { lo, hi, f } = getSkyValues(minutes);
  scene.background = lerpColor(lo.sky, hi.sky, f);
  scene.fog.color.copy(lerpColor(lo.fog, hi.fog, f));
  sun.color.copy(lerpColor(lo.sunColor, hi.sunColor, f));
  sun.intensity = lo.sunInt + (hi.sunInt - lo.sunInt) * f;
  moonLight.intensity = lo.moonInt + (hi.moonInt - lo.moonInt) * f;
  hemi.color.copy(lerpColor(lo.hemiSky, hi.hemiSky, f));
  hemi.groundColor.copy(lerpColor(lo.hemiGnd, hi.hemiGnd, f));

  const hour = (minutes / 60) % 24;
  const sunAngle = ((hour - 6) / 12) * Math.PI;
  sun.position.set(Math.cos(sunAngle) * 40, Math.sin(sunAngle) * 38 + 2, 12);
  moonLight.position.set(-Math.cos(sunAngle) * 40, Math.abs(Math.sin(sunAngle + Math.PI)) * 30 + 4, -12);

  if (skyDome) {
    skyDome.material.color.copy(lerpColor(lo.sky, hi.sky, f));
  }
}

/* ─── Sky Dome ──────────────────────────── */
const skyDomeMat = new THREE.MeshBasicMaterial({ color: '#5fa8e8', side: THREE.BackSide });
const skyDome = new THREE.Mesh(new THREE.SphereGeometry(380, 16, 8), skyDomeMat);
scene.add(skyDome);

/* ─── Sun/Moon Orbs ─────────────────────── */
const sunOrb = new THREE.Mesh(
  new THREE.SphereGeometry(3.2, 14, 14),
  new THREE.MeshBasicMaterial({ color: '#ffe080' })
);
scene.add(sunOrb);

const moonOrb = new THREE.Mesh(
  new THREE.SphereGeometry(2.4, 12, 12),
  new THREE.MeshBasicMaterial({ color: '#d8e8ff' })
);
scene.add(moonOrb);

/* ─── Stars ─────────────────────────────── */
const starGeo = new THREE.BufferGeometry();
const starCount = 900;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i += 1) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 0.92 + 0.08);
  const r = 300 + Math.random() * 50;
  starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = r * Math.cos(phi);
  starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 1.2, sizeAttenuation: true, transparent: true, opacity: 0 }));
scene.add(stars);

/* ─── Material Helper ───────────────────── */
const accentMat = (color, extras = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.06, ...extras });

/* ─── Canvas Textures ───────────────────── */
function makeCanvasTexture(draw) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  draw(ctx, c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const groundTexture = makeCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = '#654833';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 1200; i += 1) {
    const x = Math.random() * w, y = Math.random() * h, s = Math.random() * 3 + 1;
    ctx.fillStyle = i % 3 === 0 ? 'rgba(30,20,14,.14)' : i % 3 === 1 ? 'rgba(120,96,67,.12)' : 'rgba(90,70,45,.08)';
    ctx.fillRect(x, y, s, s);
  }
});
groundTexture.repeat.set(18, 18);

const waterTexture = makeCanvasTexture((ctx, w, h) => {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#3a6070');
  grad.addColorStop(1, '#4b7888');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(180,220,255,.18)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, i * 22 + 8);
    ctx.bezierCurveTo(w * 0.3, i * 22, w * 0.65, i * 22 + 14, w, i * 22 + 8);
    ctx.stroke();
  }
});
waterTexture.repeat.set(2, 8);

const dirtTexture = makeCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = '#8a7458';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 18; i += 1) {
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.09)';
    ctx.fillRect(0, i * 14, w, 5);
  }
});
dirtTexture.repeat.set(4, 3);

setLoader(26, 'Menyusun terrain, jalur, dan sistem langit dinamis…');

/* ─── Ground & Paths ────────────────────── */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(130, 130), accentMat('#65523d', { map: groundTexture }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const pathMain = new THREE.Mesh(new THREE.PlaneGeometry(52, 7), accentMat('#9d896f', { map: dirtTexture }));
pathMain.rotation.x = -Math.PI / 2;
pathMain.position.set(2, 0.02, 7);
pathMain.receiveShadow = true;
scene.add(pathMain);

const pathCross = new THREE.Mesh(new THREE.PlaneGeometry(10, 48), accentMat('#9a856b', { map: dirtTexture }));
pathCross.rotation.x = -Math.PI / 2;
pathCross.position.set(2, 0.021, 1);
pathCross.receiveShadow = true;
scene.add(pathCross);

const canal = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 96),
  accentMat('#4d7080', { map: waterTexture, roughness: 0.15, metalness: 0.12, transparent: true, opacity: 0.96 })
);
canal.rotation.x = -Math.PI / 2;
canal.position.set(37, 0.03, 3);
canal.receiveShadow = true;
scene.add(canal);

const bridge = new THREE.Mesh(new THREE.BoxGeometry(12, 0.8, 4), accentMat('#8f6b48'));
bridge.position.set(33, 0.45, 7.2);
bridge.castShadow = true;
bridge.receiveShadow = true;
scene.add(bridge);

/* ─── Helper Functions ──────────────────── */
function addBounds(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* ─── Trees ──────────────────────────────  */
function createTree(x, z, scale = 1, fruit = false) {
  const group = new THREE.Group();
  const trunk = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.34 * scale, 2.4 * scale, 8), accentMat('#5e4228')));
  trunk.position.y = 1.1 * scale;
  const crown = addBounds(new THREE.Mesh(new THREE.SphereGeometry(1.25 * scale, 10, 10), accentMat(fruit ? '#739b46' : '#4d7030')));
  crown.position.y = 2.6 * scale;
  group.add(trunk, crown);
  if (fruit) {
    for (let i = 0; i < 7; i += 1) {
      const berry = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.15 * scale, 6, 6), accentMat(i % 2 ? '#d96c2a' : '#c04030')));
      berry.position.set(Math.sin(i * 0.9) * 0.75 * scale, 2.3 * scale + (i % 3) * 0.18 * scale, Math.cos(i * 1.4) * 0.82 * scale);
      group.add(berry);
    }
  }
  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}

function createPlantCluster(x, z, rows, cols, baseColor, tipColor, plotId) {
  const group = new THREE.Group();
  const stemGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 5);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const h = 0.6 + Math.random() * 0.9;
      const stem = addBounds(new THREE.Mesh(stemGeo, accentMat(row % 2 ? baseColor : tipColor)));
      stem.userData.baseScaleY = h;
      stem.scale.y = h;
      stem.position.set(col * 0.55 - (cols * 0.55) / 2, 0.4 * h, row * 0.65 - (rows * 0.65) / 2);
      stem.rotation.z = (Math.random() - 0.5) * 0.25;
      group.add(stem);
    }
  }
  group.position.set(x, 0, z);
  scene.add(group);
  if (plotId) {
    world.cropPlots.push({ id: plotId, group, stage: 3, growTimer: 0, harvestable: true });
  }
  return group;
}

/* ─── Crop Growth System ─────────────────  */
const GROW_DURATIONS = [10, 20, 30];

function setCropStage(plot, stage) {
  plot.stage = Math.max(0, Math.min(3, stage));
  const t = plot.stage / 3;
  plot.group.children.forEach((stem) => {
    const base = stem.userData.baseScaleY || 1;
    stem.scale.y = base * t;
    stem.visible = t > 0;
  });
  plot.harvestable = (plot.stage === 3);
}

function harvestCrop(plotId) {
  const plot = world.cropPlots.find((p) => p.id === plotId);
  if (!plot || !plot.harvestable) return;
  setCropStage(plot, 0);
  plot.growTimer = 0;
}

function plantCrop(plotId) {
  const plot = world.cropPlots.find((p) => p.id === plotId);
  if (!plot || plot.stage > 0) return;
  setCropStage(plot, 1);
  plot.growTimer = 0;
}

function updateCrops(delta) {
  world.cropPlots.forEach((plot) => {
    if (plot.stage === 0 || plot.stage === 3) return;
    plot.growTimer += delta;
    const dur = GROW_DURATIONS[plot.stage - 1] || 20;
    if (plot.growTimer >= dur) {
      plot.growTimer = 0;
      setCropStage(plot, plot.stage + 1);
    }
  });
}

function createBed(x, z, width, depth, color) {
  const bed = addBounds(new THREE.Mesh(new THREE.BoxGeometry(width, 0.5, depth), accentMat(color)));
  bed.position.set(x, 0.25, z);
  scene.add(bed);
  return bed;
}

/* ─── Buildings ──────────────────────────  */
function createBuilding(x, z, options) {
  const group = new THREE.Group();
  const base = addBounds(new THREE.Mesh(new THREE.BoxGeometry(options.w, options.h, options.d), accentMat(options.base || '#b08b68')));
  base.position.y = options.h / 2;
  group.add(base);

  if (options.doublePeak) {
    const roof1 = addBounds(new THREE.Mesh(new THREE.ConeGeometry(options.w * 0.55, options.roofH || 2.5, 4), accentMat(options.roof || '#704c35')));
    roof1.position.set(-options.w * 0.22, options.h + (options.roofH || 2.5) / 2 - 0.1, 0);
    roof1.rotation.y = Math.PI / 4;
    const roof2 = roof1.clone();
    roof2.position.x = options.w * 0.22;
    group.add(roof1, roof2);
  } else {
    const roof = addBounds(new THREE.Mesh(new THREE.ConeGeometry(options.roofW || options.w * 0.75, options.roofH || 2.5, 4), accentMat(options.roof || '#704c35')));
    roof.position.y = options.h + (options.roofH || 2.5) / 2 - 0.1;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);
  }

  if (options.chimney) {
    const chimney = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8), accentMat('#5a3830')));
    chimney.position.set(options.w * 0.25, options.h + 1.2, 0);
    group.add(chimney);
    const smoke = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), new THREE.MeshBasicMaterial({ color: '#ccbbaa', transparent: true, opacity: 0.35 }));
    smoke.position.set(options.w * 0.25, options.h + 2.5, 0);
    smoke.userData.isSmoke = true;
    group.add(smoke);
  }

  if (options.window) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.9), accentMat('#ffe8a0', { emissive: '#ffe060', emissiveIntensity: 0.0 }));
    win.position.set(0, options.h * 0.55, options.d / 2 + 0.02);
    win.userData.isWindow = true;
    group.add(win);
  }

  const door = addBounds(new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 0.1), accentMat('#4a3020')));
  door.position.set(0, 0.8, options.d / 2 + 0.01);
  group.add(door);

  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}

function addSignpost(x, z, color = '#e7bf86') {
  const post = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), accentMat('#7e6146')));
  post.position.set(x, 0.6, z);
  const sign = addBounds(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.28, 0.08), accentMat(color)));
  sign.position.set(x, 1.05, z);
  scene.add(post, sign);
}

function createFence(x, z, w, d) {
  const railMat = accentMat('#5c4432');
  const postGeo = new THREE.BoxGeometry(0.15, 0.9, 0.15);
  const railGeoX = new THREE.BoxGeometry(1.1, 0.08, 0.08);
  const railGeoZ = new THREE.BoxGeometry(0.08, 0.08, 1.1);
  const group = new THREE.Group();
  for (let ix = -w / 2; ix <= w / 2; ix += 1.2) {
    for (const s of [-1, 1]) {
      const post = addBounds(new THREE.Mesh(postGeo, railMat));
      post.position.set(ix, 0.45, s * d / 2);
      group.add(post);
      if (ix < w / 2) {
        const rail1 = addBounds(new THREE.Mesh(railGeoX, railMat));
        rail1.position.set(ix + 0.55, 0.35, s * d / 2);
        const rail2 = rail1.clone();
        rail2.position.y = 0.68;
        group.add(rail1, rail2);
      }
    }
  }
  for (let iz = -d / 2; iz <= d / 2; iz += 1.2) {
    for (const s of [-1, 1]) {
      const post = addBounds(new THREE.Mesh(postGeo, railMat));
      post.position.set(s * w / 2, 0.45, iz);
      group.add(post);
      if (iz < d / 2) {
        const rail1 = addBounds(new THREE.Mesh(railGeoZ, railMat));
        rail1.position.set(s * w / 2, 0.35, iz + 0.55);
        const rail2 = rail1.clone();
        rail2.position.y = 0.68;
        group.add(rail1, rail2);
      }
    }
  }
  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}

/* ─── Windmill ───────────────────────────  */
function createWindmill(x, z) {
  const group = new THREE.Group();
  const tower = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 7, 8), accentMat('#d8cfc0')));
  tower.position.y = 3.5;
  group.add(tower);
  const cap = addBounds(new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.6, 8), accentMat('#884422')));
  cap.position.y = 7.8;
  group.add(cap);

  const hub = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), accentMat('#7a5535')));
  hub.position.set(0, 7.0, 1.1);
  group.add(hub);

  const bladeGroup = new THREE.Group();
  bladeGroup.position.set(0, 7.0, 1.1);
  const bladeMat = accentMat('#c8b87a');
  for (let b = 0; b < 4; b += 1) {
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0.12);
    bladeShape.lineTo(2.8, 0.32);
    bladeShape.lineTo(2.8, -0.32);
    bladeShape.lineTo(0, -0.12);
    const bladeGeo = new THREE.ShapeGeometry(bladeShape);
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.rotation.z = (b / 4) * Math.PI * 2;
    blade.position.z = 0.05;
    bladeGroup.add(blade);
  }
  group.add(bladeGroup);
  group.position.set(x, 0, z);
  scene.add(group);
  world.windmillParts.push(bladeGroup);
  return group;
}

setLoader(38, 'Membentuk bangunan farm, sawah, orchard, bakery, dan windmill…');

/* ─── Build Structures ────────────────────
   Layout zones:
   NORTH (z < 0)  : Village — Town Hall, Market, Rest House, Creamery, Bakery
   WEST (x < -16) : Barn + fence (animals roam OUTSIDE fence to the east)
   CENTER (z 12–26): Farm — 3×2 neat square plots with irrigation channels
   EAST (x > 24)  : Orchard + Apiary + Windmill
─────────────────────────────────────────── */

const townMesh = createBuilding(0, -10, { w: 8, h: 3.6, d: 6, base: '#b89b75', roof: '#7b563e', roofH: 2.8, window: true });
const marketMesh = createBuilding(14, -12, { w: 7.5, h: 2.7, d: 5, base: '#b88b5c', roof: '#6e4d36', roofH: 2.1, window: true });
const restHouseMesh = createBuilding(-14, -8, { w: 7, h: 3.2, d: 5.5, base: '#c4a87e', roof: '#7a5840', roofH: 2.4, chimney: true, window: true });
addSignpost(-14, -4, '#f0d090');

const barnMesh = createBuilding(-26, 10, { w: 11, h: 4.1, d: 7.6, base: '#9e6e54', roof: '#5a3b2a', roofH: 3.2, doublePeak: true });
createFence(-26, 10, 16, 14);

const creameryMesh = createBuilding(-8, -20, { w: 7.5, h: 3, d: 5, base: '#d3c7b5', roof: '#827464', roofH: 2.1, chimney: true, window: true });
const bakeryMesh = createBuilding(6, -20, { w: 6.5, h: 2.8, d: 5, base: '#e8d8b0', roof: '#9c6844', roofH: 2.0, chimney: true, window: true });
addSignpost(6, -15, '#e7bf86');

/* ─── Pet Shop ────────────────────────────  */
const petShopMesh = (function buildPetShop() {
  const g = new THREE.Group();
  const base = addBounds(new THREE.Mesh(new THREE.BoxGeometry(7, 3.2, 5.5), accentMat('#f5c2d5')));
  base.position.y = 1.6; g.add(base);
  const roof = addBounds(new THREE.Mesh(new THREE.ConeGeometry(5.4, 2.4, 4), accentMat('#e85fa0')));
  roof.position.y = 4.4; roof.rotation.y = Math.PI / 4; g.add(roof);
  const sign = addBounds(new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.7, 0.14), accentMat('#ff88cc')));
  sign.position.set(0, 3.2, 2.8); g.add(sign);
  const paw1 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 7, 7), new THREE.MeshBasicMaterial({ color: '#ff44aa' }));
  paw1.position.set(-0.6, 3.2, 2.92); g.add(paw1);
  const paw2 = paw1.clone(); paw2.position.x = 0.6; g.add(paw2);
  const chimney = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.6, 8), accentMat('#c06090')));
  chimney.position.set(2, 3.8, 0); g.add(chimney);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.0), accentMat('#ffe8f5', { emissive: '#ffbbdd', emissiveIntensity: 0.4 }));
  win.position.set(0, 1.9, 2.77); g.add(win);
  const petLight = new THREE.PointLight('#ffaacc', 0.9, 12);
  petLight.position.set(0, 3, 3); g.add(petLight);
  addSignpost(20, -13, '#ff88cc');
  g.position.set(20, 0, -18);
  scene.add(g);
  return g;
}());

const windmillGroup = createWindmill(26, 30);

/* ─── Forest Gate (north-west) ───────────  */
function createForestGate(x, z) {
  const g = new THREE.Group();
  const stoneMat = accentMat('#5a6548', { roughness: 0.95 });
  const mossyMat = accentMat('#3d5230', { roughness: 0.9 });
  const vineMat = accentMat('#2d5020');

  const pillarGeo = new THREE.BoxGeometry(1.0, 5.2, 1.0);
  const leftPillar = addBounds(new THREE.Mesh(pillarGeo, stoneMat));
  leftPillar.position.set(-2.4, 2.6, 0); g.add(leftPillar);
  const rightPillar = addBounds(new THREE.Mesh(pillarGeo, stoneMat));
  rightPillar.position.set(2.4, 2.6, 0); g.add(rightPillar);

  const archTop = addBounds(new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.9, 1.0), mossyMat));
  archTop.position.set(0, 5.4, 0); g.add(archTop);

  for (let v = 0; v < 5; v++) {
    const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.8 + Math.random() * 1.2, 4), vineMat);
    vine.position.set(-2.4 + (Math.random() - 0.5) * 0.6, 5.0 - v * 0.4 - Math.random() * 0.5, 0.2 + (Math.random() - 0.5) * 0.3);
    g.add(vine);
    const vine2 = vine.clone();
    vine2.position.x = 2.4 + (Math.random() - 0.5) * 0.6;
    g.add(vine2);
  }

  const runeGlowColors = ['#40ff80', '#60ff40', '#80ffaa'];
  for (let i = 0; i < 4; i++) {
    const rune = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.08), new THREE.MeshBasicMaterial({ color: runeGlowColors[i % runeGlowColors.length], transparent: true, opacity: 0.9 }));
    rune.position.set(i < 2 ? -2.4 : 2.4, 1.5 + (i % 2) * 1.8, 0.52);
    rune.userData.glowOrb = true; rune.userData.glowPhase = i * 0.8;
    g.add(rune);
  }

  const forestLight = new THREE.PointLight('#40ff70', 1.2, 10);
  forestLight.position.set(0, 4, 2); g.add(forestLight);

  const nameSign = addBounds(new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 0.14), mossyMat));
  nameSign.position.set(0, 4.8, 0.6); g.add(nameSign);

  const signGlow = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.32, 0.1), new THREE.MeshBasicMaterial({ color: '#60ff80', transparent: true, opacity: 0.5 }));
  signGlow.position.set(0, 4.8, 0.72); g.add(signGlow);

  g.position.set(x, 0, z);
  scene.add(g);
  return g;
}

/* ─── Dungeon Gate (north-east) ──────────  */
function createDungeonGate(x, z) {
  const g = new THREE.Group();
  const darkStoneMat = accentMat('#2a2422', { roughness: 0.97 });
  const evilMat = accentMat('#3a1a1a', { roughness: 0.92 });

  const lp = addBounds(new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.8, 1.2), darkStoneMat));
  lp.position.set(-2.6, 2.9, 0); g.add(lp);
  const rp = addBounds(new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.8, 1.2), darkStoneMat));
  rp.position.set(2.6, 2.9, 0); g.add(rp);
  const arch = addBounds(new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.0, 1.2), evilMat));
  arch.position.set(0, 6.1, 0); g.add(arch);

  const skullColors = ['#cc2020', '#cc4400'];
  [[-2.6, 6.5, 0.7], [2.6, 6.5, 0.7], [0, 6.9, 0.7]].forEach(([sx, sy, sz], i) => {
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.22, 7, 7), new THREE.MeshBasicMaterial({ color: skullColors[i % skullColors.length], transparent: true, opacity: 0.88 }));
    skull.position.set(sx, sy, sz);
    skull.userData.glowOrb = true; skull.userData.glowPhase = i * 1.2;
    const skullLight = new THREE.PointLight(skullColors[i % skullColors.length], 0.9, 6);
    skullLight.position.set(sx, sy, sz); g.add(skull, skullLight);
  });

  const riftLight = new THREE.PointLight('#6611cc', 1.5, 12);
  riftLight.position.set(0, 3, 1.5); g.add(riftLight);

  const nameSign = addBounds(new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.55, 0.14), evilMat));
  nameSign.position.set(0, 5.4, 0.7); g.add(nameSign);

  const signGlow = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.36, 0.1), new THREE.MeshBasicMaterial({ color: '#9922ff', transparent: true, opacity: 0.6 }));
  signGlow.position.set(0, 5.4, 0.82); g.add(signGlow);

  const doorGate = addBounds(new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.4, 0.18), new THREE.MeshStandardMaterial({ color: '#1a1010', roughness: 0.98, metalness: 0.4 })));
  doorGate.position.set(0, 2.2, 0.12); g.add(doorGate);

  for (let bar = -1; bar <= 1; bar++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.14, 4.2, 0.14), accentMat('#3a3030', { metalness: 0.6 }));
    b.position.set(bar * 1.3, 2.2, 0.22); g.add(b);
  }

  g.position.set(x, 0, z);
  scene.add(g);
  return g;
}

const forestGateMesh = createForestGate(-34, -22);
const dungeonGateMesh = createDungeonGate(28, -22);

/* ─── Forest Exterior Trees Cluster ──────  */
const forestZoneTrees = new THREE.Group();
const forestTreePositions = [
  [-36, -18, 1.1], [-38, -22, 1.4], [-34, -26, 0.95], [-38, -28, 1.2], [-32, -28, 1.0],
  [-36, -14, 1.3], [-38, -10, 0.9], [-38, -16, 1.05], [-36, -30, 1.1], [-34, -32, 0.8],
  [-38, -32, 1.15],
];
forestTreePositions.forEach(([tx, tz, sc]) => {
  forestZoneTrees.add(createTree(tx, tz, sc));
});
scene.add(forestZoneTrees);

/* ─── Orchard (east strip, west of canal x<30) ─  */
const orchardArea = new THREE.Group();
for (let row = 0; row < 3; row += 1) {
  for (let col = 0; col < 3; col += 1) {
    orchardArea.add(createTree(20 + col * 3, -14 + row * 5, 0.9, true));
  }
}
addSignpost(20, -15);
scene.add(orchardArea);

const apiaryMesh = createBuilding(24, 22, { w: 4, h: 1.8, d: 3.6, base: '#cca44f', roof: '#765220', roofH: 1.4 });

/* ─── Farm Plots — neat 3×2 grid ─────────
   Each plot is an 8×8 square.
   Col centers X: 2, 12, 22   |  Row centers Z: 14, 24
   Irrigation channels run between rows (z=19) and at edges.
─────────────────────────────────────────── */
const _farmPlotCount = { n: 0 };
function createFarmPlot(cx, cz, plotType, plotId) {
  const pSize = 8;
  const groundColor = plotType === 'rice' ? '#7a9460' : (plotType === 'herb' ? '#5e7a34' : '#5f7c3a');
  const base = addBounds(new THREE.Mesh(new THREE.BoxGeometry(pSize, 0.22, pSize), accentMat(groundColor)));
  base.position.set(cx, 0.11, cz);
  scene.add(base);
  const rows = plotType === 'rice' ? 5 : 4;
  const cols = 5;
  const c1 = plotType === 'rice' ? '#87a64f' : (plotType === 'herb' ? '#5d8b42' : '#6d9245');
  const c2 = plotType === 'rice' ? '#aeca64' : (plotType === 'herb' ? '#8ab95a' : '#87a84f');
  createPlantCluster(cx, cz, rows, cols, c1, c2, plotId || plotType + '_' + (_farmPlotCount.n++));
  return base;
}

const vegBedA = createFarmPlot(2, 14, 'veg', 'veg');
const riceBed = createFarmPlot(12, 14, 'rice', 'rice');
const vegBedB = createFarmPlot(22, 14, 'veg', 'veg2');
const vegBedC = createFarmPlot(2, 24, 'herb', 'herb');
const vegBedD = createFarmPlot(12, 24, 'veg', 'veg3');
const vegBedE = createFarmPlot(22, 24, 'herb', 'herb2');

const irrigChan = new THREE.Mesh(new THREE.BoxGeometry(28, 0.18, 1.2), accentMat('#4d7080'));
irrigChan.position.set(12, 0.1, 19.5);
scene.add(irrigChan);
const irrigEdge = new THREE.Mesh(new THREE.BoxGeometry(28, 0.18, 0.8), accentMat('#55768a'));
irrigEdge.position.set(12, 0.1, 9.5);
scene.add(irrigEdge);

/* ─── Smart Tree Placement System ────────
   Blockers prevent trees from overlapping buildings, roads, water, or the ocean.
   Each blocker: [cx, cz, halfW, halfD, margin]
────────────────────────────────────────── */
const TREE_BLOCKERS = [
  [0,   -10, 7,  5.5, 3.5],   // Town Hall
  [14,  -12, 6,  4.5, 3.5],   // Market
  [-14, -8,  6,  5.5, 3.5],   // Rest House
  [-26, 10,  10, 9,   3.0],   // Barn + fence zone
  [-8,  -20, 7,  5,   3.5],   // Creamery
  [6,   -20, 6,  5,   3.5],   // Bakery
  [26,  30,  4,  4,   3.0],   // Windmill
  [24,  22,  4,  4,   2.5],   // Apiary
  [-34, -22, 6,  5,   3.5],   // Forest Gate
  [28,  -22, 6,  5,   3.5],   // Dungeon Gate
  [37,  3,   8,  50,  2.0],   // Canal / Water (x>30 zone)
  [0,   7,   28, 8,   1.5],   // Main paths
  [2,   0,   6,  52,  1.5],   // Cross path
  [12,  19,  16, 17,  1.5],   // Farm plots zone
  [20,  -9,  8,  12,  2.0],   // Orchard zone (trees placed deliberately)
  [20, -18,  6,   5,  3.5],   // Pet Shop
];

function isTreeBlocked(x, z) {
  for (const [cx, cz, hw, hd, margin] of TREE_BLOCKERS) {
    if (Math.abs(x - cx) < hw + margin && Math.abs(z - cz) < hd + margin) return true;
  }
  if (x > 29) return true;
  return false;
}

function safeTree(x, z, scale = 0.88, fruit = false) {
  if (isTreeBlocked(x, z)) return null;
  return createTree(x, z, scale, fruit);
}

// North border row z=-18 to -24 (skipping any building areas)
[[-30, -18], [-24, -18], [-18, -18], [-30, -24], [-22, -24], [-16, -24],
 [14,  -24], [22, -24]].forEach(([x, z]) => safeTree(x, z, 0.82));

// South border row z=28 to 30 (keep clear of windmill at 26,30)
for (let i = 0; i < 6; i++) safeTree(-32 + i * 6, 28, 0.85);

// West column (clear of barn fence z:3-17)
[[-30, -16], [-30, -9], [-30, -2], [-30, 20], [-30, 27]].forEach(([x, z]) => safeTree(x, z, 0.78));

// Scattered decorative trees outside barn fence, north of it
[[-20, -2], [-22, 3], [-16, -2]].forEach(([x, z]) => safeTree(x, z, 0.75));

// East side trees (well clear of canal x>29)
[[26, 5], [26, 12], [26, 20], [26, 27]].forEach(([x, z]) => safeTree(x, z, 0.72));

/* ─── Animals ────────────────────────────  */
function createCow(x, z) {
  const group = new THREE.Group();
  const body = addBounds(new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 1.4), accentMat('#f3f0eb')));
  body.position.y = 1.5;
  const head = addBounds(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.9), accentMat('#ece6de')));
  head.position.set(1.7, 1.75, 0);
  const nose = addBounds(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.52), accentMat('#d89b89')));
  nose.position.set(2.22, 1.55, 0);
  const legGeo = new THREE.CylinderGeometry(0.12, 0.14, 1.2, 6);
  for (const [lx, lz] of [[-0.9, -0.45], [-0.9, 0.45], [0.9, -0.45], [0.9, 0.45]]) {
    const leg = addBounds(new THREE.Mesh(legGeo, accentMat('#6b5e51')));
    leg.position.set(lx, 0.65, lz);
    group.add(leg);
  }
  for (const [sx, sy, sz] of [[-0.2, 1.9, -0.2], [0.7, 1.4, 0.4], [0.4, 1.8, 0.2]]) {
    const patch = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.36, 8, 8), accentMat('#2f2622')));
    patch.scale.set(1.2, 0.8, 1);
    patch.position.set(sx, sy, sz);
    group.add(patch);
  }
  const tail = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 0.9, 5), accentMat('#8c7060')));
  tail.position.set(-1.6, 1.6, 0);
  tail.rotation.z = -0.5;
  group.add(tail, body, head, nose);
  group.position.set(x, 0, z);
  scene.add(group);
  world.animals.push({ group, type: 'cow', time: Math.random() * Math.PI * 2 });
  return group;
}

function createChicken(x, z) {
  const group = new THREE.Group();
  const body = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.48, 8, 8), accentMat('#f4e4b0')));
  body.scale.set(1, 0.85, 1.1);
  body.position.y = 0.7;
  const head = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), accentMat('#f4e4b0')));
  head.position.set(0.48, 1.08, 0);
  const beak = addBounds(new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 5), accentMat('#e08020')));
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.76, 1.06, 0);
  const comb = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), accentMat('#d02020')));
  comb.position.set(0.46, 1.34, 0);
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 5);
  for (const lz of [-0.12, 0.12]) {
    const leg = addBounds(new THREE.Mesh(legGeo, accentMat('#d08030')));
    leg.position.set(0.1, 0.28, lz);
    group.add(leg);
  }
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), accentMat('#000000'));
  eye.position.set(0.66, 1.12, 0.18);
  group.add(eye, body, head, beak, comb);
  group.position.set(x, 0, z);
  group.rotation.y = Math.random() * Math.PI * 2;
  scene.add(group);
  world.animals.push({ group, type: 'chicken', time: Math.random() * Math.PI * 2, head, pecking: false, peckTimer: Math.random() * 3 });
  return group;
}

function createPig(x, z) {
  const group = new THREE.Group();
  const body = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.62, 8, 8), accentMat('#f4a8a0')));
  body.scale.set(1.3, 0.95, 1);
  body.position.y = 0.72;
  const head = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.46, 8, 8), accentMat('#f4a8a0')));
  head.position.set(0.82, 0.9, 0);
  const snout = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.16, 8), accentMat('#e88880')));
  snout.rotation.z = Math.PI / 2;
  snout.position.set(1.28, 0.86, 0);
  const ear1 = addBounds(new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 5), accentMat('#f09090')));
  ear1.position.set(0.76, 1.3, 0.24);
  ear1.rotation.z = 0.4;
  const ear2 = ear1.clone();
  ear2.position.z = -0.24;
  ear2.rotation.z = -0.4;
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6);
  for (const [lx, lz] of [[-0.4, -0.3], [-0.4, 0.3], [0.4, -0.3], [0.4, 0.3]]) {
    const leg = addBounds(new THREE.Mesh(legGeo, accentMat('#e89898')));
    leg.position.set(lx, 0.32, lz);
    group.add(leg);
  }
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 5, 10, Math.PI * 1.6), accentMat('#e8a0a0'));
  tail.position.set(-0.8, 0.9, 0);
  group.add(tail, body, head, snout, ear1, ear2);
  group.position.set(x, 0, z);
  group.rotation.y = Math.random() * Math.PI * 2;
  scene.add(group);
  world.animals.push({ group, type: 'pig', time: Math.random() * Math.PI * 2 });
  return group;
}

function createSheep(x, z) {
  const group = new THREE.Group();
  const body = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), accentMat('#f0eee8')));
  body.scale.set(1.25, 1, 1.05);
  body.position.y = 0.82;
  const wool = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.76, 8, 8), accentMat('#f8f8f2')));
  wool.scale.set(1.22, 1.1, 1.1);
  wool.position.y = 0.9;
  const head = addBounds(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.42, 0.46), accentMat('#c8b8a0')));
  head.position.set(0.86, 1.05, 0);
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 6);
  for (const [lx, lz] of [[-0.45, -0.32], [-0.45, 0.32], [0.45, -0.32], [0.45, 0.32]]) {
    const leg = addBounds(new THREE.Mesh(legGeo, accentMat('#c0a888')));
    leg.position.set(lx, 0.36, lz);
    group.add(leg);
  }
  group.add(body, wool, head);
  group.position.set(x, 0, z);
  group.rotation.y = Math.random() * Math.PI * 2;
  scene.add(group);
  world.animals.push({ group, type: 'sheep', time: Math.random() * Math.PI * 2 });
  return group;
}

/* Animals roam OUTSIDE the barn fence (fence east edge is x≈-18) */
createCow(-14, 10);
createCow(-10, 14);
createChicken(-15, 6);
createChicken(-12, 11);
createChicken(-9, 8);
createChicken(-13, 16);
createPig(-11, 6);
createPig(-14, 17);
createSheep(-10, 12);
createSheep(-12, 4);

/* ─── Interior Rooms ─────────────────────
   Placed at x=200 (far east, outside playable zone -38→36)
   Each room is a hollow box with floor, walls, ceiling, and furniture.
   Interior key: 'house' → restHouse room, 'barn' → barn stall room.
────────────────────────────────────────── */
const INTERIOR_BASE = new THREE.Vector3(200, 0, 0);
const interiorRooms = {};

function buildHouseInterior() {
  const g = new THREE.Group();
  const wallMat = accentMat('#d4c4a8');
  const floorMat = accentMat('#a87c5a', { roughness: 0.6 });
  const ceilMat = accentMat('#c8b89a');
  const W = 7, H = 3.2, D = 6;

  // Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(W, 0.15, D), floorMat);
  floor.position.y = 0.075; floor.receiveShadow = true; g.add(floor);
  // Ceiling
  const ceil = new THREE.Mesh(new THREE.BoxGeometry(W, 0.15, D), ceilMat);
  ceil.position.y = H - 0.075; g.add(ceil);
  // Walls
  const backW = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.18), wallMat); backW.position.set(0, H/2, -D/2); g.add(backW);
  const frontW = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.18), wallMat); frontW.position.set(0, H/2, D/2); g.add(frontW);
  const leftW = new THREE.Mesh(new THREE.BoxGeometry(0.18, H, D), wallMat); leftW.position.set(-W/2, H/2, 0); g.add(leftW);
  const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.18, H, D), wallMat); rightW.position.set(W/2, H/2, 0); g.add(rightW);

  // Door cutout (visual) on front wall — brown rectangle
  const doorCut = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.22), accentMat('#3a2510'));
  doorCut.position.set(0, 1.1, D/2); g.add(doorCut);

  // Bed
  const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.36, 1.1), accentMat('#5a3820'));
  bedFrame.position.set(-1.8, 0.18, -1.8); bedFrame.castShadow = true; g.add(bedFrame);
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.22, 1.0), accentMat('#e8d4c0'));
  mattress.position.set(-1.8, 0.47, -1.8); g.add(mattress);
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.14, 0.9), accentMat('#f0e8e0'));
  pillow.position.set(-2.6, 0.62, -1.8); g.add(pillow);
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.95), accentMat('#8c6a9a'));
  blanket.position.set(-1.3, 0.6, -1.8); g.add(blanket);

  // Wardrobe
  const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.9, 0.52), accentMat('#7a5232'));
  wardrobe.position.set(2.8, 0.95, -2.0); wardrobe.castShadow = true; g.add(wardrobe);
  const wDoor1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.6, 0.06), accentMat('#9a6840'));
  wDoor1.position.set(2.6, 0.8, -1.72); g.add(wDoor1);
  const wDoor2 = wDoor1.clone(); wDoor2.position.x = 3.0; g.add(wDoor2);

  // Lamp / candle on side table
  const sideTable = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.58, 8), accentMat('#7a5830'));
  sideTable.position.set(-0.5, 0.29, -2.2); g.add(sideTable);
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 8), accentMat('#c09830'));
  lampBase.position.set(-0.5, 0.88, -2.2); g.add(lampBase);
  const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.38, 8), accentMat('#f4d080', { emissive: '#e8b020', emissiveIntensity: 0.6 }));
  lampShade.position.set(-0.5, 1.28, -2.2); g.add(lampShade);
  // Warm point light from lamp
  const lampLight = new THREE.PointLight('#ffe08a', 1.8, 6);
  lampLight.position.set(-0.5, 1.6, -2.2); g.add(lampLight);

  // Window (right wall)
  const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.96), accentMat('#8a6040'));
  windowFrame.position.set(W/2 - 0.05, 1.6, 1.2); g.add(windowFrame);
  const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.76), new THREE.MeshStandardMaterial({ color: '#9dd4f8', transparent: true, opacity: 0.38, roughness: 0.05, metalness: 0.1 }));
  windowGlass.position.set(W/2 - 0.05, 1.6, 1.2); g.add(windowGlass);

  // Small rug
  const rug = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.04, 2.0), accentMat('#c84050'));
  rug.position.set(0.5, 0.17, 0.5); g.add(rug);

  g.position.copy(INTERIOR_BASE).add(new THREE.Vector3(0, 0, 0));
  scene.add(g);
  return g;
}

function buildBarnInterior() {
  const g = new THREE.Group();
  const wallMat = accentMat('#9e7054');
  const floorMat = accentMat('#7a5830', { roughness: 0.8 });
  const W = 10, H = 4.2, D = 8;

  const floor = new THREE.Mesh(new THREE.BoxGeometry(W, 0.18, D), floorMat); floor.position.y = 0.09; floor.receiveShadow = true; g.add(floor);
  const ceil = new THREE.Mesh(new THREE.BoxGeometry(W, 0.18, D), accentMat('#7a5030')); ceil.position.y = H; g.add(ceil);
  const backW = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.2), wallMat); backW.position.set(0, H/2, -D/2); g.add(backW);
  const frontW = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.2), wallMat); frontW.position.set(0, H/2, D/2); g.add(frontW);
  const leftW = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, D), wallMat); leftW.position.set(-W/2, H/2, 0); g.add(leftW);
  const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, D), wallMat); rightW.position.set(W/2, H/2, 0); g.add(rightW);

  // Double barn doors
  const door1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.8, 0.22), accentMat('#5a3820'));
  door1.position.set(-1.1, 1.4, D/2); g.add(door1);
  const door2 = door1.clone(); door2.position.x = 1.1; g.add(door2);

  // Stall dividers (3 stalls)
  for (let i = -1; i <= 1; i += 1) {
    const divider = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 3.8), accentMat('#6b4828'));
    divider.position.set(i * 3.2, 0.7, -1.2); g.add(divider);
  }

  // Hay bales
  [[3.5, 0, 2.5], [-3.5, 0, 2.5], [3.5, 0, 0.8]].forEach(([hx, , hz]) => {
    const hay = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.4, 10), accentMat('#d4a83c'));
    hay.rotation.z = Math.PI / 2; hay.position.set(hx, 0.7, hz); hay.castShadow = true; g.add(hay);
  });

  // Feeding troughs
  [[-3, 0.3, -2.8], [0, 0.3, -2.8], [3, 0.3, -2.8]].forEach(([tx, ty, tz]) => {
    const trough = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.6), accentMat('#8a6038'));
    trough.position.set(tx, ty, tz); g.add(trough);
    const fill = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 0.4), accentMat('#c4a06a'));
    fill.position.set(tx, ty + 0.25, tz); g.add(fill);
  });

  // Overhead lanterns
  [[-3, H - 0.3, 0], [3, H - 0.3, 0]].forEach(([lx, ly, lz]) => {
    const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), accentMat('#c09020', { emissive: '#e0a010', emissiveIntensity: 0.7 }));
    lantern.position.set(lx, ly, lz); g.add(lantern);
    const lpt = new THREE.PointLight('#ffe060', 1.6, 8); lpt.position.set(lx, ly - 0.5, lz); g.add(lpt);
  });

  g.position.copy(INTERIOR_BASE).add(new THREE.Vector3(30, 0, 0));
  scene.add(g);
  return g;
}

/* ─── Forest Interior ────────────────────  */
function buildForestInterior() {
  const g = new THREE.Group();
  const floorMat = accentMat('#2e5c1a', { roughness: 0.95 });
  const W = 14, H = 8, D = 14;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);

  const fogPlane = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ color: '#0a2a0a', transparent: true, opacity: 0.45, depthWrite: false }));
  fogPlane.rotation.x = -Math.PI / 2; fogPlane.position.y = 0.01; g.add(fogPlane);

  const treeMat = accentMat('#3d2510');
  const crownMat = new THREE.MeshStandardMaterial({ color: '#1a3d08', roughness: 0.9 });
  const forestTreeData = [[-5, -5, 1.3], [4, -4, 1.1], [-3, 4, 1.2], [5, 3, 0.9], [0, -6, 1.0], [-6, 1, 1.4], [3, 0, 0.8], [-1, 5, 1.1]];
  forestTreeData.forEach(([tx, tz, sc]) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * sc, 0.4 * sc, 3.2 * sc, 7), treeMat);
    trunk.position.set(tx, 1.6 * sc, tz); trunk.castShadow = true; g.add(trunk);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(1.8 * sc, 9, 9), crownMat);
    crown.position.set(tx, 3.8 * sc, tz); crown.castShadow = true; g.add(crown);
  });

  const mushroomColors = ['#cc3333', '#cc8833', '#3388cc', '#cc33cc'];
  for (let i = 0; i < 12; i++) {
    const mx = (Math.random() - 0.5) * 10;
    const mz = (Math.random() - 0.5) * 10;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.28, 6), accentMat('#f0e8d8'));
    stem.position.set(mx, 0.14, mz); g.add(stem);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), new THREE.MeshStandardMaterial({ color: mushroomColors[i % mushroomColors.length], roughness: 0.6, emissive: mushroomColors[i % mushroomColors.length], emissiveIntensity: 0.25 }));
    cap.scale.y = 0.6; cap.position.set(mx, 0.32, mz); g.add(cap);
  }

  const glowColors = ['#40ff80', '#80ff40', '#60ffaa', '#30cc60'];
  for (let i = 0; i < 8; i++) {
    const gx = (Math.random() - 0.5) * 11;
    const gz = (Math.random() - 0.5) * 11;
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 7, 7), new THREE.MeshBasicMaterial({ color: glowColors[i % glowColors.length], transparent: true, opacity: 0.7 }));
    orb.position.set(gx, 0.6 + Math.random() * 2.5, gz);
    orb.userData.glowOrb = true; orb.userData.glowPhase = Math.random() * Math.PI * 2;
    const ptLight = new THREE.PointLight(glowColors[i % glowColors.length], 0.7, 4);
    ptLight.position.copy(orb.position); g.add(orb, ptLight);
  }

  const ambientLight = new THREE.AmbientLight('#1a4020', 1.2); g.add(ambientLight);
  const greenKey = new THREE.DirectionalLight('#4aff60', 0.8);
  greenKey.position.set(0, 10, 0); g.add(greenKey);

  const exitSign = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.08), accentMat('#e7bf86', { emissive: '#c9a060', emissiveIntensity: 0.5 }));
  exitSign.position.set(0, 1.8, -D / 2 + 0.3); g.add(exitSign);

  g.position.copy(INTERIOR_BASE).add(new THREE.Vector3(60, 0, 0));
  scene.add(g);
  return g;
}

/* ─── Dungeon Interior ───────────────────  */
function buildDungeonInterior() {
  const g = new THREE.Group();
  const stoneMat = accentMat('#3a3432', { roughness: 0.95 });
  const floorMat = accentMat('#2a2220', { roughness: 0.98 });
  const W = 12, H = 5, D = 16;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; g.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), accentMat('#1e1c1a'));
  ceil.rotation.x = Math.PI / 2; ceil.position.y = H; g.add(ceil);
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.4), stoneMat); backWall.position.set(0, H / 2, -D / 2); g.add(backWall);
  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.4), stoneMat); frontWall.position.set(0, H / 2, D / 2); g.add(frontWall);
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, H, D), stoneMat); leftWall.position.set(-W / 2, H / 2, 0); g.add(leftWall);
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, H, D), stoneMat); rightWall.position.set(W / 2, H / 2, 0); g.add(rightWall);

  const torchColors = ['#ff6020', '#ff8030', '#ffa040'];
  [[-4, H - 0.5, -5], [4, H - 0.5, -5], [-4, H - 0.5, 4], [4, H - 0.5, 4]].forEach(([lx, ly, lz], i) => {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.18), accentMat('#5a4838'));
    bracket.position.set(lx, ly, lz); g.add(bracket);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 7), new THREE.MeshBasicMaterial({ color: torchColors[i % torchColors.length], transparent: true, opacity: 0.88 }));
    flame.position.set(lx, ly + 0.45, lz);
    flame.userData.flame = true; flame.userData.flamePhase = Math.random() * Math.PI * 2;
    const ptLight = new THREE.PointLight(torchColors[i % torchColors.length], 1.4, 9);
    ptLight.position.set(lx, ly + 0.3, lz); g.add(flame, ptLight);
  });

  for (let i = 0; i < 6; i++) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25 + Math.random() * 0.25, 0), stoneMat);
    rock.position.set((Math.random() - 0.5) * 9, 0.22, -2 + (Math.random() - 0.5) * 12);
    rock.rotation.set(Math.random(), Math.random(), Math.random()); g.add(rock);
  }

  const riftLight = new THREE.PointLight('#4420cc', 1.8, 14);
  riftLight.position.set(0, 2, -D / 2 + 2); g.add(riftLight);
  const riftOrb = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({ color: '#6633ff', transparent: true, opacity: 0.7 }));
  riftOrb.position.set(0, 2, -D / 2 + 2);
  riftOrb.userData.glowOrb = true; riftOrb.userData.glowPhase = 0;
  g.add(riftOrb);

  const exitSign = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.1), accentMat('#c83030', { emissive: '#992020', emissiveIntensity: 0.6 }));
  exitSign.position.set(0, 1.6, D / 2 - 0.4); g.add(exitSign);

  g.position.copy(INTERIOR_BASE).add(new THREE.Vector3(90, 0, 0));
  scene.add(g);
  return g;
}

interiorRooms.house = buildHouseInterior();
interiorRooms.barn = buildBarnInterior();
interiorRooms.forest = buildForestInterior();
interiorRooms.dungeon = buildDungeonInterior();

/* ─── Screen Flash Overlay ─────────────── */
const flashOverlay = document.createElement('div');
flashOverlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;background:#ffffff;opacity:0;z-index:9999;transition:opacity 0.05s';
document.body.appendChild(flashOverlay);
let flashTimer = 0;

function triggerFlash(intensity = 1, duration = 0.12, color = '#ffffff') {
  flashOverlay.style.background = color;
  flashOverlay.style.transition = 'none';
  flashOverlay.style.opacity = String(intensity);
  flashTimer = duration;
}

/* ─── Enter / Exit Building ──────────────  */
const playerOutdoorPos = new THREE.Vector3(2, 0, 10);

function enterBuilding(type) {
  SND.door();
  triggerFlash(1, 0.15, type === 'dungeon' ? '#220033' : type === 'forest' ? '#002211' : '#fffaf0');
  setTimeout(() => {
    playerOutdoorPos.copy(player.position);
    world.interior = true;
    world.interiorType = type;
    const room = interiorRooms[type];
    if (!room) return;
    const base = room.position.clone();
    player.position.set(base.x, 0, base.z + 3);
    cameraRig.yaw = Math.PI;
    cameraRig.pitch = 0.35;
    cameraRig.distance = 11;
    if (type === 'forest') { SND.forestAmbience(); showToast('Memasuki Hutan Mistik 🌿'); }
    else if (type === 'dungeon') { SND.dungeonAmbience(); showToast('Memasuki Dungeon Rift ☠️'); }
    else { showToast(`Memasuki ${type === 'house' ? 'Rumah Pemain 🏠' : 'Barn 🐄'}`); }
    triggerFlash(0.6, 0.12, type === 'dungeon' ? '#220033' : type === 'forest' ? '#002211' : '#fffaf0');
  }, 180);
}

function exitBuilding() {
  SND.door();
  triggerFlash(0.8, 0.12);
  setTimeout(() => {
    world.interior = false;
    world.interiorType = null;
    player.position.copy(playerOutdoorPos);
    cameraRig.distance = 15;
    showToast('Keluar ke luar bangunan.');
    triggerFlash(0.4, 0.1);
  }, 160);
}

/* ─── Lightning Bolt VFX ─────────────────  */
const lightningBoltGroup = new THREE.Group();
scene.add(lightningBoltGroup);

function spawnLightningBolt(fromPos, toPos) {
  const boltMat = new THREE.LineBasicMaterial({ color: '#c8e8ff', linewidth: 2 });
  const segments = 10;
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = fromPos.x + (toPos.x - fromPos.x) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * 2.2 : 0);
    const y = fromPos.y + (toPos.y - fromPos.y) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * 1.5 : 0);
    const z = fromPos.z + (toPos.z - fromPos.z) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * 2.2 : 0);
    points.push(new THREE.Vector3(x, y, z));
  }
  const boltGeo = new THREE.BufferGeometry().setFromPoints(points);
  const bolt = new THREE.Line(boltGeo, boltMat);
  bolt.userData.ttl = 0.18;
  lightningBoltGroup.add(bolt);
  world.lightningBolts.push(bolt);

  const coreMat = new THREE.LineBasicMaterial({ color: '#ffffff' });
  const corePoints = points.map(p => new THREE.Vector3(p.x + (Math.random() - 0.5) * 0.3, p.y, p.z + (Math.random() - 0.5) * 0.3));
  const coreBolt = new THREE.Line(new THREE.BufferGeometry().setFromPoints(corePoints), coreMat);
  coreBolt.userData.ttl = 0.12;
  lightningBoltGroup.add(coreBolt);
  world.lightningBolts.push(coreBolt);
}

function updateLightningBolts(delta) {
  for (let i = world.lightningBolts.length - 1; i >= 0; i--) {
    const bolt = world.lightningBolts[i];
    bolt.userData.ttl -= delta;
    if (bolt.userData.ttl <= 0) {
      lightningBoltGroup.remove(bolt);
      bolt.geometry.dispose();
      world.lightningBolts.splice(i, 1);
    } else {
      bolt.material.opacity = bolt.userData.ttl * 6;
    }
  }
}

/* ─── Water Ripple System ────────────────  */
const waterRipplePool = [];

function spawnWaterRipple(x, z) {
  const mat = new THREE.MeshBasicMaterial({ color: '#a0d8ef', transparent: true, opacity: 0.7, wireframe: false, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.22, 18), mat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, 0.06, z);
  ring.userData.age = 0;
  ring.userData.maxAge = 1.4;
  scene.add(ring);
  waterRipplePool.push(ring);
  SND.ripple();
}

let waterRippleTimer = 0;

function updateWaterRipples(delta) {
  waterRippleTimer += delta;
  if (waterRippleTimer > 1.8) {
    waterRippleTimer = 0;
    const rx = 30 + Math.random() * 10;
    const rz = -10 + Math.random() * 20;
    spawnWaterRipple(rx, rz);
  }
  for (let i = waterRipplePool.length - 1; i >= 0; i--) {
    const r = waterRipplePool[i];
    r.userData.age += delta;
    const pct = r.userData.age / r.userData.maxAge;
    const s = 1 + pct * 7;
    r.scale.set(s, s, s);
    r.material.opacity = 0.6 * (1 - pct);
    if (pct >= 1) {
      scene.remove(r);
      r.geometry.dispose();
      waterRipplePool.splice(i, 1);
    }
  }
  const ct = waterTexture.offset;
  ct.y += delta * 0.04;
}

/* ─── Ambient Fire Timers ─────────────────  */
let fireTimer = 0;
let windTimer = 0;

/* ─── Clouds ─────────────────────────────  */
function createCloud(x, y, z, scale = 1) {
  const group = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95, transparent: true, opacity: 0.88 });
  const puffs = [
    [0, 0, 0, 2.4],
    [2.2, 0.4, 0, 1.8],
    [-2.2, 0.2, 0, 1.9],
    [0.8, 1.0, 0.5, 1.4],
    [-0.8, 0.8, -0.5, 1.5],
    [1.5, -0.2, 0.8, 1.3],
    [-1.5, -0.3, -0.8, 1.2],
  ];
  for (const [px, py, pz, pr] of puffs) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(pr * scale, 7, 7), cloudMat);
    puff.position.set(px * scale, py * scale, pz * scale);
    group.add(puff);
  }
  group.position.set(x, y, z);
  scene.add(group);
  world.clouds.push({ group, speed: 0.6 + Math.random() * 0.9, range: 90 + Math.random() * 30, baseZ: z });
  return group;
}

createCloud(-30, 42, -20, 1.2);
createCloud(10, 50, 30, 0.9);
createCloud(-50, 38, 5, 1.0);
createCloud(40, 44, -35, 1.1);
createCloud(-10, 55, -50, 0.8);
createCloud(60, 48, 10, 1.3);

/* ─── Decorations ────────────────────────  */
function addFlowerPatch(x, z, count = 8) {
  const colors = ['#f0c040', '#f04080', '#c060e0', '#40c0f0', '#f08040'];
  for (let i = 0; i < count; i += 1) {
    const stem = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 5), accentMat('#4a8030')));
    stem.position.set(x + (Math.random() - 0.5) * 3, 0.27, z + (Math.random() - 0.5) * 3);
    scene.add(stem);
    const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 7), new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.7 }));
    bloom.position.set(stem.position.x, 0.65, stem.position.z);
    scene.add(bloom);
  }
}
addFlowerPatch(24, 22, 12);
addFlowerPatch(-8, -6, 8);
addFlowerPatch(6, -8, 7);
addFlowerPatch(-26, -10, 6);

setLoader(58, 'Menambahkan karakter utama, ayam, babi, dan domba…');

/* ─── Player ─────────────────────────────  */
const player = new THREE.Group();
player.name = 'playerGroup';

const playerTorso = addBounds(new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.1, 0.52), accentMat('#e0b97d')));
playerTorso.position.y = 1.65;

const playerHips = addBounds(new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.42, 0.48), accentMat('#c89b5a')));
playerHips.position.y = 1.05;

const playerHead = addBounds(new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), accentMat('#f3dbc4')));
playerHead.position.y = 2.58;

const playerFaceL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 7, 7), accentMat('#1a1a1a'));
playerFaceL.position.set(-0.14, 2.64, 0.34);
const playerFaceR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 7, 7), accentMat('#1a1a1a'));
playerFaceR.position.set(0.14, 2.64, 0.34);

const playerHat = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.58, 0.16, 16), accentMat('#3f322c')));
playerHat.position.y = 2.96;
const hatTop = addBounds(new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.36, 0.28, 16), accentMat('#5b463c')));
hatTop.position.y = 3.12;

const armGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.88, 6);
const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.52, 2.18, 0);
const leftArm = addBounds(new THREE.Mesh(armGeo, accentMat('#d4a162')));
leftArm.position.y = -0.44;
leftArmPivot.add(leftArm);

const rightArmPivot = new THREE.Group();
rightArmPivot.position.set(0.52, 2.18, 0);
const rightArm = addBounds(new THREE.Mesh(armGeo, accentMat('#d4a162')));
rightArm.position.y = -0.44;
rightArmPivot.add(rightArm);

const legGeoP = new THREE.CylinderGeometry(0.12, 0.1, 0.92, 6);
const leftLegPivot = new THREE.Group();
leftLegPivot.position.set(-0.22, 1.05, 0);
const leftLeg = addBounds(new THREE.Mesh(legGeoP, accentMat('#5a3d25')));
leftLeg.position.y = -0.46;
leftLegPivot.add(leftLeg);

const rightLegPivot = new THREE.Group();
rightLegPivot.position.set(0.22, 1.05, 0);
const rightLeg = addBounds(new THREE.Mesh(legGeoP, accentMat('#5a3d25')));
rightLeg.position.y = -0.46;
rightLegPivot.add(rightLeg);

const leftShoe = addBounds(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.38), accentMat('#2a1e14')));
leftShoe.position.set(-0.22, 0.09, 0.06);
const rightShoe = addBounds(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.38), accentMat('#2a1e14')));
rightShoe.position.set(0.22, 0.09, 0.06);

player.add(playerTorso, playerHips, playerHead, playerFaceL, playerFaceR,
           playerHat, hatTop, leftArmPivot, rightArmPivot,
           leftLegPivot, rightLegPivot, leftShoe, rightShoe);
player.position.set(2, 0, 10);
player.userData = { velY: 0 };
scene.add(player);

/* ─── Building Glow Rings ────────────────  */
function addGlowRing(group, radius = 4.5) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.12, 6, 32),
    new THREE.MeshBasicMaterial({ color: '#e7bf86', transparent: true, opacity: 0 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.08;
  group.add(ring);
  return ring;
}

/* ─── Interactive Definitions ────────────  */
const selectionDefs = {
  house: {
    label: 'Rumah Pemain',
    mesh: restHouseMesh,
    text: 'Rumah utama untuk beristirahat, menyimpan energi, dan mengakses lemari pakaian. Tidur di sini akan menyimpan progress permainan.',
    meta: () => ['Energi max', 'Wardrobe', `Hari ${state.day}`],
    actions: () => [
      { label: '🚪 Masuk ke dalam', run: () => enterBuilding('house') },
      { label: 'Istirahat (+30 XP)', run: () => { gainXP(30); SND.sleep(); showToast('Beristirahat di rumah. Progress disimpan! Energi terisi penuh.'); syncHud(); selectInteractive('house'); } },
      { label: 'Buka wardrobe', run: () => { showToast('Wardrobe dibuka. Pilih kostum petani favorit!'); SND.click(); selectInteractive('house'); } },
    ],
  },
  town: {
    label: 'Town Hub',
    mesh: townMesh,
    text: 'Pusat order harian, kontrak, dan akses market. Di sini Anda mengambil order dan membuka jalur produksi.',
    meta: () => ['Market siap', 'Workshop aktif', `${state.orders} kontrak`],
    actions: () => [
      { label: 'Ambil order (+25 XP)', run: () => { state.orders += 1; gainXP(25); progressQuest('order'); showToast('Order baru ditambahkan.'); syncHud(); selectInteractive('town'); } },
      { label: 'Jual semua hasil', run: () => { if (state.storage > 0) { const earn = state.storage * 28; gainCoins(earn, window.innerWidth * 0.82, window.innerHeight * 0.5); progressQuest('sell'); state.storage = 0; gainXP(15); syncHud(); showToast(`${state.storage + (earn > 0 ? 0 : 0)} item dijual seharga ${earn} koin.`); selectInteractive('town'); } else showToast('Storage masih kosong.'); } },
    ],
  },
  market: {
    label: 'Market',
    mesh: marketMesh,
    text: 'Area jual-beli yang menerima hasil panen, madu, dan produk dairy. Tempat membeli pasokan cepat.',
    meta: () => [`🪙 ${new Intl.NumberFormat('id-ID').format(state.coins)}`, 'Restock cepat', 'Pasar aktif'],
    actions: () => [
      { label: 'Restock storage +5', run: () => { if (state.coins >= 50) { state.storage = Math.min(state.storageCap, state.storage + 5); gainCoins(-50); syncHud(); showToast('Storage +5. Biaya: 50 koin.'); selectInteractive('market'); } else showToast('Koin tidak cukup (butuh 50).'); } },
      { label: 'Jual semua (+bonus)', run: () => { if (state.storage > 0) { const earn = Math.round(state.storage * 32); gainCoins(earn, window.innerWidth * 0.82, window.innerHeight * 0.5); progressQuest('sell'); state.storage = 0; gainXP(20); syncHud(); showToast(`Dijual di market dengan harga premium!`); selectInteractive('market'); } else showToast('Storage kosong.'); } },
    ],
  },
  barn: {
    label: 'Barn',
    mesh: barnMesh,
    text: 'Kandang utama untuk sapi, ayam, babi, dan domba. Pusat produksi susu, telur, dan wool.',
    meta: () => [`🥛 ${state.milkReady} susu`, `🥚 ${state.eggsReady} telur`, 'Hewan sehat'],
    actions: () => [
      { label: '🚪 Masuk ke dalam', run: () => enterBuilding('barn') },
      { label: `Ambil susu (${state.milkReady})`, run: () => { if (state.milkReady > 0) { const n = state.milkReady; state.storage = Math.min(state.storageCap, state.storage + n); state.milkReady = 0; gainXP(12 * n); progressQuest('milk', n); progressQuest('harvest', n); spawnHarvestFloat(`+${n} 🥛`, window.innerWidth * 0.18, window.innerHeight * 0.5); syncHud(); showToast(`${n} susu dikumpulkan.`); selectInteractive('barn'); } } },
      { label: `Ambil telur (${state.eggsReady})`, run: () => { if (state.eggsReady > 0) { const n = state.eggsReady; state.storage = Math.min(state.storageCap, state.storage + n); state.eggsReady = 0; gainXP(10 * n); progressQuest('harvest', n); spawnHarvestFloat(`+${n} 🥚`, window.innerWidth * 0.18, window.innerHeight * 0.5); syncHud(); showToast(`${n} telur dikumpulkan.`); selectInteractive('barn'); } } },
    ],
  },
  creamery: {
    label: 'Creamery',
    mesh: creameryMesh,
    text: 'Stasiun pengolahan susu dan gandum menjadi produk premium. Cocok untuk ekonomi mid-game.',
    meta: () => ['Olah susu → keju', 'Mesin siap', `🪙 ${new Intl.NumberFormat('id-ID').format(state.coins)}`],
    actions: () => [
      { label: 'Olah susu → keju (+35🪙)', run: () => { if (state.storage > 0) { state.storage -= 1; gainCoins(35, window.innerWidth * 0.5, window.innerHeight * 0.5); progressQuest('process'); gainXP(18); spawnHarvestFloat('+35 🪙 keju', window.innerWidth * 0.5, window.innerHeight * 0.45); syncHud(); showToast('Susu diolah menjadi keju premium.'); selectInteractive('creamery'); } else showToast('Storage kosong.'); } },
    ],
  },
  bakery: {
    label: 'Bakery',
    mesh: bakeryMesh,
    text: 'Toko roti yang mengubah gandum dan telur menjadi produk roti berkualitas tinggi. Bernilai lebih dari hasil mentah.',
    meta: () => [`🍞 ${state.breadReady} roti`, 'Oven aktif', 'Resep spesial'],
    actions: () => [
      { label: 'Buat roti (1 storage → 45🪙)', run: () => { if (state.storage > 0) { state.storage -= 1; state.breadReady = Math.max(0, state.breadReady - 1); gainCoins(45, window.innerWidth * 0.5, window.innerHeight * 0.5); progressQuest('process'); gainXP(22); spawnHarvestFloat('+45 🪙 🍞', window.innerWidth * 0.5, window.innerHeight * 0.45); syncHud(); showToast('Roti segar siap! Dijual dengan harga terbaik.'); selectInteractive('bakery'); } else showToast('Storage kosong, butuh bahan baku.'); } },
      { label: 'Buat kue spesial (2 storage → 90🪙)', run: () => { if (state.storage >= 2) { state.storage -= 2; gainCoins(90, window.innerWidth * 0.5, window.innerHeight * 0.5); progressQuest('process'); gainXP(35); spawnHarvestFloat('+90 🪙 🎂', window.innerWidth * 0.5, window.innerHeight * 0.4); syncHud(); showToast('Kue spesial berhasil dibuat!'); selectInteractive('bakery'); } else showToast('Storage kurang (butuh 2).'); } },
    ],
  },
  orchard: {
    label: 'Orchard',
    mesh: orchardArea,
    text: 'Sabuk pohon buah dengan jalur bersih. Pohon menghasilkan buah setiap hari dengan kualitas terbaik.',
    meta: () => [`🍊 ${state.fruitReady} buah siap`, 'Jalur bersih', 'Pohon berjajar'],
    actions: () => [
      { label: `Panen buah (${state.fruitReady})`, run: () => { const n = state.fruitReady; state.storage = Math.min(state.storageCap, state.storage + n); state.fruitReady = 0; gainXP(8 * n); progressQuest('harvest', n); ['veg2','herb','veg3','herb2'].forEach((id) => harvestCrop(id)); spawnHarvestFloat(`+${n} 🍊`, window.innerWidth * 0.8, window.innerHeight * 0.5); syncHud(); showToast('Buah dipanen — pohon butuh waktu tumbuh kembali.'); selectInteractive('orchard'); } },
      { label: 'Tanam ulang sekarang (30🪙)', run: () => { if (state.fruitReady === 0 && state.coins >= 30) { gainCoins(-30); state.fruitReady = 4; ['veg2','herb','veg3','herb2'].forEach((id) => plantCrop(id)); syncHud(); showToast('Pohon buah ditanam ulang. Butuh waktu tumbuh.'); selectInteractive('orchard'); } else if (state.fruitReady > 0) showToast('Pohon masih tumbuh — belum perlu ditanam ulang.'); else showToast('Koin tidak cukup (butuh 30).'); } },
    ],
  },
  veg: {
    label: 'Bed Sayur',
    mesh: vegBedA,
    text: 'Bed sayur 3D dengan tanaman bervariasi: cabai, pakcoy, tomat, dan bayam. Panen cepat setiap hari.',
    meta: () => [`🥦 ${state.vegReady} sayur`, 'Varian lengkap', 'Siap panen'],
    actions: () => [
      { label: `Panen sayur (${state.vegReady})`, run: () => { const n = state.vegReady; state.storage = Math.min(state.storageCap, state.storage + n); state.vegReady = 0; gainXP(6 * n); progressQuest('harvest', n); ['veg','veg2','veg3'].forEach((id) => harvestCrop(id)); spawnHarvestFloat(`+${n} 🥦`, window.innerWidth * 0.18, window.innerHeight * 0.4); syncHud(); showToast('Sayur dipanen — lahan dikosongkan, tumbuh otomatis.'); selectInteractive('veg'); } },
      { label: 'Tanam sayur baru (20🪙)', run: () => { if (state.vegReady === 0 && state.coins >= 20) { gainCoins(-20); state.vegReady = 3; ['veg','veg2','veg3'].forEach((id) => plantCrop(id)); syncHud(); showToast('Bibit sayur ditanam — tonton pertumbuhannya!'); selectInteractive('veg'); } else if (state.vegReady > 0) showToast('Sayur belum dipanen.'); else showToast('Koin tidak cukup.'); } },
    ],
  },
  rice: {
    label: 'Sawah',
    mesh: riceBed,
    text: 'Sawah dengan kanal tepi aktif. Area produksi beras terbesar di farm ini, mendukung panen besar.',
    meta: () => [`🌾 ${state.riceReady} padi`, 'Kanal tepi aktif', 'Petak selatan'],
    actions: () => [
      { label: `Panen padi (${state.riceReady})`, run: () => { const n = state.riceReady; state.storage = Math.min(state.storageCap, state.storage + n); state.riceReady = 0; gainXP(7 * n); progressQuest('harvest', n); harvestCrop('rice'); spawnHarvestFloat(`+${n} 🌾`, window.innerWidth * 0.8, window.innerHeight * 0.4); syncHud(); showToast('Padi dipanen — sawah dikosongkan, bibit tumbuh otomatis.'); selectInteractive('rice'); } },
      { label: 'Tanam padi (25🪙)', run: () => { if (state.riceReady === 0 && state.coins >= 25) { gainCoins(-25); state.riceReady = 6; plantCrop('rice'); syncHud(); showToast('Padi ditanam — perhatikan pertumbuhannya dari bibit ke panen!'); selectInteractive('rice'); } else if (state.riceReady > 0) showToast('Sawah sudah ditanami.'); else showToast('Koin tidak cukup (butuh 25).'); } },
    ],
  },
  apiary: {
    label: 'Apiary',
    mesh: apiaryMesh,
    text: 'Area madu dekat bunga untuk mendukung penyerbukan orchard. Madu paling mahal di farm ini.',
    meta: () => [`🍯 ${state.honeyReady} madu`, 'Lebah aktif', 'Bunga sehat'],
    actions: () => [
      { label: `Panen madu (${state.honeyReady})`, run: () => { if (state.honeyReady > 0) { const n = state.honeyReady; state.storage = Math.min(state.storageCap, state.storage + n); state.honeyReady = 0; gainXP(20 * n); progressQuest('honey', n); progressQuest('harvest', n); spawnHarvestFloat(`+${n} 🍯`, window.innerWidth * 0.82, window.innerHeight * 0.35); syncHud(); showToast('Madu dipanen!'); selectInteractive('apiary'); } } },
    ],
  },
  windmill: {
    label: 'Windmill',
    mesh: windmillGroup,
    text: 'Kincir angin mengubah tenaga angin menjadi energi untuk seluruh farm. Memberikan bonus produksi harian.',
    meta: () => ['Angin kencang', 'Energi aktif', `Hari ${state.day}`],
    actions: () => [
      { label: 'Aktifkan bonus (20🪙 → +10 XP)', run: () => { if (state.coins >= 20) { gainCoins(-20); gainXP(30); showToast('Kincir angin diaktifkan! Bonus produksi hari ini.'); selectInteractive('windmill'); } else showToast('Koin tidak cukup.'); } },
    ],
  },
  forest: {
    label: '🌿 Hutan Mistik',
    mesh: forestGateMesh,
    text: 'Gerbang menuju Hutan Mistik. Di dalam tersembunyi jamur ajaib, cahaya roh, dan material langka. Eksplorasi menghasilkan XP dan sumber daya hutan.',
    meta: () => ['Eksplorasi', 'Jamur Ajaib', 'Cahaya Roh'],
    actions: () => [
      { label: '🌲 Masuk ke Hutan', run: () => enterBuilding('forest') },
      { label: 'Forage (+12 XP)', run: () => { gainXP(12); state.storage = Math.min(state.storageCap, state.storage + 2); spawnHarvestFloat('+2 🌿', window.innerWidth * 0.5, window.innerHeight * 0.45); syncHud(); showToast('Hasil forage hutan: 2 item didapat!'); selectInteractive('forest'); SND.forestAmbience(); } },
      { label: 'Tangkap Roh (+30 XP)', run: () => { if (state.coins >= 30) { gainCoins(-30); gainXP(30); spawnHarvestFloat('+30 XP ✨', window.innerWidth * 0.5, window.innerHeight * 0.4); syncHud(); showToast('Roh hutan berhasil ditangkap!'); selectInteractive('forest'); } else showToast('Koin tidak cukup (butuh 30).'); } },
    ],
  },
  dungeon: {
    label: '☠️ Dungeon Rift',
    mesh: dungeonGateMesh,
    text: 'Gerbang kegelapan menuju Dungeon Rift. Monster berat, loot tinggi, dan card reward menanti. Hanya untuk petarung berpengalaman.',
    meta: () => [`Level ${state.level}`, 'Monster Berat', 'Loot Tinggi'],
    actions: () => [
      { label: '🗡️ Masuk ke Dungeon', run: () => { if (state.level >= 3) { enterBuilding('dungeon'); } else showToast('Butuh Level 3 untuk masuk Dungeon!'); } },
      { label: 'Lawan Monster (−15 HP, +50 XP)', run: () => { gainXP(50); gainCoins(80, window.innerWidth * 0.5, window.innerHeight * 0.5); spawnHarvestFloat('+80 🪙 +50 XP', window.innerWidth * 0.5, window.innerHeight * 0.4); SND.dungeonAmbience(); showToast('Monster dungeon dikalahkan! Loot didapat.'); selectInteractive('dungeon'); } },
      { label: 'Ambil Loot Tersembunyi', run: () => { const loot = 50 + state.level * 20; gainCoins(loot, window.innerWidth * 0.5, window.innerHeight * 0.5); gainXP(25); showToast(`Loot tersembunyi: +${loot} koin!`); selectInteractive('dungeon'); } },
    ],
  },
  petshop: {
    label: '🐾 Pet Shop',
    mesh: petShopMesh,
    text: 'Toko hewan peliharaan imut Farm World! Beli kucing, kelinci, anjing, anak ayam, rubah, atau panda — mereka akan menemanimu berpetualang.',
    meta: () => [`${state.pets.length} hewan dimiliki`, 'Hewan lucu', 'Ikut berkelana'],
    actions: () => [
      ...PET_CATALOG.map((p) => ({
        label: `Beli ${p.emoji} ${p.name} (${p.cost}🪙)${state.pets.includes(p.type) ? ' ✓' : ''}`,
        run: () => {
          if (state.coins < p.cost) { showToast(`Koin tidak cukup. Butuh ${p.cost}🪙.`); return; }
          gainCoins(-p.cost);
          if (!state.pets.includes(p.type)) state.pets.push(p.type);
          spawnPetMesh(p.type);
          spawnHarvestFloat(`${p.emoji} +${p.name}!`, window.innerWidth * 0.5, window.innerHeight * 0.45);
          gainXP(10);
          showToast(`${p.name} dibeli! Dia akan menemanimu di farm.`);
          selectInteractive('petshop');
        },
      })),
      { label: 'Lepas semua hewan peliharaan', run: () => { world.petMeshes.forEach((pet) => scene.remove(pet.group)); world.petMeshes.length = 0; state.pets = []; showToast('Semua hewan peliharaan dilepas.'); selectInteractive('petshop'); } },
    ],
  },
};

/* ─── Interactive Glow Rings ─────────────  */
const glowRings = {};
Object.entries(selectionDefs).forEach(([id, def]) => {
  def.mesh.traverse((child) => {
    if (child.isMesh) {
      child.userData.interactiveId = id;
      world.clickable.push(child);
    }
  });
  world.interactives.push({ id, ...def });
  try {
    const ring = addGlowRing(def.mesh instanceof THREE.Group ? def.mesh : def.mesh);
    glowRings[id] = ring;
  } catch {}
});

function getInteractive(id) {
  return world.interactives.find((item) => item.id === id) || null;
}

setLoader(72, 'Mengaktifkan panel aksi, kontrol, dan sistem quest…');

/* ─── Panel UI ───────────────────────────  */
function setPanel(def) {
  if (!def) return;
  panelTitle.textContent = def.label;
  panelText.textContent = def.text;
  panelMeta.innerHTML = (def.meta?.() || []).map((line) => `<span class="panel-badge">${line}</span>`).join('');
  const actions = def.actions?.() || [];
  panelActions.innerHTML = actions.map((action, index) => `<button class="ghost-button magnetic" data-game-action="${index}" type="button">${action.label}</button>`).join('');
  panelActions.querySelectorAll('[data-game-action]').forEach((button) => {
    button.addEventListener('click', () => actions[Number(button.dataset.gameAction)]?.run?.());
  });
}

function setInteractiveHighlight(selectedId) {
  world.interactives.forEach((item) => {
    const active = item.id === selectedId;
    item.mesh.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      if (!child.userData.baseEmissive) {
        child.userData.baseEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color('#000000');
      }
      if (child.material.emissive) {
        child.material.emissive.copy(active ? new THREE.Color('#2d1d0e') : child.userData.baseEmissive);
        child.material.emissiveIntensity = active ? 0.7 : 0;
      }
    });
    if (glowRings[item.id]) {
      glowRings[item.id].material.opacity = active ? 0.55 : 0;
    }
  });
}

function selectInteractive(id) {
  const target = getInteractive(id);
  if (!target) return;
  state.currentSelection = id;
  world.selected = target;
  setInteractiveHighlight(id);
  setPanel(target);
}

function getNearestInteractive() {
  let nearest = null;
  let nearestDistance = Infinity;
  const playerPos = player.position;
  world.interactives.forEach((item) => {
    const point = new THREE.Vector3();
    item.mesh.getWorldPosition(point);
    const distance = point.distanceTo(playerPos);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = item;
    }
  });
  if (nearestDistance < 8) return { item: nearest, distance: nearestDistance };
  return null;
}

/* ─── Camera ─────────────────────────────  */
const movement = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();
const playerDirection = new THREE.Vector3(0, 0, 1);

function updateInputMode(label) {
  if (inputModeEl) inputModeEl.textContent = `Input: ${label}`;
}

updateInputMode('keyboard + mouse');

function setUiHidden(hidden) {
  document.body.classList.toggle('game-ui-hidden', hidden);
  if (toggleUiButton) {
    toggleUiButton.textContent = hidden ? 'Show Panels' : 'Hide Panels';
    toggleUiButton.setAttribute('aria-pressed', hidden ? 'true' : 'false');
  }
}
setUiHidden(false);

function setupGameMenu() {
  if (!gameMenuToggle || !gameMobileMenu || gameMenuToggle.dataset.menuBound === '1') return;
  let lastToggleAt = 0;
  const closeMenu = () => {
    gameMobileMenu.classList.remove('is-open');
    gameMenuToggle.classList.remove('is-open');
    gameMenuToggle.setAttribute('aria-expanded', 'false');
    gameMobileMenu.setAttribute('aria-hidden', 'true');
  };
  const toggleMenu = (force) => {
    const opened = typeof force === 'boolean' ? force : !gameMobileMenu.classList.contains('is-open');
    gameMobileMenu.classList.toggle('is-open', opened);
    gameMenuToggle.classList.toggle('is-open', opened);
    gameMenuToggle.setAttribute('aria-expanded', String(opened));
    gameMobileMenu.setAttribute('aria-hidden', String(!opened));
    lastToggleAt = Date.now();
  };
  gameMenuToggle.dataset.menuBound = '1';
  const handleToggle = (event) => {
    if (Date.now() - lastToggleAt < 220) return;
    event.preventDefault();
    event.stopPropagation();
    toggleMenu();
  };
  gameMenuToggle.addEventListener('click', handleToggle);
  gameMenuToggle.addEventListener('pointerup', handleToggle);
  gameMenuToggle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') handleToggle(event);
  });
  gameMobileMenu.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', (event) => {
    if (!gameMobileMenu.classList.contains('is-open')) return;
    if (Date.now() - lastToggleAt < 250) return;
    if (gameMenuToggle.contains(event.target) || gameMobileMenu.contains(event.target)) return;
    closeMenu();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  gameMobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
}
setupGameMenu();

/* ─── Spells ─────────────────────────────  */
const spellCooldowns = { lightning: 0, water: 0 };
function castSpell(kind) {
  const now = clock.elapsedTime;
  const isLightning = kind === 'lightning';
  const cooldown = isLightning ? 0.9 : 1.2;
  if (spellCooldowns[kind] > now) {
    showToast(isLightning ? 'Petir masih mengisi ulang.' : 'Wave masih mengisi ulang.');
    return;
  }
  spellCooldowns[kind] = now + cooldown;
  const material = accentMat(isLightning ? '#f5d477' : '#7dcaf5', {
    emissive: isLightning ? '#d8a323' : '#2c88b6',
    emissiveIntensity: isLightning ? 1.3 : 0.9,
    transparent: true, opacity: 0.92, roughness: 0.25, metalness: 0.08,
  });
  const mesh = new THREE.Mesh(isLightning ? new THREE.IcosahedronGeometry(0.38, 1) : new THREE.SphereGeometry(0.44, 18, 18), material);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(isLightning ? 0.34 : 0.46, 0.06, 8, 18), accentMat(isLightning ? '#f9e7ad' : '#a8e1ff', { emissive: isLightning ? '#d9b03e' : '#3b8fb6', emissiveIntensity: 0.8, transparent: true, opacity: 0.82, roughness: 0.3 }));
  ring.rotation.x = Math.PI / 2;
  const group = new THREE.Group();
  group.add(mesh, ring);
  group.position.copy(player.position).add(new THREE.Vector3(0, 1.9, 0));
  scene.add(group);
  const direction = new THREE.Vector3(Math.sin(player.rotation.y), 0.06, Math.cos(player.rotation.y)).normalize();

  if (isLightning) {
    SND.thunderBolt();
    const fromPos = group.position.clone().add(new THREE.Vector3(0, 14, 0));
    const toPos = group.position.clone();
    spawnLightningBolt(fromPos, toPos);
    setTimeout(() => {
      const fromPos2 = toPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3, 12, (Math.random() - 0.5) * 3));
      spawnLightningBolt(fromPos2, toPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2)));
    }, 60);
    triggerFlash(0.75, 0.08, '#d8f0ff');
    setTimeout(() => triggerFlash(0.4, 0.06, '#c0e8ff'), 110);
  } else {
    SND.water();
    spawnWaterRipple(group.position.x, group.position.z);
  }

  world.effects.push({ kind, group, mesh, ring, velocity: direction.multiplyScalar(isLightning ? 18 : 12), ttl: isLightning ? 0.7 : 1.2, hit: false });
  showToast(isLightning ? '⚡ Sihir petir dilepas.' : '💧 Gelombang air dilepas.');
}

function updateEffects(delta) {
  for (let i = world.effects.length - 1; i >= 0; i -= 1) {
    const effect = world.effects[i];
    effect.ttl -= delta;
    effect.group.position.addScaledVector(effect.velocity, delta);
    effect.mesh.rotation.x += delta * (effect.kind === 'lightning' ? 12 : 4);
    effect.mesh.rotation.y += delta * (effect.kind === 'lightning' ? 8 : 2.4);
    effect.ring.rotation.z += delta * 2.2;
    const life = Math.max(effect.ttl, 0);
    effect.mesh.material.opacity = Math.min(0.92, life * 1.2);
    effect.ring.material.opacity = Math.min(0.82, life * 1.1);
    const nearby = effect.hit ? null : getNearestInteractive();
    if (nearby && nearby.distance < (effect.kind === 'lightning' ? 3.2 : 3.8)) {
      effect.hit = true;
      if (effect.kind === 'lightning') {
        state.orders = Math.min(state.orders + 1, 9);
        gainXP(10);
        showToast(`⚡ Petir menyambar ${nearby.item.label}. +1 kontrak, +10 XP.`);
      } else {
        state.storage = Math.min(state.storageCap, state.storage + 2);
        gainXP(8);
        showToast(`💧 Gelombang air menyegarkan ${nearby.item.label}. Storage +2.`);
      }
      syncHud();
    }
    if (effect.ttl <= 0) {
      scene.remove(effect.group);
      effect.group.traverse((child) => { if (child.material) child.material.dispose?.(); if (child.geometry) child.geometry.dispose?.(); });
      world.effects.splice(i, 1);
    }
  }
}

/* ─── Input Handling ─────────────────────  */
function onKeyChange(event, pressed) {
  const key = event.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
  if (key === 'w' || key === 'arrowup') input.forward = pressed;
  if (key === 's' || key === 'arrowdown') input.backward = pressed;
  if (key === 'a' || key === 'arrowleft') input.left = pressed;
  if (key === 'd' || key === 'arrowright') input.right = pressed;
  if (key === 'shift') input.run = pressed;
  if (key === 'e' && pressed) input.interactQueued = true;
  if (key === ' ' && pressed) input.jumpQueued = true;
  if (key === 'q' && pressed) input.spellLightningQueued = true;
  if (key === 'r' && pressed) input.spellWaterQueued = true;
  if (key === 'h' && pressed) setUiHidden(!document.body.classList.contains('game-ui-hidden'));
  if (key === 'f' && pressed && world.interior) exitBuilding();
  if (key === 'escape' && pressed && world.interior) exitBuilding();
}
window.addEventListener('keydown', (event) => onKeyChange(event, true));
window.addEventListener('keyup', (event) => onKeyChange(event, false));

canvas.addEventListener('pointerdown', (event) => {
  input.pointerDown = true;
  input.usingTouch = event.pointerType !== 'mouse';
  updateInputMode(input.usingTouch ? 'touch' : 'keyboard + mouse');
  canvas.setPointerCapture?.(event.pointerId);
});
canvas.addEventListener('pointerup', (event) => {
  input.pointerDown = false;
  canvas.releasePointerCapture?.(event.pointerId);
});
canvas.addEventListener('pointermove', (event) => {
  if (!input.pointerDown) return;
  input.lookDelta.x += event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  input.lookDelta.y += event.movementY || 0;
});
canvas.addEventListener('wheel', (event) => {
  cameraRig.distance = THREE.MathUtils.clamp(cameraRig.distance + event.deltaY * 0.01, cameraRig.minDistance, cameraRig.maxDistance);
}, { passive: true });

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(world.clickable, false)[0];
  if (hit?.object?.userData?.interactiveId) {
    selectInteractive(hit.object.userData.interactiveId);
  }
});

const mobileMedia = window.matchMedia('(max-width: 980px)');
function updateMobileControls() {
  const enabled = mobileMedia.matches || 'ontouchstart' in window;
  mobileControls?.setAttribute('aria-hidden', enabled ? 'false' : 'true');
  if (mobileControls) mobileControls.style.display = enabled ? 'flex' : 'none';
}
updateMobileControls();
mobileMedia.addEventListener?.('change', updateMobileControls);

let stickPointerId = null;
const stickState = { x: 0, y: 0 };
function updateStickKnob() {
  if (!moveStickKnob) return;
  moveStickKnob.style.transform = `translate(${stickState.x * 34}px, ${stickState.y * 34}px)`;
}
function setStickFromEvent(event) {
  const rect = moveStick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  const dx = (event.clientX - cx) / (rect.width / 2);
  const dy = (event.clientY - cy) / (rect.height / 2);
  const len = Math.hypot(dx, dy) || 1;
  stickState.x = len > 1 ? dx / len : dx;
  stickState.y = len > 1 ? dy / len : dy;
  input.moveTouch.x = stickState.x;
  input.moveTouch.y = stickState.y;
  updateStickKnob();
  updateInputMode('touch controls');
}
moveStick?.addEventListener('pointerdown', (event) => { stickPointerId = event.pointerId; moveStick.setPointerCapture?.(event.pointerId); setStickFromEvent(event); });
moveStick?.addEventListener('pointermove', (event) => { if (event.pointerId !== stickPointerId) return; setStickFromEvent(event); });
const resetStick = () => { stickPointerId = null; stickState.x = 0; stickState.y = 0; input.moveTouch.x = 0; input.moveTouch.y = 0; updateStickKnob(); };
moveStick?.addEventListener('pointerup', resetStick);
moveStick?.addEventListener('pointercancel', resetStick);

actionButton?.addEventListener('click', () => {
  if (world.interior) { exitBuilding(); }
  else { input.interactQueued = true; }
  updateInputMode('touch controls');
});
jumpButton?.addEventListener('click', () => { input.jumpQueued = true; updateInputMode('touch controls'); });
zapButton?.addEventListener('click', () => { input.spellLightningQueued = true; updateInputMode('touch controls'); });
waveButton?.addEventListener('click', () => { input.spellWaterQueued = true; updateInputMode('touch controls'); });

if (runButton) {
  runButton.addEventListener('pointerdown', () => { input.run = true; updateInputMode('touch controls'); });
  runButton.addEventListener('pointerup', () => { input.run = false; });
  runButton.addEventListener('pointercancel', () => { input.run = false; });
}

const gameHelp = document.getElementById('gameHelp');
let helpVisible = false;
function toggleHelp(force) {
  helpVisible = force !== undefined ? force : !helpVisible;
  gameHelp?.classList.toggle('is-visible', helpVisible);
  gameHelp?.setAttribute('aria-hidden', String(!helpVisible));
  if (gameHelpTrigger) gameHelpTrigger.classList.toggle('is-active', helpVisible);
}
gameHelpTrigger?.addEventListener('click', () => toggleHelp());
document.addEventListener('keydown', (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
  if (event.key === '?') toggleHelp();
  if (event.key === 'Escape' && helpVisible) toggleHelp(false);
});

let camTouchId = null;
let camTouchLast = { x: 0, y: 0 };
if (gameCamArea) {
  gameCamArea.addEventListener('pointerdown', (event) => {
    camTouchId = event.pointerId;
    camTouchLast = { x: event.clientX, y: event.clientY };
    gameCamArea.setPointerCapture?.(event.pointerId);
    updateInputMode('touch controls');
  });
  gameCamArea.addEventListener('pointermove', (event) => {
    if (event.pointerId !== camTouchId) return;
    input.lookDelta.x += (event.clientX - camTouchLast.x) * 1.4;
    input.lookDelta.y += (event.clientY - camTouchLast.y) * 1.4;
    camTouchLast = { x: event.clientX, y: event.clientY };
  });
  const resetCam = () => { camTouchId = null; };
  gameCamArea.addEventListener('pointerup', resetCam);
  gameCamArea.addEventListener('pointercancel', resetCam);
}

fullscreenButton?.addEventListener('click', async () => {
  try { if (!document.fullscreenElement) await stage.requestFullscreen?.(); else await document.exitFullscreen?.(); } catch {}
});
toggleUiButton?.addEventListener('click', () => setUiHidden(!document.body.classList.contains('game-ui-hidden')));
focusTownButton?.addEventListener('click', () => { player.position.set(2, 0, 10); selectInteractive('house'); });
focusBarnButton?.addEventListener('click', () => { player.position.set(-18, 0, 14); selectInteractive('barn'); });

/* ─── Gamepad ────────────────────────────  */
function handleGamepad() {
  const pad = navigator.getGamepads?.().find(Boolean);
  if (!pad) return { moveX: 0, moveY: 0, run: false };
  updateInputMode('gamepad');
  const moveX = Math.abs(pad.axes[0]) > 0.14 ? pad.axes[0] : 0;
  const moveY = Math.abs(pad.axes[1]) > 0.14 ? pad.axes[1] : 0;
  cameraRig.yaw -= (Math.abs(pad.axes[2]) > 0.14 ? pad.axes[2] : 0) * 0.045;
  cameraRig.pitch += (Math.abs(pad.axes[3]) > 0.14 ? pad.axes[3] : 0) * 0.025;
  if (pad.buttons[0]?.pressed) input.jumpQueued = true;
  if (pad.buttons[1]?.pressed) input.spellLightningQueued = true;
  if (pad.buttons[3]?.pressed) input.spellWaterQueued = true;
  if (pad.buttons[2]?.pressed) input.interactQueued = true;
  return { moveX, moveY, run: !!pad.buttons[4]?.pressed || !!pad.buttons[5]?.pressed };
}

/* ─── Clock ──────────────────────────────  */
function advanceClock(delta) {
  state.minutes += delta * 1;
  if (state.minutes >= 24 * 60) {
    state.minutes -= 24 * 60;
    state.day += 1;
    state.weather = weatherCycle[state.day % weatherCycle.length];
    state.season = seasonCycle[Math.floor(state.day / 7) % seasonCycle.length];
    state.milkReady = Math.min(state.milkReady + 2, 6);
    state.eggsReady = Math.min(state.eggsReady + 5, 12);
    state.fruitReady = Math.min(state.fruitReady + 3, 10);
    state.vegReady = Math.min(state.vegReady + 3, 9);
    state.riceReady = Math.min(state.riceReady + 4, 14);
    state.honeyReady = Math.min(state.honeyReady + 1, 3);
    state.breadReady = Math.min(state.breadReady + 2, 5);
    gainXP(15);
    showToast(`Hari ${state.day} dimulai! ${state.season} - ${state.weather}`);
  }
  syncHud();
}

/* ─── Camera Update ──────────────────────  */
function updateCamera(delta) {
  cameraRig.yaw -= input.lookDelta.x * 0.0038;
  cameraRig.pitch += input.lookDelta.y * 0.0024;
  input.lookDelta.x = 0;
  input.lookDelta.y = 0;
  cameraRig.pitch = THREE.MathUtils.clamp(cameraRig.pitch, 0.22, 0.72);
  const target = player.position.clone().add(new THREE.Vector3(0, 1.65, 0));
  cameraTarget.lerp(target, 1 - Math.exp(-delta * 8));
  const cosPitch = Math.cos(cameraRig.pitch);
  const offset = new THREE.Vector3(
    Math.sin(cameraRig.yaw) * cosPitch * cameraRig.distance,
    Math.sin(cameraRig.pitch) * cameraRig.distance + 2,
    Math.cos(cameraRig.yaw) * cosPitch * cameraRig.distance,
  );
  camera.position.lerp(cameraTarget.clone().add(offset), 1 - Math.exp(-delta * 7));
  camera.lookAt(cameraTarget);
}

/* ─── Player Update ──────────────────────  */
function clampPlayer(pos) {
  if (world.interior) {
    const room = interiorRooms[world.interiorType];
    if (room) {
      const base = room.position;
      const hW = world.interiorType === 'house' ? 3 : world.interiorType === 'barn' ? 4.5 : 6;
      const hD = world.interiorType === 'house' ? 2.5 : world.interiorType === 'barn' ? 3.5 : 6;
      pos.x = THREE.MathUtils.clamp(pos.x, base.x - hW, base.x + hW);
      pos.z = THREE.MathUtils.clamp(pos.z, base.z - hD, base.z + hD + 3);
    }
  } else {
    pos.x = THREE.MathUtils.clamp(pos.x, -40, 36);
    pos.z = THREE.MathUtils.clamp(pos.z, -34, 32);
  }
}

function updatePlayer(delta) {
  const gamepad = handleGamepad();
  const moveX = (input.right ? 1 : 0) - (input.left ? 1 : 0) + input.moveTouch.x + gamepad.moveX;
  const moveY = (input.backward ? 1 : 0) - (input.forward ? 1 : 0) + input.moveTouch.y + gamepad.moveY;
  movement.set(0, 0, 0);
  const cameraForward = new THREE.Vector3();
  camera.getWorldDirection(cameraForward);
  cameraForward.y = 0;
  if (cameraForward.lengthSq() < 0.0001) cameraForward.set(0, 0, -1);
  cameraForward.normalize();
  const cameraRight = new THREE.Vector3().crossVectors(cameraForward, new THREE.Vector3(0, 1, 0)).normalize();
  movement.addScaledVector(cameraForward, -moveY);
  movement.addScaledVector(cameraRight, moveX);
  movement.y = 0;
  if (movement.lengthSq() > 1) movement.normalize();
  const isRunning = input.run || gamepad.run;
  const speed = isRunning ? 8.4 : 5.2;
  player.position.addScaledVector(movement, speed * delta);
  clampPlayer(player.position);
  if (movement.lengthSq() > 0.0001) {
    playerDirection.lerp(movement.clone().normalize(), 1 - Math.exp(-delta * 12));
    player.rotation.y = Math.atan2(playerDirection.x, playerDirection.z);
    const walkFreq = isRunning ? 12 : 7.5;
    const walkAmp = isRunning ? 0.54 : 0.36;
    const stride = Math.sin(clock.elapsedTime * walkFreq);
    leftArmPivot.rotation.x = stride * walkAmp;
    rightArmPivot.rotation.x = -stride * walkAmp;
    leftLegPivot.rotation.x = -stride * walkAmp * 0.9;
    rightLegPivot.rotation.x = stride * walkAmp * 0.9;
    const bobY = Math.abs(Math.sin(clock.elapsedTime * walkFreq)) * (isRunning ? 0.08 : 0.04);
    playerTorso.position.y = 1.65 + bobY;
    playerHead.position.y = 2.58 + bobY;
    playerFaceL.position.y = 2.64 + bobY;
    playerFaceR.position.y = 2.64 + bobY;
    playerHat.position.y = 2.96 + bobY;
    hatTop.position.y = 3.12 + bobY;
  } else {
    leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, 0, 8, delta);
    rightArmPivot.rotation.x = THREE.MathUtils.damp(rightArmPivot.rotation.x, 0, 8, delta);
    leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, 0, 8, delta);
    rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, 0, 8, delta);
    playerTorso.position.y = THREE.MathUtils.damp(playerTorso.position.y, 1.65, 8, delta);
    playerHead.position.y = THREE.MathUtils.damp(playerHead.position.y, 2.58, 8, delta);
  }
  if (input.jumpQueued && player.position.y <= 0.001) player.userData.velY = 7.2;
  if (input.spellLightningQueued) castSpell('lightning');
  if (input.spellWaterQueued) castSpell('water');
  input.jumpQueued = false;
  input.spellLightningQueued = false;
  input.spellWaterQueued = false;
  player.userData.velY += -18 * delta;
  player.position.y = Math.max(0, player.position.y + player.userData.velY * delta);
  if (player.position.y === 0) player.userData.velY = 0;
}

/* ─── Interaction ────────────────────────  */
function updateInteractions() {
  const nearest = getNearestInteractive();
  if (nearest) {
    gameHint.innerHTML = `Dekati <strong>${nearest.item.label}</strong> lalu tekan <strong>E</strong> atau Action.`;
    gameHint.classList.add('is-visible');
    if (input.interactQueued) selectInteractive(nearest.item.id);
  } else {
    gameHint.classList.remove('is-visible');
  }
  if (input.interactQueued && !nearest) showToast('Tidak ada objek dekat untuk diinteraksi.');
  input.interactQueued = false;
}

/* ─── Animal Animations ──────────────────  */
function updateAnimals(elapsed, delta) {
  world.animals.forEach((animal) => {
    animal.time += delta;
    const t = animal.time;

    if (animal.type === 'cow') {
      animal.group.position.y = Math.sin(t * 0.6) * 0.04;
      animal.group.rotation.y += Math.sin(t * 0.15) * 0.002;
    } else if (animal.type === 'chicken') {
      animal.group.position.y = Math.max(0, Math.sin(t * 3.5) * 0.06);
      animal.peckTimer -= delta;
      if (animal.peckTimer < 0) {
        animal.pecking = !animal.pecking;
        animal.peckTimer = animal.pecking ? 0.18 : 0.8 + Math.random() * 1.4;
        if (!animal.pecking) animal.group.rotation.y += (Math.random() - 0.5) * 1.2;
      }
      if (animal.head) animal.head.rotation.x = animal.pecking ? 0.5 : THREE.MathUtils.damp(animal.head.rotation.x, 0, 6, delta);
    } else if (animal.type === 'pig') {
      animal.group.position.y = Math.abs(Math.sin(t * 1.2)) * 0.05;
      animal.group.rotation.y += Math.sin(t * 0.08) * 0.003;
    } else if (animal.type === 'sheep') {
      animal.group.position.y = Math.sin(t * 0.9) * 0.035;
    }
  });
}

/* ─── Pet System ─────────────────────────  */
const PET_CATALOG = [
  { type: 'cat',     emoji: '🐱', name: 'Kucing',     cost: 200, color: '#f0c080', accentColor: '#e08030', earColor: '#f5a060' },
  { type: 'rabbit',  emoji: '🐰', name: 'Kelinci',    cost: 150, color: '#f8f0e8', accentColor: '#ddd0c0', earColor: '#ffbbcc' },
  { type: 'dog',     emoji: '🐶', name: 'Anjing',     cost: 250, color: '#c8a870', accentColor: '#8a6040', earColor: '#b07850' },
  { type: 'chick',   emoji: '🐥', name: 'Anak Ayam',  cost: 100, color: '#ffe050', accentColor: '#ff9010', earColor: '#ffcc00' },
  { type: 'fox',     emoji: '🦊', name: 'Rubah',      cost: 350, color: '#e07030', accentColor: '#804020', earColor: '#f0f0f0' },
  { type: 'panda',   emoji: '🐼', name: 'Panda',      cost: 500, color: '#f5f5f0', accentColor: '#181818', earColor: '#181818' },
  { type: 'hamster', emoji: '🐹', name: 'Hamster',    cost: 120, color: '#f5d8a0', accentColor: '#e0a860', earColor: '#ffccaa' },
  { type: 'sheep',   emoji: '🐑', name: 'Domba',      cost: 180, color: '#f0efeb', accentColor: '#c8c0b0', earColor: '#e8e0d0' },
  { type: 'penguin', emoji: '🐧', name: 'Penguin',    cost: 300, color: '#f2f2f2', accentColor: '#181818', earColor: '#ff9900' },
  { type: 'duck',    emoji: '🦆', name: 'Bebek',      cost: 130, color: '#80c850', accentColor: '#50902a', earColor: '#ffdd00' },
  { type: 'bear',    emoji: '🐻', name: 'Beruang',    cost: 420, color: '#b07840', accentColor: '#7a5020', earColor: '#c89060' },
  { type: 'corgi',   emoji: '🐕', name: 'Corgi',      cost: 280, color: '#f0c050', accentColor: '#d09020', earColor: '#f0c050' },
];

function spawnPetMesh(type) {
  const cat = PET_CATALOG.find((p) => p.type === type) || PET_CATALOG[0];
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.7), new THREE.MeshLambertMaterial({ color: cat.color }));
  body.position.y = 0.22; g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.38), new THREE.MeshLambertMaterial({ color: cat.color }));
  head.position.set(0, 0.58, 0.3); g.add(head);
  if (type === 'cat' || type === 'fox') {
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 4), new THREE.MeshLambertMaterial({ color: cat.earColor }));
    earL.position.set(-0.14, 0.76, 0.3); g.add(earL);
    const earR = earL.clone(); earR.position.x = 0.14; g.add(earR);
    if (type === 'fox') {
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.10, 6, 5), new THREE.MeshLambertMaterial({ color: '#f8f8f8' }));
      tip.position.set(0, 0.05, -0.35); g.add(tip);
    }
  }
  if (type === 'rabbit' || type === 'corgi') {
    const earL = new THREE.Mesh(
      type === 'rabbit' ? new THREE.BoxGeometry(0.1, 0.32, 0.09) : new THREE.BoxGeometry(0.16, 0.2, 0.08),
      new THREE.MeshLambertMaterial({ color: cat.earColor })
    );
    earL.position.set(-0.13, 0.82, 0.3);
    earL.rotation.z = type === 'corgi' ? 0.35 : 0;
    g.add(earL);
    const earR = earL.clone();
    earR.position.x = type === 'corgi' ? 0.13 : 0.1;
    earR.rotation.z = type === 'corgi' ? -0.35 : 0;
    g.add(earR);
  }
  if (type === 'hamster') {
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 5), new THREE.MeshLambertMaterial({ color: cat.earColor }));
    cheekL.position.set(-0.18, 0.57, 0.38); g.add(cheekL);
    const cheekR = cheekL.clone(); cheekR.position.x = 0.18; g.add(cheekR);
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), new THREE.MeshLambertMaterial({ color: cat.earColor }));
    earL.position.set(-0.16, 0.76, 0.28); g.add(earL);
    const earR = earL.clone(); earR.position.x = 0.32; g.add(earR);
  }
  if (type === 'sheep') {
    const fluffGeo = new THREE.SphereGeometry(0.34, 7, 6);
    const fluffMat = new THREE.MeshLambertMaterial({ color: cat.color });
    const fluff = new THREE.Mesh(fluffGeo, fluffMat);
    fluff.position.y = 0.34; g.add(fluff);
    for (let i = 0; i < 5; i++) {
      const bump = new THREE.Mesh(new THREE.SphereGeometry(0.16, 5, 4), fluffMat);
      bump.position.set(Math.sin(i * 1.26) * 0.28, 0.42 + (i % 2) * 0.1, Math.cos(i * 1.26) * 0.22); g.add(bump);
    }
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 5, 4), new THREE.MeshLambertMaterial({ color: cat.earColor }));
    earL.position.set(-0.22, 0.72, 0.26); g.add(earL);
    const earR = earL.clone(); earR.position.x = 0.44; g.add(earR);
  }
  if (type === 'penguin') {
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.24, 7, 6), new THREE.MeshLambertMaterial({ color: '#f2f2f2' }));
    belly.position.set(0, 0.28, 0.28); g.add(belly);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 5), new THREE.MeshLambertMaterial({ color: cat.earColor }));
    beak.rotation.x = -Math.PI / 2;
    beak.position.set(0, 0.58, 0.5); g.add(beak);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.14), new THREE.MeshLambertMaterial({ color: cat.accentColor }));
    wingL.position.set(-0.32, 0.28, 0.06); wingL.rotation.z = 0.3; g.add(wingL);
    const wingR = wingL.clone(); wingR.position.x = 0.32; wingR.rotation.z = -0.3; g.add(wingR);
  }
  if (type === 'duck') {
    const bill = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.14), new THREE.MeshLambertMaterial({ color: cat.earColor }));
    bill.position.set(0, 0.56, 0.52); g.add(bill);
    const tailFeather = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 5), new THREE.MeshLambertMaterial({ color: cat.accentColor }));
    tailFeather.rotation.x = -0.8;
    tailFeather.position.set(0, 0.36, -0.42); g.add(tailFeather);
  }
  if (type === 'bear') {
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), new THREE.MeshLambertMaterial({ color: cat.earColor }));
    earL.position.set(-0.16, 0.76, 0.3); g.add(earL);
    const earR = earL.clone(); earR.position.x = 0.32; g.add(earR);
    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), new THREE.MeshLambertMaterial({ color: cat.earColor }));
    snout.position.set(0, 0.55, 0.48); g.add(snout);
  }
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 5, 5), new THREE.MeshBasicMaterial({ color: type === 'panda' ? '#181818' : '#222222' }));
  eyeL.position.set(-0.1, 0.62, 0.49); g.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.1; g.add(eyeR);
  if (type === 'panda') {
    const patch = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 5), new THREE.MeshLambertMaterial({ color: '#181818' }));
    patch.position.set(-0.14, 0.62, 0.47); g.add(patch);
    const patch2 = patch.clone(); patch2.position.x = 0.14; g.add(patch2);
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), new THREE.MeshLambertMaterial({ color: '#181818' }));
    earL.position.set(-0.19, 0.78, 0.3); g.add(earL);
    const earR = earL.clone(); earR.position.x = 0.38; g.add(earR);
  }
  const player = scene.getObjectByName('playerGroup');
  const px = player ? player.position.x + (Math.random() - 0.5) * 3 : 18 + (Math.random() - 0.5) * 4;
  const pz = player ? player.position.z + (Math.random() - 0.5) * 3 : -18 + (Math.random() - 0.5) * 4;
  g.position.set(px, 0, pz);
  scene.add(g);
  const petData = { group: g, type, time: Math.random() * 6, wanderTarget: new THREE.Vector3(px, 0, pz), wanderTimer: 2 + Math.random() * 3 };
  world.petMeshes.push(petData);
  return petData;
}

function updatePets(delta, elapsed) {
  const player = scene.getObjectByName('playerGroup');
  world.petMeshes.forEach((pet) => {
    pet.time += delta;
    pet.wanderTimer -= delta;
    if (pet.wanderTimer < 0) {
      const px = player ? player.position.x + (Math.random() - 0.5) * 6 : pet.group.position.x + (Math.random() - 0.5) * 4;
      const pz = player ? player.position.z + (Math.random() - 0.5) * 6 : pet.group.position.z + (Math.random() - 0.5) * 4;
      pet.wanderTarget.set(px, 0, pz);
      pet.wanderTimer = 2.5 + Math.random() * 3;
    }
    const dx = pet.wanderTarget.x - pet.group.position.x;
    const dz = pet.wanderTarget.z - pet.group.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 0.2) {
      const speed = 1.6;
      pet.group.position.x += (dx / dist) * speed * delta;
      pet.group.position.z += (dz / dist) * speed * delta;
      pet.group.rotation.y = Math.atan2(dx, dz);
    }
    pet.group.position.y = Math.abs(Math.sin(elapsed * 3 + pet.time)) * 0.04;
  });
}

/* ─── Cloud Animation ────────────────────  */
function updateClouds(delta) {
  world.clouds.forEach((cloud) => {
    cloud.group.position.x += cloud.speed * delta;
    if (cloud.group.position.x > cloud.range) {
      cloud.group.position.x = -cloud.range;
    }
    cloud.group.position.y += Math.sin(clock.elapsedTime * 0.12 + cloud.speed) * 0.012;
  });
}

/* ─── Sky & Star Animation ───────────────  */
function updateSkyAndStars() {
  updateSky(state.minutes);

  const hour = (state.minutes / 60) % 24;
  const sunAngle = ((hour - 6) / 12) * Math.PI;
  const sunR = 240;
  sunOrb.position.set(Math.cos(sunAngle) * sunR, Math.sin(sunAngle) * sunR * 0.72 + 30, 60);
  moonOrb.position.set(-Math.cos(sunAngle) * sunR, Math.abs(Math.sin(sunAngle + Math.PI)) * sunR * 0.6 + 20, -60);

  const nightFactor = Math.max(0, Math.min(1, (hour < 6 ? 1 - hour / 6 : hour > 20 ? (hour - 20) / 4 : 0)));
  stars.material.opacity = nightFactor * 0.92;
  sunOrb.material.color.setHex(hour > 6 && hour < 18 ? 0xffe080 : 0xff6020);
  sunOrb.visible = hour > 4.5 && hour < 19.5;
  moonOrb.visible = hour > 18.5 || hour < 6.5;

  const cloudOpacity = Math.min(0.88, 0.88 - nightFactor * 0.4);
  world.clouds.forEach((c) => c.group.traverse((ch) => { if (ch.isMesh && ch.material) ch.material.opacity = cloudOpacity; }));
}

/* ─── Windmill Animation ─────────────────  */
function updateWindmill(delta) {
  const windSpeed = state.weather === 'Berangin' ? 3.2 : state.weather === 'Berawan' ? 1.8 : 1.2;
  world.windmillParts.forEach((bladeGroup) => {
    bladeGroup.rotation.z += windSpeed * delta;
  });
}

/* ─── Window Light Effect ─────────────────  */
function updateWindowLights() {
  const hour = (state.minutes / 60) % 24;
  const isNight = hour < 7 || hour > 19;
  const intensity = isNight ? 0.8 : 0.0;
  scene.traverse((obj) => {
    if (obj.isMesh && obj.userData.isWindow && obj.material?.emissive) {
      obj.material.emissiveIntensity = THREE.MathUtils.damp(obj.material.emissiveIntensity, intensity, 3, 0.016);
    }
  });
}

/* ─── Glow Orb / Flame Animator ──────────  */
function updateGlowOrbs(elapsed) {
  scene.traverse((obj) => {
    if (obj.userData.glowOrb) {
      const phase = obj.userData.glowPhase || 0;
      obj.material.opacity = 0.45 + Math.sin(elapsed * 2.2 + phase) * 0.35;
      obj.position.y += Math.sin(elapsed * 1.8 + phase) * 0.0008;
    }
    if (obj.userData.flame) {
      const phase = obj.userData.flamePhase || 0;
      obj.material.opacity = 0.75 + Math.sin(elapsed * 14 + phase) * 0.22;
      obj.scale.set(0.85 + Math.sin(elapsed * 11 + phase) * 0.18, 0.9 + Math.sin(elapsed * 13 + phase) * 0.14, 0.85 + Math.sin(elapsed * 12 + phase) * 0.18);
    }
  });
}

/* ─── Ambient Sound Scheduler ────────────  */
function updateAmbientSounds(delta) {
  fireTimer += delta;
  windTimer += delta;
  if (fireTimer > 6 + Math.random() * 4) {
    fireTimer = 0;
    SND.fire();
  }
  if (windTimer > 8 + Math.random() * 6) {
    windTimer = 0;
    SND.wind();
  }
}

/* ─── Interior Exit Hint ─────────────────  */
function updateInteriorHint() {
  if (world.interior && gameHint) {
    gameHint.innerHTML = 'Dalam bangunan — tekan <strong>F</strong> atau <strong>ESC</strong> untuk keluar.';
    gameHint.classList.add('is-visible');
  }
}

/* ─── Main Loop ──────────────────────────  */
function animate() {
  const delta = Math.min(clock.getDelta(), 0.04);
  const elapsed = clock.elapsedTime;

  advanceClock(delta);
  updatePlayer(delta);
  updateCamera(delta);
  if (!world.interior) updateInteractions();
  else updateInteriorHint();
  updateEffects(delta);
  updateAnimals(elapsed, delta);
  updateClouds(delta);
  updateSkyAndStars();
  updateWindmill(delta);
  updateWindowLights();
  updateLightningBolts(delta);
  updateWaterRipples(delta);
  updateGlowOrbs(elapsed);
  updateCrops(delta);
  updatePets(delta, elapsed);
  if (SND.init && clock.elapsedTime > 2) updateAmbientSounds(delta);

  if (flashTimer > 0) {
    flashTimer -= delta;
    if (flashTimer <= 0) {
      flashOverlay.style.transition = 'opacity 0.18s ease';
      flashOverlay.style.opacity = '0';
    }
  }

  if (!renderer.getContext().isContextLost()) {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);

setLoader(90, 'Menyalakan karakter, quest, panel aksi, dan input multi-device…');

selectInteractive('house');
syncHud();
onResize();
updateCamera(0.016);
updateSkyAndStars();
renderer.render(scene, camera);
setLoader(100, 'Farm World siap dimainkan! Selamat bertani 🌾');
setTimeout(hideLoader, 380);
setTimeout(startNewQuest, 2200);
animate();

/* ─── Global Multiplayer Chat ────────────
   Uses SSE for receiving, fetch POST for sending.
   Each visitor gets a unique random name.
─────────────────────────────────────────── */
(function initChat() {
  const NAMES_FIRST = ['Andi','Budi','Citra','Dian','Eko','Fitri','Galih','Hana','Ilham','Joko','Kiki','Lina','Miko','Nita','Oscar','Putri','Raka','Sari','Tono','Umar','Vera','Wahyu','Xena','Yogi','Zahra'];
  const NAMES_FARM = ['PakTani','Petani','Peternak','Petik','Sawah','Ladang','Kebun','Panen','Bertani','Ladang'];
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const playerName = rand(NAMES_FIRST) + '_' + rand(NAMES_FARM) + Math.floor(Math.random() * 90 + 10);

  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('gameChat');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const chatOnlineLabel = document.getElementById('chatOnlineLabel');
  const chatOnlineCount = document.getElementById('chatOnlineCount');
  const chatPlayerName = document.getElementById('chatPlayerName');

  if (chatPlayerName) chatPlayerName.textContent = playerName;

  let unread = 0;
  let isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    chatPanel?.classList.toggle('is-hidden', !isOpen);
    if (isOpen) { unread = 0; updateToggleLabel(); chatMessages?.scrollTo(0, chatMessages.scrollHeight); chatInput?.focus(); }
  }
  function updateToggleLabel() {
    if (chatOnlineCount) chatOnlineCount.textContent = unread > 0 && !isOpen ? `${unread} baru` : chatClients_count;
  }

  chatToggle?.addEventListener('click', toggleChat);
  chatClose?.addEventListener('click', toggleChat);

  let chatClients_count = 0;
  function setOnline(n) {
    chatClients_count = n;
    if (chatOnlineLabel) chatOnlineLabel.textContent = `${n} online`;
    if (chatOnlineCount && !unread) chatOnlineCount.textContent = n;
  }

  function addMessage(msg, isSystem = false) {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = 'chat-msg' + (isSystem ? ' chat-msg--system' : '');
    if (!isSystem) {
      const nameEl = document.createElement('span');
      nameEl.className = 'chat-msg__name';
      nameEl.textContent = msg.name + ':';
      div.appendChild(nameEl);
    }
    const textEl = document.createElement('span');
    textEl.className = 'chat-msg__text';
    textEl.textContent = msg.text;
    div.appendChild(textEl);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (!isOpen) { unread += 1; updateToggleLabel(); }
  }

  function sendMessage() {
    const text = chatInput?.value.trim();
    if (!text) return;
    if (chatInput) chatInput.value = '';
    fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: playerName, text })
    }).catch(() => {});
  }

  chatSend?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

  try {
    const evtSrc = new EventSource('/api/chat/stream');
    evtSrc.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'history') {
          data.messages.forEach(m => addMessage(m));
        } else if (data.type === 'message') {
          addMessage(data.msg);
        } else if (data.type === 'online') {
          setOnline(data.count);
        }
      } catch {}
    };
    evtSrc.onerror = () => {};
    addMessage({ text: `Bergabung sebagai ${playerName}. Ucapkan halo kepada petani lain!` }, true);
  } catch {}
})();
