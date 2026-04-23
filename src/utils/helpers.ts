// Debounce (Improved - supports immediate execution + cancel)
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
  immediate = false
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) fn(...args);
    }, delay);

    if (callNow) fn(...args);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

// Throttle (Improved - trailing execution support)
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit = 300
) {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, limit - (now - lastCall));
    }
  };
}

// File Extension (Safer)
export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

// File Size Formatter (More Units + Safe)
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Generate Unique ID (Better randomness)
export function generateId(): string {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Truncate Text (Word-safe option)
export function truncateText(
  text: string,
  maxLength: number,
  wordSafe = true
): string {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);

  if (!wordSafe) return truncated + '...';

  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

// Copy to Clipboard (Fallback Support)
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    return true;
  } catch {
    return false;
  }
}

// Download File (Safe + Cleanup)
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType = 'text/plain'
) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}