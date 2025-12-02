/* eslint-disable react-hooks/exhaustive-deps */
// FILE: app/login/page.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle,
  Loader,
  CheckCircle
} from 'lucide-react';

/**
 * Form state interface for managing input values
 */
interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Error state interface for managing validation and API errors
 */
interface ErrorState {
  field?: 'email' | 'password' | 'general';
  message: string;
}

/**
 * Admin Login Page Component
 * Handles authentication for administrators
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'admin';

  // Form state management
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // UI state management
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Reset error when user starts typing
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [formData.email, formData.password]);

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns true if valid email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate form inputs
   * @returns true if all validations pass
   */
  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError({ field: 'email', message: 'Email is required' });
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError({ field: 'email', message: 'Please enter a valid email address' });
      return false;
    }

    if (!formData.password) {
      setError({ field: 'password', message: 'Password is required' });
      return false;
    }

    if (formData.password.length < 6) {
      setError({ field: 'password', message: 'Password must be at least 6 characters' });
      return false;
    }

    return true;
  };

  /**
   * Handle login form submission
   * TODO: BACKEND REQUIRED - Implement authentication
   * 
   * Backend Implementation Steps:
   * 1. Create POST /api/auth/login endpoint
   * 2. Accept: { email, password, role }
   * 3. Validate credentials against database
   * 4. If valid:
   *    - Generate JWT token
   *    - Set httpOnly cookie with token
   *    - Return: { success: true, user: { id, name, email, role }, token }
   * 5. If invalid:
   *    - Return: { success: false, message: 'Invalid credentials' }
   * 6. Handle password reset flow separately
   * 
   * Example Request:
   * POST /api/auth/login
   * Content-Type: application/json
   * {
   *   "email": "admin@jisuniversity.edu",
   *   "password": "securePassword123",
   *   "role": "admin"
   * }
   * 
   * Example Success Response:
   * {
   *   "success": true,
   *   "user": {
   *     "id": "admin_123",
   *     "name": "Admin User",
   *     "email": "admin@jisuniversity.edu",
   *     "role": "admin"
   *   },
   *   "token": "eyJhbGciOiJIUzI1NiIs..."
   * }
   */
  const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: BACKEND REQUIRED - Make API call to login endpoint
      // Uncomment and implement below:
      /*
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role,
        }),
        credentials: 'include', // Include cookies in request
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError({
          field: 'general',
          message: data.message || 'Login failed. Please try again.',
        });
        setIsLoading(false);
        return;
      }

      // TODO: BACKEND REQUIRED - Store authentication token
      // Implementation:
      // 1. Store token in localStorage (if not using httpOnly cookie)
      // 2. Store token in sessionStorage for additional security
      // 3. Set token in global auth context or state management
      //
      // Example:
      // if (data.token) {
      //   localStorage.setItem('authToken', data.token);
      //   // Optionally store user info
      //   localStorage.setItem('user', JSON.stringify(data.user));
      // }
      
      // Show success message
      setSuccessMessage(`Welcome, ${data.user.name}! Redirecting to dashboard...`);

      // TODO: BACKEND REQUIRED - Redirect to dashboard based on role
      // Redirect to role-specific dashboard after login
      // setTimeout(() => {
      //   router.push('/admin-dashboard');
      // }, 1500);
      */

      // Temporary mock implementation for frontend testing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Login successful! Redirecting to dashboard...');
      
      // Mock redirect - replace with actual backend implementation
      setTimeout(() => {
        router.push('/admin-dash');
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      setError({
        field: 'general',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, role, router]);

  /**
   * Handle input field changes
   * @param field - Field name
   * @param value - New value
   */
  const handleInputChange = useCallback((
    field: keyof FormState,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * Handle forgot password navigation
   * TODO: BACKEND REQUIRED - Implement password reset flow
   */
  const handleForgotPassword = useCallback(() => {
    // TODO: BACKEND REQUIRED - Create password reset page
    // Implementation:
    // 1. Create /forgot-password page
    // 2. Request password reset with email
    // 3. Send reset link via email
    // 4. Validate reset token and update password
    
    router.push('/forgot-password');
  }, [router]);

  /**
   * Handle back to home navigation
   */
  const handleBackHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">JIS PhD</h1>
            <p className="text-slate-400">Administrator Login</p>
          </div>

          {/* Login Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-in fade-in duration-300">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-300">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error?.field === 'general' && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in fade-in duration-300">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error.message}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className={`relative flex items-center rounded-lg border transition-all duration-200 ${
                  error?.field === 'email'
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-slate-700 bg-slate-700/30 focus-within:border-blue-500 focus-within:bg-blue-500/5'
                }`}>
                  <Mail className="w-5 h-5 text-slate-500 ml-3 flex-shrink-0" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@jisuniversity.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-transparent px-3 py-3 outline-none text-white placeholder-slate-500 disabled:opacity-50"
                    aria-label="Email address"
                  />
                </div>
                {error?.field === 'email' && (
                  <p className="mt-2 text-sm text-red-400">{error.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className={`relative flex items-center rounded-lg border transition-all duration-200 ${
                  error?.field === 'password'
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-slate-700 bg-slate-700/30 focus-within:border-blue-500 focus-within:bg-blue-500/5'
                }`}>
                  <Lock className="w-5 h-5 text-slate-500 ml-3 flex-shrink-0" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-transparent px-3 py-3 outline-none text-white placeholder-slate-500 disabled:opacity-50"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="px-3 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {error?.field === 'password' && (
                  <p className="mt-2 text-sm text-red-400">{error.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 cursor-pointer disabled:opacity-50"
                    aria-label="Remember me"
                  />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-600/50 disabled:to-blue-700/50 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
                  Or
                </span>
              </div>
            </div>

            {/* Back to Home */}
            <button
              type="button"
              onClick={handleBackHome}
              className="w-full py-3 border border-slate-700 hover:border-slate-600 rounded-lg font-medium text-slate-300 hover:text-white transition-all duration-200"
            >
              Back to Home
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-slate-500 text-sm">
            <p>Need assistance? Contact support at</p>
            <a 
              href="mailto:support@jisuniversity.edu"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              support@jisuniversity.edu
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}