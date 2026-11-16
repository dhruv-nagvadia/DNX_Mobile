import { StyleSheet } from 'react-native';

import { LINK, ModernSize, ModernType } from '@/utils/modernTheme';
import { FontWeight } from '@/utils/Theme';

/** Register-only styles; the shared auth layout lives in ../shared/styles. */
export const styles = StyleSheet.create({
  existingAction: {
    marginTop: 12,
    height: ModernSize.controlSm + 4,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1.5,
    borderColor: LINK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  existingActionText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  // PasswordStrength carries its own bottom margin; pull it up under the field.
  strength: {
    marginTop: 8,
    marginBottom: -16,
  },
});
