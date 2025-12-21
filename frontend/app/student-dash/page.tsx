'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/app/hooks/useApi';
import {
  Menu,
  X,
  BookOpen,
  FileText,
  Upload,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Send,
  Download,
  MessageSquare
} from 'lucide-react';
import FileViewer from '@/app/components/FileViewer'; // Import the FileViewer component

interface Submission {
  id: number;
  title: string;
  type: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  document_url?: string; // Add document_url to the interface
}

interface Feedback {
  id: number;
  submission_id: number;
  comment: string;
  created_at: string;
}

export default function StudentDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'Application' | 'Proposal/Report' | 'Pre-Thesis' | 'Final-Thesis' | ''>('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAbstract, setUploadAbstract] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback[]>([]);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [applications, setApplications] = useState<Submission[]>([]);
  const [proposals, setProposals] = useState<Submission[]>([]);
  const [reports, setReports] = useState<Submission[]>([]);
  const [preThesis, setPreThesis] = useState<Submission[]>([]);
  const [finalThesis, setFinalThesis] = useState<Submission[]>([]);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [fileToViewUrl, setFileToViewUrl] = useState('');
  const [fileToViewType, setFileToViewType] = useState('');

  const apiFetch = useApi();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/student-login');
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch(`/api/student/documents`);
        const data = await res.json();
        if (data.success) {
          setApplications(data.data.filter((doc: any) => doc.type === 'Application'));
          setProposals(data.data.filter((doc: any) => doc.type === 'Proposal/Report'));
          setPreThesis(data.data.filter((doc: any) => doc.type === 'Pre-Thesis'));
          setFinalThesis(data.data.filter((doc: any) => doc.type === 'Final-Thesis'));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [apiFetch]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', uploadType);
    formData.append('title', uploadTitle);
    formData.append('abstract', uploadAbstract);

    try {
      await apiFetch(`/api/student/submissions`, {
        method: 'POST',
        body: formData,
      });
      alert(`${uploadType} uploaded successfully!`);
      setUploadModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      router.push('/');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordChangeError('New passwords do not match');
      return;
    }

    setPasswordChangeLoading(true);
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    try {
      const response = await apiFetch(`/api/me/password`, {
        method: 'PUT',
        body: JSON.stringify({
          oldPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      setPasswordChangeSuccess('Password changed successfully!');
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setPasswordChangeError(err.message || 'An error occurred');
    } finally {
      setPasswordChangeLoading(false);
    }
  };
  
  const handleViewFeedback = async (submission: Submission) => {
    try {
      const res = await apiFetch(`/api/student/submissions/${submission.id}/feedback`);
      const data = await res.json();
      if(data.success) {
        setSelectedFeedback(data.data);
        setFeedbackModalOpen(true);
      } else {
        alert(data.message || 'Failed to fetch feedback.');
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      alert('Failed to fetch feedback');
    }
  };

  const viewSubmission = async (submission: Submission) => {
    try {
      const res = await apiFetch(`/api/student/submissions/${submission.id}`);
      const data = await res.json();
      if(data.success) {
        const fetchedSubmission = data.data;
        if (fetchedSubmission.document_url) {
          const fileRes = await apiFetch(`/api/student/submissions/${fetchedSubmission.id}/view`);
          const blob = await fileRes.blob();
          const blobUrl = URL.createObjectURL(blob);
          setFileToViewUrl(blobUrl);
          setFileToViewType(fetchedSubmission.document_url.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'); // Basic inference
          setIsFileViewerOpen(true);
        } else {
          setSelectedSubmission(fetchedSubmission);
          setViewModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch submission details:', error);
      alert('Failed to fetch submission details');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-600/20 text-green-400';
      case 'Rejected': return 'bg-red-600/20 text-red-400';
      case 'Under Review': return 'bg-blue-600/20 text-blue-400';
      case 'Revision Required': return 'bg-yellow-600/20 text-yellow-400';
      default: return 'bg-slate-600/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'Under Review': return <Clock className="w-4 h-4" />;
      case 'Revision Required': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-slate-800/50 border-r border-slate-700 transition-all overflow-hidden`}>
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-6 text-blue-400">Student Portal</h2>
          <nav className="space-y-2 flex-1">
            {[
              { label: 'Dashboard', tab: 'dashboard' },
              { label: 'Applications', tab: 'applications' },
              { label: 'Proposals & Reports', tab: 'proposals' },
              { label: 'Pre-Thesis', tab: 'pre-thesis' },
              { label: 'Final Thesis', tab: 'final-thesis' },
              { label: 'Settings', tab: 'settings' },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === item.tab ? 'bg-blue-600' : 'hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all mt-6 border-t border-slate-700 pt-6"
          >
            <XCircle className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-slate-800/30 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-700 rounded-lg">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-xl font-bold">Student Dashboard</h1>
              <p className="text-sm text-slate-400">PhD Program</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Student Name</p>
              <p className="text-xs text-slate-400">PhD Candidate</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
                <p className="text-blue-100">Track your PhD journey, submit documents, and monitor your progress.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-3xl font-bold">
                      {[...applications, ...proposals, ...preThesis, ...finalThesis].filter(s => s.status === 'approved').length}
                    </span>
                  </div>
                  <p className="text-sm">Approved</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <Clock className="w-8 h-8" />
                    <span className="text-3xl font-bold">
                      {[...applications, ...proposals, ...preThesis, ...finalThesis].filter(s => s.status === 'pending').length}
                    </span>
                  </div>
                  <p className="text-sm">Under Review</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <AlertCircle className="w-8 h-8" />
                    <span className="text-3xl font-bold">
                      {[...applications, ...proposals, ...preThesis, ...finalThesis].filter(s => s.status === 'rejected').length}
                    </span>
                  </div>
                  <p className="text-sm">Needs Revision</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <FileText className="w-8 h-8" />
                    <span className="text-3xl font-bold">
                      {applications.length + proposals.length + preThesis.length + finalThesis.length}
                    </span>
                  </div>
                  <p className="text-sm">Total Submissions</p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[...proposals, ...preThesis, ...finalThesis].slice(0, 3).map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="font-medium">{sub.title}</p>
                        <p className="text-sm text-slate-400">{sub.type} • {sub.date}</p>
                      </div>
                      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Applications */}
          {activeTab === 'applications' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Applications & Documents</h2>
                <button 
                  onClick={() => { setUploadType('Application'); setUploadModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                        <td className="px-6 py-4">{app.title}</td>
                        <td className="px-6 py-4 text-slate-400">{app.type}</td>
                        <td className="px-6 py-4 text-slate-400">{app.date}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm w-fit ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => viewSubmission(app)}
                              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            {(app.status === 'approved' || app.status === 'rejected') && (
                              <button 
                                onClick={() => handleViewFeedback(app)}
                                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Feedback
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Proposals & Reports */}
          {activeTab === 'proposals' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Proposals & Progress Reports</h2>
                <button 
                  onClick={() => { setUploadType('Proposal/Report'); setUploadModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Upload className="w-4 h-4" />
                  Submit Report
                </button>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map(prop => (
                      <tr key={prop.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                        <td className="px-6 py-4">{prop.title}</td>
                        <td className="px-6 py-4 text-slate-400">{prop.type}</td>
                        <td className="px-6 py-4 text-slate-400">{prop.date}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm w-fit ${getStatusColor(prop.status)}`}>
                            {getStatusIcon(prop.status)}
                            {prop.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => viewSubmission(prop)}
                              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View 
                            </button>
                            {(prop.status === 'approved' || prop.status === 'rejected') && (
                              <button 
                                onClick={() => handleViewFeedback(prop)}
                                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Feedback
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pre-Thesis */}
          {activeTab === 'pre-thesis' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Pre-Thesis Submission</h2>
                <button 
                  onClick={() => { setUploadType('Pre-Thesis'); setUploadModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Upload className="w-4 h-4" />
                  Submit Pre-Thesis
                </button>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Date Submitted</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preThesis.map(thesis => (
                      <tr key={thesis.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                        <td className="px-6 py-4">{thesis.title}</td>
                        <td className="px-6 py-4 text-slate-400">{thesis.date}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm w-fit ${getStatusColor(thesis.status)}`}>
                            {getStatusIcon(thesis.status)}
                            {thesis.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => viewSubmission(thesis)}
                              className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            {(thesis.status === 'approved' || thesis.status === 'rejected') && (
                              <button 
                                onClick={() => handleViewFeedback(thesis)}
                                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Feedback
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Final Thesis */}
          {activeTab === 'final-thesis' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Final Thesis Submission</h2>
                <button 
                  onClick={() => { setUploadType('Final-Thesis'); setUploadModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Upload className="w-4 h-4" />
                  Submit Final Thesis
                </button>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Date Submitted</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalThesis.map(thesis => (
                      <tr key={thesis.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                        <td className="px-6 py-4">{thesis.title}</td>
                        <td className="px-6 py-4 text-slate-400">{thesis.date}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm w-fit ${getStatusColor(thesis.status)}`}>
                            {getStatusIcon(thesis.status)}
                            {thesis.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => viewSubmission(thesis)}
                              className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            {(thesis.status === 'approved' || thesis.status === 'rejected') && (
                              <button 
                                onClick={() => handleViewFeedback(thesis)}
                                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Feedback
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input 
                      type="password"
                      name="currentPassword"
                      value={passwordFormData.currentPassword}
                      onChange={e => setPasswordFormData({...passwordFormData, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input 
                      type="password"
                      name="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={e => setPasswordFormData({...passwordFormData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input 
                      type="password"
                      name="confirmPassword"
                      value={passwordFormData.confirmPassword}
                      onChange={e => setPasswordFormData({...passwordFormData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {passwordChangeError && <p className="text-red-500 text-sm">{passwordChangeError}</p>}
                  {passwordChangeSuccess && <p className="text-green-500 text-sm">{passwordChangeSuccess}</p>}
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm" disabled={passwordChangeLoading}>
                    {passwordChangeLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Upload {uploadType}</h3>
              <button onClick={() => setUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Document Title</label>
                <input 
                  type="text" 
                  placeholder="Enter document title"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select File</label>
                <input 
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea 
                  placeholder="Add any additional notes..."
                  value={uploadAbstract}
                  onChange={(e) => setUploadAbstract(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 min-h-24 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button 
                onClick={handleUpload}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                <Send className="w-4 h-4" />
                Submit Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Status Modal */}
      {viewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedSubmission.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{selectedSubmission.type} • {selectedSubmission.date}</p>
              </div>
              <button onClick={() => setViewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-2">Current Status</p>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${getStatusColor(selectedSubmission.status)}`}>
                  {getStatusIcon(selectedSubmission.status)}
                  {selectedSubmission.status}
                </span>
              </div>

              {selectedSubmission.remarks && (
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-2">Reviewer Comments</p>
                  <p className="text-slate-200">{selectedSubmission.remarks}</p>
                </div>
              )}

              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-2">Submission Date</p>
                <p className="text-slate-200">{selectedSubmission.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* File Viewer Modal */}
      <FileViewer 
        isOpen={isFileViewerOpen}
        onClose={() => setIsFileViewerOpen(false)}
        fileUrl={fileToViewUrl}
        fileType={fileToViewType}
      />

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Feedback</h3>
              </div>
              <button onClick={() => setFeedbackModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {selectedFeedback.length > 0 ? (
                selectedFeedback.map((feedback) => (
                  <div key={feedback.id} className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-slate-200">{feedback.comment}</p>
                    <p className="text-sm text-slate-400 mt-2">{new Date(feedback.created_at).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p>No feedback available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
