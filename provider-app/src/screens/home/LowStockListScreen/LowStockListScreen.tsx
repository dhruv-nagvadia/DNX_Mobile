import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlaskConical } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { stockLabel } from '@/utils/units';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useLowStockListScreen } from './useLowStockListScreen';
import { LowStockItem } from './types';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LowStockListScreen'>;

export default function LowStockListScreen() {
  const { lowStock, isLoading, refreshing, refresh } = useLowStockListScreen();
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item }: { item: LowStockItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.STOCK, { businessId: item.businessId })}
    >
      <View style={styles.icon}>
        <FlaskConical size={18} color={Color.textSecondary} />
      </View>
      <View style={styles.main}>
        <Text style={styles.title} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.businessName} · {stockLabel(item.product.stockQty, item.product.measure)}
        </Text>
      </View>
      <StatusBadge
        label={item.level === 'out' ? 'Out of Stock' : `Only ${item.product.stockQty} left`}
        tone="error"
        style={styles.centerBadge}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <AppHeader title="Low Stock" />
      <FlatList
        data={lowStock}
        keyExtractor={(item) => item.product.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon={<FlaskConical size={48} color={Color.placeholder} strokeWidth={1.4} />}
              title="Stock looks healthy"
              body="Products running low or out of stock will show up here."
            />
          ) : null
        }
      />
    </View>
  );
}
