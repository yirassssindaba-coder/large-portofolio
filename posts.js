const ADMIN_TOKEN_KEY = 'pulseboard-admin-token';
const postState = {
  page: 1,
  limit: 8,
  query: '',
  status: '',
  category: '',
  sort: 'updated_desc',
  includeDeleted: false,
  editingId: '',
  previewMode: true,
  publicPosts: [],
  historyPosts: []
};

const els = {
  mode: document.getElementById('postsModePill') || document.getElementById('storageMode'),
  stats: document.getElementById('postStats'),
  historyLead: document.getElementById('postHistoryLead'),
  historyPills: document.getElementById('postHistoryPills'),
  historyCopy: document.getElementById('postHistoryCopy'),
  historyTimeline: document.getElementById('postHistoryTimeline'),
  historyLanes: document.getElementById('postHistoryLanes'),
  historyNotes: document.getElementById('postHistoryNotes'),
  list: document.getElementById('postList'),
  pager: document.getElementById('postPager'),
  listMeta: document.getElementById('postListMeta'),
  activityList: document.getElementById('activityList'),
  message: document.getElementById('postMessage'),
  editorTitle: document.getElementById('editorTitle'),
  editorModeChip: document.getElementById('editorModeChip'),
  newBtn: document.getElementById('newPostButton'),
  refreshBtn: document.getElementById('refreshPostsButton'),
  exportBtn: document.getElementById('exportPostsButton'),
  search: document.getElementById('postSearchInput'),
  status: document.getElementById('postStatusFilter'),
  category: document.getElementById('postCategoryFilter'),
  sort: document.getElementById('postSortSelect'),
  includeDeleted: document.getElementById('includeDeletedFilter'),
  form: document.getElementById('postForm'),
  postId: document.getElementById('postId'),
  title: document.getElementById('postTitle'),
  slug: document.getElementById('postSlug'),
  excerpt: document.getElementById('postExcerpt'),
  content: document.getElementById('postContent'),
  categoryInput: document.getElementById('postCategory'),
  statusInput: document.getElementById('postStatus'),
  author: document.getElementById('postAuthor'),
  cover: document.getElementById('postCover'),
  tags: document.getElementById('postTags'),
  featured: document.getElementById('postFeatured'),
  reset: document.getElementById('resetPostButton'),
  archive: document.getElementById('archivePostButton'),
  softDelete: document.getElementById('softDeletePostButton'),
  restore: document.getElementById('restorePostButton')
};

function getAdminToken() { return sessionStorage.getItem(ADMIN_TOKEN_KEY) || ''; }
function setAdminToken(token) { if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token); else sessionStorage.removeItem(ADMIN_TOKEN_KEY); }

async function verifyAdminToken(token) {
  const res = await fetch('/api/auth/check', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Admin token tidak valid.');
  return true;
}

async function ensureAdminToken(interactive = true) {
  let token = getAdminToken();
  if (!token && interactive) token = await (window.PulseboardUI?.requestDeveloperToken?.({
    title: 'Post Studio Access',
    subtitle: 'Masukkan admin token untuk mengaktifkan mode CRUD penuh, publish, archive, dan edit postingan.',
    submitText: 'Buka Post Studio',
    validate: verifyAdminToken
  }) || '');
  if (!token) throw new Error('Mode aman aktif. Masukkan admin token untuk edit.');
  await verifyAdminToken(token);
  setAdminToken(token);
  return token;
}

async function apiFetch(url, options = {}) {
  const token = await ensureAdminToken(true);
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && options.method && options.method !== 'GET') headers.set('Content-Type', 'application/json');
  const response = await fetch(url, { ...options, headers, cache: 'no-store' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request gagal.');
  return data;
}

async function publicFetch(url, fallback = null) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } catch (error) {
    if (!fallback) throw error;
    const res = await fetch(fallback, { cache: 'no-store' });
    if (!res.ok) throw error;
    return await res.json();
  }
}

