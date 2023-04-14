declare namespace API {
  export enum AuthMethod {
    MixinToken = "mixin_token",
    MVM = "mvm",
  }

  export interface AuthParams {
    method: AuthMethod;
    mixin_oauth_code?: string;
    mixin_token?: string;
    mvm_signed_message?: string;
    mvm_signature?: string;
    lang?: string;
    broker_id?: string;
    label?: string;
  }

  export interface Profile {
    avatar_url: string;
    full_name: string;
    identity_number: string;
    user_id: string;
  }

  export interface AuthResult {
    mvm_address: string;
    pando_token: string;
    scope: string;
    token: string;
    user: API.Profile;
  }

  export interface MixinUser {
    accept_conversation_source: string;
    accept_search_source: string;
    avatar_url: string;
    biography: string;
    code_id: string;
    code_url: string;
    created_at: string;
    device_status: string;
    fiat_currency: string;
    full_name: string;
    has_emergency_contact: boolean;
    has_pin: boolean;
    identity_number: string;
    is_scam: boolean;
    is_verified: boolean;
    mute_until: string;
    phone: string;
    pin_token: string;
    receive_message_source: string;
    relationship: string;
    session_id: string;
    transfer_confirmation_threshold: number;
    transfer_notification_threshold: number;
    type: string;
    user_id: string;
  }
}
