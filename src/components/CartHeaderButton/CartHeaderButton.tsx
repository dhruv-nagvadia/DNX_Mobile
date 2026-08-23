import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppSelector } from '@/redux/hooks';
import { ROUTES } from '@/navigation/routes';
import { Color, FontWeight } from '@/utils/Theme';

/** Header cart icon with a live item-count badge; opens the cart. */
export function CartHeaderButton() {
  const navigation = useNavigation<{ navigate: (r: string) => void }>();
  const count = useAppSelector((s) => s.cart.items.filter((i) => i.quantity > 0).length);

  return (
    <TouchableOpacity
      style={styles.btn}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(ROUTES.CART)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel="Open cart"
    >
      <ShoppingCart size={22} color={Color.textPrimary} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 2 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: Color.white, fontSize: 10, fontWeight: FontWeight.bold },
});
