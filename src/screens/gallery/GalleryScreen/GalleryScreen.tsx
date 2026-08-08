import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';

import { Color } from '@/utils/Theme';
import { useGalleryScreen } from './useGalleryScreen';
import { styles } from './styles';

/** Dark photo viewer: one large image + a scrollable grid of square thumbnails. */
export default function GalleryScreen() {
  const { images, selected, select } = useGalleryScreen();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Color.ink} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image style={styles.hero} source={{ uri: images[selected] }} resizeMode="cover" />

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {selected + 1} / {images.length}
          </Text>
        </View>

        <Text style={styles.gridLabel}>All photos</Text>
        <View style={styles.grid}>
          {images.map((url, i) => (
            <TouchableOpacity
              key={url}
              style={[styles.thumb, i === selected && styles.thumbActive]}
              activeOpacity={0.85}
              onPress={() => select(i)}
            >
              <Image style={styles.thumbImg} source={{ uri: url }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
