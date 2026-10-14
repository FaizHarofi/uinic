import {
  DialogueNode,
  EvidenceCard,
  RedFlag,
  InterrogationQuestion,
  BrowserToolResult,
  PinboardClue,
} from '../types/game';

// ==========================================
// CHAPTER 1: RESI PAKET MALWARE APK
// ==========================================
export const CHAPTER_1_RED_FLAGS: RedFlag[] = [
  {
    id: 'flag-ext',
    name: 'Ekstensi Ganda (.pdf.apk)',
    targetArea: 'Kotak File Lampiran',
    description: 'Nama file terlihat seperti dokumen PDF, namun berakhiran .apk!',
    explanation: 'Penipu menggunakan trik nama "Lihat_Foto_Paket.pdf.apk". Di Android, format .apk adalah file instalasi aplikasi! Ini bukan foto atau dokumen, melainkan malware pencuri SMS OTP.',
    isFound: false,
    points: 50,
  },
  {
    id: 'flag-urgency',
    name: 'Manipulasi Panik (Urgency Trap)',
    targetArea: 'Teks "Batas Waktu 10 Menit"',
    description: 'Pesan menakut-nakuti agar korban terburu-buru tanpa sempat berpikir rasional.',
    explanation: 'Kurir resmi tidak akan pernah mengancam memusnahkan atau membatalkan paket hanya dalam hitungan menit jika aplikasi tidak dipasang.',
    isFound: false,
    points: 40,
  },
  {
    id: 'flag-sender',
    name: 'Nomor Pengirim Palsu Tanpa Verifikasi',
    targetArea: 'Header Profil Kontak',
    description: 'Menggunakan nomor pribadi biasa tanpa centang hijau resmi (Official Business).',
    explanation: 'Ekspedisi resmi (JNE, J&T, SiCepat, Pos) selalu memiliki akun bisnis terverifikasi dengan centang hijau dan tidak mengirimkan file APK saat melacak paket.',
    isFound: false,
    points: 30,
  },
];

export const CHAPTER_1_EVIDENCE: EvidenceCard[] = [
  {
    id: 'ev-apk',
    title: 'File Penyamaran .APK (Sniffer RAT)',
    category: 'APK Sniffer',
    icon: 'FileWarning',
    shortDesc: 'Aplikasi Android berbahaya yang menyamar sebagai foto/resi.',
    detailedFact: 'Begitu diinstall, aplikasi ini meminta izin SMS (READ_SMS) untuk mencegat kode OTP perbankan dan membobol saldo tabungan.',
    isKeyEvidence: true,
  },
  {
    id: 'ev-social-eng',
    title: 'Taktik Urgensi Palsu',
    category: 'Social Engineering',
    icon: 'Hourglass',
    shortDesc: 'Menimbulkan kepanikan agar korban tidak mengecek kebenaran informasi.',
    detailedFact: 'Social Engineering mengeksploitasi emosi manusia (rasa takut, terburu-buru, atau rasa ingin tahu) dibanding meretas sistem keamanan secara langsung.',
  },
  {
    id: 'ev-official-channel',
    title: 'Standar Ekspedisi Resmi',
    category: 'Phishing',
    icon: 'ShieldCheck',
    shortDesc: 'Cek nomor resi HANYA melalui website/aplikasi resmi ekspedisi.',
    detailedFact: 'Ekspedisi resmi tidak pernah meminta pelanggan memasang file unduhan acak di WhatsApp untuk melihat status pengiriman barang.',
  },
];

export const CHAPTER_1_PINBOARD_CLUES: PinboardClue[] = [
  {
    id: 'pb-1-apk',
    title: 'File "Lihat_Foto_Paket.pdf.apk"',
    snippet: 'Format aplikasi Android berkamuflase dokumen dengan izin sadap READ_SMS.',
    targetCategory: 'malware',
    currentCategory: null,
    iconName: 'FileCode',
  },
  {
    id: 'pb-1-urgency',
    title: 'Ancaman "Hangus Dalam 10 Menit"',
    snippet: 'Manipulasi psikologis agar korban tergesa-gesa tanpa sempat berpikir jernih.',
    targetCategory: 'social_eng',
    currentCategory: null,
    iconName: 'Brain',
  },
  {
    id: 'pb-1-sender',
    title: 'Nomor Pribadi +62 895-xxxx',
    snippet: 'Akun WhatsApp personal tanpa lencana centang hijau resmi akun bisnis ekspedisi.',
    targetCategory: 'impersonation',
    currentCategory: null,
    iconName: 'UserX',
  },
];

