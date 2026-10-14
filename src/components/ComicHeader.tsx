'use client';

import React from 'react';
import { Volume2, VolumeX, BookOpen, RotateCcw, Coins, ShieldAlert, Sparkles, LayoutGrid } from 'lucide-react';
import { GameChapter } from '../types/game';
import { playClick } from '../utils/sound';

interface ComicHeaderProps {
  currentChapter: GameChapter;
  waspadaMeter: number;
  educationPoints: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHandbook: () => void;
  onResetCase: () => void;
  onSelectChapterMenu: () => void;
}

export const ComicHeader: React.FC<ComicHeaderProps> = ({
  currentChapter,
  waspadaMeter,
  educationPoints,
  soundEnabled,
  onToggleSound,
  onOpenHandbook,
  onResetCase,
  onSelectChapterMenu,
}) => {
  const getMeterStatus = () => {
    if (waspadaMeter >= 80) return { label: 'SANGAT WASPADA', color: 'from-emerald-500 to-green-600', text: 'text-emerald-300' };
    if (waspadaMeter >= 50) return { label: 'SIAGA SIBER', color: 'from-amber-400 to-yellow-500', text: 'text-yellow-300' };
    return { label: 'RENTAN SCAM', color: 'from-rose-500 to-red-600', text: 'text-rose-400' };
  };

  const getChapterInfo = () => {
    switch (currentChapter) {
      case 2:
        return {
          title: 'KASUS 2: PANGGILAN CS BANK GADUNGAN',
          sub: 'Vishing & Manipulasi Kode OTP',
        };
      case 3:
        return {
          title: 'KASUS 3: FREELANCE LIKE VIDEO & KRIPTO',
          sub: 'Skema Ponzi & Website Bursa Bodong',
        };
      default:
        return {
          title: 'KASUS 1: MODUS APK RESI KURIR',
          sub: 'Sniffing SMS & Malware Berbahaya',
        };
    }
  };

  const meter = getMeterStatus();
  const chInfo = getChapterInfo();

  return (
    <header className="w-full bg-slate-950/95 backdrop-blur border-b-4 border-black px-4 py-2 flex items-center justify-between text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-30 select-none">
      {/* KIRI: Logo & Info Chapter */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playClick();
            onSelectChapterMenu();
          }}
          className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black px-3 py-1 rounded border-2 border-black -rotate-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-base tracking-wider transition-all"
          title="Kembali ke Menu Pilihan Kasus"
        >
          <ShieldAlert className="w-4 h-4 text-red-600 stroke-[2.5]" />
          AWAS SCAM!
        </button>

        <div className="hidden lg:block text-xs text-slate-300 border-l border-slate-800 pl-3">
          <div className="font-bold text-amber-300 tracking-wide">{chInfo.title}</div>
          <div className="text-[11px] text-slate-400 italic">"{chInfo.sub}"</div>
        </div>
      </div>

      {/* TENGAH: Waspada Meter & Poin Edukasi */}
      <div className="flex items-center gap-4">
        {/* Waspada Meter Card */}
        <div className="bg-slate-900/95 border-2 border-slate-700/80 rounded-lg px-3.5 py-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex flex-col items-center min-w-[200px]">
          <div className="flex justify-between w-full text-[11px] font-bold mb-1">
            <span className="text-slate-200 uppercase tracking-wider flex items-center gap-1">
              Waspada Meter
            </span>
            <span className={`text-[10px] ${meter.text} tracking-wider font-extrabold`}>
              {meter.label}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${meter.color} transition-all duration-500 ease-out shadow-[0_0_8px_rgba(255,255,255,0.4)]`}
              style={{ width: `${Math.max(5, Math.min(100, waspadaMeter))}%` }}
            />
          </div>
        </div>

        {/* Poin Edukasi Badge */}
        <div className="bg-slate-900/95 border-2 border-amber-500/70 rounded-lg px-3 py-1 flex items-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 flex items-center justify-center border border-amber-200 shadow-sm animate-pulse">
            <Coins className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-amber-200 font-semibold uppercase leading-tight">Poin Edukasi</span>
            <span className="text-sm font-black text-amber-400 tracking-tight leading-none flex items-center gap-1">
              {educationPoints}
              <Sparkles className="w-3 h-3 text-amber-300 inline" />
            </span>
          </div>
        </div>
      </div>

      {/* KANAN: Tools & Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            playClick();
            onSelectChapterMenu();
          }}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs px-2.5 py-1.5 rounded border border-slate-700 transition-all"
          title="Pilih Kasus / Bab Lain"
        >
          <LayoutGrid className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Pilih Kasus</span>
        </button>

        <button
          onClick={() => {
            playClick();
            onOpenHandbook();
          }}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs px-2.5 py-1.5 rounded border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
          title="Buka Buku Panduan Literasi Siber"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden md:inline">Buku Panduan</span>
        </button>

        <button
          onClick={() => {
            playClick();
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
          title="Mode Layar Penuh (Fullscreen)"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>

        <button
          onClick={() => {
            playClick();
            onToggleSound();
          }}
          className={`p-1.5 rounded border-2 border-black font-bold active:scale-95 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all ${
            soundEnabled ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-slate-700 text-slate-400'
          }`}
          title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            playClick();
            onResetCase();
          }}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
          title="Ulangi Kasus Ini"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
