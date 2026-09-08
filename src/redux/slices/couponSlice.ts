import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CouponPreview } from '@/redux/api/order/types';

/**
 * Coupons applied at checkout, keyed by providerId. Shared between the
 * checkout screens (Cart, Booking summary) and the dedicated Coupons screen,
 * so applying a code there reflects back on whichever screen opened it.
 */
interface CouponState {
  applied: Record<string, CouponPreview>;
}

const initialState: CouponState = { applied: {} };

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    setAppliedCoupon: (
      state,
      action: PayloadAction<{ providerId: string; coupon: CouponPreview }>,
    ) => {
      state.applied[action.payload.providerId] = action.payload.coupon;
    },
    clearAppliedCoupon: (state, action: PayloadAction<string>) => {
      delete state.applied[action.payload];
    },
    clearAllCoupons: (state) => {
      state.applied = {};
    },
  },
});

export const { setAppliedCoupon, clearAppliedCoupon, clearAllCoupons } = couponSlice.actions;
export default couponSlice.reducer;
