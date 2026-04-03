function emergencyHideLoader() {
  const loaderEl = document.getElementById('loader');
  const barEl = document.getElementById('loaderBar');
  const countEl = document.getElementById('loaderCount');
  if (barEl) barEl.style.width = '100%';
  if (countEl) countEl.textContent = '100';
  if (loaderEl) loaderEl.classList.add('is-hidden');
}

window.addEventListener('error', () => {
  setTimeout(emergencyHideLoader, 30);
});
window.addEventListener('unhandledrejection', () => {
  setTimeout(emergencyHideLoader, 30);
});
window.setTimeout(emergencyHideLoader, 4500);

const officialDocumentCounts = {
  newsChannels: 11,
  marketplaces: 11
};


const videoLibrary = {
  botanicalA: { id: "9tgpy9yQF8s", title: "Botanical motion", desc: "Lapisan hijau untuk membuka ritme visual Green Atlas.", tag: "Plants" },
  botanicalB: { id: "v77aOnfx3mY", title: "Indoor foliage", desc: "Nuansa foliage tropis dan interior tanaman yang lebih rapat.", tag: "Foliage" },
  wildA: { id: "o50N3-OaGdM", title: "Wild terrain", desc: "Suasana satwa dan bentang alam untuk menambah energi Wild Echo.", tag: "Animals" },
  techA: { id: "wrJsExM8D-o", title: "Future systems", desc: "Nuansa teknologi modern untuk memberi karakter pada Tech Forge.", tag: "Technology" },
  aiA: { id: "AfCtuB0agkM", title: "AI systems", desc: "Lapisan masa depan dan AI untuk memperkuat atmosfer digital.", tag: "AI" },
  portfolioA: { id: "uw6C8Z1XieY", title: "Portfolio deck", desc: "Inspirasi showcase modern yang memperkaya Studio Deck.", tag: "Portfolio" },
  designA: { id: "sFY1_tEXcOs", title: "Creative deck", desc: "Tambahan layer presentasi untuk karya dan studi kasus visual.", tag: "Design" }
};

const siteData = {
  home: {
    label: "PulseBoard redesign",
    title: "PulseBoard Fusion",
    kicker: "Redesign untuk proyek PulseBoard Strae Fusion dengan arah visual sinematik, modern, dinamis, dan serba bisa, sambil menjaga fokus utama pada tanaman, binatang, teknologi, dan portofolio.",
    body: "Proyek yang dilampirkan kini dirombak memakai sistem multi-page yang lebih rapi. Seluruh media utamanya memakai embed YouTube yang bisa diputar langsung di halaman dan komposisinya akan berubah saat halaman dimuat ulang atau tombol acak ditekan.",
    ctaPrimary: { text: "Open Farm World", href: "game.html" },
    ctaSecondary: { text: "Open Studio Deck", href: "portfolio.html" },
    stats: [
      { label: "Plant focus", value: 80 },
      { label: "Animal focus", value: 60 },
      { label: "Tech focus", value: 61 },
      { label: "TV channels", value: officialDocumentCounts.newsChannels },
      { label: "Marketplaces", value: officialDocumentCounts.marketplaces }
    ],
    visualCards: [
      { type: "floating", tag: "Plants", title: "Green Atlas", text: "Daun, bunga, pangan, buah, pohon, dan sistem tanah dalam atlas visual modern." },
      { type: "", tag: "Animals", title: "Wild Echo", text: "Ternak, unggas, perairan, penyerbuk, dan penjaga alami dalam ritme yang lebih dramatis." },
      { type: "floating-slow", tag: "Technology", title: "Tech Forge", text: "Bahasa, runtime, engine, Android chain, dan sistem interaktif dalam satu control-room." },
      { type: "", tag: "Portfolio", title: "Studio Deck", text: "Karya, presentasi, dan arah desain yang terasa sebagai satu family project." }
    ],
    strip: ["plants", "animals", "technology", "portfolio", "youtube embed", "shuffle on load", "modern system", "multi-page"],
    sections: {
      featureTitle: "Five worlds, one system.",
      featureText: "Setiap fokus utama punya karakternya sendiri, tetapi semua masih disatukan oleh bahasa visual yang sama.",
      features: [
        { tag: "Plants", title: "Green systems", text: "Tanaman dibaca sebagai atlas, bukan sekadar daftar kategori." },
        { tag: "Animals", title: "Wild systems", text: "Binatang diberi ritme lebih hangat, lebih liar, dan tetap rapi." },
        { tag: "Technology", title: "Tech systems", text: "Teknologi ditampilkan sebagai peta kemampuan yang kuat dan serba bisa." },
        { tag: "Portfolio", title: "Studio systems", text: "Portfolio menjadi panggung untuk karya, stack, dan presentasi proyek." }
      ],
      railTitle: "Built for motion.",
      railText: "Loader, reveal, tilt, magnetic hover, dan rail YouTube acak membuat halaman terasa aktif setiap kali dibuka.",
      rails: [
        { tag: "Embed", title: "YouTube only", text: "Seluruh video dipasang memakai iframe embed YouTube yang bisa diputar langsung di halaman." },
        { tag: "Shuffle", title: "Reload random", text: "Reload atau klik tombol acak akan mengganti komposisi rail video secara instan." },
        { tag: "Structure", title: "Multi-page build", text: "Portal utama dan empat halaman fokus tetap bergerak sebagai satu sistem PulseBoard yang utuh." }
      ],
      mediaTitle: "Randomized YouTube stage.",
      mediaText: "Halaman utama memadukan plants, animals, tech, dan portfolio ke dalam stage embed yang berubah saat load.",
      videoKeys: ["botanicalA", "wildA", "techA", "portfolioA", "aiA", "designA"]
    }
  },
  plants: {
    label: "Botanical reference",
    title: "Green Atlas",
    kicker: "Atlas tanaman yang terang, hidup, dan modern, dengan fokus pada keterbacaan dan rasa editorial.",
    body: "Halaman ini menjaga fokus pada dunia tanaman, lalu menghidupkannya dengan stage YouTube acak yang ikut berubah saat halaman dibuka ulang.",
    ctaPrimary: { text: "Back Home", href: "index.html" },
    ctaSecondary: { text: "Open Media", href: "#media" },
    stats: [
      { label: "Reference entries", value: 80 },
      { label: "Core groups", value: 8 },
      { label: "Media slots", value: 4 },
      { label: "Dynamic load", value: 1 }
    ],
    visualCards: [
      { type: "floating", tag: "Leaves", title: "Interior foliage", text: "Daun besar, climbers, variegata, dan suasana tenang untuk ruang hijau modern." },
      { type: "", tag: "Bloom", title: "Flower lanes", text: "Bunga taman dan warna musiman untuk border, pot, dan halaman hidup." },
      { type: "floating-slow", tag: "Field", title: "Edible beds", text: "Pangan, herbal, rempah, dan jalur kebun produktif yang jelas." },
      { type: "", tag: "Canopy", title: "Fruit trees", text: "Buah tropis dan pohon peneduh untuk struktur kebun yang matang." }
    ],
    strip: ["ornamental", "flowers", "succulents", "edibles", "herbs", "fruits", "trees", "soil"],
    sections: {
      featureTitle: "Plant architecture.",
      featureText: "Kelompok tanaman dirapikan sebagai atlas visual agar padat isi tetapi tetap enak dibaca.",
      features: [
        { tag: "Leaf", title: "Foliage line", text: "Monstera, philodendron, aglaonema, calathea, ZZ plant, dan houseplant lain." },
        { tag: "Bloom", title: "Flower line", text: "Mawar, melati, anggrek, bougainvillea, gardenia, dan bunga potong populer." },
        { tag: "Food", title: "Field line", text: "Padi, jagung, cabai, tomat, sayur daun, dan rempah untuk kebun produktif." },
        { tag: "Tree", title: "Orchard line", text: "Mangga, pisang, alpukat, jeruk, dan pohon peneduh yang membentuk ruang." }
      ],
      railTitle: "Green systems.",
      railText: "Tanaman tidak hanya tampil dekoratif, tetapi juga produktif, aromatik, dan struktural.",
      rails: [
        { tag: "Interior", title: "Calm foliage", text: "Nuansa teduh untuk tanaman indoor dan semi-outdoor yang halus." },
        { tag: "Harvest", title: "Edible beds", text: "Kebun rumah dan komoditas pangan kecil yang mudah divisualkan." },
        { tag: "Landscape", title: "Canopy belts", text: "Pohon, buah, dan struktur kebun untuk skala ruang yang lebih besar." }
      ],
      mediaTitle: "Plant stage.",
      mediaText: "Rail embed acak memberi Green Atlas lapisan hidup setiap kali halaman dimuat.",
      videoKeys: ["botanicalA", "botanicalB", "techA", "wildA", "aiA"]
    }
  },
  animals: {
    label: "Field ecology",
    title: "Wild Echo",
    kicker: "Halaman binatang yang lebih hangat, lebih liar, dan lebih dramatis, namun tetap rapi dan modern.",
    body: "Wild Echo menata ternak, unggas, perairan, penyerbuk, dan penjaga alami ke dalam layout yang lebih kuat, lalu menambahkan rail YouTube acak agar medianya terus terasa hidup.",
    ctaPrimary: { text: "Back Home", href: "index.html" },
    ctaSecondary: { text: "Open Media", href: "#media" },
    stats: [
      { label: "Reference entries", value: 60 },
      { label: "Core groups", value: 6 },
      { label: "Media slots", value: 4 },
      { label: "Dynamic load", value: 1 }
    ],
    visualCards: [
      { type: "floating", tag: "Herd", title: "Large stock", text: "Sapi, kerbau, kambing, domba, dan utilitas ternak besar." },
      { type: "", tag: "Flock", title: "Yard birds", text: "Ayam, itik, entok, angsa, dan unggas yang aktif di pekarangan." },
      { type: "floating-slow", tag: "Water", title: "Aquatic line", text: "Lele, nila, gurame, patin, bandeng, dan komoditas perairan lain." },
      { type: "", tag: "Balance", title: "Eco roles", text: "Lebah, cacing, kucing lumbung, burung hantu, dan penjaga alami." }
    ],
    strip: ["ruminants", "poultry", "aquaculture", "pollinators", "guardians", "field rhythm"],
    sections: {
      featureTitle: "Animal architecture.",
      featureText: "Fauna dibaca menurut peran: produksi, ekologi, atau perlindungan area.",
      features: [
        { tag: "Herd", title: "Large livestock", text: "Sapi, kerbau, kambing, domba, kuda kerja, dan utilitas padang." },
        { tag: "Flock", title: "Poultry systems", text: "Ayam kampung, itik, entok, angsa, kalkun, dan puyuh." },
        { tag: "Water", title: "Aquaculture", text: "Lele, nila, gurame, patin, ikan mas, bandeng, dan komoditas lain." },
        { tag: "Balance", title: "Support fauna", text: "Lebah, kupu-kupu, cacing, anjing penjaga, dan kucing lumbung." }
      ],
      railTitle: "Wild systems.",
      railText: "Binatang hadir sebagai komoditas, penjaga ekosistem, sekaligus utilitas lahan.",
      rails: [
        { tag: "Farm", title: "Production lanes", text: "Kelompok penghasil daging, susu, telur, serat, dan nilai usaha." },
        { tag: "Eco", title: "Support lanes", text: "Penyerbuk dan predator alami untuk menjaga kebun tetap seimbang." },
        { tag: "Guard", title: "Protection lanes", text: "Penjaga area, lumbung, dan kawanan dalam sistem terpadu." }
      ],
      mediaTitle: "Animal stage.",
      mediaText: "Rail embed acak menjaga Wild Echo tetap hidup dan tidak terasa kaku.",
      videoKeys: ["wildA", "botanicalA", "techA", "aiA", "portfolioA"]
    }
  },
  tech: {
    label: "Capability map",
    title: "Tech Forge",
    kicker: "Control-room untuk bahasa, runtime, data, engine, Android, dan sistem interaktif dalam satu frame yang modern.",
    body: "Tech Forge memadukan spektrum teknologi yang luas dengan section media yang seluruhnya memakai embed YouTube dan berubah secara acak saat load.",
    ctaPrimary: { text: "Back Home", href: "index.html" },
    ctaSecondary: { text: "Open Media", href: "#media" },
    stats: [
      { label: "Reference entries", value: 61 },
      { label: "Core groups", value: 7 },
      { label: "Media slots", value: 4 },
      { label: "Dynamic load", value: 1 }
    ],
    visualCards: [
      { type: "floating", tag: "Runtime", title: "Core stack", text: "Python, Node.js, Go, .NET, Java, Rust, PHP, dan runtime penting lainnya." },
      { type: "", tag: "Web", title: "Modern web", text: "TypeScript, Vite, Bun, Deno, npm, npx, dan workflow frontend-backend." },
      { type: "floating-slow", tag: "Engine", title: "Creative engines", text: "Blender, Unity, Godot, Unreal, serta pipeline interaktif dan visual." },
      { type: "", tag: "Mobile", title: "Android chain", text: "SDK, NDK, adb, sdkmanager, dan jalur build Android yang lengkap." }
    ],
    strip: ["core languages", "javascript", "data", "engines", "android", "interactive systems"],
    sections: {
      featureTitle: "Technology architecture.",
      featureText: "Konten ditata sebagai capability map untuk web, aplikasi, data, game, dan mobile build.",
      features: [
        { tag: "Core", title: "Foundation stack", text: "Python, C, C++, Java, .NET, Go, Swift, Kotlin, Ruby, Rust, Bash, dan compiler." },
        { tag: "Web", title: "JS ecosystem", text: "Node.js, V8, npm, npx, TypeScript, Vite, Deno, Bun, dan PHP." },
        { tag: "Creative", title: "Engines & IDEs", text: "Blender, Godot, Unity, Visual Studio, dan Unreal Engine Editor." },
        { tag: "Delivery", title: "Interactive systems", text: "Android toolchain, ShaderLab, Input, UI, Audio, NavMesh, dan Addressables." }
      ],
      railTitle: "Build beyond one stack.",
      railText: "Tech Forge tampil sebagai capability map yang luas, bukan satu stack yang sempit.",
      rails: [
        { tag: "Data", title: "Science lane", text: "R, Julia, SQLite, dan arah kerja analitik atau komputasi." },
        { tag: "Alt", title: "Functional lane", text: "Haskell, Scala, Clojure, Elixir, Erlang, OCaml, Lua, Nim, Crystal, dan Guile." },
        { tag: "Engine", title: "Interactive lane", text: "Workflow visual dan sistem gameplay untuk presentasi yang lebih kaya." }
      ],
      mediaTitle: "Tech stage.",
      mediaText: "Rail embed acak memberi Tech Forge rasa futuristik yang tidak monoton.",
      videoKeys: ["techA", "aiA", "portfolioA", "designA", "wildA"]
    }
  },
  portfolio: {
    label: "Showcase system",
    title: "Studio Deck",
    kicker: "Panggung untuk karya, arah desain, dan kemampuan teknis yang dipresentasikan dengan lebih yakin dan modern.",
    body: "Studio Deck menempatkan portfolio sebagai sistem yang punya identitas dan ritme presentasi sendiri. Rail embed YouTube-nya juga diacak saat halaman dimuat agar showcase tidak terasa beku.",
    ctaPrimary: { text: "Back Home", href: "index.html" },
    ctaSecondary: { text: "Open Media", href: "#media" },
    stats: [
      { label: "Showcase lanes", value: 4 },
      { label: "Capability stacks", value: 5 },
      { label: "Media slots", value: 4 },
      { label: "Dynamic load", value: 1 }
    ],
    visualCards: [
      { type: "floating", tag: "Project", title: "PulseBoard Fusion", text: "Portal hybrid untuk tanaman, binatang, teknologi, portofolio, dan farm world WebGL." },
      { type: "", tag: "Direction", title: "Design language", text: "Hero editorial, grid terkontrol, panel tekstur, dan motion yang rapi." },
      { type: "floating-slow", tag: "Stack", title: "Toolchain scope", text: "Web, creative engines, runtime, dan delivery-ready structure." },
      { type: "", tag: "Delivery", title: "Presentation mode", text: "Multi-page, responsive, embed media, dan ritme case study yang lebih meyakinkan." }
    ],
    strip: ["showcase", "case study", "toolchain", "presentation", "deployment", "motion"],
    sections: {
      featureTitle: "Portfolio architecture.",
      featureText: "Portfolio diletakkan seperti sistem yang menjelaskan karya, proses, dan kapasitas teknis bersamaan.",
      features: [
        { tag: "Series", title: "Linked projects", text: "Green Atlas, Wild Echo, Tech Forge, dan Studio Deck tampil sebagai satu keluarga halaman di dalam PulseBoard Fusion." },
        { tag: "Direction", title: "Design approach", text: "Rasa editorial, komposisi modern, dan motion ringan yang membuat layout terasa hidup." },
        { tag: "Technical", title: "Capability scope", text: "HTML, CSS, JavaScript, Python, Node.js, Blender, Unity, Godot, Unreal, dan jalur lain." },
        { tag: "Output", title: "Ready to present", text: "Struktur mudah dijalankan lokal, mudah diperluas, dan cocok untuk showcase lanjutan." }
      ],
      railTitle: "Capability lanes.",
      railText: "Studio Deck tidak berhenti pada visual, tetapi juga memperlihatkan arah teknis dan produksi.",
      rails: [
        { tag: "Frontend", title: "Web craft", text: "Landing page, dashboard, grid editorial, dan polish interaksi." },
        { tag: "Creative", title: "Asset flow", text: "3D, engine, visual direction, dan komposisi berbasis media." },
        { tag: "Production", title: "Build flow", text: "Environment setup, delivery awareness, dan struktur multi-page yang berkembang." }
      ],
      mediaTitle: "Portfolio stage.",
      mediaText: "Rail embed acak dipakai agar area showcase selalu terasa aktif setiap kali dibuka.",
      videoKeys: ["portfolioA", "designA", "techA", "aiA", "botanicalA"]
    }
  }
};


