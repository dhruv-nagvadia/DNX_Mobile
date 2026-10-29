import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ReviewsNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type ReviewsRouteProp = RouteProp<RootStackParamList, 'ReviewsScreen'>;
