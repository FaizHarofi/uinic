'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  BookOpen,
  Settings,
  Layers,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Shield,
  FileCode,
  PhoneCall,
  Globe,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GameChapter } from '../types/game';
import { playClick, playDramaticHit } from '../utils/sound';

interface TitleScreenProps {
  onStartChapter: (chapter: GameChapter) => void;
  onOpenHandbook: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartChapter,
  onOpenHandbook,
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showChapterModal, setShowChapterModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [soundState, setSoundState] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const chapters = [
    {
      id: 1 as GameChapter,
      badge: 'KASUS 01',
      title: 'Paket Misterius Buat Ibu',
      threat: 'Malware APK Sniffer',
      icon: <FileCode className="w-5 h-5 text-amber-400" />,
      mech: '🔍 Spot the Red Flags (WhatsApp Chat)',
      desc: 'Penipu menyamar sebagai kurir paket dan mengirim file APK untuk menyadap SMS OTP perbankan.',
      color: 'border-amber-400/80 bg-amber-950/30 hover:border-amber-400',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      time: '3-4 Menit',
    },
    {
      id: 2 as GameChapter,
      badge: 'KASUS 02',
      title: 'Panggilan CS Bank Gadungan',
      threat: 'Vishing & Manipulasi OTP',
      icon: <PhoneCall className="w-5 h-5 text-rose-400" />,
      mech: '📞 Call Simulator & The OTP Shield',
      desc: 'Panggilan darurat mengaku CS Bank resmi yang memanfaatkan kepanikan nasabah demi mencuri OTP.',
      color: 'border-rose-500/80 bg-rose-950/30 hover:border-rose-400',
      tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      time: '4-5 Menit',
    },
    {
      id: 3 as GameChapter,
      badge: 'KASUS 03',
      title: 'Jebakan Freelance & Kripto',
      threat: 'Pig Butchering & Bursa Bodong',
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      mech: '🌐 Cyber Sandbox & Domain Forensics',
      desc: 'Tugas like video YouTube dengan iming-iming profit 300% yang berujung ke bursa kripto fiktif.',
      color: 'border-cyan-400/80 bg-cyan-950/30 hover:border-cyan-400',
      tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      time: '5-6 Menit',
    },
  ];

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-6 md:p-10 select-none overflow-hidden bg-slate-950 text-white font-sans">
      
      {/* 1. ATMOSPHERIC GAME BACKGROUND (Seperti Referensi) */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/assets/images/scene-ch1.png"
          alt="Game Scene Backdrop"
          fill
          priority
          className="object-cover object-center filter brightness-[0.55] contrast-[1.15] saturate-[0.85]"
        />
        {/* Dark Teal/Vignette Overlay ala Otem's Defiance */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-cyan-950/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/90" />
      </div>

      {/* 2. TOP CENTER: LOGO TITLE (Hand-drawn / Stylized Tribal Comic Style) */}
      <div className="pt-6 md:pt-10 flex flex-col items-center text-center z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        
        {/* Custom Hand-Drawn Title "AWAS SCAM!" */}
        <div className="relative flex flex-col items-center">
          
          {/* Main Stylized Word "AWAS" */}
          <div className="flex items-center gap-2">
            <span className="text-6xl md:text-8xl lg:text-9xl font-black tracking-wider text-white drop-shadow-[0_6px_0_rgba(0,0,0,0.9)] uppercase font-mono">
              AWAS
            </span>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white flex items-center justify-center -translate-y-4">
              <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white" />
            </div>
          </div>

          {/* Hand-Drawn Line Divider with Dots (Persis Gambar Referensi) */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex gap-1.5 text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="w-48 md:w-80 h-[3px] bg-white rounded-full shadow-sm" />
            <div className="flex gap-1.5 text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          {/* Subtitle Word "SCAM!" (Carved / Blocky font) */}
          <div className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.3em] text-white/95 uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]">
            SCAM!
          </div>

          {/* Arching Hand-drawn Curve Over Buttons */}
          <svg className="w-64 md:w-96 h-6 text-white/80 mt-2" viewBox="0 0 400 30" fill="none">
            <path d="M10 25 Q 200 2 390 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 3. CENTER: VERTICAL PILL BUTTONS (Persis Referensi Gambar) */}
      <div className="flex flex-col items-center gap-3.5 my-auto z-10 w-full max-w-xs md:max-w-sm">
        
        {/* BUTTON 1: PLAY (MAIN) */}
        <div className="relative w-full flex items-center justify-center">
          {hoveredButton === 'play' && (
            <span className="absolute -left-7 md:-left-8 text-2xl md:text-3xl font-black text-white animate-pulse">
              &gt;
            </span>
          )}
          <button
            onMouseEnter={() => setHoveredButton('play')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              playDramaticHit();
              onStartChapter(1);
            }}
            className="w-64 md:w-72 py-3.5 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xl md:text-2xl uppercase tracking-wider border-4 border-black shadow-[0_5px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 group"
          >
            PLAY
          </button>
          {hoveredButton === 'play' && (
            <span className="absolute -right-7 md:-right-8 text-2xl md:text-3xl font-black text-white animate-pulse">
              &lt;
            </span>
          )}
        </div>

