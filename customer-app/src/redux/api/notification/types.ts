export type NotificationType =
  | 'ORDER_PLACED'
  | 'ORDER_STATUS'
  | 'ORDER_CANCELLED'
  | 'BOOKING_PLACED'
  | 'BOOKING_STATUS'
  | 'BOOKING_CANCELLED'
  // Backend scheduler: "your appointment is in 24 h / 1 h" (customer).
  | 'BOOKING_REMINDER'
  // A customer's personal reminder is due (customer).
  | 'REMINDER_DUE';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  entityType: 'ORDER' | 'BOOKING' | 'REMINDER' | null;
  entityId: string | null;
  isRead: boolean;
  createdAt: string;
}
