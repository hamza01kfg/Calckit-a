/** Short mechanical tick via Web Audio API (no audio file needed). */
let ctx: AudioContext | null = null;

export function playTick() {
  try {
    if (typeof window === "undefined") return;
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();

    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1800, t0);
    osc.frequency.exponentialRampToValueAtTime(600, t0 + 0.03);
    gain.gain.setValueAtTime(0.08, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.05);
  } catch {
    /* ignore autoplay / unsupported */
  }
}
