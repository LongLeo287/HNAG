import { useEffect, useState } from "react";
import { createGameAudio, type GameAudio } from "./gameAudio";

export function useGameAudio(soundEnabled: boolean): GameAudio {
  const [audio] = useState<GameAudio>(() => createGameAudio());

  useEffect(() => {
    audio.setEnabled(soundEnabled);
  }, [audio, soundEnabled]);

  return audio;
}
