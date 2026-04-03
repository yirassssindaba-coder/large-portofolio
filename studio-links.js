(() => {
  if (document.body.dataset.page !== 'portfolio') return;
  const host = document.getElementById('studioPreviewGrid');
  if (!host) return;

  const LOCAL_OVERRIDES_KEY = 'pulseboard-youtube-cards-overrides-v1';
  const baseItems = [
    {id:'studio-001-gyunabe',name:'Gyunabe',url:'https://www.ohtanawanoren.jp/english/',domain:'ohtanawanoren.jp',summary:'Portal sejarah gyunabe Yokohama dengan cerita asal-usul dan suasana restoran klasik.'},
    {id:'studio-002-bleach',name:'BLEACH',url:'https://bleach-anime.com/en/',domain:'bleach-anime.com',summary:'Situs resmi Thousand-Year Blood War dengan intro, character, story, dan special content.'},
    {id:'studio-003-uniqlo-hari-raya',name:'UNIQLO Hari Raya Essentials',url:'https://www.uniqlo.com/id/id/special-feature/cp/hari-raya-essentials',domain:'uniqlo.com',summary:'Landing page LifeWear untuk Hari Raya Essentials 2026 dengan koleksi keluarga.'},
    {id:'studio-004-nikesb',name:'NikeSB.com',url:'https://www.nikesb.com/',domain:'nikesb.com',summary:'Portal Nike Skateboarding dengan team, shops, dan archive produk SB.'},
    {id:'studio-005-strae',name:'Strae',url:'https://strae.co/',domain:'strae.co',summary:'Fingerboard shop dengan fokus maple wood, concave board, dan progression.'},
    {id:'studio-006-techdeck',name:'Tech Deck',url:'https://www.techdeck.com/',domain:'techdeck.com',summary:'Portal resmi Tech Deck: fingerboard, event, ambassadors, dan collabs.'},
    {id:'studio-007-apeiron',name:'Apeiron VC Jobs',url:'https://apeiron.vc/',domain:'apeiron.vc',summary:'Situs venture fund dengan visual gelap sinematik, portfolio, news, dan job ecosystem.'},
    {id:'studio-008-bruno-simon',name:'Bruno Simon Game',url:'https://bruno-simon.com/',domain:'bruno-simon.com',summary:'Portfolio game-like 3D interaktif berbasis Three.js yang jadi rujukan Farm World.'},
    {id:'studio-009-new-york-quarry-house',name:'New York / Quarry House',url:'https://mfisher-apollonas.com/',domain:'mfisher-apollonas.com',summary:'Pengalaman web interaktif dengan 360, gallery, dan journal bergaya arsitektur.'},
    {id:'studio-010-strae-co',name:'Strae Co',url:'https://strae.co/',domain:'strae.co',summary:'Referensi produk fingerboard dan tampilan commerce modern.'},
    {id:'studio-011-cv-online',name:'CV Online',url:'https://a697eaef-9a65-4558-b94c-04038903f6fe-00-19odyzrixlvpe.sisko.replit.dev/',domain:'sisko.replit.dev',summary:'CV web untuk melihat profil dan ringkasan kerja sebelum membuka halaman.'}
  ];
  function getLocalOverrides() {
    try { return JSON.parse(localStorage.getItem(LOCAL_OVERRIDES_KEY) || '{}'); } catch { return {}; }
  }
  function mergeLocal(items) {
    const overrides = getLocalOverrides();
    return (Array.isArray(items) ? items : []).map((item) => ({ ...item, ...(overrides[item.id] || {}) }));
  }
  function escapeHtml(value) {
    return String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }
  function getDomain(url) {
    try { return new URL(url).hostname.replace(/^www\./i, ''); } catch { return ''; }
  }
  function renderVideoShell(videoId, title) {
    const embed = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1`;
    return `<button class="yt-shell yt-shell--inline" type="button" data-youtube-embed="${escapeHtml(embed)}" data-youtube-title="${escapeHtml(title)}" aria-label="Putar ${escapeHtml(title)}"><img class="yt-shell__poster" src="https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg" alt="Preview ${escapeHtml(title)}" loading="lazy"><span class="yt-shell__shade"></span><span class="yt-shell__play">▶</span><span class="yt-shell__label">Play inline</span></button>`;
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
      const res = await fetch('/api/items?category=studio', { cache: 'no-store' });
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      return mergeLocal((Array.isArray(data.items) ? data.items : []).filter((item) => !item.isOpeningReel));
    } catch {
      try {
        const res = await fetch('./db/items.json', { cache: 'no-store' });
        const data = await res.json();
        return mergeLocal((Array.isArray(data.items) ? data.items : []).filter((item) => item.category === 'studio' && !item.isOpeningReel));
      } catch {
        return [];
      }
    }
  }
  function buildCards(registry) {
    const byId = new Map(registry.map((item) => [item.id, item]));
    const mergedBase = baseItems.map((item) => {
      const stored = byId.get(item.id) || {};
      return {
        id: item.id,
        name: stored.name || item.name,
        url: stored.websiteUrl || item.url,
        domain: stored.domain || item.domain || getDomain(stored.websiteUrl || item.url),
        summary: stored.description || item.summary,
        videoId: stored.videoId || '',
        youtubeUrl: stored.youtubeUrl || '',
        searchQuery: stored.searchQuery || item.name,
        isCustom: false
      };
    });
    const customCards = registry.filter((item) => !item.isOpeningReel && !baseItems.some((base) => base.id === item.id)).map((item) => ({
      id: item.id,
      name: item.name,
      url: item.websiteUrl || '',
      domain: item.domain || getDomain(item.websiteUrl || ''),
      summary: item.description || 'Kartu tambahan developer untuk Studio Deck.',
      videoId: item.videoId || '',
      youtubeUrl: item.youtubeUrl || '',
      searchQuery: item.searchQuery || item.name,
      isCustom: true
    }));
    return [...mergedBase, ...customCards];
  }
  function render(registry) {
    const cards = buildCards(registry);
    host.innerHTML = cards.map((item, idx) => {
      const isSaved = !!item.videoId;
      const websiteUrl = item.url || '#';
      return `<article class="catalog-card reveal in-view studio-preview-card">${isSaved ? `<div class="media-frame media-frame--catalog media-frame--thumb">${renderVideoShell(item.videoId, item.name)}</div>` : `<a class="extra-preview studio-preview" href="${escapeHtml(websiteUrl)}" target="_blank" rel="noreferrer"><div class="extra-preview__bar"></div><div class="extra-preview__body"><div class="eyebrow">${item.isCustom ? 'Custom card' : `Preview ${String(idx + 1).padStart(2, '0')}`}</div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.domain || 'External link')}</p></div></a>`}<div class="catalog-card__body"><div class="catalog-card__top"><span class="eyebrow">Website</span><span class="pill">${isSaved ? 'Saved video' : item.isCustom ? 'Custom' : 'Preview'}</span></div><h3>${escapeHtml(item.name)}</h3><div class="catalog-meta catalog-meta--strong">${escapeHtml(item.domain || 'external')}</div><p>${escapeHtml(item.summary || '')}</p><div class="catalog-actions">${item.url ? `<a class="ghost-button magnetic" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">Buka website</a>` : ''}${isSaved ? `<a class="ghost-button magnetic" href="${escapeHtml(item.youtubeUrl || `https://www.youtube.com/watch?v=${item.videoId}`)}" target="_blank" rel="noreferrer">Buka video</a>` : `<a class="ghost-button magnetic" href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.searchQuery || item.name)}" target="_blank" rel="noreferrer">Cari di YouTube</a>`}</div>${isSaved ? `<div class="catalog-note">Play langsung di halaman ini.</div>` : ''}</div></article>`;
    }).join('');
    bindInlinePlayers();
  }
  loadRegistry().then(render).catch(() => render([]));
  const refresh = () => loadRegistry().then(render).catch(() => render([]));
  const channel = ('BroadcastChannel' in window) ? new BroadcastChannel('pulseboard-registry') : null;
  channel?.addEventListener('message', (event) => { if (event?.data?.type === 'registry-updated') refresh(); });
  window.addEventListener('storage', (event) => { if (event.key === 'pulseboard-registry-updated-at' || event.key === LOCAL_OVERRIDES_KEY) refresh(); });
  window.addEventListener('focus', refresh);
})();
