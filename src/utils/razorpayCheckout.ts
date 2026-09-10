import RazorpayCheckout, { RazorpaySuccessResult } from 'react-native-razorpay';
import { Color } from '@/utils/Theme';
import { PaymentOrderResponse } from '@/redux/api/booking/types';

// If the native checkout sheet hasn't opened/closed by this point, something
// is wrong at the native layer (bad build, SDK/simulator issue) — fail loudly
// instead of leaving the caller's "placing order" spinner stuck forever.
const CHECKOUT_TIMEOUT_MS = 25000;

class CheckoutTimeoutError extends Error {}

/**
 * Opens Razorpay's native in-app checkout (no browser) for a payment order
 * created via `createPaymentOrder`/`createOrderPaymentOrder`. Resolves with the
 * signed result on success, or `null` if the user dismissed the sheet.
 */
export async function openRazorpayCheckout(
  order: PaymentOrderResponse,
): Promise<RazorpaySuccessResult | null> {
  if (!order.razorpayOrderId || !order.keyId) return null;

  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new CheckoutTimeoutError('Checkout timed out')), CHECKOUT_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      RazorpayCheckout.open({
        key: order.keyId,
        order_id: order.razorpayOrderId,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        prefill: { email: order.email, contact: order.contact },
        theme: { color: Color.primary },
      }),
      timeout,
    ]);
  } catch (err: unknown) {
    if (err instanceof CheckoutTimeoutError) {
      throw new Error(
        'The payment screen didn’t open. Please check your connection and try again.',
      );
    }
    const e = err as { code?: number; error?: { code?: number } };
    const cancelled = e?.code === 0 || e?.error?.code === 0;
    if (cancelled) return null;
    throw err;
  } finally {
    clearTimeout(timer!);
  }
}
