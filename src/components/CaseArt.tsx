import { GameChapter } from '../types/game';
import { CaseCover } from './CaseCover';

export function CaseArt({ id }: { id: GameChapter }) {
  return <CaseCover id={id} className="aspect-[16/7] max-h-[38vh] w-full border-b border-[var(--line)]" />;
}
