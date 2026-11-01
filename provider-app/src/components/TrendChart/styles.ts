import { StyleSheet } from 'react-native';
import { Color, FontSize } from '@/utils/Theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  axis: {
    width: 36,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  axisLabel: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    textAlign: 'right',
  },
  plot: {
    flex: 1,
    marginLeft: 6,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 42,
  },
  xLabel: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  emptyCaption: {
    marginTop: 6,
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    textAlign: 'center',
  },
});
