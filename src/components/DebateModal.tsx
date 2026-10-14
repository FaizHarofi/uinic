'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileWarning, Hourglass, HelpCircle, Check, X, Sparkles } from 'lucide-react';
import { EvidenceCard } from '../types/game';
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
        return <FileWarning className="w-6 h-6 text-rose-400" />;
      case 'Hourglass':
        return <Hourglass className="w-6 h-6 text-amber-400" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
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
        text: 'TEPAT SEKALI! "Lihat_Foto_Paket.pdf.apk" adalah file aplikasi Android (APK) yang menyamar. Jika dibuka, ia akan meminta izin akses SMS untuk mencuri kode OTP m-Banking Ibu!',
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
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(245,158,11,0.3)] flex flex-col space-y-6">
        
        {/* Header Debat Komik */}
        <div className="text-center space-y-2 border-b-2 border-slate-800 pb-4">
          <div className="inline-block bg-amber-400 text-slate-950 px-4 py-1 rounded-md font-black text-sm uppercase -rotate-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            KONFRONTASI BUKTI
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
            Sodorkan Bukti Terkuat Kepada Ibu!
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Ibu masih ragu karena kurir terus mengancam. Pilih kartu bukti dari Notebook Investigasimu yang paling membuktikan bahwa ini adalah penipuan:
          </p>
        </div>

        {/* Pilihan Kartu Bukti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evidenceList.map((card) => {
            const isSelected = selectedId === card.id;
            return (
              <div
                key={card.id}
                onClick={() => handleSelect(card.id)}
                className={`p-5 rounded-2xl border-3 cursor-pointer transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                    : 'border-slate-700 bg-slate-950/80 hover:border-slate-500 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                      {getIcon(card.icon)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {card.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.detailedFact}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Pilih Kartu Ini</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-slate-950'
                        : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in duration-200 ${
              feedback.isSuccess
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100'
                : 'bg-rose-950/70 border-rose-500 text-rose-100'
            }`}
          >
            {feedback.isSuccess ? (
              <Sparkles className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <X className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-sm font-semibold leading-relaxed">
              {feedback.text}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className={`py-3.5 px-8 rounded-xl font-black text-sm uppercase tracking-wider border-2 border-black transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
              selectedId
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
            }`}
          >
            Sodorkan Bukti Ini ke Ibu!
          </button>
        </div>

      </div>
    </div>
  );
};
