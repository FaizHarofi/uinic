'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, HelpCircle, Search, ChevronRight, ChevronsRight, Zap } from 'lucide-react';
import { DialogueChoice, DialogueNode } from '../types/game';
import { playBlip, playClick } from '../utils/sound';

interface ComicDialogBoxProps {
  dialogue: DialogueNode;
  onSelectChoice: (choice: DialogueChoice) => void;
  onNext?: () => void;
}

export const ComicDialogBox: React.FC<ComicDialogBoxProps> = ({
  dialogue,
  onSelectChoice,
  onNext,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [choicesVisible, setChoicesVisible] = useState(false);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setChoicesVisible(false);
    let index = 0;
    const fullText = dialogue.text;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        if (index % 3 === 0) playBlip();
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        // Stagger choices appearance
        setTimeout(() => setChoicesVisible(true), 200);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [dialogue.text]);

  const handleSkipOrNext = useCallback(() => {
    if (isTyping) {
      setDisplayedText(dialogue.text);
      setIsTyping(false);
      setTimeout(() => setChoicesVisible(true), 100);
    } else if (onNext && (!dialogue.choices || dialogue.choices.length === 0)) {
      playClick();
      onNext();
    }
  }, [isTyping, dialogue, onNext]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleSkipOrNext();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleSkipOrNext]);

  // Speaker Badge Color
  const getSpeakerStyle = () => {
    if (dialogue.speaker.includes('Ibu'))
      return { color: 'text-pink-400', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]', accent: 'border-pink-500/60' };
    if (dialogue.speaker.includes('Ayah'))
      return { color: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]', accent: 'border-blue-500/60' };
    if (dialogue.speaker.includes('Rian'))
      return { color: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]', accent: 'border-green-500/60' };
    if (dialogue.speaker.includes('Budi'))
      return { color: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]', accent: 'border-cyan-500/60' };
    if (dialogue.speaker.includes('Sistem'))
      return { color: 'text-rose-400', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]', accent: 'border-rose-500/60' };
    return { color: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]', accent: 'border-amber-500/60' };
  };

  const speakerStyle = getSpeakerStyle();

  const getChoiceIcon = (choice: DialogueChoice) => {
    if (choice.triggerInspect || choice.triggerSpecialMechanic || choice.type === 'inspect')
      return <Search className="w-5 h-5 text-cyan-400 shrink-0" />;
    if (choice.type === 'risky')
      return <HelpCircle className="w-5 h-5 text-rose-400 shrink-0" />;
    return <Zap className="w-5 h-5 text-amber-400 shrink-0" />;
  };

  const getChoiceClasses = (choice: DialogueChoice) => {
    if (choice.triggerInspect || choice.triggerSpecialMechanic || choice.type === 'inspect')
      return 'border-cyan-500/60 hover:border-cyan-400 hover:bg-cyan-950/50 text-cyan-50 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]';
    if (choice.type === 'risky')
      return 'border-rose-600/60 hover:border-rose-400 hover:bg-rose-950/50 text-rose-50 hover:shadow-[0_0_25px_rgba(244,63,94,0.3)]';
    return 'border-amber-500/60 hover:border-amber-400 hover:bg-amber-950/50 text-amber-50 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]';
  };

  return (
    <div className="w-full flex flex-col gap-3 z-20">

      {/* Comic Effect Text (KLIK!, DEG!, etc.) */}
      {dialogue.comicEffect && !isTyping && (
        <div className="flex justify-center mb-1 animate-in zoom-in-50 duration-300">
          <span className="text-4xl md:text-5xl font-black text-amber-400 -rotate-3 drop-shadow-[0_4px_0_rgba(0,0,0,1)] tracking-wider animate-bounce">
            {dialogue.comicEffect}
          </span>
        </div>
      )}

      {/* Main Dialog Box */}
      <div
        onClick={handleSkipOrNext}
        className={`relative bg-slate-950/92 backdrop-blur-xl rounded-2xl border-2 ${speakerStyle.accent} p-5 md:p-6 ${speakerStyle.glow} cursor-pointer group transition-all duration-200`}
      >
        {/* Corner Accents */}
        <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-amber-400/60 rounded-tl-sm" />
        <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-amber-400/60 rounded-tr-sm" />
        <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-amber-400/60 rounded-bl-sm" />
        <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-amber-400/60 rounded-br-sm" />

        {/* Speaker Name Badge */}
        <div className="inline-flex items-center gap-2.5 mb-2.5">
          <span className={`text-lg md:text-xl font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${speakerStyle.color}`}>
            {dialogue.speaker}
          </span>
          {dialogue.speakerRole && (
            <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/80 uppercase tracking-wider">
              {dialogue.speakerRole}
            </span>
          )}
        </div>

        {/* Dialogue Text */}
        <p className="text-slate-100 text-base md:text-lg font-medium leading-relaxed min-h-[52px] tracking-wide">
          {displayedText}
          {isTyping && <span className="inline-block w-[3px] h-5 bg-amber-400 ml-0.5 animate-pulse rounded-sm" />}
        </p>

        {/* Continue Indicator */}
        {!isTyping && (!dialogue.choices || dialogue.choices.length === 0) && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1 text-amber-400/80 group-hover:text-amber-300 transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">Spasi / Klik</span>
            <ChevronsRight className="w-4 h-4 animate-bounce" />
          </div>
        )}
      </div>

      {/* Branching Choices */}
      {dialogue.choices && dialogue.choices.length > 0 && choicesVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {dialogue.choices.map((choice, idx) => (
            <button
              key={choice.id}
              onClick={() => {
                playClick();
                onSelectChoice(choice);
              }}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 bg-slate-950/90 backdrop-blur-lg transition-all duration-200 active:scale-[0.97] text-left group ${getChoiceClasses(choice)}`}
              style={{
                animationDelay: `${idx * 80}ms`,
                animation: 'fadeSlideUp 0.3s ease-out both',
              }}
            >
              <div className="p-2 rounded-lg bg-black/60 border border-white/10 group-hover:scale-110 transition-transform shrink-0">
                {getChoiceIcon(choice)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                  {choice.actionPrompt}
                </div>
                <div className="text-sm font-bold leading-snug">
                  {choice.label}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-all shrink-0" />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
