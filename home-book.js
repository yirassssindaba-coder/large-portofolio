(() => {
  const stage = document.querySelector('[data-library-book]');
  if (!stage) return;

  const docs = [
    {
      title: 'Atlas Negara Dunia',
      subtitle: '191 negara · bendera · mata uang · arah jalan · harga tempat tinggal',
      cover: 'assets/book/atlas-negara.png',
      pdf: 'docs/atlas-negara.pdf',
      accent: 'atlas',
      summary: 'Atlas global cepat untuk membaca negara, ibu kota, arah lalu lintas, mata uang, dan snapshot biaya tinggal.'
    },
    {
      title: 'Kompendium Fokus Binatang',
      subtitle: '60 entri · ternak · unggas · perairan · penyerbuk · penjaga',
      cover: 'assets/book/kompendium-binatang.png',
      pdf: 'docs/kompendium-binatang.pdf',
      accent: 'animal',
      summary: 'Kelompok ternak besar, ternak kecil, unggas, hewan perairan, penyerbuk, dan penjaga alami.'
    },
    {
      title: 'Kompendium Fokus Tanaman',
      subtitle: '80 entri · hias · pangan · herbal · buah · pohon · pupuk',
      cover: 'assets/book/kompendium-tanaman.png',
      pdf: 'docs/kompendium-tanaman.pdf',
      accent: 'plant',
      summary: 'Peta tanaman hias, bunga, sukulen, pangan, rempah, buah, pohon, dan pupuk dalam format rapi.'
    },
    {
      title: 'Kompendium Fokus Teknologi',
      subtitle: '61 entri · bahasa · runtime · engine · Android · workflow',
      cover: 'assets/book/kompendium-teknologi.png',
      pdf: 'docs/kompendium-teknologi.pdf',
      accent: 'tech',
      summary: 'Inventaris bahasa, runtime, engine, toolchain mobile, editor, dan sistem interaktif yang tersedia.'
    }
  ];

  const sheets = [
    { front: { kind: 'cover' }, back: docs[0] },
    { front: docs[1], back: docs[2] },
    { front: docs[3], back: { kind: 'back' } }
  ];

  const metaHost = document.querySelector('[data-library-meta-host]');

  stage.innerHTML = `
    <div class="library-book__shell">
      <div class="library-book" id="libraryBook" data-book-state="closed">
        ${sheets.map((sheet, index) => `
          <div class="book-sheet" data-sheet-index="${index}">
            <div class="book-face book-face--front">${renderFace(sheet.front, index, 'front')}</div>
            <div class="book-face book-face--back">${renderFace(sheet.back, index, 'back')}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (metaHost) {
    metaHost.innerHTML = `
      <div class="library-book__meta library-book__meta--external">
        <div class="eyebrow">Current spread</div>
        <h3 id="bookSpreadTitle">Closed Cover</h3>
        <p id="bookSpreadText">Buku berada dalam posisi tertutup. Buka untuk melihat empat dokumen utama lalu tutup kembali ke cover depan.</p>
        <div class="pill-row" id="bookSpreadPills"></div>
      </div>
    `;
  }

  const book = stage.querySelector('#libraryBook');
  const spreadTitle = document.getElementById('bookSpreadTitle');
  const spreadText = document.getElementById('bookSpreadText');
  const spreadPills = document.getElementById('bookSpreadPills');
  const viewer = document.getElementById('pdfViewer');
  const viewerTitle = document.getElementById('pdfViewerTitle');
  const viewerFrame = document.getElementById('pdfViewerFrame');
  const viewerDownload = document.getElementById('pdfViewerDownload');
  const sheetsEls = [...stage.querySelectorAll('.book-sheet')];

  const state = { open: false, index: 0, max: sheets.length };

  function renderFace(face, index, side) {
    if (face.kind === 'cover') {
      return `
        <div class="book-page book-page--cover">
          <div class="eyebrow">PulseBoard Fusion</div>
          <h3>Pulse Library</h3>
          <p>Buku 3D empat dokumen utama yang bisa dibuka, dibalik bolak-balik, lalu ditutup kembali ke cover depan.</p>
          <div class="book-page__actions">
            <button class="button magnetic" type="button" data-book-action="open">Open Book</button>
          </div>
        </div>`;
    }
    if (face.kind === 'back') {
      return `
        <div class="book-page book-page--backcover">
          <div class="eyebrow">Back Cover</div>
          <h3>Archive sealed.</h3>
          <p>Setelah lembar terakhir, buku dapat ditutup kembali sehingga cover depan tampil utuh dalam posisi tertutup.</p>
          <div class="book-page__actions">
            <button class="ghost-button magnetic" type="button" data-book-action="close">Close Book</button>
          </div>
        </div>`;
    }
    return `
      <div class="book-page book-page--doc book-page--${face.accent}">
        <div class="book-page__preview"><img src="${face.cover}" alt="${face.title}" loading="lazy"></div>
        <div class="book-page__body">
          <div class="eyebrow">${side === 'front' ? 'Front page' : 'Back page'}</div>
          <h3>${face.title}</h3>
          <div class="book-page__subtitle">${face.subtitle}</div>
          <p>${face.summary}</p>
          <div class="book-page__actions">
            <button class="button magnetic" type="button" data-open-pdf="${face.pdf}" data-pdf-title="${face.title}">Buka PDF</button>
            <a class="ghost-button magnetic" href="${face.pdf}" download="${face.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'dokumen'}.pdf">Unduh PDF</a>
          </div>
        </div>
      </div>`;
  }

  function updateMeta() {
    let title = 'Closed Cover';
    let text = 'Buku berada dalam posisi tertutup. Buka untuk melihat empat dokumen utama lalu tutup kembali ke cover depan.';
    let pills = ['Closed', '4 dokumen', '3 sheet'];

    if (state.open) {
      const sheetIndex = Math.min(state.index, sheets.length - 1);
      const currentSheet = sheets[sheetIndex] || sheets[0];
      const currentFace = state.index >= sheets.length ? currentSheet.back : (state.index === 0 ? currentSheet.front : currentSheet.back || currentSheet.front);
      const doc = currentFace && !currentFace.kind ? currentFace : null;
      if (doc) {
        title = doc.title;
        text = doc.summary;
        pills = [doc.subtitle.split('·')[0].trim(), `Sheet ${sheetIndex + 1}/${sheets.length}`, 'Open'];
      } else if (state.index >= sheets.length) {
        title = 'Back Cover';
        text = 'Lembar terakhir aktif. Tekan Close Book atau geser balik untuk menutup kembali buku.';
        pills = ['End cover', `Sheet ${sheets.length}/${sheets.length}`, 'Open'];
      } else {
        title = 'Front Cover';
        text = 'Buku terbuka di cover depan. Lanjutkan flip ke dokumen berikutnya atau tutup kembali ke cover depan.';
        pills = ['Cover', 'Open', `Sheet 1/${sheets.length}`];
      }
    }

    if (spreadTitle) spreadTitle.textContent = title;
    if (spreadText) spreadText.textContent = text;
    if (spreadPills) spreadPills.innerHTML = pills.map((pill) => `<span class="pill">${pill}</span>`).join('');
  }

  function render() {
    book.classList.toggle('is-open', state.open);
    book.dataset.bookState = state.open ? 'open' : 'closed';
    sheetsEls.forEach((sheet, idx) => {
      sheet.classList.toggle('is-flipped', idx < state.index);
      sheet.style.zIndex = String(sheets.length - idx + (idx < state.index ? 0 : 20));
    });
    updateMeta();
  }

  function openBook() {
    state.open = true;
    render();
  }
  function closeBook() {
    state.open = false;
    state.index = 0;
    render();
  }
  function nextPage() {
    if (!state.open) {
      openBook();
      return;
    }
    if (state.index < state.max) {
      state.index += 1;
      render();
      return;
    }
    closeBook();
  }
  function prevPage() {
    if (state.index > 0) {
      state.index -= 1;
      state.open = true;
      render();
      return;
    }
    closeBook();
  }

  function openPdf(pdf, title) {
    if (!viewer || !viewerFrame || !viewerTitle) return;
    viewerTitle.textContent = title || 'Dokumen';
    if (viewerDownload) {
      viewerDownload.href = pdf;
      viewerDownload.setAttribute('download', `${(title || 'dokumen').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`);
    }
    viewerFrame.src = `${pdf}#view=FitH`;
    viewer.classList.add('is-visible');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-modal-open');
  }
  function closePdf() {
    if (!viewer) return;
    viewer.classList.remove('is-visible');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-modal-open');
    if (viewerFrame) viewerFrame.src = 'about:blank';
  }

  stage.addEventListener('click', (event) => {
    const button = event.target.closest('[data-open-pdf]');
    if (button) {
      openPdf(button.getAttribute('data-open-pdf'), button.getAttribute('data-pdf-title'));
      return;
    }
    const action = event.target.closest('[data-book-action]')?.getAttribute('data-book-action');
    if (action === 'open') openBook();
    if (action === 'close') closeBook();
  });

  let pointerStartX = 0;
  stage.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });
  stage.addEventListener('pointerup', (event) => {
    const delta = event.clientX - pointerStartX;
    if (Math.abs(delta) < 36) return;
    if (delta < 0) nextPage();
    else prevPage();
  });

  document.querySelector('[data-book-open]')?.addEventListener('click', () => state.open ? closeBook() : openBook());
  document.querySelector('[data-book-next]')?.addEventListener('click', nextPage);
  document.querySelector('[data-book-prev]')?.addEventListener('click', prevPage);
  document.querySelectorAll('[data-pdf-close]').forEach((item) => item.addEventListener('click', closePdf));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') nextPage();
    if (event.key === 'ArrowLeft') prevPage();
    if (event.key === 'Escape') closePdf();
  });

  render();
})();
