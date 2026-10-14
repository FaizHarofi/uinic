'use client';

import React, { useState } from 'react';
import {
  Pin,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ShieldAlert,
  Brain,
  UserX,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Move,
} from 'lucide-react';
import { GameChapter, PinboardClue, PinboardTargetCategory } from '../types/game';
import { playBuzz, playClick, playEvidenceFound, playStampReveal } from '../utils/sound';

interface PinboardModalProps {
  chapter: GameChapter;
  clues: PinboardClue[];
  onFinishPinboard: () => void;
}

export const PinboardModal: React.FC<PinboardModalProps> = ({
  chapter,
  clues,
  onFinishPinboard,
}) => {
  const [clueList, setClueList] = useState<PinboardClue[]>(clues);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const categories: {
    id: PinboardTargetCategory;
    title: string;
    subtitle: string;
    color: string;
    border: string;
    bg: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'malware',
      title: 'MUATAN TEKNIS MALWARE',
      subtitle: 'Program jahat, ekstensi palsu, & penyadapan sistem',
      color: 'text-rose-400',
      border: 'border-rose-500/80',
      bg: 'bg-rose-950/30',
      icon: <FileCode className="w-5 h-5 text-rose-400" />,
    },
    {
      id: 'social_eng',
      title: 'MANIPULASI PSIKOLOGIS',
      subtitle: 'Pemicu panik, rasa takut, & iming-iming keserakahan',
      color: 'text-amber-400',
      border: 'border-amber-500/80',
      bg: 'bg-amber-950/30',
      icon: <Brain className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'impersonation',
      title: 'IDENTITAS & REKAM JEJAK PALSU',
      subtitle: 'Penyamaran instansi, nomor asing, & bursa fiktif',
      color: 'text-cyan-400',
      border: 'border-cyan-500/80',
      bg: 'bg-cyan-950/30',
      icon: <UserX className="w-5 h-5 text-cyan-400" />,
    },
  ];

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, clueId: string) => {
    e.dataTransfer.setData('text/plain', clueId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnCategory = (e: React.DragEvent, categoryId: PinboardTargetCategory) => {
    e.preventDefault();
    const clueId = e.dataTransfer.getData('text/plain');
    if (!clueId) return;
    executePlacement(clueId, categoryId);
  };

  // Click-to-move handler
  const handleSelectClue = (clueId: string) => {
    playClick();
    setSelectedClueId(selectedClueId === clueId ? null : clueId);
  };

  const handleCategoryClick = (categoryId: PinboardTargetCategory) => {
    if (!selectedClueId) return;
    executePlacement(selectedClueId, categoryId);
    setSelectedClueId(null);
  };

  // Logic verification
  const executePlacement = (clueId: string, categoryId: PinboardTargetCategory) => {
    const clue = clueList.find((c) => c.id === clueId);
    if (!clue) return;

    if (clue.targetCategory === categoryId) {
      playStampReveal();
      setTimeout(() => playEvidenceFound(), 200);

      const updated = clueList.map((c) =>
        c.id === clueId ? { ...c, currentCategory: categoryId } : c
      );
      setClueList(updated);
      setFeedback(`TEPAT! "${clue.title}" berhasil dihubungkan dengan benang merah!`);
      setTimeout(() => setFeedback(null), 2500);
    } else {
      playBuzz();
      setFeedback(`KURANG PAS: "${clue.title}" bukan kategori itu. Coba teliti apakah itu manipulasi emosi, muatan kode, atau identitas palsu!`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const unsortedClues = clueList.filter((c) => c.currentCategory === null);
  const isAllSolved = unsortedClues.length === 0;

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 select-none overflow-hidden font-sans">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#1a1510] border-6 border-[#3e2e1c] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden">
        
        {/* Corkboard Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#2d1f11_2px,transparent_2px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Header Papan Detektif */}
        <div className="bg-[#241a10] border-b-4 border-[#3e2e1c] px-6 py-3.5 flex items-center justify-between text-white z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-black flex items-center justify-center shadow-lg -rotate-6">
              <Pin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-amber-200 tracking-wider uppercase flex items-center gap-2">
                PAPAN INVESTIGASI BENANG MERAH (DETECTIVE PINBOARD)
              </h2>
              <p className="text-xs text-amber-100/70 font-medium">
                Tarik (Drag) atau Klik kartu bukti di bawah ke kategori kejahatan yang sesuai!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-500/40">
              KORELASI: {clueList.filter((c) => c.currentCategory !== null).length} / {clueList.length}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-6 z-10 flex flex-col justify-between">
          
          {/* 1. CLUE POOL (Kartu Bukti yang Belum Dipasang) */}
          <div className="bg-black/50 border-2 border-amber-900/60 rounded-2xl p-4 shadow-inner">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Move className="w-4 h-4 text-amber-400" />
                Kartu Bukti Temuan (Drag ke Bawah atau Klik untuk Memilih):
              </span>
              {selectedClueId && (
                <span className="text-[11px] font-bold text-emerald-300 animate-pulse">
                  Kartu Terpilih! Sekarang klik salah satu kotak kategori di bawah.
                </span>
              )}
            </div>

            {unsortedClues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {unsortedClues.map((clue) => {
                  const isSelected = selectedClueId === clue.id;
                  return (
                    <div
                      key={clue.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, clue.id)}
                      onClick={() => handleSelectClue(clue.id)}
                      className={`relative p-3.5 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 shadow-lg bg-[#2d2218] ${
                        isSelected
                          ? 'border-yellow-300 ring-4 ring-yellow-400/50 scale-105'
                          : 'border-amber-700/80 hover:border-amber-400'
                      }`}
                    >
                      {/* Red Pin Header */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-black shadow" />
                      
                      <div className="pt-1">
                        <div className="text-xs font-black text-amber-200 mb-1 leading-snug">
                          {clue.title}
                        </div>
                        <div className="text-[11px] text-slate-300 leading-snug">
                          {clue.snippet}
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-amber-900/50 flex items-center justify-between text-[10px] text-amber-400 font-bold">
                        <span>Tarik atau Klik</span>
                        <Move className="w-3 h-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Semua kartu bukti telah berhasil dipasang ke papan investigasi!
              </div>
            )}
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div className="p-3 bg-black/80 border-2 border-amber-400 rounded-xl text-center text-xs md:text-sm font-bold text-amber-300 animate-in fade-in duration-200">
              {feedback}
            </div>
          )}

          {/* 2. THREE TARGET CATEGORY DROPZONES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const placedClues = clueList.filter((c) => c.currentCategory === cat.id);
              return (
                <div
                  key={cat.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnCategory(e, cat.id)}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`relative p-4 rounded-2xl border-3 border-dashed ${cat.border} ${cat.bg} backdrop-blur-md min-h-[220px] flex flex-col justify-between transition-all cursor-pointer hover:bg-black/40 group`}
                >
                  {/* Decorative Pin at Top Left */}
                  <div className="absolute -top-3 left-4 w-6 h-6 rounded-full bg-red-600 border-2 border-black flex items-center justify-center shadow-lg -rotate-12">
                    <Pin className="w-3.5 h-3.5 text-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1 mt-1">
                      {cat.icon}
                      <h3 className={`text-sm font-black uppercase tracking-wide ${cat.color}`}>
                        {cat.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 leading-tight">
                      {cat.subtitle}
                    </p>

                    {/* Placed Clues Stack */}
                    <div className="space-y-2">
                      {placedClues.map((clue) => (
                        <div
                          key={clue.id}
                          className="p-2.5 rounded-lg bg-black/70 border border-emerald-500/80 text-white text-xs shadow animate-in zoom-in-95 duration-200"
                        >
                          <div className="flex items-center justify-between text-emerald-400 font-bold mb-0.5">
                            <span>✓ {clue.title}</span>
                            <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">
                              TERPIN
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-300">{clue.snippet}</div>
                        </div>
                      ))}

                      {placedClues.length === 0 && (
                        <div className="py-8 text-center text-slate-500 border border-dashed border-slate-700/60 rounded-xl text-xs flex flex-col items-center justify-center gap-1.5">
                          <HelpCircle className="w-6 h-6 text-slate-600" />
                          <span>Drop bukti ke sini</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Red String Indicator */}
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Bukti Terhubung:</span>
                    <span className={placedClues.length > 0 ? 'text-emerald-400 font-black' : 'text-slate-500'}>
                      {placedClues.length} Kartu
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Action Button */}
        <div className="bg-[#241a10] border-t-4 border-[#3e2e1c] px-6 py-3.5 flex items-center justify-between z-10">
          <div className="text-xs text-amber-200 font-bold">
            {isAllSolved
              ? '🎉 Semua korelasi bukti telah terhubung sempurna!'
              : '⚠️ Hubungkan semua kartu temuan ke dalam 3 kategori di atas.'}
          </div>

          <button
            onClick={() => {
              if (isAllSolved) {
                playStampReveal();
                onFinishPinboard();
              } else {
                playBuzz();
                setFeedback('Pasang semua kartu bukti terlebih dahulu untuk menarik kesimpulan utuh!');
              }
            }}
            disabled={!isAllSolved}
            className={`py-3 px-6 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 border-2 border-black transition-all shadow-[3px_3px_0px_rgba(0,0,0,1)] ${
              isAllSolved
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 active:scale-95 animate-bounce'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
            }`}
          >
            <span>Tarik Kesimpulan & Lanjutkan Cerita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
