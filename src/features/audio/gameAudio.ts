import type { CandidateItem, RarityTier } from "@/data/catalog";
type SpecialtyRegion = NonNullable<CandidateItem["regionalSpecialty"]>["region"];

/**
 * RS-052/FEAT-048/CODE-036: tiny game-audio abstraction.
 *
 * Independent implementation note (docs/reference-notes/truanayangi-mechanics.md, LEARN item #8):
 * the reference project preloads/decodes short audio *files* and unlocks an AudioContext on the
 * first user gesture. #HNAG keeps the same resilience shape (lazy context, gesture-gated unlock,
 * every operation wrapped so a failure is silent) but synthesizes its tick/reveal cues at runtime
 * with the Web Audio oscillator API instead of shipping binary sound assets — this sidesteps any
 * question of audio-asset provenance for the M1 build and keeps the initial bundle at ~0 extra KB.
 *
 * Tone design (user decision 2026-09-11, docs/decisions.md): tuned to *feel* closer to a
 * case-opening scroll/reveal — a crisp mechanical tick and a reveal cue that scales with rarity —
 * while remaining fully original synthesis. No sample/waveform data from truanayangi or any CS2
 * resource is used; only the oscillator graph below produces sound.
 */

export interface GameAudio {
  preload(): void;
  /** Unlock only from pointer-down, click, or keyboard activation; never from hover (DS-024). */
  recover(): void;
  playCrateHover(): void;
  playCrateLid(): void;
  playCrateOpen(): void;
  playEquipCrate(): void;
  playTick(): void;
  playReveal(rarity?: RarityTier, specialtyRegion?: SpecialtyRegion): void;
  setEnabled(enabled: boolean): void;
  isEnabled(): boolean;
}

const TICK_FREQUENCY_HZ = 1500;
const TICK_FREQUENCY_DROP_HZ = 900;
const TICK_DURATION_S = 0.028;
const REVEAL_NOTE_DURATION_S = 0.13;
const GAIN_WHEN_ON = 0.2;
const SWEEP_GAIN = 0.1;
const CRATE_HOVER_INTERVAL_S = 0.18;
// Original UI chimes, not recordings or claims of traditional regional music.
const SPECIALTY_CHIME: Record<SpecialtyRegion, readonly number[]> = {
  NORTH: [587, 784, 880, 1175], CENTRAL: [622, 830, 933, 1244], SOUTH: [659, 880, 988, 1319],
};

/** Original ascending chords per tier — richer/longer for rarer results, never a value/quality claim (RANK-029). */
const REVEAL_CHORD_HZ: Record<RarityTier, number[]> = {
  THUONG: [660, 880],
  NGON: [660, 880, 1100],
  DINH: [660, 880, 1100, 1320],
  HUYEN_THOAI: [660, 880, 1100, 1320, 1760],
};

const REVEAL_SWEEP_S: Record<RarityTier, number> = {
  THUONG: 0,
  NGON: 0,
  DINH: 0.16,
  HUYEN_THOAI: 0.24,
};

type AudioContextCtor = typeof AudioContext;

function resolveAudioContextCtor(): AudioContextCtor | undefined {
  if (typeof window === "undefined") return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
}

