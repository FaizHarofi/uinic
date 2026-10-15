import Link from 'next/link';
import { SiteFrame } from '../../components/SiteChrome';

const tips = [
  {
    title: 'Tautan dan lampiran',
    text: 'Jangan pernah memasang aplikasi dari pesan mendadak. Periksa status kiriman dengan membuka aplikasi atau situs ekspedisi sendiri.',
    example: 'Lampiran "Lihat_Foto_Paket.pdf.apk" bukan foto — file .apk adalah aplikasi Android yang bisa membaca SMS-mu.',
  },
  {
    title: 'OTP dan data pribadi',
    text: 'Kode OTP, PIN, dan kata sandi bersifat rahasia. Petugas bank yang resmi tidak akan pernah memintanya lewat telepon, pesan, atau chat.',
    example: 'Penelepon mengaku CS bank lalu mendesak membacakan kode OTP. Cukup tutup panggilannya dan telepon call center resmi.',
  },
  {
    title: 'Tekanan psikologis',
    text: 'Ancaman batas waktu, rasa takut kehilangan uang, atau janji keuntungan besar adalah tanda untuk berhenti — bukan alasan buru-buru menuruti.',
    example: 'Iming-iming komisi 300% dan "slot VIP" adalah umpan. Penipu mengandalkan kepanikan agar kamu tak sempat memeriksa.',
  },
  {
    title: 'Verifikasi lewat kanal resmi',
    text: 'Cari sendiri nomor layanan, aplikasi, atau situs resmi. Jangan pakai nomor atau tautan yang diberikan pihak yang menghubungimu.',
    example: 'Nomor call center bank berupa 5–7 digit (misalnya 1500888), bukan nomor seluler +62 8xx yang bisa dipakai siapa saja.',
  },
];

const checklist = [
  'Berhenti sebentar — jangan klik, unduh, atau transfer apa pun.',
  'Buka sendiri kanal resminya: aplikasi resmi, situs resmi, nomor resmi.',
  'Jangan bagikan OTP, PIN, atau kata sandi kepada siapa pun.',
  'Masih ragu? Tanyakan ke orang tepercaya sebelum bertindak.',
];

export default function Guide() {
  return (
    <SiteFrame>
      <section className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
        <h1 className="text-[clamp(2rem,4vw,2.8rem)]">Periksa dulu sebelum percaya.</h1>
        <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-7 text-[var(--ink-muted)]">
          Satu indikator saja belum tentu penipuan. Yang dilatih di sini adalah kebiasaan:
          berhenti, cari kejanggalan, lalu verifikasi lewat kanal resmi.
        </p>

        <div className="mt-10">
          {tips.map((tip) => (
            <article key={tip.title} className="border-t border-[var(--line)] py-6 first:border-t-0 first:pt-0">
              <h2 className="text-[1.35rem]">{tip.title}</h2>
              <p className="mt-2 max-w-[64ch] text-[0.98rem] leading-7 text-[var(--ink-soft)]">{tip.text}</p>
              <p className="mt-2 max-w-[64ch] text-[0.88rem] leading-6 text-[var(--ink-muted)]">
                <span className="font-bold text-[var(--ink-soft)]">Contoh.</span> {tip.example}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 border-t border-[var(--line)] pt-7">
          <h2 className="text-[1.35rem]">Checklist cepat</h2>
          <ul className="mt-3">
            {checklist.map((item) => (
              <li key={item} className="border-b border-[var(--line)] py-3 text-[0.95rem] leading-6 text-[var(--ink-soft)] last:border-b-0">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9rem] text-[var(--ink-muted)]">
            Ingin melatihnya langsung?{' '}
            <Link href="/kasus" className="link-underline font-bold text-[var(--teal-deep)] hover:text-[var(--ink)]">
              Mulai dari kasus pertama.
            </Link>
          </p>
        </div>
      </section>
    </SiteFrame>
  );
}
