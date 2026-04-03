const els = {
  overview: document.getElementById('analyticsOverview'),
  chartGrid: document.getElementById('analyticsChartGrid'),
  miniGrid: document.getElementById('analyticsMiniGrid'),
  notes: document.getElementById('analyticsNotes'),
  topPages: document.getElementById('topPagesTable'),
  trafficSources: document.getElementById('trafficSourcesTable'),
  topVideos: document.getElementById('topVideosTable'),
  audit: document.getElementById('auditTable'),
  refresh: document.getElementById('refreshAnalyticsButton'),
  exportHtml: document.getElementById('exportAnalyticsHtml'),
  exportJson: document.getElementById('exportAnalyticsJson'),
  exportCsv: document.getElementById('exportAnalyticsCsv')
};

const PAGE_LABELS = {
  home: 'Home',
  world: 'World Atlas',
  tanaman: 'Green Atlas',
  binatang: 'Wild Echo',
  hewan: 'Wild Echo',
  teknologi: 'Tech Forge',
  tech: 'Tech Forge',
  studio: 'Studio Deck',
  portfolio: 'Studio Deck',
  news: 'News Desk',
  commerce: 'E-Commerce',
  azka: 'Azka Garden',
  analytics: 'Analytics',
  manager: 'Developer Edit',
  'posts-studio': 'Post Studio',
  game: 'Farm World'
};

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function formatDate(value) {
  const d = new Date(value || 0);
  return Number.isNaN(d.getTime()) ? '—' : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}
function formatInt(value) { return new Intl.NumberFormat('id-ID').format(Number(value || 0)); }
function formatDuration(ms) {
  const seconds = Math.max(0, Math.round(Number(ms || 0) / 1000));
  if (seconds < 60) return `${seconds} dtk`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}m ${rest}s`;
}
function normalizeLabel(value) { return PAGE_LABELS[String(value || '').trim().toLowerCase()] || String(value || 'Data'); }
async function fetchAnalytics() {
  const res = await fetch('/api/analytics', { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Analytics gagal dimuat.');
  return data;
}

function lineChartSvg(series, label, secondSeries = null) {
  const width = 760, height = 240, pad = { top: 18, right: 18, bottom: 38, left: 28 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const values = [...(series || []).map((item) => Number(item.value || 0)), ...(secondSeries || []).map((item) => Number(item.value || 0))];
  const max = Math.max(1, ...values);
  const step = (series || []).length > 1 ? plotW / ((series || []).length - 1) : plotW;
  const buildPoints = (rows) => (rows || []).map((item, index) => ({
    x: pad.left + step * index,
    y: pad.top + plotH - ((Number(item.value || 0) / max) * plotH),
    date: item.date || item.label || '',
    value: Number(item.value || 0)
  }));
  const points = buildPoints(series);
  const points2 = buildPoints(secondSeries);
  const pathFrom = (rows) => rows.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');
  const path = pathFrom(points);
  const path2 = pathFrom(points2);
  const area = points.length ? `${path} L ${points[points.length - 1].x},${height - pad.bottom} L ${points[0].x},${height - pad.bottom} Z` : '';
  const id = `lineFill-${String(label).replace(/[^a-z0-9]+/gi, '-')}`;
  const grid = Array.from({ length: 4 }, (_, index) => `<line x1="${pad.left}" y1="${pad.top + (plotH / 3) * index}" x2="${width - pad.right}" y2="${pad.top + (plotH / 3) * index}" stroke="rgba(255,255,255,.08)" />`).join('');
  const ticks = points.map((point, index) => `<text x="${point.x}" y="${height - 14}" fill="rgba(244,237,226,.56)" font-size="10" text-anchor="middle">${escapeHtml((point.date || `P${index + 1}`).slice(5).replace('-', '/'))}</text>`).join('');
  const dots = points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4.5" fill="rgba(231,191,134,.95)"><title>${escapeHtml(label)} ${escapeHtml(point.date)}: ${point.value}</title></circle>`).join('');
  const dots2 = points2.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="rgba(255,255,255,.86)"><title>${escapeHtml(label)} ${escapeHtml(point.date)}: ${point.value}</title></circle>`).join('');
  return `<svg class="analytics-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="rgba(231,191,134,.34)"></stop><stop offset="100%" stop-color="rgba(231,191,134,0)"></stop></linearGradient></defs>${grid}${area ? `<path d="${area}" fill="url(#${id})"></path>` : ''}${path ? `<path d="${path}" fill="none" stroke="rgba(231,191,134,.96)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>` : ''}${path2 ? `<path d="${path2}" fill="none" stroke="rgba(255,255,255,.82)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8 6"></path>` : ''}${dots}${dots2}${ticks}</svg>`;
}

