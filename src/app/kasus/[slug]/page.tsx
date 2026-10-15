import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CaseCover } from '../../../components/CaseCover';
import { SiteFrame } from '../../../components/SiteChrome';
import { CASES, getCaseBySlug, type CaseInfo } from '../../../data/cases';

export function generateStaticParams() {
  return CASES.map(({ slug }) => ({ slug }));
}

const LEVEL: Record<CaseInfo['difficulty'], number> = { Pemula: 1, Menengah: 2, Tantangan: 3 };

export default async function CaseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const item = getCaseBySlug((await params).slug);
  if (!item) notFound();
  return (
    <SiteFrame>
      <section className="mx-auto max-w-3xl px-5 py-8 lg:px-8 lg:py-12">
        <Link href="/kasus" className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)]">
          <ArrowLeft size={15} /> Semua kasus
        </Link>

        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.84rem] text-[var(--ink-muted)]">
          <span className="font-mono font-semibold text-[var(--ink)]">
            Kasus {String(item.id).padStart(2, '0')}
          </span>
          <span className="text-[var(--line-strong)]">·</span>
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

        <h1 className="mt-2 text-[clamp(1.9rem,4vw,2.6rem)]">{item.title}</h1>

        <div className="mt-6 overflow-hidden rounded-md border border-[var(--line)]">
          <CaseCover id={item.id} className="aspect-[16/9] w-full" />
        </div>
        <p className="mt-2.5 text-[0.8rem] text-[var(--ink-muted)]">
          Potongan bukti dari kasus ini — semua nama, nomor, dan tautan bersifat fiktif.
        </p>

        <p className="mt-6 max-w-[58ch] text-[1rem] leading-7 text-[var(--ink-soft)]">{item.summary}</p>
        <p className="mt-3 max-w-[58ch] text-[0.95rem] leading-6 text-[var(--ink-muted)]">
          <span className="font-bold text-[var(--ink-soft)]">Tujuan.</span> {item.objective}
        </p>

        <Link href={`/main/${item.id}`} className="btn btn-primary btn-lg mt-8">
          Mulai Investigasi <ArrowRight size={17} />
        </Link>
      </section>
    </SiteFrame>
  );
}
