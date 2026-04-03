(() => {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastToggleAt = 0;

  function closeMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu(force) {
    if (!mobileMenu || !menuToggle) return;
    const opened = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', opened);
    menuToggle.classList.toggle('is-open', opened);
    menuToggle.setAttribute('aria-expanded', String(opened));
    mobileMenu.setAttribute('aria-hidden', String(!opened));
    document.body.classList.toggle('menu-open', opened);
    lastToggleAt = Date.now();
  }

  if (menuToggle && mobileMenu && menuToggle.dataset.menuBound !== '1') {
    menuToggle.dataset.menuBound = '1';
    const handleToggle = (event) => {
      if (Date.now() - lastToggleAt < 220) return;
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    };
    menuToggle.addEventListener('click', handleToggle);
    menuToggle.addEventListener('pointerup', handleToggle);
    menuToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') handleToggle(event);
    });
    mobileMenu.addEventListener('click', (event) => event.stopPropagation());
    document.addEventListener('click', (event) => {
      if (!mobileMenu.classList.contains('is-open')) return;
      if (Date.now() - lastToggleAt < 250) return;
      if (event.target === menuToggle || menuToggle.contains(event.target)) return;
      if (mobileMenu.contains(event.target)) return;
      closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  function ensureMobileMenuUtilities() {
    if (!mobileMenu) return;
    let wrap = mobileMenu.querySelector('.mobile-menu__utilities');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'mobile-menu__utilities';
      mobileMenu.appendChild(wrap);
    }
    const tools = document.querySelector('.header-tools');
    if (!tools) {
      wrap.innerHTML = '';
      return;
    }
    const parts = [];
    const children = Array.from(tools.children).filter((item) => !item.classList.contains('menu-toggle'));
    const rendered = children.map((item, index) => {
      const label = (item.textContent || '').trim();
      if (!label) return '';
      if (item.tagName === 'A') {
        const href = item.getAttribute('href') || '#';
        return `<a class="mobile-menu__action" href="${href}">${label}</a>`;
      }
      if (item.tagName === 'BUTTON') {
        return `<button class="mobile-menu__action" type="button" data-mobile-proxy="${index}">${label}</button>`;
      }
      return `<div class="mobile-menu__badge">${label}</div>`;
    }).filter(Boolean).join('');
    if (!rendered) {
      wrap.innerHTML = '';
      return;
    }
    wrap.innerHTML = `<div class="mobile-menu__title">Quick access</div><div class="mobile-menu__actions">${rendered}</div>`;
    wrap.querySelectorAll('[data-mobile-proxy]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.mobileProxy || '-1');
        const target = children[index];
        closeMenu();
        target?.click();
      });
    });
    wrap.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  }

  ensureMobileMenuUtilities();
  const headerTools = document.querySelector('.header-tools');
  if (headerTools && !headerTools.dataset.mobileMirrorBound) {
    headerTools.dataset.mobileMirrorBound = '1';
    const rebuildMobileMenuUtilities = () => window.requestAnimationFrame(ensureMobileMenuUtilities);
    new MutationObserver(rebuildMobileMenuUtilities).observe(headerTools, { childList: true, subtree: true, characterData: true });
    window.addEventListener('pageshow', rebuildMobileMenuUtilities);
  }

const pulseboardUI = window.PulseboardUI || (window.PulseboardUI = {});
const COOKIE_CONSENT_KEY = 'pulseboard-cookie-consent-v1';
const COOKIE_SKIP_KEY = 'pulseboard-cookie-banner-skipped';

function escapeUiHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function readCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCookieConsent(choice) {
  const payload = {
    choice,
    updatedAt: new Date().toISOString(),
    analytics: choice === 'accept',
    personalization: choice === 'accept'
  };
  try { localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload)); } catch {}
  try { sessionStorage.removeItem(COOKIE_SKIP_KEY); } catch {}
  document.dispatchEvent(new CustomEvent('pulseboard:cookie-consent-changed', { detail: payload }));
  return payload;
}

function skipCookieConsentForSession() {
  try { sessionStorage.setItem(COOKIE_SKIP_KEY, '1'); } catch {}
}

function wasCookieBannerSkipped() {
  try { return sessionStorage.getItem(COOKIE_SKIP_KEY) === '1'; } catch { return false; }
}

function hasAnalyticsConsent() {
  return readCookieConsent()?.choice === 'accept';
}

pulseboardUI.getCookieConsent = readCookieConsent;
pulseboardUI.openCookiePreferences = function openCookiePreferences() {
  const existing = document.querySelector('.cookie-banner');
  if (existing) {
    existing.classList.add('is-visible');
    existing.querySelector('.cookie-banner__accept, .cookie-banner__reject, .cookie-banner__skip')?.focus();
    return;
  }
  ensureCookieBanner(true);
};

