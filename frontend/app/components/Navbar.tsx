/* eslint-disable react-hooks/set-state-in-effect */
// FILE: app/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/app/hooks/useApi'; // Add this import
import { GraduationCap, Menu, X, LogOut } from 'lucide-react';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'student';
}

export default function Navbar() {
  const router = useRouter();
  const apiFetch = useApi(); // Initialize useApi
  const [user, setUser] = useState<UserType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await apiFetch('/api/auth/me', { // Use apiFetch and relative URL
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [apiFetch]); // Add apiFetch to dependency array

  const handleLogout = async () => {
    // Clear authentication and notify backend
    try {
      const token = localStorage.getItem('authToken');
      await apiFetch('/api/auth/logout', { // Use apiFetch and relative URL
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/');
    }
    
    setUser(null);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 h-20" />
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            aria-label="Home"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white hidden sm:inline font-sans">
              JIS PhD
            </span>
          </button>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* User Profile */}
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-medium text-sm leading-tight">
                      {user.name}
                    </span>
                    <span className="text-slate-500 text-xs capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-all duration-200 border border-transparent hover:border-red-500/30"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-blue-400 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700 bg-slate-800/50 animate-in fade-in duration-200">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavigation('/')}
                className="px-4 py-3 text-left text-slate-300 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className="px-4 py-3 text-left text-slate-300 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation('/contact')}
                className="px-4 py-3 text-left text-slate-300 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
              >
                Contact
              </button>

              {user && (
                <div className="border-t border-slate-700 pt-4 mt-2">
                  <div className="px-4 py-3 bg-slate-700/30 rounded-lg mb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-300 font-medium text-sm">
                          {user.name}
                        </div>
                        <div className="text-slate-500 text-xs capitalize">
                          {user.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg font-medium transition-all duration-200 border border-red-500/30"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
