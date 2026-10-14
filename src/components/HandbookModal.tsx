'use client';

import React from 'react';
import { BookOpen, X, ShieldCheck, AlertTriangle, Phone, ExternalLink } from 'lucide-react';
import { playClick } from '../utils/sound';

interface HandbookModalProps {
  onClose: () => void;
}

export const HandbookModal: React.FC<HandbookModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl border-2 border-black -rotate-2">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                BUKU PANDUAN LITERASI SIBER
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Kamus & Pedoman Menghadapi Penipuan Online (Scam) di Indonesia
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
          
          {/* Card 1: Modus APK */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-base">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              1. Modus APK Jahat (Sniffer)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Penipu mengirimkan file aplikasi berformat <strong>.apk</strong> yang disamarkan namanya menjadi:
              <br />
              • <code className="text-amber-300">Undangan_Pernikahan.apk</code>
              <br />
              • <code className="text-amber-300">Surat_Tilang_ETLE.apk</code>
              <br />
              • <code className="text-amber-300">Foto_Resi_Paket.pdf.apk</code>
              <br />
              Jika dipasang, aplikasi ini meminta izin <strong>Baca SMS (READ_SMS)</strong> untuk mencuri OTP bank Anda tanpa disadari.
            </p>
          </div>

          {/* Card 2: Golden Rule */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              2. Aturan Emas Keamanan OTP & PIN
            </div>
            <p className="text-slate-300 leading-relaxed">
              • <strong>Bank TIDAK PERNAH</strong> meminta kode OTP atau PIN Anda melalui telepon, chat, maupun email.
              <br />
              • Jangan pernah meneruskan SMS berisi kode angka verifikasi kepada siapapun, termasuk orang yang mengaku petugas resmi.
              <br />
              • Ingat rumus: <strong>"Cek Dulu, Baru Klik!"</strong> (Beri jeda 10 detik saat menerima pesan mencurigakan).
            </p>
          </div>

          {/* Card 3: Kanal Resmi */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-400 text-base">
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              3. Kanal Aduan Resmi di Indonesia
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4">
              <li>
                <strong>aduankonten.id</strong>: Layanan Komdigi/Kominfo untuk memblokir website/konten penipuan online.
              </li>
              <li>
                <strong>cekrekening.id</strong>: Portal resmi pemerintah untuk mengecek apakah nomor rekening bank/e-wallet pernah dilaporkan sebagai penipu.
              </li>
              <li>
                <strong>patrolisiber.id</strong>: Kanal pelaporan tindak pidana siber Bareskrim Polri.
              </li>
            </ul>
          </div>

          {/* Card 4: Kontak Darurat Bank */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-yellow-400 text-base">
              <Phone className="w-5 h-5 text-yellow-400" />
              4. Nomor Kontak Resmi Perbankan
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Jika terlanjur mengeklik file mencurigakan, hubungi CS resmi bank berikut untuk blokir darurat:
              <br />
              • Halo BCA: <strong>1500888</strong>
              <br />
              • Contact BRI: <strong>1500017</strong>
              <br />
              • Mandiri Call: <strong>14000</strong>
              <br />
              • BNI Call: <strong>1500046</strong>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase text-xs transition-all"
          >
            Tutup Buku Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