function showMessage(text, ok = true) {
  if (!els.message) return;
  els.message.textContent = text;
  els.message.className = `post-note ${ok ? 'is-ok' : 'is-error'}`;
}
function escapeHtml(value) {
  return String(value || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'", '&#39;');
}
function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}
function resetEditor() {
  els.form.reset();
  els.postId.value = '';
  els.author.value = 'Developer';
  els.statusInput.value = 'draft';
  els.categoryInput.value = 'tanaman';
  els.editorTitle.textContent = 'Tambah postingan';
  els.editorModeChip.textContent = postState.previewMode ? 'Preview' : 'Create';
  postState.editingId = '';
}
function fillEditor(post) {
  els.postId.value = post.id;
  els.title.value = post.title || '';
  els.slug.value = post.slug || '';
  els.excerpt.value = post.excerpt || '';
  els.content.value = post.content || '';
  els.categoryInput.value = post.category || 'tanaman';
  els.statusInput.value = post.status || 'draft';
  els.author.value = post.author || 'Developer';
  els.cover.value = post.cover || '';
  els.tags.value = (post.tags || []).join(', ');
  els.featured.checked = !!post.featured;
  els.editorTitle.textContent = 'Edit postingan';
  els.editorModeChip.textContent = 'Update';
  postState.editingId = post.id;
}

function setPreviewMode(enabled) {
  postState.previewMode = enabled;
  if (els.mode) els.mode.textContent = enabled ? 'Preview publik' : 'Editor aktif';
  els.editorModeChip.textContent = enabled ? 'Preview' : (postState.editingId ? 'Update' : 'Create');
  [els.archive, els.softDelete, els.restore].forEach((button) => {
    button.disabled = enabled;
    button.title = enabled ? 'Butuh admin token' : '';
  });
}

function summarizePosts(posts) {
  const active = posts.filter((post) => !post.deletedAt);
  return {
    total: active.length,
    published: active.filter((post) => post.status === 'published').length,
    drafts: active.filter((post) => post.status === 'draft').length,
    review: active.filter((post) => post.status === 'review').length,
    archived: active.filter((post) => post.status === 'archived').length
  };
}

function setIntroMetric(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = String(value ?? '—');
}

function renderIntroMetrics(summary) {
  setIntroMetric('[data-post-intro-active]', summary.total ?? 0);
  setIntroMetric('[data-post-intro-published]', summary.published ?? 0);
  setIntroMetric('[data-post-intro-draft]', summary.drafts ?? 0);
}

function renderStats(summary) {
  els.stats.innerHTML = [
    ['Total aktif', summary.total],
    ['Published', summary.published],
    ['Draft', summary.drafts],
    ['Review', summary.review],
    ['Archived', summary.archived]
  ].map(([label, value]) => `<article class="stat-card"><strong>${value}</strong><span>${label}</span><span>Post Studio</span></article>`).join('');
  renderIntroMetrics(summary);
}

function categoryLabel(value) {
  const map = {
    tanaman: 'Green Atlas',
    hewan: 'Wild Echo',
    teknologi: 'Tech Forge',
    portfolio: 'Studio Deck',
    umum: 'PulseBoard Core',
    news: 'News Desk',
    commerce: 'E-Commerce',
    garden: 'Azka Garden'
  };
  return map[String(value || '').toLowerCase()] || String(value || 'General');
}

function buildHistorySummary(posts) {
  const published = posts.filter((post) => post.status === 'published' && !post.deletedAt);
  const sorted = published.slice().sort((a, b) => new Date(a.publishedAt || a.createdAt || 0) - new Date(b.publishedAt || b.createdAt || 0));
  const latest = published.slice().sort((a, b) => new Date(b.updatedAt || b.publishedAt || 0) - new Date(a.updatedAt || a.publishedAt || 0));
  const categories = [...new Set(sorted.map((post) => categoryLabel(post.category)))];
  return { published, sorted, latest, categories };
}

