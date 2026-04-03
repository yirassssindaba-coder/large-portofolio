(() => {
  const LANGS = [
    { code: 'id', label: 'Indonesia' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'de', label: 'Deutsch' },
    { code: 'zh-CN', label: '中文' },
    { code: 'ko', label: '한국어' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'my', label: 'မြန်မာ' }
  ];
  const STORAGE_KEY = 'pulseboard-site-language';
  const PAGE_LANGUAGE = 'id';
  const PROFILE = {
    id: 'Lulusan A.Md.Kom di bidang Manajemen Informatika dengan sertifikasi serta fondasi yang kuat dalam IT, data, dan operasional digital. Didukung oleh persiapan akademik dan pengembangan keterampilan yang berkelanjutan, saya siap berkontribusi secara profesional, belajar dengan cepat, dan berkembang di lingkungan yang digerakkan oleh teknologi.',
    en: 'A.Md.Kom graduate in Informatics Management with certifications and a solid foundation in IT, data, and digital operations. Supported by academic preparation and continuous skills development, I am ready to contribute professionally, learn quickly, and grow in technology-driven environments.',
    ja: '情報学マネジメント分野のA.Md.Kom卒業者として、IT、データ、デジタル運用に関する確かな基礎と各種認定を備えています。学術的な準備と継続的なスキル向上に支えられ、私は専門的に貢献し、素早く学び、テクノロジー主導の環境で成長する準備ができています。',
    de: 'A.Md.Kom-Absolvent im Bereich Informatikmanagement mit Zertifizierungen und einer soliden Grundlage in IT, Daten und digitalen Abläufen. Gestützt auf akademische Vorbereitung und kontinuierliche Weiterentwicklung meiner Fähigkeiten bin ich bereit, professionell mitzuwirken, schnell zu lernen und in technologiegetriebenen Umgebungen zu wachsen.',
    'zh-CN': '作为信息管理专业的 A.Md.Kom 毕业生，我拥有相关认证，并在 IT、数据与数字化运营方面打下了扎实基础。在学术准备和持续技能提升的支持下，我已准备好以专业方式做出贡献、快速学习，并在技术驱动的环境中不断成长。',
    ko: '정보관리 전공 A.Md.Kom 졸업자로서, 저는 IT, 데이터, 디지털 운영 분야에 대한 탄탄한 기초와 관련 자격을 갖추고 있습니다. 학문적 준비와 지속적인 역량 개발을 바탕으로, 저는 전문적으로 기여하고 빠르게 배우며 기술 중심 환경에서 성장할 준비가 되어 있습니다.',
    hi: 'सूचना प्रबंधन में A.Md.Kom स्नातक होने के नाते, मेरे पास प्रमाणपत्रों के साथ आईटी, डेटा और डिजिटल संचालन की मजबूत आधारशिला है। शैक्षणिक तैयारी और निरंतर कौशल विकास के समर्थन से, मैं पेशेवर रूप से योगदान देने, जल्दी सीखने और तकनीक-प्रधान वातावरण में आगे बढ़ने के लिए तैयार हूँ।',
    my: 'Informatics Management ဘာသာရပ်မှ A.Md.Kom ဘွဲ့ရတစ်ဦးအနေဖြင့် IT၊ data နှင့် digital operations များတွင် ခိုင်မာသောအခြေခံနှင့် certification များကို ပိုင်ဆိုင်ထားပါသည်။ ပညာရေးဆိုင်ရာပြင်ဆင်မှုနှင့် ဆက်လက်ကျွမ်းကျင်မှုမြှင့်တင်မှုအပေါ် အခြေခံကာ ပရော်ဖက်ရှင်နယ်စွာ ပါဝင်ကူညီရန်၊ အလျင်အမြန်သင်ယူရန်နှင့် နည်းပညာဦးဆောင်သောပတ်ဝန်းကျင်များတွင် တိုးတက်ရန် အဆင်သင့်ဖြစ်နေပါသည်။'
  };
  const UI = {
    id: {
      devEdit: 'Developer Edit', postStudio: 'Post Studio', motionFlow: 'Motion Flow', liveOpening: 'Live opening reel',
      audioOn: 'Audio on', audioOff: 'Audio off',
      nav: { index: 'Home', world: 'World Atlas', tanaman: 'Green Atlas', binatang: 'Wild Echo', teknologi: 'Tech Forge', news: 'News Desk', commerce: 'E-Commerce', azka: 'Azka Garden', portfolio: 'Studio Deck', game: 'Farm World' },
      footer: { identity: 'Identity', direct: 'Direct contact', socials: 'Social channels', topcopy: 'Contact • Portfolio • Studio Flow', sub: 'One redesign, many moods.', identityText: 'Portal visual untuk proyek, video, post studio, developer flow, dan pengalaman showcase yang konsisten di seluruh halaman.', bottom: '©2026 PulseBoard Fusion • Portfolio, developer studio, Pulse Stories, dan media rail tersusun permanen untuk pengalaman yang lebih profesional.', email: 'Kirim Email', whatsapp: 'Chat WhatsApp' }
    },
    en: {
      devEdit: 'Developer Edit', postStudio: 'Post Studio', motionFlow: 'Motion Flow', liveOpening: 'Live opening reel',
      audioOn: 'Audio on', audioOff: 'Audio off',
      nav: { index: 'Home', world: 'World Atlas', tanaman: 'Green Atlas', binatang: 'Wild Echo', teknologi: 'Tech Forge', news: 'News Desk', commerce: 'E-Commerce', azka: 'Azka Garden', portfolio: 'Studio Deck', game: 'Farm World' },
      footer: { identity: 'Identity', direct: 'Direct contact', socials: 'Social channels', topcopy: 'Contact • Portfolio • Studio Flow', sub: 'One redesign, many moods.', identityText: 'A visual portal for projects, videos, post studio, developer flow, and a consistent showcase experience across the whole site.', bottom: '©2026 PulseBoard Fusion • Portfolio, developer studio, Pulse Stories, and media rails arranged permanently for a more professional experience.', email: 'Send Email', whatsapp: 'Chat WhatsApp' }
    },
    ja: {
      devEdit: '開発者編集', postStudio: '投稿スタジオ', motionFlow: 'モーションフロー', liveOpening: 'ライブオープニングリール',
      audioOn: '音声オン', audioOff: '音声オフ',
      nav: { index: 'ホーム', world: 'ワールドアトラス', tanaman: 'グリーンアトラス', binatang: 'ワイルドエコー', teknologi: 'テックフォージ', news: 'ニュースデスク', commerce: 'Eコマース', azka: 'アズカガーデン', portfolio: 'スタジオデッキ', game: 'ファームワールド' },
      footer: { identity: 'アイデンティティ', direct: '直接連絡', socials: 'ソーシャルチャンネル', topcopy: '連絡先 • ポートフォリオ • スタジオフロー', sub: 'ひとつの再設計、さまざまなムード。', identityText: 'プロジェクト、動画、投稿スタジオ、開発フロー、そしてサイト全体で一貫したショーケース体験のためのビジュアルポータル。', bottom: '©2026 PulseBoard Fusion • よりプロフェッショナルな体験のために、ポートフォリオ、開発者スタジオ、Pulse Stories、メディアレールを恒久的に構成。', email: 'メール送信', whatsapp: 'WhatsAppで連絡' }
    },
    de: {
      devEdit: 'Entwicklerbereich', postStudio: 'Post-Studio', motionFlow: 'Motion Flow', liveOpening: 'Live-Opening-Reel',
      audioOn: 'Audio an', audioOff: 'Audio aus',
      nav: { index: 'Start', world: 'Weltatlas', tanaman: 'Green Atlas', binatang: 'Wild Echo', teknologi: 'Tech Forge', news: 'News Desk', commerce: 'E-Commerce', azka: 'Azka Garden', portfolio: 'Studio Deck', game: 'Farm World' },
      footer: { identity: 'Identität', direct: 'Direkter Kontakt', socials: 'Soziale Kanäle', topcopy: 'Kontakt • Portfolio • Studio-Flow', sub: 'Ein Redesign, viele Stimmungen.', identityText: 'Ein visuelles Portal für Projekte, Videos, Post Studio, Entwickler-Workflow und ein konsistentes Showcase-Erlebnis auf der gesamten Website.', bottom: '©2026 PulseBoard Fusion • Portfolio, Entwicklerstudio, Pulse Stories und Medienleisten dauerhaft angeordnet für ein professionelleres Erlebnis.', email: 'E-Mail senden', whatsapp: 'WhatsApp-Chat' }
    },
    'zh-CN': {
      devEdit: '开发者编辑', postStudio: '帖子工作室', motionFlow: '动态流程', liveOpening: '实时开场片段',
      audioOn: '开启声音', audioOff: '关闭声音',
      nav: { index: '首页', world: '世界图谱', tanaman: '绿色图谱', binatang: '野境回响', teknologi: '科技锻炉', news: '新闻台', commerce: '电子商务', azka: 'Azka 花园', portfolio: '作品甲板', game: '农场世界' },
      footer: { identity: '身份', direct: '直接联系', socials: '社交频道', topcopy: '联系 • 作品集 • 工作流程', sub: '一次重构，多种氛围。', identityText: '面向项目、视频、帖子工作室、开发流程以及全站一致展示体验的视觉门户。', bottom: '©2026 PulseBoard Fusion • 作品集、开发者工作室、Pulse Stories 与媒体栏已永久编排，以提供更专业的体验。', email: '发送邮件', whatsapp: 'WhatsApp 联系' }
    },
    ko: {
      devEdit: '개발자 편집', postStudio: '포스트 스튜디오', motionFlow: '모션 플로우', liveOpening: '라이브 오프닝 릴',
      audioOn: '오디오 켜기', audioOff: '오디오 끄기',
      nav: { index: '홈', world: '월드 아틀라스', tanaman: '그린 아틀라스', binatang: '와일드 에코', teknologi: '테크 포지', news: '뉴스 데스크', commerce: '이커머스', azka: '아즈카 가든', portfolio: '스튜디오 덱', game: '팜 월드' },
      footer: { identity: '아이덴티티', direct: '직접 연락', socials: '소셜 채널', topcopy: '연락처 • 포트폴리오 • 스튜디오 플로우', sub: '하나의 리디자인, 다양한 무드.', identityText: '프로젝트, 비디오, 포스트 스튜디오, 개발자 흐름, 그리고 사이트 전반의 일관된 쇼케이스 경험을 위한 비주얼 포털입니다.', bottom: '©2026 PulseBoard Fusion • 더 전문적인 경험을 위해 포트폴리오, 개발자 스튜디오, Pulse Stories 및 미디어 레일이 영구적으로 구성되었습니다.', email: '이메일 보내기', whatsapp: 'WhatsApp 채팅' }
    },
    hi: {
      devEdit: 'डेवलपर एडिट', postStudio: 'पोस्ट स्टूडियो', motionFlow: 'मोशन फ्लो', liveOpening: 'लाइव ओपनिंग रील',
      audioOn: 'ऑडियो चालू', audioOff: 'ऑडियो बंद',
      nav: { index: 'होम', world: 'वर्ल्ड एटलस', tanaman: 'ग्रीन एटलस', binatang: 'वाइल्ड इको', teknologi: 'टेक फोर्ज', news: 'न्यूज़ डेस्क', commerce: 'ई-कॉमर्स', azka: 'अज़का गार्डन', portfolio: 'स्टूडियो डेक', game: 'फार्म वर्ल्ड' },
      footer: { identity: 'पहचान', direct: 'सीधा संपर्क', socials: 'सोशल चैनल', topcopy: 'संपर्क • पोर्टफोलियो • स्टूडियो फ्लो', sub: 'एक रीडिज़ाइन, कई मूड।', identityText: 'प्रोजेक्ट, वीडियो, पोस्ट स्टूडियो, डेवलपर फ्लो और पूरी वेबसाइट पर एक समान शोकेस अनुभव के लिए एक विज़ुअल पोर्टल।', bottom: '©2026 PulseBoard Fusion • अधिक पेशेवर अनुभव के लिए पोर्टफोलियो, डेवलपर स्टूडियो, पल्स स्टोरीज़ और मीडिया रेल स्थायी रूप से व्यवस्थित हैं।', email: 'ईमेल भेजें', whatsapp: 'WhatsApp चैट' }
    },
    my: {
      devEdit: 'Developer Edit', postStudio: 'Post Studio', motionFlow: 'Motion Flow', liveOpening: 'Live Opening Reel',
      audioOn: 'အသံဖွင့်ရန်', audioOff: 'အသံပိတ်ရန်',
      nav: { index: 'မူလစာမျက်နှာ', world: 'ကမ္ဘာ့အတ္တလပ်', tanaman: 'Green Atlas', binatang: 'Wild Echo', teknologi: 'Tech Forge', news: 'News Desk', commerce: 'E-Commerce', azka: 'Azka Garden', portfolio: 'Studio Deck', game: 'Farm World' },
      footer: { identity: 'အထောက်အထား', direct: 'တိုက်ရိုက်ဆက်သွယ်ရန်', socials: 'Social Channel များ', topcopy: 'ဆက်သွယ်ရန် • Portfolio • Studio Flow', sub: 'ပြန်လည်ဒီဇိုင်းတစ်ခု၊ အရသာမျိုးစုံ။', identityText: 'Project များ၊ video များ၊ post studio၊ developer flow နှင့် ဝဘ်ဆိုက်တစ်ခုလုံးတွင် တစ်ညီတစ်ညွတ်သော showcase အတွေ့အကြုံအတွက် visual portal တစ်ခု။', bottom: '©2026 PulseBoard Fusion • ပိုမိုပရော်ဖက်ရှင်နယ်သောအတွေ့အကြုံအတွက် portfolio၊ developer studio၊ Pulse Stories နှင့် media rail များကို အမြဲတမ်းစီစဉ်ထားပါသည်။', email: 'အီးမေးလ်ပို့ရန်', whatsapp: 'WhatsApp ချက်' }
    }
  };
  const EXACT = {
    en: {
      'Back Home': 'Back Home', 'Open Studio Deck': 'Open Studio Deck', 'Open Farm World': 'Open Farm World', 'Lihat Area Edit': 'Open Editor', 'Lihat Postingan': 'Open Posts', 'Jelajahi Home': 'Explore Home',
      'Open Book': 'Open Book', 'Next Page': 'Next Page', 'Previous Page': 'Previous Page', 'Close': 'Close', 'Unduh PDF': 'Download PDF',
      'Tambah Social Media': 'Add Social Media', 'Tambah Kartu': 'Add Card', 'Tambah Kartu Video': 'Add Video Card', 'Muat Ulang': 'Reload'
    },
    ja: {
      'Back Home': 'ホームへ戻る', 'Open Studio Deck': 'スタジオデッキを開く', 'Open Farm World': 'ファームワールドを開く', 'Lihat Area Edit': '編集エリアを見る', 'Lihat Postingan': '投稿を見る', 'Jelajahi Home': 'ホームを見る',
      'Open Book': '本を開く', 'Next Page': '次のページ', 'Previous Page': '前のページ', 'Close': '閉じる', 'Unduh PDF': 'PDFをダウンロード',
      'Tambah Social Media': 'SNSを追加', 'Tambah Kartu': 'カードを追加', 'Tambah Kartu Video': '動画カードを追加', 'Muat Ulang': '再読み込み'
    },
    de: {
      'Back Home': 'Zur Startseite', 'Open Studio Deck': 'Studio Deck öffnen', 'Open Farm World': 'Farm World öffnen', 'Lihat Area Edit': 'Editor öffnen', 'Lihat Postingan': 'Beiträge öffnen', 'Jelajahi Home': 'Home erkunden',
      'Open Book': 'Buch öffnen', 'Next Page': 'Nächste Seite', 'Previous Page': 'Vorherige Seite', 'Close': 'Schließen', 'Unduh PDF': 'PDF herunterladen',
      'Tambah Social Media': 'Social Media hinzufügen', 'Tambah Kartu': 'Karte hinzufügen', 'Tambah Kartu Video': 'Videokarte hinzufügen', 'Muat Ulang': 'Neu laden'
    },
    'zh-CN': {
      'Back Home': '返回首页', 'Open Studio Deck': '打开作品甲板', 'Open Farm World': '打开农场世界', 'Lihat Area Edit': '查看编辑区', 'Lihat Postingan': '查看帖子', 'Jelajahi Home': '浏览首页',
      'Open Book': '打开书籍', 'Next Page': '下一页', 'Previous Page': '上一页', 'Close': '关闭', 'Unduh PDF': '下载 PDF',
      'Tambah Social Media': '添加社交媒体', 'Tambah Kartu': '添加卡片', 'Tambah Kartu Video': '添加视频卡片', 'Muat Ulang': '重新加载'
    },
    ko: {
      'Back Home': '홈으로 돌아가기', 'Open Studio Deck': '스튜디오 덱 열기', 'Open Farm World': '팜 월드 열기', 'Lihat Area Edit': '편집 영역 보기', 'Lihat Postingan': '게시물 보기', 'Jelajahi Home': '홈 둘러보기',
      'Open Book': '책 열기', 'Next Page': '다음 페이지', 'Previous Page': '이전 페이지', 'Close': '닫기', 'Unduh PDF': 'PDF 다운로드',
      'Tambah Social Media': '소셜 미디어 추가', 'Tambah Kartu': '카드 추가', 'Tambah Kartu Video': '비디오 카드 추가', 'Muat Ulang': '새로고침'
    },
    hi: {
      'Back Home': 'होम पर वापस', 'Open Studio Deck': 'स्टूडियो डेक खोलें', 'Open Farm World': 'फार्म वर्ल्ड खोलें', 'Lihat Area Edit': 'एडिट क्षेत्र देखें', 'Lihat Postingan': 'पोस्ट देखें', 'Jelajahi Home': 'होम देखें',
      'Open Book': 'बुक खोलें', 'Next Page': 'अगला पृष्ठ', 'Previous Page': 'पिछला पृष्ठ', 'Close': 'बंद करें', 'Unduh PDF': 'PDF डाउनलोड करें',
      'Tambah Social Media': 'सोशल मीडिया जोड़ें', 'Tambah Kartu': 'कार्ड जोड़ें', 'Tambah Kartu Video': 'वीडियो कार्ड जोड़ें', 'Muat Ulang': 'रीलोड करें'
    },
    my: {
      'Back Home': 'မူလသို့ ပြန်သွားရန်', 'Open Studio Deck': 'Studio Deck ဖွင့်ရန်', 'Open Farm World': 'Farm World ဖွင့်ရန်', 'Lihat Area Edit': 'တည်းဖြတ်ဧရိယာကို ကြည့်ရန်', 'Lihat Postingan': 'Post များကို ကြည့်ရန်', 'Jelajahi Home': 'ပင်မကို လေ့လာရန်',
      'Open Book': 'စာအုပ်ဖွင့်ရန်', 'Next Page': 'နောက်စာမျက်နှာ', 'Previous Page': 'ယခင်စာမျက်နှာ', 'Close': 'ပိတ်ရန်', 'Unduh PDF': 'PDF ဒေါင်းလုဒ်',
      'Tambah Social Media': 'Social Media ထည့်ရန်', 'Tambah Kartu': 'ကတ်ထည့်ရန်', 'Tambah Kartu Video': 'Video ကတ်ထည့်ရန်', 'Muat Ulang': 'ပြန်ဖွင့်ရန်'
    }
  };


  const EXTRA_EXACT = {
    en: {
      'Section A': 'Section A',
      'Section B': 'Section B',
      'Section C': 'Section C',
      'Section D': 'Section D',
      'Section E': 'Section E',
      'Randomized YouTube Stories.': 'Randomized YouTube Stories.',
      'Randomized YouTube stage.': 'Randomized YouTube stage.',
      'The homepage combines plants, animals, tech, and portfolio into a stage embed that changes on load.': 'The homepage combines plants, animals, tech, and portfolio into a stage embed that changes on load.',
      'Creative Deck': 'Creative Deck',
      'Additional presentation layers for visual work and case studies.': 'Additional presentation layers for visual work and case studies.',
      'Future systems': 'Future systems',
      'A modern technological feel to give character to Tech Forge.': 'A modern technological feel to give character to Tech Forge.',
      'Wild terrain': 'Wild terrain',
      'The wildlife and landscapes add to the energy of Wild Echo.': 'The wildlife and landscapes add to the energy of Wild Echo.',
      'Open Video': 'Open Video',
      'PLAY INLINE': 'PLAY INLINE',
      'Showcase lanes.': 'Showcase lanes.',
      'Pulse Stories.': 'Pulse Stories.',
      'Feed postingan published dari Post Studio untuk ringkasan update proyek, rollout katalog, dan catatan developer.': 'Published posts from Post Studio for concise project updates, catalog rollout summaries, and developer notes.',
      'Built for motion.': 'Built for motion.',
      'Loader, reveal, tilt, magnetic hover, dan rail YouTube acak membuat halaman terasa aktif setiap kali dibuka.': 'Loader, reveal, tilt, magnetic hover, and randomized YouTube rails make the page feel active every time it opens.',
      'Main Portal': 'Main Portal',
      'Active layers': 'Active layers',
      'No build step · Run locally · Reload changes the video rail': 'No build step · Run locally · Reload changes the video rail',
      'Halaman ini tetap terasa seperti satu sistem utuh: editorial, dinamis, gelap, modern, dengan interaksi halus dan panggung media yang aktif.': 'This page still feels like one complete system: editorial, dynamic, dark, modern, with subtle interactions and an active media stage.',
      'One redesign, many moods.': 'One redesign, many moods.'
    },
    ja: {
      'Section A': 'セクション A',
      'Section B': 'セクション B',
      'Section C': 'セクション C',
      'Section D': 'セクション D',
      'Section E': 'セクション E',
      'Randomized YouTube Stories.': 'ランダム化された YouTube ストーリーズ。',
      'Randomized YouTube stage.': 'ランダム化された YouTube ステージ。',
      'The homepage combines plants, animals, tech, and portfolio into a stage embed that changes on load.': 'ホームページは植物、動物、テクノロジー、ポートフォリオを、読み込み時に変化するステージ型埋め込みへ統合します。',
      'Creative Deck': 'クリエイティブデッキ',
      'Additional presentation layers for visual work and case studies.': 'ビジュアル作品とケーススタディのための追加プレゼンテーションレイヤー。',
      'Future systems': '未来のシステム',
      'A modern technological feel to give character to Tech Forge.': 'Tech Forge に個性を与える、モダンでテクノロジカルな雰囲気。',
      'Wild terrain': 'ワイルドテレイン',
      'The wildlife and landscapes add to the energy of Wild Echo.': '野生動物と風景が Wild Echo のエネルギーを高めます。',
      'Open Video': '動画を開く',
      'PLAY INLINE': 'ページ内再生',
      'Showcase lanes.': 'ショーケースレーン。',
      'Pulse Stories.': 'パルスストーリーズ。',
      'Feed postingan published dari Post Studio untuk ringkasan update proyek, rollout katalog, dan catatan developer.': 'Post Studio から公開された投稿フィード。プロジェクト更新、カタログ展開、開発者メモの要約です。',
      'Built for motion.': 'モーションのために構築。',
      'Loader, reveal, tilt, magnetic hover, dan rail YouTube acak membuat halaman terasa aktif setiap kali dibuka.': 'ローダー、リビール、チルト、マグネティックホバー、ランダムな YouTube レールが、ページを開くたびにアクティブな印象を与えます。',
      'Main Portal': 'メインポータル',
      'Active layers': 'アクティブレイヤー',
      'No build step · Run locally · Reload changes the video rail': 'ビルド不要 · ローカル実行 · 再読み込みで動画レールが変化',
      'Halaman ini tetap terasa seperti satu sistem utuh: editorial, dinamis, gelap, modern, dengan interaksi halus dan panggung media yang aktif.': 'このページは、編集的で動きがあり、ダークでモダン、繊細なインタラクションとアクティブなメディアステージを備えた、ひとつの完成したシステムとして感じられます。',
      'One redesign, many moods.': 'ひとつの再設計、さまざまなムード。'
    },
    de: {
      'Section A': 'Abschnitt A',
      'Section B': 'Abschnitt B',
      'Section C': 'Abschnitt C',
      'Section D': 'Abschnitt D',
      'Section E': 'Abschnitt E',
      'Randomized YouTube Stories.': 'Zufällige YouTube-Storys.',
      'Randomized YouTube stage.': 'Zufällige YouTube-Bühne.',
      'The homepage combines plants, animals, tech, and portfolio into a stage embed that changes on load.': 'Die Startseite kombiniert Pflanzen, Tiere, Technologie und Portfolio zu einer eingebetteten Bühne, die sich beim Laden verändert.',
      'Creative Deck': 'Kreativ-Deck',
      'Additional presentation layers for visual work and case studies.': 'Zusätzliche Präsentationsebenen für visuelle Arbeiten und Fallstudien.',
      'Future systems': 'Zukunftssysteme',
      'A modern technological feel to give character to Tech Forge.': 'Ein modernes technologisches Gefühl, das Tech Forge mehr Charakter gibt.',
      'Wild terrain': 'Wilde Landschaft',
      'The wildlife and landscapes add to the energy of Wild Echo.': 'Die Tierwelt und Landschaften verstärken die Energie von Wild Echo.',
      'Open Video': 'Video öffnen',
      'PLAY INLINE': 'IM FENSTER ABSPIELEN',
      'Showcase lanes.': 'Showcase-Bahnen.',
      'Pulse Stories.': 'Pulse Stories.',
      'Feed postingan published dari Post Studio untuk ringkasan update proyek, rollout katalog, dan catatan developer.': 'Veröffentlichter Feed aus dem Post-Studio für kompakte Projektupdates, Katalog-Rollouts und Entwicklernotizen.',
      'Built for motion.': 'Für Bewegung gebaut.',
      'Loader, reveal, tilt, magnetic hover, dan rail YouTube acak membuat halaman terasa aktif setiap kali dibuka.': 'Loader, Reveal, Tilt, magnetischer Hover und zufällige YouTube-Leisten sorgen dafür, dass die Seite bei jedem Öffnen aktiv wirkt.',
      'Main Portal': 'Hauptportal',
      'Active layers': 'Aktive Ebenen',
      'No build step · Run locally · Reload changes the video rail': 'Kein Build-Schritt · Lokal ausführen · Neuladen ändert die Video-Leiste',
      'Halaman ini tetap terasa seperti satu sistem utuh: editorial, dinamis, gelap, modern, dengan interaksi halus dan panggung media yang aktif.': 'Diese Seite wirkt weiterhin wie ein geschlossenes System: editorial, dynamisch, dunkel, modern, mit feinen Interaktionen und einer aktiven Medienbühne.',
      'One redesign, many moods.': 'Ein Redesign, viele Stimmungen.'
    },
    'zh-CN': {
      'Section A': '部分 A',
      'Section B': '部分 B',
      'Section C': '部分 C',
      'Section D': '部分 D',
      'Section E': '部分 E',
      'Randomized YouTube Stories.': '随机 YouTube 故事。',
      'Randomized YouTube stage.': '随机 YouTube 舞台。',
      'The homepage combines plants, animals, tech, and portfolio into a stage embed that changes on load.': '首页将植物、动物、科技与作品集组合成一个会在加载时变化的嵌入式舞台。',
      'Creative Deck': '创意展示',
      'Additional presentation layers for visual work and case studies.': '为视觉作品和案例研究增加更多展示层次。',
      'Future systems': '未来系统',
      'A modern technological feel to give character to Tech Forge.': '以现代科技感为 Tech Forge 注入鲜明个性。',
      'Wild terrain': '荒野地形',
      'The wildlife and landscapes add to the energy of Wild Echo.': '野生动物与地貌为 Wild Echo 增添更多能量。',
      'Open Video': '打开视频',
      'PLAY INLINE': '页内播放',
      'Showcase lanes.': '展示通道。',
      'Pulse Stories.': 'Pulse Stories。',
      'Feed postingan published dari Post Studio untuk ringkasan update proyek, rollout katalog, dan catatan developer.': '来自 Post Studio 的已发布动态，用于展示项目更新、目录上线摘要和开发者笔记。',
      'Built for motion.': '为动态而生。',
      'Loader, reveal, tilt, magnetic hover, dan rail YouTube acak membuat halaman terasa aktif setiap kali dibuka.': '加载器、显现动画、倾斜效果、磁性悬停与随机 YouTube 轨道，让页面每次打开时都充满活力。',
      'Main Portal': '主门户',
      'Active layers': '活动层',
      'No build step · Run locally · Reload changes the video rail': '无需构建 · 本地运行 · 刷新可更换视频轨道',
      'Halaman ini tetap terasa seperti satu sistem utuh: editorial, dinamis, gelap, modern, dengan interaksi halus dan panggung media yang aktif.': '此页面依然像一个完整系统：编辑感、动态、深色、现代，并带有细腻交互与活跃媒体舞台。',
      'One redesign, many moods.': '一次重构，多种氛围。'
    },
    ko: {
      'Section A': '섹션 A',
      'Section B': '섹션 B',
      'Section C': '섹션 C',
      'Section D': '섹션 D',
      'Section E': '섹션 E',
      'Randomized YouTube Stories.': '랜덤 YouTube 스토리.',
      'Randomized YouTube stage.': '랜덤 YouTube 스테이지.',
      'The homepage combines plants, animals, tech, and portfolio into a stage embed that changes on load.': '홈페이지는 식물, 동물, 기술, 포트폴리오를 로드할 때마다 달라지는 스테이지 임베드로 결합합니다.',
      'Creative Deck': '크리에이티브 덱',
      'Additional presentation layers for visual work and case studies.': '비주얼 작업과 케이스 스터디를 위한 추가 프레젠테이션 레이어입니다.',
      'Future systems': '미래 시스템',
      'A modern technological feel to give character to Tech Forge.': 'Tech Forge에 개성을 더하는 현대적이고 기술적인 분위기입니다.',
      'Wild terrain': '야생 지형',
      'The wildlife and landscapes add to the energy of Wild Echo.': '야생동물과 풍경이 Wild Echo의 에너지를 더해 줍니다.',
      'Open Video': '비디오 열기',
      'PLAY INLINE': '인라인 재생',
      'Showcase lanes.': '쇼케이스 레인.',
      'Pulse Stories.': 'Pulse Stories.',
      'Feed postingan published dari Post Studio untuk ringkasan update proyek, rollout katalog, dan catatan developer.': 'Post Studio에서 발행된 피드로, 프로젝트 업데이트, 카탈로그 롤아웃, 개발자 메모를 간단히 보여줍니다.',
      'Built for motion.': '움직임을 위해 설계.',
      'Loader, reveal, tilt, magnetic hover, dan rail YouTube acak membuat halaman terasa aktif setiap kali dibuka.': '로더, 리빌, 틸트, 마그네틱 호버, 랜덤 YouTube 레일이 페이지를 열 때마다 더 역동적으로 보이게 합니다.',
      'Main Portal': '메인 포털',
      'Active layers': '활성 레이어',
      'No build step · Run locally · Reload changes the video rail': '빌드 단계 없음 · 로컬 실행 · 새로고침 시 비디오 레일 변경',
      'Halaman ini tetap terasa seperti satu sistem utuh: editorial, dinamis, gelap, modern, dengan interaksi halus dan panggung media yang aktif.': '이 페이지는 여전히 하나의 완성된 시스템처럼 느껴집니다. 에디토리얼하고, 역동적이며, 다크하고 현대적이고, 섬세한 상호작용과 활발한 미디어 스테이지를 갖추고 있습니다.',
      'One redesign, many moods.': '하나의 리디자인, 다양한 무드.'
    },
    hi: {
      'Section A': 'सेक्शन A',
      'Section B': 'सेक्शन B',
      'Section C': 'सेक्शन C',
      'Section D': 'सेक्शन D',
      'Section E': 'सेक्शन E',
      'Randomized YouTube Stories.': 'रैंडमाइज़्ड YouTube स्टोरीज़।',
      'Randomized YouTube stage.': 'रैंडमाइज़्ड YouTube स्टेज।',
      'The homepage combines plants, animals, tech, and portfolio into a stage embed that changes on load.': 'होमपेज पौधों, जानवरों, टेक और पोर्टफोलियो को एक ऐसे स्टेज एम्बेड में जोड़ता है जो लोड होने पर बदलता है।',
      'Creative Deck': 'क्रिएटिव डेक',
      'Additional presentation layers for visual work and case studies.': 'विज़ुअल कार्य और केस स्टडी के लिए अतिरिक्त प्रस्तुति परतें।',
      'Future systems': 'भविष्य प्रणालियाँ',
      'A modern technological feel to give character to Tech Forge.': 'Tech Forge को चरित्र देने वाला आधुनिक तकनीकी अहसास।',
      'Wild terrain': 'जंगली भू-दृश्य',
      'The wildlife and landscapes add to the energy of Wild Echo.': 'वन्यजीव और परिदृश्य Wild Echo की ऊर्जा को बढ़ाते हैं।',
      'Open Video': 'वीडियो खोलें',
      'PLAY INLINE': 'यहीं चलाएँ',
      'Showcase lanes.': 'शोकेस लेन।',
      'Pulse Stories.': 'पल्स स्टोरीज़।',
      'Feed postingan published dari Post Studio untuk ringkasan update proyek, rollout katalog, dan catatan developer.': 'Post Studio से प्रकाशित पोस्ट फ़ीड, परियोजना अपडेट, कैटलॉग रोलआउट और डेवलपर नोट्स के संक्षेप के लिए।',
      'Built for motion.': 'गतिशीलता के लिए निर्मित।',
      'Loader, reveal, tilt, magnetic hover, dan rail YouTube acak membuat halaman terasa aktif setiap kali dibuka.': 'लोडर, रिवील, टिल्ट, मैग्नेटिक होवर और रैंडम YouTube रेल हर बार खुलने पर पेज को सक्रिय महसूस कराते हैं।',
      'Main Portal': 'मुख्य पोर्टल',
      'Active layers': 'सक्रिय लेयर',
      'No build step · Run locally · Reload changes the video rail': 'कोई बिल्ड स्टेप नहीं · लोकल चलाएँ · रीलोड करने पर वीडियो रेल बदलती है',
      'Halaman ini tetap terasa seperti satu sistem utuh: editorial, dinamis, gelap, modern, dengan interaksi halus dan panggung media yang aktif.': 'यह पेज अब भी एक पूर्ण प्रणाली जैसा महसूस होता है: संपादकीय, गतिशील, गहरा, आधुनिक, सूक्ष्म इंटरैक्शन और सक्रिय मीडिया स्टेज के साथ।',
      'One redesign, many moods.': 'एक रीडिज़ाइन, कई मूड।'
    },
    my: {
      'Section A': 'အပိုင်း A',
      'Section B': 'အပိုင်း B',
      'Section C': 'အပိုင်း C',
      'Section D': 'အပိုင်း D',
      'Section E': 'အပိုင်း E',
      'Randomized YouTube Stories.': 'ကျပန်း YouTube ဇာတ်လမ်းများ။',
      'Randomized YouTube stage.': 'ကျပန်း YouTube စတိတ်ချ်။',
      'The homepage combines plants, animals, tech, and portfolio into a stage embed that changes on load.': 'ပင်မစာမျက်နှာသည် plants, animals, tech နှင့် portfolio တို့ကို load လုပ်တိုင်းပြောင်းလဲသည့် stage embed တစ်ခုအဖြစ် ပေါင်းစည်းထားသည်။',
      'Creative Deck': 'Creative Deck',
      'Additional presentation layers for visual work and case studies.': 'visual work နှင့် case studies များအတွက် presentation layer များ ထပ်မံထည့်သွင်းထားသည်။',
      'Future systems': 'အနာဂတ်စနစ်များ',
      'A modern technological feel to give character to Tech Forge.': 'Tech Forge ကို ပိုမိုထင်ရှားစေသော နည်းပညာဆန်သည့် အကဲဖြတ်လက္ခဏာ။',
      'Wild terrain': 'တောရိုင်းမြေမျက်နှာသွင်ပြင်',
      'The wildlife and landscapes add to the energy of Wild Echo.': 'တောရိုင်းတိရစ္ဆာန်များနှင့် ရှုခင်းများက Wild Echo ၏ စွမ်းအားကို မြှင့်တင်ပေးသည်။',
      'Open Video': 'ဗီဒီယိုဖွင့်ရန်',
      'PLAY INLINE': 'စာမျက်နှာပေါ်တွင် ဖွင့်ရန်',
      'Showcase lanes.': 'ပြသမှုလမ်းကြောင်းများ။',
      'Pulse Stories.': 'Pulse Stories။',
      'Feed postingan published dari Post Studio untuk ringkasan update proyek, rollout katalog, dan catatan developer.': 'Post Studio မှ ထုတ်ဝေထားသော feed ဖြစ်ပြီး project update များ၊ katalog rollout နှင့် developer မှတ်စုများကို အကျဉ်းချုပ်ဖော်ပြသည်။',
      'Built for motion.': 'လှုပ်ရှားမှုအတွက် တည်ဆောက်ထားသည်။',
      'Loader, reveal, tilt, magnetic hover, dan rail YouTube acak membuat halaman terasa aktif setiap kali dibuka.': 'Loader, reveal, tilt, magnetic hover နှင့် ကျပန်း YouTube rail များက စာမျက်နှာကို ဖွင့်တိုင်း ပိုမိုအသက်ဝင်စေသည်။',
      'Main Portal': 'အဓိက ပေါ်တယ်',
      'Active layers': 'အသက်ဝင်နေသော လွှာများ',
      'No build step · Run locally · Reload changes the video rail': 'build step မလို · local တွင် run လုပ်နိုင် · reload လုပ်လျှင် video rail ပြောင်းလဲသည်',
      'Halaman ini tetap terasa seperti satu sistem utuh: editorial, dinamis, gelap, modern, dengan interaksi halus dan panggung media yang aktif.': 'ဤစာမျက်နှာသည် editorial, dynamic, dark, modern ဖြစ်ပြီး နူးညံ့သိမ်မွေ့သော interaction များနှင့် active media stage တို့ပါဝင်သည့် စနစ်တစ်ခုလုံးအဖြစ် ဆက်လက်ခံစားရစေသည်။',
      'One redesign, many moods.': 'ဒီဇိုင်းပြန်လည်ပြင်ဆင်မှုတစ်ခု၊ အရသာမျိုးစုံ။'
    }
  };

  const FLEX_EXACT = {
    en: {
      'Section Search': 'Section Search',
      'Search video cards.': 'Search video cards.',
      'Cari kartu video berdasarkan nama yang diinginkan, lihat hasilnya langsung di halaman Home, lalu simpan jejak pencarian agar tetap membekas sampai dihapus permanen dari histori.': 'Find video cards by the name you want, see the results instantly on Home, and keep the search trail saved until you permanently remove it from history.',
      'Nama kartu video': 'Video card name',
      'Cari kartu': 'Search card',
      'Reset': 'Reset',
      'Masukkan nama kartu video untuk mulai mencari.': 'Enter a video card name to start searching.',
      'Search history': 'Search history',
      'Riwayat pencarian permanen.': 'Persistent search history.',
      'Hapus semua histori': 'Delete all history',
      'Masukkan kata kunci pencarian.': 'Enter a search keyword.',
      'Buka video': 'Open video',
      'Buka website': 'Open website',
      'Unduh file': 'Download file',
      'Tidak ada hasil yang cocok.': 'No matching results.',
      'Ditemukan': 'Found',
      'hasil': 'results',
      'Masukkan nama kartu video untuk mulai mencari.': 'Enter a video card name to begin searching.'
    },
    ja: {
      'Section Search': '検索セクション',
      'Search video cards.': '動画カードを検索。',
      'Cari kartu video berdasarkan nama yang diinginkan, lihat hasilnya langsung di halaman Home, lalu simpan jejak pencarian agar tetap membekas sampai dihapus permanen dari histori.': '希望する名前で動画カードを検索し、ホームで結果をすぐ確認できます。検索履歴は保存され、履歴から完全に削除するまで残ります。',
      'Nama kartu video': '動画カード名',
      'Cari kartu': 'カードを検索',
      'Reset': 'リセット',
      'Masukkan nama kartu video untuk mulai mencari.': '検索を開始するには動画カード名を入力してください。',
      'Search history': '検索履歴',
      'Riwayat pencarian permanen.': '保存される検索履歴。',
      'Hapus semua histori': '履歴をすべて削除',
      'Masukkan kata kunci pencarian.': '検索キーワードを入力してください。',
      'Buka video': '動画を開く',
      'Buka website': 'サイトを開く',
      'Unduh file': 'ファイルをダウンロード',
      'Tidak ada hasil yang cocok.': '一致する結果はありません。',
      'Ditemukan': '見つかりました',
      'hasil': '件',
      'Masukkan nama kartu video untuk mulai mencari.': '動画カード名を入力して検索を開始してください。'
    },
    de: {
      'Section Search': 'Suchbereich',
      'Search video cards.': 'Videokarten suchen.',
      'Cari kartu video berdasarkan nama yang diinginkan, lihat hasilnya langsung di halaman Home, lalu simpan jejak pencarian agar tetap membekas sampai dihapus permanen dari histori.': 'Suche Videokarten nach dem gewünschten Namen, sieh die Ergebnisse direkt auf der Startseite und speichere die Suchspur, bis sie dauerhaft aus dem Verlauf gelöscht wird.',
      'Nama kartu video': 'Name der Videokarte',
      'Cari kartu': 'Karte suchen',
      'Reset': 'Zurücksetzen',
      'Masukkan nama kartu video untuk mulai mencari.': 'Gib einen Namen für die Videokarte ein, um die Suche zu starten.',
      'Search history': 'Suchverlauf',
      'Riwayat pencarian permanen.': 'Permanenter Suchverlauf.',
      'Hapus semua histori': 'Gesamten Verlauf löschen',
      'Masukkan kata kunci pencarian.': 'Gib ein Suchwort ein.',
      'Buka video': 'Video öffnen',
      'Buka website': 'Website öffnen',
      'Unduh file': 'Datei herunterladen',
      'Tidak ada hasil yang cocok.': 'Keine passenden Ergebnisse.',
      'Ditemukan': 'Gefunden',
      'hasil': 'Ergebnisse',
      'Masukkan nama kartu video untuk mulai mencari.': 'Gib einen Videokartennamen ein, um die Suche zu starten.'
    },
    'zh-CN': {
      'Section Search': '搜索部分',
      'Search video cards.': '搜索视频卡片。',
      'Cari kartu video berdasarkan nama yang diinginkan, lihat hasilnya langsung di halaman Home, lalu simpan jejak pencarian agar tetap membekas sampai dihapus permanen dari histori.': '按想要的名称搜索视频卡片，在首页立即查看结果，并保留搜索记录，直到你在历史中将其永久删除。',
      'Nama kartu video': '视频卡片名称',
      'Cari kartu': '搜索卡片',
      'Reset': '重置',
      'Masukkan nama kartu video untuk mulai mencari.': '输入视频卡片名称以开始搜索。',
      'Search history': '搜索历史',
      'Riwayat pencarian permanen.': '持久搜索历史。',
      'Hapus semua histori': '清除全部历史',
      'Masukkan kata kunci pencarian.': '请输入搜索关键词。',
      'Buka video': '打开视频',
      'Buka website': '打开网站',
      'Unduh file': '下载文件',
      'Tidak ada hasil yang cocok.': '没有匹配结果。',
      'Ditemukan': '已找到',
      'hasil': '结果',
      'Masukkan nama kartu video untuk mulai mencari.': '输入视频卡片名称开始搜索。'
    },
    ko: {
      'Section Search': '검색 섹션',
      'Search video cards.': '비디오 카드 검색.',
      'Cari kartu video berdasarkan nama yang diinginkan, lihat hasilnya langsung di halaman Home, lalu simpan jejak pencarian agar tetap membekas sampai dihapus permanen dari histori.': '원하는 이름으로 비디오 카드를 검색하고, 홈에서 바로 결과를 확인하며, 검색 기록은 기록에서 영구 삭제할 때까지 보존됩니다.',
      'Nama kartu video': '비디오 카드 이름',
      'Cari kartu': '카드 검색',
      'Reset': '초기화',
      'Masukkan nama kartu video untuk mulai mencari.': '검색을 시작하려면 비디오 카드 이름을 입력하세요.',
      'Search history': '검색 기록',
      'Riwayat pencarian permanen.': '영구 검색 기록.',
      'Hapus semua histori': '전체 기록 삭제',
      'Masukkan kata kunci pencarian.': '검색어를 입력하세요.',
      'Buka video': '비디오 열기',
      'Buka website': '웹사이트 열기',
      'Unduh file': '파일 다운로드',
      'Tidak ada hasil yang cocok.': '일치하는 결과가 없습니다.',
      'Ditemukan': '검색됨',
      'hasil': '결과',
      'Masukkan nama kartu video untuk mulai mencari.': '비디오 카드 이름을 입력해 검색을 시작하세요.'
    },
    hi: {
      'Section Search': 'खोज अनुभाग',
      'Search video cards.': 'वीडियो कार्ड खोजें।',
      'Cari kartu video berdasarkan nama yang diinginkan, lihat hasilnya langsung di halaman Home, lalu simpan jejak pencarian agar tetap membekas sampai dihapus permanen dari histori.': 'मनचाहे नाम से वीडियो कार्ड खोजें, होम पेज पर तुरंत परिणाम देखें, और खोज इतिहास को तब तक सहेजें जब तक आप उसे इतिहास से स्थायी रूप से न हटा दें।',
      'Nama kartu video': 'वीडियो कार्ड का नाम',
      'Cari kartu': 'कार्ड खोजें',
      'Reset': 'रीसेट',
      'Masukkan nama kartu video untuk mulai mencari.': 'खोज शुरू करने के लिए वीडियो कार्ड का नाम दर्ज करें।',
      'Search history': 'खोज इतिहास',
      'Riwayat pencarian permanen.': 'स्थायी खोज इतिहास।',
      'Hapus semua histori': 'सारा इतिहास हटाएँ',
      'Masukkan kata kunci pencarian.': 'खोज कीवर्ड दर्ज करें।',
      'Buka video': 'वीडियो खोलें',
      'Buka website': 'वेबसाइट खोलें',
      'Unduh file': 'फ़ाइल डाउनलोड करें',
      'Tidak ada hasil yang cocok.': 'कोई मेल खाने वाला परिणाम नहीं मिला।',
      'Ditemukan': 'मिले',
      'hasil': 'परिणाम',
      'Masukkan nama kartu video untuk mulai mencari.': 'खोज शुरू करने के लिए वीडियो कार्ड का नाम लिखें।'
    },
    my: {
      'Section Search': 'ရှာဖွေရေးအပိုင်း',
      'Search video cards.': 'ဗီဒီယိုကတ်များကို ရှာဖွေရန်။',
      'Cari kartu video berdasarkan nama yang diinginkan, lihat hasilnya langsung di halaman Home, lalu simpan jejak pencarian agar tetap membekas sampai dihapus permanen dari histori.': 'လိုချင်သောအမည်ဖြင့် video card များကို ရှာဖွေပြီး Home စာမျက်နှာတွင် ရလဒ်ကို ချက်ချင်းကြည့်နိုင်သည်။ ရှာဖွေရေးမှတ်တမ်းသည် history မှ အပြီးတိုင်ဖျက်သည်အထိ သိမ်းဆည်းထားမည်။',
      'Nama kartu video': 'ဗီဒီယိုကတ် အမည်',
      'Cari kartu': 'ကတ်ကိုရှာရန်',
      'Reset': 'ပြန်လည်သတ်မှတ်ရန်',
      'Masukkan nama kartu video untuk mulai mencari.': 'ရှာဖွေရန် စတင်ရန် ဗီဒီယိုကတ်အမည်ကို ထည့်ပါ။',
      'Search history': 'ရှာဖွေရေးမှတ်တမ်း',
      'Riwayat pencarian permanen.': 'အမြဲတမ်းသိမ်းထားသော ရှာဖွေရေးမှတ်တမ်း။',
      'Hapus semua histori': 'မှတ်တမ်းအားလုံး ဖျက်ရန်',
      'Masukkan kata kunci pencarian.': 'ရှာဖွေရေး စကားလုံးကို ထည့်ပါ။',
      'Buka video': 'ဗီဒီယိုဖွင့်ရန်',
      'Buka website': 'ဝဘ်ဆိုက်ဖွင့်ရန်',
      'Unduh file': 'ဖိုင်ဒေါင်းလုဒ်',
      'Tidak ada hasil yang cocok.': 'ကိုက်ညီသော ရလဒ်မတွေ့ပါ။',
      'Ditemukan': 'တွေ့ရှိသည်',
      'hasil': 'ရလဒ်',
      'Masukkan nama kartu video untuk mulai mencari.': 'ရှာဖွေမှုစတင်ရန် video card အမည်ကို ရိုက်ထည့်ပါ။'
    }
  };

  const ORIGINAL_TEXT = new WeakMap();
  let isApplyingTranslation = false;
  let translationObserver = null;
  let translationTick = null;

  function phraseMapFor(lang) {
    return { ...(EXACT[lang] || {}), ...(EXTRA_EXACT[lang] || {}), ...(FLEX_EXACT[lang] || {}) };
  }

  function getLang() {
    try {
      const url = new URL(window.location.href);
      const queryLang = url.searchParams.get('lang');
      if (queryLang && LANGS.some((item) => item.code === queryLang)) return queryLang;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGS.some((item) => item.code === saved)) return saved;
    } catch {}
    return 'id';
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }


  function currentUi() {
    const lang = getLang();
    return UI[lang] || UI.en;
  }

  function labelFor(code) {
    const match = LANGS.find((item) => item.code === code);
    return match ? match.label : code;
  }

  function shouldSkipI18nElement(parent) {
    if (!parent) return true;
    if (parent.closest('.goog-te-banner-frame, .goog-te-menu-frame, #google_translate_element, .skiptranslate')) return true;
    const tag = parent.tagName;
    return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'CODE' || tag === 'PRE';
  }

  function originalAttrKey(attr) {
    return `i18nOriginal${attr.replace(/(^|-)([a-z])/g, (_m, _a, ch) => ch.toUpperCase())}`;
  }

  function rememberOriginalTree(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (shouldSkipI18nElement(parent)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node, node.nodeValue);
    }
    root.querySelectorAll?.('[placeholder],[title],[aria-label],[value]').forEach((el) => {
      ['placeholder', 'title', 'aria-label', 'value'].forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        const key = originalAttrKey(attr);
        if (!el.dataset[key]) el.dataset[key] = el.getAttribute(attr) || '';
      });
    });
  }

  function translateFromSource(source, map) {
    if (!source) return source;
    const trimmed = source.trim();
    if (trimmed && map[trimmed]) return source.replace(trimmed, map[trimmed]);
    let out = source;
    const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);
    for (const [needle, translated] of entries) {
      if (!needle || !translated || needle === translated) continue;
      if (out.includes(needle)) out = out.split(needle).join(translated);
    }
    return out;
  }

  function applyAttrTranslations(root, map) {
    root.querySelectorAll?.('[placeholder],[title],[aria-label],[value]').forEach((el) => {
      ['placeholder', 'title', 'aria-label', 'value'].forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        const key = originalAttrKey(attr);
        const source = el.dataset[key] || el.getAttribute(attr) || '';
        if (!el.dataset[key]) el.dataset[key] = source;
        const translated = translateFromSource(source, map);
        if (translated !== el.getAttribute(attr)) el.setAttribute(attr, translated);
      });
    });
  }

  function applyExactTranslations(lang, root = document.body) {
    const exact = phraseMapFor(lang);
    if (!root) return;
    rememberOriginalTree(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (shouldSkipI18nElement(parent)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const source = ORIGINAL_TEXT.get(node) || node.nodeValue;
      if (!ORIGINAL_TEXT.has(node)) ORIGINAL_TEXT.set(node, source);
      const translated = lang === PAGE_LANGUAGE ? source : translateFromSource(source, exact);
      if (translated !== node.nodeValue) node.nodeValue = translated;
    });
    applyAttrTranslations(root, exact);
  }

  function applyLocalChrome(lang) {
    isApplyingTranslation = true;
    const ui = UI[lang] || UI.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-profile-summary]').forEach((el) => {
      el.textContent = PROFILE[lang] || PROFILE.en;
    });
    const introText = document.querySelector('[data-intro-text]');
    if (introText && document.body?.dataset?.page === 'home') introText.textContent = PROFILE[lang] || PROFILE.en;

    document.querySelectorAll('.nav a, .game-nav a, .mobile-menu a').forEach((link) => {
      const href = (link.getAttribute('href') || '').split('?')[0];
      const key = href.replace('.html', '') || 'index';
      if (ui.nav[key]) link.textContent = ui.nav[key];
    });

    document.querySelectorAll('[data-dev-edit-button]').forEach((el) => { el.textContent = ui.devEdit; });
    document.querySelectorAll('.header-tools a[href="posts.html"]').forEach((el) => { el.textContent = ui.postStudio; });
    document.querySelectorAll('#motionFlowButton').forEach((el) => { el.textContent = ui.motionFlow; });

    document.querySelectorAll('.cinematic-intro__badge').forEach((el) => { el.textContent = ui.liveOpening; });
    document.querySelectorAll('[data-intro-audio-toggle]').forEach((el) => {
      const muted = el.dataset.muted !== '0';
      el.textContent = muted ? ui.audioOff : ui.audioOn;
    });

    const footer = document.querySelector('.universal-footer');
    if (footer) {
      const labels = footer.querySelectorAll('.universal-footer__label');
      if (labels[0]) labels[0].textContent = ui.footer.identity;
      if (labels[1]) labels[1].textContent = ui.footer.direct;
      if (labels[2]) labels[2].textContent = ui.footer.socials;
      const topcopy = footer.querySelector('.universal-footer__topcopy');
      if (topcopy) topcopy.textContent = ui.footer.topcopy;
      const sub = footer.querySelector('.universal-footer__sub');
      if (sub) sub.textContent = ui.footer.sub;
      const values = footer.querySelectorAll('.universal-footer__value');
      if (values[0]) values[0].textContent = ui.footer.identityText;
      const ctas = footer.querySelectorAll('.universal-footer__cta');
      if (ctas[0]) ctas[0].textContent = ui.footer.email;
      if (ctas[1]) ctas[1].textContent = ui.footer.whatsapp;
      const bottom = footer.querySelector('.universal-footer__bottom');
      if (bottom) bottom.textContent = ui.footer.bottom;
    }

    document.querySelectorAll('.site-language-switcher select, .site-language-mobile select').forEach((select) => {
      if (select.value !== lang) select.value = lang;
      select.setAttribute('aria-label', `Language ${labelFor(lang)}`);
    });

    applyExactTranslations(lang);
    isApplyingTranslation = false;
  }

  function ensureSelectors() {
    const lang = getLang();
    const selectMarkup = `<label class="site-language-switcher" aria-label="Language selector"><span class="site-language-switcher__label">Lang</span><select>${LANGS.map((item) => `<option value="${item.code}">${item.label}</option>`).join('')}</select></label>`;
    document.querySelectorAll('.header-tools, .game-actions').forEach((host) => {
      if (!host || host.querySelector('.site-language-switcher')) return;
      host.insertAdjacentHTML('afterbegin', selectMarkup);
    });
    document.querySelectorAll('.mobile-menu').forEach((menu) => {
      if (!menu || menu.querySelector('.site-language-mobile')) return;
      menu.insertAdjacentHTML('afterbegin', `<div class="site-language-mobile"><label>Language<select>${LANGS.map((item) => `<option value="${item.code}">${item.label}</option>`).join('')}</select></label></div>`);
    });
    document.querySelectorAll('.site-language-switcher select, .site-language-mobile select').forEach((select) => {
      select.value = lang;
      select.addEventListener('change', (event) => {
        const next = event.target.value;
        setLang(next);
        applyLocalChrome(next);
        scheduleTranslationRefresh();
      });
    });
  }

  function scheduleTranslationRefresh() {
    if (translationTick) window.clearTimeout(translationTick);
    translationTick = window.setTimeout(() => {
      translationTick = null;
      const lang = getLang();
      applyLocalChrome(lang);
    }, 180);
  }

  function startTranslationObserver() {
    if (translationObserver || !document.body) return;
    translationObserver = new MutationObserver((mutations) => {
      if (isApplyingTranslation) return;
      const relevant = mutations.some((mutation) => {
        const target = mutation.target?.nodeType === 3 ? mutation.target.parentElement : mutation.target;
        if (shouldSkipI18nElement(target?.nodeType === 1 ? target : target?.parentElement)) return false;
        if (mutation.type === 'attributes') return true;
        if (mutation.addedNodes?.length) return Array.from(mutation.addedNodes).some((node) => {
          if (node.nodeType === 3) return Boolean(node.nodeValue?.trim());
          if (node.nodeType !== 1) return false;
          return !shouldSkipI18nElement(node);
        });
        return mutation.type === 'characterData';
      });
      if (relevant) scheduleTranslationRefresh();
    });
    translationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'value']
    });
  }

  function injectStyle() {
    if (document.getElementById('site-i18n-style')) return;
    const style = document.createElement('style');
    style.id = 'site-i18n-style';
    style.textContent = `
      .site-language-switcher,.site-language-mobile label{display:inline-flex;align-items:center;gap:10px}
      .site-language-switcher{position:relative;min-height:48px;padding:0 16px;border-radius:999px;border:1px solid rgba(var(--accent-rgb),.28);background:linear-gradient(180deg, rgba(14,18,24,.92), rgba(10,12,16,.78));backdrop-filter:blur(20px);color:var(--text);box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 12px 32px rgba(0,0,0,.26);transition:border-color .2s ease,transform .2s ease,box-shadow .2s ease}
      .site-language-switcher:hover{transform:translateY(-1px);border-color:rgba(var(--accent-rgb),.48);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 18px 34px rgba(0,0,0,.3)}
      .site-language-switcher__label{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(var(--accent-rgb),.92)}
      .site-language-switcher select,.site-language-mobile select{appearance:none;background:rgba(0,0,0,.001);border:0;outline:none;color:inherit;font:inherit;min-width:126px;cursor:pointer;color-scheme:dark}
      .site-language-switcher select option,.site-language-mobile select option{background:#10151c;color:#f3ebdf}
      .site-language-mobile{padding:14px 18px 6px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:8px}
      .site-language-mobile label{width:100%;justify-content:space-between;color:var(--text)}
      .hero__summary{margin:4px 0 12px;max-width:68ch;color:rgba(244,237,226,.86);line-height:1.78;font-size:clamp(.94rem,1.1vw,1.04rem)}
      .hero__copy h1,.cinematic-intro__content h1,.section-head h2{background:linear-gradient(180deg,#fff1db 0%,#edd8bb 54%,#cdb497 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none}
      .panel,.footer-box,.video-card,.catalog-card,.info-card,.split-card,.tool-card,.case-card,.media-card,.media-stage{background:linear-gradient(180deg, rgba(255,255,255,.052), rgba(255,255,255,.026));border-color:rgba(255,246,232,.16)}
      .section-head p,.panel p,.catalog-card p,.catalog-meta,.catalog-focus,.media-stage__body p,.video-card__meta p,.hero__copy p{color:rgba(244,237,226,.84)}
      .section-head,.panel{position:relative;overflow:hidden}
      .section-head::after,.panel::after{content:'';position:absolute;right:-8%;top:-14%;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle, rgba(var(--accent-rgb),.08), transparent 72%);pointer-events:none}
      .catalog-card,.video-card{backdrop-filter:blur(12px)}
      .goog-te-banner-frame.skiptranslate{display:none !important}
      body{top:0 !important}
      #google_translate_element,.goog-logo-link,.goog-te-gadget span{display:none !important}
      .skiptranslate iframe{visibility:hidden !important}
    `;
    document.head.appendChild(style);
  }

  function boot() {
    injectStyle();
    const syncChrome = () => {
      const lang = getLang();
      ensureSelectors();
      applyLocalChrome(lang);
    };
    syncChrome();
    startTranslationObserver();
    [400, 1200, 2200, 3600].forEach((delay) => window.setTimeout(syncChrome, delay));
    window.addEventListener('load', () => {
      syncChrome();
    }, { once: true });
  }

  window.PulseboardI18n = {
    getLanguage: getLang,
    setLanguage(lang) {
      if (!LANGS.some((item) => item.code === lang)) return;
      setLang(lang);
      applyLocalChrome(lang);
      scheduleTranslationRefresh();
    },
    translateLabel(key) {
      const ui = currentUi();
      return ui[key] || key;
    },
    profileSummary() {
      return PROFILE[getLang()] || PROFILE.en;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
