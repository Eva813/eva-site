/** Shared utilities across the eva-site monorepo. Grow this as apps are added. */

/** Format an ISO date string as e.g. "2026-07-22". */
export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toISOString().slice(0, 10);
}
