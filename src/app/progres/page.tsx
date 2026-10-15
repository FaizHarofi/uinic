'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SiteFrame } from '../../components/SiteChrome';
import { CASES } from '../../data/cases';

export default function Progress() {
  const [done, setDone] = useState<number[] | null>(null);
  useEffect(() => {
    let items: number[] = [];
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('awas-scam-progress') || '[]');
      if (Array.isArray(saved)) items = saved.filter((item): item is number => typeof item === 'number');
    } catch {}
    const timer = setTimeout(() => setDone(items), 0);
    return () => clearTimeout(timer);
  }, []);

  const finished = done ?? [];
  const next = CASES.find((item) => !finished.includes(item.id));

  return (
    <SiteFrame>
      <section className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-14">
        <h1 className="text-[clamp(2rem,4vw,2.8rem)]">Progres investigasimu</h1>

        {done === null ? null : finished.length === 0 ? (
          <div className="mt-7">
            <p className="max-w-[52ch] text-[1rem] leading-7 text-[var(--ink-muted)]">
              Belum ada kasus yang selesai. Kasus pertama selesai dalam kurang dari 5 menit.
            </p>
            <Link href="/kasus/paket-misterius" className="btn btn-primary btn-lg mt-6">
              Mulai Investigasi <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="mt-7">
            <p className="text-[1.05rem] text-[var(--ink-soft)]">
              <strong className="font-bold text-[var(--ink)]">
                {finished.length} dari {CASES.length}
              </strong>{' '}
              kasus selesai.
            </p>
            <div className="meter mt-3 max-w-sm">
              <span style={{ width: `${Math.round((finished.length / CASES.length) * 100)}%` }} />
            </div>

            {next ? (
              <Link href={`/kasus/${next.slug}`} className="btn btn-primary btn-lg mt-6">
                Lanjutkan: {next.title} <ArrowRight size={17} />
              </Link>
            ) : (
              <p className="mt-6 text-[0.95rem] text-[var(--ink-muted)]">
                Semua kasus selesai.{' '}
                <Link href="/kasus" className="link-underline font-bold text-[var(--teal-deep)] hover:text-[var(--ink)]">
                  Lihat semua kasus.
                </Link>
              </p>
            )}
          </div>
        )}

        {done !== null && (
          <div className="mt-10 border-t border-[var(--line-strong)] pt-2">
            {CASES.map((item) => {
              const isDone = finished.includes(item.id);
              return (
                <Link
                  key={item.id}
                  href={`/kasus/${item.slug}`}
                  className="group flex items-center gap-4 border-b border-[var(--line)] py-4 transition-colors hover:bg-[var(--white)] sm:px-3"
                >
                  <span className="shrink-0 font-mono text-[0.78rem] text-[var(--ink-muted)]">
                    {String(item.id).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.97rem] font-semibold text-[var(--ink)]">
                    {item.title}
                  </span>
                  {isDone ? (
                    <span className="flex shrink-0 items-center gap-1.5 text-[0.82rem] font-bold text-[var(--teal-deep)]">
                      <Check size={14} strokeWidth={3} /> Selesai
                    </span>
                  ) : (
                    <span className="shrink-0 text-[0.82rem] text-[var(--ink-muted)] transition-colors group-hover:text-[var(--ink)]">
                      Belum
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-[0.84rem] text-[var(--ink-muted)]">
          Progres tersimpan di perangkat ini saja. Tidak ada akun, tidak ada data yang dikirim ke mana pun.
        </p>
      </section>
    </SiteFrame>
  );
}
