# 🛡️ AWAS SCAM! — "Cek Dulu, Baru Klik!"
### *Game Edukasi & Literasi Kejahatan Siber Berbasis Visual Novel Komik Desktop (3 Chapters)*

Dokumen ini berisi dokumentasi lengkap, panduan teknis, arsitektur antarmuka (UI/UX), palet warna, tipografi, rincian 3 chapter dengan mekanisme berbeda, serta spesifikasi layar untuk kebutuhan pengembangan dan pembuatan prompt aset visual (misal: Google Stitch, Midjourney, Figma, atau Stable Diffusion).

---

## 📌 1. Ikhtisar Proyek (Project Overview)

* **Nama Game**: **AWAS SCAM!**
* **Tagline**: *"Cek Dulu, Baru Klik!"*
* **Genre**: Visual Novel Interaktif / Comic Detective Simulator
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

### A. Konsep Seni (Art Direction)
* **Gaya**: **Indonesian Modern Comic / Webtoon Style** (mirip serial animasi modern 2D dengan aksen garis komik tegas / bold line-art).
* **Nuansa Latar Belakang**: Bernuansa lokal Indonesia yang *relatable* (ruang tamu dengan kursi kayu jati berbusa, toples nastar/kue kering di atas meja kaca, ruang makan malam hari, dan meja belajar mahasiswa dengan laptop forensik).
* **Karakter**:
  * **Budi (Karakter Utama/Pemain)**: Pemuda Indonesia usia 19–22 tahun, berkaus putih-biru, ekspresi cerdas, tenang, dan peka teknologi.
  * **Ibu Budi (Kasus 1)**: Ibu rumah tangga berhijab ungu/dusty pink dengan daster floral, memegang smartphone, ekspresi cemas dan bingung.
  * **Ayah Budi (Kasus 2)**: Pensiunan usia 50-an berkaus polo santai, panik memegang telepon yang sedang berlangsung.
  * **Rian (Kasus 3)**: Mahasiswa sahabat Budi, berjaket hoodie kampus, memegang laptop/HP dengan antusias tergiur profit cepat.

### B. Palet Warna Resmi (Color Palette)

| Nama Warna | Kode HEX | Peruntukan / Penggunaan UI |
| :--- | :--- | :--- |
| **Cyber Dark Background** | `#030712` (Slate 950) | Warna latar belakang canvas utama |
| **Card / Surface Dark** | `#0f172a` (Slate 900) | Warna kartu, panel dialog, dan modal |
| **Comic Gold / Primary** | `#f59e0b` (Amber 500) | Border panel utama, judul logo, aksen emas |
| **Bright Warning Gold** | `#fbbf24` (Amber 400) | Poin Edukasi, badge sorotan penting |
| **Emerald Safe** | `#10b981` (Emerald 500)| Indikator "Aman", bukti terverifikasi, tombol sukses |
| **Alert / Danger Red** | `#e11d48` (Rose 600) | Ekstensi file APK jahat, mode darurat, pemutus panggilan |
| **Investigator Cyan** | `#06b6d4` (Cyan 500) | Forensik browser web, tombol inspeksi siber |
| **Ink Comic Black** | `#000000` | Garis tepi tebal (*border stroke 2–6px*), bayangan komik *hard shadow* |

### C. Tipografi (Typography)
* **Display / Judul Komik**: Font Sans-Serif tebal bersudut tegas / Display Comic (*Font-black, tracking-tight, uppercase*).
* **Teks Dialog & Narasi**: Clean modern Sans-serif (`Geist Sans` / `Inter` / `Poppins`), ukuran 16px – 20px dengan *line-height* 1.6 untuk kemudahan membaca di layar PC.
* **Kode / Teknis**: Monospace font (`Geist Mono` / `JetBrains Mono`) untuk nama file, nomor telepon, dan URL website bodong (misal: `https://bursakriptonusantara-vip.xyz`).

---

## 🖥️ 4. Spesifikasi Seluruh Layar & Komponen UI

### 1. Cover Screen & Peta Pilihan Kasus (`TitleScreen`)
* Menampilkan judul komik raksasa **"AWAS SCAM!"** berbayang tebal.
* **3 Kartu Chapter Pilihan**: Pemain bisa memilih langsung bermain dari Kasus 1, Kasus 2, atau Kasus 3.
* Tombol Cepat: `[Mulai dari Kasus 1]` dan `[Buku Panduan]`.

### 2. Header Status Permanen (`ComicHeader`)
* Menampilkan logo game yang berfungsi sebagai tombol cepat kembali ke menu pemilihan kasus.
* Judul kasus aktif dan deskripsi bahaya siber.
* **Waspada Meter Dinamis** (Hijau/Kuning/Merah) + Counter **Poin Edukasi**.
* Tombol kontrol: *Pilih Kasus*, *Buku Panduan*, *Audio FX*, dan *Ulangi Kasus*.

