import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SocialButton } from '../components/ui/SocialButton';
import EmailVerification from '../components/EmailVerification';
import { useAuthContext } from '../contexts/AuthContext';
import type { SignUpData } from '../types/auth';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const { signUp, signInWithGoogle, signInWithFacebook, signInWithApple, isLoading, error, clearError, signUpChallenge, clearSignUpChallenge } = useAuthContext();

    const [formData, setFormData] = useState<SignUpData>({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });

    const [formErrors, setFormErrors] = useState<Partial<SignUpData>>({});

    const validateForm = (): boolean => {
        const errors: Partial<SignUpData> = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.name) {
            errors.name = 'Name is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) return;

        try {
            await signUp(formData);
            // Don't navigate immediately - wait for email verification
        } catch (error) {
            console.error('Sign up error:', error);
        }
    };

    const handleVerificationSuccess = () => {
        navigate('/signin', { state: { message: 'Account created and verified successfully! Please sign in.' } });
    };

    const handleBackToSignUp = () => {
        clearSignUpChallenge();
        clearError();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (formErrors[name as keyof SignUpData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSocialSignUp = async (provider: 'google' | 'facebook' | 'apple') => {
        clearError();
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
            console.error(`${provider} sign up error:`, error);
        }
    };

    // Show email verification if signup challenge exists
    if (signUpChallenge) {
        return (
            <EmailVerification
                username={signUpChallenge.username}
                destination={signUpChallenge.destination}
                onSuccess={handleVerificationSuccess}
                onBack={handleBackToSignUp}
            />
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/signin"
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign up</CardTitle>
                        <CardDescription>
                            Enter your information to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Full Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={formErrors.name}
                                placeholder="Enter your full name"
                                required
                            />

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
                                placeholder="Create a password"
                                helperText="Must be at least 8 characters"
                                required
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                error={formErrors.confirmPassword}
                                placeholder="Confirm your password"
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Create Account
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
                                onClick={() => handleSocialSignUp('google')}
                                isLoading={isLoading}
                                disabled={isLoading}
                            />
                            <SocialButton
                                provider="facebook"
                                onClick={() => handleSocialSignUp('facebook')}
                                isLoading={isLoading}
                                disabled={isLoading}
                            />
                            <SocialButton
                                provider="apple"
                                onClick={() => handleSocialSignUp('apple')}
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

export default SignUp;
