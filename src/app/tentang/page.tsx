import { SiteFrame } from '../../components/SiteChrome';

export default function About() {
  return (
    <SiteFrame>
      <section className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
        <h1 className="text-[clamp(2rem,4vw,2.8rem)]">Belajar waspada tanpa dibuat takut.</h1>
        <p className="mt-4 max-w-[60ch] text-[1.02rem] leading-7 text-[var(--ink-muted)]">
          AWAS SCAM! adalah game edukasi interaktif untuk mengenali pola penipuan digital lewat
          skenario fiktif, bukti yang bisa kamu periksa sendiri, dan tindakan aman yang bisa
          dipraktikkan sehari-hari. Dibuat untuk siswa, keluarga, dan siapa pun yang ingin berlatih
          memilah pesan penipuan sebelum terlanjur percaya.
        </p>
        <p className="mt-3 max-w-[60ch] text-[0.95rem] leading-7 text-[var(--ink-muted)]">
          Semua nama, nomor, dan tautan bersifat fiktif. Progres disimpan lokal di perangkatmu —
          tanpa pendaftaran, tanpa email, tanpa iklan.
        </p>

        <div className="mt-9 border-t border-[var(--line)] pt-6">
          <h2 className="text-[1.3rem]">Pengembang</h2>
          <p className="mt-2 max-w-[58ch] text-[0.95rem] leading-7 text-[var(--ink-soft)]">
            Dikembangkan oleh Cyber Defense Studios — pengalaman belajar digital yang ramah untuk
            pengguna sehari-hari.
          </p>
        </div>

        <div className="mt-8 border-t border-[var(--line)] pt-6">
          <h2 className="text-[1.3rem]">Kredit aset</h2>
          <ul className="mt-3 space-y-2 text-[0.9rem] leading-7 text-[var(--ink-muted)]">
            <li>Huruf Newsreader &amp; Public Sans: Google Fonts — SIL Open Font License 1.1.</li>
            <li>Ikon antarmuka: lucide-react — ISC License.</li>
            <li>Maskot detektif digital: ilustrasi orisinal untuk AWAS SCAM!.</li>
            <li>Kode konfeti di halaman hasil: canvas-confetti — ISC License.</li>
          </ul>
        </div>
      </section>
    </SiteFrame>
  );
}