function barChartSvg(series, label, horizontal = false) {
  const width = 760, height = 240, pad = { top: 18, right: 18, bottom: 38, left: horizontal ? 140 : 24 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const values = (series || []).map((item) => Number(item.value || 0));
  const max = Math.max(1, ...values);
  if (horizontal) {
    const gap = 12;
    const barH = Math.max(16, (plotH - (Math.max((series || []).length - 1, 0) * gap)) / Math.max((series || []).length, 1));
    const bars = (series || []).map((item, index) => {
      const value = Number(item.value || 0);
      const y = pad.top + index * (barH + gap);
      const w = (value / max) * plotW;
      return `<g><rect x="${pad.left}" y="${y}" width="${w}" height="${barH}" rx="10" fill="rgba(231,191,134,.88)"></rect><text x="${pad.left - 10}" y="${y + barH / 2 + 4}" fill="rgba(244,237,226,.72)" font-size="11" text-anchor="end">${escapeHtml(normalizeLabel(item.label || item.date || 'Data'))}</text><text x="${pad.left + w + 10}" y="${y + barH / 2 + 4}" fill="rgba(244,237,226,.92)" font-size="11">${escapeHtml(String(value))}</text></g>`;
    }).join('');
    return `<svg class="analytics-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}">${bars}</svg>`;
  }
  const gap = 12;
  const barW = Math.max(12, (plotW - (Math.max((series || []).length - 1, 0) * gap)) / Math.max((series || []).length, 1));
  const bars = (series || []).map((item, index) => {
    const value = Number(item.value || 0);
    const x = pad.left + index * (barW + gap);
    const h = (value / max) * plotH;
    const y = pad.top + plotH - h;
    const text = String(item.date || item.label || '').slice(-5).replace('-', '/');
    return `<g><rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="12" fill="rgba(231,191,134,.88)"></rect><text x="${x + barW / 2}" y="${height - 14}" fill="rgba(244,237,226,.56)" font-size="10" text-anchor="middle">${escapeHtml(text)}</text></g>`;
  }).join('');
  const grid = Array.from({ length: 4 }, (_, index) => `<line x1="${pad.left}" y1="${pad.top + (plotH / 3) * index}" x2="${width - pad.right}" y2="${pad.top + (plotH / 3) * index}" stroke="rgba(255,255,255,.08)" />`).join('');
  return `<svg class="analytics-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}">${grid}${bars}</svg>`;
}

function donutChartSvg(series, label) {
  const total = Math.max(1, (series || []).reduce((sum, item) => sum + Number(item.value || 0), 0));
  const size = 240, center = size / 2, radius = 72, circumference = Math.PI * 2 * radius;
  const colors = ['rgba(231,191,134,.96)', 'rgba(231,191,134,.72)', 'rgba(231,191,134,.52)', 'rgba(255,255,255,.32)', 'rgba(166,107,67,.85)', 'rgba(255,255,255,.2)'];
  let offset = 0;
  const segments = (series || []).map((item, index) => {
    const value = Number(item.value || 0);
    const dash = circumference * (value / total);
    const part = `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${colors[index % colors.length]}" stroke-width="22" stroke-linecap="round" stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}"></circle>`;
    offset += dash;
    return part;
  }).join('');
  const legend = (series || []).map((item, index) => `<span><i style="background:${colors[index % colors.length]}"></i>${escapeHtml(normalizeLabel(item.label))} · ${formatInt(item.value)}</span>`).join('');
  return { svg: `<svg class="analytics-chart" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escapeHtml(label)}"><circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="22"></circle>${segments}<text x="${center}" y="${center - 2}" text-anchor="middle" fill="rgba(244,237,226,.95)" font-size="34" font-weight="800">${formatInt(total)}</text><text x="${center}" y="${center + 24}" text-anchor="middle" fill="rgba(244,237,226,.56)" font-size="12">Total</text></svg>`, legend };
}

function renderOverview(kpis = {}) {
  const cards = [
    ['Total visitor', kpis.totalVisitors],
    ['Visitor hari ini', kpis.todayVisitors],
    ['Visitor 7 hari', kpis.visitors7Days],
    ['Page views', kpis.totalPageViews],
    ['Unique page views', kpis.uniquePageViews],
    ['Sessions', kpis.sessions],
    ['Post aktif', kpis.activePosts],
    ['Post draft', kpis.draftPosts],
    ['Post terhapus', kpis.deletedPosts],
    ['Komentar', kpis.totalComments],
    ['Balasan', kpis.totalReplies],
    ['Video views', kpis.videoViews],
    ['Avg duration', kpis.avgSessionDurationLabel || formatDuration(kpis.avgSessionDurationMs)],
    ['Bounce rate', `${kpis.bounceRate ?? 0}%`],
    ['Online sekarang', kpis.onlineNow],
    ['Avg scroll', `${kpis.avgScrollDepth ?? 0}%`],
    ['CTA clicks', kpis.ctaClicks],
    ['Error events', kpis.errorEvents]
  ];
  els.overview.innerHTML = cards.map(([label, value]) => `<article class="analytics-kpi"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value ?? 0))}</strong></article>`).join('');
}

function renderCharts(summary) {
  const charts = summary.charts || {};
  const cards = [];
  cards.push({ title: 'Visitor per hari', note: 'Page views 14 hari terakhir', html: lineChartSvg(charts.visitorsPerDay, 'Visitor per hari') });
  cards.push({ title: 'Unique vs returning', note: 'Pengunjung baru dan kembali', html: lineChartSvg(charts.uniqueVisitorsPerDay, 'Unique vs returning', charts.returningVisitorsPerDay) });
  cards.push({ title: 'Engagement per hari', note: 'Klik CTA dan interaksi utama', html: barChartSvg(charts.engagementPerDay, 'Engagement per hari') });
  cards.push({ title: 'Post baru vs post terhapus', note: 'Pertumbuhan konten dan penghapusan', html: lineChartSvg(charts.postsCreatedPerDay, 'Post baru vs hapus', charts.postsDeletedPerDay) });
  cards.push({ title: 'Net growth post', note: 'Post baru dikurangi post terhapus', html: lineChartSvg(charts.netPostGrowth, 'Net growth post') });
  cards.push({ title: 'Komentar & balasan', note: 'Percakapan publik terbaru', html: lineChartSvg(charts.commentsPerDay, 'Komentar & balasan', charts.repliesPerDay) });
  cards.push({ title: 'Video plays per hari', note: 'Klik video / play intent', html: lineChartSvg(charts.videoPlaysPerDay, 'Video plays per hari') });
  cards.push({ title: 'CTR CTA per hari', note: 'Persentase klik CTA terhadap page views', html: barChartSvg(charts.ctaCtrPerDay, 'CTR CTA per hari') });
  cards.push({ title: 'Traffic source', note: 'Distribusi sumber trafik', html: (() => { const traffic = donutChartSvg(charts.trafficSources, 'Traffic source'); return `${traffic.svg}<div class="analytics-legend">${traffic.legend}</div>`; })() });
  cards.push({ title: 'Device usage', note: 'Desktop, mobile, tablet', html: (() => { const device = donutChartSvg(charts.deviceUsage, 'Device usage'); return `${device.svg}<div class="analytics-legend">${device.legend}</div>`; })() });
  cards.push({ title: 'Page views per section', note: 'Halaman atau section paling ramai', html: barChartSvg(charts.pageViewsBySection, 'Page views per section', true) });
  cards.push({ title: 'Error teknis', note: 'Error JavaScript dan unhandled rejection', html: barChartSvg(charts.errorRatePerDay, 'Error teknis') });
  els.chartGrid.innerHTML = cards.map((card) => `<article class="analytics-chart-card"><div><h3>${escapeHtml(card.title)}</h3><p class="analytics-chart-note">${escapeHtml(card.note)}</p></div>${card.html}</article>`).join('');
}

function renderMini(summary) {
  const cards = [
    ['Video aktif', summary.content?.videosActive, 'Kartu yang sudah punya video tersimpan.'],
    ['Video kosong', summary.content?.videosMissing, 'Masih siap diisi dari Developer Edit.'],
    ['Custom cards', summary.content?.customCards, 'Kartu tambahan permanen untuk section.'],
    ['Opening reels', summary.content?.openingReels, 'Hero reel yang bisa diganti link videonya.'],
    ['Published posts', summary.content?.publishedPosts, 'Konten publik aktif dari Post Studio.'],
    ['Archived posts', summary.content?.archivedPosts, 'Konten yang sudah diarsipkan.']
  ];
  els.miniGrid.innerHTML = cards.map(([label, value, desc]) => `<article class="analytics-mini-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value ?? 0))}</strong><span>${escapeHtml(desc)}</span></article>`).join('');
  els.notes.textContent = `${summary.notes?.trafficTracking || 'Tracking aktif.'} Data dibuat pada ${formatDate(summary.generatedAt)}.`;
}

function renderRankList(element, rows, emptyMessage, suffix = '') {
  if (!rows || !rows.length) {
    element.innerHTML = `<div class="analytics-empty">${escapeHtml(emptyMessage)}</div>`;
    return;
  }
  element.innerHTML = rows.map((row) => `
    <article class="analytics-row">
      <div>
        <strong>${escapeHtml(normalizeLabel(row.label || row.message || row.type || 'Data'))}</strong>
        <span>${escapeHtml(row.sub || '')}</span>
      </div>
      <em>${escapeHtml(String(row.value ?? '—'))}${suffix}</em>
    </article>
  `).join('');
}

function renderAudit(events) {
  if (!events || !events.length) {
    els.audit.innerHTML = '<div class="analytics-empty">Belum ada audit log terbaru.</div>';
    return;
  }
  els.audit.innerHTML = events.map((event) => `
    <article class="analytics-row">
      <div>
        <strong>${escapeHtml(event.message || event.type || 'Aktivitas')}</strong>
        <span>${escapeHtml((event.entity || 'studio') + ' · ' + formatDate(event.at))}</span>
      </div>
      <em>${escapeHtml(event.type || 'event')}</em>
    </article>
  `).join('');
}

async function loadAndRenderAnalytics() {
  els.refresh.disabled = true;
  els.refresh.textContent = 'Memuat…';
  try {
    const summary = await fetchAnalytics();
    renderOverview(summary.kpis || {});
    renderCharts(summary);
    renderMini(summary);
    renderRankList(els.topPages, (summary.topPages || []).map((row) => ({ label: row.label, value: row.value, sub: 'Page views tercatat' })), 'Belum ada data halaman.');
    renderRankList(els.trafficSources, (summary.trafficSources || []).map((row) => ({ label: row.label, value: row.value, sub: 'Sesi berasal dari sumber ini' })), 'Belum ada data sumber trafik.');
    renderRankList(els.topVideos, (summary.charts?.topVideos || []).map((row) => ({ label: row.label, value: row.value, sub: 'Klik video / interaksi media' })), 'Belum ada data media paling sering disentuh.');
    renderAudit(summary.audit || []);
  } catch (error) {
    els.chartGrid.innerHTML = `<div class="analytics-empty">${escapeHtml(error.message || 'Analytics gagal dimuat.')}</div>`;
  } finally {
    els.refresh.disabled = false;
    els.refresh.textContent = 'Refresh Analytics';
  }
}

function triggerDownload(url, filename) {
  fetch(url, { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('Download analytics gagal.');
      return res.blob();
    })
    .then((blob) => {
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    })
    .catch((error) => alert(error.message || 'Download analytics gagal.'));
}

els.refresh?.addEventListener('click', loadAndRenderAnalytics);
els.exportHtml?.addEventListener('click', () => triggerDownload('/api/analytics/export?format=html', 'pulseboard-analytics-report.html'));
els.exportJson?.addEventListener('click', () => triggerDownload('/api/analytics/export?format=json', 'pulseboard-analytics.json'));
els.exportCsv?.addEventListener('click', () => triggerDownload('/api/analytics/export?format=csv', 'pulseboard-analytics.csv'));
loadAndRenderAnalytics();
