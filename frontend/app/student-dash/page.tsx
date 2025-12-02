'use client';

import { useState } from 'react';
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
  Download
} from 'lucide-react';

interface Submission {
  id: number;
  title: string;
  type: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review' | 'Revision Required';
  remarks?: string;
}

export default function StudentDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Mock data - Replace with API calls
  const applications: Submission[] = [
    { id: 1, title: 'PhD Application Form', type: 'Application', date: '2024-01-15', status: 'Approved', remarks: 'Application accepted. Please proceed with proposal.' },
    { id: 2, title: 'Entrance Exam Scores', type: 'Document', date: '2024-01-10', status: 'Approved' },
    { id: 3, title: 'Academic Transcripts', type: 'Document', date: '2024-01-12', status: 'Under Review' },
  ];

  const proposals: Submission[] = [
    { id: 1, title: 'Research Proposal - Initial', type: 'Proposal', date: '2024-02-01', status: 'Approved', remarks: 'Well structured proposal. Proceed to next phase.' },
    { id: 2, title: 'Progress Report - Month 3', type: 'Report', date: '2024-05-01', status: 'Approved' },
    { id: 3, title: 'Progress Report - Month 6', type: 'Report', date: '2024-08-01', status: 'Revision Required', remarks: 'Please add more details on methodology section.' },
    { id: 4, title: 'Progress Report - Month 9', type: 'Report', date: '2024-11-01', status: 'Under Review' },
  ];

  const preThesis: Submission[] = [
    { id: 1, title: 'Pre-Thesis Document', type: 'Pre-Thesis', date: '2024-10-15', status: 'Under Review', remarks: 'Submitted to supervisor for initial review.' },
  ];

  const finalThesis: Submission[] = [
    { id: 1, title: 'Final Thesis Submission', type: 'Final Thesis', date: '2024-12-01', status: 'Pending', remarks: 'Awaiting final approval from DSC.' },
  ];

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    console.log('Uploading:', { type: uploadType, file: selectedFile });
    alert(`${uploadType} uploaded successfully!`);
    setUploadModal(false);
    setSelectedFile(null);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data
      // localStorage.removeItem('authToken'); // Uncomment when you have auth
      // sessionStorage.clear(); // Uncomment if needed
      
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const viewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewModal(true);
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
                      {[...applications, ...proposals, ...preThesis, ...finalThesis].filter(s => s.status === 'Approved').length}
                    </span>
                  </div>
                  <p className="text-sm">Approved</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <Clock className="w-8 h-8" />
                    <span className="text-3xl font-bold">
                      {[...applications, ...proposals, ...preThesis, ...finalThesis].filter(s => s.status === 'Under Review').length}
                    </span>
                  </div>
                  <p className="text-sm">Under Review</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <AlertCircle className="w-8 h-8" />
                    <span className="text-3xl font-bold">
                      {[...applications, ...proposals, ...preThesis, ...finalThesis].filter(s => s.status === 'Revision Required').length}
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
                          <button 
                            onClick={() => viewSubmission(app)}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
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
                          <button 
                            onClick={() => viewSubmission(prop)}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
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
                            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <button 
                              onClick={() => viewSubmission(thesis)}
                              className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              Status
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Final Thesis Submission</h2>
                <button 
                  onClick={() => { setUploadType('Final Thesis'); setUploadModal(true); }}
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
                            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <button 
                              onClick={() => viewSubmission(thesis)}
                              className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              Status
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
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter current password"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter new password"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="Confirm new password"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
                      Update Password
                    </button>
                  </div>
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
    </div>
  );
}