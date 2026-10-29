import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useBusinessesScreen } from './useBusinessesScreen';
import { styles } from './styles';

export default function BusinessesScreen() {
  const { businesses, isLoading, refreshing, refresh, openBusiness } = useBusinessesScreen();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My businesses</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {businesses.length === 0 && !isLoading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              No businesses yet. Businesses added on the web dashboard show up here automatically.
            </Text>
          </View>
        ) : (
          businesses.map((b) => (
            <TouchableOpacity key={b.id} style={styles.card} onPress={() => openBusiness(b.id)}>
              <View style={styles.cardTop}>
                <Text style={styles.name}>{b.businessName}</Text>
                {b.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <Text style={styles.meta}>
                {b.category.name}
                {b.subcategory ? ` · ${b.subcategory.name}` : ''}
              </Text>
              <Text style={styles.meta}>
                {b.ratingCount > 0 ? `★ ${b.ratingAvg.toFixed(1)} (${b.ratingCount})` : 'No reviews yet'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
