const loaderBar = document.getElementById('gameLoaderBar');
const loaderCount = document.getElementById('gameLoaderCount');
const loaderText = document.getElementById('gameLoaderText');
const gameLoader = document.getElementById('gameLoader');
const toast = document.getElementById('gameToast');

function setBoot(value, text) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  if (loaderBar) loaderBar.style.width = `${pct}%`;
  if (loaderCount) loaderCount.textContent = String(pct).padStart(3, '0');
  if (loaderText && text) loaderText.textContent = text;
}

function dismissLoader(delay = 600) {
  setTimeout(() => {
    if (gameLoader) gameLoader.classList.add('is-hidden');
  }, delay);
}

setBoot(12, 'Menyalakan renderer, world builder, dan kontrol karakter…');

import('./farm-world.js').then(() => {
  setBoot(100, 'Farm World siap dimainkan.');
  dismissLoader();
}).catch((error) => {
  console.error(error);
  setBoot(100, 'Farm World dimuat dalam mode preview.');
  dismissLoader(800);
  if (toast) {
    toast.innerHTML = '🌾 Farm World — mode preview UI aktif. WebGL tersedia di browser desktop.';
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 5000);
  }
});
