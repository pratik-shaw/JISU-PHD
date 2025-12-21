// FILE: app/member-login/page.tsx
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useApi } from '@/app/hooks/useApi';
import { 
  Users, 
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
 * Member user interface for API response
 */
interface MemberUser {
  id: string;
  name: string;
  email: string;
  role: string; // 'dsc-member', 'supervisor', 'co-supervisor'
  department?: string;
}

/**
 * Member/Faculty Login Page Component
 * Handles authentication for faculty members and program coordinators
 * 
 * ROLE-BASED DASHBOARD REDIRECT:
 * - DSC Member → /dsc-dash
 * - Supervisor → /supervisor-dash
 * - Co-Supervisor → /co-supervisor-dash
 */
export default function MemberLoginPage() {
  const router = useRouter();
  const apiFetch = useApi();

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
   * Get dashboard route based on member role
   * @param memberRole - The role of the member from API response
   * @returns - Dashboard route path
   * 
   * Role Mapping:
   * - 'dsc-member' → '/dsc-dash'
   * - 'supervisor' → '/supervisor-dash'
   * - 'co-supervisor' → '/co-supervisor-dash'
   */
  const getDashboardRoute = (memberRole: string): string => {
    const roleMap: { [key: string]: string } = {
      'dsc_member': '/dsc-dash',
      'supervisor': '/supervisor-dash',
      'co_supervisor': '/co-supervisor-dash',
    };

    return roleMap[memberRole] || '/member-dashboard'; // Default fallback
  };

  /**
   * Handle login form submission
   * TODO: BACKEND REQUIRED - Implement authentication for faculty/members
   * 
   * Backend Implementation Steps:
   * 1. Create POST /api/auth/login endpoint
   * 2. Accept: { email, password }
   * 3. Query database for user with role in ['dsc-member', 'supervisor', 'co-supervisor']
   * 4. Validate credentials against user record
   * 5. If valid:
   *    - Generate JWT token with role claim
   *    - Set httpOnly cookie with token
   *    - Return: { 
   *        success: true, 
   *        user: { 
   *          id, 
   *          name, 
   *          email, 
   *          role: 'dsc-member' | 'supervisor' | 'co-supervisor',
   *          department 
   *        }, 
   *        token 
   *      }
   * 6. If invalid:
   *    - Return: { success: false, message: 'Invalid credentials' }
   * 7. Log login activity for audit trail
   * 
   * Database Requirements:
   * - members/faculty table with columns: 
   *   id, name, email, password_hash, role, department, verified, created_at
   * - role must be one of: 'dsc-member', 'supervisor', 'co-supervisor'
   * - Ensure email is unique and verified
   * 
   * Example Request:
   * POST /api/auth/login
   * Content-Type: application/json
   * {
   *   "email": "faculty@jisuniversity.edu",
   *   "password": "securePassword123"
   * }
   * 
   * Example Success Response (DSC Member):
   * {
   *   "success": true,
   *   "user": {
   *     "id": "member_456",
   *     "name": "Dr. Faculty Name",
   *     "email": "faculty@jisuniversity.edu",
   *     "role": "dsc-member",
   *     "department": "Computer Science"
   *   },
   *   "token": "eyJhbGciOiJIUzI1NiIs..."
   * }
   * 
   * Example Success Response (Supervisor):
   * {
   *   "success": true,
   *   "user": {
   *     "id": "member_789",
   *     "name": "Prof. Supervisor Name",
   *     "email": "supervisor@jisuniversity.edu",
   *     "role": "supervisor",
   *     "department": "Computer Science"
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
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'member',
        }),
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

      // Verify user role is one of the member roles
      const validRoles = ['dsc_member', 'supervisor', 'co_supervisor'];
      if (!validRoles.includes(data.user.role)) {
        setError({
          field: 'general',
          message: 'Invalid credentials. Please use the correct login portal.',
        });
        setIsLoading(false);
        return;
      }

      // Store authentication token and user info
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Show success message
      setSuccessMessage(`Welcome, ${data.user.name}! Redirecting to your dashboard...`);

      // Get the appropriate dashboard based on member's role
      const dashboardRoute = getDashboardRoute(data.user.role);
      
      setTimeout(() => {
        router.push(dashboardRoute);
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
  }, [formData]);

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
    // 2. Send password reset link to verified institutional email
    // 3. Implement reset token validation
    // 4. Allow password update with confirmation
    // 5. Log password change for security audit
    
    router.push('/forgot-password');
  }, [router]);

  /**
   * Handle back to home navigation
   */
  const handleBackHome = useCallback(() => {
    router.push('/');
  }, [router]);

  /**
   * Handle request access for new faculty
   * TODO: BACKEND REQUIRED - Implement access request system
   */
  const handleRequestAccess = useCallback(() => {
    // TODO: BACKEND REQUIRED - Create access request page
    // Implementation:
    // 1. Create /request-access page
    // 2. Collect faculty information: name, email, department, designation
    // 3. Validate institutional email domain
    // 4. Send verification email
    // 5. Admin approval workflow
    // 6. Send credentials once approved
    
    router.push('/request-access');
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
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">JIS PhD</h1>
            <p className="text-slate-400">Faculty & Member Portal</p>
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
                  Institutional Email
                </label>
                <div className={`relative flex items-center rounded-lg border transition-all duration-200 ${
                  error?.field === 'email'
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-slate-700 bg-slate-700/30 focus-within:border-emerald-500 focus-within:bg-emerald-500/5'
                }`}>
                  <Mail className="w-5 h-5 text-slate-500 ml-3 flex-shrink-0" />
                  <input
                    id="email"
                    type="email"
                    placeholder="faculty@jisuniversity.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-transparent px-3 py-3 outline-none text-white placeholder-slate-500 disabled:opacity-50"
                    aria-label="Institutional email address"
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
                    : 'border-slate-700 bg-slate-700/30 focus-within:border-emerald-500 focus-within:bg-emerald-500/5'
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
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-600 cursor-pointer disabled:opacity-50"
                    aria-label="Remember me"
                  />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-600/50 disabled:to-emerald-700/50 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
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

            {/* Additional Actions */}
            <div className="space-y-3">
              {/* Request Access Button */}
              <button
                type="button"
                onClick={handleRequestAccess}
                className="w-full py-3 border border-emerald-600/30 hover:border-emerald-600/60 hover:bg-emerald-600/10 rounded-lg font-medium text-emerald-400 hover:text-emerald-300 transition-all duration-200"
              >
                New Faculty? Request Access
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

            {/* Portal Info */}
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-sm text-emerald-300">
                <span className="font-semibold">💡 Tip:</span> Use your institutional email and password to access the faculty portal. Your role determines your dashboard (DSC Member, Supervisor, or Co-Supervisor).
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-slate-500 text-sm">
            <p>Need assistance? Contact support at</p>
            <a 
              href="mailto:faculty-support@jisuniversity.edu"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              faculty-support@jisuniversity.edu
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}