function renderProjectHistory(posts, events = []) {
  const { published, sorted, latest, categories } = buildHistorySummary(posts);
  const firstDate = sorted[0] ? formatDate(sorted[0].publishedAt || sorted[0].createdAt) : '—';
  const lastDate = latest[0] ? formatDate(latest[0].updatedAt || latest[0].publishedAt || latest[0].createdAt) : '—';
  const timeline = latest.slice(0, 6);
  const activeComments = events.filter((event) => String(event.type || '').includes('comment')).length;

  if (els.historyLead) {
    els.historyLead.textContent = `PulseBoard Fusion berkembang dari portal showcase menjadi sistem multi-lane yang menggabungkan katalog visual, opening reel, halaman spesialis, Pulse Stories, dan Post Studio. Riwayat ini merangkum jalur pembentukan website dari fase awal sampai update publik terbaru agar ruang studio tetap penuh, terbaca, dan terasa seperti dokumentasi proyek yang aktif.`;
  }

  if (els.historyPills) {
    const pills = [
      ['Awal publik', firstDate],
      ['Update terbaru', lastDate],
      ['Published post', String(published.length)],
      ['Lane aktif', String(categories.length)],
      ['Komentar publik', String(activeComments)]
    ];
    els.historyPills.innerHTML = pills.map(([label, value]) => `<span class="pill">${escapeHtml(label)} · ${escapeHtml(value)}</span>`).join('');
  }

  if (els.historyCopy) {
    const copyCards = [
      {
        title: 'Fondasi portal utama',
        text: 'Website dibangun sebagai portal visual terpadu. Struktur header global, lane katalog, showcase, dan page shell dibuat konsisten supaya setiap halaman terasa seperti bagian dari satu sistem, bukan kumpulan halaman yang terpisah.'
      },
      {
        title: 'Ekspansi lane katalog',
        text: `Dari feed publik yang tersedia, ekspansi paling terlihat datang dari ${categories.slice(0, 4).join(', ')}${categories.length > 4 ? ' dan lane lain' : ''}. Ini membuat PulseBoard berubah dari showcase tunggal menjadi atlas multi-topik yang terus bertambah.`
      },
      {
        title: 'Masuk ke mode editorial',
        text: 'Setelah struktur halaman terbentuk, Pulse Stories dan Post Studio menambahkan lapisan editorial: published feed, workflow CRUD, audit activity, dan sekarang sejarah proyek agar studio tidak terasa kosong saat dibaca sebagai dashboard.'
      }
    ];
    els.historyCopy.innerHTML = copyCards.map((card) => `
      <article class="post-history-copycard">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.text)}</p>
      </article>
    `).join('');
  }

  if (els.historyTimeline) {
    if (!timeline.length) {
      els.historyTimeline.innerHTML = '<div class="empty-panel"><strong>Belum ada milestone publik.</strong><span>Publish post dari studio untuk membentuk timeline proyek.</span></div>';
    } else {
      els.historyTimeline.innerHTML = timeline.map((post, index) => `
        <article class="post-history-event">
          <div class="post-history-event__index">${String(index + 1).padStart(2, '0')}</div>
          <div class="post-history-event__body">
            <div class="micro">${escapeHtml(categoryLabel(post.category))} · ${escapeHtml(formatDate(post.publishedAt || post.createdAt))}</div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.excerpt || post.content || '')}</p>
          </div>
        </article>
      `).join('');
    }
  }

  if (els.historyLanes) {
    const grouped = new Map();
    published.forEach((post) => {
      const key = categoryLabel(post.category);
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });
    const laneCards = Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }))
      .slice(0, 8);
    els.historyLanes.innerHTML = laneCards.map((lane) => `
      <article class="post-history-lane">
        <span>${escapeHtml(lane.label)}</span>
        <strong>${escapeHtml(String(lane.count))}</strong>
        <p>Update publik yang ikut membentuk lane ini di PulseBoard Fusion.</p>
      </article>
    `).join('');
  }

  if (els.historyNotes) {
    const notes = [
      'Bagian sejarah dipasang untuk mengisi ruang Post Studio dengan konteks proyek, bukan sekadar angka ringkasan.',
      'Timeline mengambil dasar dari published post yang sudah tersimpan, jadi halaman ini ikut berfungsi sebagai dokumentasi perubahan website.',
      'Footer pada Post Studio dibuat full bleed agar menempel ke tepi kiri, kanan, dan bawah viewport sehingga penutup halaman terasa lebih final.'
    ];
    els.historyNotes.innerHTML = notes.map((text) => `<article class="post-history-note"><p>${escapeHtml(text)}</p></article>`).join('');
  }
}

