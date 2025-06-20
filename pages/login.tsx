import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import LoginForm from '../components/LoginForm';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate Clerk magic link sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would call your auth API here
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Simulate Google OAuth
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Sign In - Command Center</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm 
          onSubmit={handleSubmit}
          onGoogleSignIn={handleGoogleSignIn}
          loading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
} 