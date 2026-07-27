import React from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';

import { AppText } from '@/components/AppText';
import { Color } from '@/utils/Theme';

import { useHomeScreen } from './useHomeScreen';
import { styles } from './styles';

/** JSX only — logic comes from useHomeScreen. */
export default function HomeScreen() {
  const { userName, categories, isLoading, onCategoryPress } = useHomeScreen();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Color.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.grid}
        ListHeaderComponent={
          <View style={styles.greeting}>
            <AppText variant="title">Hi, {userName} 👋</AppText>
            <AppText variant="caption">What service do you need today?</AppText>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onCategoryPress(item)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
