const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - timestamp);

  if (diff < MINUTE) return 'Just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hr ago`;

  const days = Math.floor(diff / DAY);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}

export function formatDateTime(timestamp: number, now: number = Date.now()): string {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const today = new Date(now).toDateString();
  const yesterday = new Date(now - DAY).toDateString();

  if (date.toDateString() === today) return `Today, ${time}`;
  if (date.toDateString() === yesterday) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString([], { day: 'numeric', month: 'short' })}, ${time}`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
