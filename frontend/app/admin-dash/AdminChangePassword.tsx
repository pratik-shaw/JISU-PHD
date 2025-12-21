// FILE: frontend/app/admin-dash/AdminChangePassword.tsx
'use client';

import { useState } from 'react';

export default function AdminChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      setSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