        {/* BUTTON 2: PILIH KASUS (COMIC / CHAPTERS) */}
        <div className="relative w-full flex items-center justify-center">
          {hoveredButton === 'chapters' && (
            <span className="absolute -left-7 md:-left-8 text-2xl md:text-3xl font-black text-white animate-pulse">
              &gt;
            </span>
          )}
          <button
            onMouseEnter={() => setHoveredButton('chapters')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              playClick();
              setShowChapterModal(true);
            }}
            className="w-64 md:w-72 py-3.5 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xl md:text-2xl uppercase tracking-wider border-4 border-black shadow-[0_5px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 group"
          >
            PILIH KASUS
          </button>
          {hoveredButton === 'chapters' && (
            <span className="absolute -right-7 md:-right-8 text-2xl md:text-3xl font-black text-white animate-pulse">
              &lt;
            </span>
          )}
        </div>

        {/* BUTTON 3: PANDUAN SIBER (COMIC / HANDBOOK) */}
        <div className="relative w-full flex items-center justify-center">
          {hoveredButton === 'handbook' && (
            <span className="absolute -left-7 md:-left-8 text-2xl md:text-3xl font-black text-white animate-pulse">
              &gt;
            </span>
          )}
          <button
            onMouseEnter={() => setHoveredButton('handbook')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              playClick();
              onOpenHandbook();
            }}
            className="w-64 md:w-72 py-3.5 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xl md:text-2xl uppercase tracking-wider border-4 border-black shadow-[0_5px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 group"
          >
            PANDUAN
          </button>
          {hoveredButton === 'handbook' && (
            <span className="absolute -right-7 md:-right-8 text-2xl md:text-3xl font-black text-white animate-pulse">
              &lt;
            </span>
          )}
        </div>

        {/* BUTTON 4: SETTINGS (PENGATURAN) */}
        <div className="relative w-full flex items-center justify-center">
          {hoveredButton === 'settings' && (
            <span className="absolute -left-7 md:-left-8 text-2xl md:text-3xl font-black text-white animate-pulse">
              &gt;
            </span>
          )}
          <button
            onMouseEnter={() => setHoveredButton('settings')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              playClick();
              setShowSettingsModal(true);
            }}
            className="w-64 md:w-72 py-3.5 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xl md:text-2xl uppercase tracking-wider border-4 border-black shadow-[0_5px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 group"
          >
            SETTINGS
          </button>
          {hoveredButton === 'settings' && (
            <span className="absolute -right-7 md:-right-8 text-2xl md:text-3xl font-black text-white animate-pulse">
              &lt;
            </span>
          )}
        </div>

      </div>

      {/* 4. BOTTOM BAR: STUDIO LOGO (KIRI), COPYRIGHT (TENGAH), VERSION (KANAN) */}
      <div className="w-full flex items-center justify-between z-10 text-xs text-white/70 font-semibold px-2 md:px-6">
        
        {/* KIRI: Studio Logo Badge (ala HYPERBERRY GAMES) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-black tracking-widest text-white uppercase">CYBER DEFENSE</span>
            <span className="text-[9px] text-white/60 tracking-wider">STUDIOS</span>
          </div>
        </div>

        {/* TENGAH: Copyright */}
        <div className="text-center hidden sm:block text-[11px] text-white/60">
          Copyright 2026 - AWAS SCAM! Digital Literacy Games
        </div>

        {/* KANAN: Version */}
        <div className="font-mono text-[11px] text-white/80">
          v2.4.0.0
        </div>
      </div>

      {/* MODAL: PILIH KASUS (CHAPTER SELECTOR) */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border-4 border-white rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(255,255,255,0.2)] flex flex-col space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                  PILIH BERKAS KASUS
                </h2>
                <p className="text-xs text-slate-400">
                  Pilih bab investigasi siber yang ingin kamu selesaikan:
                </p>
              </div>

              <button
                onClick={() => {
                  playClick();
                  setShowChapterModal(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List 3 Chapter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    playDramaticHit();
                    setShowChapterModal(false);
                    onStartChapter(ch.id);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 flex flex-col justify-between group ${ch.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/20 text-white">
                        {ch.badge}
                      </span>
                      <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                        {ch.icon}
                      </div>
                    </div>

                    <h3 className="font-black text-white text-base md:text-lg group-hover:text-amber-300 transition-colors leading-snug mb-1">
                      {ch.title}
                    </h3>
                    
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-2 ${ch.tagColor}`}>
                      {ch.threat}
                    </span>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {ch.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-300">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ch.time}
                    </span>
                    <span className="flex items-center gap-1">
                      Mulai <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* MODAL: SETTINGS (PENGATURAN) */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border-4 border-white rounded-3xl p-6 shadow-2xl flex flex-col space-y-4 animate-in zoom-in-95 duration-200 text-center">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                PENGATURAN
              </h3>
              <button
                onClick={() => {
                  playClick();
                  setShowSettingsModal(false);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Settings Options */}
            <div className="space-y-3 text-left">
              
              {/* Fullscreen Option */}
              <div
                onClick={() => {
                  playClick();
                  handleToggleFullscreen();
                }}
                className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-600 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                    <Maximize2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Mode Layar Penuh</div>
                    <div className="text-xs text-slate-400">Aktifkan F11 / Fullscreen</div>
                  </div>
                </div>
                <span className="text-xs font-black bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/40">
                  {isFullscreen ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </div>

              {/* Sound Option */}
              <div
                onClick={() => {
                  playClick();
                  setSoundState(!soundState);
                }}
                className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-600 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                    {soundState ? (
                      <Volume2 className="w-5 h-5 text-amber-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Suara Efek (SFX)</div>
                    <div className="text-xs text-slate-400">Efek audio ketikan & arcade</div>
                  </div>
                </div>
                <span className="text-xs font-black bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40">
                  {soundState ? 'ON' : 'MUTE'}
                </span>
              </div>

            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              AWAS SCAM! Desktop Edition • Google DeepMind & UIN Cyber Initiative
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
