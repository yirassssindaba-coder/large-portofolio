(function(){
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
function setIntroMetric(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = String(value ?? '—');
}
function shortNum(v) {
  const n = Number(v || 0);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
async function fetchAnalytics() {
  const res = await fetch('/api/analytics', { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Analytics gagal dimuat.');
  return data;
}

/* ─── Color Palette ─────────────────────── */
const C = {
  gold:   'rgba(231,191,134,.96)',
  goldMid:'rgba(231,191,134,.62)',
  goldBg: 'rgba(231,191,134,.14)',
  white:  'rgba(255,255,255,.86)',
  whiteMid:'rgba(255,255,255,.45)',
  text:   'rgba(244,237,226,.78)',
  textDim:'rgba(244,237,226,.46)',
  grid:   'rgba(255,255,255,.07)',
  red:    'rgba(232,100,80,.88)',
  orange: 'rgba(218,138,60,.88)',
  teal:   'rgba(80,190,180,.88)',
  purple: 'rgba(166,107,200,.88)',
};
const DONUT_COLORS = [C.gold, C.teal, C.white, C.orange, C.purple, C.red, 'rgba(120,180,100,.88)'];

/* ─── Line Chart ─────────────────────────  */
function lineChartSvg(series, label, secondSeries = null) {
  const width = 760, height = 252;
  const pad = { top: 26, right: 22, bottom: 44, left: 46 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const allValues = [...(series || []).map((d) => Number(d.value || 0)), ...(secondSeries || []).map((d) => Number(d.value || 0))];
  const rawMax = Math.max(...allValues, 0);
  const max = rawMax === 0 ? 10 : rawMax;
  const yTicks = 4;

  const step = (series || []).length > 1 ? plotW / ((series || []).length - 1) : plotW;
  const buildPoints = (rows) => (rows || []).map((item, i) => ({
    x: pad.left + step * i,
    y: pad.top + plotH - ((Number(item.value || 0) / max) * plotH),
    date: item.date || item.label || '',
    value: Number(item.value || 0),
  }));
  const points = buildPoints(series);
  const points2 = buildPoints(secondSeries);

  const pathStr = (rows) => rows.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const path1 = pathStr(points);
  const path2 = pathStr(points2);
  const areaPath = points.length ? `${path1} L${points[points.length - 1].x.toFixed(1)},${(pad.top + plotH).toFixed(1)} L${points[0].x.toFixed(1)},${(pad.top + plotH).toFixed(1)} Z` : '';
  const gradId = `lf-${String(label).replace(/[^a-z0-9]/gi, '')}`;

  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const y = pad.top + (plotH / yTicks) * i;
    const val = max - (max / yTicks) * i;
    return `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" stroke="${C.grid}" stroke-width="1.5"/><text x="${(pad.left - 6).toFixed(1)}" y="${(y + 4).toFixed(1)}" fill="${C.textDim}" font-size="10" text-anchor="end">${shortNum(val)}</text>`;
  }).join('');

  const xAxis = `<line x1="${pad.left}" y1="${(pad.top + plotH).toFixed(1)}" x2="${(width - pad.right).toFixed(1)}" y2="${(pad.top + plotH).toFixed(1)}" stroke="${C.grid}" stroke-width="1.5"/>`;

  const ticks = points.map((p, i) => {
    if (points.length > 10 && i % 2 !== 0 && i !== points.length - 1) return '';
    const lbl = String(p.date || `P${i + 1}`).slice(-5).replace('-', '/');
    return `<text x="${p.x.toFixed(1)}" y="${(height - 10).toFixed(1)}" fill="${C.textDim}" font-size="9.5" text-anchor="middle">${escapeHtml(lbl)}</text>`;
  }).join('');

  const dots1 = points.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${C.gold}" stroke="rgba(0,0,0,.4)" stroke-width="1"><title>${escapeHtml(label)}: ${formatInt(p.value)}</title></circle>`).join('');
  const dots2 = points2.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="${C.white}" stroke="rgba(0,0,0,.4)" stroke-width="1"><title>${formatInt(p.value)}</title></circle>`).join('');

  const noDataOverlay = rawMax === 0
    ? `<text x="${(width / 2).toFixed(1)}" y="${(height / 2).toFixed(1)}" text-anchor="middle" fill="${C.textDim}" font-size="13">Belum ada data</text>`
    : '';

  return `<svg class="analytics-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}">
  <defs>
    <linearGradient id="${gradId}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="rgba(231,191,134,.32)"/>
      <stop offset="100%" stop-color="rgba(231,191,134,.01)"/>
    </linearGradient>
  </defs>
  ${gridLines}${xAxis}
  ${areaPath ? `<path d="${areaPath}" fill="url(#${gradId})"/>` : ''}
  ${path1 ? `<path d="${path1}" fill="none" stroke="${C.gold}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
  ${path2 ? `<path d="${path2}" fill="none" stroke="${C.white}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="7 5"/>` : ''}
  ${dots1}${dots2}${ticks}${noDataOverlay}
</svg>`;
}

/* ─── Bar Chart ──────────────────────────  */
function barChartSvg(series, label, horizontal = false) {
  const width = 760, height = 252;
  const pad = { top: 26, right: 22, bottom: 44, left: horizontal ? 148 : 46 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const values = (series || []).map((d) => Number(d.value || 0));
  const rawMax = Math.max(...values, 0);
  const max = rawMax === 0 ? 10 : rawMax;
  const noDataOverlay = rawMax === 0 ? `<text x="${(width / 2).toFixed(1)}" y="${(height / 2 + 4).toFixed(1)}" text-anchor="middle" fill="${C.textDim}" font-size="13">Belum ada data</text>` : '';

  if (horizontal) {
    const gap = 10;
    const count = Math.max((series || []).length, 1);
    const barH = Math.max(14, (plotH - gap * (count - 1)) / count);
    const grid = Array.from({ length: 4 }, (_, i) => {
      const x = pad.left + (plotW / 3) * i;
      return `<line x1="${x.toFixed(1)}" y1="${pad.top}" x2="${x.toFixed(1)}" y2="${(pad.top + plotH).toFixed(1)}" stroke="${C.grid}" stroke-width="1.5"/>`;
    }).join('');
    const bars = (series || []).map((item, i) => {
      const val = Number(item.value || 0);
      const y = pad.top + i * (barH + gap);
      const bw = (val / max) * plotW;
      const lbl = escapeHtml(normalizeLabel(item.label || item.date || 'Data').slice(0, 14));
      return `<g>
        <rect x="${pad.left}" y="${y.toFixed(1)}" width="${Math.max(2, bw).toFixed(1)}" height="${barH.toFixed(1)}" rx="8" fill="${C.gold}"/>
        <rect x="${pad.left}" y="${y.toFixed(1)}" width="${Math.max(2, bw * 0.35).toFixed(1)}" height="${barH.toFixed(1)}" rx="8" fill="rgba(255,255,255,.09)"/>
        <text x="${(pad.left - 8).toFixed(1)}" y="${(y + barH / 2 + 4).toFixed(1)}" fill="${C.text}" font-size="10.5" text-anchor="end">${lbl}</text>
        <text x="${(pad.left + bw + 8).toFixed(1)}" y="${(y + barH / 2 + 4).toFixed(1)}" fill="${C.gold}" font-size="10.5">${escapeHtml(formatInt(val))}</text>
      </g>`;
    }).join('');
    return `<svg class="analytics-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}">${grid}${bars}${noDataOverlay}</svg>`;
  }

  const gap = 10;
  const count = Math.max((series || []).length, 1);
  const barW = Math.max(10, (plotW - gap * (count - 1)) / count);

  const gridLines = Array.from({ length: 4 }, (_, i) => {
    const y = pad.top + (plotH / 3) * i;
    const val = max - (max / 3) * i;
    return `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${(width - pad.right).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${C.grid}" stroke-width="1.5"/><text x="${(pad.left - 6).toFixed(1)}" y="${(y + 4).toFixed(1)}" fill="${C.textDim}" font-size="10" text-anchor="end">${shortNum(val)}</text>`;
  }).join('');

  const bars = (series || []).map((item, i) => {
    const val = Number(item.value || 0);
    const x = pad.left + i * (barW + gap);
    const h = Math.max(2, (val / max) * plotH);
    const y = pad.top + plotH - h;
    const lbl = String(item.date || item.label || '').slice(-5).replace('-', '/');
    const showVal = val > 0;
    return `<g>
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="9" fill="${C.gold}"/>
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.min(h * 0.4, 20).toFixed(1)}" rx="9" fill="rgba(255,255,255,.1)"/>
      ${showVal ? `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" fill="${C.goldMid}" font-size="9.5" text-anchor="middle">${shortNum(val)}</text>` : ''}
      <text x="${(x + barW / 2).toFixed(1)}" y="${(height - 10).toFixed(1)}" fill="${C.textDim}" font-size="9.5" text-anchor="middle">${escapeHtml(lbl)}</text>
    </g>`;
  }).join('');

  const xAxis = `<line x1="${pad.left}" y1="${(pad.top + plotH).toFixed(1)}" x2="${(width - pad.right).toFixed(1)}" y2="${(pad.top + plotH).toFixed(1)}" stroke="${C.grid}" stroke-width="1.5"/>`;

  return `<svg class="analytics-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(label)}">${gridLines}${xAxis}${bars}${noDataOverlay}</svg>`;
}

/* ─── Donut Chart ────────────────────────  */
function donutChartSvg(series, label) {
  const total = Math.max(1, (series || []).reduce((s, d) => s + Number(d.value || 0), 0));
  const hasData = (series || []).some((d) => Number(d.value || 0) > 0);
  const size = 240, cx = size / 2, cy = size / 2, r = 74;
  const circumference = Math.PI * 2 * r;
  let offset = 0;

  const segments = hasData
    ? (series || []).map((item, i) => {
        const val = Number(item.value || 0);
        const dash = circumference * (val / total);
        const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${DONUT_COLORS[i % DONUT_COLORS.length]}" stroke-width="24" stroke-linecap="butt" stroke-dasharray="${dash.toFixed(2)} ${(circumference - dash).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`;
        offset += dash;
        return seg;
      }).join('')
    : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.grid}" stroke-width="24"/>`;

  const legend = (series || []).map((item, i) => {
    const pct = Math.round((Number(item.value || 0) / total) * 100);
    return `<span><i style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></i>${escapeHtml(normalizeLabel(item.label))} · ${formatInt(item.value)} (${pct}%)</span>`;
  }).join('');

  const centerLabel = hasData ? formatInt(total) : '—';
  const svg = `<svg class="analytics-chart" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escapeHtml(label)}">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="24"/>
  ${segments}
  <circle cx="${cx}" cy="${cy}" r="${r - 12}" fill="rgba(18,14,12,.6)"/>
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="rgba(244,237,226,.95)" font-size="30" font-weight="800">${centerLabel}</text>
  <text x="${cx}" y="${cy + 20}" text-anchor="middle" fill="${C.textDim}" font-size="11">Total</text>
</svg>`;
  return { svg, legend };
}

/* ─── Overview KPI ───────────────────────  */
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
  setIntroMetric('[data-post-intro-comments]', kpis.totalComments ?? 0);
  setIntroMetric('[data-post-intro-sessions]', kpis.sessions ?? 0);
  setIntroMetric('[data-post-intro-duration]', kpis.avgSessionDurationLabel || formatDuration(kpis.avgSessionDurationMs));
}

/* ─── Render Charts ──────────────────────  */
function renderCharts(summary) {
  const charts = summary.charts || {};
  const cards = [];

  cards.push({ title: 'Visitor per hari', note: 'Page views 14 hari terakhir', html: lineChartSvg(charts.visitorsPerDay, 'Visitor per hari') });
  cards.push({ title: 'Unique vs Returning', note: 'Pengunjung baru (emas) vs kembali (putih)', html: lineChartSvg(charts.uniqueVisitorsPerDay, 'Unique', charts.returningVisitorsPerDay) });
  cards.push({ title: 'Engagement per hari', note: 'Klik CTA dan interaksi utama', html: barChartSvg(charts.engagementPerDay, 'Engagement per hari') });
  cards.push({ title: 'Post baru vs terhapus', note: 'Pertumbuhan vs penghapusan konten', html: lineChartSvg(charts.postsCreatedPerDay, 'Post baru', charts.postsDeletedPerDay) });
  cards.push({ title: 'Net growth post', note: 'Post baru dikurangi post terhapus', html: lineChartSvg(charts.netPostGrowth, 'Net growth post') });
  cards.push({ title: 'Komentar & balasan', note: 'Aktivitas percakapan publik', html: lineChartSvg(charts.commentsPerDay, 'Komentar', charts.repliesPerDay) });
  cards.push({ title: 'Video plays per hari', note: 'Klik video / play intent', html: lineChartSvg(charts.videoPlaysPerDay, 'Video plays') });
  cards.push({ title: 'CTR CTA per hari', note: 'Persentase klik CTA terhadap page views', html: barChartSvg(charts.ctaCtrPerDay, 'CTR CTA') });

  cards.push({
    title: 'Traffic source',
    note: 'Distribusi sumber trafik masuk',
    html: (() => {
      const d = donutChartSvg(charts.trafficSources, 'Traffic source');
      return `<div class="analytics-donut-wrap">${d.svg}<div class="analytics-legend">${d.legend}</div></div>`;
    })(),
  });
  cards.push({
    title: 'Device usage',
    note: 'Desktop, mobile, tablet',
    html: (() => {
      const d = donutChartSvg(charts.deviceUsage, 'Device usage');
      return `<div class="analytics-donut-wrap">${d.svg}<div class="analytics-legend">${d.legend}</div></div>`;
    })(),
  });

  cards.push({ title: 'Page views per section', note: 'Halaman atau section paling ramai', html: barChartSvg(charts.pageViewsBySection, 'Page views per section', true) });
  cards.push({ title: 'Error teknis', note: 'Error JavaScript dan unhandled rejection', html: barChartSvg(charts.errorRatePerDay, 'Error teknis') });

  els.chartGrid.innerHTML = cards.map((card) => `
    <article class="analytics-chart-card">
      <div class="analytics-chart-card__head">
        <h3>${escapeHtml(card.title)}</h3>
        <p class="analytics-chart-note">${escapeHtml(card.note)}</p>
      </div>
      ${card.html}
    </article>`).join('');
}

/* ─── Mini Cards ─────────────────────────  */
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

/* ─── Rank List ──────────────────────────  */
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

/* ─── Audit Log ──────────────────────────  */
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

/* ─── Load & Render ──────────────────────  */
async function loadAndRenderAnalytics() {
  els.refresh.disabled = true;
  els.refresh.textContent = 'Memuat…';
  try {
    const summary = await fetchAnalytics();
    renderOverview(summary.kpis || {});
    renderCharts(summary);
    renderMini(summary);
    renderRankList(els.topPages, (summary.topPages || []).map((row) => ({ label: row.label, value: row.value, sub: 'Page views tercatat' })), 'Belum ada data halaman.');
    renderRankList(els.trafficSources, (summary.trafficSources || []).map((row) => ({ label: row.label, value: row.value, sub: 'Sesi dari sumber ini' })), 'Belum ada data sumber trafik.');
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

})();
