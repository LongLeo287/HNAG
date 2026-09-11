import type { UniformRng } from "./types";

/**
 * RANK-018: production RNG source. Uses the browser's CSPRNG, never Math.random,
 * so UI/reveal code cannot accidentally become a second source of "randomness".
 * Tests inject their own deterministic UniformRng instead of calling this.
 */
export function createCryptoUniformRng(): UniformRng {
  return () => {
    if (typeof crypto === "undefined" || typeof crypto.getRandomValues !== "function") {
      // Explicit-retry fallback per BRD/RANK-018 notes: never silently choose a winner
      // without a real random source. Throwing surfaces this as a recoverable game error.
      throw new Error("RNG_UNAVAILABLE");
    }
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    // 2^32, so the result stays in [0, 1).
    return (buffer[0] ?? 0) / 4294967296;
  };
}