const themePools = {
  "plants": [
    {
      "id": "9tgpy9yQF8s",
      "title": "Kingdom of Plants",
      "tag": "Plants"
    },
    {
      "id": "v77aOnfx3mY",
      "title": "Aroid Land",
      "tag": "Plants"
    },
    {
      "id": "QCFFzXOrFK4",
      "title": "Kew Gardens in Spring",
      "tag": "Garden"
    },
    {
      "id": "XUYJjicm87Y",
      "title": "Secrets of Kew Gardens",
      "tag": "Garden"
    },
    {
      "id": "w1lec-a_40Y",
      "title": "Secret Life of Plants",
      "tag": "Nature"
    },
    {
      "id": "eGPjpMYLqbs",
      "title": "Bonsai 4K",
      "tag": "Bonsai"
    },
    {
      "id": "BZy6BLF2lCU",
      "title": "Structured Garden",
      "tag": "Landscape"
    },
    {
      "id": "lOy1YUeuR9A",
      "title": "Kebun Raya Purwodadi",
      "tag": "Botanical"
    },
    {
      "id": "8o_6mp0Ce3M",
      "title": "Botanic Gardens Brisbane",
      "tag": "Botanical"
    },
    {
      "id": "dbyV1xncWs4",
      "title": "Plants Survival 4K",
      "tag": "Plants"
    }
  ],
  "animals": [
    {
      "id": "o50N3-OaGdM",
      "title": "Adventure Through Africa",
      "tag": "Wildlife"
    },
    {
      "id": "5D-fWkQylSQ",
      "title": "World of Animals 4K",
      "tag": "Animals"
    },
    {
      "id": "oWjiya3s3zg",
      "title": "Animal Wildlife Discovery",
      "tag": "Animals"
    },
    {
      "id": "DB_YPensOPE",
      "title": "Tanzania Lions",
      "tag": "Wildlife"
    },
    {
      "id": "lONZdiuuQAs",
      "title": "Animal World 4K",
      "tag": "Animals"
    },
    {
      "id": "dlsm-_NgGWw",
      "title": "Australia Documentary 4K",
      "tag": "Outback"
    },
    {
      "id": "LYGvsTUJFM8",
      "title": "Wildlife Discovery 60FPS",
      "tag": "Wildlife"
    },
    {
      "id": "Q4xf-ca0GWQ",
      "title": "Wildlife Warrior",
      "tag": "Nat Geo"
    },
    {
      "id": "0LkC7I_H1As",
      "title": "Fastest Animals",
      "tag": "Wildlife"
    },
    {
      "id": "rdAoreF4k8o",
      "title": "Battle for Supremacy",
      "tag": "Savage"
    }
  ],
  "tech": [
    {
      "id": "wrJsExM8D-o",
      "title": "Future Technology Marathon",
      "tag": "Tech"
    },
    {
      "id": "AfCtuB0agkM",
      "title": "Age of AI",
      "tag": "AI"
    },
    {
      "id": "DoHZL-JLE9A",
      "title": "Forging the Future",
      "tag": "Future"
    },
    {
      "id": "kE-IJLXd4ZI",
      "title": "2030 Technologies",
      "tag": "Innovation"
    },
    {
      "id": "e3ds4fp7ono",
      "title": "Timelapse of Future Technology",
      "tag": "Sci-Fi"
    },
    {
      "id": "KpOcUrPdx-4",
      "title": "Artificial Intelligence in 2025",
      "tag": "AI"
    },
    {
      "id": "3Z3r-aUeuo4",
      "title": "The New Frontier",
      "tag": "Industry"
    },
    {
      "id": "UQq4jG93PuU",
      "title": "Space Colonization",
      "tag": "Future"
    },
    {
      "id": "rN5f72lhJz8",
      "title": "Engineering Earth",
      "tag": "Engineering"
    },
    {
      "id": "SJ_LCG-tSgk",
      "title": "Future Living Predictions",
      "tag": "Tech"
    }
  ]
};

