import { DialogueNode, EvidenceCard, RedFlag } from '../types/game';

export const CASE_1_RED_FLAGS: RedFlag[] = [
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

export const CASE_1_EVIDENCE: EvidenceCard[] = [
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

export const CASE_1_DIALOGUES: Record<string, DialogueNode> = {
  intro_1: {
    id: 'intro_1',
    speaker: 'Ibu Budi',
    speakerRole: 'Ibu Rumah Tangga',
    text: 'Budi, ini ada chat dari kurir paket katanya paket Ibu tertahan di gudang. Ibu disuruh instal aplikasi ini buat liat fotonya. Beneran gak ya?',
    expression: 'worried',
    choices: [
      {
        id: 'c_inspect',
        label: 'Coba sini Budi periksa dulu HP Ibu...',
        type: 'inspect',
        actionPrompt: 'Periksa Layar Chat WA Ibu',
        triggerInspect: true,
      },
      {
        id: 'c_direct_warn',
        label: 'Tahan Bu! Jangan diinstal, itu modus APK palsu!',
        type: 'action',
        actionPrompt: 'Peringatkan Ibu Langsung',
        nextStepId: 'warn_without_evidence',
      },
      {
        id: 'c_risky',
        label: 'Buka aja Bu, mungkin itu paket kiriman yang ditunggu.',
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
    text: 'Tapi Budi, ini kurirnya bilang kalau gak dibuka sekarang paket Ibu mau dikembalikan ke pengirim. Kamu yakin ini palsu? Mana buktinya?',
    expression: 'worried',
    choices: [
      {
        id: 'c_inspect_from_warn',
        label: 'Biar Budi tunjukkan buktinya, sini HP-nya Bu.',
        type: 'inspect',
        actionPrompt: 'Inspeksi Chat WhatsApp',
        triggerInspect: true,
      },
    ],
  },
  post_inspect_success: {
    id: 'post_inspect_success',
    speaker: 'Budi (Kamu)',
    speakerRole: 'Detektif Siber Pemula',
    text: 'Lihat ini Bu! Budi sudah menemukan 3 kejanggalan fatal di pesan kurir ini. Biar Budi jelaskan buktinya...',
    expression: 'thinking',
    autoNext: 'debate_scene',
  },
  after_debate_success: {
    id: 'after_debate_success',
    speaker: 'Ibu Budi',
    speakerRole: 'Ibu Rumah Tangga',
    text: 'Ya ampun! Untung ada Budi! Hampir saja Ibu pencet. Terus sekarang HP Ibu diapakan biar aman dari penipu ini?',
    expression: 'relieved',
    choices: [
      {
        id: 'c_block_report',
        label: 'Blokir nomornya, laporkan ke Aduankonten Kominfo, dan cek resi asli di web resmi!',
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
    text: 'Selesai! Nomor sudah diblokir dan nomor resi paket asli ternyata aman sedang di jalan. Tabungan Ibu terselamatkan!',
    expression: 'relieved',
    autoNext: 'trigger_victory',
  },
};
