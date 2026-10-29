import RazorpayCheckout, { RazorpaySuccessResult } from 'react-native-razorpay';
import { Color } from '@/utils/Theme';
import { PaymentOrderResponse } from '@/redux/api/booking/types';

// A backstop only for a genuinely stuck native layer (bad build, SDK/simulator
// issue) — NOT for slow user interaction. Card entry + bank OTP can easily run
// past a minute, so this must stay far longer than that: a real payment that
// completes after this fires is still recovered by the caller's server-side
// sync (Razorpay's own record of the payment, not just this SDK callback).
const CHECKOUT_TIMEOUT_MS = 10 * 60 * 1000;

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
