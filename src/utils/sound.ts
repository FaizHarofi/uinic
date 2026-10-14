// Sound Synthesizer using Web Audio API
// Tidak memerlukan file mp3 eksternal sehingga 100% reliabel di browser

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const getSoundEnabled = () => soundEnabled;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// 1. Tombol Klik Standar
export const playClick = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

// 2. Typewriter Blip (suara saat teks dialog berjalan)
export const playBlip = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320 + Math.random() * 80, ctx.currentTime);

  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.03);
};

// 3. Bukti Ditemukan (Success Chime)
export const playEvidenceFound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
  });
};

// 4. Dramatic Comic "OBJECTION / BAHAYA!" Hit
export const playDramaticHit = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.35);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
};

// 5. Suara Salah / Buzz
export const playBuzz = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(130, ctx.currentTime);
  osc.frequency.setValueAtTime(100, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
};

// 6. Sirine Alarm Bahaya Darurat
export const playAlarm = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const startTime = ctx.currentTime + i * 0.3;
    osc.frequency.setValueAtTime(700, startTime);
    osc.frequency.linearRampToValueAtTime(950, startTime + 0.15);
    osc.frequency.linearRampToValueAtTime(700, startTime + 0.3);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.3);
  }
};

// 7. Fanfare Kasus Selesai (Victory Jingle)
export const playVictory = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const melody = [
    { f: 523.25, d: 0.12 }, // C
    { f: 523.25, d: 0.12 }, // C
    { f: 523.25, d: 0.12 }, // C
    { f: 659.25, d: 0.35 }, // E
    { f: 587.33, d: 0.15 }, // D
    { f: 783.99, d: 0.5 },  // G
  ];

  let current = ctx.currentTime;
  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.f, current);

    gain.gain.setValueAtTime(0.2, current);
    gain.gain.exponentialRampToValueAtTime(0.01, current + note.d);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(current);
    osc.stop(current + note.d);
    current += note.d * 0.9;
  });
};

// 8. Telepon Berdering (Realistic Phone Ring - two-tone pattern x2)
export const playPhoneRing = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  for (let ring = 0; ring < 2; ring++) {
    const ringStart = ctx.currentTime + ring * 0.6;

    // High tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440, ringStart);
    gain1.gain.setValueAtTime(0.15, ringStart);
    gain1.gain.setValueAtTime(0.15, ringStart + 0.2);
    gain1.gain.exponentialRampToValueAtTime(0.01, ringStart + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ringStart);
    osc1.stop(ringStart + 0.25);

    // Low tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(480, ringStart);
    gain2.gain.setValueAtTime(0.12, ringStart);
    gain2.gain.setValueAtTime(0.12, ringStart + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.01, ringStart + 0.25);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ringStart);
    osc2.stop(ringStart + 0.25);
  }
};

// 9. Telepon Ditutup (Dramatic Hangup - descending tone)
export const playPhoneHangup = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(480, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);

  // Click sound at end
  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = 'square';
  click.frequency.setValueAtTime(60, ctx.currentTime + 0.35);
  clickGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.35);
  clickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.42);
  click.connect(clickGain);
  clickGain.connect(ctx.destination);
  click.start(ctx.currentTime + 0.35);
  click.stop(ctx.currentTime + 0.42);
};

// 10. Scanning Beep (Short ascending blips like a progress bar)
export const playScanningBeep = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const blips = [600, 750, 900, 1100, 1350];
  blips.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const startTime = ctx.currentTime + idx * 0.07;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.05);
  });
};

// 11. Stamp / Seal Reveal (Heavy thud like stamping FRAUD on a document)
export const playStampReveal = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Heavy thud
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);

  // Impact noise (white noise burst)
  const bufferSize = ctx.sampleRate * 0.08;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.08);
};

// 12. Tension Rise (Rising pitch creating urgency, ~1 second)
export const playTensionRise = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.9);

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.7);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.0);

  // Sub-oscillator for added depth
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(90, ctx.currentTime);
  sub.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.9);

  subGain.gain.setValueAtTime(0.08, ctx.currentTime);
  subGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.7);
  subGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);

  sub.connect(subGain);
  subGain.connect(ctx.destination);
  sub.start();
  sub.stop(ctx.currentTime + 1.0);
};
