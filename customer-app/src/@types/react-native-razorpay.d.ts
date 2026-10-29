declare module 'react-native-razorpay' {
  export interface RazorpayCheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name?: string;
    description?: string;
    image?: string;
    prefill?: { email?: string; contact?: string; name?: string };
    theme?: { color?: string };
    notes?: Record<string, string>;
  }

  export interface RazorpaySuccessResult {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  export interface RazorpayErrorResult {
    code?: number;
    description?: string;
    reason?: string;
    error?: { code?: number; description?: string; reason?: string };
  }

  export default class RazorpayCheckout {
    static open(options: RazorpayCheckoutOptions): Promise<RazorpaySuccessResult>;
  }
}