export const CHAPTER_1_DIALOGUES: Record<string, DialogueNode> = {
  intro: {
    id: 'intro',
    speaker: 'Ibu Budi',
    speakerRole: 'Ibu Rumah Tangga',
    text: 'Budi, ini ada chat mendadak dari kurir paket! Katanya gamis pesanan Ibu yang sudah dibayar Rp 450.000 tertahan di gudang, dan Ibu disuruh instal aplikasi ini dalam 10 menit biar paketnya gak dibuang ke tempat sampah. Gimana ini nak, beneran gak ya?',
    expression: 'worried',
    choices: [
      {
        id: 'c_inspect',
        label: 'Tenang Bu, coba sini Budi periksa dulu chat dan filenya...',
        type: 'inspect',
        actionPrompt: 'Periksa Layar Chat WA Ibu',
        triggerSpecialMechanic: true,
      },
      {
        id: 'c_direct_warn',
        label: 'Tahan Bu! Jangan diinstal, itu pasti modus APK pencuri saldo!',
        type: 'action',
        actionPrompt: 'Peringatkan Ibu Langsung',
        nextStepId: 'warn_without_evidence',
      },
      {
        id: 'c_risky',
        label: 'Buka aja Bu, daripada paket gamisnya beneran hilang...',
        type: 'risky',
        actionPrompt: 'Suruh Ibu Buka File',
        triggerEmergency: true,
      },
    ],
  },
  warn_without_evidence: {
    id: 'warn_without_evidence',
    speaker: 'Ibu Budi',
    speakerRole: 'Ibu Rumah Tangga',
    text: 'Tapi Budi, ini kurirnya galak banget dan ngancam mau retur sekarang juga kalau gak dibuka. Ibu takut uang 450 ribu Ibu hangus! Kamu yakin ini bohong? Mana buktinya?',
    expression: 'worried',
    choices: [
      {
        id: 'c_inspect_from_warn',
        label: 'Biar Budi buktikan dengan fakta konkret, sini HP-nya Bu.',
        type: 'inspect',
        actionPrompt: 'Inspeksi Chat WhatsApp',
        triggerSpecialMechanic: true,
      },
    ],
  },
  post_inspect_success: {
    id: 'post_inspect_success',
    speaker: 'Budi (Kamu)',
    speakerRole: 'Detektif Siber Pemula',
    text: 'Budi sudah menemukan 3 kejanggalan fatal di pesan ini! Tapi sebelum Budi jelaskan ke Ibu, Budi ingin menyusun bukti-bukti ini di Papan Investigasi Detektif agar anatomi kejahatannya terlihat jelas!',
    expression: 'thinking',
    choices: [
      {
        id: 'c_open_pinboard',
        label: 'Buka Papan Investigasi Benang Merah (Drag & Drop)',
        type: 'action',
        actionPrompt: 'Susun Korelasi Bukti',
        triggerPinboard: true,
      },
    ],
  },
  post_pinboard_scene: {
    id: 'post_pinboard_scene',
    speaker: 'Budi (Kamu)',
    speakerRole: 'Detektif Siber Pemula',
    text: 'Sempurna! Semua bukti sudah terpetakan: file APK berbahaya, manipulasi rasa panik, dan nomor palsu penyamar. Sekarang saatnya menunjukkan kartu bukti terkuat kepada Ibu!',
    expression: 'thinking',
    autoNext: 'debate_scene',
  },
  after_debate_success: {
    id: 'after_debate_success',
    speaker: 'Ibu Budi',
    speakerRole: 'Ibu Rumah Tangga',
    text: 'Astagfirullah! Jadi itu bukan foto resi, tapi aplikasi yang mau menyadap SMS OTP m-Banking Ibu?! Ibu gemetaran mendengarnya... Untung Budi cepat memeriksa! Sekarang kita harus ngapain biar aman nak?',
    expression: 'relieved',
    choices: [
      {
        id: 'c_block_report',
        label: 'Blokir nomornya, laporkan ke Aduankonten Kominfo, lalu cek resi asli di website resmi ekspedisi!',
        type: 'action',
        actionPrompt: 'Lakukan Tindakan Preventif',
        nextStepId: 'case_resolution',
      },
    ],
  },
  case_resolution: {
    id: 'case_resolution',
    speaker: 'Budi (Kamu)',
    speakerRole: 'Detektif Siber Pemula',
    text: 'Budi sudah masukkan nomor resi paket asli Ibu di aplikasi resmi ekspedisi. Ternyata paket gamis Ibu sedang dibawa kurir asli dan statusnya aman! Nomor penipu tadi sudah resmi kita blokir dan laporkan. Tabungan keluarga aman!',
    expression: 'relieved',
    autoNext: 'trigger_victory',
  },
};

