(() => {
  const page = document.body.dataset.page;
  const host = document.querySelector('[data-extra-grid]');
  if (!host) return;

  const LOCAL_OVERRIDES_KEY = 'pulseboard-youtube-cards-overrides-v1';
  const fallbackPool = [
    { id: 'sFY1_tEXcOs', title: 'Creative deck' },
    { id: 'wrJsExM8D-o', title: 'Future systems' },
    { id: 'o50N3-OaGdM', title: 'Wild terrain' },
    { id: 'uw6C8Z1XieY', title: 'Portfolio deck' },
    { id: '9tgpy9yQF8s', title: 'Botanical motion' },
    { id: 'AfCtuB0agkM', title: 'AI systems' }
  ];
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
  function escapeHtml(value) {
    return String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }
  function embedUrl(videoId) {
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1`;
  }
  function thumb(videoId) {
    return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
  }
  function renderVideoShell(videoId, title) {
    return `<button class="yt-shell yt-shell--inline" type="button" data-youtube-embed="${escapeHtml(embedUrl(videoId))}" data-youtube-title="${escapeHtml(title)}" aria-label="Putar ${escapeHtml(title)}"><img class="yt-shell__poster" src="${thumb(videoId)}" alt="Preview ${escapeHtml(title)}" loading="lazy"><span class="yt-shell__shade"></span><span class="yt-shell__play">▶</span><span class="yt-shell__label">Play inline</span></button>`;
  }
  function bindInlinePlayers() {
    host.querySelectorAll('[data-youtube-embed]').forEach((button) => {
      if (button.dataset.playerBound === '1') return;
      button.dataset.playerBound = '1';
      button.addEventListener('click', () => {
        const frameHost = button.closest('.media-frame, .extra-preview') || button.parentElement;
        const embed = button.getAttribute('data-youtube-embed') || '';
        const title = button.getAttribute('data-youtube-title') || 'YouTube video';
        if (!frameHost || !embed) return;
        frameHost.innerHTML = `<iframe loading="lazy" src="${embed}&autoplay=1" title="${escapeHtml(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
        frameHost.classList.add('is-playing');
      });
    });
  }
  function getDomain(url) {
    try { return new URL(url).hostname.replace(/^www\./i, ''); } catch { return ''; }
  }
  const map = {
    news: {
      title: 'News Desk',
      eyebrow: 'Verified 29 Maret 2026',
      kicker: 'Kanal berita Indonesia A–Z dalam layout PulseBoard yang sejajar dengan Green Atlas.',
      body: 'Daftar ini merangkum website resmi dan kanal sosial utama media berita Indonesia secara ringkas, rapi, dan mudah dibuka.',
      label: 'News Desk',
      cards: [
        {id:'news-001-btv',name:'BTV', website:'https://btv.id', desc:'Kanal televisi berita dan hiburan dengan website resmi btv.id.'},
        {id:'news-002-cnbc-indonesia',name:'CNBC Indonesia', website:'https://www.cnbcindonesia.com', desc:'Fokus ekonomi, bisnis, pasar, dan berita nasional dari jaringan CNBC Indonesia.'},
        {id:'news-003-cnn-indonesia',name:'CNN Indonesia', website:'https://www.cnnindonesia.com', desc:'Portal berita nasional dan internasional dengan kanal digital lengkap.'},
        {id:'news-004-garuda-tv',name:'Garuda TV', website:'https://garuda.tv', desc:'Kanal berita dan siaran publik dengan website resmi garuda.tv.'},
        {id:'news-005-idx-channel',name:'IDX Channel', website:'https://www.idxchannel.com', desc:'Fokus bursa, investasi, bisnis, dan kabar ekonomi.'},
        {id:'news-006-inews',name:'iNews', website:'https://www.inews.id', desc:'Jaringan berita televisi dan portal digital resmi iNews.'},
        {id:'news-007-jaktv',name:'JakTV', website:'https://jak-tv.com', desc:'Kanal TV lokal Jakarta dengan kanal resmi web dan YouTube.'},
        {id:'news-008-kompastv',name:'KompasTV', website:'https://www.kompas.tv', desc:'Jaringan berita dan program informasi dari KompasTV.'},
        {id:'news-009-metro-tv',name:'Metro TV', website:'https://www.metrotvnews.com', desc:'Portal berita dan televisi berita nasional Metro TV.'},
        {id:'news-010-nusantara-tv',name:'Nusantara TV', website:'https://www.nusantaratv.com', desc:'Kanal berita dan hiburan Nusantara TV.'},
        {id:'news-011-tvone',name:'tvOne', website:'https://www.tvonenews.com', desc:'Kanal berita nasional tvOne dan portal tvonenews.com.'}
      ]
    },
    commerce: {
      title: 'Market Lane',
      eyebrow: 'Pembaruan 29 Maret 2026',
      kicker: 'Platform e-commerce Indonesia A–Z disusun seperti katalog visual setara Green Atlas.',
      body: 'Setiap kartu menampilkan website resmi dan kanal sosial utama publik. Tautan eksternal dibuka di tab baru.',
      label: 'E-Commerce',
      cards: [
        {id:'commerce-001-akulaku',name:'Akulaku', website:'https://www.akulaku.com', desc:'Platform kredit digital dan belanja online Akulaku.'},
        {id:'commerce-002-bhinneka',name:'Bhinneka', website:'https://www.bhinneka.com', desc:'Marketplace teknologi dan kebutuhan bisnis Bhinneka.'},
        {id:'commerce-003-blibli',name:'Blibli', website:'https://www.blibli.com', desc:'Marketplace umum Blibli dengan kanal resmi publik.'},
        {id:'commerce-004-bukalapak',name:'Bukalapak', website:'https://www.bukalapak.com', desc:'Marketplace Bukalapak untuk jual beli dan merchant online.'},
        {id:'commerce-005-lazada-indonesia',name:'Lazada Indonesia', website:'https://www.lazada.co.id', desc:'Marketplace Lazada Indonesia.'},
        {id:'commerce-006-olx-indonesia',name:'OLX Indonesia', website:'https://www.olx.co.id', desc:'Marketplace listing barang dan kendaraan bekas.'},
        {id:'commerce-007-orami',name:'Orami', website:'https://www.orami.co.id', desc:'Platform parenting dan e-commerce Orami.'},
        {id:'commerce-008-ralali',name:'Ralali', website:'https://www.ralali.com', desc:'B2B marketplace Ralali untuk kebutuhan bisnis.'},
        {id:'commerce-009-shopee-indonesia',name:'Shopee Indonesia', website:'https://shopee.co.id', desc:'Marketplace Shopee Indonesia.'},
        {id:'commerce-010-sociolla',name:'Sociolla', website:'https://www.sociolla.com', desc:'Platform beauty commerce Sociolla.'},
        {id:'commerce-011-tiktok-shop-by-tokopedia',name:'TikTok Shop by Tokopedia', website:'https://seller.tiktok.com/id', desc:'TikTok Shop by Tokopedia untuk seller dan social commerce.'},
        {id:'commerce-012-tokopedia',name:'Tokopedia', website:'https://www.tokopedia.com', desc:'Marketplace Tokopedia.'},
        {id:'commerce-013-zalora-indonesia',name:'ZALORA Indonesia', website:'https://www.zalora.co.id', desc:'Fashion commerce ZALORA Indonesia.'}
      ]
    },
    azka: {
      title: 'Azka Garden',
      eyebrow: 'External showcase',
      kicker: 'Azka Garden diletakkan sejajar dengan lane lainnya sebagai portal kebun eksternal.',
      body: 'Halaman ini menjadi jembatan visual ke Azka Garden dengan gaya PulseBoard yang tetap konsisten dan tombol keluar yang jelas.',
      label: 'Azka Garden',
      cards: [
        {id:'azka-001-azka-garden',name:'Azka Garden', website:'https://grand-pasca-0cde11.netlify.app/', desc:'Portal kebun Azka Garden untuk membuka halaman utama eksternal.'},
        {id:'azka-002-cv-online',name:'CV Online', website:'https://a697eaef-9a65-4558-b94c-04038903f6fe-00-19odyzrixlvpe.sisko.replit.dev/', desc:'CV dan ringkasan profil yang ditampilkan sejajar dengan showcase lainnya.'}
      ]
    }
  };
  const data = map[page];
  if (!data) return;
  const title = document.querySelector('[data-extra-title]');
  const eyebrow = document.querySelector('[data-extra-eyebrow]');
  const kicker = document.querySelector('[data-extra-kicker]');
  const body = document.querySelector('[data-extra-body]');
  if (title) title.textContent = data.title;
  if (eyebrow) eyebrow.textContent = data.eyebrow;
  if (kicker) kicker.textContent = data.kicker;
  if (body) body.textContent = data.body;

  async function loadRegistry() {
    try {
      const res = await fetch(`/api/items?category=${encodeURIComponent(page)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      return mergeLocal((Array.isArray(data.items) ? data.items : []).filter((item) => !item.isOpeningReel));
    } catch {
      try {
        const res = await fetch('./db/items.json', { cache: 'no-store' });
        const data = await res.json();
        return mergeLocal((Array.isArray(data.items) ? data.items : []).filter((item) => item.category === page && !item.isOpeningReel));
      } catch {
        return [];
      }
    }
  }
  function buildCards(registry) {
    const byId = new Map(registry.map((item) => [item.id, item]));
    const baseCards = data.cards.map((card) => {
      const stored = byId.get(card.id) || {};
      return {
        id: card.id,
        name: stored.name || card.name,
        website: stored.websiteUrl || card.website,
        desc: stored.description || card.desc,
        videoId: stored.videoId || '',
        youtubeUrl: stored.youtubeUrl || '',
        searchQuery: stored.searchQuery || card.name,
        isCustom: false,
        domain: stored.domain || getDomain(stored.websiteUrl || card.website)
      };
    });
    const customCards = registry.filter((item) => !data.cards.some((card) => card.id === item.id)).map((item) => ({
      id: item.id,
      name: item.name,
      website: item.websiteUrl || '',
      desc: item.description || `Kartu tambahan developer untuk ${data.label}.`,
      videoId: item.videoId || '',
      youtubeUrl: item.youtubeUrl || '',
      searchQuery: item.searchQuery || item.name,
      isCustom: true,
      domain: item.domain || getDomain(item.websiteUrl || '')
    }));
    return [...baseCards, ...customCards];
  }
  function render(registry) {
    const cards = buildCards(registry);
    host.innerHTML = cards.map((card, idx) => {
      const fallback = fallbackPool[idx % fallbackPool.length];
      const hasSavedVideo = !!card.videoId;
      const playbackVideoId = hasSavedVideo ? card.videoId : (card.isCustom ? '' : fallback.id);
      const videoUrl = hasSavedVideo ? (card.youtubeUrl || `https://www.youtube.com/watch?v=${card.videoId}`) : playbackVideoId ? `https://www.youtube.com/watch?v=${playbackVideoId}` : '';
      const media = playbackVideoId ? `<div class="media-frame media-frame--catalog media-frame--thumb">${renderVideoShell(playbackVideoId, card.name)}</div>` : `<a class="extra-preview studio-preview" href="${escapeHtml(card.website || '#')}" target="_blank" rel="noreferrer"><div class="extra-preview__bar"></div><div class="extra-preview__body"><div class="eyebrow">${card.isCustom ? 'Custom card' : data.label}</div><h3>${escapeHtml(card.name)}</h3><p>${escapeHtml(card.domain || 'External link')}</p></div></a>`;
      return `<article class="catalog-card reveal in-view extra-card">${media}<div class="catalog-card__body"><div class="catalog-card__top"><span class="eyebrow">${escapeHtml(data.label)}</span><span class="pill">${hasSavedVideo ? 'Saved' : card.isCustom ? 'Custom' : 'Reference'}</span></div><h3>${escapeHtml(card.name)}</h3><p>${escapeHtml(card.desc || '')}</p><div class="catalog-actions">${card.website ? `<a class="button magnetic" href="${escapeHtml(card.website)}" target="_blank" rel="noreferrer">Open website</a>` : ''}${videoUrl ? `<a class="ghost-button magnetic" href="${escapeHtml(videoUrl)}" target="_blank" rel="noreferrer">Buka video</a>` : `<a class="ghost-button magnetic" href="https://www.youtube.com/results?search_query=${encodeURIComponent(card.searchQuery || card.name)}" target="_blank" rel="noreferrer">Cari di YouTube</a>`}</div><div class="catalog-note">${hasSavedVideo ? 'Play langsung di halaman ini.' : card.isCustom ? 'Kartu custom siap digunakan dan bisa diperbarui kapan saja.' : 'Video referensi bisa diputar langsung dari halaman ini.'}</div></div></article>`;
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
