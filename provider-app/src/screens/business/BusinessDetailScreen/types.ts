import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type BusinessDetailRouteProp = RouteProp<RootStackParamList, 'BusinessDetailScreen'>;
export type BusinessDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BusinessDetailScreen'>;
