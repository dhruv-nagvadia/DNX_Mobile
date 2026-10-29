import React from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Package, Plus } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { priceLabel, stockLabel, stockLevel } from '@/utils/units';
import { Product } from '@/redux/api/business/types';

import { useProductsScreen } from './useProductsScreen';
import { styles } from './styles';

const STOCK_STYLE = {
  ok: { bg: styles.stockOk, text: styles.stockOkText },
  low: { bg: styles.stockLow, text: styles.stockLowText },
  out: { bg: styles.stockOut, text: styles.stockOutText },
} as const;

function StockBadge({ product }: { product: Product }) {
  if (product.unlimitedStock) {
    const available = product.stockQty > 0;
    const style = available ? STOCK_STYLE.ok : STOCK_STYLE.out;
    return (
      <View style={[styles.stockBadge, style.bg]}>
        <Text style={[styles.stockBadgeText, style.text]}>{available ? 'Available' : 'Unavailable'}</Text>
      </View>
    );
  }
  const level = stockLevel(product.stockQty, product.stepQty);
  const style = STOCK_STYLE[level];
  return (
    <View style={[styles.stockBadge, style.bg]}>
      <Text style={[styles.stockBadgeText, style.text]}>{stockLabel(product.stockQty, product.measure)}</Text>
    </View>
  );
}

export default function ProductsScreen() {
  const { products, isLoading, refreshing, refresh, deleting, toggleActive, remove, addProduct, editProduct, goToStock } =
    useProductsScreen();

  const confirmDelete = (productId: string, name: string) => {
    Alert.alert('Delete product?', `"${name}" will be removed from your catalog.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(productId) },
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={goToStock} accessibilityRole="button">
            <Package size={18} color={Color.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={addProduct} accessibilityRole="button">
            <Plus size={18} color={Color.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {products.length === 0 && !isLoading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No products yet. Add one to start selling.</Text>
          </View>
        ) : (
          products.map((p) => (
            <View key={p.id} style={[styles.card, p.isActive === false && styles.cardInactive]}>
              <View style={styles.cardTop}>
                <Text style={styles.name} numberOfLines={1}>
                  {p.name}
                </Text>
                <Switch
                  value={p.isActive !== false}
                  onValueChange={() => toggleActive(p)}
                  trackColor={{ true: Color.primary, false: Color.border }}
                />
              </View>
              {!!p.section && <Text style={styles.meta}>{p.section}</Text>}
              <Text style={styles.price}>{priceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)}</Text>
              <StockBadge product={p} />

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => editProduct(p.id)}>
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnDanger]}
                  disabled={deleting}
                  onPress={() => confirmDelete(p.id, p.name)}
                >
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
