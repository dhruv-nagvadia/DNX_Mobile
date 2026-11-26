import React from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { Home, CalendarDays, Bell, User, type LucideIcon } from 'lucide-react-native';

import { ROUTES, RootStackParamList } from './routes';
import { useOnboardingStatus } from './useOnboardingStatus';
import { styles } from './styles';
import { Color, FontWeight } from '@/utils/Theme';
import { LINK, PILL } from '@/utils/modernTheme';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import PrivacyPolicyScreen from '@/screens/legal/PrivacyPolicyScreen';
import TermsScreen from '@/screens/legal/TermsScreen';
import RefundPolicyScreen from '@/screens/legal/RefundPolicyScreen';
import HelpSupportScreen from '@/screens/profile/HelpSupportScreen';
import AboutScreen from '@/screens/profile/AboutScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import BookingsScreen from '@/screens/bookings/BookingsScreen';
import RemindersScreen from '@/screens/reminders/RemindersScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import CategoryScreen from '@/screens/category/CategoryScreen';
import AllCategoriesScreen from '@/screens/category/AllCategoriesScreen';
import ProductTypeScreen from '@/screens/category/ProductTypeScreen';
import AllProductTypesScreen from '@/screens/category/AllProductTypesScreen';
import AllBusinessesScreen from '@/screens/provider/AllBusinessesScreen';
import AllServicesScreen from '@/screens/services/AllServicesScreen';
import ProviderListScreen from '@/screens/provider/ProviderListScreen';
import ProviderDetailScreen from '@/screens/provider/ProviderDetailScreen';
import BookingSummaryScreen from '@/screens/bookings/BookingSummaryScreen';
import CouponsScreen from '@/screens/coupons/CouponsScreen';
import LocationPickerScreen from '@/screens/location/LocationPickerScreen';
import GalleryScreen from '@/screens/gallery/GalleryScreen';
import SearchScreen from '@/screens/search/SearchScreen';
import BookingDetailScreen from '@/screens/bookings/BookingDetailScreen';
import ReviewsScreen from '@/screens/reviews/ReviewsScreen';
import ProviderProductsScreen from '@/screens/provider/ProviderProductsScreen';
import AddReminderScreen from '@/screens/reminders/AddReminderScreen';
import CartScreen from '@/screens/cart/CartScreen';
import ProductDetailScreen from '@/screens/store/ProductDetailScreen';
import OrderDetailScreen from '@/screens/store/OrderDetailScreen';
import OrderSuccessScreen from '@/screens/orders/OrderSuccessScreen';
import CheckoutProcessingScreen from '@/screens/cart/CheckoutProcessingScreen';
import BookingProcessingScreen from '@/screens/bookings/BookingProcessingScreen';
import BookingSuccessScreen from '@/screens/bookings/BookingSuccessScreen';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';
import AddressesScreen from '@/screens/addresses/AddressesScreen';
import AddAddressScreen from '@/screens/addresses/AddAddressScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

/** Tab icon with a soft blue pill behind it when active (Home mockup). */
function tabIcon(Icon: LucideIcon) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <View style={[styles.tabIconWrap, focused && { backgroundColor: PILL.blue.bg }]}>
      <Icon color={color} size={22} strokeWidth={focused ? 2.2 : 1.9} />
    </View>
  );
}

// Built once so React sees a stable icon renderer per tab.
const HomeTabIcon = tabIcon(Home);
const BookingsTabIcon = tabIcon(CalendarDays);
const RemindersTabIcon = tabIcon(Bell);
const ProfileTabIcon = tabIcon(User);

/**
 * Tab button with no press feedback (the default one shows an Android ripple /
 * dimming). Selection is still shown by the active icon + label colour.
 */
function TabBarButton(props: BottomTabBarButtonProps) {
  // Drop the default button's feedback-only props so they don't reach the native view.
  const rest: Record<string, unknown> = { ...props };
  ['children', 'android_ripple', 'pressColor', 'pressOpacity', 'hoverEffect'].forEach((k) => {
    delete rest[k];
  });
  return (
    <Pressable {...(rest as PressableProps)} android_ripple={null}>
      {props.children as React.ReactNode}
    </Pressable>
  );
}

