import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  signUp as amplifySignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import type { AuthState, SignUpData, SignInData } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const checkAuthState = useCallback(async () => {
    try {
      const user = await getCurrentUser();
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
      });
    } catch (error) {
      console.warn('Authentication check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    checkAuthState();

    const hubListener = Hub.listen('auth', ({ payload: { event, data } }) => {
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
          });
          break;
        case 'signUp':
          checkAuthState();
          break;
        case 'signIn_failure':
        case 'signUp_failure':
          setAuthState((prev) => ({
            ...prev,
            error: data?.message || 'Authentication failed',
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

      await amplifySignUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.name || '',
          },
        },
      });

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Sign up failed',
      }));
      throw error;
    }
  };

  const signIn = async (data: SignInData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      await amplifySignIn({
        username: data.email,
        password: data.password,
      });

      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Sign in failed',
      }));
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      await amplifySignOut();
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Sign out failed',
      }));
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      // For now, we'll redirect to the hosted UI for social authentication
      window.location.href = `${
        import.meta.env.VITE_OAUTH_DOMAIN
      }/oauth2/authorize?client_id=${
        import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID
      }&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
        import.meta.env.VITE_REDIRECT_SIGN_IN || 'http://localhost:5173/'
      )}&identity_provider=Google`;
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Google sign in failed',
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
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Facebook sign in failed',
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
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Apple sign in failed',
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    clearError,
  };
};
