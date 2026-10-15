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
  X,
} from 'lucide-react';
import { playAlarm, playBuzz, playClick, playEvidenceFound, playStampReveal, playTensionRise, playScanningBeep } from '../utils/sound';
import { Mascot } from './Mascot';

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
    setFeedback('Salah! Membuka aplikasi bank di HP yang sedang terinfeksi justru mempermudah penipu mencatat PIN Anda!');
    setTimeout(() => setShaking(false), 600);
    setTimeout(() => setWrongFlash(false), 300);
    setTimeout(() => setFeedback(null), 3500);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Status visual per langkah
  const renderPlaneVisual = (step: Step) => {
    if (step.animating) {
      return (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[var(--ink-muted)]">
          <SignalLow className="h-3.5 w-3.5 animate-pulse" />
          <span>Memutuskan sinyal...</span>
        </div>
      );
    }
    if (step.completed) {
      return (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[var(--teal-deep)]">
          <WifiOff className="h-3.5 w-3.5" />
          <SignalZero className="h-3.5 w-3.5" />
          <span>Sinyal terputus</span>
        </div>
      );
    }
    return (
      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[var(--red-deep)]">
        <Wifi className="h-3.5 w-3.5" />
        <Signal className="h-3.5 w-3.5" />
        <span>Sinyal aktif — data masih bocor!</span>
      </div>
    );
  };

  const renderPhoneVisual = (step: Step) => {
    if (step.animating) {
      return (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[var(--ink-muted)]">
          <Phone className="h-3.5 w-3.5" />
          <span>Menghubungi bank...</span>
        </div>
      );
    }
    if (step.completed) {
      return (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[var(--teal-deep)]">
          <PhoneOff className="h-3.5 w-3.5" />
          <span>Akun diblokir sementara</span>
        </div>
      );
    }
    return (
      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[var(--red-deep)]">
        <Phone className="h-3.5 w-3.5" />
        <span>Akun bank masih terbuka!</span>
      </div>
    );
  };

  const renderTrashVisual = (step: Step) => {
    if (step.animating) {
      return (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[var(--ink-muted)]">
          <XCircle className="h-3.5 w-3.5 animate-spin" />
          <span>Menghapus malware...</span>
        </div>
      );
    }
    if (step.completed) {
      return (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[var(--teal-deep)]">
          <Shield className="h-3.5 w-3.5" />
          <span>Malware dihapus</span>
        </div>
      );
    }
    return (
      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[var(--red-deep)]">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>Malware masih aktif!</span>
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

  // Penyelesaian: momen tenang, lalu lanjut
  if (allComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(14,22,38,0.6)] p-4 backdrop-blur-sm">
        <div className="fade-slide-up w-full max-w-md rounded-[14px] border border-[var(--line-strong)] bg-[var(--white)] p-8 text-center shadow-[0_24px_70px_rgba(14,22,38,0.35)]">
          <Mascot name="success" alt="" className="mx-auto h-24 w-24" />
          <span className="chip chip-teal mt-4">
            <Shield className="h-3.5 w-3.5" /> Protokol darurat selesai
          </span>
          <h2 className="mt-3 text-[1.6rem]">Sistem diamankan.</h2>
          <p className="mt-2 text-[0.92rem] leading-7 text-[var(--ink-muted)]">
            Ketiga langkah berhasil dijalankan — sinyal diputus, akun diblokir, dan aplikasi palsu
            dihapus. Tabungan Ibu aman!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-150 ${
        wrongFlash ? 'bg-[rgba(176,53,53,0.7)]' : 'bg-[rgba(14,22,38,0.6)]'
      }`}
    >
      <div
        className={`relative flex max-h-[95vh] w-full max-w-3xl flex-col space-y-4 overflow-y-auto rounded-[14px] border border-[var(--line-strong)] bg-[var(--white)] p-5 shadow-[0_24px_70px_rgba(14,22,38,0.35)] md:p-7 ${
          shaking ? 'animate-shake' : ''
        }`}
      >
        {/* Banner peringatan: tegas, tanpa kedip */}
        <div className="flex items-start gap-3 rounded-[10px] border border-[#f0c4c4] bg-[var(--red-tint)] p-4">
          <ShieldAlert className="mt-0.5 h-7 w-7 shrink-0 text-[var(--red-deep)]" />
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[1.05rem] font-bold text-[var(--red-deep)]">
              <Zap className="h-4 w-4 shrink-0" />
              Darurat! APK terlanjur diinstal
            </div>
            <div className="mt-0.5 text-xs font-medium leading-5 text-[#8a4141]">
              Malware sedang mencoba membaca notifikasi SMS OTP. Jalankan 3 langkah tanggap darurat sekarang.
            </div>
          </div>
        </div>

        {/* Countdown & progres */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-[8px] border px-4 py-2 font-mono text-lg font-bold ${
              countdown <= 10
                ? 'border-[#f0c4c4] bg-[var(--red-tint)] text-[var(--red-deep)]'
                : countdown <= 30
                ? 'border-[#ecd9a3] bg-[var(--yellow-tint)] text-[#6d5410]'
                : 'border-[var(--line-strong)] bg-[var(--white)] text-[var(--ink-soft)]'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>{formatTime(countdown)}</span>
          </div>

          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[0.7rem] font-bold text-[var(--ink-muted)]">Progres mitigasi</span>
              <span className="text-xs font-bold text-[var(--ink)]">{completedCount}/3</span>
            </div>
            <div className="meter">
              <span style={{ width: `${(completedCount / 3) * 100}%`, backgroundColor: 'var(--teal)' }} />
            </div>
          </div>
        </div>

        {/* Langkah mitigasi */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => !step.completed && !step.animating && handleExecute(step.id)}
              className={`cursor-pointer rounded-[10px] border p-4 transition-all duration-300 ${
                step.completed
                  ? 'border-[#b9dcd9] bg-[var(--teal-tint)]'
                  : step.animating
                  ? 'border-[#ecd9a3] bg-[var(--yellow-tint)]'
                  : 'border-[var(--line-strong)] bg-[var(--white)] hover:border-[var(--ink)]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3.5">
                  <span
                    className={`icon-tile shrink-0 ${
                      step.completed
                        ? '!border-[#b9dcd9] !bg-white !text-[var(--teal-deep)]'
                        : step.animating
                        ? '!border-[#ecd9a3] !bg-white !text-[#6d5410]'
                        : '!bg-[var(--red-tint)] !text-[var(--red-deep)]'
                    }`}
                  >
                    {step.icon === 'plane' && <Plane className="h-5 w-5" />}
                    {step.icon === 'phone' && <PhoneCall className="h-5 w-5" />}
                    {step.icon === 'trash' && <Trash2 className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={`text-sm font-bold md:text-[0.95rem] ${
                        step.completed ? 'text-[var(--teal-deep)] line-through' : 'text-[var(--ink)]'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="mt-0.5 max-w-xl text-xs leading-5 text-[var(--ink-muted)]">{step.desc}</div>
                    {renderVisual(step)}
                  </div>
                </div>

                <div className="shrink-0">
                  {step.completed ? (
                    <CheckCircle2 className="h-7 w-7 text-[var(--teal-deep)]" />
                  ) : step.animating ? (
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--teal-deep)] border-t-transparent" />
                  ) : (
                    <span className="btn btn-teal btn-sm pointer-events-none">
                      Jalankan
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Opsi jebakan (salah) */}
          <div
            onClick={handleWrongTrap}
            className="group flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-dashed border-[#f0c4c4] bg-[var(--red-tint)] p-3.5 text-xs font-medium text-[var(--red-deep)] transition-colors hover:border-[var(--red)]"
          >
            <span className="flex items-center gap-2">
              <X size={14} className="shrink-0" />
              [Jebakan] Buka m-Banking sekarang di HP yang sama untuk cek saldo
            </span>
            <span className="shrink-0 text-[10px] font-bold uppercase">Jangan lakukan</span>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="animate-shake flex items-center justify-center gap-2 rounded-[10px] border border-[#f0c4c4] bg-[var(--red-tint)] p-3.5 text-center text-xs font-bold text-[var(--red-deep)] md:text-sm">
            <Mascot name="alert" alt="" className="h-7 w-7 shrink-0" />
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};
