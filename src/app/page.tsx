'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ComicHeader } from '../components/ComicHeader';
import { ComicDialogBox } from '../components/ComicDialogBox';
import { InspectModal } from '../components/InspectModal';
import { DebateModal } from '../components/DebateModal';
import { CallSimulatorModal } from '../components/CallSimulatorModal';
import { BrowserInvestigatorModal } from '../components/BrowserInvestigatorModal';
import { PinboardModal } from '../components/PinboardModal';
import { EmergencyModal } from '../components/EmergencyModal';
import { HandbookModal } from '../components/HandbookModal';
import { CaseSolvedModal } from '../components/CaseSolvedModal';
import { TitleScreen } from '../components/TitleScreen';
import {
  CHAPTER_1_DIALOGUES,
  CHAPTER_1_EVIDENCE,
  CHAPTER_1_RED_FLAGS,
  CHAPTER_1_PINBOARD_CLUES,
  CHAPTER_2_DIALOGUES,
  CHAPTER_2_QUESTIONS,
  CHAPTER_2_PINBOARD_CLUES,
  CHAPTER_3_DIALOGUES,
  CHAPTER_3_TOOLS,
  CHAPTER_3_PINBOARD_CLUES,
} from '../data/chaptersData';
import { DialogueChoice, GameChapter, RedFlag } from '../types/game';
import { getSoundEnabled, setSoundEnabled } from '../utils/sound';

