export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatHours(open: string, close: string): string {
  return `${open} – ${close}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
