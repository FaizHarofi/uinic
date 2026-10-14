'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertOctagon, ArrowLeft, Sparkles, HelpCircle, FileCode } from 'lucide-react';
import { RedFlag } from '../types/game';
import { playBuzz, playClick, playEvidenceFound } from '../utils/sound';

interface InspectModalProps {
  redFlags: RedFlag[];
  onFoundRedFlag: (flagId: string) => void;
  onFinishInspection: () => void;
}

export const InspectModal: React.FC<InspectModalProps> = ({
  redFlags,
  onFoundRedFlag,
  onFinishInspection,
}) => {
  const [activeExplanation, setActiveExplanation] = useState<RedFlag | null>(null);
  const [missMessage, setMissMessage] = useState<string | null>(null);

  const foundCount = redFlags.filter((f) => f.isFound).length;
  const isKeyFound = redFlags.find((f) => f.id === 'flag-ext')?.isFound;

  const handleInspectTarget = (flagId: string) => {
    const flag = redFlags.find((f) => f.id === flagId);
    if (!flag) return;

    if (!flag.isFound) {
      playEvidenceFound();
      onFoundRedFlag(flagId);
    } else {
      playClick();
    }
    setActiveExplanation(flag);
    setMissMessage(null);
  };

  const handleMisclick = (msg: string) => {
    playBuzz();
    setMissMessage(msg);
    setTimeout(() => {
      setMissMessage(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-slate-900 border-4 border-amber-400 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Inspeksi Komik */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 flex items-center justify-between border-b-4 border-black text-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-amber-400 rounded-lg border-2 border-black -rotate-3">
              <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide flex items-center gap-2">
                MODE INVESTIGASI: SPOT THE RED FLAGS!
              </h2>
              <p className="text-xs md:text-sm font-bold text-slate-900">
                Klik bagian-bagian chat yang mencurigakan di layar HP Ibu untuk mengumpulkan bukti!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Counter */}
            <div className="bg-black text-white px-3.5 py-1.5 rounded-xl border-2 border-black font-black text-sm flex items-center gap-2">
              <span>BUKTI DITEMUKAN:</span>
              <span className="text-amber-400 text-base">{foundCount} / 3</span>
            </div>
          </div>
        </div>

        {/* Content Area: Split View (Layar Chat WhatsApp di Kiri, Penjelasan Bukti di Kanan) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto bg-slate-950/70">
          
          {/* SISI KIRI: Simulasi Layar WhatsApp HP Ibu (7 Kolom) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-md bg-[#0b141a] rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
              
              {/* WhatsApp App Bar */}
              <div
                onClick={() => handleInspectTarget('flag-sender')}
                className={`px-4 py-3 bg-[#202c33] flex items-center justify-between border-b border-slate-700 cursor-pointer transition-all ${
                  redFlags.find((f) => f.id === 'flag-sender')?.isFound
                    ? 'ring-4 ring-emerald-500/80 bg-emerald-950/30'
                    : 'hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-white text-sm">
                    📦
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-100 font-bold text-sm">
                      Kurir J&T Express (Gudang)
                      <span className="text-[10px] text-amber-400 font-normal border border-amber-400/40 rounded px-1">
                        Bukan Akun Resmi
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">+62 895-3342-9912</div>
                  </div>
                </div>

                {redFlags.find((f) => f.id === 'flag-sender')?.isFound && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              {/* Chat Message Bubble Canvas */}
              <div className="p-4 space-y-4 bg-[#0c1317] min-h-[380px] flex flex-col justify-end text-sm">
                
                {/* Bubble Chat dari Penipu */}
                <div className="bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-none p-3.5 max-w-[90%] border border-slate-700/80 shadow-md space-y-2.5">
                  <p>
                    Selamat malam Ibu. Kami dari pihak ekspedisi menginfokan bahwa paket atas nama Ibu tertahan di gudang karena alamat kurang lengkap.
                  </p>

                  {/* TARGET RED FLAG 2: Urgensi Panik */}
                  <div
                    onClick={() => handleInspectTarget('flag-urgency')}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      redFlags.find((f) => f.id === 'flag-urgency')?.isFound
                        ? 'bg-emerald-950/50 border-2 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/30 hover:bg-rose-900/40 border-2 border-dashed border-rose-500/60 text-rose-300'
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                      "MOHON SEGERA DIBUKA DALAM 10 MENIT ATAU PAKET AKAN DIKEMBALIKAN KE PENJUAL!"
                    </p>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {redFlags.find((f) => f.id === 'flag-urgency')?.isFound
                        ? '✓ Terbukti Manipulasi Panik'
                        : '🔍 Klik untuk periksa kalimat ini'}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">
                    Silakan unduh dan instal bukti foto resi paket di bawah ini:
                  </p>

                  {/* TARGET RED FLAG 1 (UTAMA): File APK Penyamaran */}
                  <div
                    onClick={() => handleInspectTarget('flag-ext')}
                    className={`rounded-xl p-3 cursor-pointer transition-all ${
                      redFlags.find((f) => f.id === 'flag-ext')?.isFound
                        ? 'bg-emerald-950/60 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-900 hover:bg-slate-800 border-2 border-dashed border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-rose-600 rounded-lg text-white font-black text-xs flex flex-col items-center">
                        <FileCode className="w-6 h-6" />
                        <span>APK</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs font-black truncate text-amber-300 flex items-center gap-1">
                          Lihat_Foto_Paket.pdf.apk
                        </div>
                        <div className="text-[11px] text-slate-400">Ukuran: 8.4 MB • File Instalasi Android</div>
                      </div>
                    </div>

                    <div className="mt-2 text-center py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center justify-center gap-1.5">
                      {redFlags.find((f) => f.id === 'flag-ext')?.isFound ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                          <span>BAHAYA TERBONGKAR: INI APLIKASI MALWARE!</span>
                        </>
                      ) : (
                        <span>🔍 KLIK FILE INI UNTUK MEMERIKSA FORMATNYA</span>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 text-right">20:14 WIB</div>
                </div>

                {/* Feedback saat salah klik area lain */}
                {missMessage && (
                  <div className="bg-rose-900/90 text-white text-xs px-3 py-1.5 rounded-lg border border-rose-500 animate-shake text-center">
                    {missMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SISI KANAN: Panel Hasil Analisis Detektif (5 Kolom) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Penjelasan Bukti Aktif */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 shadow-lg flex-1">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Catatan Analisis Bukti
              </h3>

              {activeExplanation ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/60 rounded-xl">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      {activeExplanation.name}
                    </span>
                    <p className="text-sm font-bold text-white mt-1">
                      {activeExplanation.description}
                    </p>
                  </div>
                  
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-amber-300 block mb-1">Kenapa Ini Bahaya?</span>
                    {activeExplanation.explanation}
                  </div>

                  <div className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> +{activeExplanation.points} Poin Edukasi Didapatkan!
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 border border-dashed border-slate-800 rounded-xl">
                  <HelpCircle className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-sm font-semibold">
                    Klik item di layar chat (file, kalimat, atau profil kontak) untuk mengungkap kejanggalan!
                  </p>
                </div>
              )}
            </div>

            {/* Checklist Bukti Ringkas */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Daftar Cek Keamanan:
              </div>
              {redFlags.map((flag) => (
                <div
                  key={flag.id}
                  onClick={() => handleInspectTarget(flag.id)}
                  className={`flex items-center justify-between text-xs p-2 rounded-lg border cursor-pointer transition-all ${
                    flag.isFound
                      ? 'bg-emerald-950/30 border-emerald-600 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">{flag.name}</span>
                  {flag.isFound ? (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                      DITEMUKAN
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">Belum Dicek</span>
                  )}
                </div>
              ))}
            </div>

            {/* Tombol Aksi Kembali */}
            <div className="pt-2">
              <button
                onClick={() => {
                  playClick();
                  onFinishInspection();
                }}
                disabled={!isKeyFound}
                className={`w-full py-3.5 px-5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                  isKeyFound
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                {isKeyFound
                  ? 'Konfirmasi Bukti & Edukasi Ibu!'
                  : 'Temukan File APK Terlebih Dahulu'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
