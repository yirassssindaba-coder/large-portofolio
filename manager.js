const PAGE_SIZE = 24;
const LOCAL_STORAGE_KEY = 'pulseboard-youtube-cards-overrides-v1';
const REGISTRY_UPDATED_KEY = 'pulseboard-registry-updated-at';
const ADMIN_TOKEN_KEY = 'pulseboard-admin-token';
const EDITABLE_LINK_CATEGORIES = new Set(['home', 'tanaman', 'hewan', 'teknologi', 'world', 'studio', 'news', 'commerce', 'azka']);

const initialParams = new URLSearchParams(window.location.search);
const state = {
  category: '',
  query: '',
  missingOnly: false,
  page: 1,
  items: [],
  meta: null,
  backend: 'detect',
  localDb: null,
  focusItemId: '',
  pendingEditJump: true,
  hasAdjustedViewport: false,
  footerSocials: [],
  commentModeration: [],
  commentModerationLoaded: false
};

const registryChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('pulseboard-registry') : null;
function broadcastRegistryUpdate() {
  try { localStorage.setItem(REGISTRY_UPDATED_KEY, String(Date.now())); } catch {}
  try { registryChannel?.postMessage({ type: 'registry-updated', at: Date.now() }); } catch {}
}

const statsEl = document.getElementById('stats');
const cardsEl = document.getElementById('cards');
const pagerEl = document.getElementById('pager');
const resultTitleEl = document.getElementById('resultTitle');
const statusBarEl = document.getElementById('statusBar');
const template = document.getElementById('cardTemplate');
const storageModeEl = document.getElementById('storageMode');
const searchInput = document.getElementById('searchInput');
const missingOnly = document.getElementById('missingOnly');
const reloadButton = document.getElementById('reloadButton');
const categoryPills = document.getElementById('categoryPills');
const bulkDialog = document.getElementById('bulkDialog');
const openBulkButton = document.getElementById('openBulkButton');
const bulkSaveButton = document.getElementById('bulkSaveButton');
const bulkText = document.getElementById('bulkText');
const bulkResult = document.getElementById('bulkResult');
const exportJsonButton = document.getElementById('exportJsonButton');
const openCreateButtons = Array.from(document.querySelectorAll('.open-create-card'));
const createDialog = document.getElementById('createDialog');
const createSaveButton = document.getElementById('createSaveButton');
const createCategory = document.getElementById('createCategory');
const createName = document.getElementById('createName');
const createWebsite = document.getElementById('createWebsite');
const createSearchQuery = document.getElementById('createSearchQuery');
const createDescription = document.getElementById('createDescription');
const createYoutube = document.getElementById('createYoutube');
const createDownload = document.getElementById('createDownload');
const createResult = document.getElementById('createResult');
const openSocialButton = document.getElementById('openSocialButton');
const sidebarSocialButton = document.getElementById('sidebarSocialButton');
const socialListEl = document.getElementById('socialList');
const socialDialog = document.getElementById('socialDialog');
const socialEditId = document.getElementById('socialEditId');
const socialName = document.getElementById('socialName');
const socialIcon = document.getElementById('socialIcon');
const socialLink = document.getElementById('socialLink');
const socialSaveButton = document.getElementById('socialSaveButton');
const socialResult = document.getElementById('socialResult');
const commentModerationListEl = document.getElementById('commentModerationList');
const commentModerationStatusEl = document.getElementById('commentModerationStatus');
const refreshCommentModerationButton = document.getElementById('refreshCommentModerationButton');

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseJsonSafe(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}
function formatDate(value) {
  try { return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
  catch { return value || '—'; }
}
function getLocalOverrides() {
  return parseJsonSafe(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}', {});
}
function setLocalOverrides(data) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}
function shouldApplyLocalOverride(item, override) {
  if (!override || typeof override !== 'object') return false;
  const itemUpdatedAt = Date.parse(item?.updatedAt || item?.createdAt || 0) || 0;
  const overrideUpdatedAt = Date.parse(override.updatedAt || 0) || 0;
  return !itemUpdatedAt || overrideUpdatedAt >= itemUpdatedAt;
}
function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
}
function setAdminToken(token) {
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}
async function confirmAction(message, options = {}) {
  if (typeof window.PulseboardUI?.confirm === 'function') {
    return window.PulseboardUI.confirm({ message, ...options });
  }
  return window.confirm(message);
}
function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(String(query || '').trim())}`;
}
function shuffleList(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
const CATEGORY_SEARCH_HINTS = {
  home: ['official trailer', 'gameplay trailer', 'cinematic trailer', 'showcase', 'overview'],
  tanaman: ['plant documentary', 'farming guide', 'nature footage', 'showcase'],
  hewan: ['animal documentary', 'wildlife footage', 'nature video', 'showcase'],
  teknologi: ['tech demo', 'product showcase', 'review', 'official trailer'],
  world: ['travel guide', 'cinematic', 'documentary', 'official tourism'],
  studio: ['official trailer', 'showcase', 'gameplay', 'cinematic trailer'],
  news: ['official coverage', 'news report', 'breaking news', 'update'],
  commerce: ['official commercial', 'product demo', 'brand showcase', 'review'],
  azka: ['garden tour', 'showcase', 'cinematic', 'overview']
};
const directedShuffleState = new Map();
function cleanSearchTerm(value) {
  return String(value || '')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/[|()[\]{}]+/g, ' ')
    .replace(/[\-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function normalizeDomainLabel(url) {
  try {
    const parsed = new URL(String(url || '').trim());
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    const parts = host.split('.').filter(Boolean);
    if (!parts.length) return '';
    const label = parts.length >= 2 ? parts[0] : host;
    return cleanSearchTerm(label);
  } catch {
    return '';
  }
}
function buildDirectedSearchCandidates(payload) {
  const category = String(payload?.category || '').trim().toLowerCase();
  const title = cleanSearchTerm(payload?.title || payload?.name || '');
  const query = cleanSearchTerm(payload?.searchQuery || '');
  const domainLabel = normalizeDomainLabel(payload?.websiteUrl || '');
  const base = query || title || domainLabel;
  if (!base) return [];

  const helperTerms = CATEGORY_SEARCH_HINTS[category] || ['official trailer', 'showcase', 'overview', 'review'];
  const looksLikeGame = /\b(game|rpg|simulator|sim|tycoon|adventure|quest|atlas|world|farm)\b/i.test(`${title} ${query}`);
  const looksLikeAnime = /\b(anime|episode|bleach|naruto|one piece|manga)\b/i.test(`${title} ${query}`);
  const looksLikeFood = /\b(food|recipe|kuliner|dish|gyunabe|ramen|sushi)\b/i.test(`${title} ${query}`);

  const variants = [
    query,
    title,
    base,
    `${base} official`,
    `${base} showcase`,
    `${base} overview`,
    looksLikeGame ? `${base} official trailer gameplay` : '',
    looksLikeAnime ? `${base} anime official trailer` : '',
    looksLikeFood ? `${base} recipe documentary` : '',
    ...helperTerms.map((term) => `${base} ${term}`),
    ...(title && title !== base ? helperTerms.map((term) => `${title} ${term}`) : []),
    ...(domainLabel && domainLabel !== base ? [`${base} ${domainLabel}`, `${domainLabel} ${base}`] : [])
  ];

  return [...new Set(variants.map((item) => cleanSearchTerm(item)).filter(Boolean))].slice(0, 14);
}
function getDirectedSearchCandidate(key, payload) {
  const candidates = buildDirectedSearchCandidates(payload);
  if (!candidates.length) return '';
  const signature = JSON.stringify(candidates);
  let stateEntry = directedShuffleState.get(key);
  if (!stateEntry || stateEntry.signature !== signature || !Array.isArray(stateEntry.queue) || !stateEntry.queue.length) {
    stateEntry = { signature, queue: shuffleList(candidates) };
    directedShuffleState.set(key, stateEntry);
  }
  const next = stateEntry.queue.shift() || candidates[0];
  if (!stateEntry.queue.length) {
    stateEntry.queue = shuffleList(candidates.filter((candidate) => candidate !== next));
    if (!stateEntry.queue.length) stateEntry.queue = shuffleList(candidates);
  }
  return next;
}
function getDbAssetPath() {
  return './db/items.json';
}
function supportsEditablePublicLink(item) {
  return EDITABLE_LINK_CATEGORIES.has(String(item?.category || '').trim().toLowerCase());
}
function normalizePublicUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) return { valid: true, value: '', domain: '' };
  let parsed;
  try { parsed = new URL(raw); } catch { return { valid: false, reason: 'Link website tidak valid.' }; }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { valid: false, reason: 'Link website harus memakai http:// atau https://.' };
  }
  return { valid: true, value: parsed.toString(), domain: parsed.hostname.replace(/^www\./i, '').toLowerCase() };
}
function escapeAttribute(value) {
  return escapeHtml(value);
}
function buildSocialIconMarkup(social) {
  const raw = String(social?.icon || '').trim();
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:image/')) {
    return `<img src="${escapeAttribute(raw)}" alt="${escapeAttribute(social?.name || 'Social logo')}" class="social-icon__image">`;
  }
  return escapeHtml(raw || String(social?.name || '?').slice(0, 2).toUpperCase());
}
async function fetchFooterSocials() {
  try {
    const res = await fetch('/api/footer', { cache: 'no-store' });
    if (!res.ok) throw new Error('api');
    const data = await res.json();
    state.footerSocials = Array.isArray(data.socials) ? data.socials : [];
    return state.footerSocials;
  } catch {
    try {
      const res = await fetch('./db/footer.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('db');
      const data = await res.json();
      state.footerSocials = Array.isArray(data.socials) ? data.socials : [];
      return state.footerSocials;
    } catch {
      state.footerSocials = [];
      return state.footerSocials;
    }
  }
}

function commentStatusBadge(comment) {
  if (comment?.status === 'hidden' || comment?.hiddenAt) return '<span class="comment-status-pill is-hidden">Disembunyikan</span>';
  if (comment?.moderationEdited) return '<span class="comment-status-pill is-moderated">Disunting otomatis</span>';
  return '<span class="comment-status-pill is-visible">Tampil publik</span>';
}
function commentKindLabel(comment) {
  return comment?.parentId ? 'Balasan' : 'Komentar utama';
}
function escapeNl(value) {
  return escapeHtml(String(value || '')).replace(/\n/g, '<br>');
}
async function fetchCommentModeration({ forcePrompt = false } = {}) {
  if (state.backend !== 'api') {
    state.commentModeration = [];
    state.commentModerationLoaded = true;
    return [];
  }
  let res;
  if (forcePrompt) {
    res = await apiFetchWithAdmin('/api/admin/story-comments?postId=website-global', { cache: 'no-store' });
  } else {
    const token = getAdminToken();
    if (!token) {
      state.commentModeration = [];
      state.commentModerationLoaded = false;
      return null;
    }
    res = await fetch('/api/admin/story-comments?postId=website-global', {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) {
      setAdminToken('');
      state.commentModeration = [];
      state.commentModerationLoaded = false;
      return null;
    }
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Gagal memuat komentar moderasi.');
  state.commentModeration = Array.isArray(data.comments) ? data.comments : [];
  state.commentModerationLoaded = true;
  return state.commentModeration;
}
async function moderateCommentVisibility(commentId, action) {
  const body = action === 'hide'
    ? { action: 'hide', reason: 'Disembunyikan dari Developer Edit.' }
    : { action: 'show' };
  const res = await apiFetchWithAdmin(`/api/admin/story-comments/${encodeURIComponent(commentId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Gagal memperbarui status komentar.');
  return data.message || 'Status komentar diperbarui.';
}
async function deleteModeratedComment(commentId) {
  const res = await apiFetchWithAdmin(`/api/admin/story-comments/${encodeURIComponent(commentId)}`, { method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Gagal menghapus komentar.');
  return data.message || 'Komentar dihapus permanen.';
}
function renderCommentModeration() {
  if (!commentModerationListEl || !commentModerationStatusEl) return;
  if (state.backend !== 'api') {
    commentModerationStatusEl.textContent = 'Moderasi komentar permanen membutuhkan mode server aktif.';
    commentModerationListEl.innerHTML = '<article class="comment-moderation-card comment-moderation-card--empty"><strong>Mode lokal aktif.</strong><p>Jalankan server proyek agar Developer Edit bisa menyembunyikan atau menghapus komentar publik secara permanen.</p></article>';
    return;
  }
  if (!state.commentModerationLoaded) {
    commentModerationStatusEl.textContent = 'Klik Refresh komentar untuk membuka akses moderasi komentar dengan admin token.';
    commentModerationListEl.innerHTML = '<article class="comment-moderation-card comment-moderation-card--empty"><strong>Akses moderasi belum dibuka.</strong><p>Setelah admin token aktif, komentar website keseluruhan akan tampil di sini lengkap dengan tombol sembunyikan, tampilkan, dan hapus permanen.</p></article>';
    return;
  }
  const items = state.commentModeration || [];
  commentModerationStatusEl.textContent = `${items.length} komentar termuat untuk website keseluruhan.`;
  if (!items.length) {
    commentModerationListEl.innerHTML = '<article class="comment-moderation-card comment-moderation-card--empty"><strong>Belum ada komentar.</strong><p>Saat komentar publik masuk, daftar moderasi akan muncul di sini.</p></article>';
    return;
  }
  commentModerationListEl.innerHTML = items.map((comment) => {
    const moderationTags = Array.isArray(comment.moderationLabels) && comment.moderationLabels.length
      ? `<div class="comment-moderation-tags">${comment.moderationLabels.map((label) => `<span class="comment-tag">${escapeHtml(label)}</span>`).join('')}</div>`
      : '';
    const hiddenReason = comment.hiddenAt ? `<div class="comment-moderation-reason">${escapeHtml(comment.hiddenReason || 'Disembunyikan dari tampilan publik.')}</div>` : '';
    return `
      <article class="comment-moderation-card" data-comment-id="${escapeHtml(comment.id)}">
        <div class="comment-moderation-card__head">
          <div>
            <div class="comment-moderation-meta"><strong>${escapeHtml(comment.name || 'Anonim')}</strong><span>${commentStatusBadge(comment)}</span><span class="comment-type-pill">${commentKindLabel(comment)}</span></div>
            <div class="comment-moderation-submeta"><span>${escapeHtml(comment.postId || 'website-global')}</span><span>${escapeHtml(formatDate(comment.createdAt))}</span></div>
          </div>
          <div class="comment-moderation-actions">
            ${comment.status === 'hidden' || comment.hiddenAt
              ? '<button class="ghost-button magnetic" type="button" data-comment-action="show">Tampilkan</button>'
              : '<button class="ghost-button magnetic" type="button" data-comment-action="hide">Sembunyikan</button>'}
            <button class="ghost-button magnetic is-danger" type="button" data-comment-action="delete">Hapus permanen</button>
          </div>
        </div>
        <div class="comment-moderation-body">${escapeNl(comment.text || '') || '<em>Komentar tanpa teks.</em>'}</div>
        ${moderationTags}
        ${hiddenReason}
      </article>`;
  }).join('');
}

function renderFooterSocialsAdmin() {
  if (!socialListEl) return;
  const socials = Array.isArray(state.footerSocials) ? state.footerSocials : [];
  if (!socials.length) {
    socialListEl.innerHTML = '<div class="social-admin-empty">Belum ada social media di footer.</div>';
    return;
  }
  socialListEl.innerHTML = socials.map((social) => `
    <article class="social-admin-card" data-social-id="${escapeAttribute(social.id)}">
      <div class="social-admin-card__main">
        <span class="social-icon social-icon--generic">${buildSocialIconMarkup(social)}</span>
        <div>
          <strong>${escapeHtml(social.name)}</strong>
          <p>${escapeHtml(social.href)}</p>
        </div>
      </div>
      <div class="social-admin-card__actions">
        <button class="ghost-button social-edit" type="button">Ubah</button>
        <button class="ghost-button social-delete" type="button">Hapus</button>
      </div>
    </article>`).join('');
}
async function saveFooterSocial(payload) {
  const target = payload?.id ? `/api/footer/socials/${encodeURIComponent(payload.id)}` : '/api/footer/socials';
  const method = payload?.id ? 'PATCH' : 'POST';
  const res = await apiFetchWithAdmin(target, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Gagal menyimpan social media.');
  return data;
}
async function deleteFooterSocial(id) {
  const res = await apiFetchWithAdmin(`/api/footer/socials/${encodeURIComponent(id)}`, { method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Gagal menghapus social media.');
  return data;
}
function openSocialDialog(existing = null) {
  if (!socialDialog) return;
  socialEditId.value = existing?.id || '';
  socialName.value = existing?.name || '';
  socialIcon.value = existing?.icon || '';
  socialLink.value = existing?.href || '';
  socialResult.textContent = '';
  socialDialog.showModal();
}
function normalizeYoutubeUrl(url) {
  if (!url || typeof url !== 'string') return { valid: false, reason: 'URL kosong.' };
  const value = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) {
      const videoId = match[1];
      return {
        valid: true,
        videoId,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
      };
    }
  }
  return { valid: false, reason: 'Link YouTube tidak valid.' };
}
function mergeOverrideFromItem(item) {
  if (!item?.id) return;
  const overrides = getLocalOverrides();
  overrides[item.id] = {
    ...(overrides[item.id] || {}),
    name: item.name || '',
    searchQuery: item.searchQuery || '',
    description: item.description || '',
    websiteUrl: item.websiteUrl || '',
    domain: item.domain || '',
    youtubeUrl: item.youtubeUrl || '',
    videoId: item.videoId || '',
    embedUrl: item.embedUrl || '',
    updatedAt: item.updatedAt || new Date().toISOString(),
    isCustom: !!item.isCustom
  };
  setLocalOverrides(overrides);
}
async function detectBackend() {
  if (state.backend !== 'detect') return state.backend;
  try {
    const res = await fetch('/api/meta', { cache: 'no-store' });
    if (!res.ok) throw new Error('API tidak aktif');
    state.backend = 'api';
  } catch {
    state.backend = 'local';
  }
  updateModePill();
  return state.backend;
}
function updateModePill() {
  if (!storageModeEl) return;
  if (state.backend === 'api') {
    storageModeEl.textContent = 'Aegis Sync · permanen untuk semua pengunjung';
    storageModeEl.classList.add('is-api');
    storageModeEl.classList.remove('is-local');
  } else if (state.backend === 'local') {
    storageModeEl.textContent = 'Preview Canvas · hanya perangkat ini';
    storageModeEl.classList.add('is-local');
    storageModeEl.classList.remove('is-api');
  } else {
    storageModeEl.textContent = 'Adaptive Mode';
  }
}
async function ensureAdminToken() {
  if (state.backend !== 'api') throw new Error('Mode server diperlukan untuk mengubah data proyek.');
  let token = getAdminToken();
  if (!token) token = await (window.PulseboardUI?.requestDeveloperToken?.({
    title: 'Manager Access',
    subtitle: 'Masukkan admin token untuk menyimpan kartu, video, dan perubahan permanen ke seluruh website.',
    submitText: 'Buka Akses Manager',
    validate: async (value) => {
      const res = await fetch('/api/auth/check', { headers: { Authorization: `Bearer ${value}` }, cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Admin token tidak valid.');
    }
  }) || '');
  if (!token) throw new Error('Admin token wajib diisi.');
  setAdminToken(token);
  return token;
}
async function apiFetchWithAdmin(url, options = {}) {
  const token = await ensureAdminToken();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  return fetch(url, { ...options, headers });
}
function syncUrlState() {
  const params = new URLSearchParams();
  if (state.category) params.set('category', state.category);
  if (state.query) params.set('q', state.query);
  if (state.missingOnly) params.set('missing', '1');
  if (state.page > 1) params.set('page', String(state.page));
  if (state.focusItemId) params.set('item', state.focusItemId);
  const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
  window.history.replaceState({}, '', next);
}
function applyStateFromUrl() {
  const category = String(initialParams.get('category') || '').trim().toLowerCase();
  const allowed = new Set(['', 'home', 'tanaman', 'hewan', 'teknologi', 'world', 'studio', 'news', 'commerce', 'azka']);
  state.category = allowed.has(category) ? category : '';
  state.query = String(initialParams.get('q') || '').trim();
  state.missingOnly = String(initialParams.get('missing') || '').trim() === '1';
  state.page = Math.max(parseInt(initialParams.get('page') || '1', 10) || 1, 1);
  state.focusItemId = String(initialParams.get('item') || '').trim();
  if (searchInput) searchInput.value = state.query;
  if (missingOnly) missingOnly.checked = state.missingOnly;
  categoryPills?.querySelectorAll('.pill').forEach((pill) => {
    pill.classList.toggle('active', String(pill.dataset.category || '') === state.category);
  });
}
function getScrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
function scrollElementIntoEditingView(target, { behavior = getScrollBehavior(), extraOffset = 18 } = {}) {
  if (!target) return;
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
  const nextTop = Math.max(0, absoluteTop - headerHeight - extraOffset);
  window.scrollTo({ top: nextTop, behavior });
}
function focusFirstEditableField(scope) {
  if (!scope) return;
  const editable = scope.querySelector('.video-input, .name-input, .query-input, .website-input, textarea, input, button');
  if (!editable || typeof editable.focus !== 'function') return;
  requestAnimationFrame(() => {
    try {
      editable.focus({ preventScroll: true });
      if ('select' in editable && typeof editable.select === 'function' && editable.matches('input[type="text"], input[type="search"], input[type="url"], textarea')) {
        editable.select();
      }
    } catch {}
  });
}
function focusRequestedItem() {
  if (!state.focusItemId) return false;
  const target = cardsEl.querySelector(`[data-item-id="${CSS.escape(state.focusItemId)}"]`);
  if (!target) return false;
  target.classList.add('is-focused');
  setTimeout(() => target.classList.remove('is-focused'), 2600);
  requestAnimationFrame(() => {
    scrollElementIntoEditingView(target, { behavior: state.hasAdjustedViewport ? getScrollBehavior() : 'auto', extraOffset: 20 });
    focusFirstEditableField(target);
  });
  return true;
}
function jumpToEditingViewport(force = false) {
  if (!force && !state.pendingEditJump) return;
  const contentTop = document.getElementById('managerContent') || document.getElementById('managerMain') || cardsEl;
  const firstCard = cardsEl.querySelector('.manager-card');
  const target = state.focusItemId ? cardsEl.querySelector(`[data-item-id="${CSS.escape(state.focusItemId)}"]`) : (firstCard || contentTop);
  requestAnimationFrame(() => {
    scrollElementIntoEditingView(target || contentTop, { behavior: state.hasAdjustedViewport ? getScrollBehavior() : 'auto' });
    focusFirstEditableField(target || firstCard || contentTop);
    state.pendingEditJump = false;
    state.hasAdjustedViewport = true;
  });
}
function computeLocalMeta(items) {
  const byCategory = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || { total: 0, withVideo: 0 };
    acc[item.category].total += 1;
    if (item.videoId) acc[item.category].withVideo += 1;
    return acc;
  }, {});
  return { meta: state.localDb?.meta || { name: 'PulseBoard YouTube Cards CMS', description: 'Local preview mode' }, byCategory };
}
function applyLocalOverrides(items) {
  const overrides = getLocalOverrides();
  return items.map((item) => {
    const override = overrides[item.id] || null;
    return shouldApplyLocalOverride(item, override) ? { ...item, ...override } : item;
  });
}
async function loadLocalDb() {
  if (!state.localDb) {
    const res = await fetch(getDbAssetPath(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal memuat database lokal.');
    state.localDb = await res.json();
  }
  return state.localDb;
}
function filterItems(items) {
  let output = items.slice();
  if (state.category) output = output.filter((item) => item.category === state.category);
  if (state.query) {
    const q = state.query.toLowerCase();
    output = output.filter((item) => [item.name, item.group, item.searchQuery, item.description || '', item.websiteUrl || '', item.domain || ''].join(' ').toLowerCase().includes(q));
  }
  if (state.missingOnly) output = output.filter((item) => !item.videoId);
  output.sort((a, b) => Number(!!b.isOpeningReel) - Number(!!a.isOpeningReel));
  return output;
}
async function fetchMetaAndItems() {
  await detectBackend();
  if (state.backend === 'api') {
    const url = new URL('/api/items', window.location.origin);
    if (state.category) url.searchParams.set('category', state.category);
    if (state.query) url.searchParams.set('q', state.query);
    if (state.missingOnly) url.searchParams.set('missing', '1');
    const [metaRes, itemsRes] = await Promise.all([fetch('/api/meta', { cache: 'no-store' }), fetch(url, { cache: 'no-store' })]);
    if (!metaRes.ok || !itemsRes.ok) throw new Error('Gagal memuat data proyek.');
    state.meta = await metaRes.json();
    const data = await itemsRes.json();
    state.items = filterItems(applyLocalOverrides(Array.isArray(data.items) ? data.items : []));
  } else {
    const db = await loadLocalDb();
    const items = applyLocalOverrides(db.items || []);
    state.meta = computeLocalMeta(items);
    state.items = filterItems(items);
  }
  if (state.focusItemId) {
    const focusIndex = state.items.findIndex((item) => item.id === state.focusItemId);
    if (focusIndex >= 0) state.page = Math.floor(focusIndex / PAGE_SIZE) + 1;
  }
}
function renderStats() {
  const labels = { home:'Home', tanaman:'Green Atlas', hewan:'Wild Echo', teknologi:'Tech Forge', world:'World Atlas', studio:'Studio Deck', news:'News Desk', commerce:'E-Commerce', azka:'Azka Garden' };
  const order = ['home', 'tanaman', 'hewan', 'teknologi', 'world', 'studio', 'news', 'commerce', 'azka'];
  const buckets = state.meta?.byCategory || {};
  const totalWithVideo = Object.values(buckets).reduce((sum, item) => sum + item.withVideo, 0);
  statsEl.innerHTML = order.filter((key) => buckets[key]).map((key) => {
    const bucket = buckets[key] || { total: 0, withVideo: 0 };
    return `<article class="stat-card"><strong>${bucket.total}</strong><span>${labels[key] || key}</span><span>${bucket.withVideo} video tersimpan</span></article>`;
  }).join('') + `<article class="stat-card stat-card-accent"><strong>${totalWithVideo}</strong><span>Total kartu aktif</span><span>${state.backend === 'api' ? 'Sinkron ke database proyek' : 'Tersimpan di browser ini'}</span></article>`;
}
function updateTitle() {
  const map = { '': 'Semua item', home:'Kartu Home', tanaman:'Katalog Green Atlas', hewan:'Katalog Wild Echo', teknologi:'Katalog Tech Forge', world:'Katalog World Atlas', studio:'Katalog Studio Deck', news:'Katalog News Desk', commerce:'Katalog E-Commerce', azka:'Katalog Azka Garden' };
  resultTitleEl.textContent = map[state.category] || 'Katalog item';
  const focusText = state.focusItemId ? ' Item fokus aktif.' : '';
  statusBarEl.textContent = `${state.items.length} item ditemukan. Halaman ${state.page} dari ${Math.max(1, Math.ceil(state.items.length / PAGE_SIZE))}. ${state.backend === 'local' ? 'Anda sedang memakai Preview Canvas.' : 'Anda sedang memakai Aegis Sync.'}${focusText}`;
}
function currentPageItems() {
  const start = (state.page - 1) * PAGE_SIZE;
  return state.items.slice(start, start + PAGE_SIZE);
}
function renderPager() {
  const totalPages = Math.max(1, Math.ceil(state.items.length / PAGE_SIZE));
  state.page = Math.min(state.page, totalPages);
  pagerEl.innerHTML = '';
  const buttons = [];
  const add = (page, label = page) => buttons.push({ page, label });
  for (let i = 1; i <= totalPages; i += 1) if (i <= 2 || i > totalPages - 2 || Math.abs(i - state.page) <= 1) add(i);
  const deduped = [];
  let previous = 0;
  for (const button of buttons.sort((a, b) => a.page - b.page)) {
    if (button.page === previous) continue;
    if (button.page - previous > 1) deduped.push({ page: null, label: '…' });
    deduped.push(button);
    previous = button.page;
  }
  deduped.forEach((button) => {
    const el = document.createElement('button');
    el.textContent = button.label;
    if (button.page === null) {
      el.disabled = true;
      el.style.opacity = '0.55';
    } else {
      if (button.page === state.page) el.classList.add('active');
      el.addEventListener('click', () => {
        state.page = button.page;
        syncUrlState();
        renderCards();
        renderPager();
        updateTitle();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    pagerEl.appendChild(el);
  });
}
function renderPlaceholder(container, item) {
  const helpText = item?.isOpeningReel
    ? `Gunakan tombol <em>Acak Sesuai Judul</em> atau <em>Cari di YouTube</em>, lalu tempel link video pembuka untuk <strong>${escapeHtml(item.name)}</strong>. Video ini akan tampil di panggung paling atas halaman.`
    : `Gunakan tombol <em>Cari di YouTube</em>, pilih video yang tepat untuk <strong>${escapeHtml(item.name)}</strong>, lalu tempel link aslinya ke kartu ini.`;
  container.innerHTML = `<div class="placeholder"><div><p><strong>Belum ada video tersimpan.</strong></p><p>${helpText}</p></div></div>`;
}
async function saveVideoForItem(itemId, youtubeUrl) {
  if (state.backend === 'api') {
    const res = await apiFetchWithAdmin(`/api/items/${encodeURIComponent(itemId)}/video`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ youtubeUrl }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan.');
    mergeOverrideFromItem(data.item);
    return data.message;
  }
  const parsed = normalizeYoutubeUrl(youtubeUrl);
  if (!parsed.valid) throw new Error(parsed.reason);
  const overrides = getLocalOverrides();
  overrides[itemId] = { ...(overrides[itemId] || {}), youtubeUrl: parsed.watchUrl, videoId: parsed.videoId, embedUrl: parsed.embedUrl, updatedAt: new Date().toISOString() };
  setLocalOverrides(overrides);
  return 'Video tersimpan di browser ini dan akan tampil lagi saat Anda membuka situs ini pada browser yang sama.';
}
async function saveMetaForItem(itemId, payload) {
  const websiteInfo = normalizePublicUrl(payload.websiteUrl || '');
  if (!websiteInfo.valid) throw new Error(websiteInfo.reason);
  const downloadInfo = normalizePublicUrl(payload.downloadUrl || '');
  if (!downloadInfo.valid) throw new Error(downloadInfo.reason.replace('website', 'download'));
  const body = {
    name: String(payload.name || '').trim(),
    searchQuery: String(payload.searchQuery || payload.name || '').trim(),
    description: String(payload.description || '').trim(),
    websiteUrl: websiteInfo.value,
    downloadUrl: downloadInfo.value
  };
  if (!body.name) throw new Error('Judul kartu tidak boleh kosong.');
  if (!body.searchQuery) body.searchQuery = body.name;
  if (state.backend === 'api') {
    const res = await apiFetchWithAdmin(`/api/items/${encodeURIComponent(itemId)}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan info kartu.');
    mergeOverrideFromItem(data.item);
    return data.message;
  }
  const overrides = getLocalOverrides();
  overrides[itemId] = { ...(overrides[itemId] || {}), ...body, domain: websiteInfo.domain, updatedAt: new Date().toISOString() };
  setLocalOverrides(overrides);
  return 'Info kartu tersimpan di browser ini.';
}

async function clearVideoForItem(itemId) {
  if (state.backend === 'api') {
    const res = await apiFetchWithAdmin(`/api/items/${encodeURIComponent(itemId)}/video`, { method:'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus video.');
    mergeOverrideFromItem(data.item);
    return data.message || 'Video berhasil dihapus.';
  }
  const db = await loadLocalDb();
  const item = db.items.find((entry) => entry.id === itemId);
  if (!item) throw new Error('Item tidak ditemukan.');
  item.youtubeUrl = '';
  item.videoId = '';
  item.embedUrl = '';
  item.updatedAt = new Date().toISOString();
  mergeOverrideFromItem(item);
  return 'Video dihapus pada preview lokal.';
}

async function deleteCardItem(itemId) {
  if (state.backend === 'api') {
    const res = await apiFetchWithAdmin(`/api/items/${encodeURIComponent(itemId)}`, { method:'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus kartu.');
    const overrides = getLocalOverrides();
    delete overrides[itemId];
    setLocalOverrides(overrides);
    return data.message || 'Kartu video berhasil dihapus permanen.';
  }
  const db = await loadLocalDb();
  db.items = (db.items || []).filter((entry) => entry.id !== itemId);
  state.localDb = db;
  const overrides = getLocalOverrides();
  delete overrides[itemId];
  setLocalOverrides(overrides);
  return 'Kartu video dihapus permanen pada preview lokal.';
}
async function createCustomItem(payload) {
  if (state.backend !== 'api') throw new Error('Tambah kartu baru membutuhkan mode server.');
  const res = await apiFetchWithAdmin('/api/items', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal membuat kartu baru.');
  mergeOverrideFromItem(data.item);
  return data;
}
async function bulkSaveRows(rows) {
  if (state.backend === 'api') {
    const res = await apiFetchWithAdmin('/api/bulk', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ rows }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Bulk import gagal.');
    return data;
  }
  const db = await loadLocalDb();
  const overrides = getLocalOverrides();
  const errors = [];
  let updated = 0;
  for (const row of rows) {
    const itemName = String(row.itemName || '').trim().toLowerCase();
    const youtubeUrl = String(row.youtubeUrl || '').trim();
    if (!itemName || !youtubeUrl) { errors.push({ row, error: 'Nama item atau URL kosong.' }); continue; }
    const item = (db.items || []).find((entry) => String(entry.name || '').toLowerCase() === itemName);
    if (!item) { errors.push({ row, error: 'Item tidak ditemukan.' }); continue; }
    const parsed = normalizeYoutubeUrl(youtubeUrl);
    if (!parsed.valid) { errors.push({ row, error: parsed.reason }); continue; }
    overrides[item.id] = { ...(overrides[item.id] || {}), youtubeUrl: parsed.watchUrl, videoId: parsed.videoId, embedUrl: parsed.embedUrl, updatedAt: new Date().toISOString() };
    updated += 1;
  }
  setLocalOverrides(overrides);
  return { updated, errors };
}
function renderCards() {
  cardsEl.innerHTML = '';
  const items = currentPageItems();
  if (!items.length) {
    cardsEl.innerHTML = `<div class="panel helper"><p class="panel-label">Kosong</p><p>Tidak ada item yang cocok dengan filter saat ini.</p></div>`;
    return;
  }
  items.forEach((item) => {
    const node = template.content.cloneNode(true);
    const article = node.querySelector('.manager-card');
    const frame = node.querySelector('.video-frame');
    const tiny = node.querySelector('.tiny');
    const chip = node.querySelector('.chip');
    const title = node.querySelector('.card-title');
    const query = node.querySelector('.card-query');
    const searchButton = node.querySelector('.yt-search');
    const shuffleSearchButton = node.querySelector('.shuffle-search');
    const openSite = node.querySelector('.open-site');
    const openWatch = node.querySelector('.open-watch');
    const openDownload = node.querySelector('.open-download');
    const saveButton = node.querySelector('.save-video');
    const clearButton = node.querySelector('.clear-video');
    const deleteCardButton = node.querySelector('.delete-card');
    const input = node.querySelector('.video-input');
    const note = node.querySelector('.save-note');
    const metaBox = node.querySelector('.meta-edit-box');
    const nameInput = node.querySelector('.name-input');
    const queryInput = node.querySelector('.query-input');
    const websiteInput = node.querySelector('.website-input');
    const descInput = node.querySelector('.desc-input');
    const downloadInput = node.querySelector('.download-input');
    const saveMetaButton = node.querySelector('.save-meta');

    article.dataset.itemId = item.id;
    tiny.textContent = item.isOpeningReel ? 'Live opening reel' : (item.group || 'Custom card');
    chip.textContent = item.isOpeningReel ? `${item.category.toUpperCase()} · OPENING REEL` : (item.isCustom ? `${item.category.toUpperCase()} · CUSTOM` : item.category.toUpperCase());
    title.textContent = item.name;
    query.textContent = item.isOpeningReel ? `Video pembuka halaman ${item.category}. Kata kunci pencarian: ${item.searchQuery || item.name}` : `Kata kunci pencarian: ${item.searchQuery || item.name}`;
    searchButton.href = youtubeSearchUrl(item.searchQuery || item.name);

    if (shuffleSearchButton) {
      shuffleSearchButton.addEventListener('click', () => {
        const payload = {
          category: item.category,
          title: nameInput?.value || item.name,
          searchQuery: queryInput?.value || item.searchQuery || item.name,
          websiteUrl: websiteInput?.value || item.websiteUrl || ''
        };
        const nextQuery = getDirectedSearchCandidate(item.id, payload);
        if (!nextQuery) {
          note.textContent = 'Judul kartu perlu diisi lebih dulu agar pencarian terarah bisa dibuat.';
          return;
        }
        if (queryInput) queryInput.value = nextQuery;
        const nextHref = youtubeSearchUrl(nextQuery);
        searchButton.href = nextHref;
        window.open(nextHref, '_blank', 'noopener,noreferrer');
        note.textContent = `Pencarian terarah dibuka: ${nextQuery}`;
      });
    }

    if (item.embedUrl) {
      frame.innerHTML = `<iframe loading="lazy" src="${item.embedUrl}" title="${escapeHtml(item.name)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      openWatch.classList.remove('hidden');
      openWatch.href = item.youtubeUrl;
    } else {
      renderPlaceholder(frame, item);
      openWatch.classList.add('hidden');
      openWatch.removeAttribute('href');
    }

    if (item.websiteUrl) {
      openSite.classList.remove('hidden');
      openSite.href = item.websiteUrl;
    } else {
      openSite.classList.add('hidden');
      openSite.removeAttribute('href');
    }

    if (item.downloadUrl) {
      openDownload.classList.remove('hidden');
      openDownload.href = item.downloadUrl;
    } else {
      openDownload.classList.add('hidden');
      openDownload.removeAttribute('href');
    }

    input.value = item.youtubeUrl || '';
    const canClearVideo = !!item.videoId;
    clearButton.classList.toggle('hidden', !canClearVideo);
    clearButton.disabled = !canClearVideo;
    clearButton.setAttribute('aria-disabled', String(!canClearVideo));
    if (deleteCardButton) {
      const canDeleteCard = !item.isOpeningReel;
      deleteCardButton.classList.toggle('hidden', !canDeleteCard);
      deleteCardButton.disabled = !canDeleteCard;
      deleteCardButton.setAttribute('aria-disabled', String(!canDeleteCard));
    }
    note.textContent = item.embedUrl
      ? (item.isOpeningReel ? 'Live opening reel aktif. Video bisa diganti atau dihapus kapan saja.' : 'Video tersimpan permanen. Gunakan Acak Sesuai Judul, ganti link, atau hapus video bila perlu.')
      : (item.isOpeningReel ? 'Belum ada live opening reel tersimpan. Simpan link video untuk mengganti panggung pembuka halaman.' : 'Belum ada video tersimpan. Gunakan Acak Sesuai Judul untuk membuka hasil pencarian yang lebih tepat.');

    if (supportsEditablePublicLink(item)) {
      metaBox.classList.remove('hidden');
      nameInput.value = item.name || '';
      queryInput.value = item.searchQuery || item.name || '';
      websiteInput.value = item.websiteUrl || '';
      descInput.value = item.description || '';
      if (downloadInput) downloadInput.value = item.downloadUrl || '';
      saveMetaButton.addEventListener('click', async () => {
        note.textContent = 'Menyimpan info kartu...';
        try {
          const message = await saveMetaForItem(item.id, { name: nameInput.value, searchQuery: queryInput.value, websiteUrl: websiteInput.value, description: descInput.value, downloadUrl: downloadInput?.value || '' });
          note.textContent = message;
          broadcastRegistryUpdate();
          state.focusItemId = item.id;
          await refresh();
        } catch (error) {
          note.textContent = error.message;
        }
      });
    }

    saveButton.addEventListener('click', async () => {
      const youtubeUrl = input.value.trim();
      note.textContent = 'Menyimpan video...';
      try {
        const message = await saveVideoForItem(item.id, youtubeUrl);
        note.textContent = message;
        broadcastRegistryUpdate();
        state.focusItemId = item.id;
        state.pendingEditJump = true;
        await refresh();
      } catch (error) {
        note.textContent = error.message;
      }
    });
    clearButton?.addEventListener('click', async () => {
      if (!item.videoId) return;
      if (!await confirmAction(`Hapus video dari kartu "${item.name}" secara permanen?`, { title: 'Delete video permanently', confirmText: 'Delete video', tone: 'danger', details: ['Video embed akan dihapus', 'Perubahan langsung tersimpan', 'Tidak bisa dibatalkan'] })) return;
      note.textContent = 'Menghapus video...';
      try {
        const message = await clearVideoForItem(item.id);
        note.textContent = message;
        broadcastRegistryUpdate();
        state.focusItemId = item.id;
        state.pendingEditJump = true;
        await refresh();
      } catch (error) {
        note.textContent = error.message;
      }
    });
    deleteCardButton?.addEventListener('click', async () => {
      if (!item.isCustom) return;
      if (!await confirmAction(`Hapus kartu video "${item.name}" secara permanen dari website?`, { title: 'Delete card permanently', confirmText: 'Delete card', tone: 'danger', details: ['Kartu hilang dari website', 'Metadata ikut terhapus', 'Tidak bisa dikembalikan'] })) return;
      note.textContent = 'Menghapus kartu video...';
      try {
        const message = await deleteCardItem(item.id);
        note.textContent = message;
        broadcastRegistryUpdate();
        state.focusItemId = '';
        state.pendingEditJump = true;
        await refresh();
      } catch (error) {
        note.textContent = error.message;
      }
    });
    cardsEl.appendChild(node);
  });
  if (!focusRequestedItem()) jumpToEditingViewport();
}
async function refresh() {
  try {
    await Promise.all([fetchMetaAndItems(), fetchFooterSocials(), fetchCommentModeration()]);
    syncUrlState();
    renderStats();
    updateTitle();
    renderCards();
    renderPager();
    renderFooterSocialsAdmin();
    renderCommentModeration();
    if (state.pendingEditJump) jumpToEditingViewport();
  } catch (error) {
    statusBarEl.textContent = error.message;
    renderCommentModeration();
  }
}
searchInput?.addEventListener('input', () => { state.query = searchInput.value.trim(); state.page = 1; refresh(); });
missingOnly?.addEventListener('change', () => { state.missingOnly = missingOnly.checked; state.page = 1; refresh(); });
reloadButton?.addEventListener('click', () => { state.pendingEditJump = true; refresh(); });
categoryPills?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  categoryPills.querySelectorAll('.pill').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  state.category = button.dataset.category || '';
  state.page = 1;
  state.focusItemId = '';
  state.pendingEditJump = true;
  refresh();
});
openBulkButton?.addEventListener('click', () => { bulkResult.textContent = ''; bulkDialog.showModal(); });
bulkSaveButton?.addEventListener('click', async () => {
  const rows = bulkText.value.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [left, ...rest] = line.split('|');
    return { itemName: (left || '').trim(), youtubeUrl: rest.join('|').trim() };
  });
  bulkResult.textContent = 'Menyimpan bulk...';
  try {
    const data = await bulkSaveRows(rows);
    bulkResult.innerHTML = `<strong>${data.updated}</strong> item diperbarui.${data.errors.length ? ` Ada ${data.errors.length} error.` : ''}`;
    broadcastRegistryUpdate();
    await refresh();
  } catch (error) {
    bulkResult.textContent = error.message;
  }
});
if (exportJsonButton) {
  exportJsonButton.addEventListener('click', async () => {
    exportJsonButton.disabled = true;
    exportJsonButton.textContent = 'Menyiapkan…';
    try {
      const res = await apiFetchWithAdmin('/api/export', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Export gagal.');
      }
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.download = 'pulseboard-export.json';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(href);
    } catch (error) {
      statusBarEl.textContent = error.message;
    } finally {
      exportJsonButton.disabled = false;
      exportJsonButton.textContent = 'Export JSON';
    }
  });
}
function openCreateDialog() {
  const preferred = EDITABLE_LINK_CATEGORIES.has(state.category) ? state.category : 'home';
  createCategory.value = preferred;
  createName.value = '';
  createWebsite.value = '';
  createSearchQuery.value = '';
  createDescription.value = '';
  createYoutube.value = '';
  if (createDownload) createDownload.value = '';
  createResult.textContent = '';
  createDialog.showModal();
}
openCreateButtons.forEach((button) => button.addEventListener('click', openCreateDialog));
createSaveButton?.addEventListener('click', async () => {
  createResult.textContent = 'Membuat kartu...';
  try {
    const payload = {
      category: createCategory.value,
      name: createName.value.trim(),
      websiteUrl: createWebsite.value.trim(),
      searchQuery: createSearchQuery.value.trim() || createName.value.trim(),
      description: createDescription.value.trim(),
      youtubeUrl: createYoutube.value.trim(),
      downloadUrl: createDownload?.value.trim() || ''
    };
    const data = await createCustomItem(payload);
    createResult.textContent = data.message;
    broadcastRegistryUpdate();
    state.category = data.item.category;
    state.focusItemId = data.item.id;
    state.page = 1;
    state.pendingEditJump = true;
    await refresh();
  } catch (error) {
    createResult.textContent = error.message;
  }
});

[openSocialButton, sidebarSocialButton].filter(Boolean).forEach((button) => button.addEventListener('click', () => openSocialDialog()));
socialSaveButton?.addEventListener('click', async () => {
  socialResult.textContent = 'Menyimpan social media...';
  try {
    const payload = {
      id: socialEditId.value.trim(),
      name: socialName.value.trim(),
      icon: socialIcon.value.trim(),
      href: socialLink.value.trim()
    };
    const data = await saveFooterSocial(payload);
    socialResult.textContent = data.message || 'Social media tersimpan.';
    await fetchFooterSocials();
    renderFooterSocialsAdmin();
    broadcastRegistryUpdate();
  } catch (error) {
    socialResult.textContent = error.message;
  }
});
socialListEl?.addEventListener('click', async (event) => {
  const card = event.target.closest('[data-social-id]');
  if (!card) return;
  const social = state.footerSocials.find((entry) => entry.id === card.dataset.socialId);
  if (!social) return;
  if (event.target.closest('.social-edit')) {
    openSocialDialog(social);
    return;
  }
  if (event.target.closest('.social-delete')) {
    if (!await confirmAction(`Hapus social media "${social.name}" secara permanen dari footer?`, { title: 'Delete footer social', confirmText: 'Delete social', tone: 'danger', details: ['Tautan footer akan hilang', 'Perubahan tampil ke publik'] })) return;
    try {
      await deleteFooterSocial(social.id);
      await fetchFooterSocials();
      renderFooterSocialsAdmin();
      broadcastRegistryUpdate();
    } catch (error) {
      statusBarEl.textContent = error.message;
    }
  }
});

refreshCommentModerationButton?.addEventListener('click', async () => {
  if (commentModerationStatusEl) commentModerationStatusEl.textContent = 'Memuat komentar moderasi...';
  try {
    await fetchCommentModeration({ forcePrompt: true });
    renderCommentModeration();
  } catch (error) {
    if (commentModerationStatusEl) commentModerationStatusEl.textContent = error.message;
  }
});
commentModerationListEl?.addEventListener('click', async (event) => {
  const card = event.target.closest('[data-comment-id]');
  const button = event.target.closest('[data-comment-action]');
  if (!card || !button) return;
  const commentId = card.dataset.commentId;
  const action = button.dataset.commentAction;
  const comment = (state.commentModeration || []).find((entry) => entry.id === commentId);
  if (!comment) return;
  try {
    if (action === 'hide') {
      if (!await confirmAction(`Sembunyikan komentar dari ${comment.name} dari tampilan publik?`, { title: 'Hide public comment', confirmText: 'Hide comment', details: ['Komentar tetap tersimpan di dashboard', 'Publik tidak akan melihat komentar ini'] })) return;
      commentModerationStatusEl.textContent = await moderateCommentVisibility(commentId, 'hide');
    } else if (action === 'show') {
      commentModerationStatusEl.textContent = await moderateCommentVisibility(commentId, 'show');
    } else if (action === 'delete') {
      if (!await confirmAction(`Hapus komentar dari ${comment.name} secara permanen dari database?`, { title: 'Delete comment permanently', confirmText: 'Delete comment', tone: 'danger', details: ['Data komentar akan dihapus', 'Tidak dapat dipulihkan lagi'] })) return;
      commentModerationStatusEl.textContent = await deleteModeratedComment(commentId);
    }
    await fetchCommentModeration({ forcePrompt: false });
    renderCommentModeration();
  } catch (error) {
    commentModerationStatusEl.textContent = error.message;
  }
});

registryChannel?.addEventListener('message', (event) => { if (event?.data?.type === 'registry-updated') refresh(); });
window.addEventListener('storage', (event) => { if (event.key === REGISTRY_UPDATED_KEY) refresh(); });
window.addEventListener('focus', refresh);
applyStateFromUrl();
refresh();
