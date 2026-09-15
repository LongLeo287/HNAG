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
    expect(() => audio.playCrateHover()).not.toThrow();
    expect(() => audio.playCrateLid()).not.toThrow();
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
    expect(() => audio.playCrateHover()).not.toThrow();
    expect(() => audio.playCrateLid()).not.toThrow();
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
    audio.playCrateHover();
    audio.playCrateLid();
    audio.playTick();
    audio.playReveal();
    audio.playReveal("HUYEN_THOAI", "CENTRAL");

    expect(createOscillator).not.toHaveBeenCalled();
  });

  function mockSynth(state: AudioContextState = "running") {
    const parameter = () => ({
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    });
    const gain = { gain: parameter(), connect: vi.fn() };
    const oscillator = {
      frequency: parameter(), connect: vi.fn(() => gain), start: vi.fn(), stop: vi.fn(),
    };
    const ctx = {
      state, currentTime: 0, destination: {}, resume: vi.fn().mockResolvedValue(undefined),
      createGain: vi.fn(() => gain), createOscillator: vi.fn(() => oscillator),
    };
    const constructor = vi.fn(function () { return ctx; });
    window.AudioContext = constructor as unknown as typeof AudioContext;
    return { ctx, constructor, oscillator, gain };
  }

  it("hover never creates or resumes an audio context", () => {
    const { ctx, constructor } = mockSynth("suspended");
    const audio = createGameAudio();
    audio.setEnabled(true);
    audio.playCrateHover();
    expect(constructor).not.toHaveBeenCalled();
    audio.preload();
    audio.playCrateHover();
    expect(constructor).toHaveBeenCalledTimes(1);
    expect(ctx.resume).not.toHaveBeenCalled();
    expect(ctx.createOscillator).not.toHaveBeenCalled();
  });

  it("plays a quiet 80ms hover chime and throttles rapid re-entry", () => {
    const { ctx, oscillator, gain } = mockSynth();
    const audio = createGameAudio();
    audio.preload();
    audio.setEnabled(true);
    audio.playCrateHover();
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
    expect(gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.035, 0.005);
    expect(gain.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.0001, 0.08);
    expect(oscillator.start).toHaveBeenCalledWith(0);
    ctx.currentTime = 0.179;
    audio.playCrateHover();
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
    ctx.currentTime = 0.18;
    audio.playCrateHover();
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
    audio.setEnabled(false);
    ctx.currentTime = 1;
    audio.playCrateHover();
    audio.playCrateLid();
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
  });

  it("plays the short rising lid cue only while the context is running", () => {
    const { ctx, oscillator } = mockSynth("suspended");
    const audio = createGameAudio();
    audio.setEnabled(true);
    audio.playCrateLid();
    expect(ctx.createOscillator).not.toHaveBeenCalled();
    expect(ctx.resume).not.toHaveBeenCalled();
    ctx.state = "running";
    audio.playCrateLid();
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
    expect(oscillator.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(420, 0.24);
    expect(oscillator.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(1500, 0.225);
    expect(oscillator.stop).toHaveBeenCalledTimes(2);
  });

  it("adds an original regional chime only for a specialty, with different region notes", () => {
    const frequencies: number[] = [];
    const parameter = () => ({setValueAtTime:vi.fn(),linearRampToValueAtTime:vi.fn(),exponentialRampToValueAtTime:vi.fn()});
    const gainNode = {gain:parameter(),connect:vi.fn()};
    window.AudioContext = vi.fn(function () { return {state:"running",currentTime:0,destination:{},
      createGain:()=>gainNode, createOscillator:()=>({frequency:{...parameter(),setValueAtTime:(hz:number)=>frequencies.push(hz)},connect:()=>gainNode,start:vi.fn(),stop:vi.fn()}),
    }; }) as unknown as typeof AudioContext;
    const audio = createGameAudio();
    audio.setEnabled(true);
    audio.playReveal("THUONG");
    expect(frequencies).toEqual([660,880]);
    frequencies.length = 0;
    audio.playReveal("THUONG","CENTRAL");
    expect(frequencies.slice(0,2)).toEqual([660,880]);
    const centralNotes = frequencies.slice(2);
    expect(centralNotes).toHaveLength(4);
    frequencies.length = 0;
    audio.playReveal("THUONG","NORTH");
    expect(frequencies.slice(2)).not.toEqual(centralNotes);
  });
});
