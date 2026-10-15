'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  UserX,
  Signal,
  Lock,
  Eye,
  Search,
  ChevronDown,
  Shield,
  Bell,
  Check,
  X,
  BatteryFull,
} from 'lucide-react';
import { InterrogationQuestion } from '../types/game';
import {
  playBuzz,
  playClick,
  playDramaticHit,
  playEvidenceFound,
  playAlarm,
} from '../utils/sound';

interface CallSimulatorModalProps {
  questions: InterrogationQuestion[];
  onFinishInterrogation: () => void;
}

type ScammerMood = 'confident' | 'nervous' | 'panicking' | 'desperate';

const SCAMMER_DIALOGUES: Record<ScammerMood, string[]> = {
  confident: [
    '"Bapak, ini URGENT! Sebutkan 6 angka OTP sekarang sebelum dana 15 juta dipotong otomatis!"',
    '"Kami dari HaloBCA, sistem menunjukkan ada transaksi mencurigakan. Segera verifikasi OTP Bapak!"',
  ],
  nervous: [
    '"Ehh... Bapak, ini prosedur resmi kok. Saya hanya butuh kode verifikasi saja..."',
    '"Pak, ini demi keamanan Bapak sendiri... OTP-nya perlu saya catat di sistem kami..."',
  ],
  panicking: [
    '"Tu-tunggu, Bapak jangan salah paham! Saya benar-benar dari bank! Ko-kode OTP-nya, Pak!"',
    '"Bapak! Kalau tidak segera, saya tidak bisa bantu! Waktu verifikasi hampir habis!!"',
  ],
  desperate: [
    '"BAPAK DENGARKAN SAYA!! Ini sungguhan dari bank!! Saya bisa jelaskan semua!! OTP-nya SEKARANG!!"',
    '"Pak... Pak tolong... saya... ehm... KODE OTP-NYA PAK!! CEPAT!!"',
  ],
};

