import { ROUTES } from '@/navigation/routes';

/** Support availability copy shown on the contact cards. */
export const SUPPORT_HOURS = 'Mon–Sat, 9 AM – 8 PM';
export const EMAIL_REPLY_TIME = 'Reply within 24h';
export const WHATSAPP_REPLY_TIME = 'Fastest reply';

export const TIP_EXAMPLE_ID = '#B7K2Q9';

export type FaqCategory = 'all' | 'payments' | 'bookings' | 'orders' | 'offers' | 'account';

export const FAQ_CATEGORIES: { key: FaqCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'payments', label: 'Payments' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'orders', label: 'Orders' },
  { key: 'offers', label: 'Offers' },
  { key: 'account', label: 'Account' },
];

/** Screens an FAQ answer can link to — all take no params. */
export type FaqLinkRoute =
  | typeof ROUTES.EARNINGS
  | typeof ROUTES.BUSINESSES
  | typeof ROUTES.ALL_OFFERS
  | typeof ROUTES.BOOKINGS_ORDERS
  | typeof ROUTES.PROFILE;

/** An answer is plain text interleaved with tappable in-app links. */
export type FaqSegment = string | { text: string; route: FaqLinkRoute };

export interface Faq {
  id: string;
  categories: FaqCategory[];
  question: string;
  answer: FaqSegment[];
}

export const FAQS: Faq[] = [
  {
    id: 'get-paid',
    categories: ['payments'],
    question: 'When do I get paid?',
    answer: [
      'DNX pays out your online earnings manually. You can check your payout balance, past payouts, and the latest status under ',
      { text: 'Earnings → Payout balance', route: ROUTES.EARNINGS },
      '.',
    ],
  },
  {
    id: 'commission',
    categories: ['payments'],
    question: 'What is the commission rate?',
    answer: [
      'DNX takes a commission on each completed sale. The rate for each of your businesses is shown under ',
      { text: 'Earnings', route: ROUTES.EARNINGS },
      '. It comes out of your price — customers always pay the listed price.',
    ],
  },
  {
    id: 'business-details',
    categories: ['account'],
    question: 'How do I add or update my business details?',
    answer: [
      'Go to the ',
      { text: 'Businesses', route: ROUTES.BUSINESSES },
      ' tab, open the business and tap Edit. To add a new one, use the add button on the same tab.',
    ],
  },
  {
    id: 'offers',
    categories: ['offers'],
    question: 'How can I manage my offers (coupons)?',
    answer: [
      'Open ',
      { text: 'Offers', route: ROUTES.ALL_OFFERS },
      ' from Profile, Home or a business’s Offers tile to create, edit, switch on/off or delete your coupons.',
    ],
  },
  {
    id: 'track',
    categories: ['bookings', 'orders'],
    question: 'How do I track my bookings and orders?',
    answer: [
      'Everything lives in the ',
      { text: 'Bookings & Orders', route: ROUTES.BOOKINGS_ORDERS },
      ' tab. From there you can accept, start and complete each job, and mark cash as collected.',
    ],
  },
  {
    id: 'missing-payment',
    categories: ['payments'],
    question: 'What should I do if a payment is missing?',
    answer: [
      'First check the sale under ',
      { text: 'Earnings → Completed sales', route: ROUTES.EARNINGS },
      '. If it’s still missing, contact us above with the booking or order ID.',
    ],
  },
  {
    id: 'out-of-stock',
    categories: ['orders'],
    question: 'How do I mark a product out of stock?',
    answer: [
      'Open your store from ',
      { text: 'Businesses', route: ROUTES.BUSINESSES },
      ', tap Stock (or Manage Stock on Products) and set the quantity to zero or mark it unavailable. Customers can’t order it until you restock.',
    ],
  },
  {
    id: 'hours',
    categories: ['bookings', 'account'],
    question: 'How do I change my hours or close for a day?',
    answer: [
      'Open the business from ',
      { text: 'Businesses', route: ROUTES.BUSINESSES },
      '. Use Hours for your regular weekly timings, or Calendar to close (or change timings) on a single date.',
    ],
  },
  {
    id: 'password',
    categories: ['account'],
    question: 'How do I change my password?',
    answer: ['Go to ', { text: 'Profile', route: ROUTES.PROFILE }, ' and tap Change password.'],
  },
  {
    id: 'pending-blocked',
    categories: ['account'],
    question: 'Why is my business pending or blocked?',
    answer: [
      'New businesses show Pending until the DNX team verifies them. A Blocked business has been paused by our team — contact us above and we’ll explain what’s needed.',
    ],
  },
];

export function answerText(faq: Faq): string {
  return faq.answer.map(s => (typeof s === 'string' ? s : s.text)).join('');
}
