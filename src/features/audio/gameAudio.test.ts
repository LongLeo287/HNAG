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
    audio.playReveal("HUYEN_THOAI", "CENTRAL");

    expect(createOscillator).not.toHaveBeenCalled();
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
