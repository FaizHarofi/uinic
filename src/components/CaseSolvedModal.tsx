'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { GameChapter } from '../types/game';
import { playClick, playVictory } from '../utils/sound';

interface CaseSolvedModalProps {
  currentChapter: GameChapter;
  score: number;
  waspadaMeter: number;
  onNextChapter: () => void;
  onRestartCurrent: () => void;
  onOpenHandbook: () => void;
}

export const CaseSolvedModal: React.FC<CaseSolvedModalProps> = ({
  currentChapter,
  score,
  waspadaMeter,
  onNextChapter,
  onRestartCurrent,
  onOpenHandbook,
}) => {
  useEffect(() => {
    playVictory();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  const getChapterDebrief = () => {
    switch (currentChapter) {
      case 2:
        return {
          title: 'KASUS 2 SELESAI: PANGGILAN CS GADUNGAN DIBONGKAR!',
          sub: 'Kamu berhasil melindungi rekening Ayah dari jebakan Vishing dan pencurian kode OTP.',
          badge: 'PENJAGA KODE OTP 🛡️',
          points: [
            '1. Bank resmi TIDAK PERNAH meminta kode OTP / PIN dalam kondisi apapun.',
            '2. Nomor CS Bank resmi selalu 5-7 digit (HaloBCA 1500888, Mandiri 14000), bukan nomor seluler GSM biasa (+62 8xx).',
            '3. Selalu tolak permintaan darurat dan telepon balik ke nomor hotline resmi.',
          ],
          nextText: 'Lanjut ke Kasus 3: Jebakan Freelance & Kripto',
        };
      case 3:
        return {
          title: 'KASUS 3 SELESAI: JEBAKAN FREELANCE TERBONGKAR!',
          sub: 'Kamu berhasil menyelamatkan Rian dari skema penipuan Pig Butchering & bursa kripto palsu.',
          badge: 'DETEKTIF SIBER ELITE 🏆',
          points: [
            '1. Modus like video YouTube adalah umpan awal skema Ponzi sebelum korban diminta deposit besar.',
            '2. Selalu cek usia domain di WHOIS dan rekam jejak rekening di cekrekening.id sebelum transfer.',
            '3. Waspadai foto founder/testimoni fiktif yang dicomot dari internet.',
          ],
          nextText: 'Selesai! Mainkan Ulang dari Kasus 1',
        };
      default:
        return {
          title: 'KASUS 1 SELESAI: TABUNGAN IBU DISELAMATKAN!',
          sub: 'Kamu berhasil membongkar malware sniffing APK yang menyamar sebagai resi kurir.',
          badge: 'PENYELAMAT TABUNGAN IBU 🛡️',
          points: [
            '1. Jangan pernah instal file berekstensi .apk yang dikirim orang tak dikenal di WhatsApp.',
            '2. Taktik panik batas waktu 10 menit adalah manipulasi psikologis Social Engineering.',
            '3. Cek resi paket pengiriman HANYA melalui aplikasi atau website resmi ekspedisi.',
          ],
          nextText: 'Lanjut ke Kasus 2: Panggilan CS Bank Gadungan',
        };
    }
  };

  const debrief = getChapterDebrief();

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(245,158,11,0.4)] flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-300">
        
        {/* Badge Lencana */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 border-4 border-black flex items-center justify-center -rotate-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <Award className="w-12 h-12 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="absolute -bottom-2 -right-3 bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-black rotate-6 shadow-sm">
            GRADE S
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            {debrief.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide mt-1">
            {debrief.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
            {debrief.sub}
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-2 gap-3.5 w-full max-w-md">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 uppercase font-bold">Total Poin Edukasi</span>
            <div className="text-2xl font-black text-amber-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-300" />
              {score}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 uppercase font-bold">Status Keamanan</span>
            <div className="text-lg font-black text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-5 h-5" />
              100% AMAN
            </div>
          </div>
        </div>

        {/* Rangkuman Edukasi */}
        <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-4 w-full text-left text-xs md:text-sm text-slate-200 space-y-1.5">
          <div className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Apa yang kamu pelajari di bab ini:
          </div>
          <div className="space-y-1 text-slate-300 leading-relaxed text-xs">
            {debrief.points.map((pt, idx) => (
              <div key={idx}>{pt}</div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-1">
          {/* Tombol Lanjut ke Chapter Berikutnya (Primary) */}
          <button
            onClick={() => {
              playClick();
              onNextChapter();
            }}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>{debrief.nextText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              playClick();
              onRestartCurrent();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
            title="Mainkan ulang bab ini"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Bab</span>
          </button>

          <button
            onClick={() => {
              playClick();
              onOpenHandbook();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
            title="Buka panduan literasi"
          >
            <BookOpen className="w-4 h-4" />
            <span>Panduan</span>
          </button>
        </div>

      </div>
    </div>
  );
};
