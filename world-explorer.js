import * as THREE from './vendor/three/build/three.module.js';
import { OrbitControls } from './vendor/three/examples/jsm/controls/OrbitControls.js';

const COUNTRY_API = 'https://restcountries.com/v3.1/all?fields=name,flags,cca2,capital,timezones,latlng,currencies,region,population';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const ATLAS_SNAPSHOT_URL = './assets/data/atlas-country-snapshot.json';

const WEATHER_LABELS = {
  0: 'Cerah', 1: 'Cerah tipis', 2: 'Berawan tipis', 3: 'Berawan',
  45: 'Kabut', 48: 'Kabut es', 51: 'Gerimis ringan', 53: 'Gerimis', 55: 'Gerimis lebat',
  61: 'Hujan ringan', 63: 'Hujan', 65: 'Hujan lebat', 71: 'Salju ringan', 73: 'Salju', 75: 'Salju lebat',
  80: 'Hujan lokal', 81: 'Hujan deras lokal', 82: 'Hujan badai', 95: 'Badai petir', 96: 'Petir + hujan es', 99: 'Petir berat'
};

const FALLBACK_COUNTRIES = [
  { name: 'Indonesia', officialName: 'Republic of Indonesia', code: 'ID', capital: 'Jakarta', latlng: [-6.2, 106.8], timezones: ['Asia/Jakarta'], flag: 'https://flagcdn.com/w320/id.png', region: 'Asia', population: 278696200, currencies: 'Indonesian rupiah (IDR)' },
  { name: 'Japan', officialName: 'Japan', code: 'JP', capital: 'Tokyo', latlng: [35.68, 139.69], timezones: ['Asia/Tokyo'], flag: 'https://flagcdn.com/w320/jp.png', region: 'Asia', population: 124516650, currencies: 'Japanese yen (JPY)' },
  { name: 'Australia', officialName: 'Commonwealth of Australia', code: 'AU', capital: 'Canberra', latlng: [-35.28, 149.13], timezones: ['Australia/Sydney'], flag: 'https://flagcdn.com/w320/au.png', region: 'Oseania', population: 26822883, currencies: 'Australian dollar (AUD)' },
  { name: 'Brazil', officialName: 'Federative Republic of Brazil', code: 'BR', capital: 'Brasília', latlng: [-15.79, -47.88], timezones: ['America/Sao_Paulo'], flag: 'https://flagcdn.com/w320/br.png', region: 'Amerika', population: 212559409, currencies: 'Brazilian real (BRL)' },
  { name: 'United States', officialName: 'United States of America', code: 'US', capital: 'Washington, D.C.', latlng: [38.9, -77.03], timezones: ['America/New_York'], flag: 'https://flagcdn.com/w320/us.png', region: 'Amerika', population: 340110988, currencies: 'United States dollar (USD)' },
  { name: 'South Africa', officialName: 'Republic of South Africa', code: 'ZA', capital: 'Pretoria', latlng: [-25.75, 28.19], timezones: ['Africa/Johannesburg'], flag: 'https://flagcdn.com/w320/za.png', region: 'Afrika', population: 63212384, currencies: 'South African rand (ZAR)' },
  { name: 'France', officialName: 'French Republic', code: 'FR', capital: 'Paris', latlng: [48.86, 2.35], timezones: ['Europe/Paris'], flag: 'https://flagcdn.com/w320/fr.png', region: 'Eropa', population: 68373433, currencies: 'Euro (EUR)' }
];

