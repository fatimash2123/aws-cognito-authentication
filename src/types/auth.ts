export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaChallenge: MfaChallenge | null;
  signUpChallenge: SignUpChallenge | null;
}

export interface MfaChallenge {
  type: 'TOTP_CODE' | 'TOTP_SETUP';
  step: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' | 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP';
  sharedSecret?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface TotpData {
  code: string;
}

export interface SignUpChallenge {
  type: 'EMAIL_VERIFICATION';
  step: 'CONFIRM_SIGN_UP';
  username: string;
  destination: string;
  deliveryMedium: string;
  attributeName: string;
}

export interface ConfirmSignUpData {
  email: string;
  code: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple';
