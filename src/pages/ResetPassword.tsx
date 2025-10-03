import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthContext } from '../contexts/AuthContext';
import type { ResetPasswordData } from '../types/auth';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPasswordWithCode, isLoading, error, clearError } = useAuthContext();

    const [formData, setFormData] = useState<ResetPasswordData>({
        email: '',
        code: '',
        newPassword: '',
    });

    const [formErrors, setFormErrors] = useState<Partial<ResetPasswordData>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Get email from URL parameters if available
    useEffect(() => {
        const email = searchParams.get('email');
        if (email) {
            setFormData(prev => ({ ...prev, email }));
        }
    }, [searchParams]);

    const validateForm = (): boolean => {
        const errors: Partial<ResetPasswordData> = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.code) {
            errors.code = 'Reset code is required';
        } else if (!/^\d{6}$/.test(formData.code)) {
            errors.code = 'Reset code must be 6 digits';
        }

        if (!formData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters long';
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
            await resetPasswordWithCode(formData);
            setSuccessMessage('Password has been reset successfully! You can now sign in with your new password.');
            setTimeout(() => {
                navigate('/signin', {
                    state: { message: 'Password reset successful! Please sign in with your new password.' }
                });
            }, 2000);
        } catch (error) {
            console.error('Reset password error:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name as keyof ResetPasswordData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Reset your password</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the code sent to your email and your new password
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            Enter the 6-digit code from your email and your new password
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

                            <Input
                                label="Reset Code"
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                error={formErrors.code}
                                placeholder="000000"
                                maxLength={6}
                                required
                            />

                            <Input
                                label="New Password"
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                error={formErrors.newPassword}
                                placeholder="Enter your new password"
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Reset Password
                            </Button>
                        </form>

                        <div className="text-center space-y-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-primary hover:text-primary/80"
                            >
                                Didn't receive a code? Request again
                            </Link>
                            <div>
                                <Link
                                    to="/signin"
                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
