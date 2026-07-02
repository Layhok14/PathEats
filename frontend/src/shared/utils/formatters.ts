// Pure formatting helpers — no side effects, safe to import anywhere.

export function formatPrice(amount: number | null | undefined) {
  if (amount == null || Number.isNaN(amount)) return "—";
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function formatDate(iso: string, includeYear = false) {
  if (!iso) return "N/A";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", ...(includeYear ? { year: "numeric" } : {}) };
  return new Date(iso).toLocaleDateString("en-US", opts);
}

export function timeAgo(iso: string) {
  const time = new Date(iso).getTime();
  if (isNaN(time)) return "—";
  const diff = Date.now() - time;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
