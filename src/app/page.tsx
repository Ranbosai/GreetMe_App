"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function CountdownTimer() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setCountdown(3);
  }, []);

  useEffect(() => {
    if (!mounted || countdown === null) return;

    if (countdown === 0) {
      router.push('/register');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, mounted, router]);

  // Don't render countdown until mounted to avoid hydration mismatch
  if (!mounted || countdown === null) {
    return null;
  }

  return (
    <div className="mt-8">
      <p className="text-sm text-gray-500">
        Redirecting to registration in <span className="font-semibold">{countdown} second{countdown !== 1 ? 's' : ''}</span>...
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">GreetMe</h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to the social media platform that connects you with the world
          </p>
          
          <div className="space-y-4">
            <Link
              href="/register"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Get Started - Register
            </Link>
            
            <Link
              href="/login"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Already have an account? Log In
            </Link>
          </div>
          
          <CountdownTimer />
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mt-16 max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect</h3>
            <p className="text-gray-600">Build meaningful connections with friends and family</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Share</h3>
            <p className="text-gray-600">Share your moments and experiences with the world</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover</h3>
            <p className="text-gray-600">Explore trending content and discover new interests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
