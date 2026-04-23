// Format Date (Safe + Configurable)
export function formatDate(
  dateInput: string | Date,
  locale = 'en-US'
): string {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Relative Time (More Accurate + Future Support)
export function formatRelativeTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();

  if (isNaN(date.getTime())) return 'Invalid date';

  const diffMs = now.getTime() - date.getTime();
  const isFuture = diffMs < 0;

  const absDiff = Math.abs(diffMs);

  const sec = Math.floor(absDiff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  const format = (value: number, unit: string) =>
    isFuture ? `in ${value}${unit}` : `${value}${unit} ago`;

  if (sec < 60) return isFuture ? 'in a few seconds' : 'Just now';
  if (min < 60) return format(min, 'm');
  if (hour < 24) return format(hour, 'h');
  if (day < 7) return format(day, 'd');

  return formatDate(date);
}

// Number Formatting (Safe)
export function formatNumber(num: number, locale = 'en-US'): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat(locale).format(num);
}

// Percentage (Safe + Clamp Option)
export function formatPercentage(
  value: number,
  decimals = 0,
  clamp = false
): string {
  if (isNaN(value)) return '0%';

  let val = value;
  if (clamp) {
    val = Math.min(100, Math.max(0, value));
  }

  return `${val.toFixed(decimals)}%`;
}

// Currency (Flexible + Safe)
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  if (isNaN(amount)) return '0';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Capitalize (Handles empty + multiple words)
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Title Case (Better for UI)
export function toTitleCase(str: string): string {
  if (!str) return '';

  return str
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

// Status Formatter (Robust)
export function formatStatus(status: string): string {
  if (!status) return '';

  return status
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}