/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: app/admin-dash/ViewEditDeleteUser.tsx
'use client';

import { useState } from 'react';
import { X, User, Mail, Hash, Shield, Trash2, AlertTriangle } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  universityId?: string;
  uniqueId?: string;
}

interface ViewEditDeleteUserProps {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'delete';
  user: UserData | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ViewEditDeleteUser({ 
  isOpen, 
  mode, 
  user, 
  onClose, 
  onSuccess 
}: ViewEditDeleteUserProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    status: user?.status || '',
    universityId: user?.universityId || '',
    uniqueId: user?.uniqueId || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when user prop changes
  useState(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        universityId: user.universityId || '',
        uniqueId: user.uniqueId || ''
      });
    }
  });

  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  /**
   * Handle Edit User
   * TODO: BACKEND REQUIRED - Integrate with user update API
   * 
   * Expected API endpoint: PUT /api/admin/users/{userId}
   * Request body: { name, email, role, status, universityId?, uniqueId? }
   * Response: { success: boolean, message: string }
   */
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      setError('Name, email, and role are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: BACKEND INTEGRATION
      /*
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      console.log('User updated successfully:', data);
      */

      // MOCK SUCCESS
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Update user data:', formData);

      if (onSuccess) onSuccess();
      onClose();
      alert('User updated successfully!');

    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the user');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Delete User
   * TODO: BACKEND REQUIRED - Integrate with user deletion API
   * 
   * Expected API endpoint: DELETE /api/admin/users/{userId}
   * Response: { success: boolean, message: string }
   */
  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      // TODO: BACKEND INTEGRATION
      /*
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      console.log('User deleted successfully:', data);
      */

      // MOCK SUCCESS
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Delete user:', user?.id);

      if (onSuccess) onSuccess();
      onClose();
      alert('User deleted successfully!');

    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the user');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {mode === 'view' && 'View User Details'}
            {mode === 'edit' && 'Edit User'}
            {mode === 'delete' && 'Delete User'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          {/* VIEW MODE */}
          {mode === 'view' && (
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Full Name</p>
                    <p className="text-white font-medium">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Email Address</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Role</p>
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                      {user.role}
                    </span>
                  </div>
                </div>

                {user.universityId && (
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">University ID</p>
                      <p className="text-white">{user.universityId}</p>
                    </div>
                  </div>
                )}

                {user.uniqueId && (
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Unique ID</p>
                      <p className="text-white">{user.uniqueId}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Status</p>
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* EDIT MODE */}
          {mode === 'edit' && (
            <form onSubmit={handleEdit} className="space-y-4">
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
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Role Field */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    disabled={loading}
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Co-Supervisor">Co-Supervisor</option>
                    <option value="DSC Member">DSC Member</option>
                    <option value="Faculty">Faculty</option>
                  </select>
                </div>
              </div>

              {/* Status Field */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  disabled={loading}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
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
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* DELETE MODE */}
          {mode === 'delete' && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Warning: This action cannot be undone</h3>
                  <p className="text-sm text-red-300">
                    Are you sure you want to delete this user? All associated data will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-slate-400">User to be deleted:</p>
                <p className="text-white font-semibold text-lg">{user.name}</p>
                <p className="text-slate-400">{user.email}</p>
                <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                  {user.role}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    'Deleting...'
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}