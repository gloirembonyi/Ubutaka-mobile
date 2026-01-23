declare module '@expo/vector-icons' {
  import * as React from 'react';
  import { TextProps, ViewStyle, TextStyle } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  export class MaterialIcons extends React.Component<IconProps> {}
  export class Ionicons extends React.Component<IconProps> {}
  export class FontAwesome extends React.Component<IconProps> {}
  export class FontAwesome5 extends React.Component<IconProps> {}
  export class Entypo extends React.Component<IconProps> {}
  export class EvilIcons extends React.Component<IconProps> {}
  export class Feather extends React.Component<IconProps> {}
  export class Fontisto extends React.Component<IconProps> {}
  export class Foundation extends React.Component<IconProps> {}
  export class MaterialCommunityIcons extends React.Component<IconProps> {}
  export class Octicons extends React.Component<IconProps> {}
  export class SimpleLineIcons extends React.Component<IconProps> {}
  export class Zocial extends React.Component<IconProps> {}
}

declare module '@react-native-community/netinfo' {
  export interface NetInfoState {
    type: string;
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    isWifiEnabled?: boolean;
    details: any;
  }

  export interface NetInfoSubscription {
    (): void;
  }

  export function addEventListener(listener: (state: NetInfoState) => void): NetInfoSubscription;
  export function fetch(): Promise<NetInfoState>;
  export function useNetInfo(): NetInfoState;

  const NetInfo: {
    fetch: typeof fetch;
    addEventListener: typeof addEventListener;
    useNetInfo: typeof useNetInfo;
  };

  export default NetInfo;
}
