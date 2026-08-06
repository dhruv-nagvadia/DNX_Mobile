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

  return {
    categorySlug: params.slug,
    subcategories: category?.subcategories ?? [],
    isLoading,
    onSubcategoryPress,
  };
}