const documentCatalogs = {
  plants: [
  {
    "section": "I",
    "slug": "tanaman-hias-daun",
    "label": "Tanaman hias daun",
    "count": 10,
    "focus": "Interior, daun dekoratif, dan ruang teduh",
    "entries": [
      {
        "no": 1,
        "name": "Monstera",
        "secondary": "Monstera deliciosa",
        "origin": "Meksiko–Panama",
        "summary": "Daun berlubang besar; populer untuk interior terang tak langsung."
      },
      {
        "no": 2,
        "name": "Philodendron heartleaf",
        "secondary": "Philodendron hederaceum",
        "origin": "Amerika tropis",
        "summary": "Merambat, mudah dirawat, cocok untuk pot gantung dan tiang lumut."
      },
      {
        "no": 3,
        "name": "Aglaonema",
        "secondary": "Aglaonema commutatum",
        "origin": "Asia Tenggara",
        "summary": "Daun variegata, toleran cahaya sedang, cocok untuk ruang dalam."
      },
      {
        "no": 4,
        "name": "Anthurium daun",
        "secondary": "Anthurium crystallinum",
        "origin": "Amerika Selatan",
        "summary": "Daun berurat tegas; menyukai kelembapan tinggi dan media porous."
      },
      {
        "no": 5,
        "name": "Calathea orbifolia",
        "secondary": "Goeppertia orbifolia",
        "origin": "Bolivia",
        "summary": "Daun bundar bergaris; cocok di tempat lembap dan terang lembut."
      },
      {
        "no": 6,
        "name": "ZZ plant",
        "secondary": "Zamioculcas zamiifolia",
        "origin": "Afrika Timur",
        "summary": "Tahan kering dan cahaya rendah; akar rimpang menyimpan air."
      },
      {
        "no": 7,
        "name": "Lidah mertua",
        "secondary": "Dracaena trifasciata",
        "origin": "Afrika Barat",
        "summary": "Tahan kering, daun tegak, sering dipakai untuk lanskap pot."
      },
      {
        "no": 8,
        "name": "Sirih gading",
        "secondary": "Epipremnum aureum",
        "origin": "Kepulauan Solomon",
        "summary": "Merambat cepat, mudah stek, tahan di berbagai kondisi."
      },
      {
        "no": 9,
        "name": "Karet kebo",
        "secondary": "Ficus elastica",
        "origin": "Asia Selatan",
        "summary": "Daun tebal mengilap; cocok sebagai aksen indoor terang."
      },
      {
        "no": 10,
        "name": "Paku sarang burung",
        "secondary": "Asplenium nidus",
        "origin": "Asia tropis",
        "summary": "Roset daun lebar; menyukai tempat teduh lembap."
      }
    ]
  },
  {
    "section": "II",
    "slug": "tanaman-hias-bunga",
    "label": "Tanaman hias bunga",
    "count": 10,
    "focus": "Halaman, pot, border, dan bunga potong",
    "entries": [
      {
        "no": 1,
        "name": "Mawar",
        "secondary": "Rosa spp.",
        "origin": "Asia Barat–Eropa",
        "summary": "Bunga populer untuk taman; butuh matahari penuh dan pemangkasan rutin."
      },
      {
        "no": 2,
        "name": "Melati",
        "secondary": "Jasminum sambac",
        "origin": "Asia Selatan",
        "summary": "Bunga harum, cocok pagar hidup dan pot berbunga."
      },
      {
        "no": 3,
        "name": "Anggrek bulan",
        "secondary": "Phalaenopsis amabilis",
        "origin": "Asia Tenggara",
        "summary": "Bunga tahan lama; suka cahaya terang tersaring."
      },
      {
        "no": 4,
        "name": "Bougainvillea",
        "secondary": "Bougainvillea spectabilis",
        "origin": "Amerika Selatan",
        "summary": "Braktea cerah; berbunga lebat di tempat panas dan kering."
      },
      {
        "no": 5,
        "name": "Krisan",
        "secondary": "Chrysanthemum morifolium",
        "origin": "Tiongkok",
        "summary": "Bunga potong populer; perlu pinching untuk percabangan."
      },
      {
        "no": 6,
        "name": "Kembang sepatu",
        "secondary": "Hibiscus rosa-sinensis",
        "origin": "Asia tropis",
        "summary": "Bunga besar; cocok iklim panas dan sinar penuh."
      },
      {
        "no": 7,
        "name": "Gardenia",
        "secondary": "Gardenia jasminoides",
        "origin": "Asia Timur",
        "summary": "Bunga putih harum; menyukai media asam dan lembap."
      },
      {
        "no": 8,
        "name": "Hortensia",
        "secondary": "Hydrangea macrophylla",
        "origin": "Jepang",
        "summary": "Warna bunga dipengaruhi pH; cocok dataran sejuk."
      },
      {
        "no": 9,
        "name": "Petunia",
        "secondary": "Petunia × atkinsiana",
        "origin": "Amerika Selatan",
        "summary": "Bunga warna-warni; baik untuk bedeng dan pot."
      },
      {
        "no": 10,
        "name": "Gerbera",
        "secondary": "Gerbera jamesonii",
        "origin": "Afrika Selatan",
        "summary": "Bunga potong populer; butuh drainase baik."
      }
    ]
  },
  {
    "section": "III",
    "slug": "sukulen-dan-kaktus",
    "label": "Sukulen dan kaktus",
    "count": 10,
    "focus": "Tanaman hemat air dan koleksi pot terang",
    "entries": [
      {
        "no": 1,
        "name": "Lidah buaya",
        "secondary": "Aloe vera",
        "origin": "Arabia",
        "summary": "Sukulen obat; tahan kering dan menyukai sinar terang."
      },
      {
        "no": 2,
        "name": "Echeveria",
        "secondary": "Echeveria elegans",
        "origin": "Meksiko",
        "summary": "Roset kompak; cocok untuk koleksi pot kering."
      },
      {
        "no": 3,
        "name": "Jade plant",
        "secondary": "Crassula ovata",
        "origin": "Afrika Selatan",
        "summary": "Batang berkayu mini; mudah dipangkas dan diperbanyak."
      },
      {
        "no": 4,
        "name": "Nopal",
        "secondary": "Opuntia ficus-indica",
        "origin": "Meksiko",
        "summary": "Kaktus beruas; beberapa kultivar menghasilkan buah."
      },
      {
        "no": 5,
        "name": "Mammillaria",
        "secondary": "Mammillaria elongata",
        "origin": "Meksiko",
        "summary": "Kaktus kecil bergerombol; cocok untuk wadah dangkal."
      },
      {
        "no": 6,
        "name": "Christmas cactus",
        "secondary": "Schlumbergera truncata",
        "origin": "Brasil",
        "summary": "Berbunga saat musim sejuk; suka media lembap berpori."
      },
      {
        "no": 7,
        "name": "Haworthia zebra",
        "secondary": "Haworthiopsis attenuata",
        "origin": "Afrika Selatan",
        "summary": "Daun kecil bergaris; cocok meja kerja terang."
      },
      {
        "no": 8,
        "name": "Mahkota duri",
        "secondary": "Euphorbia milii",
        "origin": "Madagaskar",
        "summary": "Batang berduri dan bunga kecil; tahan panas."
      },
      {
        "no": 9,
        "name": "Kalanchoe",
        "secondary": "Kalanchoe blossfeldiana",
        "origin": "Madagaskar",
        "summary": "Berbunga lebat; populer sebagai tanaman pot."
      },
      {
        "no": 10,
        "name": "Ekor keledai",
        "secondary": "Sedum morganianum",
        "origin": "Meksiko",
        "summary": "Batang menjuntai, daun rapat; cocok pot gantung terang."
      }
    ]
  },
  {
    "section": "IV",
    "slug": "tanaman-pangan-dan-sayur",
    "label": "Tanaman pangan dan sayur",
    "count": 10,
    "focus": "Serealia, umbi, kacang, dan sayuran",
    "entries": [
      {
        "no": 1,
        "name": "Padi",
        "secondary": "Oryza sativa",
        "origin": "Asia",
        "summary": "Serealia utama daerah tropis basah; butuh air cukup pada fase awal."
      },
      {
        "no": 2,
        "name": "Gandum",
        "secondary": "Triticum aestivum",
        "origin": "Asia Barat",
        "summary": "Serealia utama daerah subtropis; tanah gembur dan drainase baik."
      },
      {
        "no": 3,
        "name": "Jagung",
        "secondary": "Zea mays",
        "origin": "Meksiko",
        "summary": "Pangan dan pakan; butuh sinar penuh dan unsur N tinggi."
      },
      {
        "no": 4,
        "name": "Kedelai",
        "secondary": "Glycine max",
        "origin": "Asia Timur",
        "summary": "Sumber protein nabati; memerlukan inokulasi rhizobium untuk optimal."
      },
      {
        "no": 5,
        "name": "Kentang",
        "secondary": "Solanum tuberosum",
        "origin": "Andes",
        "summary": "Umbi pangan utama dataran sejuk."
      },
      {
        "no": 6,
        "name": "Singkong",
        "secondary": "Manihot esculenta",
        "origin": "Amerika Selatan",
        "summary": "Umbi karbohidrat; toleran lahan marjinal."
      },
      {
        "no": 7,
        "name": "Cabai",
        "secondary": "Capsicum annuum",
        "origin": "Amerika Tengah",
        "summary": "Buah pedas/manis; membutuhkan nutrisi seimbang."
      },
      {
        "no": 8,
        "name": "Tomat",
        "secondary": "Solanum lycopersicum",
        "origin": "Amerika Selatan",
        "summary": "Sayur buah populer; perlu ajir dan sanitasi kebun."
      },
      {
        "no": 9,
        "name": "Bayam",
        "secondary": "Spinacia oleracea",
        "origin": "Asia Barat",
        "summary": "Sayur daun cepat panen; cocok suhu sejuk–sedang."
      },
      {
        "no": 10,
        "name": "Selada",
        "secondary": "Lactuca sativa",
        "origin": "Mediterania",
        "summary": "Sayur daun segar; ideal pada suhu sedang."
      }
    ]
  },
  {
    "section": "V",
    "slug": "herbal-dan-rempah",
    "label": "Herbal dan rempah",
    "count": 10,
    "focus": "Tanaman aromatik, obat, dan bumbu",
    "entries": [
      {
        "no": 1,
        "name": "Kunyit",
        "secondary": "Curcuma longa",
        "origin": "Asia Selatan",
        "summary": "Rimpang bumbu dan pewarna alami; menyukai tanah gembur."
      },
      {
        "no": 2,
        "name": "Jahe",
        "secondary": "Zingiber officinale",
        "origin": "Asia Tenggara",
        "summary": "Rimpang aromatik untuk minuman, obat, dan masakan."
      },
      {
        "no": 3,
        "name": "Kencur",
        "secondary": "Kaempferia galanga",
        "origin": "Asia Tenggara",
        "summary": "Rimpang kecil beraroma kuat; umum pada jamu dan bumbu."
      },
      {
        "no": 4,
        "name": "Lengkuas",
        "secondary": "Alpinia galanga",
        "origin": "Asia Tenggara",
        "summary": "Rimpang besar; umum dalam masakan Asia."
      },
      {
        "no": 5,
        "name": "Serai",
        "secondary": "Cymbopogon citratus",
        "origin": "Asia Selatan",
        "summary": "Daun aromatik untuk teh dan bumbu."
      },
      {
        "no": 6,
        "name": "Kemangi",
        "secondary": "Ocimum basilicum",
        "origin": "Asia tropis",
        "summary": "Daun harum; cocok panen daun berulang."
      },
      {
        "no": 7,
        "name": "Mint",
        "secondary": "Mentha spicata",
        "origin": "Eropa–Asia",
        "summary": "Daun segar untuk minuman dan kuliner."
      },
      {
        "no": 8,
        "name": "Rosemary",
        "secondary": "Salvia rosmarinus",
        "origin": "Mediterania",
        "summary": "Semak aromatik; suka sinar penuh dan drainase baik."
      },
      {
        "no": 9,
        "name": "Lada",
        "secondary": "Piper nigrum",
        "origin": "India",
        "summary": "Liana rempah penghasil lada hitam/putih."
      },
      {
        "no": 10,
        "name": "Parsley",
        "secondary": "Petroselinum crispum",
        "origin": "Mediterania",
        "summary": "Daun aromatik; populer untuk garnish dan salad."
      }
    ]
  },
  {
    "section": "VI",
    "slug": "buah-buahan",
    "label": "Buah-buahan",
    "count": 10,
    "focus": "Kebun tropis, hortikultura, dan konsumsi segar",
    "entries": [
      {
        "no": 1,
        "name": "Mangga",
        "secondary": "Mangifera indica",
        "origin": "Asia Selatan",
        "summary": "Buah tropis manis dengan banyak kultivar budidaya."
      },
      {
        "no": 2,
        "name": "Pisang",
        "secondary": "Musa acuminata",
        "origin": "Asia Tenggara",
        "summary": "Buah pokok tropis; tersedia tipe meja dan olahan."
      },
      {
        "no": 3,
        "name": "Pepaya",
        "secondary": "Carica papaya",
        "origin": "Amerika tropis",
        "summary": "Cepat berbuah; buah matang dan muda sama-sama dimanfaatkan."
      },
      {
        "no": 4,
        "name": "Nanas",
        "secondary": "Ananas comosus",
        "origin": "Amerika Selatan",
        "summary": "Buah roset tropis dengan rasa asam manis."
      },
      {
        "no": 5,
        "name": "Jeruk manis",
        "secondary": "Citrus sinensis",
        "origin": "Asia Timur",
        "summary": "Buah meja dan jus; memerlukan sinar penuh."
      },
      {
        "no": 6,
        "name": "Alpukat",
        "secondary": "Persea americana",
        "origin": "Amerika Tengah",
        "summary": "Buah berlemak sehat; memerlukan drainase baik."
      },
      {
        "no": 7,
        "name": "Anggur",
        "secondary": "Vitis vinifera",
        "origin": "Mediterania–Asia Barat",
        "summary": "Buah meja dan wine; membutuhkan pangkasan intensif."
      },
      {
        "no": 8,
        "name": "Semangka",
        "secondary": "Citrullus lanatus",
        "origin": "Afrika",
        "summary": "Buah besar berair untuk iklim panas."
      },
      {
        "no": 9,
        "name": "Durian",
        "secondary": "Durio zibethinus",
        "origin": "Asia Tenggara",
        "summary": "Buah beraroma kuat dengan daging lembut."
      },
      {
        "no": 10,
        "name": "Rambutan",
        "secondary": "Nephelium lappaceum",
        "origin": "Asia Tenggara",
        "summary": "Buah berambut dengan daging putih manis."
      }
    ]
  },
  {
    "section": "VII",
    "slug": "pohon",
    "label": "Pohon",
    "count": 10,
    "focus": "Peneduh, lanskap, kayu, dan penghijauan",
    "entries": [
      {
        "no": 1,
        "name": "Jati",
        "secondary": "Tectona grandis",
        "origin": "Asia Selatan–Tenggara",
        "summary": "Pohon kayu bernilai tinggi, tahan cuaca bila tua."
      },
      {
        "no": 2,
        "name": "Mahoni",
        "secondary": "Swietenia macrophylla",
        "origin": "Amerika tropis",
        "summary": "Kayu keras untuk furnitur dan penghijauan."
      },
      {
        "no": 3,
        "name": "Meranti",
        "secondary": "Shorea spp.",
        "origin": "Asia Tenggara",
        "summary": "Kelompok pohon hutan penghasil kayu penting."
      },
      {
        "no": 4,
        "name": "Pinus merkusii",
        "secondary": "Pinus merkusii",
        "origin": "Asia Tenggara",
        "summary": "Konifer tropis; sumber getah dan kayu."
      },
      {
        "no": 5,
        "name": "Cemara laut",
        "secondary": "Casuarina equisetifolia",
        "origin": "Pesisir tropis",
        "summary": "Tahan angin dan garam; baik untuk pantai."
      },
      {
        "no": 6,
        "name": "Trembesi",
        "secondary": "Samanea saman",
        "origin": "Amerika tropis",
        "summary": "Kanopi sangat lebar, sering dipakai sebagai peneduh."
      },
      {
        "no": 7,
        "name": "Flamboyan",
        "secondary": "Delonix regia",
        "origin": "Madagaskar",
        "summary": "Pohon lanskap berbunga merah-oranye mencolok."
      },
      {
        "no": 8,
        "name": "Angsana",
        "secondary": "Pterocarpus indicus",
        "origin": "Asia Tenggara",
        "summary": "Peneduh jalan dengan kayu bernilai dan bunga kuning."
      },
      {
        "no": 9,
        "name": "Beringin",
        "secondary": "Ficus benjamina",
        "origin": "Asia tropis",
        "summary": "Pohon peneduh dengan akar kuat; perlu ruang cukup."
      },
      {
        "no": 10,
        "name": "Ketapang",
        "secondary": "Terminalia catappa",
        "origin": "Asia tropis",
        "summary": "Tahan pantai; tajuk bertingkat dan daun memerah musiman."
      }
    ]
  },
  {
    "section": "VIII",
    "slug": "pupuk-dan-amelioran",
    "label": "Pupuk dan amelioran",
    "count": 10,
    "focus": "Hara organik, anorganik, dan pembenah tanah",
    "entries": [
      {
        "no": 1,
        "name": "Kompos",
        "secondary": "Bahan organik matang",
        "origin": "Sisa tanaman/hewan terdekomposisi",
        "summary": "Meningkatkan bahan organik tanah, struktur, dan aktivitas mikroba."
      },
      {
        "no": 2,
        "name": "Kascing",
        "secondary": "Vermikompos",
        "origin": "Kotoran cacing dan bahan organik",
        "summary": "Memperbaiki struktur tanah dan menyediakan hara lembut."
      },
      {
        "no": 3,
        "name": "Pupuk kandang",
        "secondary": "Kotoran ternak matang",
        "origin": "Sapi, kambing, ayam, dan lain-lain",
        "summary": "Menambah bahan organik dan unsur makro dalam kadar bervariasi."
      },
      {
        "no": 4,
        "name": "Bokashi",
        "secondary": "Pupuk organik fermentasi",
        "origin": "Bahan organik difermentasi",
        "summary": "Cepat tersedia dan baik untuk perbaikan tanah."
      },
      {
        "no": 5,
        "name": "Tepung tulang",
        "secondary": "Bone meal",
        "origin": "Ca organik dan P",
        "summary": "Cocok untuk pembungaan, perakaran, dan tanaman tahunan."
      },
      {
        "no": 6,
        "name": "Emulsi ikan",
        "secondary": "Fish emulsion",
        "origin": "Cair organik dari ikan",
        "summary": "Cepat serap, sering dipakai sebagai pupuk cair."
      },
      {
        "no": 7,
        "name": "Biochar",
        "secondary": "Arang hayati",
        "origin": "Biomassa terpirolisis",
        "summary": "Meningkatkan kapasitas pegang air dan habitat mikroba."
      },
      {
        "no": 8,
        "name": "Dolomit",
        "secondary": "CaMg(CO3)2",
        "origin": "Batuan karbonat",
        "summary": "Menaikkan pH tanah asam sambil menambah Ca dan Mg."
      },
      {
        "no": 9,
        "name": "Urea",
        "secondary": "46% N",
        "origin": "Pupuk nitrogen",
        "summary": "Efektif untuk pertumbuhan vegetatif; perlu pengelolaan kehilangan amonia."
      },
      {
        "no": 10,
        "name": "NPK majemuk",
        "secondary": "Contoh 15-15-15 atau 16-16-16",
        "origin": "Campuran N, P, K",
        "summary": "Praktis untuk pemupukan umum dengan rasio seimbang."
      }
    ]
  }
],
  animals: [
  {
    "section": "I",
    "slug": "ternak-besar-dan-ruminansia-utama",
    "label": "Ternak besar dan ruminansia utama",
    "count": 10,
    "focus": "Daging, susu, tenaga kerja, dan utilitas usaha peternakan",
    "entries": [
      {
        "no": 1,
        "name": "Sapi potong",
        "secondary": "Bos taurus / Bos indicus",
        "origin": "Global; sangat luas di daerah tropis dan subtropis",
        "summary": "Ternak utama penghasil daging; memerlukan pakan hijauan cukup, air bersih, dan manajemen kandang yang baik."
      },
      {
        "no": 2,
        "name": "Sapi perah",
        "secondary": "Bos taurus",
        "origin": "Eropa lalu tersebar global",
        "summary": "Difokuskan pada produksi susu; butuh nutrisi stabil, sanitasi pemerahan, dan kontrol kesehatan ambing."
      },
      {
        "no": 3,
        "name": "Kerbau rawa",
        "secondary": "Bubalus bubalis",
        "origin": "Asia Selatan–Tenggara",
        "summary": "Kuat untuk kerja lahan basah dan daging; tahan lingkungan lembap dan cocok pada sistem pertanian terpadu."
      },
      {
        "no": 4,
        "name": "Kerbau murrah",
        "secondary": "Bubalus bubalis",
        "origin": "India",
        "summary": "Tipe kerbau perah dan bibit unggul; dikenal dengan produksi susu relatif tinggi dan postur besar."
      },
      {
        "no": 5,
        "name": "Kambing kacang",
        "secondary": "Capra aegagrus hircus",
        "origin": "Nusantara",
        "summary": "Kambing lokal adaptif, mudah dipelihara, cocok untuk daging dan reproduksi cepat pada usaha kecil."
      },
      {
        "no": 6,
        "name": "Peranakan Etawa",
        "secondary": "Capra aegagrus hircus",
        "origin": "Indonesia; hasil pengembangan dari Jamnapari",
        "summary": "Sering dipakai sebagai kambing perah; membutuhkan pakan hijauan berkualitas dan kandang yang kering."
      },
      {
        "no": 7,
        "name": "Domba lokal",
        "secondary": "Ovis aries",
        "origin": "Global",
        "summary": "Penghasil daging, wol tertentu, dan pupuk kandang; perlu pengendalian parasit serta kandang berventilasi."
      },
      {
        "no": 8,
        "name": "Kuda kerja",
        "secondary": "Equus ferus caballus",
        "origin": "Global",
        "summary": "Dipakai untuk kerja, transportasi, dan rekreasi; memerlukan area gerak, latihan, dan perawatan kuku."
      },
      {
        "no": 9,
        "name": "Keledai domestik",
        "secondary": "Equus africanus asinus",
        "origin": "Afrika lalu menyebar global",
        "summary": "Hewan beban yang tahan medan kering; cocok untuk utilitas sederhana dan penjagaan kelompok ternak kecil."
      },
      {
        "no": 10,
        "name": "Yak",
        "secondary": "Bos grunniens",
        "origin": "Himalaya dan dataran tinggi Asia",
        "summary": "Ternak khas wilayah dingin; dimanfaatkan untuk susu, daging, serat, dan ketahanan pada lingkungan ekstrim."
      }
    ]
  },
  {
    "section": "II",
    "slug": "ternak-kecil-serat-dan-hasil-khusus",
    "label": "Ternak kecil, serat, dan hasil khusus",
    "count": 10,
    "focus": "Daging, serat, kulit, dan usaha rumah tangga",
    "entries": [
      {
        "no": 1,
        "name": "Kambing Boer",
        "secondary": "Capra aegagrus hircus",
        "origin": "Afrika Selatan",
        "summary": "Tipe pedaging dengan pertumbuhan cepat; cocok untuk penggemukan dan persilangan produksi daging."
      },
      {
        "no": 2,
        "name": "Domba Merino",
        "secondary": "Ovis aries",
        "origin": "Spanyol lalu berkembang luas",
        "summary": "Dikenal sebagai penghasil wol; membutuhkan lingkungan kering dan pengelolaan bulu yang teratur."
      },
      {
        "no": 3,
        "name": "Domba Garut",
        "secondary": "Ovis aries",
        "origin": "Indonesia",
        "summary": "Tipe lokal populer untuk daging dan pembibitan; adaptif pada lingkungan tropis pegunungan maupun dataran."
      },
      {
        "no": 4,
        "name": "Babi Landrace",
        "secondary": "Sus scrofa domesticus",
        "origin": "Eropa",
        "summary": "Rangka panjang dan efisien untuk produksi daging; memerlukan manajemen pakan dan sanitasi kandang ketat."
      },
      {
        "no": 5,
        "name": "Babi Yorkshire",
        "secondary": "Sus scrofa domesticus",
        "origin": "Britania Raya",
        "summary": "Sering dipakai sebagai indukan; produktif dan cocok pada sistem peternakan intensif."
      },
      {
        "no": 6,
        "name": "Kelinci New Zealand White",
        "secondary": "Oryctolagus cuniculus domesticus",
        "origin": "Budidaya modern global",
        "summary": "Tipe pedaging cepat tumbuh; perlu kandang kering, pakan serat cukup, dan sirkulasi udara baik."
      },
      {
        "no": 7,
        "name": "Kelinci Rex",
        "secondary": "Oryctolagus cuniculus domesticus",
        "origin": "Eropa",
        "summary": "Dikenal dari bulu halus dan bentuk tubuh menarik; cocok untuk hobi, pembibitan, dan usaha kecil."
      },
      {
        "no": 8,
        "name": "Alpaka",
        "secondary": "Vicugna pacos",
        "origin": "Andes",
        "summary": "Ternak penghasil serat lembut; memerlukan suhu sejuk dan pemeliharaan kelompok."
      },
      {
        "no": 9,
        "name": "Llama",
        "secondary": "Lama glama",
        "origin": "Andes",
        "summary": "Dimanfaatkan sebagai hewan beban, serat, dan penjaga kawanan kecil; sosial dan relatif tangguh."
      },
      {
        "no": 10,
        "name": "Rusa ternak",
        "secondary": "Cervus sp. / Rusa sp.",
        "origin": "Beragam wilayah",
        "summary": "Dipelihara terbatas untuk daging, penangkaran, atau wisata edukatif; membutuhkan pagar aman dan area jelajah."
      }
    ]
  },
  {
    "section": "III",
    "slug": "unggas-domestik-dan-unggas-air",
    "label": "Unggas domestik dan unggas air",
    "count": 10,
    "focus": "Telur, daging, pengendali serangga, dan pekarangan",
    "entries": [
      {
        "no": 1,
        "name": "Ayam kampung",
        "secondary": "Gallus gallus domesticus",
        "origin": "Asia; tersebar luas",
        "summary": "Unggas adaptif untuk telur dan daging; cocok pada sistem semi-umbaran dan pekarangan."
      },
      {
        "no": 2,
        "name": "Ayam broiler",
        "secondary": "Gallus gallus domesticus",
        "origin": "Budidaya modern global",
        "summary": "Difokuskan untuk produksi daging cepat; memerlukan manajemen pakan, suhu, dan kepadatan kandang."
      },
      {
        "no": 3,
        "name": "Ayam layer",
        "secondary": "Gallus gallus domesticus",
        "origin": "Budidaya modern global",
        "summary": "Penghasil telur konsumsi; perlu formulasi pakan seimbang dan cahaya terkontrol."
      },
      {
        "no": 4,
        "name": "Itik petelur",
        "secondary": "Anas platyrhynchos domesticus",
        "origin": "Asia dan Eropa",
        "summary": "Produktif untuk telur; cocok di area basah dengan akses air bersih dan kandang malam."
      },
      {
        "no": 5,
        "name": "Bebek Peking",
        "secondary": "Anas platyrhynchos domesticus",
        "origin": "Tiongkok",
        "summary": "Tipe pedaging populer; pertumbuhan relatif cepat dan cocok untuk penggemukan."
      },
      {
        "no": 6,
        "name": "Entok",
        "secondary": "Cairina moschata domestica",
        "origin": "Amerika tropis",
        "summary": "Unggas tenang dan tahan; dimanfaatkan untuk daging serta adaptif di pekarangan."
      },
      {
        "no": 7,
        "name": "Angsa domestik",
        "secondary": "Anser anser domesticus / Anser cygnoides domesticus",
        "origin": "Eropa dan Asia",
        "summary": "Dapat menjadi sumber daging sekaligus penjaga area karena respons suaranya kuat."
      },
      {
        "no": 8,
        "name": "Kalkun",
        "secondary": "Meleagris gallopavo domesticus",
        "origin": "Amerika",
        "summary": "Unggas besar penghasil daging; butuh ruang gerak dan manajemen kesehatan pernapasan."
      },
      {
        "no": 9,
        "name": "Puyuh",
        "secondary": "Coturnix japonica",
        "origin": "Asia Timur",
        "summary": "Efisien untuk produksi telur skala kecil; cocok untuk ruang terbatas dengan kandang bertingkat."
      },
      {
        "no": 10,
        "name": "Ayam mutiara",
        "secondary": "Numida meleagris",
        "origin": "Afrika",
        "summary": "Sering dipakai sebagai pengendali serangga dan penjaga karena peka terhadap gangguan."
      }
    ]
  },
  {
    "section": "IV",
    "slug": "hewan-perairan-budidaya",
    "label": "Hewan perairan budidaya",
    "count": 10,
    "focus": "Kolam, tambak, protein konsumsi, dan integrasi air",
    "entries": [
      {
        "no": 1,
        "name": "Lele",
        "secondary": "Clarias gariepinus / Clarias sp.",
        "origin": "Afrika lalu tersebar luas",
        "summary": "Ikan budidaya populer yang tahan padat tebar; cocok untuk usaha konsumsi dan sistem kolam sederhana."
      },
      {
        "no": 2,
        "name": "Nila",
        "secondary": "Oreochromis niloticus",
        "origin": "Afrika",
        "summary": "Pertumbuhan baik dan tahan kondisi bervariasi; banyak dipakai untuk kolam air tawar."
      },
      {
        "no": 3,
        "name": "Mujair",
        "secondary": "Oreochromis mossambicus",
        "origin": "Afrika",
        "summary": "Ikan konsumsi adaptif; sering dijadikan ikan pelihara budidaya rakyat dan sumber protein lokal."
      },
      {
        "no": 4,
        "name": "Gurame",
        "secondary": "Osphronemus goramy",
        "origin": "Asia Tenggara",
        "summary": "Nilai jual baik dan disukai pasar; pertumbuhan lebih lambat namun dagingnya bernilai tinggi."
      },
      {
        "no": 5,
        "name": "Patin",
        "secondary": "Pangasius hypophthalmus",
        "origin": "Asia Tenggara",
        "summary": "Ikan konsumsi dengan pertumbuhan cepat; cocok untuk budidaya intensif dan olahan filet."
      },
      {
        "no": 6,
        "name": "Ikan mas",
        "secondary": "Cyprinus carpio",
        "origin": "Eurasia",
        "summary": "Spesies klasik budidaya air tawar; cocok di kolam, keramba, dan minapadi tertentu."
      },
      {
        "no": 7,
        "name": "Bawal air tawar",
        "secondary": "Piaractus brachypomus / Colossoma sp.",
        "origin": "Amerika Selatan",
        "summary": "Dipelihara untuk daging dan ketahanan budidaya; memerlukan pakan dan kualitas air yang terjaga."
      },
      {
        "no": 8,
        "name": "Bandeng",
        "secondary": "Chanos chanos",
        "origin": "Indo-Pasifik",
        "summary": "Penting untuk tambak payau; dikenal luas sebagai ikan konsumsi bernilai ekonomi."
      },
      {
        "no": 9,
        "name": "Udang vaname",
        "secondary": "Litopenaeus vannamei",
        "origin": "Amerika Pasifik",
        "summary": "Komoditas utama budidaya intensif; perlu kontrol kualitas air, biosekuriti, dan pakan presisi."
      },
      {
        "no": 10,
        "name": "Udang galah",
        "secondary": "Macrobrachium rosenbergii",
        "origin": "Asia Tenggara",
        "summary": "Udang air tawar ukuran besar; bernilai tinggi dan cocok pada kolam atau sistem terpadu tertentu."
      }
    ]
  },
  {
    "section": "V",
    "slug": "penyerbuk-pengolah-organik-dan-pendukung-tanah",
    "label": "Penyerbuk, pengolah organik, dan pendukung tanah",
    "count": 10,
    "focus": "Penyerbukan, dekomposisi, dan keseimbangan ekosistem",
    "entries": [
      {
        "no": 1,
        "name": "Lebah madu Asia",
        "secondary": "Apis cerana",
        "origin": "Asia",
        "summary": "Penyerbuk penting untuk kebun dan penghasil madu; cocok pada lingkungan tropis dan budidaya lokal."
      },
      {
        "no": 2,
        "name": "Lebah madu Eropa",
        "secondary": "Apis mellifera",
        "origin": "Eropa–Afrika–Asia Barat",
        "summary": "Spesies lebah komersial utama; produktif untuk madu dan sangat berperan dalam penyerbukan tanaman."
      },
      {
        "no": 3,
        "name": "Lebah kelulut",
        "secondary": "Tetragonula sp. / Heterotrigona sp.",
        "origin": "Tropis Asia",
        "summary": "Lebah tanpa sengat yang cocok untuk pekarangan; menghasilkan madu dan membantu penyerbukan."
      },
      {
        "no": 4,
        "name": "Kupu-kupu penyerbuk",
        "secondary": "Lepidoptera",
        "origin": "Global",
        "summary": "Membantu penyerbukan berbagai bunga; indikator lingkungan kebun yang cukup sehat."
      },
      {
        "no": 5,
        "name": "Kumbang koksi",
        "secondary": "Coccinellidae",
        "origin": "Global",
        "summary": "Predator kutu daun dan hama kecil; sangat berguna pada kebun sayur dan tanaman buah."
      },
      {
        "no": 6,
        "name": "Lacewing hijau",
        "secondary": "Chrysoperla sp.",
        "origin": "Global",
        "summary": "Larvanya memangsa kutu daun dan serangga lunak; pendukung pengendalian hayati alami."
      },
      {
        "no": 7,
        "name": "Cacing tanah",
        "secondary": "Lumbricus sp. / Eisenia fetida",
        "origin": "Global",
        "summary": "Menggemburkan tanah dan mempercepat dekomposisi bahan organik; penting untuk kesehatan media."
      },
      {
        "no": 8,
        "name": "Larva BSF",
        "secondary": "Hermetia illucens",
        "origin": "Amerika lalu menyebar luas",
        "summary": "Efektif mengurai limbah organik dan dapat dimanfaatkan sebagai bahan pakan tertentu."
      },
      {
        "no": 9,
        "name": "Capung",
        "secondary": "Odonata",
        "origin": "Global",
        "summary": "Pemangsa serangga kecil; kehadirannya sering terkait dengan kualitas lingkungan yang baik."
      },
      {
        "no": 10,
        "name": "Laba-laba kebun",
        "secondary": "Araneae",
        "origin": "Global",
        "summary": "Predator alami banyak hama; membantu menjaga populasi serangga tanpa bahan kimia berlebih."
      }
    ]
  },
  {
    "section": "VI",
    "slug": "hewan-pendamping-penjaga-dan-pengendali-alami",
    "label": "Hewan pendamping, penjaga, dan pengendali alami",
    "count": 10,
    "focus": "Keamanan area, utilitas lahan, dan kontrol gangguan",
    "entries": [
      {
        "no": 1,
        "name": "Kucing lumbung",
        "secondary": "Felis catus",
        "origin": "Global",
        "summary": "Sering dipelihara untuk membantu menekan populasi tikus di gudang, kandang, dan area penyimpanan."
      },
      {
        "no": 2,
        "name": "Anjing penjaga ternak",
        "secondary": "Canis lupus familiaris",
        "origin": "Global",
        "summary": "Digunakan untuk melindungi area dan kawanan; memerlukan pelatihan, ikatan sosial, dan perawatan rutin."
      },
      {
        "no": 3,
        "name": "Anjing penggembala",
        "secondary": "Canis lupus familiaris",
        "origin": "Global",
        "summary": "Membantu pergerakan ternak dalam padang gembala; sangat berguna pada sistem peternakan luas."
      },
      {
        "no": 4,
        "name": "Angsa penjaga",
        "secondary": "Anser anser domesticus",
        "origin": "Global budidaya",
        "summary": "Suara keras dan responsif terhadap tamu atau gangguan; sering dipakai sebagai alarm alami."
      },
      {
        "no": 5,
        "name": "Keledai penjaga",
        "secondary": "Equus africanus asinus",
        "origin": "Afrika lalu tersebar global",
        "summary": "Dapat menjaga kawanan kecil dari gangguan tertentu; tangguh dan hemat perawatan."
      },
      {
        "no": 6,
        "name": "Llama penjaga",
        "secondary": "Lama glama",
        "origin": "Andes",
        "summary": "Kadang dipakai menjaga domba atau kambing; waspada terhadap predator dan hidup baik berkelompok."
      },
      {
        "no": 7,
        "name": "Burung hantu serak",
        "secondary": "Tyto alba",
        "origin": "Global",
        "summary": "Predator tikus yang sangat berguna di sawah dan kebun; perlu habitat sarang yang aman."
      },
      {
        "no": 8,
        "name": "Bebek Indian Runner",
        "secondary": "Anas platyrhynchos domesticus",
        "origin": "Asia Tenggara",
        "summary": "Sering dipakai membantu mengendalikan siput dan serangga di area tanam tertentu."
      },
      {
        "no": 9,
        "name": "Ayam mutiara penjaga",
        "secondary": "Numida meleagris",
        "origin": "Afrika",
        "summary": "Selain telur dan daging, unggas ini peka terhadap pergerakan asing dan membantu alarm halaman."
      },
      {
        "no": 10,
        "name": "Kelelawar pemakan serangga",
        "secondary": "Chiroptera insektivora",
        "origin": "Global",
        "summary": "Membantu menekan serangga malam di area kebun; perlu perlindungan habitat dan tidak diganggu."
      }
    ]
  }
],
  tech: [
  {
    "section": "I",
    "slug": "bahasa-pemrograman-inti-sistem-dan-platform-dasar",
    "label": "Bahasa pemrograman inti, sistem, dan platform dasar",
    "count": 14,
    "focus": "Fondasi coding umum, sistem, CLI, dan aplikasi",
    "entries": [
      {
        "no": 1,
        "name": "Python",
        "secondary": "Python 3.9.13",
        "origin": "Bahasa tingkat tinggi",
        "summary": "Sangat kuat untuk scripting, otomasi, data, AI, utilitas desktop, dan berbagai workflow pengembangan."
      },
      {
        "no": 2,
        "name": "Py launcher",
        "secondary": "Python 3.14.0",
        "origin": "Launcher ekosistem Python",
        "summary": "Memudahkan pengelolaan dan pemanggilan beberapa versi Python di Windows."
      },
      {
        "no": 3,
        "name": "C (gcc)",
        "secondary": "gcc 2.95",
        "origin": "Bahasa sistem",
        "summary": "Cocok untuk pemrograman dasar, sistem, performa tinggi, dan komponen low-level."
      },
      {
        "no": 4,
        "name": "C++ (g++)",
        "secondary": "g++ 15.2.0",
        "origin": "Bahasa sistem dan aplikasi",
        "summary": "Dipakai untuk aplikasi performa tinggi, engine, library, tooling, dan pengembangan game tertentu."
      },
      {
        "no": 5,
        "name": "Java",
        "secondary": "openjdk 21.0.10 LTS",
        "origin": "Bahasa dan runtime JVM",
        "summary": "Kuat untuk backend, desktop, tooling, Android dasar, serta sistem enterprise."
      },
      {
        "no": 6,
        "name": ".NET",
        "secondary": "10.0.201",
        "origin": "Platform pengembangan Microsoft",
        "summary": "Fondasi untuk aplikasi C#, web, desktop, service, dan tooling modern."
      },
      {
        "no": 7,
        "name": "Go",
        "secondary": "go 1.26.0",
        "origin": "Bahasa terkompilasi modern",
        "summary": "Unggul untuk CLI, server, utilitas jaringan, dan deployment sederhana."
      },
      {
        "no": 8,
        "name": "Swift",
        "secondary": "Swift 6.2.4",
        "origin": "Bahasa modern Apple dan lintas platform tertentu",
        "summary": "Cocok untuk pembelajaran bahasa modern, toolchain, dan eksperimen aplikasi."
      },
      {
        "no": 9,
        "name": "Kotlin",
        "secondary": "kotlinc-jvm 2.3.10",
        "origin": "Bahasa JVM modern",
        "summary": "Kuat untuk backend, tooling JVM, dan pengembangan Android berbasis Kotlin."
      },
      {
        "no": 10,
        "name": "Ruby",
        "secondary": "ruby 3.4.9 +PRISM",
        "origin": "Bahasa scripting tingkat tinggi",
        "summary": "Berguna untuk scripting, otomasi, dan pengembangan aplikasi tertentu."
      },
      {
        "no": 11,
        "name": "Rust",
        "secondary": "rustc 1.93.1",
        "origin": "Bahasa sistem modern",
        "summary": "Fokus pada keamanan memori dan performa; cocok untuk tooling, backend, dan utilitas cepat."
      },
      {
        "no": 12,
        "name": "Bash",
        "secondary": "GNU bash 5.2.21",
        "origin": "Shell scripting",
        "summary": "Penting untuk otomasi terminal, workflow build, dan skrip utilitas."
      },
      {
        "no": 13,
        "name": "NASM",
        "secondary": "NASM 2.16.03",
        "origin": "Assembler x86",
        "summary": "Digunakan untuk eksperimen assembly, pembelajaran low-level, dan optimasi tertentu."
      },
      {
        "no": 14,
        "name": "JDK compiler (javac)",
        "secondary": "javac 21.0.10",
        "origin": "Tool compiler Java",
        "summary": "Menyediakan kompilasi langsung proyek Java dan melengkapi toolchain JVM."
      }
    ]
  },
  {
    "section": "II",
    "slug": "ekosistem-javascript-web-modern-dan-tool-frontend",
    "label": "Ekosistem JavaScript, web modern, dan tool frontend",
    "count": 9,
    "focus": "Runtime JS, package, bundler, dan web backend/frontend",
    "entries": [
      {
        "no": 1,
        "name": "Node.js",
        "secondary": "v24.13.1",
        "origin": "Runtime JavaScript server-side",
        "summary": "Pusat ekosistem JavaScript modern untuk tooling, backend, dan build pipeline."
      },
      {
        "no": 2,
        "name": "V8 (JS engine)",
        "secondary": "13.6.233.17-node.40",
        "origin": "Engine JavaScript",
        "summary": "Mesin inti yang menjalankan JavaScript berperforma tinggi pada Node.js dan tool terkait."
      },
      {
        "no": 3,
        "name": "npm",
        "secondary": "11.8.0",
        "origin": "Package manager JavaScript",
        "summary": "Dipakai untuk manajemen dependensi, script build, dan distribusi library."
      },
      {
        "no": 4,
        "name": "npx",
        "secondary": "11.8.0",
        "origin": "Package runner",
        "summary": "Memudahkan eksekusi paket CLI tanpa instalasi global permanen."
      },
      {
        "no": 5,
        "name": "TypeScript (tsc)",
        "secondary": "Version 6.0.2",
        "origin": "Superset JavaScript bertipe",
        "summary": "Penting untuk proyek skala besar dengan keamanan tipe dan struktur kode lebih rapi."
      },
      {
        "no": 6,
        "name": "Vite (global)",
        "secondary": "vite 8.0.2",
        "origin": "Build tool frontend modern",
        "summary": "Mempercepat pengembangan dan bundling proyek web modern, terutama React dan ekosistem serupa."
      },
      {
        "no": 7,
        "name": "Deno",
        "secondary": "2.7.7",
        "origin": "Runtime JavaScript/TypeScript modern",
        "summary": "Menyediakan workflow modern dengan fokus keamanan, tooling bawaan, dan TypeScript langsung."
      },
      {
        "no": 8,
        "name": "Bun",
        "secondary": "1.3.8",
        "origin": "Runtime dan toolkit JavaScript",
        "summary": "Menggabungkan runtime, bundler, dan package manager dengan performa tinggi."
      },
      {
        "no": 9,
        "name": "PHP",
        "secondary": "PHP 8.5.4",
        "origin": "Bahasa web server-side",
        "summary": "Masih relevan untuk backend web, CMS, utilitas server, dan integrasi aplikasi."
      }
    ]
  },
  {
    "section": "III",
    "slug": "data-basis-data-dan-komputasi-ilmiah",
    "label": "Data, basis data, dan komputasi ilmiah",
    "count": 3,
    "focus": "Statistik, numerik, dan penyimpanan data lokal",
    "entries": [
      {
        "no": 1,
        "name": "R",
        "secondary": "R version 4.5.2",
        "origin": "Bahasa statistik",
        "summary": "Kuat untuk statistik, visualisasi data, analisis eksperimen, dan komputasi ilmiah terapan."
      },
      {
        "no": 2,
        "name": "Julia",
        "secondary": "julia version 1.12.5",
        "origin": "Bahasa komputasi numerik",
        "summary": "Unggul untuk eksperimen numerik, simulasi, dan komputasi ilmiah berperforma tinggi."
      },
      {
        "no": 3,
        "name": "SQLite",
        "secondary": "3.51.2",
        "origin": "Basis data embedded",
        "summary": "Sangat praktis untuk penyimpanan lokal aplikasi, prototipe, dan tool offline."
      }
    ]
  },
  {
    "section": "IV",
    "slug": "bahasa-fungsional-alternatif-dan-eksperimental",
    "label": "Bahasa fungsional, alternatif, dan eksperimental",
    "count": 11,
    "focus": "Paradigma fungsional, scripting, dan eksplorasi lanjutan",
    "entries": [
      {
        "no": 1,
        "name": "Haskell (ghc)",
        "secondary": "GHC 9.6.7",
        "origin": "Bahasa fungsional murni",
        "summary": "Sangat baik untuk mempelajari paradigma fungsional, tipe kuat, dan desain program formal."
      },
      {
        "no": 2,
        "name": "Scala",
        "secondary": "Scala 2.13.8",
        "origin": "Bahasa JVM multiparadigma",
        "summary": "Menggabungkan orientasi objek dan fungsional pada ekosistem JVM."
      },
      {
        "no": 3,
        "name": "Clojure (clj)",
        "secondary": "Clojure CLI 1.12.4.1602",
        "origin": "Bahasa Lisp pada JVM",
        "summary": "Cocok untuk eksplorasi data, REPL-driven development, dan pemrograman fungsional dinamis."
      },
      {
        "no": 4,
        "name": "Elixir",
        "secondary": "Elixir 1.19.5",
        "origin": "Bahasa BEAM modern",
        "summary": "Kuat untuk sistem konkuren, service real-time, dan aplikasi yang butuh fault tolerance."
      },
      {
        "no": 5,
        "name": "Erlang (erl)",
        "secondary": "BEAM emulator 16.2",
        "origin": "Bahasa dan runtime BEAM",
        "summary": "Terkenal untuk sistem konkuren, telekomunikasi, dan reliability tinggi."
      },
      {
        "no": 6,
        "name": "OCaml (ocamlc)",
        "secondary": "5.4.1",
        "origin": "Bahasa fungsional statis",
        "summary": "Dipakai untuk compiler, tooling, dan sistem dengan struktur tipe yang kuat."
      },
      {
        "no": 7,
        "name": "Scheme (Guile)",
        "secondary": "GNU Guile 3.0.9",
        "origin": "Dialek Lisp",
        "summary": "Baik untuk skrip, eksplorasi konsep bahasa, dan otomatisasi tertentu."
      },
      {
        "no": 8,
        "name": "Lua",
        "secondary": "Lua 5.4.6",
        "origin": "Bahasa embeddable ringan",
        "summary": "Sering dipakai pada game, konfigurasi, scripting, dan integrasi ringan."
      },
      {
        "no": 9,
        "name": "Tcl (tclsh)",
        "secondary": "8.6.16",
        "origin": "Bahasa scripting",
        "summary": "Berguna untuk otomasi dan sistem lama yang masih memerlukan kompatibilitas Tcl."
      },
      {
        "no": 10,
        "name": "Nim",
        "secondary": "Nim Compiler 2.0.8",
        "origin": "Bahasa terkompilasi modern",
        "summary": "Menyediakan sintaks ringkas dengan performa kompilasi yang baik ke native code."
      },
      {
        "no": 11,
        "name": "Crystal",
        "secondary": "Crystal 1.19.1",
        "origin": "Bahasa terkompilasi mirip Ruby",
        "summary": "Menawarkan sintaks nyaman dengan kompilasi native dan performa yang lebih tinggi."
      }
    ]
  },
  {
    "section": "V",
    "slug": "produksi-kreatif-ide-dan-engine-pengembangan",
    "label": "Produksi kreatif, IDE, dan engine pengembangan",
    "count": 6,
    "focus": "3D, engine game, IDE, dan editor utama",
    "entries": [
      {
        "no": 1,
        "name": "Blender",
        "secondary": "Blender 5.1.0",
        "origin": "Tool 3D open-source",
        "summary": "Dipakai untuk modeling, rigging, animasi, texturing, environment, dan asset pipeline."
      },
      {
        "no": 2,
        "name": "Godot",
        "secondary": "4.6.1.stable.mono.official.14d19694e",
        "origin": "Game engine",
        "summary": "Cocok untuk game 2D/3D, prototipe cepat, dan pengembangan yang ringan namun fleksibel."
      },
      {
        "no": 3,
        "name": "Unity Hub",
        "secondary": "C:\\Program Files\\Unity Hub\\Unity Hub.exe",
        "origin": "Launcher dan manajer versi Unity",
        "summary": "Memudahkan pengelolaan editor, lisensi, dan banyak versi proyek Unity."
      },
      {
        "no": 4,
        "name": "Unity Editor",
        "secondary": "6000.4.0f1-x86_64",
        "origin": "Game engine dan editor",
        "summary": "Sangat kuat untuk game, simulasi interaktif, UI, mobile build, dan workflow asset modern."
      },
      {
        "no": 5,
        "name": "Visual Studio (devenv)",
        "secondary": "Microsoft Visual Studio 18 Community",
        "origin": "IDE pengembangan",
        "summary": "IDE utama untuk .NET, C#, C++, debugging, dan integrasi proyek besar."
      },
      {
        "no": 6,
        "name": "Unreal Engine Editor",
        "secondary": "UE_5.7",
        "origin": "Game engine tingkat tinggi",
        "summary": "Dipakai untuk produksi visual realistis, dunia 3D besar, dan blueprint workflow."
      }
    ]
  },
  {
    "section": "VI",
    "slug": "toolchain-android-sdk-dan-dukungan-build-mobile",
    "label": "Toolchain Android, SDK, dan dukungan build mobile",
    "count": 7,
    "focus": "Build, debug, dan distribusi target Android",
    "entries": [
      {
        "no": 1,
        "name": "Android Build Support untuk Unity",
        "secondary": "Terpasang di Unity Editor",
        "origin": "Modul build",
        "summary": "Memungkinkan ekspor dan build proyek Unity ke platform Android."
      },
      {
        "no": 2,
        "name": "Android SDK",
        "secondary": "SDK Android terpasang",
        "origin": "Toolkit pengembangan Android",
        "summary": "Fondasi utilitas build, platform tools, dan komponen yang dibutuhkan untuk pengembangan Android."
      },
      {
        "no": 3,
        "name": "Android sdkmanager",
        "secondary": "cmdline-tools latest",
        "origin": "Manajer paket SDK",
        "summary": "Mengelola instalasi platform, build-tools, dan komponen tambahan Android."
      },
      {
        "no": 4,
        "name": "Android adb",
        "secondary": "platform-tools\\adb.exe",
        "origin": "Android Debug Bridge",
        "summary": "Dipakai untuk debugging perangkat, instalasi APK, log, dan komunikasi dengan device Android."
      },
      {
        "no": 5,
        "name": "Android NDK",
        "secondary": "NDK terpasang",
        "origin": "Native Development Kit",
        "summary": "Dibutuhkan untuk build native code, integrasi library C/C++, dan pipeline tertentu."
      },
      {
        "no": 6,
        "name": "Unity OpenJDK",
        "secondary": "OpenJDK bawaan Unity",
        "origin": "Runtime/tool Java untuk Unity Android",
        "summary": "Menopang proses build Android pada workflow Unity."
      },
      {
        "no": 7,
        "name": "OpenJDK / JDK",
        "secondary": "openjdk 21.0.10 LTS",
        "origin": "Toolchain Java umum",
        "summary": "Melengkapi kompilasi Java/Kotlin dan banyak kebutuhan build lintas tool."
      }
    ]
  },
  {
    "section": "VII",
    "slug": "fitur-engine-sistem-gameplay-dan-workflow-interaktif",
    "label": "Fitur engine, sistem gameplay, dan workflow interaktif",
    "count": 11,
    "focus": "UI, animasi, audio, navigasi, data, dan scripting engine",
    "entries": [
      {
        "no": 1,
        "name": "ShaderLab / HLSL",
        "secondary": "Bagian dari Unity Editor",
        "origin": "Sistem shader dan material",
        "summary": "Dipakai untuk efek visual, material khusus, dan kontrol tampilan grafis."
      },
      {
        "no": 2,
        "name": "Input System",
        "secondary": "Bagian dari Unity / package Unity",
        "origin": "Sistem input modern",
        "summary": "Mengelola keyboard, mouse, gamepad, touch, dan binding kontrol secara lebih fleksibel."
      },
      {
        "no": 3,
        "name": "UI",
        "secondary": "Bagian dari Unity",
        "origin": "Sistem antarmuka",
        "summary": "Digunakan untuk membuat menu, HUD, panel, form, dan tampilan interaktif."
      },
      {
        "no": 4,
        "name": "Animation",
        "secondary": "Bagian dari Unity",
        "origin": "Sistem animasi",
        "summary": "Mengatur gerakan karakter, objek, transisi, dan animator state."
      },
      {
        "no": 5,
        "name": "Audio",
        "secondary": "Bagian dari Unity",
        "origin": "Sistem suara",
        "summary": "Menangani efek suara, musik, spatial audio, dan kontrol pengalaman audio."
      },
      {
        "no": 6,
        "name": "NavMesh",
        "secondary": "Bagian dari Unity / AI Navigation",
        "origin": "Sistem navigasi AI",
        "summary": "Penting untuk pergerakan karakter non-player dan pathfinding pada dunia permainan."
      },
      {
        "no": 7,
        "name": "Addressables",
        "secondary": "Package / workflow Unity",
        "origin": "Manajemen aset",
        "summary": "Memudahkan pemuatan aset besar, modularisasi konten, dan distribusi konten dinamis."
      },
      {
        "no": 8,
        "name": "Multiplayer / Online System",
        "secondary": "Tergantung proyek / package yang dipilih",
        "origin": "Sistem konektivitas",
        "summary": "Menjadi dasar permainan online, sinkronisasi pemain, dan interaksi jaringan."
      },
      {
        "no": 9,
        "name": "Cloud Save / Backend Data",
        "secondary": "Tergantung proyek / backend yang dipilih",
        "origin": "Sistem data daring",
        "summary": "Menyimpan progres, profil, dan data pengguna lintas perangkat atau sesi."
      },
      {
        "no": 10,
        "name": "GDScript",
        "secondary": "Bagian dari Godot",
        "origin": "Bahasa skrip engine Godot",
        "summary": "Bahasa utama Godot untuk logika game, tool in-engine, dan prototipe cepat."
      },
      {
        "no": 11,
        "name": "Blueprint",
        "secondary": "Bagian dari Unreal Engine",
        "origin": "Scripting visual Unreal",
        "summary": "Memungkinkan logika gameplay visual tanpa selalu menulis kode teks secara langsung."
      }
    ]
  }
]
};

