'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileWarning, Hourglass, Check } from 'lucide-react';
import { EvidenceCard } from '../types/game';
import { Mascot } from './Mascot';
import { playBuzz, playClick, playDramaticHit, playEvidenceFound } from '../utils/sound';

interface DebateModalProps {
  evidenceList: EvidenceCard[];
  onCorrectEvidenceSubmitted: () => void;
  onWrongEvidence: () => void;
}

export const DebateModal: React.FC<DebateModalProps> = ({
  evidenceList,
  onCorrectEvidenceSubmitted,
  onWrongEvidence,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileWarning':
        return <FileWarning className="h-6 w-6 text-[var(--red-deep)]" />;
      case 'Hourglass':
        return <Hourglass className="h-6 w-6 text-[#6d5410]" />;
      default:
        return <ShieldCheck className="h-6 w-6 text-[var(--teal-deep)]" />;
    }
  };

  const handleSelect = (id: string) => {
    playClick();
    setSelectedId(id);
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (!selectedId) return;

    if (selectedId === 'ev-apk') {
      playDramaticHit();
      setTimeout(() => {
        playEvidenceFound();
      }, 400);

      setFeedback({
        isSuccess: true,
        text: 'Tepat sekali! "Lihat_Foto_Paket.pdf.apk" adalah file aplikasi Android (APK) yang menyamar. Jika dibuka, ia akan meminta izin akses SMS untuk mencuri kode OTP m-Banking Ibu!',
      });

      setTimeout(() => {
        onCorrectEvidenceSubmitted();
      }, 2200);
    } else {
      playBuzz();
      setFeedback({
        isSuccess: false,
        text: 'Bukti ini penting, tapi bukan bukti teknis utama yang menjelaskan mengapa file tersebut berbahaya untuk dipasang!',
      });
      onWrongEvidence();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(14,22,38,0.6)] p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col space-y-6 rounded-[14px] border border-[var(--line-strong)] bg-[var(--white)] p-6 shadow-[0_24px_70px_rgba(14,22,38,0.35)] md:p-8">

        {/* Header */}
        <div className="space-y-2 border-b border-[var(--line)] pb-4 text-center">
          <span className="chip chip-yellow">Konfrontasi bukti</span>
          <h2 className="text-[1.6rem] md:text-[1.9rem]">Sodorkan bukti terkuat kepada Ibu!</h2>
          <p className="mx-auto max-w-xl text-sm leading-6 text-[var(--ink-muted)]">
            Ibu masih ragu karena kurir terus mengancam. Pilih kartu bukti dari notebook
            investigasimu yang paling membuktikan bahwa ini adalah penipuan:
          </p>
        </div>

        {/* Pilihan kartu bukti */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {evidenceList.map((card) => {
            const isSelected = selectedId === card.id;
            return (
              <div
                key={card.id}
                onClick={() => handleSelect(card.id)}
                className={`flex cursor-pointer flex-col justify-between rounded-[10px] border p-5 transition-all ${
                  isSelected
                    ? '-translate-y-0.5 border-[var(--teal-deep)] bg-white shadow-[0_10px_30px_rgba(14,22,38,0.14)] ring-1 ring-[var(--teal-deep)]'
                    : 'border-[var(--line-strong)] bg-[var(--white)] hover:border-[var(--ink)]'
                }`}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="icon-tile !bg-[var(--mist)]">{getIcon(card.icon)}</span>
                    <span className="chip">{card.category}</span>
                  </div>

                  <h3 className="mb-2 text-base font-bold text-[var(--ink)]">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-[var(--ink-muted)]">{card.detailedFact}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-xs">
                  <span className="font-semibold text-[var(--ink-muted)]">Pilih kartu ini</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected ? 'border-[var(--teal-deep)] bg-[var(--teal-deep)] text-white' : 'border-[var(--line-strong)]'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`fade-slide-up flex items-start gap-3 rounded-[10px] border p-4 ${
              feedback.isSuccess
                ? 'border-[#b9dcd9] bg-[var(--teal-tint)]'
                : 'border-[#f0c4c4] bg-[var(--red-tint)]'
            }`}
          >
            {feedback.isSuccess ? (
              <Mascot name="success" alt="" className="mt-0.5 h-9 w-9 shrink-0" />
            ) : (
              <Mascot name="alert" alt="" className="mt-0.5 h-9 w-9 shrink-0" />
            )}
            <div
              className={`text-sm font-semibold leading-relaxed ${
                feedback.isSuccess ? 'text-[var(--teal-deep)]' : 'text-[var(--red-deep)]'
              }`}
            >
              {feedback.text}
            </div>
          </div>
        )}

        {/* Aksi */}
        <div className="flex justify-center pt-2">
          <button onClick={handleSubmit} disabled={!selectedId} className="btn btn-primary btn-lg">
            Sodorkan bukti ini ke Ibu!
          </button>
        </div>

      </div>
    </div>
  );
};