/** Bottom tabs for the signed-in customer: Home, Bookings, Reminders, Profile. */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarActiveTintColor: LINK,
        tabBarInactiveTintColor: Color.textSecondary,
        tabBarStyle: {
          backgroundColor: Color.surface,
          borderTopColor: Color.border,
          height: 90,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: FontWeight.semibold, marginTop: 4 },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: HomeTabIcon }}
      />
      <Tab.Screen
        name={ROUTES.BOOKINGS}
        component={BookingsScreen}
        options={{
          // One line, shrinking slightly on narrow phones rather than truncating.
          tabBarLabel: ({ color }) => (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={[styles.tabLabel, { color }]}
            >
              {/* SERVICES-ONLY: was "Bookings & Orders" — restore when orders return */}
              Bookings
            </Text>
          ),
          tabBarIcon: BookingsTabIcon,
        }}
      />
      <Tab.Screen
        name={ROUTES.REMINDERS}
        component={RemindersScreen}
        options={{ tabBarLabel: 'Reminders', tabBarIcon: RemindersTabIcon }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ProfileTabIcon }}
      />
    </Tab.Navigator>
  );
}

/** Screens available before login. */
export function AuthStack() {
  const onboarding = useOnboardingStatus();

  // Ink placeholder while the flag is read, so there's no white flash and no
  // flicker of the wrong first screen.
  if (onboarding === 'loading') {
    return <View style={styles.bootPlaceholder} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={onboarding === 'pending' ? ROUTES.ONBOARDING : ROUTES.LOGIN}
    >
      <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
      <Stack.Screen name={ROUTES.TERMS} component={TermsScreen} />
      <Stack.Screen name={ROUTES.REFUND_POLICY} component={RefundPolicyScreen} />
    </Stack.Navigator>
  );
}

/**
 * Screens available after login.
 *
 * The native-stack header is disabled everywhere — screens render the custom
 * <AppHeader> instead, which avoids the translucent "bubble" header iOS shows.
 */
export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Color.background },
      }}
    >
      <Stack.Screen name={ROUTES.TABS} component={TabNavigator} />
      <Stack.Screen name={ROUTES.CATEGORY} component={CategoryScreen} />
      <Stack.Screen name={ROUTES.ALL_CATEGORIES} component={AllCategoriesScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_TYPE} component={ProductTypeScreen} />
      <Stack.Screen name={ROUTES.ALL_PRODUCT_TYPES} component={AllProductTypesScreen} />
      <Stack.Screen name={ROUTES.ALL_BUSINESSES} component={AllBusinessesScreen} />
      <Stack.Screen name={ROUTES.ALL_SERVICES} component={AllServicesScreen} />
      <Stack.Screen name={ROUTES.PROVIDER_LIST} component={ProviderListScreen} />
      <Stack.Screen name={ROUTES.PROVIDER_DETAILS} component={ProviderDetailScreen} />
      <Stack.Screen name={ROUTES.BOOKING_SUMMARY} component={BookingSummaryScreen} />
      <Stack.Screen
        name={ROUTES.BOOKING_PROCESSING}
        component={BookingProcessingScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ROUTES.BOOKING_SUCCESS}
        component={BookingSuccessScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name={ROUTES.COUPONS} component={CouponsScreen} />
      <Stack.Screen name={ROUTES.LOCATION_PICKER} component={LocationPickerScreen} />
      <Stack.Screen name={ROUTES.GALLERY} component={GalleryScreen} />
      <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} />
      <Stack.Screen name={ROUTES.BOOKING_DETAILS} component={BookingDetailScreen} />
      <Stack.Screen name={ROUTES.REVIEWS} component={ReviewsScreen} />
      <Stack.Screen name={ROUTES.PROVIDER_PRODUCTS} component={ProviderProductsScreen} />
      <Stack.Screen name={ROUTES.ADD_REMINDER} component={AddReminderScreen} />
      <Stack.Screen name={ROUTES.CART} component={CartScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAILS} component={ProductDetailScreen} />
      <Stack.Screen name={ROUTES.ORDER_DETAILS} component={OrderDetailScreen} />
      <Stack.Screen
        name={ROUTES.CHECKOUT_PROCESSING}
        component={CheckoutProcessingScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ROUTES.ORDER_SUCCESS}
        component={OrderSuccessScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
      <Stack.Screen name={ROUTES.ADDRESSES} component={AddressesScreen} />
      <Stack.Screen name={ROUTES.ADD_ADDRESS} component={AddAddressScreen} />
      <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
      <Stack.Screen name={ROUTES.TERMS} component={TermsScreen} />
      <Stack.Screen name={ROUTES.REFUND_POLICY} component={RefundPolicyScreen} />
      <Stack.Screen name={ROUTES.HELP_SUPPORT} component={HelpSupportScreen} />
      <Stack.Screen name={ROUTES.ABOUT} component={AboutScreen} />
    </Stack.Navigator>
  );
}