const sharedProjects = [
  { name: "PulseBoard Fusion", meta: "Unified portal", copy: "Portal utama hasil redesign dari proyek terlampir dengan ritme visual yang lebih sinematik." },
  { name: "Green Atlas", meta: "Plants page", copy: "Atlas tanaman dengan kategori yang lebih terang, rapi, dan mudah dibaca." },
  { name: "Wild Echo", meta: "Animals page", copy: "Fieldbook fauna dengan ritme hangat, liar, dan lebih dramatis." },
  { name: "Tech Forge", meta: "Technology page", copy: "Control-room layout untuk peta teknologi dan toolchain yang luas." },
  { name: "News Desk", meta: "Media page", copy: "Daftar kanal berita Indonesia A–Z dalam format katalog yang seragam dan mudah dibuka." },
  { name: "Market Lane", meta: "E-commerce page", copy: "Platform e-commerce Indonesia ditata sebagai katalog visual setara dengan Green Atlas dan lainnya." },
  { name: "Azka Garden", meta: "Garden page", copy: "Halaman sejajar untuk showcase Azka Garden dengan gaya PulseBoard yang konsisten." }
];

const toolGroups = [
  { name: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "Vite"] },
  { name: "Runtime", items: ["Python", "Node.js", ".NET", "Go", "PHP"] },
  { name: "Creative", items: ["Blender", "Unity", "Godot", "Unreal", "ShaderLab"] },
  { name: "Data", items: ["R", "Julia", "SQLite", "APIs", "Structured flows"] },
  { name: "Systems", items: ["Rust", "C", "C++", "Java", "Android SDK"] }
];



