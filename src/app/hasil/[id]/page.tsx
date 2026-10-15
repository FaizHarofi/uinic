'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Mascot } from '../../../components/Mascot';
import { SiteFrame } from '../../../components/SiteChrome';
import { getCaseById } from '../../../data/cases';

export default function Results({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState(1);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    params.then(({ id: raw }) => {
      const value = Number(raw);
      setId(value);
      try {
        setPoints(JSON.parse(localStorage.getItem(`awas-scam-result-${value}`) || '{}').points || 0);
      } catch {}
    });
  }, [params]);

  useEffect(() => {
    confetti({
      particleCount: 70,
      spread: 60,
      startVelocity: 32,
      origin: { y: 0.6 },
      colors: ['#168C87', '#F0C75E', '#17243A', '#FFFFFF'],
      disableForReducedMotion: true,
    });
  }, []);

  const item = getCaseById(id);
  if (!item) return null;

  return (
    <SiteFrame>
      <section className="mx-auto max-w-3xl px-5 py-12 text-center lg:py-16">
        <span className="mx-auto block w-32 animate-rise sm:w-40">
          <Mascot name="completion" alt="Maskot detektif merayakan kasus selesai" className="h-auto w-full" />
        </span>

        <h1 className="animate-rise mt-5 text-[clamp(1.9rem,4.5vw,2.7rem)]">Bagus — kasusnya selesai.</h1>
        <p className="mx-auto mt-4 max-w-[54ch] text-[1rem] leading-8 text-[var(--ink-muted)]">
          Kamu mempraktikkan: {item.skills.join(', ')}. Ingat, bila ada pesan yang mendesak, berhenti
          dan verifikasi dulu melalui kanal resmi.
        </p>

        <p className="mt-7">
          <strong className="block text-[2.6rem] font-bold leading-none tracking-tight" style={{ fontFamily: "'Newsreader', serif" }}>
            {points}
          </strong>
          <span className="mt-2 block text-[0.86rem] font-semibold text-[var(--ink-muted)]">
            poin diperoleh
          </span>
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/main/${id}`} className="btn btn-secondary">
            <RotateCcw size={16} /> Ulangi kasus
          </Link>
          <Link href="/kasus" className="btn btn-primary">
            Kembali ke Kasus <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </SiteFrame>
  );
}