const ATLAS_NAME_ALIASES = {
  'united states of america': 'United States',
  'usa': 'United States',
  'democratic republic of the congo': 'DR Congo',
  'republic of the congo': 'Congo',
  'cabo verde': 'Cape Verde',
  'czech republic': 'Czechia',
  'korea (democratic people\'s republic of)': 'North Korea',
  'korea (republic of)': 'South Korea',
  'republic of korea': 'South Korea',
  'democratic people\'s republic of korea': 'North Korea',
  'timor-leste': 'Timor-Leste',
  'viet nam': 'Vietnam',
  'syrian arab republic': 'Syria',
  'iran (islamic republic of)': 'Iran',
  'russian federation': 'Russia',
  'lao people\'s democratic republic': 'Laos',
  'moldova (republic of)': 'Moldova',
  'bolivia (plurinational state of)': 'Bolivia',
  'venezuela (bolivarian republic of)': 'Venezuela',
  'micronesia (federated states of)': 'Micronesia',
  'türkiye': 'Turkey'
};

function timeoutFetch(url, ms = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function normalizeKey(value = '') {
  const raw = String(value || '').toLowerCase().trim();
  const aliased = ATLAS_NAME_ALIASES[raw] || raw;
  return aliased
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toCurrencyString(input) {
  if (!input) return '—';
  return Object.entries(input).map(([code, entry]) => `${entry.name} (${entry.symbol || code})`).join(', ');
}

function normalizeCountry(item) {
  return {
    name: item?.name?.common || 'Unknown',
    officialName: item?.name?.official || item?.name?.common || 'Unknown',
    code: item?.cca2 || '--',
    capital: Array.isArray(item?.capital) ? item.capital[0] : '—',
    latlng: Array.isArray(item?.latlng) && item.latlng.length >= 2 ? item.latlng : null,
    timezones: Array.isArray(item?.timezones) && item.timezones.length ? item.timezones : ['UTC'],
    flag: item?.flags?.png || item?.flags?.svg || '',
    region: item?.region || '—',
    population: item?.population || 0,
    currencies: toCurrencyString(item?.currencies)
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value || 0);
}

function weatherLabel(code) {
  return WEATHER_LABELS[code] || 'Cuaca berubah';
}

function inferSeason(lat, date = new Date()) {
  const month = date.getUTCMonth() + 1;
  if (Math.abs(lat) < 23.5) return 'Tropis';
  const north = lat >= 0;
  if (north) {
    if (month >= 3 && month <= 5) return 'Semi';
    if (month >= 6 && month <= 8) return 'Panas';
    if (month >= 9 && month <= 11) return 'Gugur';
    return 'Dingin';
  }
  if (month >= 3 && month <= 5) return 'Gugur';
  if (month >= 6 && month <= 8) return 'Dingin';
  if (month >= 9 && month <= 11) return 'Semi';
  return 'Panas';
}

function formatClock(timeZone) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date());
  } catch {
    return new Date().toLocaleString('id-ID');
  }
}

function formatCoords(latlng) {
  if (!Array.isArray(latlng) || latlng.length < 2) return '—';
  return `${latlng[0].toFixed(2)}, ${latlng[1].toFixed(2)}`;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => value * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function vector3ToLatLng(vector) {
  const normalized = vector.clone().normalize();
  const lat = 90 - THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(normalized.y, -1, 1)));
  let lng = THREE.MathUtils.radToDeg(Math.atan2(normalized.z, -normalized.x)) - 180;
  while (lng < -180) lng += 360;
  while (lng > 180) lng -= 360;
  return { lat, lng };
}

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

class WorldExplorer {
  constructor(root) {
    this.root = root;
    this.mode = root.dataset.mode || 'preview';
    this.defaultCountry = root.dataset.defaultCountry || 'Indonesia';
    this.canvas = root.querySelector('[data-world-canvas]');
    this.listEl = root.querySelector('[data-world-list]');
    this.selectedEl = root.querySelector('[data-world-selected]');
    this.statusEl = root.parentElement?.querySelector('[data-world-status]') || document.querySelector('[data-world-status]');
    this.searchEl = root.parentElement?.querySelector('[data-world-search]') || document.querySelector('[data-world-search]');
    this.searchButton = root.parentElement?.querySelector('[data-world-search-button]') || document.querySelector('[data-world-search-button]');
    this.infoToggleButton = null;
    this.countries = [];
    this.hitMarkers = [];
    this.selectedCountry = null;
    this.hoveredMarker = null;
    this.focusTarget = null;
    this.weatherCache = new Map();
    this.atlasSnapshotMap = new Map();
    this.pointer = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this._clockTimer = null;
    this._dragging = false;
    this._pointerDown = null;
  }

