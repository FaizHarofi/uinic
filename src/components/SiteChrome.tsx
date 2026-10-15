'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/kasus', label: 'Kasus' },
  { href: '/panduan', label: 'Panduan' },
  { href: '/progres', label: 'Progres' },
];

function isActive(path: string, href: string) {
  return href === '/kasus' ? path === '/kasus' || path.startsWith('/kasus/') || path.startsWith('/main/') || path.startsWith('/hasil/') : path === href;
}

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--white)] shadow-[0_1px_3px_rgba(23,36,58,0.04)]">
      <div className="mx-auto flex h-[62px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5 min-w-0">
          <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[8px] border border-[var(--line-strong)] bg-[var(--ink)] text-[var(--white)] shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="h-4.5 w-4.5 text-[var(--yellow)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
              <path d="M11 8v3" stroke="#D94B4B" strokeWidth="2.5" />
              <circle cx="11" cy="14" r="0.6" fill="#D94B4B" />
            </svg>
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-[1.2rem] font-bold leading-none tracking-tight text-[var(--ink)] sm:text-[1.32rem]">
              AWAS&nbsp;SCAM<span className="text-[var(--teal-deep)]">!</span>
            </span>
            <span className="text-[0.62rem] font-semibold tracking-wider uppercase text-[var(--ink-muted)] sm:text-[0.68rem]">
              Detektif Digital
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {links.map((link) => {
            const active = isActive(path, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`relative px-3.5 py-2 text-[0.92rem] font-semibold transition-colors ${
                  active
                    ? 'text-[var(--ink)] font-bold'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-3.5 right-3.5 h-[2.5px] rounded-full bg-[var(--teal-deep)]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="grid h-9 w-9 place-items-center rounded-[8px] border border-[var(--line-strong)] bg-[var(--white)] text-[var(--ink)] hover:bg-[var(--mist)] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="animate-rise border-t border-[var(--line)] bg-[var(--white)] px-5 py-3 md:hidden shadow-lg" aria-label="Navigasi mobile">
          <div className="space-y-1">
            {links.map((link) => {
              const active = isActive(path, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center justify-between rounded-md px-3 py-2.5 text-[0.96rem] font-semibold transition-colors ${
                    active
                      ? 'bg-[var(--teal-tint)] text-[var(--teal-deep)] font-bold'
                      : 'text-[var(--ink-soft)] hover:bg-[var(--mist)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="h-2 w-2 rounded-full bg-[var(--teal-deep)]" />}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--white)] px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 font-serif text-[1.25rem] font-bold text-[var(--ink)]">
              AWAS SCAM<span className="text-[var(--teal-deep)]">!</span>
            </Link>
            <p className="mt-2 text-[0.9rem] leading-6 text-[var(--ink-muted)]">
              Game edukasi berbasis investigasi interaktif untuk mengenali modus penipuan digital di Indonesia.
              Kembangkan naluri kritis sebelum mengambil keputusan di dunia maya.
            </p>
            <p className="mt-3 text-[0.82rem] font-medium text-[var(--ink-soft)]">
              Dikembangkan oleh Cyber Defense Studios
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[0.78rem] font-bold tracking-wider uppercase text-[var(--ink-muted)]">
              Navigasi Halaman
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem] font-semibold text-[var(--ink-soft)]">
              <Link href="/kasus" className="hover:text-[var(--teal-deep)] transition-colors">
                Berkas Kasus
              </Link>
              <Link href="/panduan" className="hover:text-[var(--teal-deep)] transition-colors">
                Panduan Literasi
              </Link>
              <Link href="/progres" className="hover:text-[var(--teal-deep)] transition-colors">
                Progres Belajar
              </Link>
              <Link href="/tentang" className="hover:text-[var(--teal-deep)] transition-colors">
                Tentang & Kredit
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-[0.82rem] text-[var(--ink-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Semua skenario, nama tokoh, institusi, dan nomor telepon fiktif untuk tujuan simulasi edukasi.
          </p>
          <p className="shrink-0">
            100% Berjalan di browser · Bebas pelacak
          </p>
        </div>
      </div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