// ==========================================
// CHAPTER 2: CS BANK GADUNGAN & VISHING (VOICE PHISHING)
// ==========================================
export const CHAPTER_2_QUESTIONS: InterrogationQuestion[] = [
  {
    id: 'q_acc_num',
    question: 'Tolong sebutkan 4 digit terakhir nomor rekening saya yang katanya terbobol?',
    response: '"Eh... data bapak sedang kami enkripsi demi keamanan! Bapak sebutkan kode 6 angka OTP dulu baru datanya terbuka!"',
    isRevealing: true,
    explanation: 'BOHONG TERBONGKAR! Petugas bank resmi selalu memegang data nomor rekening nasabah di sistem mereka, bukan meminta OTP untuk membuka data!',
  },
  {
    id: 'q_otp_rule',
    question: 'Bukankah di SMS tertulis jelas: "JANGAN BERIKAN KODE INI KEPADA SIAPAPUN TERMASUK PIHAK BANK"?',
    response: '"Ini keadaan darurat Pak! Pengecualian khusus pembatalan sistem. Kalau bapak tidak kasih sekarang, uang 15 juta bapak langsung hangus!"',
    isRevealing: true,
    explanation: 'MANIPULASI TERBONGKAR! Tidak ada "pengecualian darurat" untuk pembagian OTP. Semua bank di Indonesia menegaskan bank tidak pernah meminta OTP.',
  },
  {
    id: 'q_callback',
    question: 'Saya akan tutup telepon ini dan menelepon balik ke Call Center resmi Bank di nomor 1500888.',
    response: '"JANGAN DITUTUP PAK! Kalau bapak tutup sekarang nomor tiket pembatalan bapak langsung hangus dan transaksi otomatis sah!"',
    isRevealing: true,
    explanation: 'TAKTIK PANIK TERBONGKAR! Penipu sangat takut panggilannya ditutup karena mereka tahu nomor resmi bank akan langsung membongkar kebohongan mereka.',
  },
];

export const CHAPTER_2_PINBOARD_CLUES: PinboardClue[] = [
  {
    id: 'pb-2-otp',
    title: 'Permintaan Paksa 6 Digit OTP',
    snippet: 'Mencoba mengambil alih sesi otorisasi transaksi m-Banking secara ilegal.',
    targetCategory: 'malware',
    currentCategory: null,
    iconName: 'FileCode',
  },
  {
    id: 'pb-2-urgency',
    title: 'Ancaman Saldo 15 Juta Terpotong',
    snippet: 'Menciptakan kepanikan akut agar korban menuruti perintah dalam hitungan detik.',
    targetCategory: 'social_eng',
    currentCategory: null,
    iconName: 'Brain',
  },
  {
    id: 'pb-2-caller',
    title: 'Nomor GSM +62 821-9988-xxxx',
    snippet: 'Mengaku CS HaloBCA namun menggunakan nomor seluler prabayar pribadi.',
    targetCategory: 'impersonation',
    currentCategory: null,
    iconName: 'UserX',
  },
];