export function createGameAudio(): GameAudio {
  let context: AudioContext | undefined;
  let enabled = false;
  let lastCrateHoverAt = Number.NEGATIVE_INFINITY;

  function ensureContext(): AudioContext | undefined {
    if (context) return context;
    const Ctor = resolveAudioContextCtor();
    if (!Ctor) return undefined;
    try {
      context = new Ctor();
      return context;
    } catch {
      // AUDIO_UNAVAILABLE — the game continues visual-only.
      return undefined;
    }
  }

  function playTone(
    frequencyHz: number,
    startAt: number,
    durationS: number,
    ctx: AudioContext,
    options?: { type?: OscillatorType; endFrequencyHz?: number; gain?: number },
  ): void {
    try {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = options?.type ?? "sine";
      oscillator.frequency.setValueAtTime(frequencyHz, startAt);
      if (options?.endFrequencyHz) {
        oscillator.frequency.exponentialRampToValueAtTime(options.endFrequencyHz, startAt + durationS);
      }
      const peakGain = options?.gain ?? GAIN_WHEN_ON;
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(peakGain, startAt + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationS);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + durationS + 0.02);
    } catch {
      // Never let a synth failure break the reveal.
    }
  }

  /** A short rising sweep before the reveal chord — original synthesis, reserved for DINH+/HUYEN_THOAI. */
  function playSweep(ctx: AudioContext, startAt: number, durationS: number): void {
    playTone(220, startAt, durationS, ctx, { type: "sawtooth", endFrequencyHz: 1400, gain: SWEEP_GAIN });
  }

  return {
    preload() {
      ensureContext();
    },
    recover() {
      const ctx = ensureContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => undefined);
      }
    },
    playCrateHover() {
      // Hover is not an activation gesture: use only an already unlocked context.
      if (!enabled || !context || context.state !== "running") return;
      const now = context.currentTime;
      if (now - lastCrateHoverAt < CRATE_HOVER_INTERVAL_S) return;
      lastCrateHoverAt = now;
      playTone(880, now, 0.08, context, { endFrequencyHz: 1100, gain: 0.035 });
    },
    playCrateLid() {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx || ctx.state !== "running") return;
      const now = ctx.currentTime;
      // Original hinge lift and soft airy overtone, separate from the latch snap.
      playTone(150, now, 0.24, ctx, { type: "triangle", endFrequencyHz: 420, gain: 0.12 });
      playTone(600, now + 0.025, 0.2, ctx, { type: "sine", endFrequencyHz: 1500, gain: 0.045 });
    },
    playCrateOpen() {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx || ctx.state !== "running") return;
      const now = ctx.currentTime;
      // 1. Sharp metallic latch click (key/latch snap)
      playTone(2400, now, 0.04, ctx, { type: "square", endFrequencyHz: 750, gain: 0.3 });
      // 2. Heavy mechanical container unlatch thud (low resonant body)
      playTone(130, now + 0.02, 0.22, ctx, { type: "triangle", endFrequencyHz: 45, gain: 0.38 });
      // 3. Metallic lock chime harmonic
      playTone(920, now + 0.05, 0.15, ctx, { type: "sine", endFrequencyHz: 460, gain: 0.12 });
    },
    playEquipCrate() {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx || ctx.state !== "running") return;
      const now = ctx.currentTime;
      // Sharp mechanical latch engage + solid metallic rack clank
      playTone(1800, now, 0.035, ctx, { type: "square", endFrequencyHz: 600, gain: 0.22 });
      playTone(220, now + 0.015, 0.08, ctx, { type: "triangle", endFrequencyHz: 110, gain: 0.25 });
    },
    playTick() {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx || ctx.state !== "running") return;
      // A quick downward pitch drop on a square wave reads as a crisper mechanical "tick"
      // than a plain sine blip, closer to a scroll-wheel click.
      playTone(TICK_FREQUENCY_HZ, ctx.currentTime, TICK_DURATION_S, ctx, {
        type: "square",
        endFrequencyHz: TICK_FREQUENCY_DROP_HZ,
        gain: GAIN_WHEN_ON * 1.35,
      });
    },
    playReveal(rarity: RarityTier = "THUONG", specialtyRegion?: SpecialtyRegion) {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx || ctx.state !== "running") return;
      const now = ctx.currentTime;
      const sweepS = REVEAL_SWEEP_S[rarity];
      if (sweepS > 0) playSweep(ctx, now, sweepS);

      const chordStartAt = now + sweepS * 0.7;
      REVEAL_CHORD_HZ[rarity].forEach((frequencyHz, index) => {
        playTone(frequencyHz, chordStartAt + index * 0.09, REVEAL_NOTE_DURATION_S, ctx);
      });
      if (specialtyRegion) SPECIALTY_CHIME[specialtyRegion].forEach((frequencyHz, index) => {
        playTone(frequencyHz, chordStartAt + 0.48 + index * 0.08, 0.18, ctx, { type: "triangle", gain: 0.08 });
      });
    },
    setEnabled(value: boolean) {
      enabled = value;
    },
    isEnabled() {
      return enabled;
    },
  };
}
