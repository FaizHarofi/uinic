import type { ComponentType } from 'react';
import { GameChapter } from '../types/game';
import { FileText, Package, PhoneCall, Lock, TrendingUp, ShieldAlert } from 'lucide-react';

/* Sampul kasus = potongan bukti digital yang otentik, digambar dengan HTML/CSS.
   Bukan ilustrasi dekoratif: ini adalah bahan yang akan diperiksa pemain. */

const WA = { bg: '#0b141a', bar: '#202c33', bubble: '#202c33', border: '#2a3942', text: '#e9edef', sub: '#8696a0' };

function ChatScene() {
  return (
    <div className="absolute inset-0 flex flex-col text-left" style={{ background: WA.bg }}>
      <div className="flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5" style={{ background: WA.bar }}>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#3b4a54] sm:h-8 sm:w-8">
          <Package size={14} className="text-[#cfd8dc]" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.68rem] font-semibold sm:text-[0.8rem]" style={{ color: WA.text }}>
            Kurir J&amp;T Express (Gudang)
          </p>
          <p className="font-mono text-[0.58rem] sm:text-[0.68rem]" style={{ color: WA.sub }}>
            +62 895-3342-9912
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-1.5 p-2.5 sm:p-3.5">
        <div className="max-w-[86%] rounded-lg rounded-tl-none px-2.5 py-2" style={{ background: WA.bubble, border: `1px solid ${WA.border}` }}>
          <p className="text-[0.6rem] leading-relaxed sm:text-[0.74rem]" style={{ color: WA.text }}>
            Selamat malam Ibu. Paket atas nama Ibu tertahan di gudang. <span className="font-bold">MOHON SEGERA DIBUKA DALAM 10 MENIT</span> atau paket dikembalikan ke penjual.
          </p>
          <div className="mt-1.5 flex items-center gap-2 rounded-md px-2 py-1.5" style={{ background: '#161f27', border: `1px solid ${WA.border}` }}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded bg-[#3b2a2a] sm:h-8 sm:w-8">
              <FileText size={14} className="text-[#e57373]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-[0.56rem] font-semibold sm:text-[0.68rem]" style={{ color: WA.text }}>
                Lihat_Foto_Paket.pdf.apk
              </p>
              <p className="text-[0.5rem] sm:text-[0.6rem]" style={{ color: WA.sub }}>
                8,4 MB · File instalasi
              </p>
            </div>
          </div>
          <p className="mt-1 text-right font-mono text-[0.5rem] sm:text-[0.58rem]" style={{ color: WA.sub }}>20:14</p>
        </div>
      </div>
    </div>
  );
}

function CallScene() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center" style={{ background: 'linear-gradient(180deg, #101820 0%, #0b141a 100%)' }}>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[#2a3942] sm:h-16 sm:w-16">
        <PhoneCall size={22} className="text-[#8696a0] sm:size-7" />
      </span>
      <div>
        <p className="text-[0.85rem] font-bold sm:text-xl" style={{ color: WA.text }}>&ldquo;HaloBCA&rdquo;</p>
        <p className="text-[0.6rem] sm:text-[0.75rem]" style={{ color: WA.sub }}>Customer Service</p>
      </div>
      <p className="font-mono text-[0.62rem] font-semibold tracking-wide sm:text-sm" style={{ color: '#e57373' }}>+62 821-9988-7711</p>
      <div className="mt-1 flex h-6 items-end gap-[2px] sm:h-8" aria-hidden>
        {[9, 16, 11, 20, 14, 22, 10, 17, 12, 19, 8, 15].map((h, i) => (
          <span key={i} className="w-[3px] rounded-full bg-[#3b4a54] sm:w-1" style={{ height: `${h * 0.9}px` }} />
        ))}
      </div>
      <p className="font-mono text-[0.6rem] sm:text-[0.72rem]" style={{ color: WA.sub }}>00:42</p>
    </div>
  );
}

function BrowserScene() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#f3f5f8] text-left">
      <div className="flex items-center gap-2 border-b border-[#dce2ea] bg-white px-2.5 py-1.5 sm:px-3.5">
        <span className="flex shrink-0 gap-1" aria-hidden>
          <i className="block h-2 w-2 rounded-full bg-[#ff5f57]" />
          <i className="block h-2 w-2 rounded-full bg-[#febc2e]" />
          <i className="block h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded border border-[#dce2ea] bg-[#f3f5f8] px-2 py-0.5">
          <Lock size={9} className="shrink-0 text-[#d94b4b]" />
          <span className="truncate font-mono text-[0.5rem] sm:text-[0.62rem]" style={{ color: '#b03535' }}>
            https://bursakripto-vip.xyz/task-vip
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-1 rounded bg-[#fbebeb] px-1.5 py-0.5 text-[0.5rem] font-bold text-[#b03535] sm:flex">
          <ShieldAlert size={9} /> TIDAK AMAN
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-3" style={{ background: '#14120c' }}>
        <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-[#f0c75e] sm:text-[0.68rem]">Platform #1 Indonesia</p>
        <p className="text-[0.9rem] font-extrabold tracking-tight text-[#f5e6b8] sm:text-xl" style={{ fontFamily: "'Public Sans', sans-serif" }}>
          BursaKriptoNusantara
        </p>
        <p className="rounded bg-[#f0c75e] px-1.5 py-0.5 text-[0.5rem] font-bold text-[#14120c] sm:text-[0.6rem]">VIP MEMBER AREA · Profit 300%</p>
        <div className="mt-1 flex h-8 items-end gap-[3px] sm:h-10" aria-hidden>
          {[30, 42, 35, 55, 48, 66, 72, 64, 80, 88, 95].map((h, i) => (
            <span key={i} className="w-[5px] rounded-t-sm bg-[#2e8b57] sm:w-2" style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="flex items-center gap-1 text-[0.5rem] text-[#8696a0] sm:text-[0.6rem]">
          <TrendingUp size={9} /> profit member live
        </p>
      </div>
    </div>
  );
}

const SCENES: Record<GameChapter, ComponentType> = {
  1: ChatScene,
  2: CallScene,
  3: BrowserScene,
};

export function CaseCover({ id, className = '' }: { id: GameChapter; className?: string }) {
  const Scene = SCENES[id];
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <Scene />
    </div>
  );
}