if (typeof pulseboardUI.requestDeveloperToken !== 'function') {
  pulseboardUI.requestDeveloperToken = function requestDeveloperToken(options = {}) {
    const settings = {
      title: options.title || 'Developer Edit',
      subtitle: options.subtitle || 'Masukkan admin token developer untuk membuka area edit permanen.',
      label: options.label || 'Admin token developer',
      placeholder: options.placeholder || 'Masukkan token admin',
      submitText: options.submitText || 'Masuk ke Developer Edit',
      cancelText: options.cancelText || 'Batal',
      helperBadges: Array.isArray(options.helperBadges) && options.helperBadges.length
        ? options.helperBadges
        : ['Secure access', 'Session tersimpan', 'Validasi real-time'],
      validate: typeof options.validate === 'function' ? options.validate : null,
      initialValue: typeof options.initialValue === 'string' ? options.initialValue : ''
    };

    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'dev-token-modal';
      const safeValue = settings.initialValue.replace(/[&<>"]/g, '');
      overlay.innerHTML = `
        <div class="dev-token-modal__backdrop" data-close="1"></div>
        <div class="dev-token-modal__dialog panel" role="dialog" aria-modal="true" aria-labelledby="devTokenTitle">
          <div class="dev-token-modal__halo" aria-hidden="true"></div>
          <div class="dev-token-modal__spark dev-token-modal__spark--one" aria-hidden="true"></div>
          <div class="dev-token-modal__spark dev-token-modal__spark--two" aria-hidden="true"></div>
          <div class="dev-token-modal__eyebrow">Aegis Access</div>
          <h2 id="devTokenTitle">${settings.title}</h2>
          <p class="dev-token-modal__subtitle">${settings.subtitle}</p>
          <div class="dev-token-modal__badges">${settings.helperBadges.map((item) => `<span>${item}</span>`).join('')}</div>
          <label class="dev-token-modal__label" for="devTokenInput">${settings.label}</label>
          <div class="dev-token-modal__field">
            <span class="dev-token-modal__field-icon" aria-hidden="true">✦</span>
            <input id="devTokenInput" class="dev-token-modal__input" type="password" placeholder="${settings.placeholder}" autocomplete="current-password" value="${safeValue}" />
            <button class="dev-token-modal__toggle" type="button">Tampilkan</button>
          </div>
          <p class="dev-token-modal__hint">Token diverifikasi ke server proyek sebelum halaman edit dibuka.</p>
          <p class="dev-token-modal__error" hidden></p>
          <div class="dev-token-modal__actions">
            <button class="ghost-button dev-token-modal__cancel" type="button">${settings.cancelText}</button>
            <button class="button dev-token-modal__submit" type="button">${settings.submitText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.classList.add('modal-open');

      const input = overlay.querySelector('.dev-token-modal__input');
      const submitButton = overlay.querySelector('.dev-token-modal__submit');
      const cancelButton = overlay.querySelector('.dev-token-modal__cancel');
      const toggleButton = overlay.querySelector('.dev-token-modal__toggle');
      const errorBox = overlay.querySelector('.dev-token-modal__error');
      const dialog = overlay.querySelector('.dev-token-modal__dialog');
      let settled = false;

      const cleanup = () => {
        overlay.remove();
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', onKeydown, true);
      };

      const finish = (value = '') => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(value);
      };

      const setError = (message = '') => {
        if (!message) {
          errorBox.hidden = true;
          errorBox.textContent = '';
          dialog.classList.remove('has-error');
          return;
        }
        errorBox.hidden = false;
        errorBox.textContent = message;
        dialog.classList.add('has-error');
      };

      const setBusy = (busy) => {
        overlay.classList.toggle('is-busy', busy);
        submitButton.disabled = busy;
        cancelButton.disabled = busy;
        input.disabled = busy;
        toggleButton.disabled = busy;
        submitButton.textContent = busy ? 'Memverifikasi…' : settings.submitText;
      };

      const submit = async () => {
        const value = (input.value || '').trim();
        if (!value) {
          setError('Admin token wajib diisi.');
          input.focus();
          return;
        }
        setError('');
        if (!settings.validate) {
          finish(value);
          return;
        }
        try {
          setBusy(true);
          await settings.validate(value);
          finish(value);
        } catch (error) {
          setBusy(false);
          setError(error?.message || 'Admin token tidak valid.');
          input.focus();
          input.select();
        }
      };

      const onKeydown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          finish('');
          return;
        }
        if (event.key === 'Enter' && document.activeElement !== toggleButton) {
          event.preventDefault();
          submit();
        }
      };

      overlay.addEventListener('click', (event) => {
        if (event.target.dataset.close === '1') finish('');
      });
      cancelButton.addEventListener('click', () => finish(''));
      submitButton.addEventListener('click', submit);
      toggleButton.addEventListener('click', () => {
        const masked = input.type === 'password';
        input.type = masked ? 'text' : 'password';
        toggleButton.textContent = masked ? 'Sembunyikan' : 'Tampilkan';
      });
      input.addEventListener('input', () => {
        if (!errorBox.hidden) setError('');
      });
      document.addEventListener('keydown', onKeydown, true);
      requestAnimationFrame(() => overlay.classList.add('is-open'));
      setTimeout(() => {
        input.focus();
        if (input.value) input.select();
      }, 20);
    });
  };
}

  const devButton = document.querySelector('[data-dev-edit-button]');
  const page = document.body.dataset.page || '';
  const pageToCategory = {
    home: 'home',
    plants: 'tanaman',
    animals: 'hewan',
    tech: 'teknologi',
    portfolio: 'studio',
    world: 'world',
    news: 'news',
    commerce: 'commerce',
    azka: 'azka'
  };
  if (devButton && devButton.dataset.devBound !== '1') {
    devButton.dataset.devBound = '1';
    devButton.addEventListener('click', async () => {
      const token = await pulseboardUI.requestDeveloperToken({
        title: 'Developer Edit',
        subtitle: 'Masukkan admin token untuk membuka manager dan menyimpan perubahan permanen ke server proyek.',
        submitText: 'Masuk ke Manager',
        validate: async (value) => {
          const res = await fetch('/api/auth/check', { headers: { Authorization: `Bearer ${value}` }, cache: 'no-store' });
          if (!res.ok) throw new Error('Token tidak valid.');
        }
      });
      if (!token) return;
      sessionStorage.setItem('pulseboard-admin-token', token);
      const params = new URLSearchParams();
      const category = pageToCategory[page] || '';
      if (category) params.set('category', category);
      window.location.href = `manager.html${params.toString() ? `?${params.toString()}` : ''}`;
    });
  }


  function mergeIntroLocalOverrides(items) {
    try {
      const overrides = JSON.parse(localStorage.getItem('pulseboard-youtube-cards-overrides-v1') || '{}');
      return (Array.isArray(items) ? items : []).map((item) => {
        const override = overrides[item.id];
        return override ? { ...item, ...override } : item;
      });
    } catch {
      return Array.isArray(items) ? items : [];
    }
  }

  const introPageToCategory = {
    home: 'home',
    world: 'world',
    plants: 'tanaman',
    animals: 'hewan',
    tech: 'teknologi',
    portfolio: 'studio',
    news: 'news',
    commerce: 'commerce',
    azka: 'azka'
  };

  function escapeIntroHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function buildOpeningReelEmbed(videoId, options = {}) {
    const id = encodeURIComponent(String(videoId || '').trim());
    const muted = options.muted !== false;
    const controls = muted ? '0' : '1';
    const fs = muted ? '0' : '1';
    const origin = encodeURIComponent(window.location.origin || 'http://localhost');
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=${muted ? '1' : '0'}&controls=${controls}&loop=1&playlist=${id}&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=${fs}&disablekb=0&enablejsapi=1&origin=${origin}`;
  }

  function postOpeningReelCommand(frame, func, args = []) {
    if (!frame?.contentWindow) return;
    try {
      frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
    } catch {}
  }

  async function loadOpeningReelRegistry() {
    try {
      const response = await fetch('/api/items', { cache: 'no-store' });
      if (!response.ok) throw new Error('api');
      const payload = await response.json();
      return mergeIntroLocalOverrides(Array.isArray(payload.items) ? payload.items : []);
    } catch {
      try {
        const response = await fetch('./db/items.json', { cache: 'no-store' });
        const payload = await response.json();
        return mergeIntroLocalOverrides(Array.isArray(payload.items) ? payload.items : []);
      } catch {
        return [];
      }
    }
  }

  function resolveOpeningReel(pageKey, items) {
    const category = introPageToCategory[pageKey] || '';
    return (Array.isArray(items) ? items : []).find((item) => item.isOpeningReel && item.category === category)
      || (Array.isArray(items) ? items : []).find((item) => item.id === `opening-reel-${category}`)
      || null;
  }

  function buildCinematicMediaMarkup(config, reel, options = {}) {
    const muted = options.muted !== false;
    if (reel?.videoId) {
      return `
        <iframe class="cinematic-intro__embed" data-reel-video-id="${escapeIntroHtml(reel.videoId)}" data-reel-muted="${muted ? '1' : '0'}" src="${buildOpeningReelEmbed(reel.videoId, { muted })}" title="${escapeIntroHtml(reel.name || config.title)}" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>
        <img class="cinematic-intro__poster" src="${escapeIntroHtml(config.poster)}" alt="${escapeIntroHtml(reel.name || config.title)}" loading="lazy">
        <div class="cinematic-intro__video-fallback"></div>
      `;
    }
    if (config?.localVideo) {
      return `
        <video class="cinematic-intro__video" src="${escapeIntroHtml(config.localVideo)}" poster="${escapeIntroHtml(config.poster)}" autoplay loop playsinline muted preload="metadata"></video>
        <img class="cinematic-intro__poster" src="${escapeIntroHtml(config.poster)}" alt="${escapeIntroHtml(config.title)}" loading="lazy">
        <div class="cinematic-intro__video-fallback"></div>
      `;
    }
    return `
      <img class="cinematic-intro__poster cinematic-intro__poster--static" src="${escapeIntroHtml(config.poster)}" alt="${escapeIntroHtml(config.title)}" loading="lazy">
      <div class="cinematic-intro__video-fallback"></div>
    `;
  }

  if (typeof pulseboardUI.confirm !== 'function') {
    pulseboardUI.confirm = function confirmModal(options = {}) {
      const settings = {
        title: options.title || 'Konfirmasi tindakan',
        message: options.message || 'Apakah kamu yakin ingin melanjutkan?',
        confirmText: options.confirmText || 'Lanjutkan',
        cancelText: options.cancelText || 'Batal',
        tone: options.tone === 'danger' ? 'danger' : 'default',
        badge: options.badge || (options.tone === 'danger' ? 'Permanent action' : 'PulseBoard notice'),
        details: Array.isArray(options.details) ? options.details : []
      };

      return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'pulse-trigger-modal';
        overlay.innerHTML = `
          <div class="pulse-trigger-modal__backdrop" data-close="1"></div>
          <div class="pulse-trigger-modal__dialog pulse-trigger-modal__dialog--${settings.tone}" role="alertdialog" aria-modal="true" aria-labelledby="pulseTriggerTitle" aria-describedby="pulseTriggerMessage">
            <div class="pulse-trigger-modal__glow" aria-hidden="true"></div>
            <div class="pulse-trigger-modal__spark pulse-trigger-modal__spark--one" aria-hidden="true"></div>
            <div class="pulse-trigger-modal__spark pulse-trigger-modal__spark--two" aria-hidden="true"></div>
            <div class="pulse-trigger-modal__badge">${escapeUiHtml(settings.badge)}</div>
            <h3 id="pulseTriggerTitle">${escapeUiHtml(settings.title)}</h3>
            <p class="pulse-trigger-modal__message" id="pulseTriggerMessage">${escapeUiHtml(settings.message)}</p>
            ${settings.details.length ? `<div class="pulse-trigger-modal__chips">${settings.details.map((item) => `<span>${escapeUiHtml(item)}</span>`).join('')}</div>` : ''}
            <div class="pulse-trigger-modal__actions">
              <button class="ghost-button pulse-trigger-modal__cancel" type="button">${escapeUiHtml(settings.cancelText)}</button>
              <button class="button pulse-trigger-modal__confirm" type="button">${escapeUiHtml(settings.confirmText)}</button>
            </div>
          </div>
        `;

        document.body.appendChild(overlay);
        document.body.classList.add('modal-open');
        const cancelButton = overlay.querySelector('.pulse-trigger-modal__cancel');
        const confirmButton = overlay.querySelector('.pulse-trigger-modal__confirm');
        let settled = false;

        const cleanup = () => {
          overlay.remove();
          document.body.classList.remove('modal-open');
          document.removeEventListener('keydown', onKeydown, true);
        };
        const finish = (value) => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(Boolean(value));
        };
        const onKeydown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            finish(false);
            return;
          }
          if (event.key === 'Enter' && document.activeElement !== cancelButton) {
            event.preventDefault();
            finish(true);
          }
        };

        overlay.addEventListener('click', (event) => {
          if (event.target instanceof Element && event.target.closest('[data-close="1"]')) finish(false);
        });
        cancelButton.addEventListener('click', () => finish(false));
        confirmButton.addEventListener('click', () => finish(true));
        document.addEventListener('keydown', onKeydown, true);
        requestAnimationFrame(() => overlay.classList.add('is-open'));
        setTimeout(() => confirmButton.focus(), 20);
      });
    };
  }

  if (typeof pulseboardUI.alert !== 'function') {
    pulseboardUI.alert = function alertModal(options = {}) {
      return pulseboardUI.confirm({
        ...options,
        cancelText: '',
        confirmText: options.confirmText || 'Tutup'
      });
    };
  }

  function ensureCookieBadgeButton() {
    let button = document.querySelector('.cookie-settings-fab');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'cookie-settings-fab';
      button.innerHTML = '<span aria-hidden="true">◌</span><span>Cookies</span>';
      button.addEventListener('click', () => pulseboardUI.openCookiePreferences());
      document.body.appendChild(button);
    }
    const consent = readCookieConsent();
    button.dataset.state = consent?.choice || 'unset';
    button.setAttribute('aria-label', 'Buka pengaturan cookies');
  }

  function ensureCookieBanner(forceOpen = false) {
    ensureCookieBadgeButton();
    if (!forceOpen && (readCookieConsent() || wasCookieBannerSkipped())) return;
    let banner = document.querySelector('.cookie-banner');
    if (!banner) {
      banner = document.createElement('section');
      banner.className = 'cookie-banner';
      banner.setAttribute('aria-live', 'polite');
      banner.innerHTML = `
        <div class="cookie-banner__halo" aria-hidden="true"></div>
        <div class="cookie-banner__eyebrow">PulseBoard privacy notice</div>
        <h3>Cookies dipakai agar portal tetap stabil, preferensi tersimpan, dan video atau interaksi terasa lebih mulus.</h3>
        <p>Cookie esensial dipakai untuk fungsi inti seperti akses editor, bahasa, dan penyimpanan preferensi dasar. Cookie opsional dipakai untuk analytics first-party dan personalisasi pengalaman. Kamu bisa membaca detailnya di <a href="privacy.html">Privacy Policy</a> dan <a href="terms.html">Terms of Use</a>.</p>
        <div class="cookie-banner__chips">
          <span>Essential</span>
          <span>Analytics optional</span>
          <span>Preferences</span>
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="button cookie-banner__accept">Accept all cookies</button>
          <button type="button" class="ghost-button cookie-banner__reject">Reject</button>
          <button type="button" class="ghost-button cookie-banner__skip">Skip</button>
        </div>
      `;
      document.body.appendChild(banner);
      banner.querySelector('.cookie-banner__accept')?.addEventListener('click', () => {
        writeCookieConsent('accept');
        banner.classList.remove('is-visible');
        ensureCookieBadgeButton();
        ensureAnalyticsTracker();
      });
      banner.querySelector('.cookie-banner__reject')?.addEventListener('click', () => {
        writeCookieConsent('reject');
        banner.classList.remove('is-visible');
        ensureCookieBadgeButton();
      });
      banner.querySelector('.cookie-banner__skip')?.addEventListener('click', () => {
        skipCookieConsentForSession();
        banner.classList.remove('is-visible');
        ensureCookieBadgeButton();
      });
    }
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  }

  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-open-cookie-banner]') : null;
    if (!button) return;
    event.preventDefault();
    pulseboardUI.openCookiePreferences();
  });

  function buildFooterSocialMarkup(social) {
    const name = escapeIntroHtml(social?.name || 'Social');
    const href = escapeIntroHtml(social?.href || '#');
    const rawIcon = String(social?.icon || '').trim();
    const iconInner = /^(https?:)?\/\//i.test(rawIcon) || rawIcon.startsWith('data:image/')
      ? `<img src="${escapeIntroHtml(rawIcon)}" alt="${name}" class="social-icon__image">`
      : escapeIntroHtml(rawIcon || name.slice(0, 2).toUpperCase());
    return `<a href="${href}" target="_blank" rel="noreferrer" aria-label="${name}"><span class="social-icon social-icon--generic">${iconInner}</span><span>${name}</span></a>`;
  }

  async function loadFooterSocials() {
    try {
      const response = await fetch('/api/footer', { cache: 'no-store' });
      if (!response.ok) throw new Error('api');
      const payload = await response.json();
      return Array.isArray(payload.socials) ? payload.socials : [];
    } catch {
      try {
        const response = await fetch('./db/footer.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('db');
        const payload = await response.json();
        return Array.isArray(payload.socials) ? payload.socials : [];
      } catch {
        return [];
      }
    }
  }

  function setIntroAudioState(intro, muted) {
    const frame = intro?.querySelector('.cinematic-intro__embed');
    const video = intro?.querySelector('.cinematic-intro__video');
    const toggle = intro?.querySelector('[data-intro-audio-toggle]');
    if (!toggle) return;
    if (frame?.dataset?.reelVideoId) {
      frame.src = buildOpeningReelEmbed(frame.dataset.reelVideoId, { muted });
      frame.dataset.reelMuted = muted ? '1' : '0';
      toggle.hidden = false;
      toggle.dataset.muted = muted ? '1' : '0';
      toggle.setAttribute('aria-pressed', String(!muted));
      toggle.innerHTML = `<span aria-hidden="true">${muted ? '🔇' : '🔊'}</span><span>${muted ? 'Audio off' : 'Audio on'}</span>`;
      return;
    }
    if (video) {
      video.muted = muted;
      video.defaultMuted = muted;
      const playPromise = video.play?.();
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
      toggle.hidden = false;
      toggle.dataset.muted = muted ? '1' : '0';
      toggle.setAttribute('aria-pressed', String(!muted));
      toggle.innerHTML = `<span aria-hidden="true">${muted ? '🔇' : '🔊'}</span><span>${muted ? 'Audio off' : 'Audio on'}</span>`;
      return;
    }
    toggle.hidden = true;
  }

  function bindIntroAudioToggle(intro) {
    const toggle = intro?.querySelector('[data-intro-audio-toggle]');
    if (!toggle || toggle.dataset.bound === '1') return;
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      const muted = toggle.dataset.muted !== '0';
      setIntroAudioState(intro, !muted);
    });
    setIntroAudioState(intro, true);
  }

  function ensureCinematicIntro() {
    const body = document.body;
    const pageKey = body?.dataset?.page || 'home';
    const header = document.querySelector('.site-header, .game-topbar');
    const main = document.querySelector('main');
    if (pageKey === 'manager' || pageKey === 'game') return;
    if (!header || !main || document.querySelector('[data-cinematic-intro]')) return;

    const pageMap = {
      home: { eyebrow: 'Portfolio-inspired opening', title: 'Modern opening stage for PulseBoard Fusion', text: 'A.Md.Kom graduate in Informatics Management with certifications and a solid foundation in IT, data, and digital operations. Supported by academic preparation and continuous skills development, I am ready to contribute professionally, learn quickly, and grow in technology-driven environments.', primary: { href: '#library', text: 'Jelajahi Home' }, secondary: { href: 'portfolio.html', text: 'Open Studio Deck' }, poster: 'assets/showcase/home.png' },
      world: { eyebrow: 'World opening', title: 'World Atlas yang lebih lebar dan sinematik', text: 'Pembuka World Atlas memakai panggung visual ala showcase agar transisi dari navbar ke atlas terasa lebih premium.', primary: { href: '#worldVideoGrid', text: 'Lihat Media' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/worldatlas.png' },
      plants: { eyebrow: 'Green opening', title: 'Green Atlas dengan opening cinematic', text: 'Nuansa pembuka diterapkan juga pada Green Atlas agar halaman tanaman terasa lebih modern sejak layar pertama.', primary: { href: '#media', text: 'Lihat Green Atlas' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/greenatlas1.png' },
      animals: { eyebrow: 'Wild opening', title: 'Wild Echo yang lebih hidup', text: 'Opening lebar, reel video, dan panel visual membuat Wild Echo terasa lebih dekat ke style showcase modern.', primary: { href: '#media', text: 'Lihat Wild Echo' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/wildecho2.png' },
      tech: { eyebrow: 'Tech opening', title: 'Tech Forge dengan layout lebih lebar', text: 'Tech Forge ikut diperlebar agar navbar, pembuka, dan elemen-elemen kontennya lebih pas untuk layar laptop.', primary: { href: '#media', text: 'Lihat Tech Forge' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/techforge.png' },
      portfolio: { eyebrow: 'Studio opening', title: 'Studio Deck terasa seperti showcase premium', text: 'Studio Deck dibuka dengan intro sinematik lebar agar karya, video, dan link website tampil lebih meyakinkan.', primary: { href: '#media', text: 'Lihat Studio Deck' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/studiodesk.png' },
      news: { eyebrow: 'Editorial opening', title: 'News Desk dengan opening modern', text: 'Intro pembuka ikut diterapkan pada News Desk supaya halaman berita punya ritme yang lebih kuat sejak awal.', primary: { href: '#media', text: 'Lihat News Desk' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/newsdesk.png' },
      commerce: { eyebrow: 'Commerce opening', title: 'E-Commerce dengan panggung lebih luas', text: 'Halaman E-Commerce ikut memakai opening ala showcase agar kartu media dan link website terasa lebih fleksibel dan modern.', primary: { href: '#media', text: 'Lihat E-Commerce' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/e-commerce.png' },
      azka: { eyebrow: 'Garden opening', title: 'Azka Garden ikut memakai style pembuka yang sama', text: 'Bahasa visual pembuka disamakan supaya Azka Garden tetap nyambung dengan Home, Green Atlas, Wild Echo, dan halaman lain.', primary: { href: '#media', text: 'Lihat Azka Garden' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/greenatlas2.png' },
      manager: { eyebrow: 'Developer opening', title: 'Developer Edit kini lebih premium dan langsung terasa aktif', text: 'Manager ikut mendapat pembuka visual yang lebar dan konsisten sebelum masuk ke area edit permanen.', primary: { href: '#managerContent', text: 'Lihat Area Edit' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/techforge.png' },
      'posts-studio': { eyebrow: 'Studio workflow', title: 'Post Studio kini tampil seperti command center editorial', text: 'Intro atas dipakai sebagai area orientasi cepat: workflow, shortcut, status editor, ringkasan publish, dan jalur turun ke analytics, tabel belajar, history, list, editor, sampai activity log.', primary: { href: '#postList', text: 'Lihat Postingan' }, secondary: { href: '#postForm', text: 'Buka Editor' }, poster: 'assets/book/blueprint-farm-dashboard.png', localVideo: 'assets/media/portfolio-it-reel-short.mp4' },
      game: { eyebrow: 'Farm opening', title: 'Farm World tetap terhubung dengan PulseBoard', text: 'Area game juga diberi akses footer dan kontak agar tetap terasa satu ekosistem dengan portal utamanya.', primary: { href: '#gameHelp', text: 'Lihat Controls' }, secondary: { href: 'index.html', text: 'Back Home' }, poster: 'assets/showcase/home.png' }
    };

    const config = pageMap[pageKey] || { eyebrow: 'PulseBoard opening', title: 'PulseBoard Fusion cinematic layer', text: 'Opening lebar diterapkan agar halaman langsung terasa modern, dinamis, dan konsisten.', primary: { href: 'index.html', text: 'Main Portal' }, secondary: { href: 'portfolio.html', text: 'Open Studio Deck' }, poster: 'assets/showcase/home.png' };
    const postsStudioEnhancements = pageKey === 'posts-studio' ? `
        <aside class="post-intro-rail" aria-label="Studio navigator">
          <article class="post-intro-card post-intro-card--primary">
            <div class="micro">Navigator studio</div>
            <h3>Semua area penting langsung tersedia tanpa terasa kosong.</h3>
            <div class="post-intro-links">
              <a href="#analyticsOverview">Analytics</a>
              <a href="#studyLabRoot">Learning tables</a>
              <a href="#postHistoryTimeline">History</a>
              <a href="#postList">Post list</a>
              <a href="#postForm">Editor</a>
              <a href="#activityList">Activity</a>
            </div>
          </article>
          <article class="post-intro-card">
            <div class="micro">Workflow inti</div>
            <div class="post-intro-steps">
              <span>01 Draft</span>
              <span>02 Review</span>
              <span>03 Publish</span>
              <span>04 Archive</span>
              <span>05 Export</span>
              <span>06 Audit</span>
            </div>
          </article>
          <article class="post-intro-card">
            <div class="micro">Studio mode</div>
            <div class="post-intro-flagrow">
              <span class="post-intro-flag is-live">Preview publik aktif</span>
              <span class="post-intro-flag">CRUD siap unlock</span>
            </div>
            <p>Hero atas, command panel, analytics, tabel belajar, history website, daftar post, editor, dan audit log kini tersusun menjadi satu perjalanan yang lebih penuh sampai footer.</p>
          </article>
        </aside>
        <div class="post-intro-dock" aria-label="Ringkasan cepat studio">
          <article class="post-intro-kpi"><span>Post aktif</span><strong data-post-intro-active>—</strong><small>Ringkasan studio</small></article>
          <article class="post-intro-kpi"><span>Published</span><strong data-post-intro-published>—</strong><small>Konten publik</small></article>
          <article class="post-intro-kpi"><span>Draft</span><strong data-post-intro-draft>—</strong><small>Masih dipoles</small></article>
          <article class="post-intro-kpi"><span>Komentar</span><strong data-post-intro-comments>—</strong><small>Percakapan publik</small></article>
          <article class="post-intro-kpi"><span>Sessions</span><strong data-post-intro-sessions>—</strong><small>Analytics studio</small></article>
          <article class="post-intro-kpi"><span>Durasi rata-rata</span><strong data-post-intro-duration>—</strong><small>Kualitas kunjungan</small></article>
        </div>
      ` : '';

    const intro = document.createElement('section');
    intro.className = `cinematic-intro shell cinematic-intro--${pageKey}`;
    intro.setAttribute('data-cinematic-intro', '1');
    intro.innerHTML = `
      <div class="cinematic-intro__stage reveal in-view ${pageKey === 'posts-studio' ? 'cinematic-intro__stage--posts' : ''}">
        <div class="cinematic-intro__media" data-intro-media>
          ${buildCinematicMediaMarkup(config, null)}
        </div>
        <div class="cinematic-intro__shade"></div>
        <div class="cinematic-intro__content ${pageKey === 'posts-studio' ? 'cinematic-intro__content--posts' : ''}">
          <div class="eyebrow" data-intro-eyebrow>${config.eyebrow}</div>
          <h1 data-intro-title>${config.title}</h1>
          <p data-intro-text>${config.text}</p>
          <div class="hero-actions cinematic-intro__actions">
            <a class="button magnetic" href="${config.primary.href}">${config.primary.text}</a>
            <a class="ghost-button magnetic" href="${config.secondary.href}">${config.secondary.text}</a>
          </div>
        </div>
        ${postsStudioEnhancements}
        <div class="cinematic-intro__badge">Live opening reel</div>
        <button class="ghost-button cinematic-intro__audio" type="button" data-intro-audio-toggle hidden><span aria-hidden="true">🔇</span><span>Audio off</span></button>
      </div>
    `;

    if (main.firstElementChild) {
      main.insertBefore(intro, main.firstElementChild);
    } else {
      main.appendChild(intro);
    }

    bindIntroAudioToggle(intro);

    if (introPageToCategory[pageKey]) {
      loadOpeningReelRegistry().then((items) => {
        const reel = resolveOpeningReel(pageKey, items);
        if (!reel) return;
        const media = intro.querySelector('[data-intro-media]');
        const titleEl = intro.querySelector('[data-intro-title]');
        const textEl = intro.querySelector('[data-intro-text]');
        if (media) media.innerHTML = buildCinematicMediaMarkup(config, reel, { muted: true });
        if (titleEl && reel.name) titleEl.textContent = reel.name;
        if (textEl && reel.description) textEl.textContent = reel.description;
        bindIntroAudioToggle(intro);
      }).catch(() => {});
    }
  }

  function ensureHomeGalleryRotation() {}

  function removeLegacyFooterBlocks() {
    document.querySelectorAll('main .footer-box').forEach((box) => {
      if (box.closest('[data-global-footer]')) return;
      const section = box.closest('section');
      if (section) section.remove();
      else box.remove();
    });
  }

  function ensureUniversalFooter() {
    const main = document.querySelector('main');
    if (!main || document.querySelector('[data-global-footer]')) return;
    removeLegacyFooterBlocks();
    const footer = document.createElement('section');
    footer.className = 'universal-footer-wrap';
    footer.setAttribute('data-global-footer', '1');
    footer.innerHTML = `
      <div class="universal-footer reveal in-view">
        <div class="universal-footer__top">
          <div class="universal-footer__brandlock">
            <img src="assets/pulseboard-mark.svg" alt="PulseBoard mark" class="universal-footer__mark">
            <div>
              <div class="universal-footer__brand">PulseBoard Fusion</div>
              <div class="universal-footer__sub">One redesign, many moods.</div>
            </div>
          </div>
          <div class="universal-footer__phone">0812-8134-9115</div>
          <div class="universal-footer__topcopy">Contact • Portfolio • Studio Flow</div>
        </div>
        <div class="universal-footer__rows">
          <div class="universal-footer__row">
            <div class="universal-footer__label">Identity</div>
            <div class="universal-footer__value">Portal visual untuk proyek, video, post studio, developer flow, dan pengalaman showcase yang konsisten di seluruh halaman.</div>
          </div>
          <div class="universal-footer__row">
            <div class="universal-footer__label">Direct contact</div>
            <div class="universal-footer__value universal-footer__contact">
              <a class="universal-footer__cta" href="mailto:robertotahktalaksmana2014@gmail.com">Kirim Email</a>
              <a class="universal-footer__cta universal-footer__cta--ghost" href="https://wa.me/6281281349115" target="_blank" rel="noreferrer">Chat WhatsApp</a>
              <span>Gmail · robertotahktalaksmana2014@gmail.com</span>
            </div>
          </div>
          <div class="universal-footer__row universal-footer__row--socials">
            <div class="universal-footer__label">Social channels</div>
            <div class="universal-footer__socials" data-footer-socials>
              <a href="https://www.linkedin.com/in/roberto-laksmana-4403631b5/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><span class="social-icon social-icon--generic">in</span><span>LinkedIn</span></a>
            </div>
          </div>
          <div class="universal-footer__row universal-footer__row--legal">
            <div class="universal-footer__label">Legal</div>
            <div class="universal-footer__value universal-footer__legal">
              <a class="universal-footer__link" href="terms.html">Terms of Use</a>
              <a class="universal-footer__link" href="privacy.html">Privacy Policy</a>
              <button class="universal-footer__link universal-footer__link--button" type="button" data-open-cookie-banner>Cookie Settings</button>
            </div>
          </div>
        </div>
        <div class="universal-footer__bottom">©2026 PulseBoard Fusion • Portfolio, developer studio, Pulse Stories, dan media rail tersusun permanen untuk pengalaman yang lebih profesional. Dengan memakai situs ini, pengguna tetap bertanggung jawab atas komentar, unggahan, dan interaksi yang mereka kirimkan.</div>
      </div>
    `;
    main.appendChild(footer);
    const socialsHost = footer.querySelector('[data-footer-socials]');
    loadFooterSocials().then((socials) => {
      if (!socialsHost || !Array.isArray(socials) || !socials.length) return;
      socialsHost.innerHTML = socials.map((social) => buildFooterSocialMarkup(social)).join('');
    }).catch(() => {});
  }

  function ensureFloatingWhatsApp() {
    if (document.querySelector('.floating-wa')) return;
    const button = document.createElement('a');
    button.className = 'floating-wa';
    button.href = 'https://wa.me/6281281349115';
    button.target = '_blank';
    button.rel = 'noreferrer';
    button.setAttribute('aria-label', 'Hubungi via WhatsApp');
    button.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19.1 17.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.7 1.2 2.9c.2.2 2 3 4.8 4.2.7.3 1.3.5 1.7.7.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.4z" fill="currentColor"></path><path d="M27 15.5c0 6-4.9 10.9-10.9 10.9-1.9 0-3.8-.5-5.5-1.5L5 26.5l1.6-5.4c-1-1.7-1.5-3.6-1.5-5.6C5.1 9.5 10 4.6 16 4.6S27 9.5 27 15.5zm-10.9-9C10.4 6.5 5.8 11.1 5.8 16.8c0 2 .6 3.9 1.7 5.5l-.9 3.1 3.2-.8c1.5 1 3.3 1.6 5.3 1.6 5.7 0 10.3-4.6 10.3-10.3S21.8 6.5 16.1 6.5z" fill="currentColor"></path></svg><span>WhatsApp</span>';
    document.body.appendChild(button);
  }


  function ensureAnalyticsTracker() {
    if (window.__pulseboardAnalyticsBound || !hasAnalyticsConsent()) return;
    window.__pulseboardAnalyticsBound = true;
    const page = document.body?.dataset?.page || 'unknown';
    const navEntries = performance.getEntriesByType ? performance.getEntriesByType('navigation') : [];
    const visitStart = Date.now();
    let maxScrollDepth = 0;
    let sessionStarted = false;

    function getVisitorId() {
      try {
        const key = 'pulseboard-visitor-id';
        let value = localStorage.getItem(key);
        if (!value) {
          value = (crypto?.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`);
          localStorage.setItem(key, value);
        }
        return value;
      } catch {
        return `visitor-fallback-${Date.now()}`;
      }
    }

    function getSessionId() {
      try {
        const key = 'pulseboard-session-id';
        let value = sessionStorage.getItem(key);
        if (!value) {
          value = (crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`);
          sessionStorage.setItem(key, value);
        }
        return value;
      } catch {
        return `session-fallback-${Date.now()}`;
      }
    }

    function detectDevice() {
      const ua = navigator.userAgent || '';
      if (/ipad|tablet/i.test(ua)) return 'tablet';
      if (/mobi|android|iphone/i.test(ua)) return 'mobile';
      return 'desktop';
    }

    function sendEvent(type, detail = {}, useBeacon = false) {
      if (!hasAnalyticsConsent()) return;
      const payload = {
        type,
        page,
        path: location.pathname,
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        referrer: document.referrer || '',
        userAgent: navigator.userAgent || '',
        language: navigator.language || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        device: detectDevice(),
        scrollDepth: Math.round(maxScrollDepth),
        ...detail
      };
      try {
        if (useBeacon && navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/event', blob);
          return;
        }
      } catch {}
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        cache: 'no-store'
      }).catch(() => {});
    }

    if (!sessionStarted) {
      sessionStarted = true;
      sendEvent('page_view', {
        title: document.title,
        navType: navEntries[0]?.type || 'navigate',
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: document.documentElement.clientHeight
      });
    }

    const updateDepth = () => {
      const doc = document.documentElement;
      const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      const current = Math.min(100, Math.max(0, ((window.scrollY || 0) / maxScrollable) * 100));
      if (current > maxScrollDepth) maxScrollDepth = current;
    };
    updateDepth();
    window.addEventListener('scroll', updateDepth, { passive: true });

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('a,button,[data-analytics-label]') : null;
      if (!target) return;
      const label = target.getAttribute('data-analytics-label') || target.textContent?.trim() || target.getAttribute('aria-label') || target.id || 'interaction';
      const href = target.getAttribute('href') || '';
      const isVideo = target.classList.contains('yt-shell') || /youtube|youtu\.be/i.test(href) || target.classList.contains('open-video');
      const isWebsite = target.classList.contains('open-website') || (!isVideo && /^https?:/i.test(href));
      sendEvent(isVideo ? 'video_click' : isWebsite ? 'website_click' : 'cta_click', {
        label,
        href,
        component: target.className || target.tagName.toLowerCase()
      });
    }, { passive: true });

    window.addEventListener('error', (event) => {
      sendEvent('error', { message: event.message || 'Unknown error', source: event.filename || '', line: event.lineno || 0, column: event.colno || 0 });
    });
    window.addEventListener('unhandledrejection', (event) => {
      sendEvent('error', { message: event.reason?.message || String(event.reason || 'Unhandled rejection') });
    });

    const flushDepth = () => sendEvent('scroll_depth', { durationMs: Date.now() - visitStart }, true);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushDepth();
    });
    window.addEventListener('beforeunload', flushDepth);
  }

  ensureCookieBanner(false);
  ensureAnalyticsTracker();
  ensureCinematicIntro();
  ensureHomeGalleryRotation();
  ensureUniversalFooter();
  ensureFloatingWhatsApp();

  /* ── Vine Decorations (left & right climbing plants) ── */
  (function ensureVineDecorations() {
    if (document.body.classList.contains('theme-game')) return;
    if (document.querySelector('.vine-decoration')) return;

    function makeLeaf(cx, cy, rotDeg, scaleX, cls, color, secondColor) {
      const s = scaleX < 0 ? -1 : 1;
      const c2 = secondColor || color;
      return `<g class="${cls}" transform="translate(${cx},${cy}) rotate(${rotDeg}) scale(${s},1)">
        <path d="M 0 0 C 8 -10 18 -18 14 -34 C 10 -50 -4 -46 -8 -32 C -12 -18 -6 -8 0 0 Z"
          fill="${color}" opacity="0.82" />
        <path d="M 0 0 C 4 -6 10 -14 8 -28 C 6 -42 -2 -40 -4 -28 C -6 -16 -3 -6 0 0 Z"
          fill="${c2}" opacity="0.55" />
        <line x1="0" y1="0" x2="5" y2="-30" stroke="${c2}" stroke-width="0.7" opacity="0.5"/>
        <line x1="5" y1="-18" x2="12" y2="-24" stroke="${c2}" stroke-width="0.5" opacity="0.35"/>
        <line x1="3" y1="-10" x2="-5" y2="-16" stroke="${c2}" stroke-width="0.5" opacity="0.35"/>
      </g>`;
    }

    function makeTendril(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
      return `<path class="vine-tendril" d="M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}"
        stroke="#4a7f5b" stroke-width="1" fill="none" opacity="0.4"/>`;
    }

    const GREEN_DEEP  = '#3a6b48';
    const GREEN_MID   = '#4f8f64';
    const GREEN_LIGHT = '#6aac7a';
    const GOLD        = '#c9a96e';

    const leftSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 1000" preserveAspectRatio="xMaxYMid slice">
      <defs>
        <filter id="vine-glow-l" x="-40%" y="-10%" width="180%" height="120%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="vlg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${GREEN_LIGHT}" stop-opacity="0.95"/>
          <stop offset="50%" stop-color="${GREEN_MID}" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="${GREEN_DEEP}" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      <path class="vine-stem"
        d="M 58 0 C 40 80 68 170 50 290 S 28 410 56 530 S 72 650 44 780 S 24 900 52 1000"
        stroke="url(#vlg)" stroke-width="2.2" fill="none" stroke-linecap="round" filter="url(#vine-glow-l)"/>
      ${makeLeaf(56, 65,  -40, 1,  'vine-leaf-a', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(44, 110,  30, -1, 'vine-leaf-b', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(62, 185, -55, 1,  'vine-leaf-c', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(40, 250,  20, -1, 'vine-leaf-d', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(55, 320, -35, 1,  'vine-leaf-e', GREEN_LIGHT, GOLD)}
      ${makeLeaf(38, 395,  45, -1, 'vine-leaf-f', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(60, 470, -50, 1,  'vine-leaf-g', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(36, 545,  28, -1, 'vine-leaf-h', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(58, 625, -42, 1,  'vine-leaf-i', GREEN_LIGHT, GOLD)}
      ${makeLeaf(40, 700,  38, -1, 'vine-leaf-j', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(56, 780, -30, 1,  'vine-leaf-a', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(38, 860,  52, -1, 'vine-leaf-c', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(54, 945, -44, 1,  'vine-leaf-e', GREEN_MID, GOLD)}
      ${makeTendril(58,290, 68,270, 74,250, 70,235)}
      ${makeTendril(56,530, 64,510, 70,490, 66,475)}
      ${makeTendril(44,780, 52,760, 58,742, 54,728)}
    </svg>`;

    const rightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 1000" preserveAspectRatio="xMinYMid slice">
      <defs>
        <filter id="vine-glow-r" x="-40%" y="-10%" width="180%" height="120%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="vrg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${GREEN_LIGHT}" stop-opacity="0.95"/>
          <stop offset="55%" stop-color="${GREEN_MID}" stop-opacity="0.72"/>
          <stop offset="100%" stop-color="${GREEN_DEEP}" stop-opacity="0.32"/>
        </linearGradient>
      </defs>
      <path class="vine-stem"
        d="M 22 0 C 40 90 12 180 30 310 S 52 420 24 545 S 8 660 36 795 S 56 905 28 1000"
        stroke="url(#vrg)" stroke-width="2.2" fill="none" stroke-linecap="round" filter="url(#vine-glow-r)"/>
      ${makeLeaf(24, 72,  140, -1, 'vine-leaf-b', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(36, 125,  -150, 1,'vine-leaf-a', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(20, 200,  135, -1,'vine-leaf-d', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(34, 270,  -140, 1,'vine-leaf-c', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(22, 345,  145, -1,'vine-leaf-f', GREEN_LIGHT, GOLD)}
      ${makeLeaf(36, 425,  -130, 1,'vine-leaf-e', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(18, 500,  150, -1,'vine-leaf-h', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(34, 580,  -138, 1,'vine-leaf-g', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(20, 660,  142, -1,'vine-leaf-j', GREEN_LIGHT, GOLD)}
      ${makeLeaf(36, 740,  -145, 1,'vine-leaf-i', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(22, 820,  148, -1,'vine-leaf-b', GREEN_MID, GREEN_LIGHT)}
      ${makeLeaf(34, 900,  -132, 1,'vine-leaf-d', GREEN_DEEP, GREEN_MID)}
      ${makeLeaf(20, 975,  150, -1,'vine-leaf-f', GREEN_MID, GOLD)}
      ${makeTendril(30,310, 20,292, 14,272, 18,258)}
      ${makeTendril(24,545, 16,526, 10,508, 14,494)}
      ${makeTendril(36,795, 28,776, 22,758, 26,744)}
    </svg>`;

    const left = document.createElement('div');
    left.className = 'vine-decoration vine-decoration--left';
    left.setAttribute('aria-hidden', 'true');
    left.innerHTML = leftSvg;

    const right = document.createElement('div');
    right.className = 'vine-decoration vine-decoration--right';
    right.setAttribute('aria-hidden', 'true');
    right.innerHTML = rightSvg;

    document.body.prepend(right);
    document.body.prepend(left);
  })();

  document.querySelectorAll('.magnetic').forEach((item) => {
    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
})();
