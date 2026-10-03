import React from 'react';
import {
  Carrot,
  Egg,
  Fish,
  Wheat,
  Cookie,
  Coffee,
  Croissant,
  Snowflake,
  Droplet,
  Sparkles,
  SprayCan,
  Smile,
  Gem,
  CookingPot,
  Armchair,
  Hammer,
  Baby,
  PawPrint,
  HeartPulse,
  Shirt,
  Footprints,
  Watch,
  Smartphone,
  Cpu,
  CarFront,
  PenTool,
  BookOpen,
  Gift,
  Package,
  type LucideIcon,
} from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { ProductTypeIconProps } from './types';

const ICONS: Record<string, LucideIcon> = {
  'fruits-vegetables': Carrot,
  'dairy-eggs': Egg,
  'meat-fish': Fish,
  staples: Wheat,
  snacks: Cookie,
  beverages: Coffee,
  bakery: Croissant,
  'frozen-food': Snowflake,
  'bath-body': Droplet,
  'hair-care': Sparkles,
  'skin-care': SprayCan,
  'oral-care': Smile,
  grooming: Sparkles,
  'cosmetics-makeup': Gem,
  cleaning: SprayCan,
  'kitchen-dining': CookingPot,
  'home-furnishing': Armchair,
  'hardware-tools': Hammer,
  'baby-care': Baby,
  'pet-garden-care': PawPrint,
  'health-wellness': HeartPulse,
  'mens-fashion': Shirt,
  'womens-fashion': Shirt,
  footwear: Footprints,
  'fashion-accessories': Watch,
  'mobile-accessories': Smartphone,
  'electronics-gadgets': Cpu,
  'auto-parts': CarFront,
  stationery: PenTool,
  books: BookOpen,
  'gifts-toys': Gift,
};

/** Icon for a product-type slug (e.g. "bath-body") — the "shop by product" grid. */
export function ProductTypeIcon({
  slug,
  size = 24,
  color = Color.primary,
  strokeWidth = 2,
}: ProductTypeIconProps) {
  const Icon = ICONS[slug] ?? Package;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
