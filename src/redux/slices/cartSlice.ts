import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** One line in the cart. Amounts are in base units (g / ml / piece). */
export interface CartItem {
  productId: string;
  providerId: string;
  providerName: string;
  name: string;
  measure: 'weight' | 'volume' | 'count';
  priceMinor: number; // price for `priceQty` base units
  priceQty: number;
  currency: string;
  stockQty: number; // base units
  stepQty: number; // minimum + increment, base units
  quantity: number; // chosen amount, base units
  imageUrl?: string | null;
  depositPercent?: number; // provider's partial-pay deposit %
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Sets the quantity for a product (adds it if new, removes it at 0).
    setCartQty: (
      state,
      action: PayloadAction<{ item: Omit<CartItem, 'quantity'>; quantity: number }>,
    ) => {
      const { item, quantity } = action.payload;
      const idx = state.items.findIndex((i) => i.productId === item.productId);
      if (quantity <= 0) {
        if (idx >= 0) state.items.splice(idx, 1);
        return;
      }
      if (idx >= 0) {
        state.items[idx] = { ...item, quantity };
      } else {
        state.items.push({ ...item, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    // Clears one shop's items (used after that shop's order is placed).
    clearProviderItems: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.providerId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    // Replace the whole cart (used when loading the saved cart from the server).
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setCartQty, removeFromCart, clearProviderItems, clearCart, hydrateCart } =
  cartSlice.actions;
export default cartSlice.reducer;