const exactTopicPools = {
  plants: {
    "tomat": [
      { id: "9w-7RoH_uic", title: "Grow Lots of Tomatoes... Not Leaves", tag: "Tomato" },
      { id: "fDiu2YS_khU", title: "Tomato Growing Masterclass", tag: "Tomato" },
      { id: "dV5C7rjT64c", title: "Growing Tomatoes From Sowing to Harvest", tag: "Tomato" }
    ],
    "cabai": [
      { id: "6rPPUmStKQ4", title: "Back to Eden Gardening", tag: "Peppers" },
      { id: "Z5PgbcTqmM4", title: "Grocery Row Gardening", tag: "Peppers" },
      { id: "z1uLKu12Ju0", title: "Raised Bed Vegetable Garden", tag: "Peppers" }
    ],
    "bayam": [
      { id: "z1uLKu12Ju0", title: "Raised Bed Vegetable Garden", tag: "Leafy Greens" },
      { id: "6rPPUmStKQ4", title: "Back to Eden Gardening", tag: "Leafy Greens" }
    ],
    "selada": [
      { id: "z1uLKu12Ju0", title: "Raised Bed Vegetable Garden", tag: "Lettuce" },
      { id: "Z5PgbcTqmM4", title: "Grocery Row Gardening", tag: "Lettuce" }
    ]
  },
  animals: {
    "domba merino": [
      { id: "paF1BUI_CI8", title: "Dangerous Alpine crossings", tag: "Sheep" },
      { id: "4p0M8FGl_zY", title: "Sheep Farming in Ireland", tag: "Sheep" },
      { id: "qmry1MF6l_Q", title: "Raising Sheep in Europe", tag: "Sheep" }
    ],
    "domba garut": [
      { id: "qmry1MF6l_Q", title: "Raising Sheep in Europe", tag: "Sheep" },
      { id: "4p0M8FGl_zY", title: "Sheep Farming in Ireland", tag: "Sheep" },
      { id: "8ROqIEOhpps", title: "Sheep Are Raised and Sheared", tag: "Sheep" }
    ],
    "domba lokal": [
      { id: "4p0M8FGl_zY", title: "Sheep Farming in Ireland", tag: "Sheep" },
      { id: "paF1BUI_CI8", title: "Dangerous Alpine crossings", tag: "Sheep" },
      { id: "qmry1MF6l_Q", title: "Raising Sheep in Europe", tag: "Sheep" }
    ],
    "kambing boer": [
      { id: "jHXK9ohcYug", title: "Goats: Social, Smart, Sensitive", tag: "Goat" },
      { id: "zANwTFS2Cfw", title: "Goats Are Smarter Than You Think", tag: "Goat" },
      { id: "M9ylPCb2H8Q", title: "Markhor Mountain Goats", tag: "Goat" }
    ],
    "kambing kacang": [
      { id: "zANwTFS2Cfw", title: "Goats Are Smarter Than You Think", tag: "Goat" },
      { id: "jHXK9ohcYug", title: "Goats: Social, Smart, Sensitive", tag: "Goat" },
      { id: "Gsc4iRC01kk", title: "Mountain Goats on a Cliff Edge", tag: "Goat" }
    ],
    "peranakan etawa": [
      { id: "jHXK9ohcYug", title: "Goats: Social, Smart, Sensitive", tag: "Goat" },
      { id: "Gsc4iRC01kk", title: "Mountain Goats on a Cliff Edge", tag: "Goat" },
      { id: "zANwTFS2Cfw", title: "Goats Are Smarter Than You Think", tag: "Goat" }
    ]
  },
  tech: {
    "python": [
      { id: "K5KVEU3aaeQ", title: "Python Full Course for Beginners", tag: "Python" },
      { id: "eWRfhZUzrAc", title: "Python for Beginners – Full Course", tag: "Python" },
      { id: "_uQrJ0TkZlc", title: "Learn Python for AI and Web", tag: "Python" }
    ],
    "py launcher": [
      { id: "OGcVB5Lnxuc", title: "What Is the py Launcher?", tag: "Py Launcher" },
      { id: "R6C5mvLPW7k", title: "Use Multiple Python Versions with py", tag: "Py Launcher" },
      { id: "2izzwOliGyg", title: "Find It Using the py Launcher", tag: "Py Launcher" }
    ],
    "c gcc": [
      { id: "1WFDQaaMnN0", title: "GCC Compiler Tutorial", tag: "GCC" },
      { id: "cDPu86e09uQ", title: "Using the gcc Compiler", tag: "GCC" },
      { id: "k3w0igwp-FM", title: "Install and Run GCC Compiler in Windows", tag: "GCC" }
    ]
  }
};

function resolveExactTopicPool(pageKey, entry) {
  const config = exactTopicPools[pageKey];
  if (!config) return null;
  const candidates = [
    normalizeTopicText(entry?.name || ""),
    normalizeTopicText(entry?.secondary || "")
  ].filter(Boolean);
  let best = null;
  let bestLen = -1;
  for (const candidate of candidates) {
    for (const [key, pool] of Object.entries(config)) {
      const nk = normalizeTopicText(key);
      if (!nk) continue;
      if (candidate === nk || candidate.includes(nk) || nk.includes(candidate)) {
        if (nk.length > bestLen) {
          best = pool;
          bestLen = nk.length;
        }
      }
    }
  }
  return best;
}