### 3. Panggung Dialog Komik Utama (`ComicDialogBox`)
* Bingkai semi-transparan gelap dengan aksen sudut emas batik.
* Tag nama pembicara (*Ibu Budi*, *Ayah Budi*, *Rian*, *Budi (Kamu)*) dengan warna identitas masing-masing.
* Efek teks ketikan (*typewriter blip audio*).
* Tombol opsi bercabang: *Aksi Inspeksi (Cyan)*, *Tindakan Edukasi (Amber)*, dan *Pilihan Ceroboh/Risiko (Merah)*.

### 4. Modal Kasus 1: "Spot the Red Flags" (`InspectModal`)
* Simulasi chat WhatsApp Android dark mode.
* 3 Titik target inspeksi: Ekstensi `.pdf.apk`, Teks Panik 10 menit, dan Nomor kontak asing.
* Panel hasil analisis detektif di sisi kanan.

### 5. Modal Kasus 2: "Call Simulator & Lie Detector" (`CallSimulatorModal`)
* Simulasi panggilan telepon masuk dari penipu mengaku CS HaloBCA.
* Timer durasi panggilan aktif.
* **Caller ID Prefix Analyzer**: Mengungkap bahwa nomor `+62 821` adalah nomor seluler GSM biasa, bukan nomor hotline resmi bank 5-7 digit (`1500888`).
* **Interogasi Kritis**: 3 pertanyaan jebakan yang membongkar kepanikan scammer.
* **The OTP Shield**: Tombol darurat menolak memberikan OTP dan memutus panggilan.

### 6. Modal Kasus 3: "Cyber Sandbox Browser & Forensics" (`BrowserInvestigatorModal`)
* Tampilan browser desktop forensik dengan indikator URL berbahaya.
* Mockup penawaran skema Ponzi like video berhadiah jutaan.
* 3 Tab Forensik Siber:
  1. *WHOIS & Domain Age*: Mengungkap domain baru berumur 3 hari.
  2. *CekRekening.id Scanner*: Mengungkap rekening penampung telah dilaporkan 42 kali.
  3. *Reverse Image*: Mengungkap foto founder adalah foto model stok Unsplash.

### 7. Modal Tanggap Darurat (`EmergencyModal`)
* Terpicu jika pemain memilih tindakan ceroboh (misal: menyuruh korban menginstal file atau mengirimkan uang).
* 3 Protokol Darurat yang harus diselesaikan: Mode Pesawat, Hubungi Bank, Hapus Malware.

### 8. Buku Panduan Siber (`HandbookModal`)
* Pedoman edukasi komprehensif: Anatomi file APK, Aturan Emas OTP, Direktori kanal resmi Kominfo & Polri (*aduankonten.id*, *patrolisiber.id*, *cekrekening.id*), serta nomor kontak resmi bank perbankan Indonesia.

### 9. Layar Kemenangan (`CaseSolvedModal`)
* Konfeti selebrasi, medali GRADE S, rekap skor, dan tombol otomatis lanjut ke Kasus berikutnya!

---

## 🧩 5. Panduan Prompt Aset Visual (Google Stitch / AI Image Generator)

### Prompt Kasus 1 (Ruang Tamu & Ibu Budi):
> `Indonesian living room at night, 2D comic art style, clean bold outlines, warm interior lighting, wooden teak couch with cushions, glass table with Indonesian nastar cookie jars, standing electric fan in background, calendar hanging on wall, green curtains, cinematic 16:9 widescreen, digital webcomic illustration, anime webtoon aesthetic --ar 16:9 --no 3d render, realistic photo`

### Prompt Kasus 2 (Ayah Budi & Panggilan Telepon):
> `Indonesian middle-aged father 50 years old named Ayah Budi, wearing casual collared polo shirt, holding smartphone to his ear in a dining room at night, anxious and panicked expression, 2D comic art style, clean bold outlines, cell shaded webtoon aesthetic, half body character portrait, warm indoor lighting --ar 16:9 --no 3d`

### Prompt Kasus 3 (Rian & Meja Belajar Mahasiswa):
> `Indonesian college student 20 years old named Rian, wearing university hoodie jacket, sitting at a study desk in front of a modern laptop, excited yet suspicious expression looking at a crypto trading screen, 2D modern anime comic style, bright daytime bedroom lighting, books and stationery on desk, clean vector lineart --ar 16:9 --no 3d`

### Prompt Mockup Cyber Browser (Kasus 3):
> `Modern desktop web browser interface mockup displaying a fake cryptocurrency exchange website named 'Bursa Kripto Nusantara', suspicious high return VIP task offer, red security warning banner at top, cyber forensic inspection dashboard, dark mode UI, clean vector graphic design --ar 16:9`

---

## ⚙️ 6. Cara Menjalankan Aplikasi

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
