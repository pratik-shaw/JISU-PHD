/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { X, Eye, Edit, Trash2, AlertCircle, Users, Calendar, FileText, UserCheck, Shield } from 'lucide-react';

interface ViewEditDeleteDSCProps {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'delete';
  dsc: any | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface DSCMember {
  id: number;
  name: string;
  email: string;
  role: 'Supervisor' | 'Co-Supervisor' | 'Member';
  department: string;
}

interface DSCStudent {
  id: number;
  name: string;
  email: string;
  universityId: string;
  department: string;
  supervisor?: string;
  coSupervisors?: string[];
}

export default function ViewEditDeleteDSC({ isOpen, mode, dsc, onClose, onSuccess }: ViewEditDeleteDSCProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    formationDate: '',
    status: 'Active'
  });
  
  const [members, setMembers] = useState<DSCMember[]>([]);
  const [students, setStudents] = useState<DSCStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    if (isOpen && dsc) {
      setFormData({
        name: dsc.name || '',
        description: dsc.description || '',
        formationDate: dsc.formationDate || '',
        status: dsc.status || 'Active'
      });
      fetchDSCDetails();
    }
  }, [isOpen, dsc]);

  const fetchDSCDetails = async () => {
    if (!dsc) return;
    setFetchingData(true);
    try {
      const token = localStorage.getItem('authToken');
      const [membersResponse, studentsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dscs/${dsc.id}/members`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dscs/${dsc.id}/students`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const membersData = await membersResponse.json();
      if (membersData.success) setMembers(membersData.data);
      
      const studentsData = await studentsResponse.json();
      if (studentsData.success) setStudents(studentsData.data);

    } catch (err: any) {
      setError(err.message || 'Failed to load DSC details');
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleEdit = async () => {
    if (!formData.name || !formData.formationDate) {
      setError('DSC name and formation date are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dscs/${dsc.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update DSC');
      }

      if (onSuccess) onSuccess();
      onClose();
      alert('DSC updated successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating DSC');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== dsc?.name) {
      setError('Please type the DSC name exactly to confirm deletion');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dscs/${dsc.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete DSC');
      }

      if (onSuccess) onSuccess();
      onClose();
      alert('DSC deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting DSC');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !dsc) return null;

  const getIcon = () => {
    switch (mode) {
      case 'view': return <Eye className="w-6 h-6 text-blue-400" />;
      case 'edit': return <Edit className="w-6 h-6 text-purple-400" />;
      case 'delete': return <Trash2 className="w-6 h-6 text-red-400" />;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'view': return 'View DSC Details';
      case 'edit': return 'Edit DSC';
      case 'delete': return 'Delete DSC';
    }
  };

  const getIconBg = () => {
    switch (mode) {
      case 'view': return 'bg-blue-600/20';
      case 'edit': return 'bg-purple-600/20';
      case 'delete': return 'bg-red-600/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${getIconBg()} rounded-lg`}>
              {getIcon()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
              <p className="text-sm text-slate-400">{dsc.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-6 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {fetchingData ? (
            <div className="bg-slate-900/50 rounded-lg p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading DSC details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* DSC Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  DSC Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      DSC Name {mode === 'edit' && <span className="text-red-400">*</span>}
                    </label>
                    {mode === 'edit' ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        disabled={loading}
                      />
                    ) : (
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white">
                        {formData.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Formation Date {mode === 'edit' && <span className="text-red-400">*</span>}
                    </label>
                    {mode === 'edit' ? (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                          type="date"
                          name="formationDate"
                          value={formData.formationDate}
                          onChange={handleChange}
                          className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          disabled={loading}
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white">
                        {formData.formationDate}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Status
                    </label>
                    {mode === 'edit' ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        disabled={loading}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Archived">Archived</option>
                      </select>
                    ) : (
                      <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          formData.status === 'Active' ? 'bg-green-600/20 text-green-400' :
                          formData.status === 'Inactive' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-slate-600/20 text-slate-400'
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Total Members
                    </label>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white">
                      {members.length} members
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description / Notes
                  </label>
                  {mode === 'edit' ? (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                      disabled={loading}
                    />
                  ) : (
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white min-h-[80px]">
                      {formData.description || 'No description provided'}
                    </div>
                  )}
                </div>
              </div>

              {/* Students Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Students ({students.length})
                </h3>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800/50">
                      <tr className="text-left text-sm text-slate-400">
                        <th className="px-4 py-3 font-medium">Student</th>
                        <th className="px-4 py-3 font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Supervisor</th>
                        <th className="px-4 py-3 font-medium">Co-Supervisors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white font-medium">{student.name}</p>
                              <p className="text-xs text-slate-400">{student.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{student.universityId}</td>
                          <td className="px-4 py-3 text-slate-300">{student.department}</td>
                          <td className="px-4 py-3">
                            {student.supervisor ? (
                              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                                {student.supervisor}
                              </span>
                            ) : (
                              <span className="text-slate-500 text-sm">Not assigned</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {student.coSupervisors && student.coSupervisors.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {student.coSupervisors.map((coSup, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                                    {coSup}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">Not assigned</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Members Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  DSC Members ({members.length})
                </h3>
                <div className="grid gap-3">
                  {members.map((member) => (
                    <div key={member.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-sm text-slate-400">{member.email} • {member.department}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          member.role === 'Supervisor' ? 'bg-purple-600/20 text-purple-400' :
                          member.role === 'Co-Supervisor' ? 'bg-blue-600/20 text-blue-400' :
                          'bg-slate-600/20 text-slate-400'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delete Confirmation */}
              {mode === 'delete' && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-red-400 mb-2">Warning: This action cannot be undone!</h4>
                      <p className="text-sm text-red-300 mb-4">
                        Deleting this DSC will permanently remove all associated data, including student assignments and member roles. 
                        This will affect {students.length} student(s) and {members.length} member(s).
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-red-300 mb-2">
                          Type the DSC name to confirm: <span className="font-bold">{dsc.name}</span>
                        </label>
                        <input
                          type="text"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Enter DSC name"
                          className="w-full bg-slate-900/50 border border-red-500/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              {mode === 'delete' ? 'Cancel' : 'Close'}
            </button>
            
            {mode === 'edit' && (
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
            
            {mode === 'delete' && (
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                disabled={loading || deleteConfirmation !== dsc.name}
              >
                {loading ? 'Deleting...' : 'Delete DSC'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}