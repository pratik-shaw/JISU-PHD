/* eslint-disable react-hooks/exhaustive-deps */
// FILE: app/login/page.tsx (Student variant)
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
  CheckCircle,
  FileText
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
 * Student Login Page Component
 * Handles authentication for PhD students and applicants
 */
export default function StudentLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';

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
   * TODO: BACKEND REQUIRED - Implement authentication for students
   * 
   * Backend Implementation Steps:
   * 1. Create POST /api/auth/login endpoint
   * 2. Accept: { email, password, role }
   * 3. Query database for user with role 'student'
   * 4. Check student account status: active, pending, rejected
   * 5. Validate credentials against user record
   * 6. If valid:
   *    - Generate JWT token with role and student_id claims
   *    - Set httpOnly cookie with token
   *    - Update last_login timestamp
   *    - Return: { success: true, user: { id, name, email, role, student_id, program, status }, token }
   * 7. If invalid:
   *    - Return: { success: false, message: 'Invalid credentials' }
   * 8. If account status is not active:
   *    - Return: { success: false, message: 'Your account is pending approval', status }
   * 9. Log login activity for audit trail
   * 
   * Database Requirements:
   * - students table with columns: id, name, email, password_hash, student_id, program, 
   *   status (active/pending/rejected), application_date, enrollment_date, verified
   * - Ensure email is unique and verified
   * - Track account status for application flow
   * 
   * Example Request:
   * POST /api/auth/login
   * Content-Type: application/json
   * {
   *   "email": "student@jisuniversity.edu",
   *   "password": "securePassword123",
   *   "role": "student"
   * }
   * 
   * Example Success Response:
   * {
   *   "success": true,
   *   "user": {
   *     "id": "student_789",
   *     "name": "John Doe",
   *     "email": "student@jisuniversity.edu",
   *     "role": "student",
   *     "student_id": "JIS2024001",
   *     "program": "Computer Science",
   *     "status": "active"
   *   },
   *   "token": "eyJhbGciOiJIUzI1NiIs..."
   * }
   * 
   * Example Pending Response:
   * {
   *   "success": false,
   *   "message": "Your account is pending approval from the admissions office",
   *   "status": "pending"
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
        // Handle pending account status
        if (data.status === 'pending') {
          setError({
            field: 'general',
            message: 'Your account is pending approval. Please check your email for updates.',
          });
        } else if (data.status === 'rejected') {
          setError({
            field: 'general',
            message: 'Your application was not approved. Please contact admissions.',
          });
        } else {
          setError({
            field: 'general',
            message: data.message || 'Login failed. Please try again.',
          });
        }
        setIsLoading(false);
        return;
      }

      // Verify user role is student
      if (data.user.role !== 'student') {
        setError({
          field: 'general',
          message: 'Invalid credentials. Please use the correct login portal.',
        });
        setIsLoading(false);
        return;
      }

      // TODO: BACKEND REQUIRED - Store authentication token and user info
      // Implementation:
      // 1. Store token in localStorage (if not using httpOnly cookie)
      // 2. Store token in sessionStorage for additional security
      // 3. Store student info in state management
      // 4. Set token in authorization headers for future API calls
      // 5. Update user context with student data
      //
      // Example:
      // if (data.token) {
      //   localStorage.setItem('authToken', data.token);
      //   localStorage.setItem('user', JSON.stringify(data.user));
      //   localStorage.setItem('userRole', data.user.role);
      //   localStorage.setItem('studentId', data.user.student_id);
      // }
      
      // Show success message
      setSuccessMessage(`Welcome, ${data.user.name}! Redirecting to your dashboard...`);

      // TODO: BACKEND REQUIRED - Redirect to student dashboard
      // Student dashboard features should include:
      // - Application status tracking
      // - Progress monitoring
      // - Document submission
      // - Communication with faculty
      // - Progress timeline
      // - Announcement feeds
      //
      // setTimeout(() => {
      //   router.push('/student-dashboard');
      // }, 1500);
      */

      // Temporary mock implementation for frontend testing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Login successful! Redirecting to your dashboard...');
      
      // Mock redirect - replace with actual backend implementation
      setTimeout(() => {
        router.push('/student-dash');
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
    // 1. Create /forgot-password page with email verification
    // 2. Send password reset link to verified email
    // 3. Implement reset token validation with expiry (15 minutes)
    // 4. Allow password update with confirmation
    // 5. Send confirmation email after password change
    // 6. Log password change for security audit
    
    router.push('/forgot-password');
  }, [router]);

  /**
   * Handle back to home navigation
   */
  const handleBackHome = useCallback(() => {
    router.push('/');
  }, [router]);

  /**
   * Handle application status check
   * Navigate to check application status without full login
   * TODO: BACKEND REQUIRED - Implement application status check
   */
  const handleCheckApplicationStatus = useCallback(() => {
    // TODO: BACKEND REQUIRED - Create application status check page
    // Implementation:
    // 1. Create /check-application-status page
    // 2. Allow users to check status with email and application number
    // 3. No authentication required for status check
    // 4. Display: pending, under review, approved, rejected
    // 5. Show next steps based on status
    // 6. Option to complete registration if approved
    
    router.push('/check-application-status');
  }, [router]);

  /**
   * Handle new application navigation
   * TODO: BACKEND REQUIRED - Implement application system
   */
  const handleNewApplication = useCallback(() => {
    // TODO: BACKEND REQUIRED - Create application form
    // Implementation:
    // 1. Create /apply page with multi-step form
    // 2. Collect: personal info, academic background, research interests
    // 3. Document upload: resume, transcripts, recommendation letters
    // 4. Essay questions specific to program
    // 5. Submit application with timestamp
    // 6. Generate application number for tracking
    // 7. Send confirmation email with application number
    
    router.push('/apply');
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
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">JIS PhD</h1>
            <p className="text-slate-400">Student Portal</p>
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
                    : 'border-slate-700 bg-slate-700/30 focus-within:border-violet-500 focus-within:bg-violet-500/5'
                }`}>
                  <Mail className="w-5 h-5 text-slate-500 ml-3 flex-shrink-0" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@jisuniversity.edu"
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
                    : 'border-slate-700 bg-slate-700/30 focus-within:border-violet-500 focus-within:bg-violet-500/5'
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
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-violet-600 cursor-pointer disabled:opacity-50"
                    aria-label="Remember me"
                  />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 disabled:from-violet-600/50 disabled:to-violet-700/50 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
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
                  New to JIS PhD?
                </span>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="space-y-3">
              {/* New Application Button */}
              <button
                type="button"
                onClick={handleNewApplication}
                className="w-full flex items-center justify-center gap-2 py-3 border border-violet-600/30 hover:border-violet-600/60 hover:bg-violet-600/10 rounded-lg font-medium text-violet-400 hover:text-violet-300 transition-all duration-200"
              >
                <FileText className="w-5 h-5" />
                Start New Application
              </button>

              {/* Check Application Status Button */}
              <button
                type="button"
                onClick={handleCheckApplicationStatus}
                className="w-full py-3 border border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 rounded-lg font-medium text-slate-300 hover:text-white transition-all duration-200"
              >
                Check Application Status
              </button>

              {/* Back to Home Button */}
              <button
                type="button"
                onClick={handleBackHome}
                className="w-full py-3 border border-slate-700 hover:border-slate-600 rounded-lg font-medium text-slate-300 hover:text-white transition-all duration-200"
              >
                Back to Home
              </button>
            </div>

            {/* Student Portal Info */}
            <div className="mt-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg">
              <p className="text-sm text-violet-300">
                <span className="font-semibold">📚 Portal Features:</span> Track applications, monitor progress, submit documents, and communicate with advisors—all in one place.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-slate-500 text-sm">
            <p>Having trouble accessing your account?</p>
            <a 
              href="mailto:student-support@jisuniversity.edu"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              student-support@jisuniversity.edu
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}