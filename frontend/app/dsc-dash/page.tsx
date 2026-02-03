'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/app/hooks/useApi';
import {
  Menu,
  X,
  Users,
  Clock,
  CheckCircle,
  Send,
  Eye,
  MessageSquare,
  Download,
  FileCheck,
  AlertCircle,
  XCircle,
} from 'lucide-react';

// ... (keep the rest of the interfaces)

export default function DSCDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [proposals, setProposals] = useState<Document[]>([]);
  const [reports, setReports] = useState<Document[]>([]);
  const [preThesis, setPreThesis] = useState<Document[]>([]);
  const [finalThesis, setFinalThesis] = useState<Document[]>([]);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [preThesisPendingDscApprovalCount, setPreThesisPendingDscApprovalCount] = useState(0);
  const [finalThesisPendingDscApprovalCount, setFinalThesisPendingDscApprovalCount] = useState(0);

  const apiFetch = useApi();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/member-login');
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch('/api/dsc-member/documents');
        const data = await res.json();
        if (data.success) {
          setProposals(data.data.filter((doc: any) => doc.type === 'proposal' && doc.status === 'pending_dsc_approval'));
          setReports(data.data.filter((doc: any) => doc.type === 'report' && doc.status === 'pending_dsc_approval'));
          setPreThesis(data.data.filter((doc: any) => doc.type === 'pre-thesis' && doc.status === 'pending_dsc_approval'));
          setFinalThesis(data.data.filter((doc: any) => doc.type === 'final-thesis' && doc.status === 'pending_dsc_approval'));
          setPendingReviewsCount(data.pendingReviewsCount);
          setApprovedCount(data.approvedCount); 
          setPreThesisPendingDscApprovalCount(data.preThesisPendingDscApprovalCount);
          setFinalThesisPendingDscApprovalCount(data.finalThesisPendingDscApprovalCount);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [apiFetch]);

  const handleReview = (doc: Document) => {
    setSelectedDocument(doc);
    setReviewModal(true);
  };

  const submitReview = async (decision: string) => {
    try {
      await apiFetch('/api/dsc-member/reviews', {
        method: 'POST',
        body: JSON.stringify({
          documentId: selectedDocument?.id,
          decision,
          comments: reviewText,
        }),
      });
      alert(`Review submitted: ${decision.toUpperCase()}`);
      setReviewModal(false);
      setReviewText('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    }
  };

  const sendToAdmin = async (doc: Document) => {
    try {
      await apiFetch(`/dsc-member/documents/${doc.id}/forward`, {
        method: 'POST',
      });
      alert(`"${doc.title}" has been approved and sent to Admin for final approval`);
    } catch (error) {
      console.error('Failed to forward document:', error);
      alert('Failed to forward document');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      router.push('/');
    }
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
      await apiFetch('/api/me/password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword: currentPassword, newPassword: newPassword }),
      });
      alert('Password changed successfully!');
      
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-slate-800/50 border-r border-slate-700 transition-all overflow-hidden`}>
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-6 text-emerald-400">DSC Portal</h2>
          <nav className="space-y-2 flex-1">
            {[
              { label: 'Dashboard', tab: 'dashboard' },
              { label: 'Proposals', tab: 'proposals' },
              { label: 'Reports', tab: 'reports' },
              { label: 'Pre-Thesis', tab: 'pre-thesis' },
              { label: 'Final Thesis', tab: 'final-thesis' },
              { label: 'Settings', tab: 'settings' },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === item.tab ? 'bg-emerald-600' : 'hover:bg-slate-700/50'
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
              <h1 className="text-xl font-bold">DSC Dashboard</h1>
              <p className="text-sm text-slate-400">Departmental Scrutiny Committee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Dr. DSC Faculty</p>
              <p className="text-xs text-slate-400">DSC Member</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-2">Welcome to DSC Dashboard</h2>
                <p className="text-emerald-100">Review and approve research documents at the departmental level.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <Clock className="w-8 h-8" />
                    <span className="text-3xl font-bold">{pendingReviewsCount}</span>
                  </div>
                  <p className="text-sm">Pending Reviews</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-3xl font-bold">{approvedCount}</span>
                  </div>
                  <p className="text-sm">Approved</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <FileCheck className="w-8 h-8" />
                    <span className="text-3xl font-bold">{preThesisPendingDscApprovalCount + finalThesisPendingDscApprovalCount}</span>
                  </div>
                  <p className="text-sm">Thesis Reviews</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <Send className="w-8 h-8" />
                    <span className="text-3xl font-bold">1</span>
                  </div>
                  <p className="text-sm">Sent to Admin</p>
                </div>
              </div>
            </div>
          )}

          {/* Proposals */}
          {activeTab === 'proposals' && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Research Proposals</h2>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">Supervisor</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map(p => (
                      <tr key={p.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                        <td className="px-6 py-4">{p.student}</td>
                        <td className="px-6 py-4 text-slate-400">{p.supervisor}</td>
                        <td className="px-6 py-4">{p.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${p.status === 'under_review' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-blue-600/20 text-blue-400'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button onClick={() => handleReview(p)} className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm">
                              <MessageSquare className="w-4 h-4" />
                              Review
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

          {/* Reports */}
          {activeTab === 'reports' && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Progress Reports</h2>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">Supervisor</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(r => (
                      <tr key={r.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                        <td className="px-6 py-4">{r.student}</td>
                        <td className="px-6 py-4 text-slate-400">{r.supervisor}</td>
                        <td className="px-6 py-4">{r.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">{r.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button onClick={() => handleReview(r)} className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm">
                              <MessageSquare className="w-4 h-4" />
                              Review
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

          {/* Pre-Thesis */}
          {activeTab === 'pre-thesis' && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Pre-Thesis Submissions</h2>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">Supervisor</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preThesis.map(t => (
                      <tr key={t.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                        <td className="px-6 py-4">{t.student}</td>
                        <td className="px-6 py-4 text-slate-400">{t.supervisor}</td>
                        <td className="px-6 py-4">{t.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-full text-sm">{t.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <button onClick={() => handleReview(t)} className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm">
                              <MessageSquare className="w-4 h-4" />
                              Review
                            </button>
                            <button onClick={() => sendToAdmin(t)} className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                              <Send className="w-4 h-4" />
                              Send to Admin
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

          {/* Final Thesis */}
          {activeTab === 'final-thesis' && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Final Thesis Submissions</h2>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/30">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">Supervisor</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalThesis.map(t => (
                      <tr key={t.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                        <td className="px-6 py-4">{t.student}</td>
                        <td className="px-6 py-4 text-slate-400">{t.supervisor}</td>
                        <td className="px-6 py-4">{t.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">{t.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <button onClick={() => handleReview(t)} className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm">
                              <MessageSquare className="w-4 h-4" />
                              Review
                            </button>
                            <button onClick={() => sendToAdmin(t)} className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                              <Send className="w-4 h-4" />
                              Send to Admin
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

          {/* Settings */}
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
      </main>

      {/* Review Modal */}
      {reviewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">DSC Review</h3>
                <p className="text-slate-400 text-sm mt-1">{selectedDocument.title}</p>
                <p className="text-slate-500 text-xs mt-1">Student: {selectedDocument.student}</p>
              </div>
              <button onClick={() => setReviewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Review Comments</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm min-h-32 focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter your departmental review comments..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => submitReview('approved')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button 
                  onClick={() => submitReview('revision')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4" />
                  Request Revision
                </button>
                <button 
                  onClick={() => submitReview('rejected')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
