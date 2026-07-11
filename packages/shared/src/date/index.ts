import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

function toDate(date: Date | string): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

export function formatDate(date: Date | string, pattern = "MMM d, yyyy"): string {
  return format(toDate(date), pattern);
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(toDate(date), { addSuffix: true });
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && isValid(date);
}