const curatedCatalogVideos = {
  plants: {
    groups: {
      "tanaman-hias-daun": [
        { id: "9aTlumr4rTc", title: "Monstera / Houseplant Care", tag: "Houseplants" },
        { id: "v77aOnfx3mY", title: "Aroid Land", tag: "Aroids" },
        { id: "lOy1YUeuR9A", title: "Kebun Raya Purwodadi", tag: "Botanical" }
      ],
      "tanaman-hias-bunga": [
        { id: "EL0PogONQn4", title: "Rose Garden Tour", tag: "Flowers" },
        { id: "g4-P6_mm03Q", title: "Peter Beales Rose Garden", tag: "Flowers" },
        { id: "CRUAa04lyi4", title: "David Austin Rose Garden", tag: "Garden" }
      ],
      "sukulen-dan-kaktus": [
        { id: "wKdUpw4RMu4", title: "Succulent Collection", tag: "Succulent" },
        { id: "-kLBcf16vdM", title: "Cactus & Succulent Tour", tag: "Cactus" },
        { id: "VWdRwqjoo_I", title: "Success with Succulents", tag: "Succulent" }
      ],
      "tanaman-pangan-dan-sayur": [
        { id: "6rPPUmStKQ4", title: "Back to Eden Gardening", tag: "Vegetable" },
        { id: "Z5PgbcTqmM4", title: "Grocery Row Gardening", tag: "Edible" },
        { id: "z1uLKu12Ju0", title: "Raised Bed Vegetable Garden", tag: "Garden" }
      ],
      "tanaman-herbal-dan-rempah": [
        { id: "NJmCdjRKUnY", title: "Growers Documentary", tag: "Herbs" },
        { id: "Z5PgbcTqmM4", title: "Grocery Row Gardening", tag: "Edible" },
        { id: "6rPPUmStKQ4", title: "Back to Eden Gardening", tag: "Garden" }
      ],
      "buah-buahan": [
        { id: "doOQ91XoBYE", title: "Hawaii Fruit Tree Orchard", tag: "Orchard" },
        { id: "_6STpHpEzHs", title: "Urban Orchard", tag: "Fruit" },
        { id: "Sb30X515mhU", title: "Orchard: A Year in England's Eden", tag: "Orchard" }
      ],
      "pohon": [
        { id: "8WITdVbJ0vA", title: "Amazing Fruit Trees on Mountains", tag: "Trees" },
        { id: "YJ8glPj449o", title: "Fruit Orchard of Western Switzerland", tag: "Canopy" },
        { id: "8o_6mp0Ce3M", title: "Botanic Gardens Brisbane", tag: "Landscape" }
      ],
      "pupuk-dan-amelioran": [
        { id: "FcDUh1oS1Yo", title: "How to Make and Use Compost", tag: "Compost" },
        { id: "VvP2nOAFnaU", title: "How to Compost", tag: "Soil" },
        { id: "ZpjMbUwjy8s", title: "What Compost Actually Does", tag: "Soil" }
      ]
    },
    keywords: [
      { keys: ["monstera"], videos: [
        { id: "9aTlumr4rTc", title: "Caring for Common Houseplants—Monstera", tag: "Monstera" },
        { id: "0CvjNNCv5_s", title: "Monstera Deliciosa Plant Care", tag: "Monstera" },
        { id: "QOFAurhuXxk", title: "Monstera Care Tips", tag: "Monstera" }
      ]},
      { keys: ["anggrek", "orchid", "phalaenopsis"], videos: [
        { id: "zGjxPQ3EzcU", title: "Phalaenopsis Orchid Care", tag: "Orchid" },
        { id: "mHDoyH0tRYc", title: "Orchid Care for Beginners", tag: "Orchid" },
        { id: "Q1tY8II30uU", title: "Moth Orchid Care Guide", tag: "Orchid" }
      ]},
      { keys: ["mawar", "rose"], videos: [
        { id: "EL0PogONQn4", title: "Master Rosarian Rose Garden Tour", tag: "Rose" },
        { id: "82zl_nMyuco", title: "The Rose Ark", tag: "Rose" },
        { id: "CRUAa04lyi4", title: "David Austin Rose Garden", tag: "Rose" }
      ]},
      { keys: ["sukulen", "kaktus", "aloe", "echeveria", "haworthia", "kalanchoe", "opuntia", "mammillaria", "sedum"], videos: [
        { id: "wKdUpw4RMu4", title: "Perfectly Grown Succulent Collection", tag: "Succulent" },
        { id: "-kLBcf16vdM", title: "Cactus & Succulent Collection Tour", tag: "Cactus" },
        { id: "VWdRwqjoo_I", title: "Success with Succulents", tag: "Succulent" }
      ]},
      { keys: ["padi", "gandum", "jagung", "kedelai", "kentang", "singkong", "cabai", "tomat", "bayam", "selada", "sayur", "pangan"], videos: [
        { id: "6rPPUmStKQ4", title: "Back to Eden Gardening", tag: "Vegetable" },
        { id: "Z5PgbcTqmM4", title: "Grocery Row Gardening", tag: "Edible" },
        { id: "z1uLKu12Ju0", title: "Raised Bed Vegetable Garden", tag: "Garden" }
      ]},
      { keys: ["kunyit", "jahe", "kencur", "lengkuas", "serai", "kemangi", "mint", "rosemary", "lada", "parsley", "herbal", "rempah"], videos: [
        { id: "NJmCdjRKUnY", title: "Growers Documentary", tag: "Herbs" },
        { id: "6rPPUmStKQ4", title: "Back to Eden Gardening", tag: "Garden" },
        { id: "Z5PgbcTqmM4", title: "Grocery Row Gardening", tag: "Edible" }
      ]},
      { keys: ["mangga", "pisang", "pepaya", "nanas", "jeruk", "alpukat", "anggur", "semangka", "durian", "rambutan", "buah", "orchard"], videos: [
        { id: "doOQ91XoBYE", title: "Hawaii Fruit Tree Orchard", tag: "Orchard" },
        { id: "_6STpHpEzHs", title: "Urban Orchard", tag: "Fruit" },
        { id: "k9XN4lmBRZQ", title: "Growing Apples in a Big Way", tag: "Orchard" }
      ]},
      { keys: ["kompos", "kascing", "pupuk", "bokashi", "biochar", "dolomit", "urea", "npk", "soil"], videos: [
        { id: "FcDUh1oS1Yo", title: "Compost Masterclass", tag: "Compost" },
        { id: "VvP2nOAFnaU", title: "How to Compost", tag: "Soil" },
        { id: "ZpjMbUwjy8s", title: "What Compost Actually Does", tag: "Soil" }
      ]}
    ]
  },
  animals: {
    groups: {
      "ternak-besar-dan-ruminansia-utama": [
        { id: "dADGWKmrIO4", title: "The Surprising Intelligence of Cows", tag: "Livestock" },
        { id: "MWelBq1sKC8", title: "Wild Water Buffalo", tag: "Buffalo" },
        { id: "paF1BUI_CI8", title: "Shepherds Documentary", tag: "Sheep" }
      ],
      "ternak-kecil-serat-dan-hasil-khusus": [
        { id: "jHXK9ohcYug", title: "Goats: Social, Smart, Sensitive", tag: "Goats" },
        { id: "paF1BUI_CI8", title: "Shepherds Documentary", tag: "Sheep" },
        { id: "VgrW0c-U3X4", title: "A Life Among Sheep and Goats", tag: "Pastoral" }
      ],
      "unggas-domestik-dan-unggas-air": [
        { id: "MSuVtjQOKBg", title: "Chicken Planet", tag: "Poultry" },
        { id: "V3atXL_skmo", title: "Duck Farming Documentary", tag: "Duck" },
        { id: "_UsjdxZJdfo", title: "Quail Farming", tag: "Quail" }
      ],
      "hewan-perairan-budidaya": [
        { id: "mgtgt46TduY", title: "Catfish Farming Documentary", tag: "Catfish" },
        { id: "B3TePLqSfKg", title: "Tilapia Farming", tag: "Fish" },
        { id: "OcztvM4VPes", title: "Shrimp Farming Documentary", tag: "Shrimp" }
      ],
      "penyerbuk-pengolah-organik-dan-pendukung-tanah": [
        { id: "TzjP6FyXdb0", title: "Secret Life of Wild Honey Bees", tag: "Bees" },
        { id: "HaYNXWMS2Gw", title: "The Pollinators", tag: "Pollinators" },
        { id: "HLi5htzDd4o", title: "Children of the Sun – Wild Bees", tag: "Pollinators" }
      ],
      "hewan-pendamping-penjaga-dan-pengendali-alami": [
        { id: "YCTRVOcXFAM", title: "Barn Cats Defend the Farm", tag: "Barn Cats" },
        { id: "Hmn_HA1Dqlk", title: "Livestock Guardian Dogs", tag: "Guardian" },
        { id: "6KJW3ztGy_0", title: "Barn Owls Willow & Ghost", tag: "Owls" }
      ]
    },
    keywords: [
      { keys: ["domba", "sheep", "merino", "garut"], videos: [
        { id: "paF1BUI_CI8", title: "Dangerous Alpine Crossings with Shepherds", tag: "Sheep" },
        { id: "p2dmqYH__5c", title: "Why Sheep Matter", tag: "Sheep" },
        { id: "qmry1MF6l_Q", title: "Raising Sheep in Europe", tag: "Sheep" },
        { id: "kEVzmdychMg", title: "Sheep Hero", tag: "Sheep" }
      ]},
      { keys: ["kambing", "goat", "etawa", "boer", "markhor"], videos: [
        { id: "jHXK9ohcYug", title: "Goats: Social, Smart, Sensitive", tag: "Goat" },
        { id: "zANwTFS2Cfw", title: "Goats Are Smarter Than You Think", tag: "Goat" },
        { id: "M9ylPCb2H8Q", title: "Markhor Mountain Goats", tag: "Goat" },
        { id: "Gsc4iRC01kk", title: "Mountain Goats on a Cliff Edge", tag: "Goat" }
      ]},
      { keys: ["sapi", "cow", "cattle"], videos: [
        { id: "dADGWKmrIO4", title: "Surprising Intelligence of Cows", tag: "Cattle" },
        { id: "NTSe77tHVP4", title: "Cows' Astonishing Social Intelligence", tag: "Cattle" },
        { id: "7pWypdR05Hg", title: "Life of Wild Cows", tag: "Cattle" },
        { id: "cS9xA7KBcx8", title: "Cattle First Documentary", tag: "Cattle" }
      ]},
      { keys: ["kerbau", "buffalo", "murrah"], videos: [
        { id: "MWelBq1sKC8", title: "Wild Water Buffalo", tag: "Buffalo" },
        { id: "a9777UfhzIE", title: "Buffalo: King of Wetlands", tag: "Buffalo" },
        { id: "lXpQ2I3aUCA", title: "Good Life of the Wild Water Buffalo", tag: "Buffalo" }
      ]},
      { keys: ["ayam", "chicken"], videos: [
        { id: "MSuVtjQOKBg", title: "Chicken Planet", tag: "Poultry" },
        { id: "p8yKdOwaVyI", title: "History of Chickens", tag: "Poultry" },
        { id: "lp22O3oV5Mk", title: "Modern Poultry Farm", tag: "Poultry" }
      ]},
      { keys: ["itik", "bebek", "duck", "entok", "angsa", "goose"], videos: [
        { id: "V3atXL_skmo", title: "Duck Farming Documentary", tag: "Duck" },
        { id: "T-FrvfnvCPY", title: "Raising Ducks for High Egg Production", tag: "Duck" },
        { id: "vQeQ8kYirDM", title: "From Duckling to Duck", tag: "Duck" }
      ]},
      { keys: ["kalkun", "turkey"], videos: [
        { id: "evR1tTDXjqw", title: "Millions of Turkeys Are Processed", tag: "Turkey" },
        { id: "2lVutUk0hXQ", title: "How Millions of Turkeys Are Raised", tag: "Turkey" },
        { id: "siD7QIuC-Co", title: "Million Turkey Poultry Farm", tag: "Turkey" }
      ]},
      { keys: ["puyuh", "quail"], videos: [
        { id: "_UsjdxZJdfo", title: "How Billions of Quail Are Raised", tag: "Quail" },
        { id: "bRQT73G8_DI", title: "Japanese Farmers Raise Quails", tag: "Quail" },
        { id: "ru_-Z7aj7u0", title: "Quail Eggs Harvested & Processed", tag: "Quail" }
      ]},
      { keys: ["lele", "catfish"], videos: [
        { id: "mgtgt46TduY", title: "Catfish Farming Documentary", tag: "Catfish" },
        { id: "pJyXTMPrtUQ", title: "Modern Catfish Farming", tag: "Catfish" },
        { id: "JpEwobMQrFU", title: "From Water to Wealth", tag: "Catfish" }
      ]},
      { keys: ["nila", "tilapia", "mujair"], videos: [
        { id: "B3TePLqSfKg", title: "Tilapia Production", tag: "Tilapia" },
        { id: "zzXmX_E7qWM", title: "Fish Farming & Aquaculture", tag: "Fish" },
        { id: "OkJL3Qv7vaA", title: "One of the Biggest Fish Farms", tag: "Fish" }
      ]},
      { keys: ["gurame", "ikan mas", "bawal", "bandeng", "fish"], videos: [
        { id: "zzXmX_E7qWM", title: "Fish Farming & Aquaculture", tag: "Fish" },
        { id: "voGNKQjCcx8", title: "Marine Aquaculture in Indonesia", tag: "Aquaculture" },
        { id: "EEYD-Pyy6xo", title: "Genius Offshore Fish Farm", tag: "Fish" }
      ]},
      { keys: ["patin", "pangasius"], videos: [
        { id: "b5Mmi5V3HFw", title: "Pangasius Farming in Vietnam", tag: "Pangasius" },
        { id: "zzXmX_E7qWM", title: "Fish Farming & Aquaculture", tag: "Aquaculture" }
      ]},
      { keys: ["udang", "shrimp", "vaname", "galah"], videos: [
        { id: "OcztvM4VPes", title: "Shrimp Farming Documentary", tag: "Shrimp" },
        { id: "IunSeqYPdV8", title: "Vannamei Shrimp Farming Explained", tag: "Shrimp" },
        { id: "PEYG7cHrHkk", title: "Massive Shrimp Processing", tag: "Shrimp" }
      ]},
      { keys: ["lebah", "bee", "kelulut"], videos: [
        { id: "TzjP6FyXdb0", title: "Secret Life of Wild Honey Bees", tag: "Bee" },
        { id: "HaYNXWMS2Gw", title: "The Pollinators", tag: "Bee" },
        { id: "97Q_kY_Wrdc", title: "Wild Bees - Nature's Little Helpers", tag: "Bee" }
      ]},
      { keys: ["kupu", "butterfly", "pollinator", "lacewing", "koksi", "capung", "laba laba", "spider"], videos: [
        { id: "HLi5htzDd4o", title: "Children of the Sun – Wild Bees", tag: "Pollinator" },
        { id: "HaYNXWMS2Gw", title: "The Pollinators", tag: "Pollinator" },
        { id: "97Q_kY_Wrdc", title: "Wild Bees - Nature's Little Helpers", tag: "Pollinator" }
      ]},
      { keys: ["cacing", "worm", "bsf"], videos: [
        { id: "FcDUh1oS1Yo", title: "How to Make & Use Compost", tag: "Soil Life" },
        { id: "VvP2nOAFnaU", title: "How to Compost", tag: "Soil Life" },
        { id: "ZpjMbUwjy8s", title: "What Compost Actually Does", tag: "Soil Life" }
      ]},
      { keys: ["kucing", "barn cat", "cat"], videos: [
        { id: "YCTRVOcXFAM", title: "Barn Cats Defend the Farm", tag: "Barn Cat" },
        { id: "qb-UgOb-hu4", title: "Barn Cats Against Pests", tag: "Barn Cat" },
        { id: "wZM-1jTupbU", title: "The French Farm Cat", tag: "Barn Cat" }
      ]},
      { keys: ["anjing", "dog", "guardian"], videos: [
        { id: "Hmn_HA1Dqlk", title: "Livestock Guardian Dogs", tag: "Guardian Dog" },
        { id: "fBsM_pChQZc", title: "Working on Common Ground", tag: "Guardian Dog" },
        { id: "uYUhZP9s5Xc", title: "What My Guardian Dog Does", tag: "Guardian Dog" }
      ]},
      { keys: ["burung hantu", "owl"], videos: [
        { id: "6KJW3ztGy_0", title: "Barn Owls Willow & Ghost", tag: "Owl" },
        { id: "SCJctGY7gP8", title: "Silent Flight: Conserving the Barn Owl", tag: "Owl" },
        { id: "SznRDon6AH8", title: "Owls: The Ultimate Night Predator", tag: "Owl" }
      ]},
      { keys: ["kelelawar", "bat"], videos: [
        { id: "poEfPCUbDus", title: "Bat Superpowers", tag: "Bats" },
        { id: "ojBIcj5Figs", title: "The Bats of Alberta", tag: "Bats" },
        { id: "vCbZHvsX1dk", title: "Secrets and Mysteries of Bats", tag: "Bats" }
      ]}
    ]
  },
  tech: {
    keywords: [
      { keys: ["python 3", " python ", "python"], videos: [
        { id: "K5KVEU3aaeQ", title: "Python Full Course for Beginners", tag: "Python" },
        { id: "_uQrJ0TkZlc", title: "Learn Python for AI and Web", tag: "Python" },
        { id: "eWRfhZUzrAc", title: "Python for Beginners – Full Course", tag: "Python" }
      ]},
      { keys: ["py launcher", "launcher ekosistem python"], videos: [
        { id: "OGcVB5Lnxuc", title: "What Is the py Launcher?", tag: "Py Launcher" },
        { id: "R6C5mvLPW7k", title: "Use Multiple Python Versions with py", tag: "Py Launcher" },
        { id: "cxtNx7jHiU8", title: "How to Use Python Launcher", tag: "Py Launcher" }
      ]},
      { keys: ["c gcc", "gcc", "bahasa sistem", "compiler c"], videos: [
        { id: "xND0t1pr3KY", title: "C Programming Full Course", tag: "C / GCC" },
        { id: "1WFDQaaMnN0", title: "GCC Compiler Tutorial", tag: "GCC" },
        { id: "QYG_3MV0smQ", title: "How to Use GCC in CMD", tag: "GCC" },
        { id: "GxFiUEO_3zM", title: "Install GCC Compiler Tools in Windows 11", tag: "GCC" }
      ]},
      { keys: ["c++", "g++"], videos: [
        { id: "j8nAHeVKL08", title: "Introduction to C++ & g++", tag: "C++" },
        { id: "aVqZ3lZD8Qk", title: "Installing g++ and Getting Started", tag: "g++" },
        { id: "ZzaPdXTrSb8", title: "C++ Tutorial for Beginners", tag: "C++" }
      ]},
      { keys: ["java", "javac"], videos: [
        { id: "eIrMbAQSU34", title: "Java Full Course for Beginners", tag: "Java" },
        { id: "xTtL8E4LzTQ", title: "Java Full Course (free)", tag: "Java" },
        { id: "BGTx91t8q50", title: "Java Tutorial for Beginners", tag: "Java" }
      ]},
      { keys: [".net", " c#", "c#", "visual studio"], videos: [
        { id: "GhQdlIFylQ8", title: "C# Tutorial - Full Course for Beginners", tag: "C#" },
        { id: "6BcPIvVfVAw", title: "What is .NET?", tag: ".NET" },
        { id: "gfkTfcpWqAY", title: "Learn C# Basics in 1 Hour", tag: "C#" }
      ]},
      { keys: ["go ", "golang", " go"], videos: [
        { id: "8uiZC0l4Ajw", title: "Learn GO Fast", tag: "Go" },
        { id: "YS4e4q9oBaU", title: "Learn Go Programming", tag: "Go" },
        { id: "etSN4X_fCnM", title: "Go Tutorial #1", tag: "Go" }
      ]},
      { keys: ["swift"], videos: [
        { id: "8Xg7E9shq0U", title: "Swift Programming Tutorial", tag: "Swift" },
        { id: "Ulp1Kimblg0", title: "Swift Programming Tutorial for Beginners", tag: "Swift" },
        { id: "n5X_V81OYnQ", title: "Swift Essentials in One Hour", tag: "Swift" }
      ]},
      { keys: ["kotlin"], videos: [
        { id: "F9UC9DY-vIU", title: "Kotlin Course for Beginners", tag: "Kotlin" },
        { id: "EExSSotojVI", title: "Learn Kotlin Programming", tag: "Kotlin" },
        { id: "TEXaoSC_8lQ", title: "Kotlin Tutorial for Beginners", tag: "Kotlin" }
      ]},
      { keys: ["ruby"], videos: [
        { id: "Q0kI8J8r8yQ", title: "Ruby Programming Tutorial", tag: "Ruby" },
        { id: "SHF9VBqB1ME", title: "Learn Ruby in One Video", tag: "Ruby" }
      ]},
      { keys: ["rust"], videos: [
        { id: "ygL_xcavzQ4", title: "Rust Tutorial Full Course", tag: "Rust" },
        { id: "BpPEoZW5IiY", title: "Learn Rust Programming", tag: "Rust" },
        { id: "FkASrE05VY4", title: "Tutorial Rust Dasar", tag: "Rust" }
      ]},
      { keys: ["node.js", "node js", "npm", "npx", "v8"], videos: [
        { id: "f2EqECiTBL8", title: "Node.js Full Course for Beginners", tag: "Node.js" },
        { id: "32M1al-Y6Ag", title: "Node.js Crash Course", tag: "Node.js" },
        { id: "TlB_eWDSMt4", title: "Node.js Basics in 1 Hour", tag: "Node.js" }
      ]},
      { keys: ["typescript", "vite", "deno", "bun"], videos: [
        { id: "d56mG7DezGs", title: "TypeScript Tutorial for Beginners", tag: "TypeScript" },
        { id: "30LWjhZzg50", title: "Learn TypeScript – Full Tutorial", tag: "TypeScript" },
        { id: "gieEQFIfgYc", title: "TypeScript Full Course", tag: "TypeScript" }
      ]},
      { keys: ["php"], videos: [
        { id: "OK_JCtrrv-c", title: "PHP Programming Language Tutorial", tag: "PHP" },
        { id: "zZ6vybT1HQs", title: "PHP Full Course for Free", tag: "PHP" },
        { id: "TaBWhb5SPfc", title: "Tutorial PHP Dasar", tag: "PHP" }
      ]},
      { keys: ["r version", " r ", "r "], videos: [
        { id: "_V8eKsto3Ug", title: "R Programming Tutorial", tag: "R" },
        { id: "FY8BISK5DpM", title: "R Programming for Absolute Beginners", tag: "R" },
        { id: "eR-XRSKsuR4", title: "R Programming in One Hour", tag: "R" }
      ]},
      { keys: ["sqlite"], videos: [
        { id: "GMHK-0TKRVk", title: "SQLite Tutorial for Beginners", tag: "SQLite" },
        { id: "HQKwgk6XkIA", title: "SQLite Tutorial For Beginners", tag: "SQLite" },
        { id: "byHcYRpMgI4", title: "SQLite Databases With Python", tag: "SQLite" }
      ]},
      { keys: ["blender"], videos: [
        { id: "Ci3Has4L5W4", title: "Blender Tutorial for Beginners", tag: "Blender" },
        { id: "B0J27sf9N1Y", title: "Beginner Blender 4.0 Tutorial", tag: "Blender" },
        { id: "98qKfdJRzr0", title: "Blender Beginner Tutorial - Part 1", tag: "Blender" }
      ]},
      { keys: ["unity"], videos: [
        { id: "XtQMytORBmM", title: "Unity Tutorial For Complete Beginners", tag: "Unity" },
        { id: "vQY4jsho1nQ", title: "Unity 6 - Complete Beginners Tutorial", tag: "Unity" },
        { id: "E6A4WvsDeLE", title: "Learn Unity in 17 Minutes", tag: "Unity" }
      ]},
      { keys: ["godot", "gdscript"], videos: [
        { id: "LOhfqjmasi0", title: "Godot Beginner Tutorial", tag: "Godot" },
        { id: "e1zJS31tr88", title: "How to Program in Godot - GDScript", tag: "Godot" },
        { id: "q7wlSvt0JIc", title: "Godot 4 Crash Course", tag: "Godot" }
      ]},
      { keys: ["unreal", "blueprint"], videos: [
        { id: "k-zMkzmduqI", title: "Unreal Engine 5 Starter Course", tag: "Unreal" },
        { id: "gBIFMoFkZP4", title: "Unreal Engine 5 Beginner Tutorial", tag: "Unreal" },
        { id: "BGsFLoYp1V8", title: "Complete Beginner Guide to UE5", tag: "Unreal" }
      ]},
      { keys: ["android", "sdk", "adb", "ndk", "openjdk"], videos: [
        { id: "VtaY9EPIm0M", title: "How to Install Python on Windows - EASY", tag: "Toolchain" },
        { id: "XtQMytORBmM", title: "Unity Tutorial For Complete Beginners", tag: "Toolchain" },
        { id: "6BcPIvVfVAw", title: "What is .NET?", tag: "Toolchain" }
      ]}
    ]
  }
};

function normalizeTopicText(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[×()/:;,+.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashCode(value = "") {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function matchKeywordPool(config, haystack) {
  if (!config?.keywords) return null;
  let bestMatch = null;
  let bestScore = -1;
  config.keywords.forEach((item) => {
    item.keys.forEach((key) => {
      const normalizedKey = normalizeTopicText(key);
      if (!normalizedKey || !haystack.includes(normalizedKey)) return;
      if (normalizedKey.length > bestScore) {
        bestScore = normalizedKey.length;
        bestMatch = item.videos;
      }
    });
  });
  return bestMatch;
}

function resolveCatalogVideo(pageKey, group, entry) {
  const config = curatedCatalogVideos[pageKey] || null;
  const haystack = normalizeTopicText(`${entry.name} ${entry.secondary} ${entry.origin} ${group.label} ${group.focus}`);
  const exactItemPool = resolveExactTopicPool(pageKey, entry);
  const keywordPool = matchKeywordPool(config, haystack);
  const groupPool = config?.groups?.[group.slug] || null;
  const fallbackPool = themePools[pageKey] || themePools.plants;
  const pool = exactItemPool || keywordPool || groupPool || fallbackPool;
  const safePool = Array.isArray(pool) && pool.length ? pool : fallbackPool;
  const offset = hashCode(`${pageKey}:${group.slug}:${entry.name}:${entry.no}`) % Math.max(safePool.length, 1);
  const selected = safePool[offset] || fallbackPool[offset % fallbackPool.length];
  if (!selected?.id || !/^[A-Za-z0-9_-]{11}$/.test(selected.id)) {
    return fallbackPool[offset % fallbackPool.length];
  }
  return selected;
}


const page = document.body.dataset.page || "home";
const data = siteData[page] || siteData.home;
const embedUrl = (id) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?playsinline=1`;


function escapeInlineHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function posterUrl(videoId) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

function renderInlineVideoShell({ videoId = '', embedUrl: embed = '', youtubeUrl = '', title = '', label = 'Play video' }) {
  if (!videoId) return '';
  const safeTitle = escapeInlineHtml(title || 'YouTube video');
  const safeLabel = escapeInlineHtml(label || 'Play video');
  const safeEmbed = escapeInlineHtml(embed || embedUrl(videoId));
  const safeWatch = escapeInlineHtml(youtubeUrl || `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`);
  return `
    <button class="yt-shell yt-shell--inline" type="button" data-youtube-embed="${safeEmbed}" data-youtube-title="${safeTitle}" data-youtube-watch="${safeWatch}" aria-label="Putar ${safeTitle}">
      <img class="yt-shell__poster" src="${posterUrl(videoId)}" alt="Preview ${safeTitle}" loading="lazy">
      <span class="yt-shell__shade"></span>
      <span class="yt-shell__play">▶</span>
      <span class="yt-shell__label">${safeLabel}</span>
    </button>`;
}

function activateInlineVideoPlayers(scope = document) {
  scope.querySelectorAll('[data-youtube-embed]').forEach((button) => {
    if (button.dataset.playerBound === '1') return;
    button.dataset.playerBound = '1';
    button.addEventListener('click', () => {
      const frameHost = button.closest('.media-frame, .extra-preview, .video-frame, .yt-inline-host') || button.parentElement;
      const embed = button.getAttribute('data-youtube-embed') || '';
      const title = button.getAttribute('data-youtube-title') || 'YouTube video';
      if (!frameHost || !embed) return;
      frameHost.innerHTML = `<iframe loading="lazy" src="${embed}${embed.includes('?') ? '&' : '?'}autoplay=1" title="${escapeInlineHtml(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      frameHost.classList.add('is-playing');
    });
  });
}

