/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: app/co-supervisor-dash/Co-supervisorStudentView.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  UserCheck
} from 'lucide-react';

interface CoSupervisorStudentViewProps {
  studentId: number;
  onClose: () => void;
}

interface StudentData {
  id: number;
  name: string;
  email: string;
  phone: string;
  year: string;
  status: string;
  enrollmentDate: string;
  researchArea: string;
  department: string;
  primarySupervisor: string;
  
  // Academic Progress
  proposals: Array<{
    id: number;
    title: string;
    submittedDate: string;
    status: string;
    primarySupervisorStatus?: string;
  }>;
  
  reports: Array<{
    id: number;
    title: string;
    submittedDate: string;
    status: string;
    grade?: string;
    primarySupervisorStatus?: string;
  }>;
  
  thesis: Array<{
    id: number;
    type: 'pre-thesis' | 'final';
    title: string;
    submittedDate: string;
    status: string;
    primarySupervisorStatus?: string;
  }>;
  
  // Statistics
  stats: {
    totalSubmissions: number;
    approved: number;
    pending: number;
    revisions: number;
  };
}

export default function CoSupervisorStudentView({ studentId, onClose }: CoSupervisorStudentViewProps) {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'proposals' | 'reports' | 'thesis'>('overview');

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  /**
   * Fetch student profile data
   * TODO: BACKEND REQUIRED - Replace with actual API call
   * API Endpoint: GET /api/co-supervisor/students/{studentId}
   * Expected Response: StudentData object
   */
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/co-supervisor/students/${studentId}`);
      // const data = await response.json();
      // setStudentData(data);
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockData: StudentData = {
          id: studentId,
          name: studentId === 1 ? 'Alice Johnson' : studentId === 2 ? 'Bob Smith' : 'Carol White',
          email: studentId === 1 ? 'alice@university.edu' : studentId === 2 ? 'bob@university.edu' : 'carol@university.edu',
          phone: '+1 (555) 123-4567',
          year: studentId === 1 ? '2nd Year' : studentId === 2 ? '3rd Year' : '1st Year',
          status: 'Active',
          enrollmentDate: studentId === 1 ? '2023-09-01' : studentId === 2 ? '2022-09-01' : '2024-09-01',
          researchArea: studentId === 1 ? 'Machine Learning in Healthcare' : studentId === 2 ? 'Quantum Computing' : 'Blockchain Security',
          department: 'Computer Science',
          primarySupervisor: studentId === 1 ? 'Prof. Smith' : studentId === 2 ? 'Prof. Johnson' : 'Prof. Davis',
          proposals: [
            {
              id: 1,
              title: studentId === 1 ? 'ML in Medical Diagnosis' : studentId === 2 ? 'Quantum Algorithms' : 'Blockchain Protocols',
              submittedDate: '2024-01-15',
              status: studentId === 2 ? 'Approved' : 'Pending Review',
              primarySupervisorStatus: studentId === 2 ? 'Approved' : 'Under Review'
            }
          ],
          reports: [
            {
              id: 1,
              title: 'Q1 2024 Progress Report',
              submittedDate: '2024-02-01',
              status: studentId === 2 ? 'Reviewed' : 'Pending Review',
              grade: studentId === 2 ? 'A' : undefined,
              primarySupervisorStatus: studentId === 2 ? 'Reviewed' : 'Under Review'
            }
          ],
          thesis: studentId === 2 ? [
            {
              id: 1,
              type: 'pre-thesis',
              title: 'Pre-Thesis: Quantum Computing Applications',
              submittedDate: '2024-02-15',
              status: 'Under Review',
              primarySupervisorStatus: 'Under Review'
            }
          ] : [],
          stats: {
            totalSubmissions: studentId === 2 ? 8 : studentId === 1 ? 5 : 2,
            approved: studentId === 2 ? 6 : studentId === 1 ? 2 : 0,
            pending: studentId === 2 ? 2 : studentId === 1 ? 3 : 2,
            revisions: studentId === 2 ? 0 : studentId === 1 ? 1 : 0
          }
        };
        
        setStudentData(mockData);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching student data:', error);
      setLoading(false);
    }
  };

  const handleDownload = (documentId: number) => {
    // TODO: BACKEND REQUIRED - Download document
    // API Endpoint: GET /api/documents/{documentId}/download
    console.log('Downloading document:', documentId);
    alert('Download functionality will be implemented with backend');
  };

  const handleView = (documentId: number) => {
    // TODO: BACKEND REQUIRED - View document
    // API Endpoint: GET /api/documents/{documentId}
    console.log('Viewing document:', documentId);
    alert('Document viewer will be implemented with backend');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="text-slate-300 mt-4">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-300 text-center">Failed to load student profile</p>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl w-full max-w-5xl border border-slate-700 my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{studentData.name}</h2>
              <p className="text-slate-400 text-sm mt-1">{studentData.year} • {studentData.department}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                  {studentData.status}
                </span>
                <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Co-Supervisor View
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'proposals', label: 'Proposals' },
            { id: 'reports', label: 'Reports' },
            { id: 'thesis', label: 'Thesis' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeSection === tab.id
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-slate-900/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-sm text-slate-400">Email</p>
                      <p className="text-slate-200">{studentData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-sm text-slate-400">Phone</p>
                      <p className="text-slate-200">{studentData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-sm text-slate-400">Enrollment Date</p>
                      <p className="text-slate-200">{studentData.enrollmentDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-sm text-slate-400">Research Area</p>
                      <p className="text-slate-200">{studentData.researchArea}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-slate-400">Primary Supervisor</p>
                      <p className="text-slate-200 font-medium">{studentData.primarySupervisor}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4">
                  <TrendingUp className="w-6 h-6 opacity-80 mb-2" />
                  <p className="text-2xl font-bold">{studentData.stats.totalSubmissions}</p>
                  <p className="text-sm opacity-90">Total Submissions</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 opacity-80 mb-2" />
                  <p className="text-2xl font-bold">{studentData.stats.approved}</p>
                  <p className="text-sm opacity-90">Approved</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-4">
                  <Clock className="w-6 h-6 opacity-80 mb-2" />
                  <p className="text-2xl font-bold">{studentData.stats.pending}</p>
                  <p className="text-sm opacity-90">Pending</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-4">
                  <AlertCircle className="w-6 h-6 opacity-80 mb-2" />
                  <p className="text-2xl font-bold">{studentData.stats.revisions}</p>
                  <p className="text-sm opacity-90">Revisions</p>
                </div>
              </div>

              {/* Co-Supervisor Note */}
              <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-300">Co-Supervisor Role</p>
                    <p className="text-sm text-slate-400 mt-1">
                      You are viewing this student's profile as a co-supervisor. Primary supervision is handled by {studentData.primarySupervisor}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proposals Section */}
          {activeSection === 'proposals' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Research Proposals</h3>
              {studentData.proposals.length > 0 ? (
                <div className="space-y-3">
                  {studentData.proposals.map((proposal) => (
                    <div key={proposal.id} className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-200">{proposal.title}</h4>
                          <p className="text-sm text-slate-400 mt-1">
                            Submitted: {proposal.submittedDate}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                              proposal.status === 'Approved' ? 'bg-green-600/20 text-green-400' :
                              proposal.status === 'Pending Review' ? 'bg-yellow-600/20 text-yellow-400' :
                              'bg-blue-600/20 text-blue-400'
                            }`}>
                              Co-Supervisor: {proposal.status}
                            </span>
                            {proposal.primarySupervisorStatus && (
                              <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                                Primary: {proposal.primarySupervisorStatus}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(proposal.id)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(proposal.id)}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No proposals submitted yet</p>
                </div>
              )}
            </div>
          )}

          {/* Reports Section */}
          {activeSection === 'reports' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Progress Reports</h3>
              {studentData.reports.length > 0 ? (
                <div className="space-y-3">
                  {studentData.reports.map((report) => (
                    <div key={report.id} className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-200">{report.title}</h4>
                          <p className="text-sm text-slate-400 mt-1">
                            Submitted: {report.submittedDate}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                              report.status === 'Reviewed' ? 'bg-blue-600/20 text-blue-400' :
                              'bg-yellow-600/20 text-yellow-400'
                            }`}>
                              Co-Supervisor: {report.status}
                            </span>
                            {report.primarySupervisorStatus && (
                              <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                                Primary: {report.primarySupervisorStatus}
                              </span>
                            )}
                            {report.grade && (
                              <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                                Grade: {report.grade}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(report.id)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(report.id)}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No reports submitted yet</p>
                </div>
              )}
            </div>
          )}

          {/* Thesis Section */}
          {activeSection === 'thesis' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Thesis Submissions</h3>
              {studentData.thesis.length > 0 ? (
                <div className="space-y-3">
                  {studentData.thesis.map((thesis) => (
                    <div key={thesis.id} className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5 text-teal-400" />
                            <span className="text-sm text-teal-400 font-medium uppercase">
                              {thesis.type === 'pre-thesis' ? 'Pre-Thesis' : 'Final Thesis'}
                            </span>
                          </div>
                          <h4 className="font-medium text-slate-200">{thesis.title}</h4>
                          <p className="text-sm text-slate-400 mt-1">
                            Submitted: {thesis.submittedDate}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                              thesis.status === 'Under Review' ? 'bg-orange-600/20 text-orange-400' :
                              thesis.status === 'Approved' ? 'bg-green-600/20 text-green-400' :
                              'bg-yellow-600/20 text-yellow-400'
                            }`}>
                              Co-Supervisor: {thesis.status}
                            </span>
                            {thesis.primarySupervisorStatus && (
                              <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                                Primary: {thesis.primarySupervisorStatus}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(thesis.id)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(thesis.id)}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No thesis submissions yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}