function applyClientFilters(posts) {
  const q = postState.query.toLowerCase();
  let out = posts.slice();
  if (q) out = out.filter((post) => [post.title, post.excerpt, post.slug, post.author, ...(post.tags || [])].join(' ').toLowerCase().includes(q));
  if (postState.status) out = out.filter((post) => post.status === postState.status);
  if (postState.category) out = out.filter((post) => post.category === postState.category);
  out.sort((a, b) => {
    if (postState.sort === 'title_asc') return a.title.localeCompare(b.title);
    if (postState.sort === 'status_asc') return a.status.localeCompare(b.status);
    if (postState.sort === 'created_desc') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return new Date(b.updatedAt || b.publishedAt || 0) - new Date(a.updatedAt || a.publishedAt || 0);
  });
  return out;
}

function renderPosts(posts, page = 1, totalPages = 1, total = posts.length) {
  els.listMeta.textContent = `${total} item · halaman ${page}/${totalPages}${postState.previewMode ? ' · preview publik' : ''}`;
  if (!posts.length) {
    els.list.innerHTML = `<div class="empty-panel"><strong>Belum ada data.</strong><span>Coba ubah filter atau publish post baru.</span></div>`;
  } else {
    els.list.innerHTML = posts.map((post) => `
      <article class="post-row ${post.deletedAt ? 'is-deleted' : ''}">
        <div class="post-row-main">
          <div class="micro">${escapeHtml(post.category)} · ${escapeHtml(post.status)}</div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
          <div class="post-row-meta">${escapeHtml(post.slug)} · ${formatDate(post.updatedAt || post.publishedAt)}</div>
        </div>
        <div class="post-row-actions">
          <button class="ghost-button" data-action="edit" data-id="${post.id}">${postState.previewMode ? 'Buka di editor' : 'Edit'}</button>
          <button class="ghost-button" data-action="publish" data-id="${post.id}">${post.status === 'published' ? 'Set Review' : 'Publish'}</button>
          <button class="ghost-button" data-action="archive" data-id="${post.id}">${post.status === 'archived' ? 'Set Draft' : 'Archive'}</button>
          <button class="ghost-button" data-action="delete" data-id="${post.id}">${post.deletedAt ? 'Deleted' : 'Soft Delete'}</button>
          ${post.deletedAt ? `<button class="ghost-button" data-action="restore" data-id="${post.id}">Restore</button>` : ''}
        </div>
      </article>
    `).join('');
  }
  els.pager.innerHTML = Array.from({ length: totalPages }, (_, index) => index + 1)
    .map((num) => `<button class="pager-button ${num === page ? 'is-active' : ''}" data-page="${num}">${num}</button>`)
    .join('');
}

function renderActivity(events) {
  const rows = events.slice(0, 20);
  els.activityList.innerHTML = rows.map((event) => `
    <div class="activity-item">
      <div class="micro">${escapeHtml(event.type || 'event')} · ${formatDate(event.at)}</div>
      <strong>${escapeHtml(event.message || 'Aktivitas tersedia')}</strong>
      <span>${escapeHtml(event.entity || 'post')} · ${escapeHtml(event.entityId || 'seed')}</span>
    </div>`).join('');
}

async function loadPreviewSummaryAndPosts() {
  const data = await publicFetch('/api/posts/public?limit=24', 'db/posts.json');
  const posts = Array.isArray(data.posts) ? data.posts : (data.posts || []);
  const summary = data.summary || summarizePosts(posts);
  postState.publicPosts = posts;
  postState.historyPosts = posts;
  renderStats(summary);
  const filtered = applyClientFilters(posts);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / postState.limit));
  const page = Math.min(postState.page, totalPages);
  const offset = (page - 1) * postState.limit;
  renderPosts(filtered.slice(offset, offset + postState.limit), page, totalPages, total);
}

async function loadPreviewActivity() {
  const data = await publicFetch('/api/posts/activity', 'db/activity.json').catch(() => ({ events: [] }));
  const events = Array.isArray(data.events) ? data.events : [];
  renderActivity(events);
  renderProjectHistory(postState.historyPosts.length ? postState.historyPosts : postState.publicPosts, events);
}

