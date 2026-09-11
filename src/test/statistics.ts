/**
 * QA-009 (23_PERFORMANCE_QA): exact statistical tolerance for distribution tests —
 * "each candidate observed frequency must be within max(0.005, 5*sqrt(p*(1-p)/N)) of
 * expected probability p." Shared here so every distribution test uses the same bound
 * the spec actually specifies, not an ad-hoc percentage.
 */
export function distributionTolerance(p: number, n: number): number {
  return Math.max(0.005, 5 * Math.sqrt((p * (1 - p)) / n));
}