export const CHAPTER_2_DIALOGUES: Record<string, DialogueNode> = {
  intro: {
    id: 'intro',
    speaker: 'Ayah Budi',
    speakerRole: 'Pensiunan / Ayah Budi',
    text: 'Budi! Ini gawat sekali! Ayah baru saja menerima telepon dari orang yang mengaku Customer Service HaloBCA. Suaranya tegas banget, katanya ada transaksi ilegal Rp 15 juta memotong rekening pensiun Ayah! Peneleponnya mendesak Ayah membacakan 6 digit kode OTP SMS yang baru masuk!',
    expression: 'worried',
    choices: [
      {
        id: 'c_intercept_call',
        label: 'Tahan Yah! Berikan HP-nya ke Budi, biar Budi yang introgasi CS gadungan ini!',
        type: 'inspect',
        actionPrompt: 'Ambil Alih Panggilan Telepon',
        triggerSpecialMechanic: true,
      },
      {
        id: 'c_tell_otp',
        label: 'Cepat sebutkan kodenya Yah, daripada uang tabungan 15 juta beneran hilang!',
        type: 'risky',
        actionPrompt: 'Suruh Ayah Berikan OTP',
        triggerEmergency: true,
      },
    ],
  },
  post_call_victory: {
    id: 'post_call_victory',
    speaker: 'Ayah Budi',
    speakerRole: 'Ayah Budi',
    text: 'Luar biasa Budi! Begitu kamu tanya nomor rekening dan kamu ancam mau telepon ke 1500888, suaranya langsung gelagapan dan menutup teleponnya sendiri. Tapi jantung Ayah masih deg-degan... bagaimana kamu bisa tahu dia penipu?',
    expression: 'relieved',
    choices: [
      {
        id: 'c_open_pinboard_ch2',
        label: 'Biar Ayah paham polanya, mari kita petakan modusnya di Papan Investigasi Detektif!',
        type: 'action',
        actionPrompt: 'Petakan Modus Vishing',
        triggerPinboard: true,
      },
    ],
  },
  post_pinboard_scene: {
    id: 'post_pinboard_scene',
    speaker: 'Budi (Kamu)',
    speakerRole: 'Detektif Siber Pemula',
    text: 'Lihat benang merahnya Yah: Penipu memanfaatkan rasa takut Ayah akan kehilangan uang, menyamar dengan nama HaloBCA lewat nomor HP GSM biasa, dan tujuan akhirnya hanya satu: mencuri kode OTP!',
    expression: 'thinking',
    choices: [
      {
        id: 'c_educate_ayah',
        label: 'Ingat Yah: Bank resmi TIDAK PERNAH meminta OTP, dan CS resmi selalu bernomor 5-7 digit (bukan +628xx)!',
        type: 'action',
        actionPrompt: 'Tuntaskan Edukasi Ayah',
        nextStepId: 'case_resolution_ch2',
      },
    ],
  },
  case_resolution_ch2: {
    id: 'case_resolution_ch2',
    speaker: 'Budi (Kamu)',
    speakerRole: 'Detektif Siber Pemula',
    text: 'Budi sudah cek mutasi rekening lewat aplikasi m-Banking resmi Ayah langsung dari perangkat ini. Saldo pensiun Rp 15 juta masih utuh dan aman! Panggilan tadi murni teknik Social Engineering Vishing (Voice Phishing).',
    expression: 'relieved',
    autoNext: 'trigger_victory',
  },
};

// ==========================================
// CHAPTER 3: FREELANCE LIKE VIDEO & KRIPTO BODONG (PIG BUTCHERING)
// ==========================================
export const CHAPTER_3_TOOLS: BrowserToolResult[] = [
  {
    toolId: 'whois',
    name: 'WHOIS & Domain Age Checker',
    title: 'Analisis Usia Domain: bursakriptonusantara-vip.xyz',
    status: 'danger',
    finding: 'Domain baru didaftarkan 3 hari yang lalu dengan ekstensi murah (.xyz).',
    detailedAnalysis: 'Platform investasi resmi tidak pernah menggunakan domain baru berumur hitungan hari dan ekstensi murah non-kredibel. Ini adalah ciri khas website phishing sementara yang akan ditutup setelah korban mentransfer uang.',
    isAnalyzed: false,
    points: 50,
  },
  {
    toolId: 'cekrekening',
    name: 'CekRekening.id Scanner',
    title: 'Laporan Rekening Bank Tujuan Deposit',
    status: 'danger',
    finding: 'Nomor Rekening 7720-xxxx-xxxx telah DILAPORKAN 42 KALI sebagai penipuan freelance!',
    detailedAnalysis: 'Portal resmi Komdigi mencatat nomor rekening penampung ini berstatus AWAS PENIPUAN dengan modus penahanan dana tugas like video dan arisan bodong.',
    isAnalyzed: false,
    points: 40,
  },
  {
    toolId: 'reverse_img',
    name: 'Reverse Image & Profile Checker',
    title: 'Verifikasi Foto "CEO & Pakar Kripto"',
    status: 'danger',
    finding: 'Foto profil ternyata gambar stok gratis dari Unsplash (Model foto kantoran).',
    detailedAnalysis: 'Profil "Dr. Hendra Wijaya" adalah identitas fiktif. Foto yang dipajang di web adalah foto stok bebas royalti dan namanya tidak terdaftar di Bappebti / Asosiasi Blockchain Indonesia.',
    isAnalyzed: false,
    points: 30,
  },
];

