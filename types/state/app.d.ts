declare namespace State {
  export interface AppBarState {
    title: string;
    style: string;
    show: boolean;
    back: boolean;
    extension?: any;
    extensionHeight?: number;
  }

  export interface SettingsState {
    slippage: number;
    slippage_add: number;
    slippage_remove: number;
    currency: string;
    chartScheme: string;
    priceAlertCountDown: boolean;
  }

  export interface PayingState {
    visible: boolean;
    timer: number;
  }

  export interface AppState {
    version: number;
    contentClass: string;
    contentStyle: any;
    appbar: AppBarState;
    settings: SettingsState;
    paying: PayingState;
    appInfo: API.AppInfo | null;
    dark: boolean;
    bottomNav: string;
    initing: boolean;
    termsAccepted: boolean;
    termsVersion: string;
  }
}
