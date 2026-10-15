'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteFrame } from '../../components/SiteChrome';
import { CASES, type CaseInfo } from '../../data/cases';

const FILTERS = ['Semua', 'Pemula', 'Menengah', 'Tantangan'] as const;
const LEVEL: Record<CaseInfo['difficulty'], number> = { Pemula: 1, Menengah: 2, Tantangan: 3 };

export default function CasesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Semua');
  const shown = filter === 'Semua' ? CASES : CASES.filter((item) => item.difficulty === filter);
  return (
    <SiteFrame>
      <section className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
        <h1 className="text-[clamp(2rem,4vw,2.8rem)]">Berkas kasus</h1>
        <p className="mt-3 max-w-[54ch] text-[1.02rem] leading-7 text-[var(--ink-muted)]">
          Tiga situasi penipuan. Pilih satu dan mulai saat kamu siap.
        </p>

        <div className="mt-8 flex gap-6 border-b border-[var(--line-strong)]">
          {FILTERS.map((name) => (
            <button
              key={name}
              onClick={() => setFilter(name)}
              aria-pressed={filter === name}
              className={`-mb-px border-b-2 pb-2 text-[0.9rem] font-semibold transition-colors ${
                filter === name
                  ? 'border-[var(--ink)] text-[var(--ink)]'
                  : 'border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="mt-2">
          {shown.map((item) => (
            <Link
              key={item.slug}
              href={`/kasus/${item.slug}`}
              className="group flex items-start gap-4 border-b border-[var(--line)] py-6 transition-colors hover:bg-[var(--white)] sm:gap-6 sm:px-3"
            >
              <span className="mt-0.5 shrink-0 font-serif text-[1.9rem] leading-none text-[var(--line-strong)] transition-colors group-hover:text-[var(--ink)] sm:text-[2.1rem]">
                {String(item.id).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-[1.35rem] font-semibold leading-snug text-[var(--ink)]">
                  {item.title}
                </h2>
                <p className="mt-1 max-w-[62ch] text-[0.94rem] leading-6 text-[var(--ink-muted)]">
                  {item.summary}
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem] text-[var(--ink-muted)]">
                  <span className="flex items-center gap-1.5">
                    <span className="level-dots" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <i key={i} className={i < LEVEL[item.difficulty] ? 'on' : ''} />
                      ))}
                    </span>
                    {item.difficulty}
                  </span>
                  <span className="text-[var(--line-strong)]">·</span>
                  <span className="font-mono">{item.duration}</span>
                </p>
              </div>
              <ArrowRight
                size={18}
                className="mt-2 shrink-0 text-[var(--ink-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--ink)]"
              />
            </Link>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
