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
} from 'lucide-react';
import { BrowserToolResult } from '../types/game';
import { playBuzz, playClick, playDramaticHit, playEvidenceFound } from '../utils/sound';

// ─── Props ───────────────────────────────────────────────────────────
interface BrowserInvestigatorModalProps {
  tools: BrowserToolResult[];
  onFinishInvestigation: () => void;
}

// ─── Component ───────────────────────────────────────────────────────
export const BrowserInvestigatorModal: React.FC<BrowserInvestigatorModalProps> = ({
  tools,
  onFinishInvestigation,
}) => {
  const [toolList, setToolList] = useState<BrowserToolResult[]>(tools);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [scanningToolId, setScanningToolId] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [revealedToolId, setRevealedToolId] = useState<string | null>(null);
  const [screenFlash, setScreenFlash] = useState(false);
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

    // Already analyzed — just select to view
    if (target.isAnalyzed) {
      playClick();
      setSelectedToolId(toolId);
      setRevealedToolId(toolId);
      return;
    }

    // Already scanning something — block
    if (scanningToolId) {
      playBuzz();
      return;
    }

    playClick();
    setSelectedToolId(toolId);
    setScanningToolId(toolId);
    setScanProgress(0);
    setRevealedToolId(null);

    // Animate progress bar over 1.5s
    const totalSteps = 30;
    const interval = 1500 / totalSteps;
    let step = 0;
    const progressTimer = setInterval(() => {
      step++;
      setScanProgress(Math.min((step / totalSteps) * 100, 100));
      if (step >= totalSteps) {
        clearInterval(progressTimer);

        // Trigger dramatic reveal
        setScreenFlash(true);
        playDramaticHit();
        setTimeout(() => setScreenFlash(false), 200);

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
    whois: <Database className="w-5 h-5" />,
    cekrekening: <CreditCard className="w-5 h-5" />,
    reverse_img: <ImageIcon className="w-5 h-5" />,
  };

  const toolColors: Record<string, string> = {
    whois: 'from-violet-500 to-indigo-600',
    cekrekening: 'from-amber-500 to-orange-600',
    reverse_img: 'from-emerald-500 to-teal-600',
  };

  const getFraudScoreColor = () => {
    if (fraudScore < 30) return 'bg-emerald-500';
    if (fraudScore < 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getFraudScoreGlow = () => {
    if (fraudScore < 30) return 'shadow-emerald-500/50';
    if (fraudScore < 60) return 'shadow-amber-500/50';
    return 'shadow-rose-500/50';
  };

  // ─── Render Detailed Results ────────────────────────────────────────
  const renderWhoisResult = (tool: BrowserToolResult) => (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Warning Stamp */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="border-4 border-rose-500 rounded-lg px-6 py-2 transform -rotate-3 animate-pulse">
            <span className="text-rose-500 font-black text-lg tracking-widest uppercase">⚠ BAHAYA</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-xs">
          <tbody>
            {[
              ['Registrar', 'NameCheap Inc. (Budget Registrar)'],
              ['Domain Dibuat', '12 hari yang lalu'],
              ['Kadaluarsa', '1 tahun (minimum)'],
              ['Negara Server', '🇷🇺 Rusia (bukan Indonesia)'],
              ['SSL Certificate', '❌ Self-signed / Tidak Valid'],
              ['Pemilik Domain', '🔒 Tersembunyi (WhoisGuard)'],
            ].map(([label, value], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-slate-900/50' : 'bg-slate-950/50'}>
                <td className="px-3 py-2 font-bold text-slate-400 border-r border-slate-800 w-1/3">{label}</td>
                <td className="px-3 py-2 text-rose-300 font-semibold">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Finding */}
      <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-200 font-bold text-xs leading-relaxed flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
        <span>{tool.finding}</span>
      </div>
    </div>
  );

  const renderCekrekeningResult = (tool: BrowserToolResult) => (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Danger Stamp */}
      <div className="flex items-center justify-center">
        <div className="bg-rose-600 rounded-lg px-6 py-2 transform rotate-2 shadow-lg shadow-rose-600/40">
          <span className="text-white font-black text-base tracking-wider uppercase">🚨 REKENING TERLAPOR</span>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-700 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-bold">Total Laporan</span>
          <span className="text-lg font-black text-rose-400">47 Laporan</span>
        </div>
        <div className="h-px bg-slate-800" />

        {/* Reporter List */}
        <div className="space-y-1.5">
          {[
            { name: 'W***n (Bandung)', date: '2 hari lalu', amount: 'Rp 2.500.000' },
            { name: 'S***a (Surabaya)', date: '5 hari lalu', amount: 'Rp 5.000.000' },
            { name: 'B***i (Jakarta)', date: '1 minggu lalu', amount: 'Rp 1.800.000' },
            { name: 'R***a (Medan)', date: '1 minggu lalu', amount: 'Rp 3.200.000' },
          ].map((reporter, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-slate-300 font-semibold">{reporter.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-rose-300 font-bold">{reporter.amount}</span>
                <span className="text-slate-500">{reporter.date}</span>
              </div>
            </div>
          ))}
          <div className="text-center text-[10px] text-slate-500 italic">...dan 43 laporan lainnya</div>
        </div>
      </div>

      {/* Finding */}
      <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-200 font-bold text-xs leading-relaxed flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
        <span>{tool.finding}</span>
      </div>
    </div>
  );

  const renderReverseImgResult = (tool: BrowserToolResult) => (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Match Stamp */}
      <div className="flex items-center justify-center">
        <div className="border-4 border-amber-500 rounded-lg px-4 py-2 transform -rotate-1 animate-pulse bg-amber-950/30">
          <span className="text-amber-400 font-black text-sm tracking-wider uppercase">FOTO PALSU TERDETEKSI</span>
        </div>
      </div>

      {/* Side by Side Comparison */}
      <div className="grid grid-cols-2 gap-3">
        {/* Their Photo */}
        <div className="bg-slate-950 rounded-xl border-2 border-slate-700 p-2 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 text-center uppercase">Foto di Website</div>
          <div className="aspect-square rounded-lg bg-slate-800 flex flex-col items-center justify-center border border-slate-600 relative overflow-hidden">
            <div className="text-4xl mb-1">👨‍💼</div>
            <div className="text-[10px] text-slate-400 font-semibold">"Dr. Hendra Wijaya"</div>
            <div className="text-[9px] text-slate-500">CEO BursaKripto</div>
            {/* Red overlay */}
            <div className="absolute inset-0 bg-rose-500/10 border-2 border-rose-500/50 rounded-lg" />
            <div className="absolute top-1 right-1 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">PALSU</div>
          </div>
        </div>

        {/* Stock Photo Match */}
        <div className="bg-slate-950 rounded-xl border-2 border-emerald-700/50 p-2 space-y-2">
          <div className="text-[10px] font-bold text-emerald-400 text-center uppercase">Sumber Asli</div>
          <div className="aspect-square rounded-lg bg-slate-800 flex flex-col items-center justify-center border border-emerald-600/50 relative overflow-hidden">
            <div className="text-4xl mb-1">👨‍💼</div>
            <div className="text-[10px] text-emerald-300 font-semibold">Stock Photo #SK-44821</div>
            <div className="text-[9px] text-slate-400">Shutterstock.com</div>
            <div className="absolute top-1 right-1 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">ASLI</div>
          </div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="bg-slate-950 rounded-xl border border-rose-500/30 p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold">Confidence Match</span>
          <span className="text-rose-400 font-black text-sm">98.7%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full transition-all duration-1000" style={{ width: '98.7%' }} />
        </div>
        <div className="text-[10px] text-slate-500 text-center">Foto identik ditemukan di database stok foto komersial</div>
      </div>

      {/* Finding */}
      <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-200 font-bold text-xs leading-relaxed flex items-start gap-2">
        <Eye className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
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

  // ─── Main Render ────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Screen Flash Effect */}
      {screenFlash && (
        <div className="fixed inset-0 z-[60] bg-white/30 pointer-events-none animate-pulse" />
      )}

      {/* Final Fraud Banner Overlay */}
      {showFinalBanner && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none">
          <div className="animate-in zoom-in-50 fade-in duration-500 bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 border-4 border-white/30 rounded-2xl px-8 py-6 shadow-2xl shadow-rose-500/50 text-center transform -rotate-2">
            <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Hasil Investigasi</div>
            <div className="text-white font-black text-2xl sm:text-3xl tracking-wide">
              FRAUD SCORE: 97/100
            </div>
            <div className="text-rose-200 font-bold text-sm mt-1 tracking-wider">
              ✅ CONFIRMED SCAM — SITUS PENIPUAN TERVERIFIKASI
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-6xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[96vh]">

        {/* ── Browser Chrome ───────────────────────────────────── */}
        <div className="bg-[#1e1e2e] px-4 py-2 flex items-center gap-3 border-b border-slate-800 shrink-0">
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e33e38] shadow-sm shadow-red-500/30" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d49c11] shadow-sm shadow-yellow-500/30" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1faa32] shadow-sm shadow-green-500/30" />
          </div>

          {/* Tab */}
          <div className="bg-slate-800/80 rounded-t-lg px-4 py-1.5 text-[11px] text-slate-300 font-medium flex items-center gap-2 border border-b-0 border-slate-700 max-w-[200px] truncate">
            <Globe className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">BursaKriptoNusantara VIP</span>
          </div>

          {/* Fraud Score Meter */}
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-950 rounded-lg px-3 py-1.5 border border-slate-700">
              <Shield className={`w-4 h-4 ${fraudScore > 60 ? 'text-rose-400' : fraudScore > 30 ? 'text-amber-400' : 'text-slate-500'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">Fraud Score</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getFraudScoreColor()} shadow-md ${getFraudScoreGlow()}`}
                      style={{ width: `${fraudScore}%` }}
                    />
                  </div>
                  <span className={`text-xs font-black tabular-nums ${fraudScore > 60 ? 'text-rose-400' : fraudScore > 30 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {fraudScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── URL Bar ──────────────────────────────────────────── */}
        <div className="bg-[#16161e] px-4 py-2 flex items-center gap-2 border-b border-slate-800/50 shrink-0">
          <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">NOT SECURE</span>
            <span className="text-slate-600 select-none">|</span>
            <span className="text-amber-300/80 truncate">https://bursakriptonusantara-vip.xyz/task-vip</span>
          </div>
          <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-800 flex items-center gap-1 shrink-0">
            <FileWarning className="w-3 h-3" />
            PHISHING
          </span>
        </div>

        {/* ── Content: Split View ──────────────────────────────── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">

          {/* ══ LEFT: Fake Scam Website Mockup ══════════════════ */}
          <div className="lg:col-span-5 overflow-y-auto bg-gradient-to-b from-[#0a0a12] to-[#0d0f1a] border-r border-slate-800">
            <div className="p-4 space-y-3">

              {/* Site Header */}
              <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 rounded-xl p-3 text-center shadow-lg shadow-amber-500/20">
                <div className="text-xs font-black text-black/60 uppercase tracking-wider">🏆 Platform #1 Indonesia</div>
                <div className="text-lg font-black text-slate-950 leading-tight">BursaKriptoNusantara</div>
                <div className="inline-block bg-black text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                  ⭐ VIP MEMBER AREA
                </div>
              </div>

              {/* Profit Chart */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> LIVE PROFIT
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">+342.7%</span>
                </div>
                {/* Fake chart bars */}
                <div className="flex items-end gap-1 h-16">
                  {[35, 45, 30, 55, 65, 50, 72, 80, 68, 85, 90, 95, 88, 92, 98].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm opacity-80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="text-[9px] text-slate-500 text-center">Data profit member (DIPALSUKAN)</div>
              </div>

              {/* Countdown Timer */}
              <div className="bg-gradient-to-r from-rose-900/50 to-red-900/50 border border-rose-700/40 rounded-xl p-3 text-center space-y-1">
                <div className="text-[10px] font-bold text-rose-300 uppercase flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Slot VIP Tersisa
                </div>
                <div className="text-2xl font-black text-white font-mono tracking-wider">
                  {formatCountdown(countdownSeconds)}
                </div>
                <div className="text-[10px] text-rose-400">⚡ Hanya 3 slot lagi — DAFTAR SEKARANG!</div>
              </div>

              {/* Deposit Form */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 space-y-2">
                <div className="text-xs font-black text-amber-400 uppercase">💰 Deposit & Mulai Profit</div>
                <div className="space-y-1.5">
                  <div className="bg-slate-950 rounded-lg px-3 py-2 text-xs text-slate-500 border border-slate-700 flex items-center justify-between">
                    <span>Jumlah Deposit</span>
                    <span className="text-amber-300 font-bold">Rp 1.000.000</span>
                  </div>
                  <div className="bg-slate-950 rounded-lg px-3 py-2 text-xs border border-slate-700">
                    <span className="text-slate-500 text-[10px] block">Transfer ke:</span>
                    <span className="text-amber-300 font-mono font-bold text-[11px]">Bank Digital: 7720-1123-991</span>
                    <span className="text-slate-500 text-[10px] block">a.n Ahmad Penampung</span>
                  </div>
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs py-2 rounded-lg text-center cursor-not-allowed opacity-75">
                    DEPOSIT SEKARANG →
                  </div>
                </div>
              </div>

              {/* Fake Testimonials */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyan-400" /> Testimoni Member VIP
                </div>
                {[
                  { name: 'A***i', text: 'Sudah profit Rp 15jt dalam 1 minggu!! 🔥', stars: 5 },
                  { name: 'D***a', text: 'Awalnya ragu, ternyata beneran cair!', stars: 5 },
                  { name: 'M***n', text: 'Platform terpercaya, CS ramah 24/7 👍', stars: 5 },
                ].map((t, i) => (
                  <div key={i} className="bg-slate-950/60 rounded-lg p-2 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-300">{t.name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.stars }).map((_, j) => (
                          <Star key={j} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400">{t.text}</div>
                  </div>
                ))}
                <div className="text-[9px] text-red-400/60 text-center italic">(Semua testimoni di atas adalah PALSU)</div>
              </div>

              {/* Fake Founder Profile */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-xl shrink-0 shadow-md shadow-amber-500/20">
                  👨‍💼
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    Dr. Hendra Wijaya
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="text-[10px] text-slate-400">Founder & CEO — "Analis Kripto Terverifikasi OJK"</div>
                  <div className="text-[9px] text-rose-500 font-bold">(Identitas & Klaim = PALSU)</div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT: Forensic Analysis Dashboard ═════════════ */}
          <div className="lg:col-span-7 overflow-y-auto bg-slate-950/50">
            <div className="p-4 space-y-4">

              {/* Dashboard Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
                    <ScanLine className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-wider">CyberForensik Dashboard</div>
                    <div className="text-[10px] text-slate-500">Analisis situs mencurigakan</div>
                  </div>
                </div>
                <div className="bg-slate-900 text-cyan-400 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border border-cyan-500/30">
                  {analyzedCount}/3 Selesai
                </div>
              </div>

              {/* ── Tool Cards Grid ────────────────────────────── */}
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
                      className={`relative p-3 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-2 transition-all duration-300 group overflow-hidden ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                          : isDone
                            ? 'border-emerald-600/50 bg-emerald-950/20 text-emerald-300'
                            : 'border-slate-700 bg-slate-900/80 text-slate-400 hover:border-slate-500 hover:bg-slate-800/80'
                      }`}
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${toolColors[tool.toolId]} opacity-0 group-hover:opacity-5 transition-opacity rounded-xl`} />

                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${toolColors[tool.toolId]} ${isDone ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'} transition-opacity shadow-md`}>
                        <div className="text-white">{toolIcons[tool.toolId]}</div>
                      </div>

                      {/* Name */}
                      <span className="text-[11px] font-bold truncate w-full text-center relative z-10">
                        {tool.name}
                      </span>

                      {/* Status Badge */}
                      {isDone ? (
                        <span className="text-[9px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> SELESAI
                        </span>
                      ) : isScanning ? (
                        <span className="text-[9px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full font-black animate-pulse">
                          SCANNING...
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                          Klik untuk scan
                        </span>
                      )}

                      {/* Scanning Progress Bar (overlaid at bottom) */}
                      {isScanning && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden rounded-b-xl">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100 ease-linear"
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Scanning Animation Panel ───────────────────── */}
              {scanningToolId && (
                <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-lg shadow-cyan-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    <div>
                      <div className="text-xs font-bold text-cyan-300 uppercase">
                        Memindai {toolList.find((t) => t.toolId === scanningToolId)?.name}...
                      </div>
                      <div className="text-[10px] text-slate-500">Menganalisis data forensik digital</div>
                    </div>
                  </div>

                  {/* Main Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-100 ease-linear relative"
                        style={{ width: `${scanProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-mono">Scanning database...</span>
                      <span className="text-cyan-400 font-bold font-mono">{Math.round(scanProgress)}%</span>
                    </div>
                  </div>

                  {/* Scrolling Scan Lines */}
                  <div className="bg-slate-950 rounded-lg p-2 font-mono text-[9px] text-slate-600 space-y-0.5 h-12 overflow-hidden">
                    <div className="animate-pulse space-y-0.5">
                      <div>→ Connecting to threat intelligence DB...</div>
                      <div>→ Cross-referencing domain registry...</div>
                      <div>→ Analyzing SSL certificates...</div>
                      <div>→ Checking blacklist databases...</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Result Panel ───────────────────────────────── */}
              {revealedToolId && !scanningToolId && (
                <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 space-y-3 shadow-xl">
                  {/* Result Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br ${toolColors[revealedToolId]}`}>
                        <div className="text-white scale-75">{toolIcons[revealedToolId]}</div>
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        {toolList.find((t) => t.toolId === revealedToolId)?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-rose-600/20 border border-rose-500/40 rounded-lg px-2.5 py-1">
                      <Zap className="w-3 h-3 text-rose-400" />
                      <span className="text-[10px] text-rose-300 font-black uppercase">Temuan Kritis</span>
                    </div>
                  </div>

                  {/* Detailed Results */}
                  {renderToolResult(revealedToolId)}
                </div>
              )}

              {/* ── Empty State (no tool selected yet) ─────────── */}
              {!selectedToolId && !scanningToolId && (
                <div className="bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center space-y-2">
                  <Search className="w-8 h-8 text-slate-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-500">Pilih alat forensik di atas untuk memulai investigasi</div>
                  <div className="text-[10px] text-slate-600">Jalankan ketiga alat untuk mengungkap penipuan</div>
                </div>
              )}

              {/* ── Complete Investigation Button ──────────────── */}
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
                className={`w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all duration-300 ${
                  isAllAnalyzed
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 hover:from-cyan-300 hover:via-blue-400 hover:to-cyan-300 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/30 active:scale-95 hover:shadow-xl hover:shadow-cyan-500/40'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
                {isAllAnalyzed
                  ? 'BONGKAR JEBAKAN & SADARKAN RIAN!'
                  : `Jalankan Semua Forensik (${analyzedCount}/3 Selesai)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
