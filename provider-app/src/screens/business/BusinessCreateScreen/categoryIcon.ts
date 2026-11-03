import {
  BookOpen,
  Briefcase,
  Cake,
  CalendarDays,
  Car,
  Command,
  Dumbbell,
  Flower2,
  Gift,
  House,
  Landmark,
  LayoutGrid,
  PawPrint,
  Pill,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Stethoscope,
  Store,
  Utensils,
  Wrench,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Category } from '@/redux/api/category/types';

/**
 * Display icon for a category tile, picked from keywords in the category's
 * real slug/name (categories carry no icon in the API data). Specific rules
 * come first ("Pharmacy & Medical Store" → pill before "medical" → clinic).
 */
const RULES: [RegExp, LucideIcon][] = [
  [/cosmetic/i, Sparkles],
  [/pharma/i, Pill],
  [/pet|garden/i, PawPrint],
  [/auto|car|vehicle/i, Car],
  [/furniture|hardware/i, Sofa],
  [/salon|hair|beauty|barber/i, Command],
  [/spa|wellness|massage/i, Flower2],
  [/health|clinic|medical|doctor/i, Stethoscope],
  [/fitness|gym|yoga/i, Dumbbell],
  [/education|coach|tuition|class/i, BookOpen],
  [/repair|plumb|electrician/i, Wrench],
  [/home/i, House],
  [/event|photo|wedding/i, CalendarDays],
  [/grocery|daily/i, ShoppingCart],
  [/fashion|apparel|cloth/i, Shirt],
  [/electronic|mobile/i, Smartphone],
  [/book|gift|stationery/i, Gift],
  [/bakery|sweet|cake/i, Cake],
  [/food|restaurant|hospitality|cafe/i, Utensils],
  [/government|document/i, Landmark],
  [/professional|legal|account/i, Briefcase],
  [/retail|store|shop/i, Store],
];

export function categoryIcon(category: Pick<Category, 'slug' | 'name'>): LucideIcon {
  const haystack = `${category.slug} ${category.name}`;
  const match = RULES.find(([re]) => re.test(haystack));
  return match ? match[1] : LayoutGrid;
}