export const CHAPTER_3_PINBOARD_CLUES: PinboardClue[] = [
  {
    id: 'pb-3-web',
    title: 'Domain "bursakripto-vip.xyz" Usia 3 Hari',
    snippet: 'Situs bursa investasi palsu tanpa enkripsi dan tanpa izin Bappebti/OJK.',
    targetCategory: 'malware',
    currentCategory: null,
    iconName: 'FileCode',
  },
  {
    id: 'pb-3-ponzi',
    title: 'Umpan Rp 50.000 & Janji Profit 300%',
    snippet: 'Skema Pig Butchering: memberi keuntungan kecil di awal agar korban berani deposit jutaan.',
    targetCategory: 'social_eng',
    currentCategory: null,
    iconName: 'Brain',
  },
  {
    id: 'pb-3-rek',
    title: 'Rekening Dilaporkan 42 Kali & Foto Stok CEO',
    snippet: 'Data rekening penampung penipuan berulang dan profil founder fiktif dari Unsplash.',
    targetCategory: 'impersonation',
    currentCategory: null,
    iconName: 'UserX',
  },
];

export const CHAPTER_3_DIALOGUES: Record<string, DialogueNode> = {
  intro: {
    id: 'intro',
    speaker: 'Rian (Teman Kampus)',
    speakerRole: 'Mahasiswa / Sahabat Budi',
    text: 'Bud! Liat nih, gue bawa martabak! Gue baru nemu kerja freelance sampingan gampang banget. Cuma nonton & like 3 video YouTube kemarin dikirimi 50 ribu langsung cair ke e-wallet! Tapi hari ini ada "Tugas VIP": kita disuruh transfer deposit Rp 1 juta ke platform "BursaKriptoNusantara" biar dapat komisi 300% (jadi 3 juta!). Boleh gak gue pinjem sejuta tabungan lo? Nanti kita bagi dua untungnya!',
    expression: 'normal',
    choices: [
      {
        id: 'c_investigate_browser',
        label: 'Tunggu dulu Rian! Jangan tergiur! Sini biar Budi periksa website dan rekeningnya pakai Cyber Forensics di laptop!',
        type: 'inspect',
        actionPrompt: 'Buka Cyber Browser Sandbox',
        triggerSpecialMechanic: true,
      },
      {
        id: 'c_lend_money',
        label: 'Wah enak banget! Nih ambil sejuta tabungan gue, jangan lupa bagi dua hasilnya ya...',
        type: 'risky',
        actionPrompt: 'Pinjamkan Uang Deposit',
        triggerEmergency: true,
      },
    ],
  },
  post_browser_success: {
    id: 'post_browser_success',
    speaker: 'Rian (Teman Kampus)',
    speakerRole: 'Mahasiswa / Sahabat Budi',
    text: 'ASTAGA NAGA!! Domainnya baru dibuat 3 hari lalu, rekening tujuannya sudah dilaporkan 42 KALI sebagai penipu di CekRekening.id, dan foto CEO-nya comotan foto stok gratisan?! Gila Bud, kalau tadi lo gak tahan, melayang uang kuliah gue sejuta rupiah!',
    expression: 'shocked',
    choices: [
      {
        id: 'c_open_pinboard_ch3',
        label: 'Sini Rian, biar kamu gak kena jebakan serupa di masa depan, kita petakan anatomi scam ini di Papan Investigasi!',
        type: 'action',
        actionPrompt: 'Petakan Skema Pig Butchering',
        triggerPinboard: true,
      },
    ],
  },
  post_pinboard_scene: {
    id: 'post_pinboard_scene',
    speaker: 'Budi (Kamu)',
    speakerRole: 'Detektif Siber Pemula',
    text: 'Ini namanya modus Pig Butchering / Job Scam: Uang Rp 50 ribu pertama itu cuma umpan kecil agar korban percaya. Begitu korban deposit jutaan, penipu akan memblokir akun dan meminta transfer uang lagi dengan alasan pajak atau biaya pencairan!',
    expression: 'thinking',
    choices: [
      {
        id: 'c_explain_pig_butchering',
        label: 'Keluar dari grup Telegram itu sekarang, laporkan nomor adminnya, dan jangan pernah percaya investasi profit instan 300%!',
        type: 'action',
        actionPrompt: 'Tuntaskan Kasus 3',
        nextStepId: 'case_resolution_ch3',
      },
    ],
  },
  case_resolution_ch3: {
    id: 'case_resolution_ch3',
    speaker: 'Budi (Kamu)',
    speakerRole: 'Detektif Siber Pemula',
    text: 'Rian langsung memblokir semua kontak komplotan penipu tersebut dan melaporkan grupnya. Tabungan Rian aman dan martabak malam ini terasa jauh lebih nikmat! Ingat selalu: logika di atas keserakahan!',
    expression: 'relieved',
    autoNext: 'trigger_victory',
  },
};
