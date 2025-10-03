import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  signUp as amplifySignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signInWithRedirect,
  confirmSignIn,
  confirmSignUp as amplifyConfirmSignUp,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import type {
  AuthState,
  SignUpData,
  SignInData,
  TotpData,
  ConfirmSignUpData,
  ForgotPasswordData,
  ResetPasswordData,
} from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    mfaChallenge: null,
    signUpChallenge: null,
  });

  const checkAuthState = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      console.log('current user===========', user);
      setAuthState({
        user: {
          id: user.userId,
          email: user.signInDetails?.loginId || '',
          name: user.username || '',
          picture: undefined,
          emailVerified: true,
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        mfaChallenge: null,
        signUpChallenge: null,
      });
    } catch (error) {
      console.warn('Authentication check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        mfaChallenge: null,
        signUpChallenge: null,
      });
    }
  }, []);

  useEffect(() => {
    checkAuthState();

    const hubListener = Hub.listen('auth', ({ payload }) => {
      console.log('Hub event:', payload);
      const { event } = payload;
      switch (event) {
        case 'signedIn':
          checkAuthState();
          break;
        case 'signedOut':
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            mfaChallenge: null,
            signUpChallenge: null,
          });
          break;
        case 'signInWithRedirect':
          checkAuthState();
          break;
        case 'signInWithRedirect_failure':
        case 'tokenRefresh_failure':
          setAuthState((prev) => ({
            ...prev,
            error: 'Authentication failed',
            isLoading: false,
          }));
          break;
        default:
          break;
      }
    });

    return () => hubListener();
  }, [checkAuthState]);

  const signUp = async (data: SignUpData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { isSignUpComplete, nextStep } = await amplifySignUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.name || '',
          },
        },
      });
      console.log('isSignUpComplete==', isSignUpComplete);
      console.log('nextStep==', nextStep);

      // Handle email verification step
      if (!isSignUpComplete && nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          signUpChallenge: {
            type: 'EMAIL_VERIFICATION',
            step: 'CONFIRM_SIGN_UP',
            username: data.email,
            destination: nextStep.codeDeliveryDetails?.destination || '',
            deliveryMedium: nextStep.codeDeliveryDetails?.deliveryMedium || '',
            attributeName: nextStep.codeDeliveryDetails?.attributeName || '',
          },
        }));
        return;
      }

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }));
      throw error;
    }
  };

  const signIn = async (data: SignInData): Promise<void> => {
    try {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        mfaChallenge: null,
      }));

      const { nextStep } = await amplifySignIn({
        username: data.email,
        password: data.password,
      });
      console.log('nextStep', nextStep);

      // Handle MFA challenge
      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          mfaChallenge: {
            type: 'TOTP_CODE',
            step: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE',
          },
        }));
        return;
      }

      // Handle TOTP setup challenge
      if (nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP') {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          mfaChallenge: {
            type: 'TOTP_SETUP',
            step: 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP',
            sharedSecret: nextStep.totpSetupDetails?.sharedSecret,
          },
        }));
        return;
      }

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
        mfaChallenge: null,
      }));
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      await amplifySignOut();
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }));
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    console.log('signInWithGoogle');
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      // For now, we'll redirect to the hosted UI for social authentication
      // window.location.href = `${
      //   import.meta.env.VITE_OAUTH_DOMAIN
      // }/oauth2/authorize?client_id=${
      //   import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID
      // }&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      //   import.meta.env.VITE_REDIRECT_SIGN_IN || 'http://localhost:5173/'
      // )}&identity_provider=Google`;
      await signInWithRedirect({
        provider: 'Google',
      });
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Google sign in failed',
      }));
      throw error;
    }
  };

  const signInWithFacebook = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      // For now, we'll redirect to the hosted UI for social authentication
      window.location.href = `${
        import.meta.env.VITE_OAUTH_DOMAIN
      }/oauth2/authorize?client_id=${
        import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID
      }&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
        import.meta.env.VITE_REDIRECT_SIGN_IN || 'http://localhost:5173/'
      )}&identity_provider=Facebook`;
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Facebook sign in failed',
      }));
      throw error;
    }
  };

  const signInWithApple = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      // For now, we'll redirect to the hosted UI for social authentication
      window.location.href = `${
        import.meta.env.VITE_OAUTH_DOMAIN
      }/oauth2/authorize?client_id=${
        import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID
      }&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
        import.meta.env.VITE_REDIRECT_SIGN_IN || 'http://localhost:5173/'
      )}&identity_provider=Apple`;
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Apple sign in failed',
      }));
      throw error;
    }
  };

  const confirmTotpCode = async (data: TotpData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      await confirmSignIn({
        challengeResponse: data.code,
      });

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        mfaChallenge: null,
      }));
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'TOTP verification failed',
      }));
      throw error;
    }
  };

  const confirmTotpSetup = async (data: TotpData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      await confirmSignIn({
        challengeResponse: data.code,
      });

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        mfaChallenge: null,
      }));
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'TOTP setup failed',
      }));
      throw error;
    }
  };

  const confirmSignUp = async (data: ConfirmSignUpData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const { isSignUpComplete } = await amplifyConfirmSignUp({
        username: data.email, // In this case, email is the username
        confirmationCode: data.code,
      });

      if (isSignUpComplete) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          signUpChallenge: null,
        }));
      }
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Email verification failed',
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const clearSignUpChallenge = () => {
    setAuthState((prev) => ({ ...prev, signUpChallenge: null }));
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      await resetPassword({ username: data.email });

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to send reset code',
      }));
      throw error;
    }
  };

  const resetPasswordWithCode = async (
    data: ResetPasswordData
  ): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      await confirmResetPassword({
        username: data.email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to reset password',
      }));
      throw error;
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    confirmTotpCode,
    confirmTotpSetup,
    confirmSignUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    forgotPassword,
    resetPasswordWithCode,
    clearError,
    clearSignUpChallenge,
  };
};
