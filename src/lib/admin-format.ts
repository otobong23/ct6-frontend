const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const transactionDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatUSD(amount: number): string {
  return usdFormatter.format(amount);
}

export function formatTransactionDate(value: string): string {
  return transactionDateFormatter.format(new Date(value));
}