async function loadAdminSummaryAndPosts() {
  const params = new URLSearchParams({ page: String(postState.page), limit: String(postState.limit), sort: postState.sort });
  if (postState.query) params.set('q', postState.query);
  if (postState.status) params.set('status', postState.status);
  if (postState.category) params.set('category', postState.category);
  if (postState.includeDeleted) params.set('includeDeleted', '1');
  const data = await apiFetch(`/api/posts?${params.toString()}`);
  postState.publicPosts = Array.isArray(data.posts) ? data.posts : [];
  try {
    const exportData = await apiFetch('/api/posts/export?sort=updated_desc');
    postState.historyPosts = Array.isArray(exportData.posts) ? exportData.posts : postState.publicPosts;
  } catch {
    postState.historyPosts = postState.publicPosts;
  }
  renderStats(data.summary);
  renderPosts(data.posts, data.page, data.totalPages, data.total);
}

async function loadAdminActivity() {
  const data = await apiFetch('/api/posts/activity');
  const events = data.events || [];
  renderActivity(events);
  renderProjectHistory(postState.historyPosts.length ? postState.historyPosts : postState.publicPosts, events);
}

async function unlockEditor() {
  await ensureAdminToken(true);
  setPreviewMode(false);
  await Promise.all([loadAdminSummaryAndPosts(), loadAdminActivity()]);
  showMessage('Editor aktif. CRUD siap digunakan.');
}

async function editPost(id) {
  if (postState.previewMode) {
    const local = postState.publicPosts.find((post) => post.id === id);
    if (local) fillEditor(local);
    await unlockEditor();
  }
  const data = await apiFetch(`/api/posts/${id}`);
  fillEditor(data.post);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function collectFormPayload() {
  return {
    title: els.title.value.trim(),
    slug: els.slug.value.trim(),
    excerpt: els.excerpt.value.trim(),
    content: els.content.value.trim(),
    category: els.categoryInput.value,
    status: els.statusInput.value,
    author: els.author.value.trim(),
    cover: els.cover.value.trim(),
    tags: els.tags.value.split(',').map((tag) => tag.trim()).filter(Boolean),
    featured: els.featured.checked
  };
}

async function savePost(event) {
  event.preventDefault();
  try {
    if (postState.previewMode) await unlockEditor();
    const payload = collectFormPayload();
    if (postState.editingId) await apiFetch(`/api/posts/${postState.editingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
    else await apiFetch('/api/posts', { method: 'POST', body: JSON.stringify(payload) });
    showMessage('Postingan berhasil disimpan.');
    resetEditor();
    await Promise.all([loadAdminSummaryAndPosts(), loadAdminActivity()]);
  } catch (error) {
    showMessage(error.message, false);
  }
}

async function mutateStatus(id, status) {
  if (postState.previewMode) await unlockEditor();
  await apiFetch(`/api/posts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}
async function softDeletePost(id) {
  if (postState.previewMode) await unlockEditor();
  await apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
}
async function restorePost(id) {
  if (postState.previewMode) await unlockEditor();
  await apiFetch(`/api/posts/${id}/restore`, { method: 'POST', body: '{}' });
}

els.form.addEventListener('submit', savePost);
els.reset.addEventListener('click', () => { resetEditor(); showMessage('Form direset.'); });
els.newBtn.addEventListener('click', async () => {
  try {
    if (postState.previewMode) await unlockEditor();
    resetEditor();
    showMessage('Siap membuat postingan baru.');
  } catch (error) {
    showMessage(error.message, false);
  }
});

els.refreshBtn.addEventListener('click', async () => {
  try {
    if (postState.previewMode) {
      await Promise.all([loadPreviewSummaryAndPosts(), loadPreviewActivity()]);
      showMessage('Preview publik diperbarui.');
    } else {
      await Promise.all([loadAdminSummaryAndPosts(), loadAdminActivity()]);
      showMessage('Data diperbarui.');
    }
  } catch (error) {
    showMessage(error.message, false);
  }
});

els.exportBtn.addEventListener('click', async () => {
  try {
    const data = postState.previewMode
      ? { exportedAt: new Date().toISOString(), total: postState.publicPosts.length, posts: postState.publicPosts }
      : await apiFetch(`/api/posts/export?sort=${encodeURIComponent(postState.sort)}`);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pulseboard-posts-export.json';
    link.click();
    URL.revokeObjectURL(url);
    showMessage('Export JSON selesai.');
  } catch (error) {
    showMessage(error.message, false);
  }
});

['search', 'status', 'category', 'sort'].forEach((key) => {
  els[key].addEventListener(key === 'search' ? 'input' : 'change', async () => {
    postState.query = els.search.value.trim();
    postState.status = els.status.value;
    postState.category = els.category.value;
    postState.sort = els.sort.value;
    postState.page = 1;
    try {
      if (postState.previewMode) await loadPreviewSummaryAndPosts();
      else await loadAdminSummaryAndPosts();
    } catch (error) {
      showMessage(error.message, false);
    }
  });
});

els.includeDeleted.addEventListener('change', async () => {
  postState.includeDeleted = els.includeDeleted.checked;
  postState.page = 1;
  try {
    if (postState.previewMode) {
      showMessage('Soft delete hanya terlihat pada mode editor.', false);
      els.includeDeleted.checked = false;
      postState.includeDeleted = false;
      return;
    }
    await loadAdminSummaryAndPosts();
  } catch (error) {
    showMessage(error.message, false);
  }
});

els.pager.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-page]');
  if (!button) return;
  postState.page = Number(button.dataset.page);
  try {
    if (postState.previewMode) await loadPreviewSummaryAndPosts();
    else await loadAdminSummaryAndPosts();
  } catch (error) {
    showMessage(error.message, false);
  }
});

