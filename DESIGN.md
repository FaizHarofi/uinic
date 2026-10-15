---
name: AWAS SCAM!
description: "Selidiki pesannya, jangan cuma dibaca — game literasi penipuan digital bergaya Editorial Digital Detective"
colors:
  ink: "#17243a"
  ink-soft: "#33415c"
  ink-muted: "#56647c"
  line: "#dce2ea"
  line-strong: "#c3ccd9"
  mist: "#f3f5f8"
  paper: "#ffffff"
  teal: "#168c87"
  teal-deep: "#0f6b67"
  teal-tint: "#e3f1f0"
  red: "#d94b4b"
  red-btn: "#c23a3a"
  red-deep: "#b03535"
  red-tint: "#fbebeb"
  yellow: "#f0c75e"
  yellow-tint: "#fbf2da"
  artifact-whatsapp-bg: "#0b141a"
  artifact-whatsapp-bar: "#202c33"
  artifact-browser-dot-red: "#ff5f57"
  artifact-browser-dot-yellow: "#febc2e"
  artifact-browser-dot-green: "#28c840"
typography:
  display:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2rem, 4vw, 2.8rem)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  hero:
    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.1rem, 5.2vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
rounded:
  chip: "6px"
  tile: "7px"
  btn: "8px"
  card: "14px"
  panel: "10px"
  pill: "999px"
---

# AWAS SCAM! — Sistem Desain "Editorial Digital Detective"

## Kepribadian

Ruang kerja detektif digital yang rapi, tenang, dan kredibel: kertas putih, tinta navy,
satu warna sinyal. Bukan komik, bukan dashboard keamanan — ini **publikasi investigasi**
yang bisa disentuh. Setiap layar mengajak pembaca memeriksa bukti, bukan menonton pertunjukan.
Anti-reference yang terkonfirmasi: cream/coral/detective-blue era lama, comic-neon minigame
(glow, scanline, ledakan "TERBONGKAR"), glassmorphism, gradien teks, kartu rounded seragam.

## Palet (dikunci)

| Peran | Nilai | Aturan |
|---|---|---|
| Ink Navy | `#17243A` | Teks utama, tombol primer, panel gelap. Wajah "tinta". |
| Ink Soft/Muted | `#33415C` / `#56647C` | Teks sekunder/tersier; muted lolos 4.5:1 di atas putih. |
| Cool Mist | `#F3F5F8` | Background halaman & stage panggung permainan. |
| Paper White | `#FFFFFF` | Permukaan kartu, nav, panel dialog. |
| Signal Teal | `#168C87` | Sinyal benar/aman: kuis benar, fitur aktif, maskot. `#0F6B67` untuk teks/tombol (AA). |
| Alert Red | `#D94B4B` | Bahaya; teks merah di permukaan terang memakai deep `#B03535`, tombol `#C23A3A`. |
| Evidence Yellow | `#F0C75E` | Petunjuk & penanda bukti — selalu membawa teks ink, tidak pernah teks putih. |
| Garis | `#DCE2EA` / `#C3CCD9` | Pemisah tipis 1px; tidak ada border tebal dekoratif. |

Kolaborasi: putih bg + kuning = catatan petunjuk (`.panel-tint`); mist bg + teal = status
benar (`.chip-teal`); tinta bg + putih = momen penutup (`.panel-ink`).

**Gelap hanya di dalam artefak otentik**: layar WhatsApp (`#0b141a`), layar panggilan,
situs scam. Jangan pernah membuat shell UI gelap.

## Tipografi

- **Newsreader** (serif, 400–700, self-hosted `public/fonts/newsreader-latin.woff2`):
  semua `h1–h4` otomatis, angka besar. Karakter: editorial, tenang, berwibawa.
- **Public Sans** (300–800, `public/fonts/publicsans-latin.woff2`): body, tombol, chip, UI.
- **Mono sistem**: hanya data nyata — URL, kode OTP, nomor rekening, timer.
- Judul hero maks `4.6rem`, halaman `2.8rem`; measure teks 52–66ch; tracking minimal `-0.01em`
  (jangan turun ke -0.04em, serif ini cepat rapat).
- Tidak ada uppercase letter-spaced kickers. Label fungsional boleh kecil-tebal normal-case.

## Layout & Halaman

- **Nav** (`SiteChrome`): putih sticky, tinggi 62px, border-b 1px; wordmark "AWAS SCAM!" + "!"
  teal-deep; link aktif = teks ink + underline 2,5px teal-deep. Tiga link saja (Kasus, Panduan,
  Progres) — tanpa CTA di nav; "Tentang & Kredit" hanya di footer; menu mobile = daftar link polos.
