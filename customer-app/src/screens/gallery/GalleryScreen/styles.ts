import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { ModernRadius, ModernSize, ModernType } from '@/utils/modernTheme';

export const BLACK = '#000000';
export const ICON_ON_DARK = Color.white;
export const MUTED_ON_DARK = 'rgba(255, 255, 255, 0.6)';
export const THUMB = 56;
export const THUMB_GAP = 8;
export const THUMB_PAD = ModernSize.gutter;
export const CLOSE_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const GLASS = 'rgba(255, 255, 255, 0.14)';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },

  // ── Top bar ─────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GLASS,
  },
  counter: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: ModernRadius.pill,
    backgroundColor: GLASS,
  },
  counterText: {
    color: Color.white,
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    fontVariant: ['tabular-nums'],
  },
  // Balances the close button so the counter stays centred.
  topSpacer: {
    width: 40,
  },

  // ── Pager ───────────────────────────────────────────────────────────────
  pager: {
    flex: 1,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    color: MUTED_ON_DARK,
    fontSize: ModernType.body,
  },

  // ── Thumbnails ──────────────────────────────────────────────────────────
  thumbBar: {
    paddingTop: 12,
  },
  thumbRow: {
    paddingHorizontal: THUMB_PAD,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    marginRight: THUMB_GAP,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbActive: {
    borderColor: Color.white,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbDim: {
    opacity: 0.5,
  },
});
