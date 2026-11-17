import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, INK } from '@/utils/modernTheme';

const BLUE = '#1D4ED8';
const MUTED = '#64748B';

/** Bottom-sheet calendar — mockup "DNX Reminder App UI Trio.png" (right frame). */
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Color.white,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: 14,
    backgroundColor: '#CBD5E1',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: FontWeight.medium,
    color: MUTED,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 3,
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 10,
  },
  daySelected: {
    backgroundColor: BLUE,
  },
  dayText: {
    fontSize: 16,
    color: INK,
  },
  dayTextMuted: {
    color: '#CBD5E1',
  },
  dayTextDisabled: {
    color: '#CBD5E1',
  },
  dayTextSelected: {
    color: Color.white,
    fontWeight: FontWeight.bold,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 6,
  },
  yearCell: {
    width: '33.333%',
    padding: 5,
  },
  yearBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  yearBtnActive: {
    borderColor: BLUE,
    backgroundColor: BLUE,
  },
  yearText: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  yearTextActive: {
    color: Color.white,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  quick: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  quickActive: {
    backgroundColor: '#DBEAFE',
  },
  quickOff: {
    opacity: 0.4,
  },
  quickText: {
    fontSize: 14,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  quickTextActive: {
    color: BLUE,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  setBtn: {
    flex: 1.4,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  setBtnOff: {
    backgroundColor: '#94A3B8',
  },
  setText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
