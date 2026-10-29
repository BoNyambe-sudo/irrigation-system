let audioCtx: AudioContext | null = null;

function initAudio(): void {
  const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!Ctx) return;
  audioCtx = new Ctx();
  if (audioCtx!.state === "suspended") {
    audioCtx!.resume().catch(() => {});
  }
}

if (typeof window !== "undefined") {
  document.addEventListener("click", initAudio, { once: true, passive: true });
}

function ensureCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    const ctx = audioCtx as AudioContext;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
}

export async function playSound() {
  const ctx = ensureCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    await ctx.resume().catch(() => {});
  }
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
