import React from 'react';
import { FlatList, Image, RefreshControl, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, FlaskConical } from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { INK, PAGE_BG, PILL } from '@/utils/modernTheme';
import { formatAmount } from '@/utils/units';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useLowStockListScreen } from './useLowStockListScreen';
import { LowStockItem } from './types';
import { EMPTY_TINT, styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LowStockListScreen'>;

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };
const SKELETON_ROWS = [0, 1, 2, 3];

export default function LowStockListScreen() {
  const { lowStock, isLoading, refreshing, refresh } = useLowStockListScreen();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const count = lowStock.length;
  const subtitle = isLoading ? '' : `${count} product${count === 1 ? '' : 's'}`;

  const renderItem = ({ item }: { item: LowStockItem }) => {
    const { product } = item;
    const left = formatAmount(Math.max(product.stockQty, 0), product.measure);
    const out = item.level === 'out';
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate(ROUTES.STOCK, { businessId: item.businessId })}
      >
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbFallback}>
            <FlaskConical size={20} color={Color.textSecondary} />
          </View>
        )}
        <View style={styles.main}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {item.businessName} · {left} left
          </Text>
        </View>
        <Pill
          label={out ? 'Out of stock' : `Only ${left} left`}
          colors={out ? PILL.red : PILL.orange}
          style={styles.pill}
        />
        <ChevronRight size={18} color={Color.placeholder} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={INK} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Low Stock
          </Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.listContent}>
          {SKELETON_ROWS.map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.skelBox} />
              <View style={styles.main}>
                <View style={styles.skelLineLong} />
                <View style={styles.skelLineShort} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={lowStock}
          keyExtractor={(item) => item.product.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyCircle}>
                <FlaskConical size={32} color={EMPTY_TINT.fg} strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>Stock looks healthy</Text>
              <Text style={styles.emptyBody}>Products running low or out of stock will show up here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
