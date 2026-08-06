import React from 'react';
import {
  Stethoscope,
  Scissors,
  Dumbbell,
  GraduationCap,
  Wrench,
  Car,
  Briefcase,
  Camera,
  Store,
  UtensilsCrossed,
  Landmark,
  Boxes,
  Building2,
  type LucideIcon,
} from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { CategoryIconProps } from './types';

const ICONS: Record<string, LucideIcon> = {
  healthcare: Stethoscope,
  beauty: Scissors,
  fitness: Dumbbell,
  education: GraduationCap,
  home: Wrench,
  automotive: Car,
  professional: Briefcase,
  events: Camera,
  retail: Store,
  food: UtensilsCrossed,
  government: Landmark,
  other: Boxes,
};

/** Professional (Lucide) icon for a category slug — mirrors the web app. */
export function CategoryIcon({ slug, size = 24, color = Color.primary, strokeWidth = 2 }: CategoryIconProps) {
  const Icon = ICONS[slug] ?? Building2;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
