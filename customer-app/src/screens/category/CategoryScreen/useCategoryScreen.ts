import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { Subcategory } from '@/redux/api/category/types';
import { ROUTES } from '@/navigation/routes';
import { CategoryScreenNavigationProp, CategoryScreenRouteProp } from './types';

/** Loads a category's business types (subcategories). */
export function useCategoryScreen() {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { params } = useRoute<CategoryScreenRouteProp>();

  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const category = categories.find((c) => c.slug === params.slug);

  const onSubcategoryPress = useCallback(
    (sub: Subcategory) => {
      navigation.navigate(ROUTES.PROVIDER_LIST, {
        categorySlug: params.slug,
        subcategorySlug: sub.slug,
        title: sub.name,
      });
    },
    [navigation, params.slug],
  );

  const isStore = category?.type === 'STORE';

  return {
    title: params.name,
    categorySlug: params.slug,
    subcategories: category?.subcategories ?? [],
    isLoading,
    isStore,
    lead: isStore ? 'Choose what you’re shopping for' : 'Choose the service you need',
    emptyText: isStore ? 'No store types here yet.' : 'No service types here yet.',
    onSubcategoryPress,
  };
}
