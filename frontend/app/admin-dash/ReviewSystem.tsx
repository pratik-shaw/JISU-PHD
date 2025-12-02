/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import {
  X, CheckCircle, XCircle, Calendar, User, Mail, FileText,
  Download, MessageSquare, AlertCircle, Filter, Search,
  ChevronDown, ChevronUp
} from 'lucide-react';

interface Application {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  universityId: string;
  applicationType: 'Pre-Thesis' | 'Final Thesis' | 'Registration' | 'Extension';
  submissionDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  documents: { name: string; url: string; size: string; }[];
  description: string;
  proposedSupervisor?: string;
  researchTitle?: string;
  department?: string;
}

interface ReviewSystemProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  onSuccess?: () => void;
}

export default function ReviewSystem({ isOpen, onClose, applicationId, onSuccess }: ReviewSystemProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const mockApplications: Application[] = [
    {
      id: 'APP001',
      studentName: 'Alice Johnson',
      studentEmail: 'alice.johnson@university.edu',
      studentPhone: '+1 234 567 8900',
      universityId: 'STU2024001',
      applicationType: 'Registration',
      submissionDate: '2024-03-01',
      status: 'Pending',
      researchTitle: 'Machine Learning Applications in Healthcare',
      proposedSupervisor: 'Dr. Robert Smith',
      department: 'Computer Science',
      description: 'Application for PhD registration in Machine Learning and AI with focus on healthcare applications.',
      documents: [
        { name: 'Research Proposal.pdf', url: '#', size: '2.4 MB' },
        { name: 'Academic Transcripts.pdf', url: '#', size: '1.2 MB' },
        { name: 'CV.pdf', url: '#', size: '856 KB' }
      ]
    },
    {
      id: 'APP002',
      studentName: 'Bob Smith',
      studentEmail: 'bob.smith@university.edu',
      studentPhone: '+1 234 567 8901',
      universityId: 'STU2024002',
      applicationType: 'Pre-Thesis',
      submissionDate: '2024-02-28',
      status: 'Under Review',
      researchTitle: 'Sustainable Energy Systems',
      proposedSupervisor: 'Dr. Emily Johnson',
      department: 'Engineering',
      description: 'Pre-thesis submission for approval to proceed to comprehensive examination.',
      documents: [
        { name: 'Pre-Thesis Document.pdf', url: '#', size: '5.6 MB' },
        { name: 'Literature Review.pdf', url: '#', size: '3.2 MB' }
      ]
    },
    {
      id: 'APP003',
      studentName: 'Carol White',
      studentEmail: 'carol.white@university.edu',
      studentPhone: '+1 234 567 8902',
      universityId: 'STU2024003',
      applicationType: 'Extension',
      submissionDate: '2024-03-02',
      status: 'Pending',
      researchTitle: 'Quantum Computing Algorithms',
      proposedSupervisor: 'Dr. Michael Brown',
      department: 'Physics',
      description: 'Request for program extension due to unforeseen research complications.',
      documents: [
        { name: 'Extension Request.pdf', url: '#', size: '1.8 MB' },
        { name: 'Progress Report.pdf', url: '#', size: '2.1 MB' },
        { name: 'Supervisor Recommendation.pdf', url: '#', size: '654 KB' }
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchApplications();
    }
  }, [isOpen, applicationId]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/applications');
      // const data = await response.json();
      
      setTimeout(() => {
        setApplications(mockApplications);
        
        // If specific applicationId provided, auto-select and expand that application
        if (applicationId) {
          const app = mockApplications.find(a => a.id === applicationId);
          if (app) {
            setSelectedApplication(app);
            setExpandedCard(app.id);
          }
        }
        
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    setIsLoading(true);
    try {
      // TODO: API call
      // await fetch(`/api/admin/applications/${selectedApplication.id}/approve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ comments: reviewComments })
      // });
      
      setTimeout(() => {
        setApplications(prev =>
          prev.map(app =>
            app.id === selectedApplication.id ? { ...app, status: 'Approved' as const } : app
          )
        );
        
        setIsLoading(false);
        setShowReviewModal(false);
        setReviewComments('');
        setSelectedApplication(null);
        
        if (onSuccess) onSuccess();
        alert('Application approved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error approving application:', error);
      setIsLoading(false);
      alert('Error approving application. Please try again.');
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !reviewComments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setIsLoading(true);
    try {
      // TODO: API call
      
      setTimeout(() => {
        setApplications(prev =>
          prev.map(app =>
            app.id === selectedApplication.id ? { ...app, status: 'Rejected' as const } : app
          )
        );
        
        setIsLoading(false);
        setShowReviewModal(false);
        setReviewComments('');
        setSelectedApplication(null);
        
        if (onSuccess) onSuccess();
        alert('Application rejected successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error rejecting application:', error);
      setIsLoading(false);
      alert('Error rejecting application. Please try again.');
    }
  };

  const openReviewModal = (application: Application, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setReviewAction(action);
    setShowReviewModal(true);
    setReviewComments('');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
      'Under Review': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      'Approved': 'bg-green-600/20 text-green-400 border-green-600/30',
      'Rejected': 'bg-red-600/20 text-red-400 border-red-600/30'
    };
    return colors[status as keyof typeof colors] || 'bg-slate-600/20 text-slate-400 border-slate-600/30';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Registration': 'bg-purple-600/20 text-purple-400',
      'Pre-Thesis': 'bg-blue-600/20 text-blue-400',
      'Final Thesis': 'bg-green-600/20 text-green-400',
      'Extension': 'bg-orange-600/20 text-orange-400'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-600/20 text-slate-400';
  };

  // Filter applications - if applicationId provided, show only that one, otherwise show filtered list
  const displayApplications = applicationId 
    ? applications.filter(app => app.id === applicationId)
    : applications.filter(app => {
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        const matchesType = filterType === 'all' || app.applicationType === filterType;
        const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             app.universityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             app.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
      });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {applicationId ? 'Review Application' : 'Application Review System'}
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              {applicationId ? `Application ID: ${applicationId}` : 'Review and manage student applications'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters - Only show if no specific applicationId */}
        {!applicationId && (
          <div className="p-6 border-b border-slate-700 bg-slate-800/50">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Registration">Registration</option>
                <option value="Pre-Thesis">Pre-Thesis</option>
                <option value="Final Thesis">Final Thesis</option>
                <option value="Extension">Extension</option>
              </select>
            </div>
            <div className="mt-4 text-sm text-slate-400">
              Showing {displayApplications.length} of {applications.length} applications
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : displayApplications.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{application.studentName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(application.applicationType)}`}>
                          {application.applicationType}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {application.universityId}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {application.studentEmail}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCard(expandedCard === application.id ? null : application.id)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {expandedCard === application.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {application.researchTitle && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-400 mb-1">Research Title</p>
                      <p className="text-white font-medium">{application.researchTitle}</p>
                    </div>
                  )}

                  {expandedCard === application.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {application.department && (
                          <div>
                            <p className="text-sm text-slate-400 mb-1">Department</p>
                            <p className="text-white">{application.department}</p>
                          </div>
                        )}
                        {application.proposedSupervisor && (
                          <div>
                            <p className="text-sm text-slate-400 mb-1">Proposed Supervisor</p>
                            <p className="text-white">{application.proposedSupervisor}</p>
                          </div>
                        )}
                        {application.studentPhone && (
                          <div>
                            <p className="text-sm text-slate-400 mb-1">Phone</p>
                            <p className="text-white">{application.studentPhone}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-2">Description</p>
                        <p className="text-white text-sm leading-relaxed">{application.description}</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Attached Documents ({application.documents.length})
                        </p>
                        <div className="space-y-2">
                          {application.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <div>
                                  <p className="text-white text-sm font-medium">{doc.name}</p>
                                  <p className="text-slate-400 text-xs">{doc.size}</p>
                                </div>
                              </div>
                              <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                                <Download className="w-4 h-4 text-slate-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {(application.status === 'Pending' || application.status === 'Under Review') && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
                      <button
                        onClick={() => openReviewModal(application, 'approve')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-all font-medium"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Application
                      </button>
                      <button
                        onClick={() => openReviewModal(application, 'reject')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all font-medium"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Application
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Confirmation Modal */}
      {showReviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl">
            <div className={`p-6 border-b border-slate-700 ${reviewAction === 'approve' ? 'bg-green-600/10' : 'bg-red-600/10'}`}>
              <div className="flex items-center gap-3">
                {reviewAction === 'approve' ? <CheckCircle className="w-8 h-8 text-green-400" /> : <XCircle className="w-8 h-8 text-red-400" />}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {reviewAction === 'approve' ? 'Approve Application' : 'Reject Application'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {selectedApplication.studentName} - {selectedApplication.applicationType}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  {reviewAction === 'approve' ? 'Approval Comments (Optional)' : 'Rejection Reason (Required)'}
                </label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder={reviewAction === 'approve' ? 'Add any comments...' : 'Provide reason for rejection...'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none resize-none"
                  rows={6}
                  required={reviewAction === 'reject'}
                />
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <AlertCircle className="w-4 h-4 inline mr-2 text-yellow-400" />
                  {reviewAction === 'approve'
                    ? 'The student will be notified via email about the approval.'
                    : 'The student will be notified via email about the rejection.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewComments('');
                    setReviewAction(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={reviewAction === 'approve' ? handleApprove : handleReject}
                  className={`flex-1 px-4 py-3 rounded-lg transition-all font-medium flex items-center justify-center gap-2 ${
                    reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={isLoading || (reviewAction === 'reject' && !reviewComments.trim())}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {reviewAction === 'approve' ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Confirm Approval
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          Confirm Rejection
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}