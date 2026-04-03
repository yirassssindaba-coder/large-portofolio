(() => {
  if (!document.body.classList.contains('world-page')) return;
  const host = document.getElementById('worldVideoGrid');
  if (!host) return;

  const LOCAL_OVERRIDES_KEY = 'pulseboard-youtube-cards-overrides-v1';
  function getLocalOverrides() {
    try { return JSON.parse(localStorage.getItem(LOCAL_OVERRIDES_KEY) || '{}'); } catch { return {}; }
  }
  function shouldApplyLocalOverride(item, override) {
    if (!override || typeof override !== 'object') return false;
    const itemUpdatedAt = Date.parse(item?.updatedAt || item?.createdAt || 0) || 0;
    const overrideUpdatedAt = Date.parse(override.updatedAt || 0) || 0;
    return !itemUpdatedAt || overrideUpdatedAt >= itemUpdatedAt;
  }
  function mergeLocal(items) {
    const overrides = getLocalOverrides();
    return (Array.isArray(items) ? items : []).map((item) => {
      const override = overrides[item.id] || null;
      return shouldApplyLocalOverride(item, override) ? { ...item, ...override } : item;
    });
  }

  const DEFAULT_WORLD_ITEMS = [
    { id: 'world-001-global-overview', name: 'Global atlas overview', searchQuery: 'world atlas 3d globe countries time weather', summary: 'Overview panggung globe 3D, marker negara, waktu lokal, dan fokus bendera.', fallback: { videoId: 'uw6C8Z1XieY', title: 'Portfolio deck' } },
    { id: 'world-002-country-focus', name: 'Country focus system', searchQuery: 'country profile globe atlas flags capitals time zone', summary: 'Fokus negara, detail ibu kota, mata uang, zona waktu, dan data atlas pendukung.', fallback: { videoId: 'xrzV9H4m6aA', title: 'Country profiles' } },
    { id: 'world-003-weather-season', name: 'Weather and season layer', searchQuery: 'world weather season map interactive', summary: 'Lapisan cuaca dan musim untuk memperkuat pengalaman atlas dunia yang hidup.', fallback: { videoId: 'oHg5SJYRHA0', title: 'Weather layer reference' } }
  ];



  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function renderVideoShell(videoId, videoUrl, title) {
    const embed = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1`;
    return `
      <button class="yt-shell yt-shell--inline" type="button" data-youtube-embed="${escapeHtml(embed)}" data-youtube-title="${escapeHtml(title)}" aria-label="Putar ${escapeHtml(title)}">
        <img class="yt-shell__poster" src="${thumb(videoId)}" alt="Preview ${escapeHtml(title)}" loading="lazy">
        <span class="yt-shell__shade"></span>
        <span class="yt-shell__play">▶</span>
        <span class="yt-shell__label">Play inline</span>
      </button>`;
  }

  function bindInlinePlayers() {
    host.querySelectorAll('[data-youtube-embed]').forEach((button) => {
      if (button.dataset.playerBound === '1') return;
      button.dataset.playerBound = '1';
      button.addEventListener('click', () => {
        const frameHost = button.closest('.media-frame') || button.parentElement;
        const embed = button.getAttribute('data-youtube-embed') || '';
        const title = button.getAttribute('data-youtube-title') || 'YouTube video';
        if (!frameHost || !embed) return;
        frameHost.innerHTML = `<iframe loading="lazy" src="${embed}&autoplay=1" title="${escapeHtml(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
        frameHost.classList.add('is-playing');
      });
    });
  }

  async function loadRegistry() {
    try {
      const res = await fetch('/api/items?category=world', { cache: 'no-store' });
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      return mergeLocal(Array.isArray(data.items) ? data.items : []);
    } catch {
      try {
        const res = await fetch('./db/items.json', { cache: 'no-store' });
        const data = await res.json();
        return mergeLocal((Array.isArray(data.items) ? data.items : []).filter((item) => item.category === 'world'));
      } catch {
        return [];
      }
    }
  }


  function thumb(videoId) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  function render(items) {
    const byId = new Map(items.map((item) => [item.id, item]));
    const baseCards = DEFAULT_WORLD_ITEMS.map((entry) => {
      const stored = byId.get(entry.id);
      const videoId = stored?.videoId || entry.fallback.videoId;
      const videoUrl = stored?.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;
      const isSaved = !!stored?.videoId;
      return `
        <article class="catalog-card reveal in-view" data-item-id="${escapeHtml(stored?.id || entry.id)}">
          <div class="media-frame media-frame--catalog media-frame--thumb">
            ${renderVideoShell(videoId, videoUrl, stored?.name || entry.name)}
          </div>
          <div class="catalog-card__body">
            <div class="catalog-card__top"><span class="eyebrow">World Atlas</span><span class="pill">${isSaved ? 'Saved' : 'Reference'}</span></div>
            <h3>${escapeHtml(stored?.name || entry.name)}</h3>
            <div class="catalog-meta">${isSaved ? 'Play langsung' : 'Video referensi aktif'}</div>
            <p>${escapeHtml(stored?.description || entry.summary)}</p>
            <div class="catalog-actions">
              ${stored?.websiteUrl ? `<a class="ghost-button magnetic" href="${escapeHtml(stored.websiteUrl)}" target="_blank" rel="noreferrer">Buka Website</a>` : ''}
              <a class="ghost-button magnetic" href="https://www.youtube.com/results?search_query=${encodeURIComponent(stored?.searchQuery || entry.searchQuery)}" target="_blank" rel="noreferrer">Cari di YouTube</a>
              <a class="ghost-button magnetic" href="${videoUrl}" target="_blank" rel="noreferrer">Buka Video</a>
            </div>
          </div>
        </article>`;
    }).join('');
    const customCards = items.filter((item) => !DEFAULT_WORLD_ITEMS.some((entry) => entry.id === item.id)).map((item) => {
      const hasSavedVideo = !!item.videoId;
      const videoUrl = hasSavedVideo ? (item.youtubeUrl || `https://www.youtube.com/watch?v=${item.videoId}`) : '';
      const mediaMarkup = hasSavedVideo
        ? renderVideoShell(item.videoId, videoUrl, item.name)
        : `<div class="catalog-empty"><span>Belum ada video tersimpan.</span></div>`;
      return `
        <article class="catalog-card reveal in-view" data-item-id="${escapeHtml(item.id)}">
          <div class="media-frame media-frame--catalog media-frame--thumb">${mediaMarkup}</div>
          <div class="catalog-card__body">
            <div class="catalog-card__top"><span class="eyebrow">World Atlas</span><span class="pill">${hasSavedVideo ? 'Saved' : 'Custom'}</span></div>
            <h3>${escapeHtml(item.name)}</h3>
            <div class="catalog-meta">${hasSavedVideo ? 'Play langsung' : 'Kartu custom aktif'}</div>
            <p>${escapeHtml(item.description || 'Kartu tambahan developer untuk World Atlas.')}</p>
            <div class="catalog-actions">
              ${item.websiteUrl ? `<a class="ghost-button magnetic" href="${escapeHtml(item.websiteUrl)}" target="_blank" rel="noreferrer">Buka Website</a>` : ''}
              <a class="ghost-button magnetic" href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.searchQuery || item.name)}" target="_blank" rel="noreferrer">Cari di YouTube</a>
              ${videoUrl ? `<a class="ghost-button magnetic" href="${escapeHtml(videoUrl)}" target="_blank" rel="noreferrer">Buka Video</a>` : ''}
            </div>
          </div>
        </article>`;
    }).join('');
    host.innerHTML = baseCards + customCards;
    bindInlinePlayers();
  }

  loadRegistry().then(render).catch(() => render([]));

  const refresh = () => loadRegistry().then(render).catch(() => render([]));
  const channel = ('BroadcastChannel' in window) ? new BroadcastChannel('pulseboard-registry') : null;
  channel?.addEventListener('message', (event) => {
    if (event?.data?.type === 'registry-updated') refresh();
  });
  window.addEventListener('storage', (event) => {
    if (event.key === 'pulseboard-registry-updated-at' || event.key === LOCAL_OVERRIDES_KEY) refresh();
  });
  window.addEventListener('focus', refresh);
})();
