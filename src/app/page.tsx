import Link from 'next/link';
import { ArrowRight, FileText, Package } from 'lucide-react';
import { SiteFrame } from '../components/SiteChrome';
import { CHAPTER_1_RED_FLAGS } from '../data/chaptersData';

/* Urutan data: flag-ext, flag-urgency, flag-sender */
const [flagExt, flagUrgency, flagSender] = CHAPTER_1_RED_FLAGS;
const NOTES = [flagSender, flagUrgency, flagExt];

function Marker({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-grid h-[1.25em] w-[1.25em] translate-y-[0.12em] place-items-center rounded-full bg-[var(--yellow)] font-sans text-[0.6rem] font-bold leading-none text-[var(--ink)] ring-1 ring-black/25"
    >
      {n}
    </span>
  );
}

export default function Home() {
  return (
    <SiteFrame>
      {/* Hero editorial: satu pernyataan, satu kalimat, satu tindakan */}
      <section className="border-b border-[var(--line)] bg-[var(--white)] px-4 pt-14 pb-12 sm:px-6 lg:px-8 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="max-w-[17ch] text-[clamp(2.5rem,6.6vw,4.6rem)] leading-[1.04] text-[var(--ink)]">
            Scam tidak berteriak. Ia menyamar sebagai{' '}
            <mark className="bg-[var(--yellow)] px-1 text-[var(--ink)]">pesan biasa.</mark>
          </h1>
          <p className="mt-6 max-w-[50ch] text-[1.05rem] leading-7 text-[var(--ink-muted)] sm:text-[1.12rem]">
            Uji kemampuanmu mengenali penipuan lewat kasus yang menyerupai situasi nyata.
          </p>
          <div className="mt-8">
            <Link href="/kasus/paket-misterius" className="btn btn-primary btn-lg">
              Mulai Investigasi <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Preview satu kasus: bukti nyata dengan catatan tepi */}
      <section className="bg-[var(--white)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--ink)] pb-2.5">
            <p className="font-mono text-[0.74rem] font-semibold text-[var(--ink)]">
              Kasus 01 · Paket Misterius Buat Ibu
            </p>
            <p className="text-[0.86rem] text-[var(--ink-muted)]">
              Kamu akan memeriksa pesan seperti ini sendiri.
            </p>
          </div>

          <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-12">
            <div
              className="artifact-dark min-h-[300px] overflow-hidden rounded-md border border-[#2a3942] shadow-[0_12px_32px_rgba(23,36,58,0.16)]"
              role="img"
              aria-label="Potongan percakapan WhatsApp: pengirim mengaku kurir J&T meminta Ibu memasang file Lihat_Foto_Paket.pdf.apk dalam batas waktu 10 menit"
            >
              <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#202c33' }}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3b4a54]">
                  <Package size={16} className="text-[#cfd8dc]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.88rem] font-semibold" style={{ color: '#e9edef' }}>
                    Kurir J&amp;T Express (Gudang)
                    <Marker n={1} />
                  </p>
                  <p className="font-mono text-[0.7rem]" style={{ color: '#8696a0' }}>
                    +62 895-3342-9912
                  </p>
                </div>
              </div>
              <div className="flex min-h-[230px] flex-col justify-end p-4 sm:p-5">
                <div
                  className="max-w-[94%] rounded-md rounded-tl-none px-3.5 py-3"
                  style={{ background: '#202c33', border: '1px solid #2a3942' }}
                >
                  <p className="text-[0.95rem] leading-relaxed" style={{ color: '#e9edef' }}>
                    Selamat malam Ibu. Paket atas nama Ibu tertahan di gudang.{' '}
                    <strong className="font-bold">MOHON SEGERA DIBUKA DALAM 10 MENIT</strong>
                    <Marker n={2} /> atau paket dikembalikan ke penjual.
                  </p>
                  <div
                    className="mt-2.5 flex items-center gap-2.5 rounded-sm px-2.5 py-2"
                    style={{ background: '#161f27', border: '1px solid #2a3942' }}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-[#3b2a2a]">
                      <FileText size={16} className="text-[#e57373]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[0.78rem] font-semibold" style={{ color: '#e9edef' }}>
                        Lihat_Foto_Paket.pdf.apk
                        <Marker n={3} />
                      </p>
                      <p className="text-[0.7rem]" style={{ color: '#8696a0' }}>
                        8,4 MB · File instalasi
                      </p>
                    </div>
                  </div>
                  <p className="mt-1.5 text-right font-mono text-[0.66rem]" style={{ color: '#8696a0' }}>
                    20:14
                  </p>
                </div>
              </div>
            </div>

            <ol className="space-y-4">
              {NOTES.map((flag, i) => (
                <li key={flag.id} className="grid grid-cols-[auto_1fr] gap-3.5 border-t border-[var(--line)] pt-4">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-[var(--yellow)] font-sans text-[0.72rem] font-bold text-[var(--ink)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-serif text-[1.05rem] font-semibold text-[var(--ink)]">
                      {flag.name}
                    </p>
                    <p className="mt-1 max-w-[52ch] text-[0.9rem] leading-6 text-[var(--ink-muted)]">
                      {flag.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
