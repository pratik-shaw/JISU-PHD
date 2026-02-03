/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: app/admin-dash/CreateStudent.tsx
'use client';

import { useState } from 'react';
import { X, User, Mail, Lock, Hash } from 'lucide-react';
import { useApi } from '@/app/hooks/useApi';

interface CreateStudentProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateStudent({ isOpen, onClose, onSuccess }: CreateStudentProps) {
  const [formData, setFormData] = useState({
              name: '',
            email: '',
            password: '',
            uniqueId: ''
          });  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiFetch = useApi();

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  /**
   * Handle form submission
   * TODO: BACKEND REQUIRED - Integrate with student creation API
   * 
   * Expected API endpoint: POST /api/admin/students/create
   * Request body: { name, email, password, universityId }
   * Response: { success: boolean, message: string, studentId?: string }
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.uniqueId) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password strength validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiFetch(`/api/users`, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'student', // Always 'student' for this modal
          uniqueId: formData.uniqueId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create student');
      }

      console.log('Student created successfully:', data);
      
      setFormData({
        name: '',
        email: '',
        password: '',
        uniqueId: ''
      });

      if (onSuccess) {
        onSuccess(); // Refresh user list in admin dashboard
      }

      onClose();
      // Show success message (you can integrate with a toast library)
      alert('Student created successfully!'); 

    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the student');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Create New Student</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Enter student's full name"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="student@university.edu"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Minimum 8 characters"
                disabled={loading}
                required
                minLength={8}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Minimum 8 characters</p>
          </div>

          {/* Unique ID Field */}
          <div>
            <label htmlFor="uniqueId" className="block text-sm font-medium text-slate-300 mb-2">
              Unique ID
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Enter unique ID"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}