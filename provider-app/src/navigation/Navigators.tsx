import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Briefcase, CalendarDays, Home, User, Wallet } from 'lucide-react-native';

import { ROUTES, RootStackParamList } from './routes';
import { Color, FontWeight } from '@/utils/Theme';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import BookingsOrdersScreen from '@/screens/bookingsOrders/BookingsOrdersScreen';
import BusinessesScreen from '@/screens/business/BusinessesScreen';
import BusinessDetailScreen from '@/screens/business/BusinessDetailScreen';
import BusinessHoursScreen from '@/screens/business/BusinessHoursScreen';
import BusinessCalendarScreen from '@/screens/business/BusinessCalendarScreen';
import BusinessEditScreen from '@/screens/business/BusinessEditScreen';
import ServicesScreen from '@/screens/catalog/ServicesScreen';
import ServiceFormScreen from '@/screens/catalog/ServiceFormScreen';
import ProductsScreen from '@/screens/catalog/ProductsScreen';
import ProductFormScreen from '@/screens/catalog/ProductFormScreen';
import StockScreen from '@/screens/catalog/StockScreen';
import CouponsScreen from '@/screens/catalog/CouponsScreen';
import CouponFormScreen from '@/screens/catalog/CouponFormScreen';
import ReviewsScreen from '@/screens/reviews/ReviewsScreen';
import EarningsScreen from '@/screens/earnings/EarningsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

/** Screens available before login. */
export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.LOGIN}>
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

/** Bottom tabs for the signed-in provider: Home, Bookings & Orders, Businesses,
 * Earnings, Profile. */
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
        name={ROUTES.BOOKINGS_ORDERS}
        component={BookingsOrdersScreen}
        options={{
          tabBarLabel: 'Bookings & Orders',
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.BUSINESSES}
        component={BusinessesScreen}
        options={{
          tabBarLabel: 'Businesses',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.EARNINGS}
        component={EarningsScreen}
        options={{
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

/** Screens available after login. */
export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Color.background },
      }}
    >
      <Stack.Screen name={ROUTES.TABS} component={TabNavigator} />
      <Stack.Screen name={ROUTES.BUSINESS_DETAIL} component={BusinessDetailScreen} />
      <Stack.Screen name={ROUTES.BUSINESS_HOURS} component={BusinessHoursScreen} />
      <Stack.Screen name={ROUTES.BUSINESS_CALENDAR} component={BusinessCalendarScreen} />
      <Stack.Screen name={ROUTES.BUSINESS_EDIT} component={BusinessEditScreen} />
      <Stack.Screen name={ROUTES.SERVICES} component={ServicesScreen} />
      <Stack.Screen name={ROUTES.SERVICE_FORM} component={ServiceFormScreen} />
      <Stack.Screen name={ROUTES.PRODUCTS} component={ProductsScreen} />
      <Stack.Screen name={ROUTES.PRODUCT_FORM} component={ProductFormScreen} />
      <Stack.Screen name={ROUTES.STOCK} component={StockScreen} />
      <Stack.Screen name={ROUTES.COUPONS} component={CouponsScreen} />
      <Stack.Screen name={ROUTES.COUPON_FORM} component={CouponFormScreen} />
      <Stack.Screen name={ROUTES.REVIEWS} component={ReviewsScreen} />
      <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
