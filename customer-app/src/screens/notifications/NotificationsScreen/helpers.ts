import { AppNotification } from '@/redux/api/notification/types';

export type NotificationCategory =
  'booking' | 'order' | 'review' | 'payment' | 'stock' | 'cancelled' | 'reminder' | 'generic';

export type FilterKey = 'all' | 'unread' | NotificationCategory;

export const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  booking: 'Bookings',
  order: 'Orders',
  review: 'Reviews',
  payment: 'Payments',
  stock: 'Low stock',
  cancelled: 'Cancelled',
  reminder: 'Reminders',
  generic: 'Other',
};

/** Derive a visual category from `type`, falling back to keywords in the
 * title so future backend types (reviews, payouts, low stock) still get a
 * sensible icon. Cancellations keep their booking/order category for
 * filtering — see `isCancelled` for the icon. */
export function categoryOf(n: AppNotification): NotificationCategory {
  const type = (n.type ?? '').toUpperCase();
  const title = (n.title ?? '').toLowerCase();
  if (type.includes('STOCK') || title.includes('stock')) {
    return 'stock';
  }
  if (type.includes('REVIEW') || title.includes('review')) {
    return 'review';
  }
  if (/PAY|REFUND|EARNING/.test(type) || /payment|payout|refund|earning/.test(title)) {
    return 'payment';
  }
  if (type === 'REMINDER_DUE' || n.entityType === 'REMINDER') {
    return 'reminder';
  }
  if (type.startsWith('BOOKING') || n.entityType === 'BOOKING') {
    return 'booking';
  }
  if (type.startsWith('ORDER') || n.entityType === 'ORDER') {
    return 'order';
  }
  return 'generic';
}

export function isCancelled(n: AppNotification): boolean {
  return (n.type ?? '').endsWith('CANCELLED');
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const DAY_MS = 86_400_000;

/** "Just now", "5m ago", "2h ago", "Mon", "12 Nov". */
export function timeAgo(iso: string): string {
  const date = new Date(iso);
  const ms = Date.now() - date.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) {
    return 'Just now';
  }
  if (min < 60) {
    return `${min}m ago`;
  }
  const hr = Math.floor(min / 60);
  if (hr < 24) {
    return `${hr}h ago`;
  }
  if (ms < 7 * DAY_MS) {
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export type NotificationSection = { title: string; data: AppNotification[] };

/** Split (already newest-first) notifications into Today / Yesterday / Earlier. */
export function groupByDay(list: AppNotification[]): NotificationSection[] {
  const today = startOfDay(new Date());
  const yesterday = today - DAY_MS;
  const buckets: NotificationSection[] = [
    { title: 'Today', data: [] },
    { title: 'Yesterday', data: [] },
    { title: 'Earlier', data: [] },
  ];
  list.forEach((n) => {
    const day = startOfDay(new Date(n.createdAt));
    if (day >= today) {
      buckets[0].data.push(n);
    } else if (day >= yesterday) {
      buckets[1].data.push(n);
    } else {
      buckets[2].data.push(n);
    }
  });
  return buckets.filter((b) => b.data.length > 0);
}
