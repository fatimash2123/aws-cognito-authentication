import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthContext } from '../contexts/AuthContext';
import type { ForgotPasswordData } from '../types/auth';

const ForgotPassword: React.FC = () => {
    const { forgotPassword, isLoading, error, clearError } = useAuthContext();

    const [formData, setFormData] = useState<ForgotPasswordData>({
        email: '',
    });

    const [formErrors, setFormErrors] = useState<Partial<ForgotPasswordData>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');

    const validateForm = (): boolean => {
        const errors: Partial<ForgotPasswordData> = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
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
            await forgotPassword(formData);
            setSuccessMessage('Password reset code has been sent to your email address.');
        } catch (error) {
            console.error('Forgot password error:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name as keyof ForgotPasswordData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Forgot your password?</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        No worries! Enter your email address and we'll send you a reset code.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email address to receive a password reset code
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
                                placeholder="Enter your email address"
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Send Reset Code
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link
                                to="/signin"
                                className="text-sm font-medium text-primary hover:text-primary/80"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
