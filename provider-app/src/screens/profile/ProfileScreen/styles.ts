import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    paddingBottom: Spacing.xl,
  },

  hero: {
    backgroundColor: Color.primary,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl * 1.5,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  heroTopRow: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Color.error,
  },
  avatarWrap: {
    marginTop: Spacing.sm,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.accent,
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Color.glass,
  },
  avatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Color.ink,
  },
  avatarCameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primary,
    borderWidth: 2,
    borderColor: Color.primary,
  },
  avatarErrorText: {
    fontSize: FontSize.xs,
    color: Color.white,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginTop: 4,
  },
  heroName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Color.white,
    marginTop: Spacing.xs,
  },
  heroEmail: {
    fontSize: FontSize.sm,
    color: Color.onDarkMuted,
  },
  heroPill: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  heroPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  body: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Color.border,
    marginTop: -Spacing.xl,
    ...Shadow.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Color.border,
    marginVertical: Spacing.sm,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  sectionGroup: {
    gap: Spacing.xs,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textSecondary,
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  menu: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Color.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: Color.divider,
  },
  menuItemFirst: {
    borderTopWidth: 0,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  menuItemText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  menuBadge: {
    alignSelf: 'center',
  },
  menuItemValue: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Color.errorBorder,
    backgroundColor: Color.errorSoft,
  },
  logoutText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.error,
  },

  version: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: Color.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Color.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  modalTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginBottom: Spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  modalButton: {
    flex: 1,
  },
});
