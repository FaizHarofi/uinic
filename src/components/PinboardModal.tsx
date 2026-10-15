'use client';

import React, { useState } from 'react';
import {
  Pin,
  FileCode,
  Brain,
  UserX,
  HelpCircle,
  ArrowRight,
  Move,
  Check,
} from 'lucide-react';
import { PinboardClue, PinboardTargetCategory } from '../types/game';
import { Mascot } from './Mascot';
import { playBuzz, playClick, playEvidenceFound, playStampReveal } from '../utils/sound';

interface PinboardModalProps {
  clues: PinboardClue[];
  onFinishPinboard: () => void;
}

export const PinboardModal: React.FC<PinboardModalProps> = ({
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
    border: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'malware',
      title: 'Muatan teknis malware',
      subtitle: 'Program jahat, ekstensi palsu, & penyadapan sistem',
      border: 'border-[var(--red)]',
      icon: <FileCode className="h-5 w-5 text-[var(--red-deep)]" />,
    },
    {
      id: 'social_eng',
      title: 'Manipulasi psikologis',
      subtitle: 'Pemicu panik, rasa takut, & iming-iming keserakahan',
      border: 'border-[#E0B84A]',
      icon: <Brain className="h-5 w-5 text-[#6d5410]" />,
    },
    {
      id: 'impersonation',
      title: 'Identitas & rekam jejak palsu',
      subtitle: 'Penyamaran instansi, nomor asing, & bursa fiktif',
      border: 'border-[var(--ink)]',
      icon: <UserX className="h-5 w-5 text-[var(--ink)]" />,
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
      setFeedback(
        `KURANG PAS: "${clue.title}" bukan kategori itu. Coba teliti apakah itu manipulasi emosi, muatan kode, atau identitas palsu!`
      );
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const unsortedClues = clueList.filter((c) => c.currentCategory === null);
  const isAllSolved = unsortedClues.length === 0;
  const feedbackOk = feedback?.startsWith('TEPAT');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden bg-[rgba(14,22,38,0.65)] p-3 backdrop-blur-sm md:p-6">
      <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[14px] border border-[var(--line-strong)] bg-[var(--white)] shadow-[0_24px_70px_rgba(14,22,38,0.4)]">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-3.5 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="icon-tile shrink-0 !bg-[var(--red-tint)] !text-[var(--red-deep)]">
              <Pin className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[1.1rem] font-bold leading-tight md:text-[1.25rem]">
                Papan investigasi: benang merah
              </h2>
              <p className="truncate text-[0.8rem] text-[var(--ink-muted)]">
                Tarik (drag) atau klik kartu bukti, lalu pilih kategori kejahatan yang sesuai.
              </p>
            </div>
          </div>
          <span className={`chip shrink-0 ${isAllSolved ? 'chip-teal' : 'chip-yellow'}`}>
            Korelasi {clueList.filter((c) => c.currentCategory !== null).length} / {clueList.length}
          </span>
        </div>

        {/* Konten */}
        <div className="flex flex-1 flex-col justify-between space-y-5 overflow-y-auto bg-[var(--mist)] p-5 md:p-6">

          {/* 1. Kolam bukti */}
          <div className="card p-4">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink-soft)]">
                <Move className="h-4 w-4" />
                Kartu bukti temuan — tarik ke bawah atau klik untuk memilih
              </span>
              {selectedClueId && (
                <span className="text-[11px] font-bold text-[var(--teal-deep)]">
                  Kartu terpilih! Sekarang klik salah satu kotak kategori di bawah.
                </span>
              )}
            </div>

            {unsortedClues.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                {unsortedClues.map((clue) => {
                  const isSelected = selectedClueId === clue.id;
                  return (
                    <div
                      key={clue.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, clue.id)}
                      onClick={() => handleSelectClue(clue.id)}
                      className={`relative cursor-grab rounded-[10px] border bg-white p-3.5 transition-all hover:-translate-y-1 active:cursor-grabbing ${
                        isSelected
                          ? '-translate-y-0.5 border-[var(--teal-deep)] ring-2 ring-[var(--teal-deep)]'
                          : 'border-[var(--line-strong)] hover:border-[var(--ink)]'
                      }`}
                    >
                      {/* Pin */}
                      <span
                        className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-[var(--yellow)] shadow"
                        aria-hidden
                      />

                      <div className="pt-1">
                        <div className="mb-1 text-xs font-bold leading-snug text-[var(--ink)]">{clue.title}</div>
                        <div className="text-[11px] leading-snug text-[var(--ink-muted)]">{clue.snippet}</div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between border-t border-[var(--line)] pt-2 text-[10px] font-bold text-[var(--ink-muted)]">
                        <span>Tarik atau klik</span>
                        <Move className="h-3 w-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-[var(--teal-deep)]">
                <Mascot name="success" alt="" className="h-7 w-7" />
                Semua kartu bukti telah berhasil dipasang ke papan investigasi!
              </div>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`fade-slide-up rounded-[10px] border p-3 text-center text-xs font-bold md:text-sm ${
                feedbackOk
                  ? 'border-[#b9dcd9] bg-[var(--teal-tint)] text-[var(--teal-deep)]'
                  : 'border-[#f0c4c4] bg-[var(--red-tint)] text-[var(--red-deep)]'
              }`}
            >
              {feedback}
            </div>
          )}

          {/* 2. Tiga zona kategori */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {categories.map((cat) => {
              const placedClues = clueList.filter((c) => c.currentCategory === cat.id);
              return (
                <div
                  key={cat.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnCategory(e, cat.id)}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`relative flex min-h-[220px] cursor-pointer flex-col justify-between rounded-[12px] border-2 border-dashed bg-white p-4 transition-all hover:bg-[var(--mist)] ${cat.border}`}
                >
                  <div>
                    <div className="mb-1 mt-1 flex items-center gap-2">
                      {cat.icon}
                      <h3 className="text-sm font-bold text-[var(--ink)]">{cat.title}</h3>
                    </div>
                    <p className="mb-3 text-[11px] leading-tight text-[var(--ink-muted)]">{cat.subtitle}</p>

                    <div className="space-y-2">
                      {placedClues.map((clue) => (
                        <div
                          key={clue.id}
                          className="fade-slide-up rounded-[8px] border border-[#b9dcd9] bg-[var(--teal-tint)] p-2.5 text-xs"
                        >
                          <div className="mb-0.5 flex items-center justify-between font-bold text-[var(--teal-deep)]">
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3 stroke-[3]" /> {clue.title}
                            </span>
                            <span className="rounded border border-[#b9dcd9] bg-white px-1.5 py-0.5 text-[9px]">
                              TERPIN
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--ink-soft)]">{clue.snippet}</div>
                        </div>
                      ))}

                      {placedClues.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-[var(--line-strong)] py-8 text-center text-xs text-[var(--ink-muted)]">
                          <HelpCircle className="h-6 w-6 text-[var(--line-strong)]" />
                          <span>Jatuhkan bukti ke sini</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-2 text-[11px] font-bold text-[var(--ink-muted)]">
                    <span>Bukti terhubung:</span>
                    <span className={placedClues.length > 0 ? 'text-[var(--teal-deep)]' : ''}>
                      {placedClues.length} kartu
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-5 py-3.5 md:px-6">
          <div className="text-xs font-bold text-[var(--ink-soft)]">
            {isAllSolved
              ? 'Semua korelasi bukti telah terhubung sempurna!'
              : 'Hubungkan semua kartu temuan ke dalam 3 kategori di atas.'}
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
            className="btn btn-primary justify-center"
          >
            Tarik kesimpulan &amp; lanjutkan cerita
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
