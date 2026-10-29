import { useEffect, useRef } from 'react';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { hydrateCart } from '@/redux/slices/cartSlice';
import type { CartItem } from '@/redux/slices/cartSlice';
import { useLazyGetCartQuery, useSyncCartMutation } from '@/redux/api/cart/cartApi';

const keyOf = (items: CartItem[]) => JSON.stringify(items.map((i) => [i.productId, i.quantity]));

/**
 * Keeps the cart persistent per user: loads the saved cart from the server on
 * login / app-open, and saves it back (debounced) whenever it changes. Renders
 * nothing. Mounted once under the Redux Provider.
 */
export function CartSync(): null {
  const isLoggedIn = useAppSelector((s) => s.user.isLoggedIn);
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const [fetchCart] = useLazyGetCartQuery();
  const [syncCart] = useSyncCartMutation();

  const hydrated = useRef(false);
  const lastSynced = useRef('');

  // Load the saved cart when logged in (covers login and app cold-start).
  useEffect(() => {
    if (!isLoggedIn) {
      hydrated.current = false;
      return;
    }
    let active = true;
    fetchCart()
      .unwrap()
      .then((serverItems) => {
        if (!active) return;
        dispatch(hydrateCart(serverItems));
        lastSynced.current = keyOf(serverItems);
        hydrated.current = true;
      })
      .catch(() => {
        hydrated.current = true;
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Save the cart to the server when it changes (skips the initial hydrate).
  useEffect(() => {
    if (!isLoggedIn || !hydrated.current) return;
    const key = keyOf(items);
    if (key === lastSynced.current) return;
    const t = setTimeout(() => {
      syncCart(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))
        .unwrap()
        .then(() => {
          lastSynced.current = key;
        })
        .catch(() => {});
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isLoggedIn]);

  return null;
}
