import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CalendarDays, Bell, User } from 'lucide-react-native';

import { ROUTES, RootStackParamList } from './routes';
import { useOnboardingStatus } from './useOnboardingStatus';
import { styles } from './styles';
import { Color, FontWeight } from '@/utils/Theme';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import OnboardingScreen from '@/screens/onboarding/OnboardingScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import BookingsScreen from '@/screens/bookings/BookingsScreen';
import RemindersScreen from '@/screens/reminders/RemindersScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import CategoryScreen from '@/screens/category/CategoryScreen';
import ProviderListScreen from '@/screens/provider/ProviderListScreen';
import ProviderDetailScreen from '@/screens/provider/ProviderDetailScreen';
import BookingSummaryScreen from '@/screens/bookings/BookingSummaryScreen';
import CouponsScreen from '@/screens/coupons/CouponsScreen';
import LocationPickerScreen from '@/screens/location/LocationPickerScreen';
import GalleryScreen from '@/screens/gallery/GalleryScreen';
import SearchScreen from '@/screens/search/SearchScreen';
import BookingDetailScreen from '@/screens/bookings/BookingDetailScreen';
import ReviewsScreen from '@/screens/reviews/ReviewsScreen';
import AddReminderScreen from '@/screens/reminders/AddReminderScreen';
import CartScreen from '@/screens/cart/CartScreen';
import ProductDetailScreen from '@/screens/store/ProductDetailScreen';
import OrderDetailScreen from '@/screens/store/OrderDetailScreen';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';
import DebugLogsScreen from '@/screens/debug/DebugLogsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

/** Bottom tabs for the signed-in customer: Home, Bookings, Reminders, Profile. */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Color.primary,
        tabBarInactiveTintColor: Color.textSecondary,
        tabBarStyle: {
          backgroundColor: Color.surface,
          borderTopColor: Color.border,
          height: 88,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: FontWeight.semibold },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tab.Screen
        name={ROUTES.BOOKINGS}
        component={BookingsScreen}
        options={{
          // Two-line label so it isn't truncated ("Bookings &" / "Orders").
          tabBarLabel: ({ color }) => (
            <Text
              numberOfLines={2}
              style={{ color, fontSize: 10, fontWeight: FontWeight.semibold, textAlign: 'center' }}
            >
              Bookings &{'\n'}Orders
            </Text>
          ),
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.REMINDERS}
        component={RemindersScreen}
        options={{ tabBarLabel: 'Reminders', tabBarIcon: ({ color, size }) => <Bell color={color} size={size} /> }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
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
      <Stack.Screen name={ROUTES.PROVIDER_LIST} component={ProviderListScreen} />
      <Stack.Screen name={ROUTES.PROVIDER_DETAILS} component={ProviderDetailScreen} />
      <Stack.Screen name={ROUTES.BOOKING_SUMMARY} component={BookingSummaryScreen} />
      <Stack.Screen name={ROUTES.COUPONS} component={CouponsScreen} />
      <Stack.Screen name={ROUTES.LOCATION_PICKER} component={LocationPickerScreen} />
      <Stack.Screen name={ROUTES.GALLERY} component={GalleryScreen} />
      <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} />
      <Stack.Screen name={ROUTES.BOOKING_DETAILS} component={BookingDetailScreen} />
      <Stack.Screen name={ROUTES.REVIEWS} component={ReviewsScreen} />
      <Stack.Screen name={ROUTES.ADD_REMINDER} component={AddReminderScreen} />
      <Stack.Screen name={ROUTES.CART} component={CartScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_DETAILS} component={ProductDetailScreen} />
      <Stack.Screen name={ROUTES.ORDER_DETAILS} component={OrderDetailScreen} />
      <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
      <Stack.Screen name={ROUTES.DEBUG_LOGS} component={DebugLogsScreen} />
    </Stack.Navigator>
  );
}
