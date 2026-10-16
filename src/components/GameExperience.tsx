'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, CircleHelp } from 'lucide-react';
import { ComicDialogBox } from './ComicDialogBox';
import { InspectModal } from './InspectModal'; import { DebateModal } from './DebateModal'; import { CallSimulatorModal } from './CallSimulatorModal'; import { BrowserInvestigatorModal } from './BrowserInvestigatorModal'; import { PinboardModal } from './PinboardModal'; import { EmergencyModal } from './EmergencyModal';
import { CHAPTER_1_DIALOGUES, CHAPTER_1_EVIDENCE, CHAPTER_1_RED_FLAGS, CHAPTER_1_PINBOARD_CLUES, CHAPTER_2_DIALOGUES, CHAPTER_2_QUESTIONS, CHAPTER_2_PINBOARD_CLUES, CHAPTER_3_DIALOGUES, CHAPTER_3_TOOLS, CHAPTER_3_PINBOARD_CLUES, CHAPTER_4_DIALOGUES } from '../data/chaptersData';
import { DialogueChoice, GameChapter, RedFlag } from '../types/game';
import { getCaseById } from '../data/cases';
import { CaseArt } from './CaseArt';
export function GameExperience({ chapter }: { chapter: GameChapter }) { const router = useRouter(); const info = getCaseById(chapter)!; const [dialogueId, setDialogueId] = useState('intro'); const [meter, setMeter] = useState(chapter === 1 ? 65 : chapter === 2 ? 55 : chapter === 3 ? 50 : 60); const [points, setPoints] = useState(0); const [redFlags, setRedFlags] = useState<RedFlag[]>(CHAPTER_1_RED_FLAGS); const [inspect, setInspect] = useState(false); const [debate, setDebate] = useState(false); const [call, setCall] = useState(false); const [browser, setBrowser] = useState(false); const [pinboard, setPinboard] = useState(false); const [emergency, setEmergency] = useState(false); const [hint, setHint] = useState(false);
  const dialogs = useMemo(() => chapter === 1 ? CHAPTER_1_DIALOGUES : chapter === 2 ? CHAPTER_2_DIALOGUES : chapter === 3 ? CHAPTER_3_DIALOGUES : CHAPTER_4_DIALOGUES, [chapter]); const dialogue = dialogs[dialogueId] || dialogs.intro; const reset = () => { setDialogueId('intro'); setMeter(chapter === 1 ? 65 : chapter === 2 ? 55 : chapter === 3 ? 50 : 60); setPoints(0); setRedFlags(CHAPTER_1_RED_FLAGS.map((item) => ({ ...item, isFound: false }))); };
  const finish = (id: string, gained: number, nextMeter: number) => { setPoints((value) => value + gained); setMeter(nextMeter); setDialogueId(id); }; const resolve = () => { const result = { chapter, points, completedAt: new Date().toISOString() }; localStorage.setItem(`awas-scam-result-${chapter}`, JSON.stringify(result)); const stored = JSON.parse(localStorage.getItem('awas-scam-progress') || '[]'); localStorage.setItem('awas-scam-progress', JSON.stringify(Array.from(new Set([...stored, chapter])))); router.push(`/hasil/${chapter}`); };
  const select = (choice: DialogueChoice) => { if (choice.triggerSpecialMechanic || choice.type === 'inspect') { if (chapter === 1) setInspect(true); else if (chapter === 2) setCall(true); else setBrowser(true); return; } if (choice.triggerPinboard) { setPinboard(true); return; } if (choice.triggerEmergency) { setMeter(20); setEmergency(true); return; } if (choice.nextStepId) { if (choice.nextStepId.startsWith('case_resolution')) { setMeter(100); setPoints((value) => value + 50); } setDialogueId(choice.nextStepId); } };
  const next = () => { if (dialogue.autoNext === 'debate_scene') { setDebate(true); return; } if (dialogue.autoNext === 'trigger_victory') { resolve(); return; } if (dialogue.autoNext && dialogs[dialogue.autoNext]) setDialogueId(dialogue.autoNext); };
  const clues = chapter === 1 ? CHAPTER_1_PINBOARD_CLUES : chapter === 2 ? CHAPTER_2_PINBOARD_CLUES : CHAPTER_3_PINBOARD_CLUES;
  const goBack = () => { if (window.history.length > 1) router.back(); else router.push('/kasus'); };
  return (
    <main className="min-h-[100dvh] bg-[var(--mist)] text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--white)]/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-3 md:px-8">
          <button type="button" onClick={goBack} className="btn btn-ghost btn-sm shrink-0">
            <ArrowLeft size={16} /> Kembali
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[0.82rem] font-semibold leading-tight text-[var(--ink-muted)]">
              <span className="font-bold text-[var(--teal-deep)]">Kasus {String(chapter).padStart(2, '0')}</span>
              <span className="mx-1.5 text-[var(--line-strong)]">/</span>
              {info.title}
            </p>
          </div>
          <button type="button" onClick={reset} className="btn btn-ghost btn-sm shrink-0">
            <RotateCcw size={15} /> Ulangi
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-3 pb-5 pt-3 md:px-8 md:pt-5">
        {/* Status ringkas: kewaspadaan, poin, petunjuk opsional */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-32 sm:w-40">
              <div className="meter">
                <span style={{ width: `${meter}%`, backgroundColor: meter < 40 ? 'var(--red)' : 'var(--teal)' }} />
              </div>
            </div>
            <span className="whitespace-nowrap text-[0.78rem] font-semibold text-[var(--ink-muted)]">
              Kewaspadaan <span className="font-bold text-[var(--ink)]">{meter}%</span>
            </span>
          </div>
          <p className="text-[0.78rem] font-semibold text-[var(--ink-muted)]">
            <span key={points} className="animate-score font-bold text-[var(--teal-deep)]">{points}</span> poin
          </p>
          <button type="button" onClick={() => setHint((value) => !value)} aria-expanded={hint} className="btn btn-ghost btn-sm ml-auto">
            <CircleHelp size={15} /> Petunjuk
          </button>
        </div>
        {hint && (
          <p className="-mt-1 border-t border-[var(--line)] py-3 text-[0.88rem] leading-6 text-[var(--ink-soft)]">
            Periksa pengirim, lampiran, dan tuntutan yang mendesak.
          </p>
        )}

        {/* Panggung kasus: bukti di atas, dialog tepat di bawahnya */}
        <section className="overflow-hidden rounded-md border border-[var(--line)] bg-[var(--white)]">
          <CaseArt id={chapter} />
          <ComicDialogBox key={dialogue.id} dialogue={dialogue} onSelectChoice={select} onNext={next} />
        </section>

        <p className="mt-3 text-center text-[0.78rem] text-[var(--ink-muted)]">
          Simulasi edukasi — semua nama dan tautan dalam permainan ini fiktif.
        </p>
      </div>

      {inspect && <InspectModal redFlags={redFlags} onFoundRedFlag={(id) => setRedFlags((items) => items.map((item) => item.id === id && !item.isFound ? (setPoints((value) => value + item.points), setMeter((value) => Math.min(100, value + 12)), { ...item, isFound: true }) : item))} onFinishInspection={() => { setInspect(false); setDialogueId('post_inspect_success'); }} />}
      {debate && <DebateModal evidenceList={CHAPTER_1_EVIDENCE} onCorrectEvidenceSubmitted={() => { setDebate(false); finish('after_debate_success', 60, 95); }} onWrongEvidence={() => setMeter((value) => Math.max(30, value - 10))} />}
      {call && <CallSimulatorModal questions={CHAPTER_2_QUESTIONS} onFinishInterrogation={() => { setCall(false); finish('post_call_victory', 70, 90); }} />}
      {browser && <BrowserInvestigatorModal tools={CHAPTER_3_TOOLS} onFinishInvestigation={() => { setBrowser(false); finish('post_browser_success', 80, 90); }} />}
      {pinboard && <PinboardModal clues={clues} onFinishPinboard={() => { setPinboard(false); finish('post_pinboard_scene', 60, Math.min(100, meter + 15)); }} />}
      {emergency && <EmergencyModal onMitigationSuccess={() => { setEmergency(false); finish(chapter === 1 ? 'after_debate_success' : chapter === 2 ? 'post_call_victory' : chapter === 3 ? 'post_browser_success' : 'after_emergency_4', 40, 85); }} />}
    </main>
  );
}
