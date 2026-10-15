# 🛡️ AWAS SCAM! — "Cek Dulu, Baru Klik!"
### *Game Edukasi & Literasi Kejahatan Siber Berbasis Visual Novel Bukti Digital (3 Kasus)*

Dokumen ini berisi dokumentasi proyek: ikhtisar, arsitektur antarmuka (UI/UX), palet warna, tipografi, rincian 3 kasus dengan mekanisme berbeda, serta spesifikasi layar. Sistem desain lengkap ada di [`DESIGN.md`](./DESIGN.md); komitmen produk ada di [`PRODUCT.md`](./PRODUCT.md).

---

## 📌 1. Ikhtisar Proyek (Project Overview)

* **Nama Game**: **AWAS SCAM!**
* **Tagline**: *"Cek Dulu, Baru Klik!"*
* **Genre**: Visual Novel Interaktif / Game Detektif Bukti Digital
* **Platform Target**: Desktop PC (Widescreen 16:9 / 1920x1080)
* **Target Audiens**: Masyarakat umum, pelajar/mahasiswa, keluarga, dan lansia pengguna smartphone.
* **Tujuan Edukasi**: Meningkatkan kewaspadaan terhadap penipuan siber (Social Engineering, sniffing via malware APK, Vishing OTP telepon palsu, serta skema Ponzi & bursa kripto palsu).

---

## 📚 2. Struktur 3 Kasus & Mekanisme Berbeda (The 3 Chapters)

| Chapter | Judul Kasus | Target Kejahatan Siber | Karakter Utama | Mekanisme Interaktif Khas |
| :--- | :--- | :--- | :--- | :--- |
| **Kasus 1** | **Paket Misterius Buat Ibu** | Sniffing SMS via Malware Android (.APK berkedok kurir) | Ibu Budi & Budi | **1. Spot the Red Flags**: Inspeksi visual chat WhatsApp (.pdf.apk, batas 10 menit, nomor asing).<br/>**2. Drag & Drop Detective Pinboard**: Menghubungkan benang merah bukti ke kategori kejahatan.<br/>**3. Konfrontasi Bukti**: Debat menyodorkan kartu fakta teknis ke Ibu. |
| **Kasus 2** | **Panggilan CS Bank Gadungan** | Voice Phishing (Vishing) & Manipulasi Panik Pembobolan Akun | Ayah Budi & Penelepon Gadungan | **1. Call Simulator & Lie Detector**: Caller ID prefix check, waveform audio, dan interogasi 3 pertanyaan jebakan.<br/>**2. The OTP Shield**: Menolak kode OTP dan memutus panggilan darurat.<br/>**3. Drag & Drop Detective Pinboard**: Memetakan anatomi penipuan Vishing perbankan. |
| **Kasus 3** | **Jebakan Freelance & Kripto** | Skema Ponzi Pig Butchering (Tugas Like Video & Bursa Bodong) | Rian (Teman Kampus) & Budi | **1. Cyber Browser Sandbox & Forensics**: WHOIS domain 3 hari, CekRekening 42 laporan, Reverse Image foto CEO Unsplash.<br/>**2. Drag & Drop Detective Pinboard**: Membedah siklus jebakan Ponzi (Umpan -> Deposit -> Freeze).<br/>**3. Edukasi Logika di Atas Keserakahan**. |

---

## 🎨 3. Design System & Gaya Visual (Art Style)

### A. Konsep Seni (Art Direction — terkunci: "Editorial Digital Detective")
* **Gaya**: Publikasi investigasi editorial — kertas putih, tinta navy, satu warna sinyal; bukan komik dan bukan dashboard keamanan. Penuh aturan dan detail di [`DESIGN.md`](./DESIGN.md).
* **Bukti digital otentik**: Setiap sampul kasus digambar dengan HTML/CSS dari bukti nyata (chat WhatsApp, layar panggilan, browser situs scam) — tanpa ilustrasi AI/clip art.
* **Kegelapan hanya di dalam artefak**: Shell UI (nav, modal, panggung) selalu terang (Cool Mist); gelap hanya di dalam layar penipuan yang otentik.
* **Maskot**: Keluarga SVG detektif asli (8 pose) yang sudah diwarnai ulang ke palet baru.
* **Karakter naratif**: Budi (pemain), Ibu Budi (Kasus 1), Ayah Budi (Kasus 2), Rian (Kasus 3).

### B. Palet Warna Resmi (Color Palette — dikunci pengguna)

| Nama Warna | Kode HEX | Peruntukan / Penggunaan UI |
| :--- | :--- | :--- |
| **Ink Navy** | `#17243A` | Teks utama, tombol primer, struktur |
| **Clean White** | `#FFFFFF` | Permukaan kartu, panggung, modal |
| **Cool Mist** | `#F3F5F8` | Latar halaman, panggung permainan, panel tugas |
| **Signal Teal** | `#168C87` | Aksi aman/benar/aktif (teks tombol `#0F6B67`) |
| **Alert Red** | `#D94B4B` | Bahaya & kesalahan (teks di putih `#B03535`) |
| **Evidence Yellow** | `#F0C75E` | Petunjuk, bukti tersembunyi (selalu bawa teks ink) |

