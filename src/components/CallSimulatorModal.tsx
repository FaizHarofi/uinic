'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  Phone,
  UserX,
  Signal,
  Lock,
  Zap,
  Eye,
  Search,
  ChevronDown,
  Shield,
  Bell,
} from 'lucide-react';
import { InterrogationQuestion } from '../types/game';
import {
  playBuzz,
  playClick,
  playDramaticHit,
  playEvidenceFound,
  playAlarm,
} from '../utils/sound';

// ─── Types ─────────────────────────────────────────────────────────────────
interface CallSimulatorModalProps {
  questions: InterrogationQuestion[];
  onFinishInterrogation: () => void;
}

type ScammerMood = 'confident' | 'nervous' | 'panicking' | 'desperate';

// ─── Scammer dynamic dialogue based on panic level ─────────────────────────
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

// ─── Component ─────────────────────────────────────────────────────────────
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
  const [showTerbongkar, setShowTerbongkar] = useState<boolean>(false);
  const [terbongkarText, setTerbongkarText] = useState<string>('');
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
  const confidencePercent = Math.max(0, 100 - panicPercent);
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

    // Show TERBONGKAR explosion
    setTerbongkarText('TERBONGKAR!');
    setShowTerbongkar(true);
    setTimeout(() => setShowTerbongkar(false), 1800);

    setTimeout(() => {
      playEvidenceFound();
    }, 400);
  };

  const handleAnalyzePrefix = () => {
    if (!analyzedPrefix) {
      playEvidenceFound();
      setAnalyzedPrefix(true);
      setTerbongkarText('NOMOR PALSU!');
      setShowTerbongkar(true);
      setTimeout(() => setShowTerbongkar(false), 1800);
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
      const base = isTalking
        ? 20 + Math.sin((wavePhase + i * 15) * (Math.PI / 180)) * 30 + Math.random() * 20
        : 5 + Math.random() * 8;
      bars.push(Math.max(4, Math.min(60, base)));
    }
    return bars;
  };

  // ─── Panic meter color ────────────────────────────────────────────
  const getPanicColor = (): string => {
    if (panicPercent >= 80) return 'from-red-600 to-rose-500';
    if (panicPercent >= 55) return 'from-orange-500 to-amber-500';
    if (panicPercent >= 25) return 'from-yellow-500 to-amber-400';
    return 'from-emerald-500 to-green-400';
  };

  const getPanicLabel = (): string => {
    if (panicPercent >= 80) return '😱 PANIK TOTAL!';
    if (panicPercent >= 55) return '😰 MULAI PANIK';
    if (panicPercent >= 25) return '😟 GELISAH';
    return '😏 PERCAYA DIRI';
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 md:p-4 overflow-hidden">
      {/* ── TERBONGKAR Explosion Overlay ─────────────────────────── */}
      {showTerbongkar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Starburst background */}
            <div
              className="absolute inset-0 -m-32 rounded-full opacity-40"
              style={{
                background:
                  'radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(245,158,11,0.6) 30%, transparent 70%)',
                animation: 'ping 0.5s ease-out',
              }}
            />
            {/* Main text */}
            <div
              className="relative text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-red-600 tracking-wider select-none"
              style={{
                textShadow: '0 0 40px rgba(239,68,68,0.8), 0 0 80px rgba(245,158,11,0.5)',
                WebkitTextStroke: '3px rgba(0,0,0,0.6)',
                animation: 'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
              }}
            >
              💥 {terbongkarText} 💥
            </div>
          </div>
        </div>
      )}

      {/* ── OTP Shield Full-width Banner ─────────────────────────── */}
      {showOtpShield && (
        <div
          className="fixed top-0 left-0 right-0 z-[90] bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 border-b-4 border-emerald-800 shadow-[0_4px_40px_rgba(16,185,129,0.6)]"
          style={{ animation: 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <div className="flex items-center justify-center gap-4 px-6 py-4">
            <Shield className="w-10 h-10 text-white animate-pulse" />
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-white tracking-widest uppercase drop-shadow-lg">
                🛡️ THE OTP SHIELD ACTIVATED 🛡️
              </div>
              <div className="text-sm md:text-base font-bold text-emerald-100 mt-1">
                Kode OTP adalah RAHASIA MUTLAK. Tidak pernah diminta oleh pihak bank manapun!
              </div>
            </div>
            <Lock className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>
      )}

      {/* ── SMS OTP Notification Slide-in ─────────────────────────── */}
      {showOtpSms && !otpDismissed && (
        <div
          className="fixed top-4 left-1/2 z-[80] w-[92%] max-w-md"
          style={{
            transform: 'translateX(-50%)',
            animation: 'slideFromTop 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="bg-slate-800 border-2 border-amber-500 rounded-2xl shadow-[0_8px_40px_rgba(245,158,11,0.4)] p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 uppercase">SMS • BCA</span>
                  <span className="text-[10px] text-slate-400">baru saja</span>
                </div>
                <p className="text-sm text-white font-semibold leading-snug">
                  Kode OTP Anda: <span className="font-mono text-lg text-amber-300 font-black tracking-widest">847 291</span>
                </p>
                <div className="mt-2 bg-red-950/80 border border-red-500 rounded-lg px-3 py-1.5">
                  <p className="text-xs font-black text-red-400 uppercase tracking-wide">
                    ⚠️ JANGAN BERIKAN KODE INI KEPADA SIAPAPUN ⚠️
                  </p>
                  <p className="text-[10px] text-red-300 mt-0.5">
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
              className="w-full mt-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              <ChevronDown className="w-3 h-3" /> Tutup Notifikasi
            </button>
          </div>
        </div>
      )}

      {/* ── Main Layout ──────────────────────────────────────────── */}
      <div className="relative w-full max-w-6xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-amber-600 px-5 py-3 flex items-center justify-between rounded-t-2xl border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/40 rounded-xl border-2 border-black/30 animate-pulse">
              <PhoneCall className="w-5 h-5 text-rose-300 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base md:text-xl font-black text-white uppercase tracking-wide">
                ☎️ INTEROGASI VISHING DETECTOR
              </h2>
              <p className="text-[10px] md:text-xs font-semibold text-rose-100/80">
                Bongkar semua kebohongan penipu & analisis Caller ID!
              </p>
            </div>
          </div>
          <div className="bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 text-center">
            <div className="text-[10px] text-amber-300 font-bold uppercase">Terbongkar</div>
            <div className="text-lg font-black text-white">
              {completedChecks}
              <span className="text-amber-400">/{totalChecks}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-slate-950 rounded-b-2xl border-x-4 border-b-4 border-black">
          {/* ── LEFT: Phone Screen ────────────────────────────────── */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-[#0a0f1a] p-4 md:p-6 flex flex-col items-center overflow-y-auto border-r-4 border-black/40">
            {/* Phone Frame */}
            <div className="w-full max-w-xs">
              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-1.5 text-[10px] font-semibold text-slate-400">
                <span>17:42</span>
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <span>4G</span>
                  <span>■■■</span>
                </div>
              </div>

              {/* Green call indicator */}
              <div className="relative mx-auto w-24 h-24 mb-4 mt-2">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="absolute inset-1 rounded-full bg-emerald-500/30 animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-4 border-emerald-300/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                {/* Active call dot */}
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-lg animate-pulse" />
              </div>

              {/* Contact Info */}
              <div className="text-center mb-4">
                <div className="text-lg font-black text-white">
                  &quot;HaloBCA&quot;
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Customer Service (?)
                </div>
                <div className="mt-1 font-mono text-emerald-400 text-sm font-bold tracking-wide">
                  {formatTime(callDuration)}
                </div>
              </div>

              {/* ── Audio Waveform Visualizer ─────────────────────── */}
              <div className="w-full bg-black/60 rounded-2xl p-3 mb-4 border border-slate-800">
                <div className="flex items-end justify-center gap-[3px] h-16">
                  {getWaveBars().map((height, i) => (
                    <div
                      key={i}
                      className="w-[6px] rounded-full transition-all duration-100"
                      style={{
                        height: `${height}%`,
                        background: isTalking
                          ? `linear-gradient(to top, #10b981, #34d399)`
                          : '#334155',
                        opacity: isTalking ? 0.7 + Math.random() * 0.3 : 0.3,
                      }}
                    />
                  ))}
                </div>
                <div className="text-center mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {isTalking ? '🔊 Scammer Berbicara...' : '🔇 Jeda...'}
                </div>
              </div>

              {/* ── Caller ID Comparison ──────────────────────────── */}
              <div
                onClick={handleAnalyzePrefix}
                className={`w-full rounded-2xl border-2 p-3 mb-4 cursor-pointer transition-all duration-300 ${
                  analyzedPrefix
                    ? 'bg-red-950/60 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    : 'bg-slate-900/80 border-dashed border-amber-500/60 hover:border-amber-400 hover:bg-slate-900'
                }`}
              >
                {!analyzedPrefix ? (
                  <div className="text-center">
                    <Search className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-amber-400 uppercase mb-2">
                      🔍 Klik untuk Analisis Caller ID
                    </div>
                    <div className="font-mono text-base text-white font-black tracking-widest">
                      +62 821-9988-7711
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-red-400 uppercase text-center tracking-wider">
                      ⚠️ PERBANDINGAN CALLER ID
                    </div>
                    {/* Side by side comparison */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-red-950/80 border border-red-600 rounded-xl p-2 text-center">
                        <div className="text-[9px] font-bold text-red-400 uppercase mb-1">
                          <UserX className="w-3 h-3 inline mr-0.5" />
                          Nomor Mereka
                        </div>
                        <div className="font-mono text-xs text-red-300 font-black">
                          +62 821-xxxx
                        </div>
                        <div className="text-[8px] text-red-500 font-bold mt-0.5">
                          ❌ HP BIASA
                        </div>
                      </div>
                      <div className="bg-emerald-950/80 border border-emerald-600 rounded-xl p-2 text-center">
                        <div className="text-[9px] font-bold text-emerald-400 uppercase mb-1">
                          <ShieldCheck className="w-3 h-3 inline mr-0.5" />
                          HaloBCA Asli
                        </div>
                        <div className="font-mono text-xs text-emerald-300 font-black">
                          1500888
                        </div>
                        <div className="text-[8px] text-emerald-500 font-bold mt-0.5">
                          ✅ 5-7 DIGIT
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-center text-red-300 font-bold">
                      CS Bank resmi WAJIB pakai nomor 5-7 digit!
                    </div>
                  </div>
                )}
              </div>

              {/* ── Scammer's Current Dialogue ────────────────────── */}
              <div className="w-full bg-slate-900/90 rounded-xl border border-slate-700 p-3 mb-4">
                <div className="text-[10px] font-bold text-rose-400 uppercase mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Kata-kata Penipu:
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed font-semibold">
                  {getCurrentDialogue()}
                </p>
              </div>

              {/* ── Scammer Panic Meter ───────────────────────────── */}
              <div className="w-full bg-black/60 rounded-xl border border-slate-800 p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                    Scammer Panic Meter
                  </span>
                  <span className="text-xs font-black text-white">
                    {panicPercent}%
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getPanicColor()} transition-all duration-700 ease-out`}
                    style={{ width: `${panicPercent}%` }}
                  />
                </div>
                <div className="text-center mt-1.5 text-xs font-bold text-slate-300">
                  {getPanicLabel()}
                </div>
              </div>

              {/* ── Scammer Confidence Meter ──────────────────────── */}
              <div className="w-full bg-black/60 rounded-xl border border-slate-800 p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">
                    Scammer Confidence
                  </span>
                  <span className="text-xs font-black text-white">
                    {confidencePercent}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 ease-out"
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
              </div>

              {/* ── Action Buttons ────────────────────────────────── */}
              <div className="w-full space-y-2">
                {/* Activate OTP Shield button (shown only when all lies exposed + caller ID checked) */}
                {canActivateShield && !showOtpShield && (
                  <button
                    onClick={handleActivateShield}
                    className="w-full py-3 px-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-emerald-400 bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse hover:from-emerald-500 hover:to-green-400 active:scale-95 transition-all"
                  >
                    <Shield className="w-5 h-5" />
                    AKTIFKAN OTP SHIELD!
                    <Zap className="w-5 h-5" />
                  </button>
                )}

                {/* Hangup button */}
                <button
                  onClick={handleHangup}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all ${
                    canHangup
                      ? 'border-red-400 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)] active:scale-95'
                      : 'border-slate-700 bg-slate-800/80 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <PhoneOff className="w-5 h-5" />
                  {canHangup
                    ? '📵 PUTUS PANGGILAN SEKARANG!'
                    : showOtpShield
                    ? 'Memproses...'
                    : canActivateShield
                    ? 'Aktifkan OTP Shield dulu!'
                    : `Bongkar semua kebohongan (${completedChecks}/${totalChecks})`}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Investigation Tools Panel ─────────────────── */}
          <div className="lg:col-span-7 bg-gradient-to-b from-[#0c1221] to-[#060a14] p-4 md:p-5 flex flex-col overflow-y-auto">
            {/* Panel Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-800">
              <div className="p-1.5 bg-amber-500/10 rounded-lg">
                <Eye className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                  🕵️ Panel Investigasi — Pertanyaan Kritis
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Tanyakan pertanyaan jebakan untuk membongkar kebohongan penipu
                </p>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-2 mb-4">
              {questionList.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => handleAskQuestion(q.id)}
                  className={`group p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    q.isAsked
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-slate-900/50 hover:bg-slate-800/80 border-slate-700/60 hover:border-amber-400/80 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                          q.isAsked
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 text-amber-400 group-hover:bg-amber-500/20'
                        }`}
                      >
                        {q.isAsked ? '✓' : idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        Pertanyaan #{idx + 1}
                      </span>
                    </div>
                    {q.isAsked ? (
                      <span className="text-[9px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                        💥 Terbongkar
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-600 group-hover:text-amber-400 font-bold uppercase transition-colors">
                        Klik untuk tanyakan →
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-200 pl-8">
                    &ldquo;{q.question}&rdquo;
                  </div>
                </div>
              ))}
            </div>

            {/* ── Response Panel ──────────────────────────────────── */}
            <div className="flex-1 bg-slate-900/60 border-2 border-slate-800 rounded-2xl p-4 min-h-[140px]">
              {activeQuestion ? (
                <div className="space-y-3">
                  {/* Scammer reaction */}
                  <div className="p-3 bg-gradient-to-r from-rose-950/60 to-red-950/40 border border-rose-500/40 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <UserX className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">
                        Reaksi Penipu:
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white italic leading-relaxed">
                      &ldquo;{activeQuestion.response}&rdquo;
                    </p>
                  </div>

                  {/* Security fact */}
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                        Fakta Keamanan:
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-3">
                    <MessageSquare className="w-7 h-7 text-slate-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 max-w-xs">
                    Pilih pertanyaan di atas untuk menginterogasi penipu dan melihat
                    bagaimana mereka gagap menjawab!
                  </p>
                  <HelpCircle className="w-4 h-4 text-slate-700 mt-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Inline Keyframe Animations ─────────────────────────────── */}
      <style jsx global>{`
        @keyframes bounceIn {
          0% {
            transform: scale(0.3) rotate(-5deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(2deg);
            opacity: 1;
          }
          70% {
            transform: scale(0.95) rotate(-1deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes slideFromTop {
          0% {
            transform: translateX(-50%) translateY(-120%);
            opacity: 0;
          }
          100% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
