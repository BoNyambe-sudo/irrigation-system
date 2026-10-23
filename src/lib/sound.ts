// Lightweight in-browser notification chime. No external asset required.
let audioCtx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    const ctx = audioCtx;
    if (!ctx) return null;
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function playSound() {
  const ctx = ensureCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  [880, 660].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.26);
  });
}