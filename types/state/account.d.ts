declare namespace State {
  export interface AccountState {
    profile: API.MixinUser | null;
    assets: API.MixinAsset[];
  }
}