Warna gelap (`#0B141A` WhatsApp, `#202C33`, traffic-light browser) hanya dipakai di dalam artefak penipuan.

### C. Tipografi (Typography)
* **Display / Judul**: **Newsreader** (serif editorial, otomatis via `globals.css` untuk h1–h4).
* **Body & UI**: **Public Sans** — ukuran body 15–16px, *line-height* 1.6, measure 52–66ch.
* **Bukti teknis**: Monospace sistem **hanya** untuk data nyata — URL, kode OTP, nomor rekening, nomor telepon, timer.

> Kedua font self-hosted (`public/fonts/*.woff2`, lisensi SIL OFL 1.1).

---

## 🖥️ 4. Spesifikasi Seluruh Layar & Komponen UI

### 1. Homepage (`/`)
* Tiga bagian: hero (headline Newsreader max-w 17ch dengan sorotan kuning, deck dua baris, satu CTA), pratinjau (folio mono kasus 01 + artefak chat kasus 1 disandingkan 3 catatan bernomor), footer.
* Tanpa registrasi kasus, alur langkah, daftar kompetensi, atau penutup bidang kuning.
* Navigasi putih sticky (`SiteChrome`, tiga link tanpa CTA) + footer kredit.

### 2. Katalog Kasus (`/kasus`)
* Baris editorial bergaris rambut (seluruh baris tautan): numeral serif, `level-dots`, durasi, panah. Filter level = tab underline.

### 3. Briefing Kasus (`/kasus/[slug]`)
* Lembar minimal: kembali, meta (Kasus 0X · level · durasi), judul, artefak `CaseCover` 16/9, ringkasan, satu baris tujuan, satu CTA.

### 4. Panggung Permainan (`/main/[id]` → `GameExperience`)
* Panggung terang (Cool Mist): header putih (Kembali, judul kasus, Ulangi), status ringkas satu baris (meter Kewaspadaan, poin, Petunjuk opsional), kartu putih berisi bukti (`CaseArt`) + dialog (`ComicDialogBox`), footer satu baris disclaimer.
* Tag nama pembicara, efek teks ketikan (*typewriter blip audio*), kartu pilihan tanpa ikon — risiko = shake + ring merah, aman = ring teal.

### 5. Modal Kasus 1: "Spot the Red Flags" (`InspectModal`)
* Layar chat WhatsApp otentik (gelap, di dalam artefak) dengan target inspeksi bergaris kuning → teal: ekstensi `.pdf.apk`, teks panik 10 menit, nomor kontak asing.
* Panel analisis terang di sisi kanan.

### 6. Modal Kasus 2: "Call Simulator & Lie Detector" (`CallSimulatorModal`)
* Layar panggilan gelap (artefak) + panel investigasi terang: Caller ID prefix analyzer (`+62 821` = seluler, bukan hotline `1500888`), timer, interogasi 3 pertanyaan, meter panik (bukan ledakan).
* OTP masuk sebagai notifikasi terang; OTP Shield = banner teal.

### 7. Modal Kasus 3: "Cyber Sandbox Browser & Forensics" (`BrowserInvestigatorModal`)
* Dashboard forensik terang; situs Ponzi bergaya scam cuma di dalam sandbox browser (traffic-light browser otentik).
* 3 tab: WHOIS (domain 3 hari), CekRekening (42 laporan), Reverse Image (foto stok Unsplash).

### 8. Modal Tanggap Darurat (`EmergencyModal`)
* Terpicu saat pilihan ceroboh; protokol: Mode Pesawat, Hubungi Bank, Hapus Malware. Selesai = "Sistem diamankan" (tanpa efek ledakan).

### 9. Papan Bukti (`PinboardModal`)
* Drag & drop menghubungkan benang merah bukti ke kategori kejahatan (mekanisme asli dipertahankan).

### 10. Buku Panduan Siber (`/panduan`)
* Empat tips artikel (tautan & lampiran, OTP & data pribadi, tekanan psikologis, verifikasi kanal resmi) dengan "Contoh." inline, checklist cepat, satu tautan teks — tanpa kartu atau maskot.

### 11. Layar Hasil (`/hasil/[id]`)
* Maskot `completion`, kalimat praktik + pelajaran, poin besar, aksi Ulangi kasus + Kembali ke Kasus, konfeti warna palet; progres tersimpan di localStorage (`/progres`).

---

## ⚙️ 5. Cara Menjalankan Aplikasi

Aplikasi dibangun menggunakan **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4**.

```bash
# Jalankan development server
npm run dev

# Buka di browser desktop
# http://localhost:3000

# Build untuk produksi
npm run build
```

---
*Proyek dikembangkan untuk kompetisi inovasi digital edukasi literasi keamanan siber Indonesia.*
