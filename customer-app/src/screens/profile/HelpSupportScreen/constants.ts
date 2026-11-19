import { ROUTES } from '@/navigation/routes';

/** Support availability copy shown on the contact cards. */
export const SUPPORT_HOURS = 'Mon–Sat, 9 AM – 8 PM';
export const EMAIL_REPLY_TIME = 'Reply within 24h';
export const WHATSAPP_REPLY_TIME = 'Fastest reply';

export type FaqTopic = 'all' | 'bookings' | 'orders' | 'payments' | 'account';

export const FAQ_TOPICS: { key: FaqTopic; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'orders', label: 'Orders' },
  { key: 'payments', label: 'Payments & refunds' },
  { key: 'account', label: 'Account' },
];

/** Screens an FAQ answer can link to — all open without required params. */
export type FaqLinkRoute =
  | typeof ROUTES.BOOKINGS
  | typeof ROUTES.REMINDERS
  | typeof ROUTES.ADDRESSES
  | typeof ROUTES.REFUND_POLICY
  | typeof ROUTES.PRIVACY_POLICY;

/** An answer is plain text interleaved with tappable in-app links. */
export type FaqSegment = string | { text: string; route: FaqLinkRoute };

export interface Faq {
  id: string;
  topic: Exclude<FaqTopic, 'all'>;
  question: string;
  answer: FaqSegment[];
}

/** Customer FAQs — answers follow the in-app flows and the Refund Policy. */
export const FAQS: Faq[] = [
  {
    id: 'cancel-booking',
    topic: 'bookings',
    question: 'How do I cancel or reschedule a booking?',
    answer: [
      'Open the booking under ',
      { text: 'Bookings & Orders', route: ROUTES.BOOKINGS },
      ' and tap Cancel. You can cancel while it is pending or confirmed. If you only need a different time, reschedule it instead.',
    ],
  },
  {
    id: 'booking-status',
    topic: 'bookings',
    question: 'Where can I see my upcoming appointments?',
    answer: [
      'All your bookings — upcoming, past and cancelled — are listed under ',
      { text: 'Bookings & Orders', route: ROUTES.BOOKINGS },
      '. Tap one to see its details and status.',
    ],
  },
  {
    id: 'reminders',
    topic: 'bookings',
    question: 'Can DNX remind me about renewals?',
    answer: [
      'Yes. Add a reminder from ',
      { text: 'Reminders', route: ROUTES.REMINDERS },
      ' and we’ll nudge you before it’s due.',
    ],
  },
  {
    id: 'cancel-order',
    topic: 'orders',
    question: 'How do I cancel an order?',
    answer: [
      'Open the order under ',
      { text: 'Bookings & Orders', route: ROUTES.BOOKINGS },
      ' and tap Cancel while it is still placed or confirmed. Once the store marks it ready for pickup, please contact the store or us.',
    ],
  },
  {
    id: 'pickup-window',
    topic: 'orders',
    question: 'How long do I have to collect a pickup order?',
    answer: [
      'Ready orders are held for 24 hours unless the store shows a different pickup window. After that the store can close it as a no-show.',
    ],
  },
  {
    id: 'refund-eligible',
    topic: 'payments',
    question: 'Will I get a refund if I cancel?',
    answer: [
      'It depends on the booking or order and how far along it is. The full rules are in the ',
      { text: 'Refund & Cancellation Policy', route: ROUTES.REFUND_POLICY },
      '.',
    ],
  },
  {
    id: 'refund-time',
    topic: 'payments',
    question: 'When will my refund show up?',
    answer: [
      'Refunds go back to the payment method you used. After we process one, banks usually take 5–7 working days to show it.',
    ],
  },
  {
    id: 'charged-twice',
    topic: 'payments',
    question: 'I was charged but can’t see my booking or order',
    answer: [
      'Contact us above with the date, amount and your payment reference. We’ll complete the booking or order, or refund you.',
    ],
  },
  {
    id: 'addresses',
    topic: 'account',
    question: 'How do I add or change a saved address?',
    answer: ['Manage them from ', { text: 'Saved addresses', route: ROUTES.ADDRESSES }, '.'],
  },
  {
    id: 'password',
    topic: 'account',
    question: 'How do I change my password?',
    answer: ['Go to Profile and tap Change password.'],
  },
  {
    id: 'delete-account',
    topic: 'account',
    question: 'How do I delete my account?',
    answer: [
      'Go to Profile and tap Delete account. See the ',
      { text: 'Privacy Policy', route: ROUTES.PRIVACY_POLICY },
      ' for what happens to your data.',
    ],
  },
];

export function answerText(faq: Faq): string {
  return faq.answer.map((s) => (typeof s === 'string' ? s : s.text)).join('');
}
