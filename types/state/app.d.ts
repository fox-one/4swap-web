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
    currency: string;
    chartScheme: string;
    priceAlertCountDown: boolean;
  }

  export interface PayingState {
    visible: boolean;
    timer: number;
  }

  export interface AppState {
    contentClass: string;
    contentStyle: any;
    appbar: AppBarState;
    settings: SettingsState;
    paying: PayingState;
    appInfo: API.AppInfo | null;
    dark: boolean;
    bottomNav: string;
    initing: boolean;
  }
}
