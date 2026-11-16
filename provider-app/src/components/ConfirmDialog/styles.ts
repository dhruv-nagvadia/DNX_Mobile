import { StyleSheet } from 'react-native';

import { SHEET_BACKDROP } from '@/components/BottomSheet';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_SHADOW, INK, ModernType } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  inlineRoot: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SHEET_BACKDROP,
  },
  backdropPress: {
    flex: 1,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Color.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    ...CARD_SHADOW,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm + 4,
  },
  title: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
    textAlign: 'center',
  },
  message: {
    marginTop: 6,
    fontSize: ModernType.body,
    lineHeight: 20,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    marginTop: 20,
  },
});
