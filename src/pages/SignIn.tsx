import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SocialButton } from '../components/ui/SocialButton';
import { useAuthContext } from '../contexts/AuthContext';
import type { SignInData } from '../types/auth';

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, signInWithGoogle, signInWithFacebook, signInWithApple, isLoading, error, clearError, isAuthenticated } = useAuthContext();

    const [formData, setFormData] = useState<SignInData>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [formErrors, setFormErrors] = useState<Partial<SignInData>>({});
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
