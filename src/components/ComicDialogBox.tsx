'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronsRight } from 'lucide-react';
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
  const [pickedId, setPickedId] = useState<string | null>(null);

  // Typewriter effect (component is remounted per dialogue node via `key`)
  useEffect(() => {
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

  const choose = (choice: DialogueChoice) => {
    if (pickedId) return;
    playClick();
    setPickedId(choice.id);
    setTimeout(() => {
      setPickedId(null);
      onSelectChoice(choice);
    }, 160);
  };

  return (
    <div className="flex w-full flex-col">
      {/* Panel dialog: tepat di bawah bukti, tidak menutupinya */}
      <div
        onClick={handleSkipOrNext}
        className="relative cursor-pointer px-4 pb-4 pt-4 md:px-7"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="chip chip-ink">{dialogue.speaker}</span>
          {dialogue.speakerRole && (
            <span className="text-[0.76rem] font-semibold text-[var(--ink-muted)]">
              {dialogue.speakerRole}
            </span>
          )}
        </div>

        <p className="mt-3 max-w-[66ch] text-[1rem] leading-7 text-[var(--ink-soft)] md:text-[1.04rem]">
          {displayedText}
          {isTyping && (
            <span className="ml-0.5 inline-block h-[1.05em] w-[3px] translate-y-0.5 rounded-sm bg-[var(--teal-deep)] animate-pulse" />
          )}
        </p>

        {!isTyping && (!dialogue.choices || dialogue.choices.length === 0) && (
          <div className="mt-1 flex items-center justify-end gap-1 text-[var(--ink-muted)]">
            <span className="text-[0.7rem] font-bold tracking-wide">Spasi / Klik</span>
            <ChevronsRight className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Pilihan keputusan */}
      {dialogue.choices && dialogue.choices.length > 0 && choicesVisible && (
        <div className="border-t border-[var(--line)] bg-[var(--mist)] p-3">
          <div className={`grid grid-cols-1 gap-3 ${dialogue.choices.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
            {dialogue.choices.map((choice, idx) => (
              <button
                key={choice.id}
                type="button"
                disabled={pickedId !== null}
                aria-pressed={pickedId === choice.id}
                onClick={() => choose(choice)}
                className={`group flex w-full items-start gap-3 rounded-[6px] border p-3.5 text-left transition-all duration-200 ${
                  pickedId === choice.id
                    ? choice.type === 'risky'
                      ? 'animate-shake border-[var(--red)] bg-white ring-1 ring-[var(--red)]'
                      : 'border-[var(--teal-deep)] bg-white ring-1 ring-[var(--teal-deep)]'
                    : 'border-[var(--line-strong)] bg-white hover:border-[var(--ink)]'
                } ${disabledClass(pickedId !== null)}`}
                style={
                  pickedId === choice.id
                    ? undefined
                    : { animationDelay: `${idx * 80}ms`, animation: 'fadeSlideUp 0.3s ease-out backwards' }
                }
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.97rem] font-bold leading-5 text-[var(--ink)]">{choice.actionPrompt}</span>
                  <span className="mt-1 block text-[0.85rem] leading-6 text-[var(--ink-muted)]">{choice.label}</span>
                </span>
                <ChevronRight className="mt-1 h-4.5 w-4.5 shrink-0 text-[var(--line-strong)] transition-colors group-hover:text-[var(--ink)]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function disabledClass(disabled: boolean) {
  return disabled ? 'opacity-60 pointer-events-none' : '';
}
