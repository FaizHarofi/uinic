import { GameChapter } from '../types/game';

export type CaseInfo = { id: GameChapter; slug: string; title: string; summary: string; objective: string; difficulty: 'Pemula' | 'Menengah' | 'Tantangan'; duration: string; skills: string[] };
export const CASES: CaseInfo[] = [
  { id: 1, slug: 'paket-misterius', title: 'Paket Misterius Buat Ibu', summary: 'Pesan kurir mendesak meminta Ibu memasang file APK untuk melihat resi.', objective: 'Temukan tanda bahaya di pesan dan pilih respons yang aman.', difficulty: 'Pemula', duration: '3–4 menit', skills: ['Membaca lampiran', 'Mengenali urgensi', 'Memakai kanal resmi'] },
  { id: 2, slug: 'cs-bank-gadungan', title: 'Panggilan CS Bank Gadungan', summary: 'Penelepon mengaku petugas bank dan berusaha memperoleh kode OTP.', objective: 'Ajukan pertanyaan kritis sebelum melindungi informasi rekening.', difficulty: 'Menengah', duration: '4–5 menit', skills: ['Melindungi OTP', 'Memeriksa nomor', 'Menolak tekanan'] },
  { id: 3, slug: 'freelance-kripto', title: 'Jebakan Freelance & Kripto', summary: 'Tawaran kerja cepat mengarahkan Rian ke platform investasi mencurigakan.', objective: 'Telusuri jejak situs dan nilai janji keuntungan yang tidak masuk akal.', difficulty: 'Tantangan', duration: '5–6 menit', skills: ['Memeriksa domain', 'Menilai tawaran', 'Verifikasi informasi'] },
  { id: 4, slug: 'donasi-bencana-palsu', title: 'Donasi Bencana yang Salah Alamat', summary: 'Ajakan donasi yang menyamar sebagai posko bantuan memakai foto musibah dan rekening pribadi.', objective: 'Verifikasi penggalang dana sebelum ikut menyebarkan atau mengirim bantuan.', difficulty: 'Menengah', duration: '4–5 menit', skills: ['Memeriksa identitas penggalang', 'Memverifikasi rekening', 'Berbagi informasi secara bertanggung jawab'] },
];
export const getCaseBySlug = (slug: string) => CASES.find((item) => item.slug === slug);
export const getCaseById = (id: number) => CASES.find((item) => item.id === id);
