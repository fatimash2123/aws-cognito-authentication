import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AuthState, SignUpData, SignInData, TotpData, ConfirmSignUpData, ForgotPasswordData, ResetPasswordData } from '../types/auth';

interface AuthContextType extends AuthState {
    signUp: (data: SignUpData) => Promise<void>;
    signIn: (data: SignInData) => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithFacebook: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    confirmTotpCode: (data: TotpData) => Promise<void>;
    confirmTotpSetup: (data: TotpData) => Promise<void>;
    confirmSignUp: (data: ConfirmSignUpData) => Promise<void>;
    forgotPassword: (data: ForgotPasswordData) => Promise<void>;
    resetPasswordWithCode: (data: ResetPasswordData) => Promise<void>;
    clearError: () => void;
    clearSignUpChallenge: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
