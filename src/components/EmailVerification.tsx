import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuthContext } from '../contexts/AuthContext';

interface EmailVerificationProps {
    username: string;
    destination: string;
    onSuccess: () => void;
    onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
    username,
    destination,
    onSuccess,
    onBack,
}) => {
    const { confirmSignUp, isLoading, error, clearError } = useAuthContext();
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');

    const validateCode = (): boolean => {
        if (!code.trim()) {
            setCodeError('Verification code is required');
            return false;
        }
        if (code.length < 6) {
            setCodeError('Verification code must be at least 6 characters');
            return false;
        }
        setCodeError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateCode()) return;

        try {
            await confirmSignUp({
                email: username, // username is the email in this case
                code,
            });
            onSuccess();
        } catch (error) {
            console.error('Email verification error:', error);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCode(value);

        // Clear error when user starts typing
        if (codeError) {
            setCodeError('');
        }
    };

    const maskEmail = (email: string) => {
        const [local, domain] = email.split('@');
        const maskedLocal = local.length > 2
            ? local.substring(0, 2) + '*'.repeat(local.length - 2)
            : '*'.repeat(local.length);
        return `${maskedLocal}@${domain}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Verify your email</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        We've sent a verification code to your email address
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter verification code</CardTitle>
                        <CardDescription>
                            Please enter the 6-digit code sent to{' '}
                            <span className="font-medium text-gray-900">
                                {maskEmail(destination)}
                            </span>
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
                                label="Verification Code"
                                type="text"
                                value={code}
                                onChange={handleCodeChange}
                                error={codeError}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                required
                            />

                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    Verify Email
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={onBack}
                                    disabled={isLoading}
                                >
                                    Back to Sign Up
                                </Button>
                            </div>
                        </form>

                        <div className="text-center text-sm text-gray-600">
                            <p>
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    className="text-primary hover:text-primary/80 font-medium"
                                    onClick={() => {
                                        // Resend functionality can be implemented later if needed
                                        alert('Resend functionality not yet implemented');
                                    }}
                                >
                                    Resend code
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmailVerification;
