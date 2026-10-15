# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Utama:** pelajar/mahasiswa Indonesia yang belajar literasi digital, baik di situasi kompetisi, di kelas, maupun mengakses sendiri.
- **Lain (dikonfirmasi):** masyarakat umum termasuk keluarga dan lansia pengguna smartphone, serta juri dan peserta kompetisi inovasi digital yang menilai produk.
- Pemain berperan sebagai detektif digital yang memeriksa pesan mencurigakan, menemukan petunjuk, dan mengambil keputusan aman dalam skenario penipuan daring fiktif.

## Product Purpose

AWAS SCAM! adalah game edukasi web berbahasa Indonesia tentang mengenali penipuan digital dan mengambil keputusan yang lebih aman. Produk menyajikan skenario investigasi fiktif yang interaktif, menggabungkan literasi digital, storytelling detektif, dan pembelajaran berbasis pilihan. Sukses berarti pemain menyelesaikan kasus, mengenali red flag, dan keluar dengan pemahaman yang lebih baik — serta produk siap didemokan di kompetisi dengan mulus.

## Positioning

Mekanisme yang membedakan: tiga kasus fiktif dengan **mekanisme interaktif berbeda per kasus** (spot-the-red-flags pada chat, call simulator dengan OTP shield, forensik browser sandbox), bukan kuis pilihan ganda. Kejahatan siber diajarkan lewat penyelidikan visual yang playful dan bisa dimainkan, bukan lewat peringatan teknis.

## Operating Context

- **Kompetisi inovasi digital:** produk dipamerkan ke juri dan peserta; demo harus berjalan mulus dan jadi prioritas.
- **Permainan berjalan penuh di browser** (Next.js dev/production, `npm run dev` / `npm run build`), tanpa backend.
- **Pencarian aset:** pengguna memberi izin eksplisit kepada AI agent untuk membuka browser dan mencari aset visual/audio yang relevan dan berlisensi untuk dipakai di web ini.
- Skenario fiktif terinspirasi situasi digital sehari-hari di Indonesia (APK kurir, vishing CS bank, skema freelance & kripto).

## Capabilities and Constraints

- Halaman yang ada: homepage, katalog kasus, detail/briefing kasus, gameplay interaktif, panduan literasi digital, progres belajar, tentang; plus layar hasil (`/hasil/[id]`).
- Tiga kasus fiktif: **Paket Misterius Buat Ibu** (APK kurir), **Panggilan CS Bank Gadungan** (vishing OTP), **Jebakan Freelance & Kripto** (skema Ponzi/pig butchering).
- **Bahasa tunggal: Bahasa Indonesia** untuk seluruh antarmuka (dikonfirmasi; tanpa rencana bilingual).
- **Progres di localStorage per browser** (poin, kasus selesai) — tanpa akun, tanpa server, tanpa sinkronisasi antar perangkat (dikonfirmasi).
- **Desktop + mobile:** harus responsif penuh dan nyaman di laptop maupun HP (dikonfirmasi; spesifikasi "desktop 16:9 saja" di README sudah tidak berlaku).
- **Keamanan web wajib** (permintaan pengguna): praktik aman untuk aplikasi Next.js — tanpa paparan rahasia, konten skenario fiktif tidak boleh tertukar dengan instruksi/jebakan nyata.
- Prioritas pengguna: **UI/UX, lalu logika permainan, lalu aset** — desain dan demo adalah hal pertama yang dinilai.
- Tanpa backend, tanpa iklan, tanpa data pengguna pihak ketiga.

## Brand Commitments

- Nama: **AWAS SCAM!**; tagline: **"Cek Dulu, Baru Klik!"**.
- Kepribadian merek (dikunci pengguna lewat direction probe): **Editorial Digital Detective** — teliti, tenang, kredibel, ramah tanpa cerewet; rasa menyelidiki, bukan ketakutan; bukan dashboard keamanan/terminal/hacker/bank/enterprise, dan bukan komik neon.
- **Palet merek (dikunci pengguna):** Ink Navy `#17243A`, Clean White `#FFFFFF`, Cool Mist `#F3F5F8`, Signal Teal `#168C87`, Alert Red `#D94B4B`, Evidence Yellow `#F0C75E` — palet cream/coral/detective-blue lama sudah pensiun. Warna gelap hanya di dalam artefak penipuan yang otentik.
- Referensi terikat dari brief awal: filosofi dan rasa interaksi Duolingo (tanpa meniru mascot/branding-nya), petualangan detektif ilustrasi, visual novel berbasis pilihan, dan produk belajar tergamifikasi.
- Aset harus **berlisensi jelas dan satu arah seni**; dilarang stok korporat generik, clip art murahan, ikon acak, dan gambar watermark. Preferensi pengguna: agent boleh mencari aset relevan di web.
- Aset berlisensi yang sudah dipakai wajib dipertahankan atribusinya (lihat `docs/ASSET_CREDITS.md`: Newsreader & Public Sans OFL, lucide-react ISC, canvas-confetti ISC; maskot = karya orisinal).

## Evidence on Hand

- `README.md` — spesifikasi produk lama (3 kasus, mekanisme, layar, karakter Budi/Ibu/Ayah/Rian). Bagian palet gelap dan "desktop 16:9" di README **digantikan** oleh brief ini; struktur kasus dan layarnya masih valid.
- `docs/ASSET_CREDITS.md` dan `docs/ASSET_RESEARCH.md` — inventaris aset berlisensi dan catatan riset.
- Kode sumber `src/` — implementasi berjalan (App Router, komponen gameplay, data kasus).
- `public/assets/mascot/`, `public/fonts/` — aset lokal siap pakai (mascot SVG asli yang sudah diwarnai ulang).
- **Tidak ada:** testimonial, benchmark, laporan uji coba pengguna, angka dampak, atau pihak sponsor. Kerjaan berikutnya tidak boleh mengarang klaim semacam ini.

## Product Principles

1. **Keselamatan lebih dulu dari kemenangan:** setiap pilihan mengajarkan keputusan digital yang lebih aman; kecerobohan ditanggapi sebagai kesempatan belajar, bukan hukuman.
2. **Belajar lewat menyelidiki, bukan menghafal:** pemain mengumpulkan bukti dan memutuskan; penjelasan datang setelah tindakan.
3. **Playful tapi kredibel:** ramah untuk pelajar, tetapi isu, sumber, dan panduan literasinya akurat untuk orang dewasa biasa.
4. **Demo tahan panggung:** alur inti kasus harus selesai tanpa error di demo kompetisi, di desktop maupun HP.
5. **Satu identitas di semua halaman:** katalog, gameplay, panduan, dan progres terasa satu produk yang disengaja.

## Accessibility & Inclusion

- Teks isi berbahasa Indonesia harus nyaman dibaca berjam-jam oleh pelajar maupun dewasa/lansia (kontras memadai, ukuran tidak remah).
- Dukungan penuh desktop + mobile (dikonfirmasi) — termasuk pemain yang hanya punya HP Android kelas menengah.
- Tidak ada persyaratan WCAG formal yang dikonfirmasi; keputusan standar aksesibilitas terbuka.
