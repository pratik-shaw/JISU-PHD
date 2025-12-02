/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// FILE: app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { GraduationCap, LogIn, ArrowRight } from 'lucide-react';

/**
 * Login option configuration interface
 * Defines structure for each role-based login option
 */
interface LoginOption {
  [x: string]: any;
  id: 'admin' | 'member' | 'student';
  title: string;
  description: string;
  icon: typeof LogIn | typeof GraduationCap;
  route: string; // Role-specific login route
  color: {
    bg: string;
    border: string;
    shadow: string;
    text: string;
    hoverBg: string;
  };
  features: string[];
}

/**
 * Login options configuration
 * Each option represents a different user role with specific features and routes
 */
const loginOptions: LoginOption[] = [
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage programs, faculty, and oversee the entire system',
    icon: LogIn,
    route: '/admin-login', // Route to admin-specific login page
    color: {
      bg: 'from-blue-600',
      border: 'hover:border-blue-500',
      shadow: 'hover:shadow-blue-500/20',
      text: 'text-blue-400',
      hoverBg: 'hover:shadow-blue-500/20',
    },
    features: [
      'Program Management',
      'Faculty Oversight',
      'System Configuration',
      'Analytics & Reports',
    ],
  },
  {
    id: 'member',
    title: 'Faculty/Member',
    description: 'Review applications and guide PhD candidates',
    icon: LogIn,
    route: '/member-login', // Route to member-specific login page
    color: {
      bg: 'from-emerald-600',
      border: 'hover:border-emerald-500',
      shadow: 'hover:shadow-emerald-500/20',
      text: 'text-emerald-400',
      hoverBg: 'hover:shadow-emerald-500/20',
    },
    features: [
      'Application Review',
      'Student Guidance',
      'Progress Tracking',
      'Communication Tools',
    ],
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Track your application and manage your progress',
    icon: GraduationCap,
    route: '/student-login', // Route to student-specific login page
    color: {
      bg: 'from-violet-600',
      border: 'hover:border-violet-500',
      shadow: 'hover:shadow-violet-500/20',
      text: 'text-violet-400',
      hoverBg: 'hover:shadow-violet-500/20',
    },
    features: [
      'Application Status',
      'Progress Dashboard',
      'Document Submission',
      'Communication',
    ],
  },
];

/**
 * HomePage Component
 * Main landing page with three role-based login options
 */
export default function HomePage() {
  const router = useRouter();

  /**
   * Handle login button click
   * Navigates to role-specific login page
   * @param route - Role-specific login route (e.g., /admin-login, /member-login, /student-login)
   */
  const handleLoginClick = useCallback((route: string) => {
    router.push(route);
  }, [router]);

  /**
   * Handle general navigation
   * @param path - Navigation path
   */
  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Navigation Bar Component */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* ============ Hero Section ============ */}
          <div className="text-center mb-16 animate-fade-in">
            {/* Badge with status indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-300 font-medium">
                Academic Excellence Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent leading-tight">
              PhD Program Automation
            </h1>

            {/* Subheading */}
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              JIS University's streamlined platform for managing PhD admissions, applications, and student progress. 
              Simplifying academic administration for the future.
            </p>
          </div>

          {/* ============ Login Options Grid ============ */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {loginOptions.map((option) => {
              const IconComponent = option.icon;

              return (
                <button
                  key={option.id}
                  onClick={() => handleLoginClick(option.route)}
                  className={`group relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl transition-all duration-300 text-left ${option.border} ${option.shadow} hover:shadow-lg`}
                  aria-label={`Login as ${option.title}`}
                >
                  {/* Gradient overlay on hover - creates depth effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300" />

                  {/* Card Content Container */}
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${option.color.bg} to-blue-700 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Card Title */}
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors duration-200">
                      {option.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                      {option.description}
                    </p>

                    {/* Features List */}
                    <div className="mb-6 space-y-2">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-400 text-sm">
                          {/* Feature bullet point */}
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Text with icon */}
                    <div className={`inline-flex items-center gap-2 font-medium ${option.color.text} group-hover:translate-x-2 transition-transform duration-200`}>
                      <span>Login as {option.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ============ Info & Support Banner ============ */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 max-w-2xl mx-auto backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Support Text */}
              <p className="text-slate-300 text-sm">
                Don't have an account? Contact the admissions office.
              </p>

              {/* Request Access Button */}
              <a
                href="mailto:admissions@jisuniversity.edu"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors duration-200 whitespace-nowrap"
              >
                Request Access
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}