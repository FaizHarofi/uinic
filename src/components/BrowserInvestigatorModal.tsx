'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Lock,
  TrendingUp,
  Users,
  Clock,
  Star,
  CreditCard,
  Eye,
  FileWarning,
  ScanLine,
  Database,
  ImageIcon,
  CheckCircle2,
  XCircle,
  Zap,
  Shield,
  UserRound,
} from 'lucide-react';
import { BrowserToolResult } from '../types/game';
import { playBuzz, playClick, playDramaticHit, playEvidenceFound } from '../utils/sound';

interface BrowserInvestigatorModalProps {
  tools: BrowserToolResult[];
  onFinishInvestigation: () => void;
}

export const BrowserInvestigatorModal: React.FC<BrowserInvestigatorModalProps> = ({
  tools,
  onFinishInvestigation,
}) => {
  const [toolList, setToolList] = useState<BrowserToolResult[]>(tools);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [scanningToolId, setScanningToolId] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [revealedToolId, setRevealedToolId] = useState<string | null>(null);
  const [fraudScore, setFraudScore] = useState(0);
  const [showFinalBanner, setShowFinalBanner] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3542);

  const analyzedCount = toolList.filter((t) => t.isAnalyzed).length;
  const isAllAnalyzed = analyzedCount >= 3;

  // Countdown timer for fake website
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate fraud score when tools are analyzed
  useEffect(() => {
    const targetScore = analyzedCount === 0 ? 0 : analyzedCount === 1 ? 34 : analyzedCount === 2 ? 67 : 97;
    const step = targetScore > fraudScore ? 1 : -1;
    if (fraudScore !== targetScore) {
      const timer = setInterval(() => {
        setFraudScore((prev) => {
          const next = prev + step;
          if ((step > 0 && next >= targetScore) || (step < 0 && next <= targetScore)) {
            clearInterval(timer);
            return targetScore;
          }
          return next;
        });
      }, 20);
      return () => clearInterval(timer);
    }
  }, [analyzedCount, fraudScore]);

  // Show final banner after all analyzed
  useEffect(() => {
    if (isAllAnalyzed && fraudScore >= 97) {
      const timer = setTimeout(() => {
        playDramaticHit();
        setShowFinalBanner(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAllAnalyzed, fraudScore]);

  const formatCountdown = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleRunTool = (toolId: string) => {
    const target = toolList.find((t) => t.toolId === toolId);
    if (!target) return;

    if (target.isAnalyzed) {
      playClick();
      setSelectedToolId(toolId);
      setRevealedToolId(toolId);
      return;
    }

    if (scanningToolId) {
      playBuzz();
      return;
    }

    playClick();
    setSelectedToolId(toolId);
    setScanningToolId(toolId);
    setScanProgress(0);
    setRevealedToolId(null);

    const totalSteps = 30;
    const interval = 1500 / totalSteps;
    let step = 0;
    const progressTimer = setInterval(() => {
      step++;
      setScanProgress(Math.min((step / totalSteps) * 100, 100));
      if (step >= totalSteps) {
        clearInterval(progressTimer);
        playDramaticHit();

        setTimeout(() => {
          playEvidenceFound();
          setScanningToolId(null);
          setRevealedToolId(toolId);
          setToolList((prev) =>
            prev.map((t) => (t.toolId === toolId ? { ...t, isAnalyzed: true } : t))
          );
        }, 350);
      }
    }, interval);
  };

  const toolIcons: Record<string, React.ReactNode> = {
    whois: <Database className="h-5 w-5" />,
    cekrekening: <CreditCard className="h-5 w-5" />,
    reverse_img: <ImageIcon className="h-5 w-5" />,
  };

  // ─── Detailed results ──────────────────────────────────────────────
  const renderWhoisResult = (tool: BrowserToolResult) => (
    <div className="fade-slide-up space-y-3">
      <div className="flex justify-center">
        <span className="chip chip-red">
          <ShieldAlert size={13} /> Bahaya — domain baru & tersembunyi
        </span>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[var(--line)]">
        <table className="w-full text-xs">
          <tbody>
            {[
              ['Registrar', 'NameCheap Inc. (Budget Registrar)'],
              ['Domain dibuat', '12 hari yang lalu'],
              ['Kadaluarsa', '1 tahun (minimum)'],
              ['Negara server', 'Rusia (bukan Indonesia)'],
              ['SSL certificate', 'Self-signed / tidak valid'],
              ['Pemilik domain', 'Tersembunyi (WhoisGuard)'],
            ].map(([label, value], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-[var(--mist)]' : 'bg-white'}>
                <td className="w-1/3 border-r border-[var(--line)] px-3 py-2 font-semibold text-[var(--ink-muted)]">{label}</td>
                <td className="px-3 py-2 font-semibold text-[var(--red-deep)]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-2 rounded-[8px] border border-[#f0c4c4] bg-[var(--red-tint)] p-3 text-xs font-semibold leading-relaxed text-[var(--red-deep)]">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{tool.finding}</span>
      </div>
    </div>
  );

  const renderCekrekeningResult = (tool: BrowserToolResult) => (
    <div className="fade-slide-up space-y-3">
      <div className="flex justify-center">
        <span className="chip chip-red">
          <AlertTriangle size={13} /> Rekening terlapor warga
        </span>
      </div>

      <div className="space-y-2 rounded-[8px] border border-[var(--line)] bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--ink-muted)]">Total laporan</span>
          <span className="text-lg font-bold text-[var(--red-deep)]">47 laporan</span>
        </div>
        <div className="h-px bg-[var(--line)]" />

        <div className="space-y-1.5">
          {[
            { name: 'W***n (Bandung)', date: '2 hari lalu', amount: 'Rp 2.500.000' },
            { name: 'S***a (Surabaya)', date: '5 hari lalu', amount: 'Rp 5.000.000' },
            { name: 'B***i (Jakarta)', date: '1 minggu lalu', amount: 'Rp 1.800.000' },
            { name: 'R***a (Medan)', date: '1 minggu lalu', amount: 'Rp 3.200.000' },
          ].map((reporter, i) => (
            <div key={i} className="flex items-center justify-between rounded-[6px] bg-[var(--mist)] px-3 py-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <XCircle className="h-3.5 w-3.5 text-[var(--red-deep)]" />
                <span className="font-semibold text-[var(--ink-soft)]">{reporter.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[var(--red-deep)]">{reporter.amount}</span>
                <span className="text-[var(--ink-muted)]">{reporter.date}</span>
              </div>
            </div>
          ))}
          <div className="text-center text-[10px] italic text-[var(--ink-muted)]">...dan 43 laporan lainnya</div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-[8px] border border-[#f0c4c4] bg-[var(--red-tint)] p-3 text-xs font-semibold leading-relaxed text-[var(--red-deep)]">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{tool.finding}</span>
      </div>
    </div>
  );

  const renderReverseImgResult = (tool: BrowserToolResult) => (
    <div className="fade-slide-up space-y-3">
      <div className="flex justify-center">
        <span className="chip chip-red">
          <Eye size={13} /> Foto profil ternyata stok komersial
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[8px] border border-[var(--line)] bg-white p-2">
          <div className="mb-2 text-center text-[10px] font-bold uppercase text-[var(--ink-muted)]">Foto di website</div>
          <div className="relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-[6px] border border-[#f0c4c4] bg-[var(--red-tint)]">
            <UserRound className="mb-1 h-9 w-9 text-[var(--red-deep)]" />
            <div className="text-[10px] font-semibold text-[var(--red-deep)]">&quot;Dr. Hendra Wijaya&quot;</div>
            <div className="text-[9px] text-[#8a4141]">CEO BursaKripto</div>
            <span className="absolute right-1 top-1 rounded bg-[var(--red-deep)] px-1.5 py-0.5 text-[8px] font-bold text-white">PALSU</span>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#b9dcd9] bg-white p-2">
          <div className="mb-2 text-center text-[10px] font-bold uppercase text-[var(--teal-deep)]">Sumber asli</div>
          <div className="relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-[6px] border border-[#b9dcd9] bg-[var(--teal-tint)]">
            <UserRound className="mb-1 h-9 w-9 text-[var(--teal-deep)]" />
            <div className="text-[10px] font-semibold text-[var(--teal-deep)]">Stock Photo #SK-44821</div>
            <div className="text-[9px] text-[var(--ink-muted)]">Shutterstock.com</div>
            <span className="absolute right-1 top-1 rounded bg-[var(--teal-deep)] px-1.5 py-0.5 text-[8px] font-bold text-white">ASLI</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 rounded-[8px] border border-[var(--line)] bg-white p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--ink-muted)]">Confidence match</span>
          <span className="text-sm font-bold text-[var(--red-deep)]">98,7%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[var(--mist)]">
          <div className="h-full rounded-full bg-[var(--red)] transition-all duration-1000" style={{ width: '98.7%' }} />
        </div>
        <div className="text-center text-[10px] text-[var(--ink-muted)]">
          Foto identik ditemukan di database stok foto komersial
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-[8px] border border-[#f0c4c4] bg-[var(--red-tint)] p-3 text-xs font-semibold leading-relaxed text-[var(--red-deep)]">
        <Eye className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{tool.finding}</span>
      </div>
    </div>
  );

  const renderToolResult = (toolId: string) => {
    const tool = toolList.find((t) => t.toolId === toolId);
    if (!tool) return null;

    switch (toolId) {
      case 'whois':
        return renderWhoisResult(tool);
      case 'cekrekening':
        return renderCekrekeningResult(tool);
      case 'reverse_img':
        return renderReverseImgResult(tool);
      default:
        return null;
    }
  };

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(14,22,38,0.65)] p-2 backdrop-blur-sm sm:p-4">

      {/* Banner final */}
      {showFinalBanner && (
        <div className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center">
          <div className="fade-slide-up rounded-[14px] border border-[var(--line-strong)] bg-[var(--white)] px-8 py-6 text-center shadow-[0_24px_70px_rgba(14,22,38,0.4)]">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--ink-muted)]">Hasil investigasi</div>
            <div className="mt-1 text-2xl font-bold text-[var(--ink)] sm:text-3xl">
              Fraud score: <span className="text-[var(--red-deep)]">97/100</span>
            </div>
            <span className="chip chip-red mt-2">
              <CheckCircle2 size={13} /> Confirmed scam — situs penipuan terverifikasi
            </span>
          </div>
        </div>
      )}

      <div className="relative flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-[14px] border border-[var(--line-strong)] bg-[var(--white)] shadow-[0_24px_70px_rgba(14,22,38,0.4)]">

        {/* Browser chrome (artefak, versi terang) */}
        <div className="flex shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--mist)] px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-[#e33e38] bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full border border-[#d49c11] bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full border border-[#1faa32] bg-[#28c840]" />
          </div>

          <div className="flex max-w-[200px] items-center gap-2 truncate rounded-t-[6px] border border-b-0 border-[var(--line)] bg-[var(--white)] px-3 py-1.5 text-[11px] font-medium text-[var(--ink-soft)]">
            <Globe className="h-3 w-3 shrink-0 text-[var(--ink-muted)]" />
            <span className="truncate">BursaKriptoNusantara VIP</span>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-[7px] border border-[var(--line-strong)] bg-[var(--white)] px-3 py-1.5">
            <Shield className={`h-4 w-4 ${fraudScore > 60 ? 'text-[var(--red-deep)]' : fraudScore > 30 ? 'text-[#6d5410]' : 'text-[var(--ink-muted)]'}`} />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase leading-none text-[var(--ink-muted)]">Fraud score</span>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-20 overflow-hidden rounded-full bg-[var(--mist)]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${fraudScore}%`, background: fraudScore > 60 ? 'var(--red)' : '#F0C75E' }}
                  />
                </div>
                <span className={`text-xs font-bold tabular-nums ${fraudScore > 60 ? 'text-[var(--red-deep)]' : 'text-[var(--ink-soft)]'}`}>
                  {fraudScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* URL bar */}
        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--line)] bg-[var(--white)] px-4 py-2">
          <div className="flex flex-1 items-center gap-2 rounded-[7px] border border-[var(--line)] bg-[var(--mist)] px-3 py-1.5 font-mono text-xs">
            <Lock className="h-3.5 w-3.5 text-[var(--red-deep)]" />
            <span className="rounded bg-[#fbebeb] px-1.5 py-0.5 text-[9px] font-bold text-[#b03535]">NOT SECURE</span>
            <span className="select-none text-[var(--line-strong)]">|</span>
            <span className="truncate text-[var(--red-deep)]">https://bursakriptonusantara-vip.xyz/task-vip</span>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-[7px] border border-[#f0c4c4] bg-[var(--red-tint)] px-2.5 py-1 text-[10px] font-bold text-[var(--red-deep)]">
            <FileWarning className="h-3 w-3" />
            PHISHING
          </span>
        </div>

        {/* Split view */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">

          {/* KIRI: mockup situs scam (artefak garang, tapi di dalam sandbox) */}
          <div className="overflow-y-auto border-b border-[#22304a] bg-[#14120c] lg:col-span-5 lg:border-b-0 lg:border-r">
            <div className="space-y-3 p-4">

              {/* Site header */}
              <div className="rounded-[10px] bg-[#F0C75E] p-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5c4a10]">Platform #1 Indonesia</div>
                <div className="text-lg font-extrabold leading-tight text-[#14120c]">BursaKriptoNusantara</div>
                <span className="mt-1 inline-block rounded bg-[#14120c] px-2 py-0.5 text-[10px] font-bold text-[#F0C75E]">
                  VIP MEMBER AREA
                </span>
              </div>

              {/* Profit chart */}
              <div className="rounded-[10px] border border-[#2a2415] bg-[#1c1912] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#54d18a]">
                    <TrendingUp className="h-3 w-3" /> LIVE PROFIT
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#54d18a]">+342,7%</span>
                </div>
                <div className="flex h-16 items-end gap-1">
                  {[35, 45, 30, 55, 65, 50, 72, 80, 68, 85, 90, 95, 88, 92, 98].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-[#2e8b57]" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="mt-1 text-center text-[9px] text-[#8696a0]">Data profit member (DIPALSUKAN)</div>
              </div>

              {/* Countdown */}
              <div className="space-y-1 rounded-[10px] border border-[#7a2f2f] bg-[#241417] p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase text-[#f2b8b5]">
                  <Clock className="h-3 w-3" /> Slot VIP tersisa
                </div>
                <div className="font-mono text-2xl font-bold tracking-wider text-white">{formatCountdown(countdownSeconds)}</div>
                <div className="text-[10px] font-semibold text-[#f2b8b5]">Hanya 3 slot lagi — daftar sekarang!</div>
              </div>

              {/* Deposit form */}
              <div className="space-y-2 rounded-[10px] border border-[#2a2415] bg-[#1c1912] p-3">
                <div className="text-xs font-bold uppercase text-[#F0C75E]">Deposit &amp; mulai profit</div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-[6px] border border-[#2a2415] bg-[#14120c] px-3 py-2 text-xs text-[#8696a0]">
                    <span>Jumlah deposit</span>
                    <span className="font-bold text-[#54d18a]">Rp 1.000.000</span>
                  </div>
                  <div className="rounded-[6px] border border-[#2a2415] bg-[#14120c] px-3 py-2">
                    <span className="block text-[10px] text-[#8696a0]">Transfer ke:</span>
                    <span className="block font-mono text-[11px] font-bold text-[#54d18a]">Bank Digital: 7720-1123-991</span>
                    <span className="block text-[10px] text-[#8696a0]">a.n Ahmad Penampung</span>
                  </div>
                  <div className="cursor-not-allowed rounded-[6px] bg-[#F0C75E] py-2 text-center text-xs font-extrabold text-[#14120c] opacity-80">
                    DEPOSIT SEKARANG &rarr;
                  </div>
                </div>
              </div>

              {/* Testimoni */}
              <div className="space-y-2 rounded-[10px] border border-[#2a2415] bg-[#1c1912] p-3">
                <div className="flex items-center gap-1 text-xs font-bold text-[#d1d7e0]">
                  <Users className="h-3 w-3 text-[#F0C75E]" /> Testimoni member VIP
                </div>
                {[
                  { name: 'A***i', text: 'Sudah profit Rp 15jt dalam 1 minggu!!' },
                  { name: 'D***a', text: 'Awalnya ragu, ternyata beneran cair!' },
                  { name: 'M***n', text: 'Platform terpercaya, CS ramah 24/7' },
                ].map((t, i) => (
                  <div key={i} className="space-y-0.5 rounded-[6px] bg-[#14120c] p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#d1d7e0]">{t.name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="h-2.5 w-2.5 fill-[#F0C75E] text-[#F0C75E]" />
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-[#8696a0]">{t.text}</div>
                  </div>
                ))}
                <div className="text-center text-[9px] italic text-[#f2b8b5]">(Semua testimoni di atas adalah PALSU)</div>
              </div>

              {/* Founder */}
              <div className="flex items-center gap-3 rounded-[10px] border border-[#2a2415] bg-[#1c1912] p-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#F0C75E]">
                  <UserRound className="h-6 w-6 text-[#14120c]" />
                </span>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-white">
                    Dr. Hendra Wijaya
                    <CheckCircle2 className="h-3 w-3 text-[#4dd0c7]" />
                  </div>
                  <div className="text-[10px] text-[#8696a0]">
                    Founder &amp; CEO — &quot;Analis Kripto Terverifikasi OJK&quot;
                  </div>
                  <div className="text-[9px] font-bold text-[#f2b8b5]">(Identitas &amp; klaim = PALSU)</div>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: dashboard forensik (terang) */}
          <div className="overflow-y-auto bg-[var(--mist)] lg:col-span-7">
            <div className="space-y-4 p-4">

              {/* Dashboard header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="icon-tile !h-8 !w-8">
                    <ScanLine className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[var(--ink)]">CyberForensik Dashboard</div>
                    <div className="text-[10px] text-[var(--ink-muted)]">Analisis situs mencurigakan</div>
                  </div>
                </div>
                <span className={`chip font-mono ${analyzedCount === 3 ? 'chip-teal' : ''}`}>
                  {analyzedCount}/3 selesai
                </span>
              </div>

              {/* Tool cards */}
              <div className="grid grid-cols-3 gap-2">
                {toolList.map((tool) => {
                  const isScanning = scanningToolId === tool.toolId;
                  const isSelected = selectedToolId === tool.toolId;
                  const isDone = tool.isAnalyzed;

                  return (
                    <button
                      key={tool.toolId}
                      onClick={() => handleRunTool(tool.toolId)}
                      disabled={isScanning}
                      className={`relative flex flex-col items-center gap-2 overflow-hidden rounded-[10px] border p-3 text-xs font-bold transition-all duration-300 ${
                        isSelected
                          ? 'border-[var(--teal-deep)] bg-white text-[var(--teal-deep)] ring-1 ring-[var(--teal-deep)]'
                          : isDone
                          ? 'border-[#b9dcd9] bg-[var(--teal-tint)] text-[var(--teal-deep)]'
                          : 'border-[var(--line-strong)] bg-white text-[var(--ink-soft)] hover:border-[var(--ink)]'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${
                          isDone ? 'bg-[var(--teal-deep)] text-white' : 'bg-[var(--mist)] text-[var(--ink-soft)]'
                        }`}
                      >
                        {toolIcons[tool.toolId]}
                      </span>

                      <span className="w-full truncate text-center text-[11px]">{tool.name}</span>

                      {isDone ? (
                        <span className="flex items-center gap-0.5 rounded-full bg-[var(--teal-deep)] px-2 py-0.5 text-[9px] font-bold text-white">
                          <CheckCircle2 className="h-2.5 w-2.5" /> SELESAI
                        </span>
                      ) : isScanning ? (
                        <span className="rounded-full bg-[#ecd9a3] px-2 py-0.5 text-[9px] font-bold text-[#6d5410]">
                          SCANNING...
                        </span>
                      ) : (
                        <span className="rounded-full bg-[var(--mist)] px-2 py-0.5 text-[9px] font-bold text-[var(--ink-muted)]">
                          Klik untuk scan
                        </span>
                      )}

                      {isScanning && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden bg-[var(--line)]">
                          <div
                            className="h-full bg-[var(--teal)] transition-all duration-100 ease-linear"
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Scanning panel */}
              {scanningToolId && (
                <div className="card space-y-3 p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--teal-deep)] border-t-transparent" />
                    <div>
                      <div className="text-xs font-bold text-[var(--teal-deep)]">
                        Memindai {toolList.find((t) => t.toolId === scanningToolId)?.name}...
                      </div>
                      <div className="text-[10px] text-[var(--ink-muted)]">Menganalisis data forensik digital</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-3 overflow-hidden rounded-full border border-[var(--line)] bg-[var(--mist)]">
                      <div
                        className="h-full rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${scanProgress}%`, background: 'var(--teal)' }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-[var(--ink-muted)]">Scanning database...</span>
                      <span className="font-mono font-bold text-[var(--teal-deep)]">{Math.round(scanProgress)}%</span>
                    </div>
                  </div>

                  <div className="h-12 overflow-hidden rounded-[6px] bg-[var(--mist)] p-2 font-mono text-[9px] leading-4 text-[var(--ink-muted)]">
                    <div>&rarr; Connecting to threat intelligence DB...</div>
                    <div>&rarr; Cross-referencing domain registry...</div>
                    <div>&rarr; Analyzing SSL certificates...</div>
                    <div>&rarr; Checking blacklist databases...</div>
                  </div>
                </div>
              )}

              {/* Result panel */}
              {revealedToolId && !scanningToolId && (
                <div className="card space-y-3 p-4">
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-[6px] bg-[var(--mist)] text-[var(--ink-soft)]">
                        {toolIcons[revealedToolId]}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wide text-[var(--ink)]">
                        {toolList.find((t) => t.toolId === revealedToolId)?.name}
                      </span>
                    </div>
                    <span className="chip chip-red">
                      <Zap size={12} /> Temuan kritis
                    </span>
                  </div>

                  {renderToolResult(revealedToolId)}
                </div>
              )}

              {/* Empty state */}
              {!selectedToolId && !scanningToolId && (
                <div className="rounded-[10px] border border-dashed border-[var(--line-strong)] bg-white p-8 text-center">
                  <Search className="mx-auto h-7 w-7 text-[var(--ink-muted)]" />
                  <div className="mt-2 text-xs font-bold text-[var(--ink-soft)]">
                    Pilih alat forensik di atas untuk memulai investigasi
                  </div>
                  <div className="mt-1 text-[10px] text-[var(--ink-muted)]">
                    Jalankan ketiga alat untuk mengungkap penipuan
                  </div>
                </div>
              )}

              {/* Complete button */}
              <button
                onClick={() => {
                  if (isAllAnalyzed) {
                    playEvidenceFound();
                    onFinishInvestigation();
                  } else {
                    playBuzz();
                  }
                }}
                disabled={!isAllAnalyzed}
                className="btn btn-primary btn-block justify-center"
              >
                <ArrowRight className="h-4 w-4" />
                {isAllAnalyzed
                  ? 'Bongkar jebakan & sadarkan Rian!'
                  : `Jalankan semua forensik (${analyzedCount}/3 selesai)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
