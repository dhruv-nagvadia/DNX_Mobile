import React from 'react';
import { Alert, Image, RefreshControl, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box, Package, Pencil, Plus, Trash2 } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { Color, Spacing } from '@/utils/Theme';
import { ACTION, PILL, PillColors, TINT } from '@/utils/modernTheme';
import { formatAmount, priceLabel, stockLevel } from '@/utils/units';
import { Product } from '@/redux/api/business/types';

import { useProductsScreen } from './useProductsScreen';
import { styles } from './styles';

function stockPill(product: Product): { label: string; colors: PillColors } {
  if (product.unlimitedStock) {
    return product.stockQty > 0
      ? { label: 'Available', colors: PILL.green }
      : { label: 'Unavailable', colors: PILL.red };
  }
  const level = stockLevel(product.stockQty, product.stepQty);
  if (level === 'out') {
    return { label: 'Out of Stock', colors: PILL.red };
  }
  return {
    label: `Stock: ${formatAmount(product.stockQty, product.measure)}`,
    colors: level === 'low' ? PILL.yellow : PILL.green,
  };
}

export default function ProductsScreen() {
  const { products, isLoading, refreshing, refresh, deleting, toggleActive, remove, addProduct, editProduct, goToStock } =
    useProductsScreen();
  const insets = useSafeAreaInsets();

  const confirmDelete = (productId: string, name: string) => {
    Alert.alert('Delete product?', `"${name}" will be removed from your catalog.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(productId) },
    ]);
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Products" variant="light" />

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.addBtn} onPress={addProduct} activeOpacity={0.85} accessibilityRole="button">
            <Plus size={18} color={Color.white} strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {products.length === 0 && !isLoading ? (
          <EmptyState
            icon={<Package size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No products yet"
            body="Add one to start selling."
          />
        ) : (
          <View style={styles.card}>
            {products.map((p, i) => {
              const active = p.isActive !== false;
              const pill = stockPill(p);
              const category = p.section || p.productType?.name;
              return (
                <View key={p.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <View style={styles.row}>
                    <View style={[styles.rowLeft, !active && styles.dimmed]}>
                      {p.imageUrl ? (
                        <Image source={{ uri: p.imageUrl }} style={styles.thumb} />
                      ) : (
                        <View style={[styles.thumb, styles.thumbFallback]}>
                          <Package size={22} color={TINT.blue.icon} />
                        </View>
                      )}
                      <View style={styles.rowMain}>
                        <Text style={styles.name} numberOfLines={2}>
                          {p.name}
                        </Text>
                        <Text style={styles.meta} numberOfLines={2}>
                          {category ? `${category} • ` : ''}
                          {priceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)}
                        </Text>
                        <Pill label={pill.label} colors={pill.colors} style={styles.stockPill} />
                      </View>
                    </View>
                    <View style={styles.actions}>
                      <Switch
                        value={active}
                        onValueChange={() => toggleActive(p)}
                        trackColor={{ true: ACTION, false: Color.border }}
                        thumbColor={Color.white}
                        ios_backgroundColor={Color.border}
                        style={styles.switch}
                      />
                      <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => editProduct(p.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${p.name}`}
                      >
                        <Pencil size={20} color={ACTION} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconBtn}
                        disabled={deleting}
                        onPress={() => confirmDelete(p.id, p.name)}
                        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${p.name}`}
                      >
                        <Trash2 size={20} color={Color.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <TouchableOpacity style={styles.stockBtn} onPress={goToStock} activeOpacity={0.8} accessibilityRole="button">
          <Box size={20} color={ACTION} />
          <Text style={styles.stockBtnText}>Manage Stock</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
