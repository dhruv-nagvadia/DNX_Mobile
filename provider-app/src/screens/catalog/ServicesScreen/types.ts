import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/routes';

export type ServicesRouteProp = RouteProp<RootStackParamList, 'ServicesScreen'>;
export type ServicesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ServicesScreen'>;
