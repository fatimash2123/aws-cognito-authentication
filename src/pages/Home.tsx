import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthContext } from '../contexts/AuthContext';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut, isLoading } = useAuthContext();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/signin');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">My App</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {user?.name || user?.email}
                            </span>
                            <Button
                                variant="outline"
                                onClick={handleSignOut}
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Welcome to your Dashboard
                        </h2>
                        <p className="text-lg text-gray-600">
                            You have successfully signed in to your account.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* User Profile Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Your account details and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        {user?.picture ? (
                                            <img
                                                src={user.picture}
                                                alt="Profile"
                                                className="h-12 w-12 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-primary font-semibold text-lg">
                                                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {user?.name || 'No name provided'}
                                            </p>
                                            <p className="text-sm text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.emailVerified
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {user?.emailVerified ? 'Email Verified' : 'Email Not Verified'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Common tasks and features
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Button className="w-full" variant="outline">
                                        Update Profile
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        Change Password
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        Account Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistics Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Statistics</CardTitle>
                                <CardDescription>
                                    Your account activity and status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Account Status</span>
                                        <span className="text-sm font-medium text-green-600">Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Member Since</span>
                                        <span className="text-sm font-medium text-gray-900">Today</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Last Sign In</span>
                                        <span className="text-sm font-medium text-gray-900">Just now</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Content */}
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Getting Started</CardTitle>
                                <CardDescription>
                                    Here are some next steps to help you get the most out of your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-primary font-semibold text-sm">1</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Complete your profile</h4>
                                            <p className="text-sm text-gray-600">
                                                Add your profile picture and personal information
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-primary font-semibold text-sm">2</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Explore features</h4>
                                            <p className="text-sm text-gray-600">
                                                Discover all the features available in your account
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-primary font-semibold text-sm">3</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Customize settings</h4>
                                            <p className="text-sm text-gray-600">
                                                Adjust your preferences and notification settings
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-primary font-semibold text-sm">4</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Get support</h4>
                                            <p className="text-sm text-gray-600">
                                                Contact our support team if you need any help
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