const HOME_VIDEO_SLOTS = [
  { id: 'home-slot-1-creative-deck', title: 'Creative deck', desc: 'Tambahan layer presentasi untuk karya dan studi kasus visual.', tag: 'Design', fallback: videoLibrary.designA },
  { id: 'home-slot-2-future-systems', title: 'Future systems', desc: 'Nuansa teknologi modern untuk memberi karakter pada Tech Forge.', tag: 'Technology', fallback: videoLibrary.techA },
  { id: 'home-slot-3-wild-terrain', title: 'Wild terrain', desc: 'Suasana satwa dan bentang alam untuk menambah energi Wild Echo.', tag: 'Animals', fallback: videoLibrary.wildA },
  { id: 'home-slot-4-portfolio-deck', title: 'Portfolio deck', desc: 'Inspirasi showcase modern yang memperkaya Studio Deck.', tag: 'Portfolio', fallback: videoLibrary.portfolioA },
  { id: 'home-slot-5-botanical-motion', title: 'Botanical motion', desc: 'Lapisan hijau untuk membuka ritme visual Green Atlas.', tag: 'Plants', fallback: videoLibrary.botanicalA },
  { id: 'home-slot-6-ai-systems', title: 'AI systems', desc: 'Lapisan masa depan dan AI untuk memperkuat atmosfer digital.', tag: 'AI', fallback: videoLibrary.aiA }
];

