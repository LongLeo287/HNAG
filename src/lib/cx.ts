/** Minimal class-name joiner — deliberately not clsx/cva/tailwind-merge (see docs/implementation-plan.md). */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
