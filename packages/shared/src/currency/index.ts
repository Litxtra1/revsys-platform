export interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
}

export function formatCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  const { currency = "USD", locale = "en-US" } = options;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

export function parseCurrency(input: string): number {
  const cleaned = input.replace(/[^0-9.-]+/g, "");
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) {
    throw new Error(`Unable to parse currency value: "${input}"`);
  }
  return value;
}