- **Homepage**: tiga bagian. (1) Hero: headline Newsreader max-w 17ch dengan sorotan kuning,
  deck dua baris, satu CTA tinta. (2) Pratinjau: folio mono "Kasus 01 · judul" + garis ink,
  artefak chat kasus 1 disandingkan 3 catatan bernomor (numeral dalam bulatan kuning) — bukan
  hero teks-kiri/gambar-kanan, bukan barisan kartu. (3) Footer. Tanpa registrasi kasus, alur,
  kompetensi, atau penutup bidang kuning.
- **Katalog kasus** (`/kasus`): baris editorial bergaris rambut — seluruh baris jadi tautan,
  numeral serif + `level-dots` + durasi + panah; filter level = tab underline (`aria-pressed`),
  bukan pil. Tanpa kartu grid.
- **Detail kasus** (`/kasus/[slug]`): minimal vertikal — kembali, meta (Kasus 0X · level ·
  durasi), judul, `CaseCover` 16/9 tanpa bayangan, ringkasan, satu baris "Tujuan.", satu CTA.
  Tanpa chip/panel tint/checklist kompetensi.
- Measure: body 65–75ch; section padding `py-12 lg:py-16`.

## Komponen (di `globals.css`)

- `.btn` — radius 6px, `btn-primary` (ink), `btn-teal`, `btn-secondary` (putih+garis),
  `btn-danger` (red-btn), `btn-ghost`; ukuran `btn-sm/lg/block`. Tanpa bayangan offset keras;
  hover = perubahan warna/border saja (tanpa pergeseran).
- `.card` — putih, border 1px `--line`, radius 6px. `.card-hover` hover = border-color saja.
- `.chip` — radius 6px, label kecil; varian `chip-ink/teal/red/yellow/outline`.
- `.meter` — bar 8px; isian teal (benar) atau red (bahaya) lewat inline style.
- `.icon-tile` — kotak ke radius 6px, mist bg, ikon ink (lucide).
- `.note-mascot` — maskot 56px + teks, tanpa bubble ekor.
- `.panel-tint` (kuning) & `.panel-ink` (tinta) radius 6px untuk aksen.

## Panggung Permainan (`GameExperience`)

- Stage **terang**: bg mist; header Kembali / "Kasus 0X · judul" / Ulangi; **status ringkas
  satu baris** — meter Kewaspadaan + poin + tombol Petunjuk (`aria-expanded`, membuka satu
  baris teks, bukan panel). Panggung kasus = kartu putih border radius 6px tanpa bayangan
  besar; footer = satu baris disclaimer ("Simulasi edukasi — …fiktif"), bukan poin.
- Bukti di atas (`CaseArt`), dialog tepat di bawah (`ComicDialogBox`) — tidak tumpang tindih.
- Dialog: chip speaker `chip-ink`, teks 66ch, pilihan = baris putih border 1px radius 6px
  **tanpa ikon** (label + label kedua + chevron kanan), risky = shake + ring red, aman = ring teal.
- Minigame (modal): shell putih di atas backdrop ink-blurred; mekanik & skor dipertahankan;
  kegelapan hanya pada artefak (chat, layar panggilan, situs scam); tanpa glow/ledakan/
  scanline/kedip; feedback sukses = tint teal, gagal = tint red.

## Maskot

8 pose SVG orisinal di `public/assets/mascot/` — jas teal `#17243A`→rambut ink,
rompi/aksen `#168C87`, kancing `#F0C75E`, kaos `#FFFFFF`. Hanya di momen yang bermakna:
halaman hasil kasus (`completion`) dan umpan balik minigame (`success`/`alert`); tanpa
mascot di nav, panduan, progres, atau panel petunjuk.

## Do / Don't

- **Do**: mulai tiap halaman dengan satu pernyataan besar (Newsreader) + bukti nyata;
  pakai lucide untuk semua ikon; pertahankan warna otentik artefak (WhatsApp, traffic-light
  browser, emas scam di dalam sandboxnya).
- **Do**: status selalu punya teks — jangan hanya warna (a11y), fokus 3px teal-deep.
- **Don't**: gradien teks, emoji sebagai ikon, angka 01/02/03 dekoratif, kartu seragam
  tanpa hierarki, bayangan offset keras `0 4px 0`, pill tombol, glassmorphism, hue di luar
  palet, teks merah `#D94B4B` untuk body kecil di atas putih (pakai `#B03535`).
