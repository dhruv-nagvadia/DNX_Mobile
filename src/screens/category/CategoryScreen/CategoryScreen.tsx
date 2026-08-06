import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { Color } from '@/utils/Theme';

import { useCategoryScreen } from './useCategoryScreen';
import { styles } from './styles';

/** JSX only — logic comes from useCategoryScreen. */
export default function CategoryScreen() {
  const { categorySlug, subcategories, isLoading, onSubcategoryPress } = useCategoryScreen();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>Choose the service you need</Text>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Color.primary} />
          </View>
        ) : subcategories.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.stateText}>No service types here yet.</Text>
          </View>
        ) : (
          subcategories.map((sub) => (
            <TouchableOpacity
              key={sub.id}
              style={styles.row}
              activeOpacity={0.85}
              onPress={() => onSubcategoryPress(sub)}
            >
              <View style={styles.iconWrap}>
                <CategoryIcon slug={categorySlug} size={22} />
              </View>
              <Text style={styles.rowName}>{sub.name}</Text>
              <ChevronRight size={20} color={Color.placeholder} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
