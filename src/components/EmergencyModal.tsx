'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  Plane,
  PhoneCall,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Signal,
  SignalLow,
  SignalZero,
  Wifi,
  WifiOff,
  Phone,
  PhoneOff,
  Shield,
  XCircle,
  Zap,
} from 'lucide-react';
import { playAlarm, playBuzz, playClick, playEvidenceFound, playStampReveal, playTensionRise, playScanningBeep } from '../utils/sound';

interface EmergencyModalProps {
  onMitigationSuccess: () => void;
}

interface Step {
  id: string;
  title: string;
  desc: string;
  icon: 'plane' | 'phone' | 'trash';
  isCorrect: boolean;
  completed: boolean;
  animating: boolean;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onMitigationSuccess }) => {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'step-plane',
      title: '1. Aktifkan Mode Pesawat (Airplane Mode)',
      desc: 'Putuskan koneksi internet & sinyal seluler segera agar malware tidak dapat mengirimkan SMS OTP ke server penipu.',
      icon: 'plane',
      isCorrect: true,
      completed: false,
      animating: false,
    },
    {
      id: 'step-phone',
      title: '2. Hubungi Call Center Bank Resmi (Lewat HP Lain)',
      desc: 'Segera minta pemblokiran sementara akun m-Banking dan kartu ATM sebelum penipu sempat mencairkan saldo.',
      icon: 'phone',
      isCorrect: true,
      completed: false,
      animating: false,
    },
    {
      id: 'step-trash',
      title: '3. Hapus Aplikasi Palsu via Pengaturan / Safe Mode',
      desc: 'Cari aplikasi tidak dikenal di menu Aplikasi Terinstal, cabut izin aksesibilitasnya, dan hapus instalan.',
      icon: 'trash',
      isCorrect: true,
      completed: false,
      animating: false,
    },
  ]);

  const [countdown, setCountdown] = useState(60);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const alarmPlayed = useRef(false);
  const completedCount = steps.filter((s) => s.completed).length;

  // Play alarm on mount
  useEffect(() => {
    if (!alarmPlayed.current) {
      alarmPlayed.current = true;
      playAlarm();
      playTensionRise();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (allComplete) return;
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [allComplete, countdown]);

  // Play alarm periodically for urgency
  useEffect(() => {
    if (allComplete) return;
    const interval = setInterval(() => {
      if (countdown > 0 && countdown % 15 === 0) {
        playAlarm();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [allComplete, countdown]);

  const handleExecute = useCallback((id: string) => {
    setSteps((prev) => {
      const target = prev.find((s) => s.id === id);
      if (!target || target.completed || target.animating) return prev;

      playScanningBeep();

      const updated = prev.map((s) =>
        s.id === id ? { ...s, animating: true } : s
      );

      // Delay completion for animation
      setTimeout(() => {
        playClick();
        setSteps((inner) => {
          const done = inner.map((s) =>
            s.id === id ? { ...s, completed: true, animating: false } : s
          );

          const allDone = done.every((s) => s.completed);
          if (allDone) {
            setTimeout(() => {
              playStampReveal();
              setAllComplete(true);
              setShowExplosion(true);
              setTimeout(() => {
                playEvidenceFound();
              }, 400);
              setTimeout(() => {
                onMitigationSuccess();
              }, 3500);
            }, 600);
          }
          return done;
        });
      }, 800);

      return updated;
    });
  }, [onMitigationSuccess]);

  const handleWrongTrap = useCallback(() => {
    playBuzz();
    setShaking(true);
    setWrongFlash(true);
    setFeedback('SALAH! Membuka aplikasi bank di HP yang sedang terinfeksi justru mempermudah penipu mencatat PIN Anda!');
    setTimeout(() => setShaking(false), 600);
    setTimeout(() => setWrongFlash(false), 300);
    setTimeout(() => setFeedback(null), 3500);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Signal bars animation for airplane mode step
  const renderPlaneVisual = (step: Step) => {
    if (step.animating) {
      return (
        <div className="flex items-center gap-1 mt-1.5">
          <SignalLow className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-[10px] text-amber-400 font-mono animate-pulse">Memutuskan sinyal...</span>
        </div>
      );
    }
    if (step.completed) {
      return (
        <div className="flex items-center gap-1 mt-1.5">
          <WifiOff className="w-4 h-4 text-emerald-400" />
          <SignalZero className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-mono">Sinyal terputus ✓</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 mt-1.5">
        <Wifi className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        <Signal className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        <span className="text-[10px] text-rose-400 font-mono">Sinyal aktif — DATA BOCOR!</span>
      </div>
    );
  };

  // Phone call visual
  const renderPhoneVisual = (step: Step) => {
    if (step.animating) {
      return (
        <div className="flex items-center gap-1 mt-1.5">
          <Phone className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span className="text-[10px] text-cyan-400 font-mono animate-pulse">Menghubungi bank...</span>
        </div>
      );
    }
    if (step.completed) {
      return (
        <div className="flex items-center gap-1 mt-1.5">
          <PhoneOff className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-mono">Akun diblokir sementara ✓</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 mt-1.5">
        <Phone className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-[10px] text-rose-400 font-mono">Akun bank masih terbuka!</span>
      </div>
    );
  };

  // Trash / delete visual
  const renderTrashVisual = (step: Step) => {
    if (step.animating) {
      return (
        <div className="flex items-center gap-1 mt-1.5">
          <XCircle className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-[10px] text-amber-400 font-mono animate-pulse">Menghapus malware...</span>
        </div>
      );
    }
    if (step.completed) {
      return (
        <div className="flex items-center gap-1 mt-1.5">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-mono">Malware dihapus ✓</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 mt-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        <span className="text-[10px] text-rose-400 font-mono">Malware masih aktif!</span>
      </div>
    );
  };

  const renderVisual = (step: Step) => {
    switch (step.icon) {
      case 'plane': return renderPlaneVisual(step);
      case 'phone': return renderPhoneVisual(step);
      case 'trash': return renderTrashVisual(step);
    }
  };

  // Comic explosion for completion
  if (showExplosion) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
        {/* Radial burst */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[200vw] h-[200vh] absolute"
            style={{
              background: 'repeating-conic-gradient(from 0deg, #fbbf24 0deg 10deg, #f59e0b 10deg 20deg)',
              animation: 'spin 3s linear infinite',
            }}
          />
        </div>

        {/* Solid center circle */}
        <div
          className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 border-8 border-black shadow-[0_0_120px_rgba(16,185,129,0.8)]"
          style={{ animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both' }}
        />

        {/* Stamp text */}
        <div
          className="relative z-10 text-center px-4"
          style={{ animation: 'stampIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both' }}
        >
          <div className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            SISTEM
          </div>
          <div className="text-5xl md:text-7xl font-black text-amber-300 tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mt-1">
            DIAMANKAN!
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-lg md:text-xl font-bold text-emerald-100 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              Semua protokol darurat berhasil dijalankan
            </span>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="mt-2 text-sm text-emerald-200 font-semibold">
            Tabungan Ibu aman!
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-amber-400 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float ${1.5 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 1}s`,
            }}
          />
        ))}

        <style>{`
          @keyframes popIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes stampIn {
            from { transform: scale(3); opacity: 0; }
            50% { transform: scale(0.9); }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
            50% { transform: translateY(-30px) scale(1.3); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-150 ${
        wrongFlash ? 'bg-red-600/95' : ''
      }`}
      style={!wrongFlash ? { background: 'rgba(127, 29, 29, 0.92)' } : undefined}
    >
      {/* Pulsing red overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(220, 38, 38, 0.3) 100%)',
          animation: 'pulseOverlay 2s ease-in-out infinite',
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      <div
        className={`relative w-full max-w-3xl bg-slate-900 border-4 border-rose-500 rounded-3xl p-5 md:p-7 shadow-[0_0_80px_rgba(244,63,94,0.6)] flex flex-col space-y-4 max-h-[95vh] overflow-y-auto ${
          shaking ? 'animate-shake' : ''
        }`}
        style={shaking ? { animation: 'shakeHard 0.5s ease-in-out' } : undefined}
      >
        {/* Flashing Warning Banner */}
        <div
          className="relative overflow-hidden bg-rose-600 text-white p-4 rounded-2xl border-2 border-black"
          style={{ animation: 'flashBanner 1.5s ease-in-out infinite' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-700 via-red-500 to-rose-700 opacity-50" style={{ animation: 'shimmer 2s linear infinite' }} />
          <div className="relative flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 shrink-0 animate-bounce" />
            <div className="flex-1">
              <div className="font-black text-lg md:text-xl uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300" />
                DARURAT! APK TERLANJUR DIINSTAL!
                <Zap className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-xs text-rose-100 font-semibold mt-0.5">
                Malware sedang mencoba membaca notifikasi SMS OTP. Lakukan 3 langkah tanggap darurat SEKARANG!
              </div>
            </div>
          </div>
        </div>

        {/* Countdown & Progress Row */}
        <div className="flex items-center gap-3">
          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono text-lg font-black ${
              countdown <= 10
                ? 'bg-red-950 border-red-500 text-red-400'
                : countdown <= 30
                ? 'bg-amber-950 border-amber-500 text-amber-400'
                : 'bg-slate-800 border-slate-600 text-slate-300'
            }`}
            style={countdown <= 10 ? { animation: 'pulseText 0.5s ease-in-out infinite' } : undefined}
          >
            <AlertTriangle className={`w-4 h-4 ${countdown <= 10 ? 'animate-ping' : ''}`} />
            <span>{formatTime(countdown)}</span>
          </div>

          {/* Progress Bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Progres Mitigasi</span>
              <span className="text-xs font-black text-amber-400">{completedCount}/3</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(completedCount / 3) * 100}%`,
                  background:
                    completedCount === 3
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : completedCount >= 2
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : 'linear-gradient(90deg, #ef4444, #f87171)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Steps Checklist */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => !step.completed && !step.animating && handleExecute(step.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                step.completed
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : step.animating
                  ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-950/90 border-slate-700 hover:border-amber-400 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]'
              }`}
              style={
                step.completed
                  ? { animation: 'completePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      step.completed
                        ? 'bg-emerald-900 border-emerald-600'
                        : step.animating
                        ? 'bg-amber-900 border-amber-600'
                        : 'bg-slate-900 border-slate-700'
                    } transition-colors duration-300`}
                  >
                    {step.icon === 'plane' && (
                      <Plane
                        className={`w-5 h-5 ${
                          step.completed ? 'text-emerald-400' : step.animating ? 'text-amber-400 animate-pulse' : 'text-amber-400'
                        }`}
                      />
                    )}
                    {step.icon === 'phone' && (
                      <PhoneCall
                        className={`w-5 h-5 ${
                          step.completed ? 'text-emerald-400' : step.animating ? 'text-cyan-400 animate-bounce' : 'text-cyan-400'
                        }`}
                      />
                    )}
                    {step.icon === 'trash' && (
                      <Trash2
                        className={`w-5 h-5 ${
                          step.completed ? 'text-emerald-400' : step.animating ? 'text-rose-400 animate-pulse' : 'text-rose-400'
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-bold text-sm md:text-base ${
                        step.completed ? 'text-emerald-200 line-through' : 'text-white'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-300 max-w-xl">{step.desc}</div>
                    {renderVisual(step)}
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {step.completed ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  ) : step.animating ? (
                    <div className="w-7 h-7 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-xs font-black bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase hover:bg-amber-300 hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                      Jalankan
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Opsi Jebakan (Salah) */}
          <div
            onClick={handleWrongTrap}
            className="p-3.5 rounded-xl border-2 border-dashed border-rose-800/80 bg-rose-950/20 hover:bg-rose-950/50 cursor-pointer flex items-center justify-between text-xs text-rose-300 transition-all group"
          >
            <span className="group-hover:text-rose-200">❌ [Jebakan] Buka m-Banking sekarang di HP yang sama untuk cek saldo</span>
            <span className="text-[10px] text-rose-500 font-bold uppercase group-hover:text-rose-400">Jangan Lakukan</span>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className="p-3.5 bg-red-950 border-2 border-red-500 rounded-xl text-center text-xs md:text-sm font-bold text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            style={{ animation: 'fadeInShake 0.4s ease-out' }}
          >
            <div className="flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              {feedback}
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulseOverlay {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes flashBanner {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; box-shadow: 0 0 30px rgba(239, 68, 68, 0.5); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulseText {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes shakeHard {
          0%, 100% { transform: translateX(0) rotate(0); }
          10% { transform: translateX(-8px) rotate(-1deg); }
          20% { transform: translateX(8px) rotate(1deg); }
          30% { transform: translateX(-6px) rotate(-0.5deg); }
          40% { transform: translateX(6px) rotate(0.5deg); }
          50% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          70% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        @keyframes completePop {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes fadeInShake {
          0% { opacity: 0; transform: translateX(-10px); }
          25% { transform: translateX(10px); }
          50% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
