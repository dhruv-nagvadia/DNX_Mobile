// Types for react-native-config so `Config.BASE_URL` is typed.
declare module 'react-native-config' {
  export interface NativeConfig {
    BASE_URL: string;
    ENV: 'development' | 'staging' | 'production';
  }
  export const Config: NativeConfig;
  export default Config;
}