els.list.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.action;
  try {
    if (action === 'edit') await editPost(id);
    if (action === 'publish') { const nextStatus = button.textContent.includes('Set Review') ? 'review' : 'published'; await mutateStatus(id, nextStatus); }
    if (action === 'archive') { const nextStatus = button.textContent.includes('Set Draft') ? 'draft' : 'archived'; await mutateStatus(id, nextStatus); }
    if (action === 'delete' && button.textContent !== 'Deleted') await softDeletePost(id);
    if (action === 'restore') await restorePost(id);
    if (action !== 'edit' && !postState.previewMode) {
      await Promise.all([loadAdminSummaryAndPosts(), loadAdminActivity()]);
      showMessage('Perubahan berhasil diterapkan.');
    }
  } catch (error) {
    showMessage(error.message, false);
  }
});

els.archive.addEventListener('click', async () => {
  if (!postState.editingId) return showMessage('Pilih postingan dulu.', false);
  try {
    await mutateStatus(postState.editingId, 'archived');
    await Promise.all([loadAdminSummaryAndPosts(), loadAdminActivity()]);
    showMessage('Postingan diarsipkan.');
  } catch (error) {
    showMessage(error.message, false);
  }
});
els.softDelete.addEventListener('click', async () => {
  if (!postState.editingId) return showMessage('Pilih postingan dulu.', false);
  try {
    await softDeletePost(postState.editingId);
    resetEditor();
    await Promise.all([loadAdminSummaryAndPosts(), loadAdminActivity()]);
    showMessage('Postingan di-soft delete.');
  } catch (error) {
    showMessage(error.message, false);
  }
});
els.restore.addEventListener('click', async () => {
  if (!postState.editingId) return showMessage('Pilih postingan dulu.', false);
  try {
    await restorePost(postState.editingId);
    await Promise.all([loadAdminSummaryAndPosts(), loadAdminActivity()]);
    showMessage('Postingan dipulihkan.');
  } catch (error) {
    showMessage(error.message, false);
  }
});

async function boot() {
  try {
    setPreviewMode(true);
    resetEditor();
    await Promise.all([loadPreviewSummaryAndPosts(), loadPreviewActivity()]);
    showMessage('Preview publik siap. Klik Edit atau Tambah Postingan untuk unlock editor.');
  } catch (error) {
    showMessage(`Post Studio gagal memuat preview: ${error.message}`, false);
  }
}

boot();
