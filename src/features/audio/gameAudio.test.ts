import { afterEach, describe, expect, it, vi } from "vitest";
import { createGameAudio } from "./gameAudio";

describe("GameAudio (QA-024: audio-unavailable resilience)", () => {
  const originalAudioContext = window.AudioContext;

  afterEach(() => {
    window.AudioContext = originalAudioContext;
  });

  it("never throws when AudioContext does not exist at all", () => {
    // @ts-expect-error -- simulating a browser with no Web Audio support.
    delete window.AudioContext;
    const audio = createGameAudio();

    expect(() => audio.preload()).not.toThrow();
    expect(() => audio.recover()).not.toThrow();
    expect(() => audio.setEnabled(true)).not.toThrow();
    expect(() => audio.playCrateOpen()).not.toThrow();
    expect(() => audio.playEquipCrate()).not.toThrow();
    expect(() => audio.playTick()).not.toThrow();
    expect(() => audio.playReveal()).not.toThrow();
  });

  it("never throws when constructing AudioContext throws", () => {
    window.AudioContext = vi.fn(() => {
      throw new Error("AUDIO_UNAVAILABLE");
    }) as unknown as typeof AudioContext;
    const audio = createGameAudio();
    audio.setEnabled(true);

    expect(() => audio.preload()).not.toThrow();
    expect(() => audio.playCrateOpen()).not.toThrow();
    expect(() => audio.playEquipCrate()).not.toThrow();
    expect(() => audio.playTick()).not.toThrow();
    expect(() => audio.playReveal()).not.toThrow();
  });

  it("playTick/playReveal are no-ops while muted (setEnabled(false))", () => {
    const createOscillator = vi.fn();
    window.AudioContext = vi.fn(() => ({
      state: "running",
      currentTime: 0,
      createOscillator,
      createGain: vi.fn(),
      resume: vi.fn().mockResolvedValue(undefined),
      destination: {},
    })) as unknown as typeof AudioContext;

    const audio = createGameAudio();
    audio.setEnabled(false);
    audio.playTick();
    audio.playReveal();

    expect(createOscillator).not.toHaveBeenCalled();
  });
});