export default function Home() {
  // Game states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentChapter, setCurrentChapter] = useState<GameChapter>(1);
  const [currentDialogueId, setCurrentDialogueId] = useState<string>('intro');
  const [waspadaMeter, setWaspadaMeter] = useState<number>(65);
  const [educationPoints, setEducationPoints] = useState<number>(120);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  // Modals
  const [showInspectCh1, setShowInspectCh1] = useState<boolean>(false);
  const [showDebateCh1, setShowDebateCh1] = useState<boolean>(false);
  const [showCallSimCh2, setShowCallSimCh2] = useState<boolean>(false);
  const [showBrowserSimCh3, setShowBrowserSimCh3] = useState<boolean>(false);
  const [showPinboard, setShowPinboard] = useState<boolean>(false);
  const [showEmergency, setShowEmergency] = useState<boolean>(false);
  const [showHandbook, setShowHandbook] = useState<boolean>(false);
  const [showCaseSolved, setShowCaseSolved] = useState<boolean>(false);

  // Chapter 1 state
  const [redFlags, setRedFlags] = useState<RedFlag[]>(CHAPTER_1_RED_FLAGS);

  // Get current chapter's dialogue dictionary
  const getDialogues = () => {
    switch (currentChapter) {
      case 2:
        return CHAPTER_2_DIALOGUES;
      case 3:
        return CHAPTER_3_DIALOGUES;
      default:
        return CHAPTER_1_DIALOGUES;
    }
  };

  const dialogues = getDialogues();
  const currentDialogue = dialogues[currentDialogueId] || dialogues['intro'];

  // Get pinboard clues for current chapter
  const getPinboardClues = () => {
    switch (currentChapter) {
      case 2:
        return CHAPTER_2_PINBOARD_CLUES;
      case 3:
        return CHAPTER_3_PINBOARD_CLUES;
      default:
        return CHAPTER_1_PINBOARD_CLUES;
    }
  };

  // Start Chapter from Title Screen
  const handleStartChapter = (ch: GameChapter) => {
    setCurrentChapter(ch);
    setCurrentDialogueId('intro');
    setWaspadaMeter(ch === 1 ? 65 : ch === 2 ? 55 : 50);
    setIsPlaying(true);
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const nextVal = !soundActive;
    setSoundActive(nextVal);
    setSoundEnabled(nextVal);
  };

  // Reset current case
  const handleResetCase = () => {
    setCurrentDialogueId('intro');
    setWaspadaMeter(currentChapter === 1 ? 65 : currentChapter === 2 ? 55 : 50);
    setRedFlags(CHAPTER_1_RED_FLAGS.map((f) => ({ ...f, isFound: false })));
    setShowInspectCh1(false);
    setShowDebateCh1(false);
    setShowCallSimCh2(false);
    setShowBrowserSimCh3(false);
    setShowPinboard(false);
    setShowEmergency(false);
    setShowCaseSolved(false);
  };

  // Return to chapter selection
  const handleBackToMenu = () => {
    setIsPlaying(false);
    handleResetCase();
  };

  // Dialog Choice Handler
  const handleSelectChoice = (choice: DialogueChoice) => {
    // 1. Trigger Chapter-specific special mechanic
    if (choice.triggerSpecialMechanic || choice.type === 'inspect') {
      if (currentChapter === 1) {
        setShowInspectCh1(true);
      } else if (currentChapter === 2) {
        setShowCallSimCh2(true);
      } else if (currentChapter === 3) {
        setShowBrowserSimCh3(true);
      }
      return;
    }

    // 2. Trigger Drag & Drop Pinboard mechanic
    if (choice.triggerPinboard) {
      setShowPinboard(true);
      return;
    }

    // 3. Trigger Emergency mode if player chooses risky action
    if (choice.triggerEmergency) {
      setWaspadaMeter(20);
      setShowEmergency(true);
      return;
    }

    // 4. Dialogue progression
    if (choice.nextStepId) {
      if (choice.nextStepId.startsWith('case_resolution')) {
        setWaspadaMeter(100);
        setEducationPoints((prev) => prev + 50);
      }
      setCurrentDialogueId(choice.nextStepId);
    }
  };

  // Auto-Next Dialogue Handler
  const handleNextDialogue = () => {
    if (currentDialogue.autoNext === 'debate_scene') {
      setShowDebateCh1(true);
      return;
    }
    if (currentDialogue.autoNext === 'trigger_victory') {
      setShowCaseSolved(true);
      return;
    }
    if (currentDialogue.autoNext && dialogues[currentDialogue.autoNext]) {
      setCurrentDialogueId(currentDialogue.autoNext);
    }
  };

  // Chapter 1: Found Red Flag
  const handleFoundRedFlag = (flagId: string) => {
    setRedFlags((prev) =>
      prev.map((f) => {
        if (f.id === flagId && !f.isFound) {
          setEducationPoints((pts) => pts + f.points);
          setWaspadaMeter((m) => Math.min(100, m + 12));
          return { ...f, isFound: true };
        }
        return f;
      })
    );
  };

  // Chapter 1: Finish WhatsApp Inspection
  const handleFinishInspectionCh1 = () => {
    setShowInspectCh1(false);
    setCurrentDialogueId('post_inspect_success');
  };

  // Pinboard Drag & Drop completed
  const handleFinishPinboard = () => {
    setShowPinboard(false);
    setWaspadaMeter((m) => Math.min(100, m + 15));
    setEducationPoints((pts) => pts + 60);
    setCurrentDialogueId('post_pinboard_scene');
  };

  // Chapter 1: Debate Success
  const handleDebateSuccessCh1 = () => {
    setShowDebateCh1(false);
    setWaspadaMeter(95);
    setEducationPoints((pts) => pts + 60);
    setCurrentDialogueId('after_debate_success');
  };

  // Chapter 2: Finish Call Interrogation
  const handleFinishCallCh2 = () => {
    setShowCallSimCh2(false);
    setWaspadaMeter(90);
    setEducationPoints((pts) => pts + 70);
    setCurrentDialogueId('post_call_victory');
  };

  // Chapter 3: Finish Browser Forensics
  const handleFinishBrowserCh3 = () => {
    setShowBrowserSimCh3(false);
    setWaspadaMeter(90);
    setEducationPoints((pts) => pts + 80);
    setCurrentDialogueId('post_browser_success');
  };

  // Emergency Mitigation Success
  const handleMitigationSuccess = () => {
    setShowEmergency(false);
    setWaspadaMeter(85);
    setEducationPoints((pts) => pts + 40);
    if (currentChapter === 1) {
      setCurrentDialogueId('after_debate_success');
    } else if (currentChapter === 2) {
      setCurrentDialogueId('post_call_victory');
    } else {
      setCurrentDialogueId('post_browser_success');
    }
  };

  // Advance to next chapter
  const handleNextChapter = () => {
    setShowCaseSolved(false);
    if (currentChapter < 3) {
      const nextCh = (currentChapter + 1) as GameChapter;
      handleStartChapter(nextCh);
    } else {
      setIsPlaying(false);
    }
  };

  // Scene Location Tag
  const getSceneTag = () => {
    switch (currentChapter) {
      case 2:
        return '📍 Ruang Makan Keluarga Budi • Malam Hari (21:10 WIB) — Telepon Masuk';
      case 3:
        return '📍 Meja Belajar & Laptop Budi • Siang Hari (13:45 WIB) — Investigasi Web';
      default:
        return '📍 Ruang Tamu Keluarga Budi • Malam Hari (20:15 WIB)';
    }
  };

  return (
    <main className="w-screen h-screen bg-slate-950 flex flex-col overflow-hidden font-sans select-none">
      
      {/* 1. TOP HEADER (HUD) */}
      <ComicHeader
        currentChapter={currentChapter}
        waspadaMeter={waspadaMeter}
        educationPoints={educationPoints}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
        onOpenHandbook={() => setShowHandbook(true)}
        onResetCase={handleResetCase}
        onSelectChapterMenu={handleBackToMenu}
      />

      {/* 2. MAIN STAGE VIEWPORT (TRUE EDGE-TO-EDGE FULLSCREEN) */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-between bg-slate-950">
        
        {/* TITLE SCREEN OR ACTIVE GAMEPLAY */}
        {!isPlaying ? (
          <TitleScreen
            onStartChapter={handleStartChapter}
            onOpenHandbook={() => setShowHandbook(true)}
          />
        ) : (
          <>
            {/* Latar Belakang Komik Layar Penuh (Edge-to-Edge) */}
            <div className="absolute inset-0 -z-10">
              <Image
                src="/assets/images/scene-ch1.png"
                alt="Background Scene"
                fill
                priority
                className="object-cover object-center filter contrast-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/30" />
            </div>

            {/* Top Scene Tag */}
            <div className="p-4 md:p-6 flex items-start justify-between z-10">
              <div className="bg-black/85 backdrop-blur text-amber-300 font-bold text-xs md:text-sm px-4 py-2 rounded-xl border border-amber-400/50 shadow-lg">
                {getSceneTag()}
              </div>
            </div>

            {/* Bottom Visual Novel Dialogue Box */}
            <div className="p-4 md:p-8 pb-6 md:pb-10 w-full max-w-6xl mx-auto">
              <ComicDialogBox
                dialogue={currentDialogue}
                onSelectChoice={handleSelectChoice}
                onNext={handleNextDialogue}
              />
            </div>
          </>
        )}

      </div>

      {/* 3. CHAPTER-SPECIFIC MECHANICS */}
      {showInspectCh1 && (
        <InspectModal
          redFlags={redFlags}
          onFoundRedFlag={handleFoundRedFlag}
          onFinishInspection={handleFinishInspectionCh1}
        />
      )}

      {showDebateCh1 && (
        <DebateModal
          evidenceList={CHAPTER_1_EVIDENCE}
          onCorrectEvidenceSubmitted={handleDebateSuccessCh1}
          onWrongEvidence={() => setWaspadaMeter((m) => Math.max(30, m - 10))}
        />
      )}

      {showCallSimCh2 && (
        <CallSimulatorModal
          questions={CHAPTER_2_QUESTIONS}
          onFinishInterrogation={handleFinishCallCh2}
        />
      )}

      {showBrowserSimCh3 && (
        <BrowserInvestigatorModal
          tools={CHAPTER_3_TOOLS}
          onFinishInvestigation={handleFinishBrowserCh3}
        />
      )}

      {showPinboard && (
        <PinboardModal
          chapter={currentChapter}
          clues={getPinboardClues()}
          onFinishPinboard={handleFinishPinboard}
        />
      )}

      {showEmergency && (
        <EmergencyModal onMitigationSuccess={handleMitigationSuccess} />
      )}

      {showHandbook && (
        <HandbookModal onClose={() => setShowHandbook(false)} />
      )}

      {showCaseSolved && (
        <CaseSolvedModal
          currentChapter={currentChapter}
          score={educationPoints}
          waspadaMeter={waspadaMeter}
          onNextChapter={handleNextChapter}
          onRestartCurrent={handleResetCase}
          onOpenHandbook={() => {
            setShowCaseSolved(false);
            setShowHandbook(true);
          }}
        />
      )}

    </main>
  );
}
