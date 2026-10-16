'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { BookOpen, X } from 'lucide-react';

type LessonSummaryDialogProps = {
  caseTitle: string;
  skills: string[];
};

export function LessonSummaryDialog({ caseTitle, skills }: LessonSummaryDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-teal">
          <BookOpen size={16} aria-hidden="true" />
          Buka ringkasan belajar
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgba(23,36,58,0.62)] animate-rise" />
        <Dialog.Content
          aria-describedby="lesson-summary-description"
          className="fixed left-1/2 top-1/2 z-50 max-h-[min(88vh,640px)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[10px] border border-[var(--line)] bg-[var(--white)] p-5 shadow-[0_18px_50px_rgba(23,36,58,0.24)] animate-pop sm:p-7"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
            <div>
              <Dialog.Title className="font-serif text-[1.55rem] font-semibold text-[var(--ink)]">
                Bekal dari kasus ini
              </Dialog.Title>
              <Dialog.Description id="lesson-summary-description" className="mt-1 text-[0.9rem] text-[var(--ink-muted)]">
                Ringkasan singkat untuk mengingat keputusan aman setelah menyelesaikan {caseTitle}.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" className="icon-tile h-11 w-11" aria-label="Tutup ringkasan belajar">
                <X size={18} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-5">
            <p className="text-[0.78rem] font-bold text-[var(--teal-deep)]">Yang baru kamu latih</p>
            <ul className="mt-2 space-y-2">
              {skills.map((skill) => (
                <li key={skill} className="border-b border-[var(--line)] pb-2 text-[0.95rem] text-[var(--ink-soft)] last:border-b-0">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-tint mt-6 p-4">
            <p className="font-semibold text-[var(--ink)]">Kalimat pengingat</p>
            <p className="mt-1 text-[0.92rem] leading-6 text-[var(--ink-soft)]">
              Berhenti saat didesak, periksa petunjuknya, lalu hubungi kanal resmi yang kamu cari sendiri.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