function resolveHomeVideoAssignments() {
  const homeItems = (publicDbRegistry || []).filter((item) => item.category === 'home' && !item.isOpeningReel);
  const byId = new Map(homeItems.map((item) => [item.id, item]));
  const baseCards = HOME_VIDEO_SLOTS.map((slot) => {
    const stored = byId.get(slot.id);
    if (stored?.videoId) {
      return {
        id: stored.videoId,
        itemId: stored.id,
        title: stored.name || slot.title,
        desc: stored.description || slot.desc,
        tag: slot.tag,
        youtubeUrl: stored.youtubeUrl,
        embedUrl: stored.embedUrl,
        websiteUrl: stored.websiteUrl || '',
        downloadUrl: stored.downloadUrl || '',
        searchQuery: stored.searchQuery || slot.title,
        stored: true,
        isCustom: false
      };
    }
    return {
      id: slot.fallback.id,
      itemId: slot.id,
      title: stored?.name || slot.title,
      desc: stored?.description || slot.desc,
      tag: slot.tag,
      youtubeUrl: stored?.youtubeUrl || `https://www.youtube.com/watch?v=${encodeURIComponent(slot.fallback.id)}`,
      embedUrl: stored?.embedUrl || embedUrl(slot.fallback.id),
      websiteUrl: stored?.websiteUrl || '',
      downloadUrl: stored?.downloadUrl || '',
      searchQuery: stored?.searchQuery || slot.title,
      stored: false,
      isCustom: false
    };
  });
  const customCards = homeItems
    .filter((item) => !HOME_VIDEO_SLOTS.some((slot) => slot.id === item.id))
    .map((item) => ({
      id: item.videoId || '',
      itemId: item.id,
      title: item.name,
      desc: item.description || 'Kartu video tambahan untuk Home.',
      tag: 'Custom',
      youtubeUrl: item.youtubeUrl || '',
      embedUrl: item.embedUrl || '',
      websiteUrl: item.websiteUrl || '',
      downloadUrl: item.downloadUrl || '',
      searchQuery: item.searchQuery || item.name,
      stored: !!item.videoId,
      isCustom: true
    }));
  return [...baseCards, ...customCards];
}
const youtubeSearchUrl = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(String(query || '').trim())}`;
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const pickRandom = (items, count) => shuffle(items).slice(0, Math.min(count, items.length));
const fromKeys = (keys) => keys.map((key) => videoLibrary[key]).filter(Boolean);

const bindText = (selector, value) => {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = value;
};
const bindLink = (selector, link) => {
  const el = document.querySelector(selector);
  if (el && link) {
    el.textContent = link.text;
    el.setAttribute("href", link.href);
  }
};

bindText("[data-site-label]", data.label);
bindText("[data-site-title]", data.title);
bindText("[data-site-kicker]", data.kicker);
bindText("[data-site-body]", data.body);
bindLink("[data-cta-primary]", data.ctaPrimary);
bindLink("[data-cta-secondary]", data.ctaSecondary);

const statsHost = document.querySelector("[data-stats]");
if (statsHost) {
  statsHost.innerHTML = data.stats.map((item) => `
    <div class="stat reveal">
      <div class="stat__label">${item.label}</div>
      <div class="stat__value" data-target="${item.value}">0</div>
    </div>`).join("");
}

const visualHost = document.querySelector("[data-visual-cards]");
if (visualHost) {
  visualHost.innerHTML = data.visualCards.map((card, idx) => `
    <article class="info-card tilt-card ${card.type || ""} reveal delay-${Math.min(idx,3)}">
      <div class="micro">${card.tag}</div>
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </article>`).join("");
}

const signalTrack = document.querySelector("[data-signal-track]");
if (signalTrack) {
  const items = [...data.strip, ...data.strip];
  signalTrack.innerHTML = items.map((item) => `<span>${item}</span>`).join("<span>•</span>");
}

bindText("[data-feature-title]", data.sections.featureTitle);
bindText("[data-feature-text]", data.sections.featureText);
const featureHost = document.querySelector("[data-feature-grid]");
if (featureHost) {
  featureHost.innerHTML = data.sections.features.map((card, idx) => `
    <article class="split-card tilt-card reveal delay-${Math.min(idx,3)}">
      <div class="eyebrow">${card.tag}</div>
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </article>`).join("");
}

bindText("[data-rail-title]", data.sections.railTitle);
bindText("[data-rail-text]", data.sections.railText);
const railHost = document.querySelector("[data-rail-grid]");
if (railHost) {
  railHost.innerHTML = data.sections.rails.map((card, idx) => `
    <article class="media-card tilt-card reveal delay-${Math.min(idx,3)}">
      <div class="eyebrow">${card.tag}</div>
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </article>`).join("");
}

bindText("[data-media-title]", data.sections.mediaTitle);
bindText("[data-media-text]", data.sections.mediaText);


const mediaSection = document.getElementById("media");
const videoHost = document.querySelector("[data-video-grid]");
const pageCatalog = documentCatalogs[page] || null;
if (mediaSection) {
  mediaSection.querySelector('.media-showcase')?.remove();
}

let revealObserverInstance = null;
function getRevealObserver() {
  if (!("IntersectionObserver" in window)) return null;
  if (!revealObserverInstance) {
    revealObserverInstance = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        revealObserverInstance?.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  return revealObserverInstance;
}
function observeReveals() {
  const observer = getRevealObserver();
  document.querySelectorAll(".reveal").forEach((item) => {
    if (item.dataset.revealBound === "1") return;
    item.dataset.revealBound = "1";
    if (observer) observer.observe(item);
    else item.classList.add("in-view");
  });
}

function renderMediaRail() {
  if (!videoHost) return;
  const chosen = page === 'home'
    ? resolveHomeVideoAssignments()
    : pickRandom(fromKeys(data.sections.videoKeys || []), Math.min(6, fromKeys(data.sections.videoKeys || []).length));
  if (!chosen.length) return;

  videoHost.classList.remove("video-grid--catalog");
  videoHost.innerHTML = chosen.map((video, idx) => {
    const watchUrl = video.youtubeUrl || (video.id ? `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}` : '');
    const embed = video.embedUrl || (video.id ? embedUrl(video.id) : '');
    const mediaMarkup = video.id
      ? renderInlineVideoShell({ videoId: video.id, embedUrl: embed, youtubeUrl: watchUrl, title: video.title, label: 'Play inline' })
      : `<div class="video-card__empty"><span>Belum ada video tersimpan.</span></div>`;
    const pillText = video.isCustom ? 'Custom' : `Slot ${idx + 1}`;
    return `
    <article class="video-card video-card--uniform reveal delay-${Math.min(idx,3)}" data-item-id="${escapeInlineHtml(video.itemId || '')}">
      <div class="media-frame media-frame--compact media-frame--thumb">
        ${mediaMarkup}
      </div>
      <div class="video-card__meta">
        <div class="video-card__top">
          <span class="eyebrow">${video.tag}</span>
          <span class="pill">${pillText}</span>
        </div>
        <h3>${video.title}</h3>
        <p>${video.desc}</p>
        <div class="media-stage__actions">
          ${video.websiteUrl ? `<a class="ghost-button magnetic" href="${escapeInlineHtml(video.websiteUrl)}" target="_blank" rel="noreferrer">Buka Website</a>` : ''}
          ${watchUrl ? `<a class="button magnetic" href="${watchUrl}" target="_blank" rel="noreferrer">Buka Video</a>` : ``}
          ${video.downloadUrl ? `<a class="ghost-button magnetic" href="${escapeInlineHtml(video.downloadUrl)}" target="_blank" rel="noreferrer" download>Download</a>` : ``}
        </div>
      </div>
    </article>`;
  }).join("");

  bindMagnetic();
  activateInlineVideoPlayers(videoHost);
  observeReveals();
}

function buildVideoAssignments(total, pool) {
  const rotated = shuffle(pool);
  const startOffset = Math.floor(Math.random() * rotated.length);
  return Array.from({ length: total }, (_, idx) => rotated[(startOffset + idx) % rotated.length]);
}

const HOME_SEARCH_HISTORY_LOCAL_KEY = 'pulseboard-home-search-history-v1';
const HOME_SEARCH_LAST_QUERY_KEY = 'pulseboard-home-search-last-v1';
const homeSearchForm = document.querySelector('[data-home-video-search-form]');
const homeSearchInput = document.querySelector('[data-home-video-search-input]');
const homeSearchStatus = document.querySelector('[data-home-video-search-status]');
const homeSearchResults = document.querySelector('[data-home-video-search-results]');
const homeSearchHistoryHost = document.querySelector('[data-home-video-search-history]');
const homeSearchResetButton = document.querySelector('[data-home-video-search-reset]');
const homeSearchClearButton = document.querySelector('[data-home-video-search-clear]');
let homeSearchHistoryState = [];
let homeSearchRequestId = 0;

function homeSearchCategoryLabel(category) {
  const labels = {
    home: 'Home',
    tanaman: 'Green Atlas',
    hewan: 'Wild Echo',
    teknologi: 'Tech Forge',
    world: 'World Atlas',
    studio: 'Studio Deck',
    news: 'News Desk',
    commerce: 'E-Commerce',
    azka: 'Azka Garden'
  };
  return labels[String(category || '').trim().toLowerCase()] || 'Video card';
}
function readLocalHomeSearchHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HOME_SEARCH_HISTORY_LOCAL_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function writeLocalHomeSearchHistory(entries) {
  try {
    localStorage.setItem(HOME_SEARCH_HISTORY_LOCAL_KEY, JSON.stringify(Array.isArray(entries) ? entries.slice(0, 20) : []));
  } catch {}
}
function setHomeSearchStatus(message) {
  if (homeSearchStatus) homeSearchStatus.textContent = message;
}
function sortHomeSearchMatches(items, query) {
  const normalized = String(query || '').trim().toLowerCase();
  return [...items].sort((a, b) => {
    const aName = String(a.name || '').toLowerCase();
    const bName = String(b.name || '').toLowerCase();
    const aStarts = aName.startsWith(normalized) ? 1 : 0;
    const bStarts = bName.startsWith(normalized) ? 1 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;
    const aExact = aName === normalized ? 1 : 0;
    const bExact = bName === normalized ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;
    return aName.localeCompare(bName);
  });
}
async function fetchHomeSearchHistory() {
  try {
    const response = await fetch('/api/search-history?page=home', { cache: 'no-store' });
    if (!response.ok) throw new Error('history unavailable');
    const data = await response.json();
    const history = Array.isArray(data.history) ? data.history : [];
    writeLocalHomeSearchHistory(history);
    return history;
  } catch {
    return readLocalHomeSearchHistory();
  }
}
async function saveHomeSearchHistory(query, hits = 0) {
  const trimmed = String(query || '').trim();
  if (!trimmed) return homeSearchHistoryState;
  try {
    const response = await fetch('/api/search-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed, page: 'home', hits })
    });
    if (!response.ok) throw new Error('save failed');
    const data = await response.json();
    const history = Array.isArray(data.history) ? data.history : [];
    writeLocalHomeSearchHistory(history);
    return history;
  } catch {
    const now = new Date().toISOString();
    const current = readLocalHomeSearchHistory().filter((entry) => String(entry.query || '').toLowerCase() !== trimmed.toLowerCase());
    current.unshift({ id: `local-${Date.now()}`, query: trimmed, page: 'home', hits: Math.max(0, Math.floor(Number(hits) || 0)), createdAt: now, updatedAt: now });
    writeLocalHomeSearchHistory(current);
    return current;
  }
}
async function deleteHomeSearchHistoryEntry(id) {
  const targetId = String(id || '').trim();
  if (!targetId) return homeSearchHistoryState;
  try {
    const response = await fetch(`/api/search-history/${encodeURIComponent(targetId)}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('delete failed');
    const data = await response.json();
    const history = Array.isArray(data.history) ? data.history.filter((entry) => entry.page === 'home') : [];
    writeLocalHomeSearchHistory(history);
    return history;
  } catch {
    const next = readLocalHomeSearchHistory().filter((entry) => entry.id !== targetId);
    writeLocalHomeSearchHistory(next);
    return next;
  }
}
async function clearHomeSearchHistoryEntries() {
  try {
    const response = await fetch('/api/search-history?page=home', { method: 'DELETE' });
    if (!response.ok) throw new Error('clear failed');
    const data = await response.json();
    const history = Array.isArray(data.history) ? data.history.filter((entry) => entry.page === 'home') : [];
    writeLocalHomeSearchHistory(history);
    return history;
  } catch {
    writeLocalHomeSearchHistory([]);
    return [];
  }
}
function renderHomeSearchHistory(entries = []) {
  if (!homeSearchHistoryHost) return;
  if (!entries.length) {
    homeSearchHistoryHost.innerHTML = `<div class="home-search-history-empty">Belum ada histori pencarian. Hasil pencarian yang Anda jalankan di Home akan tersimpan di sini sampai dihapus permanen.</div>`;
    return;
  }
  homeSearchHistoryHost.innerHTML = entries.map((entry) => `
    <div class="home-search-chip" data-history-id="${escapeInlineHtml(entry.id || '')}">
      <button class="home-search-chip__open" type="button" data-history-open="${escapeInlineHtml(entry.id || '')}">
        <span class="home-search-chip__query">${escapeInlineHtml(entry.query || '')}</span>
      </button>
      <span class="home-search-chip__meta">${Math.max(0, Number(entry.hits) || 0)} hasil</span>
      <button class="home-search-chip__delete" type="button" aria-label="Hapus histori ${escapeInlineHtml(entry.query || '')}" data-history-delete="${escapeInlineHtml(entry.id || '')}">×</button>
    </div>`).join('');
}
function renderHomeSearchResults(items = [], query = '') {
  if (!homeSearchResults) return;
  const trimmed = String(query || '').trim();
  if (!trimmed) {
    homeSearchResults.innerHTML = `<div class="home-search-results__empty">Cari berdasarkan nama kartu video, nama lane, judul, atau kata kunci yang terkait dengan kartu. Hasil pencarian akan tampil penuh di sini.</div>`;
    return;
  }
  if (!items.length) {
    homeSearchResults.innerHTML = `<div class="home-search-results__empty">Belum ada kartu video yang cocok untuk <strong>${escapeInlineHtml(trimmed)}</strong>. Coba nama lain yang lebih dekat dengan judul kartu atau lane video.</div>`;
    return;
  }
  homeSearchResults.innerHTML = `
    <div class="home-search-results__head reveal in-view">
      <div>
        <div class="eyebrow">Search result</div>
        <h3>${items.length} kartu cocok untuk “${escapeInlineHtml(trimmed)}”.</h3>
      </div>
      <div class="meta-line">Riwayat pencarian membekas dan bisa dihapus permanen satu per satu atau sekaligus.</div>
    </div>
    <div class="home-search-grid">${items.map((item) => {
      const watchUrl = item.youtubeUrl || (item.videoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(item.videoId)}` : '');
      const embed = item.embedUrl || (item.videoId ? embedUrl(item.videoId) : '');
      const mediaMarkup = item.videoId
        ? renderInlineVideoShell({ videoId: item.videoId, embedUrl: embed, youtubeUrl: watchUrl, title: item.name, label: 'Play inline' })
        : `<div class="video-card__empty"><span>Belum ada video tersimpan.</span></div>`;
      return `
        <article class="home-search-card reveal in-view" data-item-id="${escapeInlineHtml(item.id || '')}">
          <div class="media-frame media-frame--catalog media-frame--thumb">${mediaMarkup}</div>
          <div class="home-search-card__body">
            <div class="home-search-card__top">
              <span class="home-search-card__category">${escapeInlineHtml(homeSearchCategoryLabel(item.category))}</span>
              <span class="pill">${item.isCustom ? 'Custom' : 'Saved'}</span>
            </div>
            <h4>${escapeInlineHtml(item.name || 'Video card')}</h4>
            <p>${escapeInlineHtml(item.description || item.searchQuery || 'Kartu video tersimpan permanen di katalog website.')}</p>
            <div class="home-search-card__actions">
              ${item.websiteUrl ? `<a class="ghost-button magnetic" href="${escapeInlineHtml(item.websiteUrl)}" target="_blank" rel="noreferrer">Buka Website</a>` : ''}
              ${watchUrl ? `<a class="button magnetic" href="${escapeInlineHtml(watchUrl)}" target="_blank" rel="noreferrer">Buka Video</a>` : ''}
              ${item.downloadUrl ? `<a class="ghost-button magnetic" href="${escapeInlineHtml(item.downloadUrl)}" target="_blank" rel="noreferrer" download>Download</a>` : ''}
            </div>
          </div>
        </article>`;
    }).join('')}</div>`;
  bindMagnetic();
  activateInlineVideoPlayers(homeSearchResults);
}
async function performHomeVideoSearch(query, options = {}) {
  const trimmed = String(query || '').trim();
  const persist = options.persist !== false;
  if (!trimmed) {
    localStorage.removeItem(HOME_SEARCH_LAST_QUERY_KEY);
    setHomeSearchStatus('Masukkan nama kartu video untuk mulai mencari.');
    renderHomeSearchResults([], '');
    return [];
  }
  const requestId = ++homeSearchRequestId;
  setHomeSearchStatus(`Mencari kartu video untuk “${trimmed}”…`);
  const registry = await loadDbRegistry();
  const matches = sortHomeSearchMatches((registry || []).filter((item) => !!item.videoId && [
    item.name,
    item.group,
    item.searchQuery,
    item.description || '',
    item.category || ''
  ].join(' ').toLowerCase().includes(trimmed.toLowerCase())), trimmed);
  if (requestId !== homeSearchRequestId) return matches;
  localStorage.setItem(HOME_SEARCH_LAST_QUERY_KEY, trimmed);
  renderHomeSearchResults(matches, trimmed);
  setHomeSearchStatus(`${matches.length} kartu video ditemukan untuk “${trimmed}”.`);
  if (persist) {
    homeSearchHistoryState = await saveHomeSearchHistory(trimmed, matches.length);
    renderHomeSearchHistory(homeSearchHistoryState);
  }
  return matches;
}
async function setupHomeVideoSearch() {
  if (!homeSearchForm || homeSearchForm.dataset.bound === '1') return;
  homeSearchForm.dataset.bound = '1';
  homeSearchHistoryState = await fetchHomeSearchHistory();
  renderHomeSearchHistory(homeSearchHistoryState);
  renderHomeSearchResults([], '');
  homeSearchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await performHomeVideoSearch(homeSearchInput?.value || '');
  });
  homeSearchResetButton?.addEventListener('click', () => {
    if (homeSearchInput) homeSearchInput.value = '';
    localStorage.removeItem(HOME_SEARCH_LAST_QUERY_KEY);
    setHomeSearchStatus('Pencarian direset. Anda bisa mencari kartu video lain kapan saja.');
    renderHomeSearchResults([], '');
  });
  homeSearchClearButton?.addEventListener('click', async () => {
    homeSearchHistoryState = await clearHomeSearchHistoryEntries();
    renderHomeSearchHistory(homeSearchHistoryState);
    setHomeSearchStatus('Semua histori pencarian telah dihapus permanen.');
  });
  homeSearchHistoryHost?.addEventListener('click', async (event) => {
    const openButton = event.target.closest('[data-history-open]');
    const deleteButton = event.target.closest('[data-history-delete]');
    if (openButton) {
      const id = openButton.getAttribute('data-history-open') || '';
      const entry = homeSearchHistoryState.find((item) => item.id === id);
      if (!entry) return;
      if (homeSearchInput) homeSearchInput.value = entry.query || '';
      await performHomeVideoSearch(entry.query || '');
      return;
    }
    if (deleteButton) {
      const id = deleteButton.getAttribute('data-history-delete') || '';
      homeSearchHistoryState = await deleteHomeSearchHistoryEntry(id);
      renderHomeSearchHistory(homeSearchHistoryState);
      setHomeSearchStatus('Satu histori pencarian dihapus permanen.');
    }
  });
  const lastQuery = localStorage.getItem(HOME_SEARCH_LAST_QUERY_KEY) || '';
  if (lastQuery && homeSearchInput) {
    homeSearchInput.value = lastQuery;
    await performHomeVideoSearch(lastQuery, { persist: false });
  }
}

const REGISTRY_DB_PATH = './db/items.json';
let persistenceMode = 'server';
let publicDbRegistry = null;

const REGISTRY_LOCAL_OVERRIDES_KEY = 'pulseboard-youtube-cards-overrides-v1';
function getRegistryLocalOverrides() {
  try {
    return JSON.parse(localStorage.getItem(REGISTRY_LOCAL_OVERRIDES_KEY) || '{}');
  } catch {
    return {};
  }
}
function shouldApplyRegistryOverride(item, override) {
  if (!override || typeof override !== 'object') return false;
  const itemUpdatedAt = Date.parse(item?.updatedAt || item?.createdAt || 0) || 0;
  const overrideUpdatedAt = Date.parse(override.updatedAt || 0) || 0;
  return !itemUpdatedAt || overrideUpdatedAt >= itemUpdatedAt;
}
function mergeRegistryItems(items) {
  const overrides = getRegistryLocalOverrides();
  return (Array.isArray(items) ? items : []).map((item) => {
    const override = overrides[item.id] || null;
    return shouldApplyRegistryOverride(item, override) ? { ...item, ...override } : item;
  });
}

async function loadDbRegistry(force = false) {
  if (publicDbRegistry && !force) return publicDbRegistry;
  if (force) publicDbRegistry = null;
  try {
    const response = await fetch('/api/items', { cache: 'no-store' });
    if (!response.ok) throw new Error('API not ready');
    const data = await response.json();
    publicDbRegistry = mergeRegistryItems(Array.isArray(data.items) ? data.items : []);
    persistenceMode = 'api';
    return publicDbRegistry;
  } catch {
    const response = await fetch(REGISTRY_DB_PATH, { cache: 'no-store' });
    if (!response.ok) {
      publicDbRegistry = [];
      persistenceMode = 'static';
      return publicDbRegistry;
    }
    const data = await response.json();
    publicDbRegistry = mergeRegistryItems(Array.isArray(data.items) ? data.items : []);
    persistenceMode = 'static';
    return publicDbRegistry;
  }
}

function slugifyItem(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categoryAlias(pageName) {
  const key = String(pageName || '').trim().toLowerCase();
  const aliases = {
    plants: 'tanaman',
    tanaman: 'tanaman',
    animals: 'hewan',
    binatang: 'hewan',
    hewan: 'hewan',
    tech: 'teknologi',
    teknologi: 'teknologi',
    portfolio: 'studio',
    studio: 'studio',
    world: 'world',
    home: 'home',
    news: 'news',
    commerce: 'commerce',
    azka: 'azka'
  };
  return aliases[key] || key;
}

function buildManagerLink(itemId = '') {
  const params = new URLSearchParams();
  const category = categoryAlias(page);
  if (category && category !== page) params.set('category', category);
  else if (['home', 'news', 'commerce', 'azka', 'world', 'studio', 'tanaman', 'hewan', 'teknologi'].includes(category)) params.set('category', category);
  if (itemId) params.set('item', itemId);
  return `manager.html${params.toString() ? `?${params.toString()}` : ''}`;
}

async function goToDeveloperEdit(itemId = '') {
  const token = await (window.PulseboardUI?.requestDeveloperToken?.({
    title: 'Developer Edit',
    subtitle: 'Masukkan admin token untuk membuka manager, mengganti video, dan menyimpan perubahan permanen.',
    submitText: 'Lanjut ke Developer Edit',
    validate: checkDeveloperAccess
  }) || '');
  if (!token) return;
  sessionStorage.setItem('pulseboard-admin-token', token);
  window.location.href = buildManagerLink(itemId);
}

function getItemRecordForEntry(pageName, itemName) {
  if (!publicDbRegistry) return null;
  const category = categoryAlias(pageName);
  const slug = slugifyItem(itemName);
  return publicDbRegistry.find((entry) => entry.category === category && slugifyItem(entry.name) === slug) || null;
}

function getStoredVideoForEntry(pageName, itemName) {
  const record = getItemRecordForEntry(pageName, itemName);
  if (!record || !record.videoId || !record.embedUrl) return null;
  return {
    name: record.name,
    youtubeUrl: record.youtubeUrl,
    videoId: record.videoId,
    embedUrl: record.embedUrl
  };
}

function bindCatalogEditors() {
  return;
}

async function checkDeveloperAccess(token) {
  const response = await fetch('/api/auth/check', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Developer token tidak valid.');
  }
  return true;
}

function setupDeveloperEditButton() {
  const button = document.querySelector('[data-dev-edit-button]');
  if (!button || button.dataset.devBound === '1') return;
  button.dataset.devBound = '1';
  button.addEventListener('click', async () => {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Checking…';
    try {
      await goToDeveloperEdit();
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}

function renderDocumentCatalog() {
  if (!pageCatalog || !videoHost || !mediaSection) return;
  mediaSection.querySelector('.media-showcase')?.remove();
  mediaSection.classList.add('catalog-section');
  videoHost.classList.add('video-grid--catalog');

  const category = categoryAlias(page);
  const registryItems = (publicDbRegistry || []).filter((item) => item.category === category && !item.isOpeningReel);
  const baseRegistry = registryItems.filter((item) => !item.isCustom);
  const customRegistry = registryItems.filter((item) => item.isCustom);
  const flattenedEntries = pageCatalog.flatMap((group) => group.entries);
  const entryRecordMap = new Map(flattenedEntries.map((entry, idx) => [entry.name, baseRegistry[idx] || null]));
  const total = flattenedEntries.length + customRegistry.length;

  bindText('[data-media-title]', 'Katalog video tersimpan.');
  bindText('[data-media-text]', `Setiap kelompok menampilkan kartu video rapi dalam 3 kolom. Total item dokumen: ${total}.`);
  const nav = ``;
  const groupsMarkup = pageCatalog.map((group, groupIndex) => {
    const cards = group.entries.map((entry) => {
      const itemRecord = entryRecordMap.get(entry.name) || getItemRecordForEntry(page, entry.name);
      const fallback = resolveCatalogVideo(page, group, entry, entry.no + groupIndex * 100);
      const hasStoredVideo = !!itemRecord?.videoId;
      const activeVideoId = hasStoredVideo ? itemRecord.videoId : fallback.id;
      const activeTitle = itemRecord?.name || entry.name;
      const searchQuery = itemRecord?.searchQuery || entry.name;
      const cardNo = String(entry.no).padStart(2, '0');
      const storageLabel = hasStoredVideo ? 'Tersimpan permanen' : 'Video referensi';
      const watchUrl = hasStoredVideo ? itemRecord.youtubeUrl : `https://www.youtube.com/watch?v=${encodeURIComponent(activeVideoId)}`;
      return `
        <article class="catalog-card reveal" data-item-id="${itemRecord?.id || ''}">
          <div class="media-frame media-frame--catalog media-frame--thumb" aria-label="Putar ${escapeInlineHtml(activeTitle)} di dalam halaman">
            ${renderInlineVideoShell({
              videoId: activeVideoId,
              embedUrl: hasStoredVideo ? itemRecord.embedUrl : embedUrl(activeVideoId),
              youtubeUrl: watchUrl,
              title: activeTitle,
              label: 'Play inline'
            })}
          </div>
          <div class="catalog-card__body">
            <div class="catalog-card__top">
              <span class="eyebrow">Item ${cardNo}</span>
              <span class="pill">${hasStoredVideo ? 'Saved' : fallback.tag}</span>
            </div>
            <h3>${escapeInlineHtml(activeTitle)}</h3>
            <div class="catalog-subtitle">${escapeInlineHtml(entry.secondary)}</div>
            <div class="catalog-meta">${escapeInlineHtml(entry.origin)}</div>
            <div class="catalog-meta">${storageLabel}: ${escapeInlineHtml(hasStoredVideo ? (itemRecord.name || activeTitle) : fallback.title)}</div>
            <p>${escapeInlineHtml(itemRecord?.description || entry.summary)}</p>
            <div class="catalog-actions">
              ${itemRecord?.websiteUrl ? `<a class="ghost-button magnetic" href="${escapeInlineHtml(itemRecord.websiteUrl)}" target="_blank" rel="noreferrer">Buka Website</a>` : ''}
              <a class="ghost-button magnetic" href="${watchUrl}" target="_blank" rel="noreferrer">Buka Video</a>
              ${itemRecord?.downloadUrl ? `<a class="ghost-button magnetic" href="${escapeInlineHtml(itemRecord.downloadUrl)}" target="_blank" rel="noreferrer" download>Download</a>` : ''}
            </div>
            <div class="catalog-note">${hasStoredVideo ? 'Play langsung di halaman ini.' : 'Video referensi tetap bisa diputar langsung dari halaman ini.'}</div>
          </div>
        </article>`;
    }).join('');
    return `
      <section class="catalog-group reveal" id="catalog-${page}-${groupIndex}">
        <div class="catalog-group__head">
          <div>
            <div class="eyebrow">Bagian ${group.section}</div>
            <h3>${group.label}</h3>
          </div>
          <div class="catalog-group__meta">
            <span class="pill">${group.entries.length} video</span>
            <span class="catalog-focus">${group.focus}</span>
          </div>
        </div>
        <div class="catalog-grid">${cards}</div>
      </section>`;
  }).join('');

  const customMarkup = customRegistry.length ? `
      <section class="catalog-group reveal" id="catalog-${page}-custom">
        <div class="catalog-group__head">
          <div>
            <div class="eyebrow">Tambahan developer</div>
            <h3>Kartu tambahan</h3>
          </div>
          <div class="catalog-group__meta">
            <span class="pill">${customRegistry.length} kartu</span>
            <span class="catalog-focus">Tambahan permanen dari Developer Edit</span>
          </div>
        </div>
        <div class="catalog-grid">${customRegistry.map((item) => {
          const hasStoredVideo = !!item.videoId;
          const watchUrl = hasStoredVideo ? (item.youtubeUrl || `https://www.youtube.com/watch?v=${encodeURIComponent(item.videoId)}`) : '';
          const mediaMarkup = hasStoredVideo
            ? renderInlineVideoShell({ videoId: item.videoId, embedUrl: item.embedUrl || embedUrl(item.videoId), youtubeUrl: watchUrl, title: item.name, label: 'Play inline' })
            : `<div class="catalog-empty"><span>Belum ada video tersimpan.</span></div>`;
          return `
            <article class="catalog-card reveal" data-item-id="${item.id}">
              <div class="media-frame media-frame--catalog media-frame--thumb" aria-label="Putar ${escapeInlineHtml(item.name)} di dalam halaman">${mediaMarkup}</div>
              <div class="catalog-card__body">
                <div class="catalog-card__top">
                  <span class="eyebrow">Custom card</span>
                  <span class="pill">${hasStoredVideo ? 'Saved' : 'Custom'}</span>
                </div>
                <h3>${escapeInlineHtml(item.name)}</h3>
                <p>${escapeInlineHtml(item.description || 'Kartu tambahan developer untuk katalog ini.')}</p>
                <div class="catalog-actions">
                  ${item.websiteUrl ? `<a class="ghost-button magnetic" href="${escapeInlineHtml(item.websiteUrl)}" target="_blank" rel="noreferrer">Buka Website</a>` : ''}
                  ${watchUrl ? `<a class="ghost-button magnetic" href="${watchUrl}" target="_blank" rel="noreferrer">Buka Video</a>` : ''}
                  ${item.downloadUrl ? `<a class="ghost-button magnetic" href="${escapeInlineHtml(item.downloadUrl)}" target="_blank" rel="noreferrer" download>Download</a>` : ''}
                </div>
                <div class="catalog-note">${hasStoredVideo ? 'Play langsung di halaman ini.' : 'Kartu custom aktif dan siap dipakai.'}</div>
              </div>
            </article>`;
        }).join('')}</div>
      </section>` : '';

  videoHost.innerHTML = nav + groupsMarkup + customMarkup;
  bindMagnetic();
  activateInlineVideoPlayers(videoHost);
  observeReveals();
}

function rerenderPageMediaFromRegistry() {
  if (pageCatalog) renderDocumentCatalog();
  else renderMediaRail();
}

async function refreshCatalogFromRegistry() {
  try {
    await loadDbRegistry(true);
    rerenderPageMediaFromRegistry();
  } catch {}
}

rerenderPageMediaFromRegistry();

loadDbRegistry().then(() => {
  rerenderPageMediaFromRegistry();
  setupHomeVideoSearch().catch(() => {});
}).catch(() => {
  setupHomeVideoSearch().catch(() => {});
});

const registryUpdateChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('pulseboard-registry') : null;
registryUpdateChannel?.addEventListener('message', (event) => {
  if (event?.data?.type === 'registry-updated') refreshCatalogFromRegistry();
});
window.addEventListener('storage', (event) => {
  if (event.key === 'pulseboard-registry-updated-at') refreshCatalogFromRegistry();
});
window.addEventListener('focus', () => {
  refreshCatalogFromRegistry();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') refreshCatalogFromRegistry();
});

const projectHost = document.querySelector("[data-case-grid]");
if (projectHost) {
  projectHost.innerHTML = sharedProjects.map((item, idx) => `
    <article class="case-card tilt-card reveal delay-${Math.min(idx,3)}">
      <div class="micro">${item.meta}</div>
      <h3>${item.name}</h3>
      <p>${item.copy}</p>
    </article>`).join("");
}

const toolsHost = document.querySelector("[data-tool-grid]");
if (toolsHost) {
  toolsHost.innerHTML = toolGroups.map((group, idx) => `
    <article class="tool-card tilt-card reveal delay-${Math.min(idx,3)}">
      <div class="eyebrow">${group.name}</div>
      <h3>${group.name} lane</h3>
      <p>${group.items.join(" · ")}</p>
    </article>`).join("");
}

const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
const loaderCount = document.getElementById("loaderCount");
const scrollProgress = document.getElementById("scrollProgress");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let ringX = cursorX;
let ringY = cursorY;

function runLoader() {
  if (!loader) return;
  if (!loaderBar || !loaderCount) {
    loader.classList.add("is-hidden");
    return;
  }
  let count = 0;
  const duration = 1200;
  const steps = 40;
  const increment = 100 / steps;
  const intervalTime = duration / steps;
  const timer = setInterval(() => {
    count += increment;
    const rounded = Math.min(100, Math.floor(count));
    loaderBar.style.width = `${rounded}%`;
    loaderCount.textContent = String(rounded).padStart(3, "0");
    if (rounded >= 100) {
      clearInterval(timer);
      setTimeout(() => loader.classList.add("is-hidden"), 180);
    }
  }, intervalTime);
}
function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}
observeReveals();
const statsObserver = ("IntersectionObserver" in window)
  ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1000;
      const start = performance.now();
      function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * ease);
        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      statsObserver?.unobserve(el);
    });
  }, { threshold: 0.4 })
  : null;
document.querySelectorAll("[data-target]").forEach((stat) => {
  if (statsObserver) statsObserver.observe(stat);
  else stat.textContent = stat.dataset.target || "0";
});

if (menuToggle && mobileMenu && menuToggle.dataset.menuBound !== "1") {
  const closeMenu = () => {
    mobileMenu.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };
  menuToggle.dataset.menuBound = "1";
  menuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const opened = mobileMenu.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", opened);
    menuToggle.setAttribute("aria-expanded", String(opened));
    mobileMenu.setAttribute("aria-hidden", String(!opened));
    document.body.classList.toggle("menu-open", opened);
  });
  mobileMenu.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", (event) => {
    if (!mobileMenu.classList.contains("is-open")) return;
    if (event.target === menuToggle || menuToggle.contains(event.target) || mobileMenu.contains(event.target)) return;
    closeMenu();
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

function animateCursor() {
  ringX += (cursorX - ringX) * 0.16;
  ringY += (cursorY - ringY) * 0.16;
  if (cursor && cursorRing) {
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
  }
  requestAnimationFrame(animateCursor);
}
window.addEventListener("mousemove", (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
  if (cursor && cursorRing) {
    cursor.style.opacity = "1";
    cursorRing.style.opacity = "1";
  }
});
function bindMagnetic() {
  document.querySelectorAll(".magnetic").forEach((item) => {
    if (item.dataset.magneticBound === "1") return;
    item.dataset.magneticBound = "1";
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });
}
function bindTilt() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    if (card.dataset.tiltBound === "1") return;
    card.dataset.tiltBound = "1";
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 8;
      const rotateX = (0.5 - py) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
bindMagnetic();
bindTilt();
window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();
runLoader();
animateCursor();

setupDeveloperEditButton();
import('./motion-flow.js').catch(() => {});