  async init() {
    this.setupScene();
    this.bindSearch();
    this.ensureInfoToggle();
    await this.loadAtlasSnapshots();
    await this.loadCountries();
    this.startClock();
    this.animate();
  }

  setupScene() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    this.renderer.setSize(this.canvas.clientWidth || this.canvas.parentElement.clientWidth, this.canvas.clientHeight || this.canvas.parentElement.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.mode === 'full' ? 42 : 46, (this.canvas.clientWidth || 1) / (this.canvas.clientHeight || 1), 0.1, 1000);
    this.camera.position.set(0, this.mode === 'full' ? 2.8 : 2.4, this.mode === 'full' ? 24 : 20);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = this.mode === 'full' ? 14 : 12;
    this.controls.maxDistance = this.mode === 'full' ? 32 : 24;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.4;
    this.controls.target.set(0, 0, 0);
    this.controls.addEventListener('start', () => { this._dragging = true; });
    this.controls.addEventListener('end', () => { setTimeout(() => { this._dragging = false; }, 40); });

    const ambient = new THREE.HemisphereLight('#f7ece3', '#11111c', 1.35);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight('#fff5e0', 2.15);
    sun.position.set(14, 8, 12);
    this.scene.add(sun);

    const texLoader = new THREE.TextureLoader();
    const earthTexture = texLoader.load('./assets/earth_atmos_2048.jpg');
    this.radius = this.mode === 'full' ? 8.6 : 7.6;
    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, this.mode === 'full' ? 72 : 56, this.mode === 'full' ? 72 : 56),
      new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.92, metalness: 0.02 })
    );
    this.scene.add(this.earth);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius * 1.026, 56, 56),
      new THREE.MeshBasicMaterial({ color: '#7ac2ff', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, side: THREE.BackSide })
    );
    this.scene.add(atmosphere);

    const starsGeom = new THREE.BufferGeometry();
    const starCount = this.mode === 'full' ? 1400 : 700;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const r = 60 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.scene.add(new THREE.Points(starsGeom, new THREE.PointsMaterial({ color: '#f7f0de', size: 0.28, transparent: true, opacity: 0.72 })));

    this.hitGroup = new THREE.Group();
    this.earth.add(this.hitGroup);

    const pinMat = new THREE.MeshStandardMaterial({ color: '#f7e2a0', emissive: '#d8a85a', emissiveIntensity: 0.7 });
    const pin = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), pinMat);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.55, 12), new THREE.MeshStandardMaterial({ color: '#d0a25c', emissive: '#89612f', emissiveIntensity: 0.35 }));
    stem.position.y = -0.3;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 10, 24), new THREE.MeshBasicMaterial({ color: '#f4d796', transparent: true, opacity: 0.9 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.62;
    this.activeMarker = new THREE.Group();
    this.activeMarker.add(pin, stem, ring);
    this.activeMarker.visible = false;
    this.earth.add(this.activeMarker);
    this.activeRing = ring;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points = { threshold: 1 };
    this.canvas.addEventListener('pointermove', (event) => this.onPointerMove(event));
    this.canvas.addEventListener('pointerdown', (event) => { this._pointerDown = { x: event.clientX, y: event.clientY }; });
    this.canvas.addEventListener('pointerup', (event) => this.onPointerUp(event));
    window.addEventListener('resize', () => this.onResize());
  }

  ensureInfoToggle() {
    const card = this.root.querySelector('.world-card--atlas-only') || this.root.querySelector('.world-card');
    if (!card) return;
    let button = card.querySelector('[data-world-info-toggle]');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'world-info-toggle';
      button.setAttribute('data-world-info-toggle', '');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Buka atau tutup informasi negara');
      button.innerHTML = '<span></span><span></span>';
      card.appendChild(button);
    }
    this.infoToggleButton = button;
    const sync = () => {
      const open = card.classList.contains('is-info-open');
      button.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    button.addEventListener('click', () => {
      card.classList.toggle('is-info-open');
      sync();
    });
    if (window.innerWidth <= 720) card.classList.remove('is-info-open');
    else card.classList.add('is-info-open');
    sync();
  }

  bindSearch() {
    if (!this.searchEl) return;
    this.searchEl.addEventListener('input', () => this.renderList(this.searchEl.value));
    this.searchEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.executeSearch();
      }
    });
    this.searchButton?.addEventListener('click', () => this.executeSearch());
  }

  findMatches(query = '') {
    const raw = String(query || '').trim();
    if (!raw) return [];
    const q = normalizeKey(raw);
    const score = (country) => {
      const fields = [country.name, country.officialName, country.capital, country.code];
      let best = Infinity;
      for (const field of fields) {
        const key = normalizeKey(field);
        if (key === q) best = Math.min(best, 0);
        else if (key.startsWith(q)) best = Math.min(best, 1);
        else if (key.includes(q)) best = Math.min(best, 2);
      }
      return best;
    };
    return this.countries
      .map((country) => ({ country, score: score(country) }))
      .filter((item) => item.score < Infinity)
      .sort((a, b) => a.score - b.score || a.country.name.localeCompare(b.country.name))
      .map((item) => item.country);
  }

  executeSearch() {
    const query = this.searchEl?.value || '';
    const matches = this.findMatches(query);
    if (!matches.length) {
      this.setStatus(`Negara tidak ditemukan untuk "${String(query).trim()}".`);
      this.renderList(query);
      return;
    }
    const country = matches[0];
    if (this.searchEl) this.searchEl.value = country.name;
    this.selectCountry(country, true);
    this.renderList(country.name);
    setTimeout(() => this.renderList(''), 120);
    this.setStatus(`${country.name} ditemukan dan kamera diarahkan.`);
  }

  async loadAtlasSnapshots() {
    try {
      const response = await fetch(ATLAS_SNAPSHOT_URL);
      if (!response.ok) throw new Error(`atlas ${response.status}`);
      const items = await response.json();
      this.atlasSnapshotMap.clear();
      for (const item of items) {
        this.atlasSnapshotMap.set(normalizeKey(item.name), item);
        this.atlasSnapshotMap.set(normalizeKey(item.capital_pdf), item);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  mergeAtlasSnapshot(country) {
    const exact = this.atlasSnapshotMap.get(normalizeKey(country.name));
    if (exact) return { ...country, atlas: exact };
    const byCapital = this.atlasSnapshotMap.get(normalizeKey(country.capital));
    if (byCapital) return { ...country, atlas: byCapital };
    return country;
  }

  async loadCountries() {
    this.setStatus('Mengambil daftar negara dan atlas…');
    try {
      const response = await timeoutFetch(COUNTRY_API, 10000);
      if (!response.ok) throw new Error(`country ${response.status}`);
      const items = await response.json();
      this.countries = items
        .map(normalizeCountry)
        .filter((item) => Array.isArray(item.latlng))
        .map((item) => this.mergeAtlasSnapshot(item))
        .sort((a, b) => a.name.localeCompare(b.name));
      this.setStatus(`Atlas siap: ${this.countries.length} negara.`);
    } catch (error) {
      console.warn(error);
      this.countries = FALLBACK_COUNTRIES.slice().map((item) => this.mergeAtlasSnapshot(item));
      this.setStatus('Mode fallback aktif: atlas lokal dimuat.');
    }
    this.buildHitMarkers();
    this.renderList('');
    const initial = this.countries.find((item) => item.name.toLowerCase() === this.defaultCountry.toLowerCase()) || this.countries[0];
    if (initial) this.selectCountry(initial, true);
  }

  buildHitMarkers() {
    this.hitGroup.clear();
    this.hitMarkers = [];
    const hitGeo = new THREE.SphereGeometry(this.mode === 'full' ? 0.5 : 0.42, 12, 12);
    const hitMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.002, depthWrite: false });
    this.countries.forEach((country) => {
      const hit = new THREE.Mesh(hitGeo, hitMat.clone());
      const pos = latLngToVector3(country.latlng[0], country.latlng[1], this.radius * 1.03);
      hit.position.copy(pos);
      hit.userData.country = country;
      this.hitGroup.add(hit);
      this.hitMarkers.push(hit);
    });
  }

  renderList(query = '') {
    if (!this.listEl) return;
    const q = String(query || '').trim();
    const filtered = this.findMatches(q).slice(0, q ? 8 : 0);

    if (!q || !filtered.length) {
      this.listEl.innerHTML = '';
      this.listEl.classList.remove('is-visible');
      return;
    }

    this.listEl.innerHTML = filtered.map((country) => `
      <button class="world-list__item ${this.selectedCountry?.code === country.code ? 'is-active' : ''}" data-country-code="${country.code}" type="button">
        <img src="${country.flag}" alt="Bendera ${country.name}" loading="lazy" referrerpolicy="no-referrer">
        <span>
          <strong>${country.name}</strong>
          <small>${country.capital} · ${country.code}</small>
        </span>
      </button>
    `).join('');
    this.listEl.classList.add('is-visible');
    this.listEl.querySelectorAll('[data-country-code]').forEach((button) => {
      button.addEventListener('click', () => {
        const country = this.countries.find((item) => item.code === button.getAttribute('data-country-code'));
        if (country) {
          this.selectCountry(country, true);
          if (this.searchEl) this.searchEl.value = country.name;
          this.renderList('');
        }
      });
    });
  }

  setStatus(message) {
    if (this.statusEl) this.statusEl.textContent = message;
  }

  async selectCountry(country, focus = false) {
    this.selectedCountry = country;
    this.renderList(this.searchEl?.value.trim() || '');
    const card = this.root.querySelector('.world-card--atlas-only') || this.root.querySelector('.world-card');
    if (card && window.innerWidth <= 720) { card.classList.add('is-info-open'); this.infoToggleButton?.classList.add('is-open'); this.infoToggleButton?.setAttribute('aria-expanded', 'true'); }
    this.updateActiveMarker(country);
    if (focus) this.focusCountry(country);
    this.renderSelectedPanel(country, null, true);
    const weather = await this.loadWeather(country);
    this.renderSelectedPanel(country, weather, false);
  }

  updateActiveMarker(country) {
    const pos = latLngToVector3(country.latlng[0], country.latlng[1], this.radius * 1.045);
    this.activeMarker.position.copy(pos);
    this.activeMarker.lookAt(new THREE.Vector3(0, 0, 0));
    this.activeMarker.visible = true;
  }

  focusCountry(country) {
    const markerPos = latLngToVector3(country.latlng[0], country.latlng[1], this.radius * 1.045);
    const cameraPos = markerPos.clone().normalize().multiplyScalar(this.mode === 'full' ? this.radius * 2.16 : this.radius * 2.32).add(new THREE.Vector3(0, 1.15, 0));
    this.focusTarget = { camera: cameraPos, target: new THREE.Vector3(0, 0, 0) };
  }

  async loadWeather(country) {
    const key = country.code;
    if (this.weatherCache.has(key)) return this.weatherCache.get(key);
    this.setStatus(`Mengambil cuaca untuk ${country.name}…`);
    try {
      const timezone = country.timezones[0] || 'auto';
      const url = `${WEATHER_API}?latitude=${country.latlng[0]}&longitude=${country.latlng[1]}&current=temperature_2m,weather_code,is_day,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=${encodeURIComponent(timezone)}`;
      const response = await timeoutFetch(url, 10000);
      if (!response.ok) throw new Error(`weather ${response.status}`);
      const data = await response.json();
      const weather = {
        temperature: data?.current?.temperature_2m,
        code: data?.current?.weather_code,
        wind: data?.current?.wind_speed_10m,
        isDay: Boolean(data?.current?.is_day),
        min: data?.daily?.temperature_2m_min?.[0],
        max: data?.daily?.temperature_2m_max?.[0]
      };
      this.weatherCache.set(key, weather);
      this.setStatus(`Informasi ${country.name} siap.`);
      return weather;
    } catch (error) {
      console.warn(error);
      this.setStatus(`Cuaca live gagal untuk ${country.name}.`);
      return null;
    }
  }

  renderSelectedPanel(country, weather, loading) {
    if (!this.selectedEl) return;
    const timezone = country.timezones[0] || 'UTC';
    const season = inferSeason(country.latlng[0]);
    const atlas = country.atlas || null;
    this.selectedEl.innerHTML = `
      <div class="world-selected__flag"><img src="${country.flag}" alt="Bendera ${country.name}" referrerpolicy="no-referrer"></div>
      <div class="world-selected__body">
        <div class="eyebrow">Selected country</div>
        <h3>${country.name}</h3>
        <div class="world-selected__grid">
          <div><span>Nama resmi</span><strong>${country.officialName || country.name}</strong></div>
          <div><span>Kode</span><strong>${country.code}</strong></div>
          <div><span>Ibu kota</span><strong>${country.capital}</strong></div>
          <div><span>Kawasan</span><strong>${atlas?.region_pdf || country.region}</strong></div>
          <div><span>Mata uang</span><strong>${atlas?.currency_snapshot || country.currencies}</strong></div>
          <div><span>Populasi</span><strong>${formatNumber(country.population)}</strong></div>
          <div><span>Jam lokal</span><strong data-live-clock>${formatClock(timezone)}</strong></div>
          <div><span>Musim</span><strong>${season}</strong></div>
          <div><span>Cuaca</span><strong>${loading ? 'Loading…' : weather ? weatherLabel(weather.code) : 'Tidak tersedia'}</strong></div>
          <div><span>Suhu</span><strong>${loading ? '—' : weather?.temperature != null ? `${weather.temperature}°C` : '—'}</strong></div>
          <div><span>Angin</span><strong>${loading ? '—' : weather?.wind != null ? `${weather.wind} km/j` : '—'}</strong></div>
          <div><span>Hari / malam</span><strong>${loading ? '—' : weather ? (weather.isDay ? 'Siang' : 'Malam') : '—'}</strong></div>
          <div><span>Koordinat</span><strong>${formatCoords(country.latlng)}</strong></div>
          <div><span>Zona waktu</span><strong>${timezone}</strong></div>
          <div><span>Arah jalan</span><strong>${atlas?.road_side || '—'}</strong></div>
          <div><span>1 unit ≈ IDR</span><strong>${atlas?.unit_to_idr_snapshot || '—'}</strong></div>
          <div><span>Sewa 1 kamar</span><strong>${atlas?.housing_snapshot || '—'}</strong></div>
          <div><span>≈ Rupiah/bulan</span><strong>${atlas?.housing_idr_snapshot || '—'}</strong></div>
          <div><span>Suhu min / max</span><strong>${loading ? '—' : weather?.min != null && weather?.max != null ? `${weather.min}° / ${weather.max}°` : '—'}</strong></div>
        </div>
        <div class="world-selected__footer">
          <a class="ghost-button magnetic" href="docs/atlas-negara.pdf" target="_blank" rel="noreferrer">Open atlas PDF</a>
        </div>
      </div>
    `;
  }

  startClock() {
    clearInterval(this._clockTimer);
    this._clockTimer = setInterval(() => {
      if (!this.selectedCountry || !this.selectedEl) return;
      const clockEl = this.selectedEl.querySelector('[data-live-clock]');
      if (clockEl) clockEl.textContent = formatClock(this.selectedCountry.timezones[0] || 'UTC');
    }, 1000);
  }

  getHit(event) {
    if (!this.hitMarkers.length) return null;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObjects(this.hitMarkers, false)[0]?.object || null;
  }

  getEarthIntersection(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObject(this.earth, false)[0] || null;
  }

  findNearestCountry(lat, lng) {
    let nearest = null;
    let bestDistance = Infinity;
    for (const country of this.countries) {
      if (!country.latlng) continue;
      const distance = haversineKm(lat, lng, country.latlng[0], country.latlng[1]);
      if (distance < bestDistance) {
        bestDistance = distance;
        nearest = country;
      }
    }
    return bestDistance <= 3200 ? nearest : null;
  }

  onPointerMove(event) {
    const hit = this.getHit(event);
    let candidate = null;
    if (hit) candidate = hit.userData.country;
    else {
      const earthHit = this.getEarthIntersection(event);
      if (earthHit) {
        const pointOnEarth = this.earth.worldToLocal(earthHit.point.clone());
        const ll = vector3ToLatLng(pointOnEarth);
        candidate = this.findNearestCountry(ll.lat, ll.lng);
      }
    }
    this.canvas.style.cursor = candidate ? 'pointer' : 'grab';
    this.hoveredMarker = hit || null;
    if (candidate) this.setStatus(`${candidate.name} siap dipilih.`);
  }

  onPointerUp(event) {
    if (!this._pointerDown) return;
    const deltaX = Math.abs(event.clientX - this._pointerDown.x);
    const deltaY = Math.abs(event.clientY - this._pointerDown.y);
    this._pointerDown = null;
    if (this._dragging || deltaX > 10 || deltaY > 10) return;
    const hit = this.getHit(event);
    if (hit) {
      this.selectCountry(hit.userData.country, true);
      return;
    }
    const earthHit = this.getEarthIntersection(event);
    if (!earthHit) return;
    const pointOnEarth = this.earth.worldToLocal(earthHit.point.clone());
    const { lat, lng } = vector3ToLatLng(pointOnEarth);
    const nearest = this.findNearestCountry(lat, lng);
    if (nearest) this.selectCountry(nearest, true);
  }

  onResize() {
    const card = this.root.querySelector('.world-card--atlas-only') || this.root.querySelector('.world-card');
    if (card) {
      if (window.innerWidth > 720) card.classList.add('is-info-open');
      this.infoToggleButton?.classList.toggle('is-open', card.classList.contains('is-info-open'));
      this.infoToggleButton?.setAttribute('aria-expanded', card.classList.contains('is-info-open') ? 'true' : 'false');
    }
    if (!this.renderer) return;
    const width = this.canvas.clientWidth || this.canvas.parentElement.clientWidth || 1;
    const height = this.canvas.clientHeight || this.canvas.parentElement.clientHeight || 1;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate() {
    const tick = () => {
      const delta = this.clock.getDelta();
      if (this.focusTarget) {
        this.camera.position.lerp(this.focusTarget.camera, Math.min(1, delta * 2));
        if (this.camera.position.distanceTo(this.focusTarget.camera) < 0.05) this.focusTarget = null;
      }
      if (!this.selectedCountry) this.earth.rotation.y += delta * (this.mode === 'full' ? 0.01 : 0.03);
      if (this.activeRing) this.activeRing.scale.setScalar(1 + Math.sin(performance.now() * 0.004) * 0.08);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    };
    tick();
  }
}

for (const root of document.querySelectorAll('.world-explorer')) {
  try {
    const explorer = new WorldExplorer(root);
    explorer.init();
  } catch (error) {
    console.error(error);
    const status = root.parentElement?.querySelector('[data-world-status]') || document.querySelector('[data-world-status]');
    if (status) status.textContent = 'Globe gagal dibuat di browser ini.';
  }
}
