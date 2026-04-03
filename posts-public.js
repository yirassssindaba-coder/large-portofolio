(() => {
  const host = document.querySelector('[data-post-feed]');
  if (!host) return;

  const NAME_KEY = 'pulseStoriesName';
  const COMMENT_CACHE_KEY = 'pulseStoriesCommentCache';
  const STORY_ID = 'website-global';
  const EMOJIS = ['😀','😍','🔥','🌱','🐄','🚜','🌍','✨','🎉','💡','❤️','👍'];
  let replyTo = '';
  let uploadedImage = '';
  let overlayOpen = false;
  let overlayFocus = 'form';

  const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const formatDate = (value) => {
    try { return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return value || '—'; }
  };

  const readName = () => {
    try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; }
  };
  const saveName = (value) => {
    try { localStorage.setItem(NAME_KEY, value); } catch {}
  };

  function readCache() {
    try {
      const parsed = JSON.parse(localStorage.getItem(COMMENT_CACHE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeCache(items) {
    try { localStorage.setItem(COMMENT_CACHE_KEY, JSON.stringify(items)); } catch {}
  }

  function cleanComment(raw, options = {}) {
    if (!raw || typeof raw !== 'object') return null;
    const id = String(raw.id || '').trim();
    const localId = String(raw.localId || '').trim();
    const postId = String(raw.postId || '').trim();
    if (!postId) return null;
    return {
      id: id || '',
      localId: localId || '',
      postId,
      parentId: String(raw.parentId || '').trim() || null,
      name: String(raw.name || '').trim().slice(0, 40) || 'Anonim',
      text: String(raw.text || '').trim().slice(0, 2400),
      gifUrl: String(raw.gifUrl || '').trim(),
      stickerUrl: String(raw.stickerUrl || '').trim(),
      imageDataUrl: String(raw.imageDataUrl || '').trim(),
      createdAt: String(raw.createdAt || '').trim() || new Date().toISOString(),
      pendingSync: Boolean(raw.pendingSync || options.pendingSync),
      replies: []
    };
  }

  function flattenComments(items) {
    const flat = [];
    const visit = (item, parentId = null) => {
      const normalized = cleanComment(item);
      if (!normalized) return;
      normalized.parentId = normalized.parentId || parentId || null;
      flat.push({ ...normalized, replies: [] });
      const nested = Array.isArray(item?.replies) ? item.replies : [];
      nested.forEach((reply) => visit(reply, normalized.id || normalized.localId || null));
    };
    (Array.isArray(items) ? items : []).forEach((item) => visit(item, item?.parentId || null));
    return flat;
  }

  function dedupeComments(items) {
    const map = new Map();
    for (const entry of Array.isArray(items) ? items : []) {
      const normalized = cleanComment(entry);
      if (!normalized) continue;
      const key = normalized.id || `local:${normalized.localId}`;
      if (!key) continue;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, normalized);
        continue;
      }
      map.set(key, {
        ...existing,
        ...normalized,
        pendingSync: Boolean(existing.pendingSync && normalized.pendingSync)
      });
    }
    return Array.from(map.values()).sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  }

  function buildSingleReplyLevel(items) {
    const comments = dedupeComments(items).filter((comment) => comment.postId === STORY_ID);
    const validRootKeys = new Set(comments.filter((comment) => !comment.parentId).map((comment) => comment.id || comment.localId));

    const roots = comments
      .filter((comment) => !comment.parentId || !comments.find((entry) => (entry.id || entry.localId) === comment.parentId))
      .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

    return roots.map((root) => {
      const rootKey = root.id || root.localId;
      return {
        ...root,
        replies: comments
          .filter((entry) => entry.parentId && entry.parentId === rootKey)
          .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
          .map((reply) => ({ ...reply, replies: [] }))
      };
    });
  }

  function mergeCache(...groups) {
    const merged = dedupeComments(groups.flat().filter(Boolean));
    writeCache(merged);
    return merged;
  }

  function renderMedia(comment) {
    const media = [];
    if (comment.gifUrl) media.push(`<img src="${escapeHtml(comment.gifUrl)}" alt="GIF komentar" loading="lazy">`);
    if (comment.stickerUrl) media.push(`<img src="${escapeHtml(comment.stickerUrl)}" alt="Sticker komentar" loading="lazy">`);
    if (comment.imageDataUrl) media.push(`<img src="${escapeHtml(comment.imageDataUrl)}" alt="Gambar komentar" loading="lazy">`);
    return media.length ? `<div class="story-comment__media">${media.join('')}</div>` : '';
  }

  function renderThread(nodes, depth = 0) {
    if (!nodes.length) return '<div class="story-comment__empty">Belum ada komentar. Jadilah orang pertama yang menulis tentang website ini.</div>';
    return nodes.map((comment) => {
      const initials = escapeHtml((comment.name || 'A').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || 'A');
      const replyKey = comment.id || comment.localId;
      const replyCount = comment.replies?.length || 0;
      return `
      <article class="story-comment story-comment--depth-${Math.min(depth, 1)}">
        <div class="story-comment__avatar">${initials}</div>
        <div class="story-comment__main">
          <div class="story-comment__head"><strong>${escapeHtml(comment.name)}</strong><span>${formatDate(comment.createdAt)}</span></div>
          <div class="story-comment__body">${escapeHtml(comment.text || '').replace(/\n/g, '<br>')}</div>
          ${renderMedia(comment)}
          ${comment.pendingSync ? '<div class="story-comment__status">Tersimpan lokal. Akan disinkronkan ke server saat server aktif lagi.</div>' : ''}
          ${depth === 0 ? `<div class="story-comment__actions"><button class="ghost-button magnetic" type="button" data-reply-to="${replyKey}">Balas</button>${replyCount ? `<span class="story-comment__replycount">${replyCount} balasan</span>` : ''}</div>` : ''}
          ${comment.replies?.length ? `<div class="story-comment__replies">${renderThread(comment.replies, depth + 1)}</div>` : ''}
        </div>
      </article>
    `;
    }).join('');
  }

  function renderCommentPreview(nodes) {
    const preview = [...(nodes || [])].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6);
    if (!preview.length) {
      return '<article class="story-comment-preview story-comment-preview--empty"><div><strong>Belum ada feedback.</strong><span>Gunakan overlay komentar untuk menulis masukan pertama dengan tampilan yang lebih fokus.</span></div></article>';
    }
    return preview.map((comment) => {
      const count = comment.replies?.length || 0;
      return `
        <article class="story-comment-preview">
          <div class="story-comment-preview__meta"><strong>${escapeHtml(comment.name)}</strong><span>${formatDate(comment.createdAt)}</span></div>
          <div class="story-comment-preview__text">${escapeHtml((comment.text || 'Komentar tanpa teks.').slice(0, 160))}</div>
          <div class="story-comment-preview__foot">
            <span>${count ? `${count} balasan` : 'Komentar utama'}</span>
            <button class="ghost-button magnetic" type="button" data-reply-to="${comment.id || comment.localId}">Balas di overlay</button>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderComposer() {
    return `
      <form class="story-form story-form--overlay" data-story-form="${STORY_ID}">
        <label><span>Nama</span><input type="text" maxlength="40" value="${escapeHtml(readName())}" data-story-name></label>
        <label><span>Komentar website keseluruhan</span><textarea rows="6" placeholder="Tulis komentar, masukan, update, atau balasan tentang website ini secara keseluruhan..." data-story-text></textarea></label>
        <div class="story-emoji-row">
          ${EMOJIS.map((emoji) => `<button class="story-emoji" type="button" data-add-emoji="${emoji}">${emoji}</button>`).join('')}
          <span class="story-emoji-note">Balasan tetap satu tingkat supaya thread bersih dan mudah dibaca.</span>
        </div>
        <details class="story-form__optional">
          <summary>Tambahkan media opsional</summary>
          <div class="story-form__grid">
            <label><span>GIF URL</span><input type="url" placeholder="https://...gif" data-story-gif></label>
            <label><span>Sticker URL</span><input type="url" placeholder="https://...png/webp" data-story-sticker></label>
            <label><span>Gambar URL</span><input type="url" placeholder="https://...jpg/png/webp" data-story-image-url></label>
          </div>
          <div class="story-form__grid story-form__grid--upload">
            <label><span>Upload gambar</span><input type="file" accept="image/*" data-story-image-file></label>
            <div class="story-upload-preview" data-story-upload-preview>${uploadedImage ? `<img src="${escapeHtml(uploadedImage)}" alt="Preview upload">` : '<span>Preview upload gambar muncul di sini.</span>'}</div>
          </div>
        </details>
        ${replyTo ? `<div class="story-reply-banner">Sedang membalas satu komentar. <button class="ghost-button magnetic" type="button" data-cancel-reply>Batal balas</button></div>` : ''}
        <input type="hidden" value="${replyTo}" data-story-parent-id>
        <div class="story-form__actions"><button class="button magnetic" type="submit">Kirim ke Pulse Stories</button></div>
        <div class="story-form__message" data-story-message></div>
      </form>
    `;
  }

  async function fetchPublishedPosts() {
    try {
      const res = await fetch('/api/posts/public?limit=6', { cache: 'no-store' });
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      if (Array.isArray(data.posts)) return data.posts;
    } catch {}
    try {
      const res = await fetch('./db/posts.json', { cache: 'no-store' });
      const data = await res.json();
      return Array.isArray(data.posts) ? data.posts.filter((post) => !post.deletedAt && post.status === 'published') : [];
    } catch {
      return [];
    }
  }


async function fetchRegistryItems() {
  try {
    const res = await fetch('/api/items', { cache: 'no-store' });
    if (!res.ok) throw new Error('api');
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {}
  try {
    const res = await fetch('./db/items.json', { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

function renderLeadVideo(item) {
  if (!item?.videoId || !item?.embedUrl) return '';
  const title = escapeHtml(item.name || 'Azka Garden lane');
  const watchUrl = escapeHtml(item.youtubeUrl || `https://www.youtube.com/watch?v=${item.videoId}`);
  return `
    <div class="story-feedback-lead__media">
      <div class="story-feedback-video">
        <iframe loading="lazy" src="${escapeHtml(item.embedUrl)}" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="story-feedback-video__meta">
        <span class="pill">Azka Garden lane</span>
        <span class="pill">Live opening reel</span>
        <a class="ghost-button magnetic" href="${watchUrl}" target="_blank" rel="noreferrer">Buka Video</a>
      </div>
    </div>`;
}

  async function postCommentToServer(payload) {
    const res = await fetch('/api/story-comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Gagal');
    return cleanComment(data.comment || payload);
  }

  async function syncPendingComments() {
    const cached = readCache();
    const pending = cached.filter((comment) => comment.postId === STORY_ID && comment.pendingSync);
    if (!pending.length) return cached;

    let working = cached.slice();
    for (const draft of pending) {
      try {
        const synced = await postCommentToServer({
          postId: draft.postId,
          parentId: draft.parentId,
          name: draft.name,
          text: draft.text,
          gifUrl: draft.gifUrl,
          stickerUrl: draft.stickerUrl,
          imageDataUrl: draft.imageDataUrl
        });
        working = working.filter((entry) => (entry.id || `local:${entry.localId}`) !== (draft.id || `local:${draft.localId}`));
        working.push({ ...synced, pendingSync: false });
      } catch {
        // Keep local draft for next sync attempt.
      }
    }
    return mergeCache(working);
  }

  async function fetchComments() {
    await syncPendingComments();
    const localCache = readCache().filter((comment) => comment.postId === STORY_ID);

    try {
      const res = await fetch(`/api/story-comments?postId=${encodeURIComponent(STORY_ID)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      const serverFlat = flattenComments(Array.isArray(data.comments) ? data.comments : []);
      const pendingLocal = localCache.filter((comment) => comment.pendingSync);
      return buildSingleReplyLevel(mergeCache(serverFlat, pendingLocal));
    } catch {}

    try {
      const res = await fetch('./db/story-comments.json', { cache: 'no-store' });
      const data = await res.json();
      const fileFlat = flattenComments((Array.isArray(data.comments) ? data.comments : []).filter((comment) => comment.postId === STORY_ID));
      const pendingLocal = localCache.filter((comment) => comment.pendingSync);
      return buildSingleReplyLevel(mergeCache(fileFlat, pendingLocal));
    } catch {}

    return buildSingleReplyLevel(localCache);
  }

  async function submitComment(payload) {
    const draft = cleanComment({
      localId: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...payload,
      createdAt: new Date().toISOString(),
      pendingSync: true
    }, { pendingSync: true });

    mergeCache(readCache(), [draft]);

    try {
      const saved = await postCommentToServer(payload);
      const current = readCache().filter((entry) => (entry.id || `local:${entry.localId}`) !== (`local:${draft.localId}`) && entry.localId !== draft.localId);
      mergeCache(current, [{ ...saved, pendingSync: false }]);
      return { ok: true, offline: false };
    } catch {
      mergeCache(readCache());
      return { ok: true, offline: true };
    }
  }

  async function render() {
    const posts = await fetchPublishedPosts();
    const featured = posts.find((post) => post.featured) || posts[0] || {};
    const latest = posts.slice(0, 4);
    const comments = await fetchComments();
    const registryItems = await fetchRegistryItems();
    const azkaLeadVideo = registryItems.find((item) => item.category === 'azka' && item.isOpeningReel && item.videoId) || registryItems.find((item) => item.category === 'azka' && item.videoId) || null;
    const totalCount = comments.reduce((sum, item) => sum + 1 + (item.replies?.length || 0), 0);
    const commentPreview = renderCommentPreview(comments);

    const latestMarkup = latest.length
      ? latest.map((post, index) => `
        <article class="story-rail-card">
          <div class="story-rail-card__meta"><span>${String(index + 1).padStart(2, '0')}</span><span>${formatDate(post.publishedAt || post.updatedAt || post.createdAt)}</span></div>
          <h4>${escapeHtml(post.title || 'Untitled post')}</h4>
          <p>${escapeHtml(post.excerpt || 'Belum ada ringkasan untuk post ini.')}</p>
        </article>`).join('')
      : '<div class="story-rail-card story-rail-card--empty"><h4>Belum ada post published.</h4><p>Publish post dari Post Studio agar rail update proyek tampil di sini.</p></div>';

    document.body.classList.toggle('story-overlay-open', overlayOpen);
    host.classList.add('story-wall');
    host.innerHTML = `
      <article class="case-card story-card reveal in-view story-card--single story-card--feedback" data-story-card="${STORY_ID}">
        <div class="story-card__layout">
          <div class="story-card__content story-feedback-head">
            <div>
              <div class="eyebrow">Website overall</div>
              <h3>Pulse Stories</h3>
              <p>Thread global untuk update developer, pulse publik dari Post Studio, dan masukan pengunjung kini tampil lebih editorial, lebih bersih, dan lebih modern tanpa komposer yang menumpuk langsung di halaman utama.</p>
            </div>
            <div class="story-feedback-meta">
              <span class="pill">1 global thread</span>
              <span class="pill">${posts.length} post published</span>
              <span class="pill">${totalCount} interaksi</span>
              <span class="pill">komentar terbaru tampil di Home</span>
            </div>
          </div>
          <div class="story-feedback-grid">
            <section class="story-feedback-lead">
              <div class="story-feedback-lead__kicker">Published from Post Studio</div>
              <h4>${escapeHtml(featured.title || 'PulseBoard Fusion — feedback keseluruhan website')}</h4>
              <p class="story-feedback-lead__desc">${escapeHtml(featured.excerpt || 'Feed pulse terbaru dipakai sebagai lead editorial, sementara Azka Garden lane mendapat stage video seperti live opening reel agar area utama tidak terasa kosong.')}</p>
              <div class="story-feedback-lead__stats">
                <span class="pill">Featured pulse</span>
                <span class="pill">${latest.length} item terbaru</span>
                <span class="pill">Sync global + lokal</span>
              </div>
              ${renderLeadVideo(azkaLeadVideo)}
            </section>
            <aside class="story-studio-rail">
              <div class="story-studio-rail__head">
                <div>
                  <div class="eyebrow">Pulse rail</div>
                  <h4>Published updates</h4>
                </div>
                <span>${latest.length} post</span>
              </div>
              <div class="story-studio-rail__list">${latestMarkup}</div>
            </aside>
          </div>
          <aside class="story-card__commentsCol story-card__commentsCol--full">
            <div class="story-comments-panel">
              <div class="story-comments-panel__head">
                <div>
                  <div class="eyebrow">Feedback thread</div>
                  <h4>Komentar website keseluruhan</h4>
                </div>
                <span>${totalCount} komentar</span>
              </div>
              <div class="story-comments-panel__actions">
                <button class="button magnetic" type="button" data-open-story-overlay="form">Tulis komentar</button>
                <button class="ghost-button magnetic" type="button" data-open-story-overlay="thread">Buka thread penuh</button>
              </div>
              <div class="meta-line">Komentar terbaru langsung muncul di halaman utama, sementara thread lengkap tetap dibuka pada overlay yang lebih lebar.</div>
              <div class="story-comment-preview-grid">${commentPreview}</div>
            </div>
          </aside>
        </div>
      </article>
      <div class="story-compose-overlay${overlayOpen ? ' is-open' : ''}" aria-hidden="${overlayOpen ? 'false' : 'true'}">
        <button class="story-compose-overlay__backdrop" type="button" aria-label="Tutup overlay komentar" data-close-story-overlay></button>
        <section class="story-compose-sheet" role="dialog" aria-modal="true" aria-labelledby="storyOverlayTitle">
          <div class="story-compose-sheet__top">
            <div>
              <div class="eyebrow">Pulse Stories overlay</div>
              <h4 id="storyOverlayTitle">Ruang komentar website keseluruhan</h4>
              <p>Sampaikan feedback, update, atau balasan dalam layer khusus yang menimpa halaman utama sehingga Pulse Stories tetap terasa rapi sementara thread dan komposer tetap lengkap.</p>
            </div>
            <button class="ghost-button magnetic" type="button" data-close-story-overlay>Tutup</button>
          </div>
          <div class="story-compose-sheet__stats">
            <span class="pill">${totalCount} interaksi</span>
            <span class="pill">${posts.length} post published</span>
            <span class="pill">balasan 1 tingkat</span>
          </div>
          <div class="story-compose-sheet__grid">
            <div class="story-compose-sheet__threadcol">
              <div class="story-comments story-comments--overlay">
                <div class="story-comments__head"><h4>Thread aktif</h4><span>${totalCount} komentar</span></div>
                <div class="story-comments__thread" tabindex="-1" data-story-thread="${STORY_ID}">${renderThread(comments)}</div>
              </div>
            </div>
            <div class="story-compose-sheet__formcol">
              ${renderComposer()}
            </div>
          </div>
        </section>
      </div>`;

    bindInteractions();
  }

  function bindInteractions() {
    host.querySelectorAll('[data-open-story-overlay]').forEach((button) => {
      button.addEventListener('click', async () => {
        overlayOpen = true;
        overlayFocus = button.getAttribute('data-open-story-overlay') || 'form';
        await render();
      });
    });

    host.querySelectorAll('[data-close-story-overlay]').forEach((button) => {
      button.addEventListener('click', async () => {
        overlayOpen = false;
        overlayFocus = 'form';
        if (!replyTo) uploadedImage = uploadedImage || '';
        await render();
      });
    });

    host.querySelectorAll('[data-add-emoji]').forEach((button) => {
      button.addEventListener('click', () => {
        const form = button.closest('form');
        const textarea = form?.querySelector('[data-story-text]');
        if (!textarea) return;
        textarea.value += button.getAttribute('data-add-emoji') || '';
        textarea.focus();
      });
    });

    host.querySelectorAll('[data-reply-to]').forEach((button) => {
      button.addEventListener('click', async () => {
        replyTo = button.getAttribute('data-reply-to') || '';
        overlayOpen = true;
        overlayFocus = 'form';
        await render();
      });
    });

    host.querySelectorAll('[data-cancel-reply]').forEach((button) => {
      button.addEventListener('click', async () => {
        replyTo = '';
        await render();
      });
    });

    host.querySelectorAll('[data-story-image-file]').forEach((input) => {
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        const form = input.closest('form');
        const preview = form?.querySelector('[data-story-upload-preview]');
        if (!file || !preview) return;
        const reader = new FileReader();
        reader.onload = () => {
          uploadedImage = typeof reader.result === 'string' ? reader.result : '';
          preview.innerHTML = uploadedImage ? `<img src="${escapeHtml(uploadedImage)}" alt="Preview upload">` : '<span>Preview upload gambar muncul di sini.</span>';
        };
        reader.readAsDataURL(file);
      });
    });

    host.querySelectorAll('[data-story-form]').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = (form.querySelector('[data-story-name]')?.value || '').trim();
        const text = (form.querySelector('[data-story-text]')?.value || '').trim();
        const gifUrl = (form.querySelector('[data-story-gif]')?.value || '').trim();
        const stickerUrl = (form.querySelector('[data-story-sticker]')?.value || '').trim();
        const imageUrl = (form.querySelector('[data-story-image-url]')?.value || '').trim();
        const parentId = (form.querySelector('[data-story-parent-id]')?.value || '').trim();
        const message = form.querySelector('[data-story-message]');
        const imageDataUrl = uploadedImage || imageUrl;

        if (!name) {
          if (message) message.textContent = 'Nama wajib diisi terlebih dahulu.';
          return;
        }
        if (!text && !gifUrl && !stickerUrl && !imageDataUrl) {
          if (message) message.textContent = 'Isi komentar, GIF, sticker, atau gambar wajib ada salah satu.';
          return;
        }
        saveName(name);
        if (message) message.textContent = 'Menyimpan komentar...';
        const result = await submitComment({ postId: STORY_ID, parentId, name, text, gifUrl, stickerUrl, imageDataUrl });
        replyTo = '';
        overlayOpen = true;
        overlayFocus = 'thread';
        uploadedImage = '';
        await render();
        const freshMessage = host.querySelector('[data-story-message]');
        if (freshMessage) freshMessage.textContent = result.offline ? 'Komentar disimpan lokal dulu dan akan otomatis disinkronkan saat server aktif lagi.' : 'Komentar dan balasan sudah tersimpan permanen.';
      });
    });

    if (overlayOpen) {
      const focusTarget = overlayFocus === 'thread'
        ? host.querySelector('[data-story-thread]')
        : host.querySelector('[data-story-text]');
      focusTarget?.focus?.();
    }
  }

  window.addEventListener('online', () => {
    render().catch(() => {});
  });

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !overlayOpen) return;
    overlayOpen = false;
    overlayFocus = 'form';
    render().catch(() => {});
  });

  render().catch(() => {
    host.innerHTML = '<article class="case-card"><div class="eyebrow">Stories</div><h3>Feed belum bisa dimuat.</h3><p>Data stories akan muncul jika server Node aktif atau file JSON lokal tersedia.</p></article>';
  });
})();
