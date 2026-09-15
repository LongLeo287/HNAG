import type { CandidateItem } from "@/data/catalog";

/** Cosmetic sampling from frozen probabilities. Never selects or changes a game winner. */
export function sampleDecoy(pool: CandidateItem[], probabilities: number[], random = Math.random): CandidateItem | undefined {
  const total = probabilities.reduce((sum, probability) => sum + probability, 0);
  if (probabilities.length !== pool.length || total <= 0) return pool[Math.floor(random() * pool.length)];
  const target = random() * total;
  let cumulative = 0;
  for (let i = 0; i < pool.length; i += 1) {
    cumulative += probabilities[i]!;
    if (target < cumulative) return pool[i];
  }
  return pool[pool.length - 1];
}
