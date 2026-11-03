import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Check, ChevronRight, Clock, Command, Image as ImageIcon, Package } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { Business } from '@/redux/api/business/types';
import { PILL, INK } from '@/utils/modernTheme';

import { SUCCESS_GREEN, styles } from './styles';

interface NextRowProps {
  icon: LucideIcon;
  title: string;
  sub: string;
  onPress: () => void;
}

function NextRow({ icon: Icon, title, sub, onPress }: NextRowProps) {
  return (
    <TouchableOpacity style={styles.nextRow} activeOpacity={0.8} onPress={onPress} accessibilityRole="button">
      <Icon size={28} color={INK} strokeWidth={1.8} />
      <View style={styles.nextBody}>
        <Text style={styles.nextTitle}>{title}</Text>
        <Text style={styles.nextSub}>{sub}</Text>
      </View>
      <ChevronRight size={22} color={INK} strokeWidth={2.2} />
    </TouchableOpacity>
  );
}

interface DoneViewProps {
  business: Business;
  isStore: boolean;
  onCatalog: () => void;
  onHours: () => void;
  onPhotos: () => void;
}

/** Step 6 — shown once the business has been created (and photos uploaded). */
export function DoneView({ business, isStore, onCatalog, onHours, onPhotos }: DoneViewProps) {
  const hasPhotos = business.images.length > 0;
  return (
    <ScrollView contentContainerStyle={styles.doneContent} showsVerticalScrollIndicator={false}>
      <View style={styles.celebrate}>
        <View style={[styles.dash, styles.dashA]} />
        <View style={[styles.dash, styles.dashB]} />
        <View style={[styles.dash, styles.dashC]} />
        <View style={[styles.dash, styles.dashD]} />
        <View style={[styles.dash, styles.dashE]} />
        <View style={[styles.dash, styles.dashF]} />
        <View style={styles.checkCircle}>
          <Check size={60} color={SUCCESS_GREEN} strokeWidth={3} />
        </View>
      </View>

      <Text style={styles.doneTitle}>{business.businessName} is ready!</Text>
      <Pill
        label={business.isVerified ? 'Verified' : 'Verification pending'}
        colors={business.isVerified ? PILL.green : PILL.orange}
        style={styles.statusPill}
      />
      <Text style={styles.doneSub}>
        Finish these to start getting {isStore ? 'orders' : 'bookings'}.
      </Text>

      <NextRow
        icon={isStore ? Package : Command}
        title={isStore ? 'Add your products' : 'Add your services'}
        sub={isStore ? 'List the products customers can order.' : 'List the services customers can book.'}
        onPress={onCatalog}
      />
      <NextRow icon={Clock} title="Set your business hours" sub="Add your weekly timing and breaks." onPress={onHours} />
      <NextRow
        icon={ImageIcon}
        title={hasPhotos ? 'Upload more photos' : 'Upload photos'}
        sub="Showcase your business, team and setup."
        onPress={onPhotos}
      />
    </ScrollView>
  );
}
