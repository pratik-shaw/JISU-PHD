/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: app/co-supervisor-dash/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CoSupervisorMenu from '@/app/co-supervisor-dash/Co-supervisor-menu';
import CoSupervisorStudentView from '@/app/co-supervisor-dash/Co-supervisorStudentView';
import {
  UserCheck,
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
 * Co-Supervisor Dashboard Page
 * Role: PhD Co-Supervisor
 * 
 * Responsibilities:
 * - Provide additional guidance to PhD students
 * - Review research proposals and progress
 * - Support the primary supervisor
 * - Offer specialized expertise in specific areas
 * - Participate in student evaluations
 * - Send reviewed documents to primary supervisor
 */
export default function CoSupervisorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Mock data - Replace with actual API calls
  const students = [
    { id: 1, name: 'Alice Johnson', email: 'alice@university.edu', year: '2nd Year', status: 'Active', primarySupervisor: 'Prof. Smith' },
    { id: 2, name: 'Bob Smith', email: 'bob@university.edu', year: '3rd Year', status: 'Active', primarySupervisor: 'Prof. Johnson' },
    { id: 3, name: 'Carol White', email: 'carol@university.edu', year: '1st Year', status: 'Active', primarySupervisor: 'Prof. Davis' },
  ];

  const proposals = [
    { id: 1, student: 'Alice Johnson', title: 'Machine Learning in Healthcare', date: '2024-01-15', status: 'Pending Review', supervisor: 'Prof. Smith' },
    { id: 2, student: 'Bob Smith', title: 'Quantum Computing Applications', date: '2024-01-10', status: 'Approved', supervisor: 'Prof. Johnson' },
    { id: 3, student: 'Carol White', title: 'Blockchain Security', date: '2024-01-20', status: 'Pending Review', supervisor: 'Prof. Davis' },
  ];

  const reports = [
    { id: 1, student: 'Alice Johnson', title: 'Quarterly Progress Report Q1', date: '2024-02-01', status: 'Pending Review', supervisor: 'Prof. Smith' },
    { id: 2, student: 'Bob Smith', title: 'Annual Research Report', date: '2024-01-25', status: 'Reviewed', supervisor: 'Prof. Johnson' },
  ];

  const preThesis = [
    { id: 1, student: 'Bob Smith', title: 'Pre-Thesis Submission', date: '2024-02-15', status: 'Under Review', supervisor: 'Prof. Johnson' },
  ];

  const finalThesis = [
    { id: 1, student: 'Bob Smith', title: 'Final Thesis: Quantum Computing', date: '2024-03-01', status: 'Pending Review', supervisor: 'Prof. Johnson' },
  ];

  const handleReview = (doc: any) => {
    setSelectedDocument(doc);
    setReviewModal(true);
  };

  const handlePasswordChange = () => {
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

    // Here you would make an API call to change the password
    console.log('Changing password...');
    alert('Password changed successfully!');
    
    // Clear fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const submitReview = (recommendation: string) => {
    // TODO: BACKEND REQUIRED - Submit review to API
    console.log('Review submitted:', {
      document: selectedDocument,
      recommendation,
      comments: reviewText
    });
    alert(`Review submitted: ${recommendation.toUpperCase()}`);
    setReviewModal(false);
    setReviewText('');
    setSelectedDocument(null);
  };

  const sendToSupervisor = (doc: any) => {
    // TODO: BACKEND REQUIRED - Send document to primary supervisor
    console.log('Sending to Supervisor:', doc);
    alert(`Document "${doc.title}" has been forwarded to ${doc.supervisor} (Primary Supervisor) for evaluation`);
  };

  const handleViewStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
  };

  const handleCloseStudentView = () => {
    setSelectedStudentId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <CoSupervisorMenu sidebarOpen={sidebarOpen} activeTab={activeTab} onTabChangeAction={setActiveTab} />

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
                <h1 className="text-xl font-bold">Co-Supervisor Dashboard</h1>
                <p className="text-sm text-slate-400">Research Co-Supervision</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">Dr. Co-Supervisor Name</p>
                <p className="text-xs text-slate-400">Co-Supervisor</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
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
                  <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Co-Supervisor Dashboard</h2>
                    <p className="text-teal-100">
                      Support PhD students with specialized expertise, review research work, and collaborate with primary supervisors.
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
                          {proposals.filter(p => p.status === 'Pending Review').length + 
                           reports.filter(r => r.status === 'Pending Review').length}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">Pending Reviews</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">
                          {proposals.filter(p => p.status === 'Approved').length}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">Approved</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Send className="w-8 h-8 opacity-80" />
                        <span className="text-3xl font-bold">2</span>
                      </div>
                      <p className="text-sm opacity-90">Sent to Supervisor</p>
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
                            <p className="text-sm text-slate-400">{proposal.student} • Primary: {proposal.supervisor} • {proposal.date}</p>
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
                          <th className="px-6 py-3 font-medium">Primary Supervisor</th>
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
                            <td className="px-6 py-4 text-slate-300">{student.primarySupervisor}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                                {student.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => handleViewStudent(student.id)}
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
                          <th className="px-6 py-3 font-medium">Primary Supervisor</th>
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
                            <td className="px-6 py-4 text-slate-400">{proposal.supervisor}</td>
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
                                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all">
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button 
                                  onClick={() => handleReview(proposal)}
                                  className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 rounded text-sm transition-all"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Review
                                </button>
                                <button 
                                  onClick={() => sendToSupervisor(proposal)}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-all"
                                >
                                  <Send className="w-4 h-4" />
                                  Send to Supervisor
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

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Progress Reports</h2>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">Student</th>
                          <th className="px-6 py-3 font-medium">Title</th>
                          <th className="px-6 py-3 font-medium">Primary Supervisor</th>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map(report => (
                          <tr key={report.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4">{report.student}</td>
                            <td className="px-6 py-4 text-slate-300">{report.title}</td>
                            <td className="px-6 py-4 text-slate-400">{report.supervisor}</td>
                            <td className="px-6 py-4 text-slate-400">{report.date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                report.status === 'Pending Review' ? 'bg-yellow-600/20 text-yellow-400' :
                                'bg-blue-600/20 text-blue-400'
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all">
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button 
                                  onClick={() => handleReview(report)}
                                  className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 rounded text-sm transition-all"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Review
                                </button>
                                <button 
                                  onClick={() => sendToSupervisor(report)}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-all"
                                >
                                  <Send className="w-4 h-4" />
                                  Send to Supervisor
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
                          <th className="px-6 py-3 font-medium">Primary Supervisor</th>
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
                            <td className="px-6 py-4 text-slate-400">{thesis.supervisor}</td>
                            <td className="px-6 py-4 text-slate-400">{thesis.date}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-full text-sm">
                                {thesis.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all">
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                                <button 
                                  onClick={() => handleReview(thesis)}
                                  className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 rounded text-sm transition-all"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Review
                                </button>
                                <button 
                                  onClick={() => sendToSupervisor(thesis)}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-all"
                                >
                                  <Send className="w-4 h-4" />
                                  Send to Supervisor
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
                          <th className="px-6 py-3 font-medium">Primary Supervisor</th>
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
                            <td className="px-6 py-4 text-slate-400">{thesis.supervisor}</td>
                            <td className="px-6 py-4 text-slate-400">{thesis.date}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">
                                {thesis.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all">
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                                <button 
                                  onClick={() => handleReview(thesis)}
                                  className="flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 rounded text-sm transition-all"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Review
                                </button>
                                <button 
                                  onClick={() => sendToSupervisor(thesis)}
                                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-all"
                                >
                                  <Send className="w-4 h-4" />
                                  Send to Supervisor
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

      {/* Review Modal */}
      {reviewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Review Document</h3>
                <p className="text-slate-400 text-sm mt-1">{selectedDocument.title}</p>
                <p className="text-slate-500 text-xs mt-1">Student: {selectedDocument.student}</p>
                <p className="text-slate-500 text-xs">Primary Supervisor: {selectedDocument.supervisor}</p>
              </div>
              <button onClick={() => setReviewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Co-Supervisor Review Comments</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm min-h-32 focus:border-teal-500 focus:outline-none"
                  placeholder="Enter your review comments, feedback, and specialized insights..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => submitReview('approved')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button 
                  onClick={() => submitReview('revision')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all"
                >
                  <AlertCircle className="w-4 h-4" />
                  Request Revision
                </button>
                <button 
                  onClick={() => submitReview('concerns')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Has Concerns
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Student Profile View */}
      {/* Student Profile Modal */}
            {selectedStudentId !== null && (
              <CoSupervisorStudentView 
                studentId={selectedStudentId}
                onClose={handleCloseStudentView}
              />
            )}
    </div>
  );
}