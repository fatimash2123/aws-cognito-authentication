import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SocialButton } from '../components/ui/SocialButton';
import { TotpQrCode } from '../components/TotpQrCode';
import { useAuthContext } from '../contexts/AuthContext';
import type { SignInData, TotpData } from '../types/auth';

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, confirmTotpCode, confirmTotpSetup, signInWithGoogle, signInWithFacebook, signInWithApple, isLoading, error, clearError, isAuthenticated, mfaChallenge, user } = useAuthContext();

    const [formData, setFormData] = useState<SignInData>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [totpData, setTotpData] = useState<TotpData>({
        code: '',
    });

    const [formErrors, setFormErrors] = useState<Partial<SignInData>>({});
    const [totpErrors, setTotpErrors] = useState<Partial<TotpData>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Show success message from navigation state
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [location.state]);

    const validateForm = (): boolean => {
        const errors: Partial<SignInData> = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateTotpForm = (): boolean => {
        const errors: Partial<TotpData> = {};

        if (!totpData.code) {
            errors.code = 'TOTP code is required';
        } else if (!/^\d{6}$/.test(totpData.code)) {
            errors.code = 'TOTP code must be 6 digits';
        }

        setTotpErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSuccessMessage('');

        if (!validateForm()) return;

        try {
            await signIn(formData);
            navigate('/');
        } catch (error) {
            console.error('Sign in error:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (formErrors[name as keyof SignInData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleTotpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTotpData(prev => ({ ...prev, code: value }));

        // Clear error when user starts typing
        if (totpErrors.code) {
            setTotpErrors(prev => ({ ...prev, code: undefined }));
        }
    };

    const handleTotpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSuccessMessage('');

        if (!validateTotpForm()) return;

        try {
            await confirmTotpCode(totpData);
            navigate('/');
        } catch (error) {
            console.error('TOTP verification error:', error);
        }
    };

    const handleTotpSetupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSuccessMessage('');

        if (!validateTotpForm()) return;

        try {
            await confirmTotpSetup(totpData);
            navigate('/');
        } catch (error) {
            console.error('TOTP setup error:', error);
        }
    };

    const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
        clearError();
        setSuccessMessage('');
        try {
            switch (provider) {
                case 'google':
                    await signInWithGoogle();
                    break;
                case 'facebook':
                    await signInWithFacebook();
                    break;
                case 'apple':
                    await signInWithApple();
                    break;
            }
        } catch (error) {
            console.error(`${provider} sign in error:`, error);
        }
    };

    // Show TOTP setup form if TOTP setup is required
    if (mfaChallenge?.step === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Setup Two-Factor Authentication</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Complete your account security setup
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Setup TOTP</CardTitle>
                            <CardDescription>
                                Scan the QR code with your authenticator app, then enter the verification code to complete setup
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {mfaChallenge.sharedSecret && (
                                <div className="space-y-4">
                                    <TotpQrCode
                                        secret={mfaChallenge.sharedSecret}
                                        email={user?.email || formData.email}
                                        issuer="Cognito App"
                                        size={200}
                                    />

                                    <div className="text-center">
                                        <details className="text-sm">
                                            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                                                Can't scan QR code? Show secret key
                                            </summary>
                                            <div className="mt-2 p-3 bg-gray-50 rounded">
                                                <strong>Secret Key:</strong>
                                                <code className="block mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                                                    {mfaChallenge.sharedSecret}
                                                </code>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Manually enter this key into your authenticator app
                                                </p>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleTotpSetupSubmit} className="space-y-4">
                                <Input
                                    label="Verification Code"
                                    type="text"
                                    name="code"
                                    value={totpData.code}
                                    onChange={handleTotpInputChange}
                                    error={totpErrors.code}
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    Complete Setup
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Show TOTP challenge form if MFA is required
    if (mfaChallenge?.step === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Two-Factor Authentication</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter the 6-digit code from your authenticator app
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Verify TOTP Code</CardTitle>
                            <CardDescription>
                                Please enter the verification code from your authenticator app
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleTotpSubmit} className="space-y-4">
                                <Input
                                    label="TOTP Code"
                                    type="text"
                                    name="code"
                                    value={totpData.code}
                                    onChange={handleTotpInputChange}
                                    error={totpErrors.code}
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    Verify Code
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign in</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {successMessage && (
                            <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
                                {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={formErrors.email}
                                placeholder="Enter your email"
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                error={formErrors.password}
                                placeholder="Enter your password"
                                required
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link
                                        to="/forgot-password"
                                        className="font-medium text-primary hover:text-primary/80"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <SocialButton
                                provider="google"
                                onClick={() => handleSocialSignIn('google')}
                                isLoading={isLoading}
                                disabled={isLoading}
                            />
                            <SocialButton
                                provider="facebook"
                                onClick={() => handleSocialSignIn('facebook')}
                                isLoading={isLoading}
                                disabled={isLoading}
                            />
                            <SocialButton
                                provider="apple"
                                onClick={() => handleSocialSignIn('apple')}
                                isLoading={isLoading}
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SignIn;
