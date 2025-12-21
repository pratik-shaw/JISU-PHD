/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useApi } from '@/app/hooks/useApi';
import { X, FileText, Download, CheckCircle, XCircle, Clock, User, Calendar, AlertCircle, Eye, MessageSquare } from 'lucide-react';

interface ReviewSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId?: number;
  onSuccess: () => void;
}

export default function ReviewSubmission({ isOpen, onClose, submissionId, onSuccess }: ReviewSubmissionProps) {
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [adminComments, setAdminComments] = useState('');
  const [loading, setLoading] = useState(false);
  const apiFetch = useApi();

  useEffect(() => {
    if (isOpen && submissionId) {
      const fetchSubmission = async () => {
        try {
          const response = await apiFetch(`/api/admin/submissions/${submissionId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch submission');
          }
          const data = await response.json();
          setActiveSubmission(data.data);
        } catch (error) {
          console.error('Failed to fetch submission:', error);
        }
      };
      fetchSubmission();
    }
  }, [isOpen, submissionId, apiFetch]);

  const handleSubmitReview = async () => {
    if (!decision) {
      alert('Please select Approve or Reject');
      return;
    }

    if (!adminComments.trim()) {
      alert('Please provide comments for your decision');
      return;
    }

    setLoading(true);

    console.log('Submitting review for submission ID:', activeSubmission.id);

    try {
      const response = await apiFetch(`/api/admin/submissions/${activeSubmission.id}/review`, {
        method: 'POST',
        body: JSON.stringify({
          decision,
          adminComments,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      alert(`Submission ${decision === 'approved' ? 'approved' : 'rejected'} successfully!`);
      onSuccess();
      onClose(); // Close the modal after successful review
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (docName: string) => {
    alert(`Downloading ${docName}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-600/20';
      case 'rejected': return 'text-red-400 bg-red-600/20';
      case 'pending': return 'text-yellow-400 bg-yellow-600/20';
      default: return 'text-slate-400 bg-slate-600/20';
    }
  };

  const handleClose = () => {
    setActiveSubmission(null);
    setDecision(null);
    setAdminComments('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Review Submission
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Submission ID: {activeSubmission?.id}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSubmission ? (
            <div className="space-y-6">
              {/* Submission Details */}
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium">
                        {activeSubmission?.type}
                      </span>
                      <span className="text-sm text-slate-400">ID: {activeSubmission?.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{activeSubmission?.title}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-300">
                        <span className="text-slate-400">Student ID:</span> {activeSubmission?.student_id}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-slate-400">Submitted:</span> {new Date(activeSubmission?.submission_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Comments */}
                <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Abstract
                  </p>
                  <p className="text-sm text-slate-200">{activeSubmission?.abstract}</p>
                </div>

                {/* Documents */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Submitted Documents</h4>
                  <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="text-sm font-medium text-white">{activeSubmission.document_url}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(activeSubmission.document_url)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                  </div>
                </div>
              </div>

              {/* Admin Review Section */}
              {activeSubmission?.status === 'pending' ? (
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Admin Review Required
                  </h4>

                  {/* Decision Buttons */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Your Decision
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setDecision('approved')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                          decision === 'approved'
                            ? 'bg-green-600 text-white border-2 border-green-400'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Submission
                      </button>
                      <button
                        onClick={() => setDecision('rejected')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                          decision === 'rejected'
                            ? 'bg-red-600 text-white border-2 border-red-400'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Submission
                      </button>
                    </div>
                  </div>

                  {/* Admin Comments */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Admin Comments <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={adminComments}
                      onChange={(e) => setAdminComments(e.target.value)}
                      placeholder="Provide detailed feedback for your decision..."
                      rows={6}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={handleClose}
                      className="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={!decision || !adminComments.trim() || loading}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // Already Reviewed
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Admin Review</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Decision:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeSubmission?.status)}`}>
                        {activeSubmission?.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Comments:</p>
                      <p className="text-sm text-slate-200">{adminComments}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading submission...</p>
          )}
        </div>
      </div>
    </div>
  );
}