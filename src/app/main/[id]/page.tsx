import { notFound } from 'next/navigation';
import { GameExperience } from '../../../components/GameExperience';
import { getCaseById } from '../../../data/cases';
import { GameChapter } from '../../../types/game';
import { CASES } from '../../../data/cases';
export function generateStaticParams() { return CASES.map(({ id }) => ({ id: String(id) })); }
export default async function Gameplay({ params }: { params: Promise<{ id: string }> }) { const id = Number((await params).id); if (!getCaseById(id)) notFound(); return <GameExperience chapter={id as GameChapter}/>; }
