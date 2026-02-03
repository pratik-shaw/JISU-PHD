/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: app/supervisor-dash/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import FileViewer from '@/app/components/FileViewer';
import SupervisorMenu from '@/app/supervisor-dash/Supervisor-menu';
import ViewStudentProfile from '@/app/supervisor-dash/ViewStudentProfile';
import { useApi } from '@/app/hooks/useApi';
import {
  ClipboardCheck,
  Menu,
  X,
  Users,
  Clock,
  CheckCircle,
  Send,
  Eye,
  MessageSquare,
  Download,
  AlertCircle,
  XCircle
} from 'lucide-react';

/**
 * Supervisor Dashboard Page
 * Role: PhD Supervisor
 * 
 * Responsibilities:
 * - Guide and mentor PhD students
 * - Review research proposals and progress
 * - Approve student submissions
 * - Conduct regular meetings
 * - Provide feedback on research work
 */
export default function SupervisorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [rejectionModal, setRejectionModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [fileToViewUrl, setFileToViewUrl] = useState('');
  const [fileToViewType, setFileToViewType] = useState('');

  // State for fetched data and their loading/error states
  const [proposals, setProposals] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [errorProposals, setErrorProposals] = useState<string | null>(null);

  const [preThesis, setPreThesis] = useState<any[]>([]);
  const [loadingPreThesis, setLoadingPreThesis] = useState(true);
  const [errorPreThesis, setErrorPreThesis] = useState<string | null>(null);

  const [finalThesis, setFinalThesis] = useState<any[]>([]);
  const [loadingFinalThesis, setLoadingFinalThesis] = useState(true);
  const [errorFinalThesis, setErrorFinalThesis] = useState<string | null>(null);

  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [errorStudents, setErrorStudents] = useState<string | null>(null);

  const apiFetch = useApi();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    // Fetch Students
    try {
      setLoadingStudents(true);
      const res = await apiFetch('/api/supervisor/students');
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch students');
      }
    } catch (error: any) {
      setErrorStudents(error.message || 'Failed to fetch students');
      console.error('Failed to fetch students:', error);
    } finally {
      setLoadingStudents(false);
    }

    // Fetch Documents
    try {
      setLoadingProposals(true);
      setLoadingPreThesis(true);
      setLoadingFinalThesis(true);
      const res = await apiFetch('/api/supervisor/documents');
      const data = await res.json();
      if (data.success) {
        setProposals(data.data.filter((doc: any) => doc.type === 'Proposal/Report'));
        setPreThesis(data.data.filter((doc: any) => doc.type === 'Pre-Thesis'));
        setFinalThesis(data.data.filter((doc: any) => doc.type === 'Final-Thesis'));
      } else {
        throw new Error(data.message || 'Failed to fetch documents');
      }
    } catch (error: any) {
      setErrorProposals(error.message || 'Failed to fetch documents');
      setErrorPreThesis(error.message || 'Failed to fetch documents');
      setErrorFinalThesis(error.message || 'Failed to fetch documents');
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoadingProposals(false);
      setLoadingPreThesis(false);
      setLoadingFinalThesis(false);
    }
  }, [apiFetch, router]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/member-login');
      return;
    }

    fetchData();
  }, [fetchData, router]);
  
  const handleReject = (doc: any) => {
    setSelectedDocument(doc);
    setRejectionModal(true);
  };

  const submitRejection = async (recommendation: string) => {
    try {
      const response = await apiFetch('/api/supervisor/reviews', {
        method: 'POST',
        body: JSON.stringify({
          submissionId: selectedDocument.id,
          documentType: selectedDocument.type, // Assuming a 'type' property
          recommendation,
          comments: reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.statusText}`);
      }

      alert(`Review submitted successfully: ${recommendation.toUpperCase()}`);
      fetchData(); // Refresh the data after successful submission
    } catch (error: any) {
      alert(`Error submitting review: ${error.message}`);
      console.error("Error submitting review:", error);
    } finally {
      setRejectionModal(false);
      setReviewText('');
      setSelectedDocument(null);
    }
  };

  const sendToDSC = async (doc: any) => {
    try {
      const response = await apiFetch(`/api/supervisor/documents/${doc.id}/forward-to-dsc`, {
        method: 'POST',
        body: JSON.stringify({
          documentId: doc.id,
          documentType: doc.type, // Assuming a 'type' property
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send document to DSC: ${response.statusText}`);
      }

      alert(`Document "${doc.title}" has been forwarded to DSC for evaluation`);
      fetchData(); // Refresh the data after successful submission
    } catch (error: any) {
      alert(`Error sending document to DSC: ${error.message}`);
      console.error("Error sending document to DSC:", error);
    }
  };

  const handleViewProfile = (studentId: number) => {
    setSelectedStudentId(studentId);
  };

  const handleCloseProfile = () => {
    setSelectedStudentId(null);
  };

  const handlePasswordChange = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    try {
      const response = await apiFetch('/api/supervisor/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to change password: ${response.statusText}`);
      }

      alert('Password changed successfully!');
      // Clear fields only on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      alert(`Error changing password: ${error.message}`);
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <SupervisorMenu sidebarOpen={sidebarOpen} activeTab={activeTab} setActiveTabAction={setActiveTab} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <div className="bg-slate-800/30 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-xl font-bold">Supervisor Dashboard</h1>
                <p className="text-sm text-slate-400">Research Supervision</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">Prof. Supervisor Name</p>
                <p className="text-xs text-slate-400">Supervisor</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              
              {/* Dashboard Home */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Welcome Card */}
                  <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Supervisor Dashboard</h2>
                    <p className="text-orange-100">
                      Guide your PhD students, review their research progress, and provide valuable mentorship.
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">{students.length}</span>
                      </div>
                      <p className="text-sm opacity-90">Active Students</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">
                          {(proposals.length + preThesis.length + finalThesis.length)}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">Pending Reviews</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Send className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">2</span>
                      </div>
                      <p className="text-sm opacity-90">Sent to DSC</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Submissions</h3>
                    <div className="space-y-3">
                      {proposals.slice(0, 3).map(proposal => (
                        <div key={proposal.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                          <div>
                            <p className="font-medium">{proposal.title}</p>
                            <p className="text-sm text-slate-400">{proposal.student} • {proposal.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            proposal.status === 'Pending Review' ? 'bg-yellow-600/20 text-yellow-400' :
                            proposal.status === 'Approved' ? 'bg-green-600/20 text-green-400' :
                            'bg-blue-600/20 text-blue-400'
                          }`}>
                            {proposal.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* My Students Tab */}
              {activeTab === 'students' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">My Students</h2>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">Name</th>
                          <th className="px-6 py-3 font-medium">Email</th>
                          <th className="px-6 py-3 font-medium">Year</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4">{student.name}</td>
                            <td className="px-6 py-4 text-slate-400">{student.email}</td>
                            <td className="px-6 py-4">{student.year}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                                {student.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => handleViewProfile(student.id)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Proposals Tab */}
              {activeTab === 'proposals' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Research Proposals</h2>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">Student</th>
                          <th className="px-6 py-3 font-medium">Title</th>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposals.map(proposal => (
                          <tr key={proposal.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4">{proposal.student}</td>
                            <td className="px-6 py-4 text-slate-300">{proposal.title}</td>
                            <td className="px-6 py-4 text-slate-400">{proposal.date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                proposal.status === 'Pending Review' ? 'bg-yellow-600/20 text-yellow-400' :
                                'bg-green-600/20 text-green-400'
                              }`}>
                                {proposal.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => handleView(proposal)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all">
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button 
                                  onClick={() => handleReject(proposal)}
                                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-all"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                                <button 
                                  onClick={() => sendToDSC(proposal)}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-all"
                                >
                                  <Send className="w-4 h-4" />
                                  Send to DSC
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}



              {/* Pre-Thesis Tab */}
              {activeTab === 'pre-thesis' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Pre-Thesis Submissions</h2>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">Student</th>
                          <th className="px-6 py-3 font-medium">Title</th>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preThesis.map(thesis => (
                          <tr key={thesis.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4">{thesis.student}</td>
                            <td className="px-6 py-4 text-slate-300">{thesis.title}</td>
                            <td className="px-6 py-4 text-slate-400">{thesis.date}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-full text-sm">
                                {thesis.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => handleView(thesis)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all">
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button 
                                  onClick={() => handleReject(thesis)}
                                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-all"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                                <button 
                                  onClick={() => sendToDSC(thesis)}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-all"
                                >
                                  <Send className="w-4 h-4" />
                                  Send to DSC
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Final Thesis Tab */}
              {activeTab === 'final-thesis' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Final Thesis Submissions</h2>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">Student</th>
                          <th className="px-6 py-3 font-medium">Title</th>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalThesis.map(thesis => (
                          <tr key={thesis.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4">{thesis.student}</td>
                            <td className="px-6 py-4 text-slate-300">{thesis.title}</td>
                            <td className="px-6 py-4 text-slate-400">{thesis.date}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">
                                {thesis.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => handleView(thesis)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all">
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button 
                                  onClick={() => handleReject(thesis)}
                                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-all"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                                <button 
                                  onClick={() => sendToDSC(thesis)}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-all"
                                >
                                  <Send className="w-4 h-4" />
                                  Send to DSC
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              <div className="space-y-6">

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter new password (min 8 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={handlePasswordChange}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                

                <div className="flex justify-end">
                  <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Rejection Modal */}
      {rejectionModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Reject Document</h3>
                <p className="text-slate-400 text-sm mt-1">{selectedDocument.title}</p>
                <p className="text-slate-500 text-xs mt-1">Student: {selectedDocument.student}</p>
              </div>
              <button onClick={() => setRejectionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Feedback</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm min-h-32 focus:border-red-500 focus:outline-none"
                  placeholder="Enter your feedback for rejection..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => submitRejection('rejected')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Student Profile Modal */}
      {selectedStudentId !== null && (
        <ViewStudentProfile 
          studentId={selectedStudentId}
          onClose={handleCloseProfile}
        />
      )}

      {/* File Viewer Modal */}
      <FileViewer 
        isOpen={isFileViewerOpen}
        onClose={() => setIsFileViewerOpen(false)}
        fileUrl={fileToViewUrl}
        fileType={fileToViewType}
      />
    </div>
  );
}
