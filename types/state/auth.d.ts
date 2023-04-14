declare namespace State {
  export interface AuthState {
    mixin_token: string;
    token: string;
    scope: string;
    channel: string;
  }
}