export const CallSimulatorModal: React.FC<CallSimulatorModalProps> = ({
  questions,
  onFinishInterrogation,
}) => {
  const [questionList, setQuestionList] =
    useState<InterrogationQuestion[]>(questions);
  const [activeQuestion, setActiveQuestion] =
    useState<InterrogationQuestion | null>(null);
  const [analyzedPrefix, setAnalyzedPrefix] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(38);
  const [showOtpSms, setShowOtpSms] = useState<boolean>(false);
  const [otpDismissed, setOtpDismissed] = useState<boolean>(false);
  const [showOtpShield, setShowOtpShield] = useState<boolean>(false);
  const [isTalking, setIsTalking] = useState<boolean>(true);
  const [wavePhase, setWavePhase] = useState<number>(0);

  // ─── Derived state ────────────────────────────────────────────────
  const askedCount = questionList.filter((q) => q.isAsked).length;
  const totalChecks = questions.length + 1; // questions + caller ID check
  const completedChecks = askedCount + (analyzedPrefix ? 1 : 0);
  const panicPercent = Math.min(
    100,
    Math.round((completedChecks / totalChecks) * 100)
  );
  const allLiesExposed = askedCount >= questions.length;
  const canActivateShield = allLiesExposed && analyzedPrefix;
  const canHangup = showOtpShield;

  const getScammerMood = (): ScammerMood => {
    if (panicPercent >= 80) return 'desperate';
    if (panicPercent >= 55) return 'panicking';
    if (panicPercent >= 25) return 'nervous';
    return 'confident';
  };

  const getCurrentDialogue = (): string => {
    const mood = getScammerMood();
    const lines = SCAMMER_DIALOGUES[mood];
    return lines[askedCount % lines.length];
  };

  // ─── Call timer ───────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Waveform animation phase ─────────────────────────────────────
  useEffect(() => {
    const waveTimer = setInterval(() => {
      setWavePhase((prev) => (prev + 1) % 360);
    }, 80);
    return () => clearInterval(waveTimer);
  }, []);

  // ─── Talking pulse toggle ─────────────────────────────────────────
  useEffect(() => {
    const talkTimer = setInterval(() => {
      setIsTalking((prev) => !prev);
    }, 2500);
    return () => clearInterval(talkTimer);
  }, []);

  // ─── OTP SMS slide-in after 6 seconds ─────────────────────────────
  useEffect(() => {
    const otpTimer = setTimeout(() => {
      if (!otpDismissed) {
        playAlarm();
        setShowOtpSms(true);
      }
    }, 6000);
    return () => clearTimeout(otpTimer);
  }, [otpDismissed]);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleAskQuestion = (qId: string) => {
    const already = questionList.find((q) => q.id === qId);
    if (already?.isAsked) {
      playClick();
      setActiveQuestion(already);
      return;
    }

    playDramaticHit();
    const updated = questionList.map((q) =>
      q.id === qId ? { ...q, isAsked: true } : q
    );
    setQuestionList(updated);
    const target = updated.find((q) => q.id === qId) || null;
    setActiveQuestion(target);

    setTimeout(() => {
      playEvidenceFound();
    }, 400);
  };

  const handleAnalyzePrefix = () => {
    if (!analyzedPrefix) {
      playEvidenceFound();
      setAnalyzedPrefix(true);
    } else {
      playClick();
    }
  };

  const handleActivateShield = () => {
    if (canActivateShield && !showOtpShield) {
      playAlarm();
      playDramaticHit();
      setShowOtpShield(true);
    }
  };

  const handleHangup = () => {
    if (canHangup) {
      playEvidenceFound();
      onFinishInterrogation();
    } else {
      playBuzz();
    }
  };

  // ─── Waveform bar heights ─────────────────────────────────────────
  const getWaveBars = (): number[] => {
    const bars: number[] = [];
    for (let i = 0; i < 24; i++) {
      const talking = Math.sin((wavePhase + i * 15) * (Math.PI / 180));
      const jitter = Math.abs(Math.sin((wavePhase + i * 37) * (Math.PI / 180)));
      const base = isTalking
        ? 20 + talking * 30 + jitter * 20
        : 5 + jitter * 8;
      bars.push(Math.max(4, Math.min(60, base)));
    }
    return bars;
  };

  const getPanicLabel = (): string => {
    if (panicPercent >= 80) return 'Panik total';
    if (panicPercent >= 55) return 'Mulai panik';
    if (panicPercent >= 25) return 'Gelisah';
    return 'Percaya diri';
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[rgba(14,22,38,0.65)] p-2 backdrop-blur-sm md:p-4">

      {/* OTP Shield banner */}
      {showOtpShield && (
        <div className="fade-slide-up fixed left-0 right-0 top-0 z-[90] border-b border-[#b9dcd9] bg-[var(--teal-tint)]">
          <div className="flex items-center justify-center gap-3 px-6 py-3.5 text-center">
            <Shield className="h-6 w-6 shrink-0 text-[var(--teal-deep)]" />
            <div>
              <div className="text-base font-bold text-[var(--teal-deep)] md:text-lg">
                OTP Shield aktif
              </div>
              <div className="text-xs font-medium text-[#0b5450]">
                Kode OTP adalah rahasia mutlak — tidak pernah diminta oleh pihak bank mana pun.
              </div>
            </div>
            <Lock className="h-6 w-6 shrink-0 text-[var(--teal-deep)]" />
          </div>
        </div>
      )}

      {/* Notifikasi SMS OTP (artefak ponsel) */}
      {showOtpSms && !otpDismissed && (
        <div className="fixed left-1/2 top-4 z-[80] w-[92%] max-w-md -translate-x-1/2">
          <div className="fade-slide-up rounded-[14px] border border-[var(--line-strong)] bg-[var(--white)] p-4 shadow-[0_18px_50px_rgba(14,22,38,0.4)]">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-[var(--ink)] text-white">
                <Bell className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--ink-soft)]">SMS &bull; BCA</span>
                  <span className="text-[10px] text-[var(--ink-muted)]">baru saja</span>
                </div>
                <p className="text-sm font-semibold leading-snug text-[var(--ink)]">
                  Kode OTP Anda:{' '}
                  <span className="font-mono text-lg font-bold tracking-[0.15em] text-[var(--ink)]">
                    847 291
                  </span>
                </p>
                <div className="mt-2 rounded-[8px] border border-[#f0c4c4] bg-[var(--red-tint)] px-3 py-1.5">
                  <p className="text-xs font-bold text-[var(--red-deep)]">
                    Jangan berikan kode ini kepada siapa pun
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-[#8a4141]">
                    Petugas bank TIDAK PERNAH meminta kode OTP
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                playClick();
                setOtpDismissed(true);
                setShowOtpSms(false);
              }}
              className="btn btn-ghost btn-sm mt-3 w-full justify-center"
            >
              <ChevronDown className="h-3.5 w-3.5" /> Tutup notifikasi
            </button>
          </div>
        </div>
      )}

      {/* Layout utama */}
      <div className={`relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-[14px] border border-[var(--line-strong)] bg-[var(--white)] shadow-[0_24px_70px_rgba(14,22,38,0.4)] ${showOtpShield ? 'mt-16' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="icon-tile shrink-0 !bg-[var(--red-tint)] !text-[var(--red-deep)]">
              <PhoneCall size={20} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[1.1rem] font-bold leading-tight md:text-[1.25rem]">
                Interogasi vishing
              </h2>
              <p className="truncate text-[0.8rem] text-[var(--ink-muted)]">
                Bongkar kebohongan penipu dan analisis Caller ID-nya.
              </p>
            </div>
          </div>
          <span className={`chip shrink-0 ${panicPercent === 100 ? 'chip-teal' : 'chip-ink'}`}>
            Terbongkar {completedChecks}/{totalChecks}
          </span>
        </div>

        {/* Grid konten */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">

          {/* KIRI: layar panggilan (artefak gelap otentik) */}
          <div className="overflow-y-auto border-b border-[#22304a] bg-[#0e1626] p-4 md:p-6 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div className="mx-auto w-full max-w-xs">
              {/* Status bar */}
              <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-semibold text-[#8696a0]">
                <span>17:42</span>
                <div className="flex items-center gap-1.5">
                  <Signal className="h-3 w-3" />
                  <span>4G</span>
                  <BatteryFull className="h-3 w-3" />
                </div>
              </div>

              {/* Avatar panggilan */}
              <div className="relative mx-auto mb-4 mt-2 h-24 w-24">
                <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[#168C87]/50 bg-[var(--teal-deep)]">
                  <PhoneCall className="h-10 w-10 text-white" />
                </div>
                <span className="absolute right-1 top-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-[var(--teal)]" />
              </div>

              {/* Info kontak */}
              <div className="mb-4 text-center">
                <div className="text-lg font-bold text-white">&quot;HaloBCA&quot;</div>
                <div className="text-xs font-medium text-[#8696a0]">Customer Service (?)</div>
                <div className="mt-1 font-mono text-sm font-semibold tracking-wide text-[#4dd0c7]">
                  {formatTime(callDuration)}
                </div>
              </div>

              {/* Waveform */}
              <div className="mb-4 rounded-[10px] border border-[#22304a] bg-black/50 p-3">
                <div className="flex h-16 items-end justify-center gap-[3px]">
                  {getWaveBars().map((height, i) => (
                    <div
                      key={i}
                      className="w-[6px] rounded-full transition-all duration-100"
                      style={{
                        height: `${height}%`,
                        background: isTalking ? '#168C87' : '#334155',
                        opacity: isTalking
                          ? 0.75 + Math.abs(Math.sin((wavePhase + i * 15) * (Math.PI / 180))) * 0.25
                          : 0.35,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2 text-center text-[10px] font-semibold text-[#8696a0]">
                  {isTalking ? 'Penipu sedang berbicara...' : 'Jeda...'}
                </div>
              </div>

              {/* Caller ID analysis */}
              <div
                onClick={handleAnalyzePrefix}
                className={`mb-4 cursor-pointer rounded-[10px] border p-3 transition-all duration-300 ${
                  analyzedPrefix
                    ? 'border-[#D94B4B] bg-[#1d1216]'
                    : 'border-dashed border-[#F0C75E] bg-[#131d2e] hover:bg-[#182335]'
                }`}
              >
                {!analyzedPrefix ? (
                  <div className="text-center">
                    <Search className="mx-auto mb-1 h-5 w-5 text-[#f0c75e]" />
                    <div className="mb-2 text-xs font-bold text-[#f0c75e]">
                      Klik untuk analisis Caller ID
                    </div>
                    <div className="font-mono text-base font-bold tracking-widest text-white">
                      +62 821-9988-7711
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-center text-[10px] font-bold uppercase tracking-wider text-[#f2b8b5]">
                      Perbandingan Caller ID
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-[8px] border border-[#D94B4B] bg-[#241417] p-2 text-center">
                        <div className="mb-1 flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-[#f2b8b5]">
                          <UserX className="h-3 w-3" /> Nomor mereka
                        </div>
                        <div className="font-mono text-xs font-bold text-[#f2b8b5]">+62 821-xxxx</div>
                        <div className="mt-0.5 flex items-center justify-center gap-1 text-[8px] font-bold text-[#f2b8b5]">
                          <X className="h-2.5 w-2.5" /> HP biasa
                        </div>
                      </div>
                      <div className="rounded-[8px] border border-[#168C87] bg-[#0f2523] p-2 text-center">
                        <div className="mb-1 flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-[#4dd0c7]">
                          <ShieldCheck className="h-3 w-3" /> HaloBCA asli
                        </div>
                        <div className="font-mono text-xs font-bold text-[#4dd0c7]">1500888</div>
                        <div className="mt-0.5 flex items-center justify-center gap-1 text-[8px] font-bold text-[#4dd0c7]">
                          <Check className="h-2.5 w-2.5" /> 5&ndash;7 digit
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-[10px] font-bold text-[#f2b8b5]">
                      CS bank resmi wajib pakai nomor 5&ndash;7 digit!
                    </div>
                  </div>
                )}
              </div>

              {/* Kata-kata penipu */}
              <div className="mb-4 rounded-[10px] border border-[#22304a] bg-[#131d2e] p-3">
                <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase text-[#f2b8b5]">
                  <AlertTriangle className="h-3 w-3" /> Kata-kata penipu
                </div>
                <p className="text-xs font-semibold italic leading-relaxed text-[#d1d7e0]">
                  {getCurrentDialogue()}
                </p>
              </div>

              {/* Meter kepanikan penipu */}
              <div className="mb-4 rounded-[10px] border border-[#22304a] bg-black/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4dd0c7]">
                    Kepanikan penipu
                  </span>
                  <span className="text-xs font-bold text-white">{panicPercent}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-[#22304a] bg-[#1a2536]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${panicPercent}%`, background: panicPercent >= 55 ? '#D94B4B' : '#168C87' }}
                  />
                </div>
                <div className="mt-1.5 text-center text-xs font-semibold text-[#8696a0]">
                  {getPanicLabel()}
                </div>
              </div>

              {/* Tombol aksi */}
              <div className="w-full space-y-2">
                {canActivateShield && !showOtpShield && (
                  <button onClick={handleActivateShield} className="btn btn-teal btn-block justify-center">
                    <Shield className="h-4 w-4" />
                    Aktifkan OTP Shield
                  </button>
                )}

                <button
                  onClick={handleHangup}
                  disabled={!canHangup}
                  className="btn btn-danger btn-block justify-center"
                >
                  <PhoneOff className="h-4 w-4" />
                  {canHangup
                    ? 'Putus panggilan sekarang'
                    : showOtpShield
                    ? 'Memproses...'
                    : canActivateShield
                    ? 'Aktifkan OTP Shield dulu!'
                    : `Bongkar semua kebohongan (${completedChecks}/${totalChecks})`}
                </button>
              </div>
            </div>
          </div>

          {/* KANAN: panel investigasi (terang) */}
          <div className="flex flex-col overflow-y-auto bg-[var(--mist)] p-4 md:p-5 lg:col-span-7">
            {/* Panel header */}
            <div className="mb-4 flex items-center gap-2.5 border-b border-[var(--line)] pb-3">
              <span className="icon-tile !h-9 !w-9">
                <Eye className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">Pertanyaan kritis</h3>
                <p className="text-[10px] text-[var(--ink-muted)]">
                  Tanyakan pertanyaan jebakan untuk membongkar kebohongan penipu
                </p>
              </div>
            </div>

            {/* Daftar pertanyaan */}
            <div className="mb-4 space-y-2">
              {questionList.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => handleAskQuestion(q.id)}
                  className={`group cursor-pointer rounded-[10px] border p-3 transition-all duration-200 ${
                    q.isAsked
                      ? 'border-[#b9dcd9] bg-[var(--teal-tint)]'
                      : 'border-[var(--line-strong)] bg-[var(--white)] hover:border-[var(--ink)]'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-[6px] text-xs font-bold ${
                          q.isAsked
                            ? 'bg-[var(--teal-deep)] text-white'
                            : 'bg-[var(--mist)] text-[var(--ink-soft)]'
                        }`}
                      >
                        {q.isAsked ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-[var(--ink-muted)]">
                        Pertanyaan #{idx + 1}
                      </span>
                    </div>
                    {q.isAsked ? (
                      <span className="rounded-full bg-[var(--teal-deep)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        Terbongkar
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-[var(--ink-muted)] transition-colors group-hover:text-[var(--teal-deep)]">
                        Klik untuk tanyakan &rarr;
                      </span>
                    )}
                  </div>
                  <div className="pl-8 text-sm font-semibold text-[var(--ink)]">
                    &ldquo;{q.question}&rdquo;
                  </div>
                </div>
              ))}
            </div>

            {/* Panel respons */}
            <div className="min-h-[140px] flex-1 rounded-[10px] border border-[var(--line)] bg-[var(--white)] p-4">
              {activeQuestion ? (
                <div className="space-y-3">
                  <div className="rounded-[8px] border border-[#f0c4c4] bg-[var(--red-tint)] p-3">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <UserX className="h-3.5 w-3.5 text-[var(--red-deep)]" />
                      <span className="text-[10px] font-bold uppercase text-[var(--red-deep)]">
                        Reaksi penipu
                      </span>
                    </div>
                    <p className="text-sm font-bold italic leading-relaxed text-[var(--ink)]">
                      &ldquo;{activeQuestion.response}&rdquo;
                    </p>
                  </div>

                  <div className="rounded-[8px] border border-[#b9dcd9] bg-[var(--teal-tint)] p-3">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[var(--teal-deep)]" />
                      <span className="text-[10px] font-bold uppercase text-[var(--teal-deep)]">
                        Fakta keamanan
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <span className="mb-3 grid h-12 w-12 place-items-center rounded-[9px] bg-[var(--mist)] text-[var(--ink-muted)]">
                    <MessageSquare className="h-6 w-6" />
                  </span>
                  <p className="max-w-xs text-xs font-semibold text-[var(--ink-muted)]">
                    Pilih pertanyaan di atas untuk menginterogasi penipu dan melihat bagaimana
                    mereka gagap menjawab!
                  </p>
                  <HelpCircle className="mt-2 h-4 w-4 text-[var(--line-strong)]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
