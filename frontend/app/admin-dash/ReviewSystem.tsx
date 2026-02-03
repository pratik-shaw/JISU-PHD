/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import {
  X, CheckCircle, XCircle, Calendar, User, Mail, FileText,
  Download, MessageSquare, AlertCircle, Filter, Search,
  ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import { useApi } from '@/app/hooks/useApi';
import FileViewer from '@/app/components/FileViewer'; // Import FileViewer

interface Application {
  id: number;
  student_id: number;
  student_name: string; // From JOIN in backend
  type: string; // 'Application'
  status: 'pending' | 'approved' | 'rejected'; // Adjusted to match backend enum
  submission_date: string;
  title: string; // Maps to researchTitle from previous mock
  abstract: string; // Maps to description from previous mock
  document_url?: string;
}

interface ReviewSystemProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: number; // Changed to number to match backend
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

  const apiFetch = useApi(); // Initialize useApi
  
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [fileToViewUrl, setFileToViewUrl] = useState('');
  const [fileToViewType, setFileToViewType] = useState('');

  useEffect(() => {
    console.log('ReviewSystem useEffect triggered. isOpen:', isOpen, 'applicationId:', applicationId);
    if (isOpen) {
      fetchApplications();
    }
  }, [isOpen, applicationId]);

  const fetchApplications = async () => {
    console.log('Entering fetchApplications');
    setIsLoading(true);
    try {
      let response;
      let data;
      if (applicationId) {
        const url = `/api/applications/${applicationId}`;
        console.log('API call URL:', url);
        response = await apiFetch(url);
        console.log('API Response:', response);
        data = await response.json();
        console.log('Parsed Data:', data);
        if (data.success) {
          setApplications([data.data]);
          setSelectedApplication(data.data);
          setExpandedCard(data.data.id.toString());
          console.log('Fetched single application data:', data);
          console.log('Applications state after setting:', [data.data]);
        }
      } else {
        const url = `/api/applications`;
        console.log('API call URL:', url);
        response = await apiFetch(url);
        console.log('API Response:', response);
        data = await response.json();
        console.log('Parsed Data:', data);
        if (data.success) {
          setApplications(data.data);
          console.log('Fetched all applications data:', data);
          console.log('Applications state after setting:', data.data);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    setIsLoading(true);
    try {
      const response = await apiFetch(`/api/applications/${selectedApplication.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'approved', comment: reviewComments })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve application');
      }
      
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApplication.id ? { ...app, status: 'approved' as const } : app
        )
      );
      
      setIsLoading(false);
      setShowReviewModal(false);
      setReviewComments('');
      setSelectedApplication(null);
      
      if (onSuccess) onSuccess();
      alert('Application approved successfully!');
    } catch (error: any) {
      console.error('Error approving application:', error);
      setIsLoading(false);
      alert(`Error: ${error.message}`);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !reviewComments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiFetch(`/api/applications/${selectedApplication.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'rejected', comment: reviewComments })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject application');
      }
      
      setApplications(prev =>
        prev.map(app =>
          app.id === selectedApplication.id ? { ...app, status: 'rejected' as const } : app
        )
      );
      
      setIsLoading(false);
      setShowReviewModal(false);
      setReviewComments('');
      setSelectedApplication(null);
      
      if (onSuccess) onSuccess();
      alert('Application rejected successfully!');
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      setIsLoading(false);
      alert(`Error: ${error.message}`);
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
      'pending': 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
      'approved': 'bg-green-600/20 text-green-400 border-green-600/30',
      'rejected': 'bg-red-600/20 text-red-400 border-red-600/30'
    };
    return colors[status as keyof typeof colors] || 'bg-slate-600/20 text-slate-400 border-slate-600/30';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Application': 'bg-purple-600/20 text-purple-400',
    };
    return colors[type as keyof typeof colors] || 'bg-slate-600/20 text-slate-400';
  };

  // Filter applications - if applicationId provided, show only that one, otherwise show filtered list
  const displayApplications = applicationId 
    ? applications.filter(app => app.id === applicationId)
    : applications.filter(app => {
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        const matchesType = filterType === 'all' || app.type === filterType;
        const matchesSearch = app.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             app.id.toString().includes(searchQuery.toLowerCase());
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
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Application">Application</option>
                <option value="Pre-Thesis">Pre-Thesis</option>
                <option value="Final Thesis">Final Thesis</option>
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
                console.log('Rendering application:', application),
                <div
                  key={application.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{application.student_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(application.type)}`}>
                          {application.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Submitted: {new Date(application.submission_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCard(expandedCard === application.id.toString() ? null : application.id.toString())}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {expandedCard === application.id.toString() ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {application.title && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-400 mb-1">Title</p>
                      <p className="text-white font-medium">{application.title}</p>
                    </div>
                  )}

                  {expandedCard === application.id.toString() && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                      {application.abstract && (
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Abstract</p>
                          <p className="text-white text-sm leading-relaxed">{application.abstract}</p>
                        </div>
                      )}

                      {application.document_url && (
                        console.log('application.document_url:', application.document_url),
                        <div>
                          <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Attached Document
                          </p>
                          <button 
                            onClick={async () => {
                              try {
                                const res = await apiFetch(`/api/admin/submissions/${application.id}/view`);
                                const blob = await res.blob();
                                const blobUrl = URL.createObjectURL(blob);
                                setFileToViewUrl(blobUrl);
                                setFileToViewType(application.document_url!.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'); // Basic inference
                                setIsFileViewerOpen(true);
                              } catch (error) {
                                console.error('Error fetching document for viewing:', error);
                                alert('Failed to load document for viewing.');
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all text-sm flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View File
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {(application.status === 'pending') && (
                    console.log('application.status (for buttons):', application.status),
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
                    {selectedApplication.student_name} - {selectedApplication.type}
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
