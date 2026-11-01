import React from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ImagePlus, Star, Trash2 } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { LoadingView } from '@/components/LoadingView';
import { Color } from '@/utils/Theme';

import { useBusinessPhotosScreen } from './useBusinessPhotosScreen';
import { styles } from './styles';

export default function BusinessPhotosScreen() {
  const {
    images,
    isLoading,
    refreshing,
    refresh,
    uploading,
    savingImages,
    error,
    addPhotos,
    setCover,
    removeImage,
  } = useBusinessPhotosScreen();

  const busy = savingImages;

  return (
    <View style={styles.root}>
      <AppHeader
        title="Photos"
        right={
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={addPhotos}
            disabled={uploading}
            accessibilityRole="button"
            accessibilityLabel="Add photos"
          >
            {uploading ? <ActivityIndicator size="small" color={Color.white} /> : <ImagePlus size={18} color={Color.white} />}
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <LoadingView />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {images.length === 0 ? (
            <EmptyState
              icon={<ImagePlus size={48} color={Color.placeholder} strokeWidth={1.4} />}
              title="No photos yet"
              body="Businesses with photos get noticeably more bookings."
              action={
                <TouchableOpacity onPress={addPhotos} disabled={uploading}>
                  <Text style={styles.ctaLink}>{uploading ? 'Uploading…' : 'Add photos →'}</Text>
                </TouchableOpacity>
              }
            />
          ) : (
            <View style={styles.grid}>
              {images.map((url, i) => (
                <View key={url} style={styles.tile}>
                  <Image source={{ uri: url }} style={styles.tileImage} />
                  {i === 0 && (
                    <View style={styles.coverTag}>
                      <Text style={styles.coverTagText}>Cover</Text>
                    </View>
                  )}
                  <View style={styles.tileActions}>
                    {i !== 0 && (
                      <TouchableOpacity
                        style={styles.tileBtn}
                        disabled={busy}
                        onPress={() => setCover(url)}
                        accessibilityRole="button"
                        accessibilityLabel="Set as cover photo"
                      >
                        <Star size={13} color={Color.white} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.tileBtn, styles.tileBtnDanger]}
                      disabled={busy}
                      onPress={() => removeImage(url)}
                      accessibilityRole="button"
                      accessibilityLabel="Remove photo"
                    >
                      <Trash2 size={13} color={Color.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
