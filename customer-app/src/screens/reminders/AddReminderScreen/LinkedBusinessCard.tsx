import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Store } from 'lucide-react-native';

import { RemoteImage } from '@/components/RemoteImage';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { LINK } from '@/utils/modernTheme';

import { styles } from './styles';

/** "Linked business" card for reminders created from a booking ("book again"). */
export function LinkedBusinessCard({
  providerId,
  createdAt,
}: {
  providerId: string;
  createdAt: string | null;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: provider } = useGetProviderByIdQuery({ id: providerId });
  const sub = [provider?.subcategory?.name ?? provider?.category.name, provider?.city]
    .filter(Boolean)
    .join(' • ');
  const created = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Linked business</Text>
      <View style={styles.bizRow}>
        <View style={styles.bizAvatar}>
          <RemoteImage
            uris={[
              provider?.images[0],
              provider?.subcategory?.imageUrl,
              provider?.category.imageUrl,
            ]}
            style={styles.fill}
            resizeMode="cover"
            fallback={<Store size={22} color={LINK} />}
          />
        </View>
        <View style={styles.bizText}>
          <Text style={styles.bizName} numberOfLines={1}>
            {provider?.businessName ?? 'Business'}
          </Text>
          {!!sub && (
            <Text style={styles.bizMeta} numberOfLines={1}>
              {sub}
            </Text>
          )}
          <Text style={styles.bizCaption}>
            {created ? `Created from your booking on ${created}` : 'Created from your booking'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() =>
            navigation.navigate(ROUTES.PROVIDER_DETAILS, {
              providerId,
              name: provider?.businessName,
            })
          }
          accessibilityRole="button"
          accessibilityLabel="View business"
        >
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
