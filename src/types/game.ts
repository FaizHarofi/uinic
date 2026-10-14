export type GameChapter = 1 | 2 | 3;

export type GamePhase = 
  | 'title'           // Halaman Depan / Cover Komik
  | 'dialogue'        // Dialog Cerita Visual Novel
  | 'inspect_ch1'     // Chapter 1: Spot the Red Flag (WhatsApp Chat)
  | 'debate_ch1'      // Chapter 1: Memilih Bukti untuk Edukasi Ibu
  | 'call_sim_ch2'    // Chapter 2: Phone Call Interrogation & Lie Detector
  | 'browser_sim_ch3' // Chapter 3: Cyber Browser Sandbox & Domain Investigator
  | 'pinboard'        // Mekanik Baru: Drag & Drop Papan Investigasi Benang Merah
  | 'emergency'       // Jalur Darurat jika salah pilih
  | 'case_solved';    // Kasus berhasil dipecahkan!

export interface RedFlag {
  id: string;
  name: string;
  targetArea: string;
  description: string;
  explanation: string;
  isFound: boolean;
  points: number;
}

export interface DialogueChoice {
  id: string;
  label: string;
  type: 'action' | 'inspect' | 'risky';
  actionPrompt: string;
  nextStepId?: string;
  triggerEmergency?: boolean;
  triggerSpecialMechanic?: boolean;
  triggerInspect?: boolean;
  triggerPinboard?: boolean;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  speakerRole?: string;
  text: string;
  expression?: 'worried' | 'normal' | 'shocked' | 'relieved' | 'thinking';
  comicEffect?: string;
  choices?: DialogueChoice[];
  autoNext?: string;
}

export interface EvidenceCard {
  id: string;
  title: string;
  category: 'APK Sniffer' | 'Social Engineering' | 'Phishing' | 'Fake Investment';
  icon: string;
  shortDesc: string;
  detailedFact: string;
  isKeyEvidence?: boolean;
}

// Chapter 2: Call Interrogation Types
export interface InterrogationQuestion {
  id: string;
  question: string;
  response: string;
  isRevealing: boolean;
  explanation: string;
  isAsked?: boolean;
}

// Chapter 3: Browser Tool Analysis Types
export interface BrowserToolResult {
  toolId: 'whois' | 'cekrekening' | 'reverse_img';
  name: string;
  title: string;
  status: 'safe' | 'danger' | 'warning';
  finding: string;
  detailedAnalysis: string;
  isAnalyzed: boolean;
  points: number;
}

// Pinboard Drag & Drop Types
export type PinboardTargetCategory = 'malware' | 'social_eng' | 'impersonation';

export interface PinboardClue {
  id: string;
  title: string;
  snippet: string;
  targetCategory: PinboardTargetCategory;
  currentCategory: PinboardTargetCategory | null;
  iconName: string;
}
