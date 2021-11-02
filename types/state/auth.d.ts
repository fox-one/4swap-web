declare namespace State {
  export interface AuthState {
    token: string;
    scope: string;
    channel: string;
  }
}
