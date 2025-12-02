/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { X, FileText, Download, CheckCircle, XCircle, Clock, User, Calendar, AlertCircle, Eye, MessageSquare } from 'lucide-react';

interface ReviewSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId?: string;
  onSuccess: () => void;
}

export default function ReviewSubmission({ isOpen, onClose, submissionId, onSuccess }: ReviewSubmissionProps) {
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState<'list' | 'review'>('list');
  const [filterType, setFilterType] = useState<'all' | 'pre-thesis' | 'final-thesis'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [adminComments, setAdminComments] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock submissions data
  const allSubmissions = [
    {
      id: 'SUB001',
      studentName: 'Alice Johnson',
      studentId: 'STU001',
      email: 'alice@university.edu',
      type: 'pre-thesis',
      title: 'Machine Learning Applications in Healthcare Diagnostics',
      submittedDate: '2024-03-01',
      status: 'pending',
      supervisor: 'Dr. Robert Smith',
      coSupervisor: 'Dr. Emily Johnson',
      dscCommittee: 'DSC Committee A',
      documents: [
        { name: 'Pre-Thesis Proposal.pdf', size: '2.4 MB', type: 'proposal' },
        { name: 'Research Plan.pdf', size: '1.8 MB', type: 'research-plan' },
        { name: 'Literature Review.pdf', size: '3.2 MB', type: 'literature' },
      ],
      studentComments: 'This pre-thesis proposal outlines my research on applying machine learning algorithms to improve early disease detection in healthcare systems.',
      supervisorApproval: 'approved',
      supervisorComments: 'Excellent research proposal with clear methodology and objectives.',
      coSupervisorApproval: 'approved',
      coSupervisorComments: 'Well-structured proposal. Looking forward to seeing the results.',
    },
    {
      id: 'SUB002',
      studentName: 'Bob Smith',
      studentId: 'STU002',
      email: 'bob@university.edu',
      type: 'final-thesis',
      title: 'Quantum Computing Algorithms for Optimization Problems',
      submittedDate: '2024-02-28',
      status: 'pending',
      supervisor: 'Dr. Sarah Davis',
      coSupervisor: null,
      dscCommittee: 'DSC Committee B',
      documents: [
        { name: 'Final Thesis.pdf', size: '15.6 MB', type: 'thesis' },
        { name: 'Research Data.zip', size: '45.2 MB', type: 'data' },
        { name: 'Publications.pdf', size: '5.4 MB', type: 'publications' },
      ],
      studentComments: 'Final thesis submission with complete research findings, experimental data, and published papers.',
      supervisorApproval: 'approved',
      supervisorComments: 'Outstanding work. The student has made significant contributions to the field.',
      coSupervisorApproval: null,
      coSupervisorComments: null,
    },
    {
      id: 'SUB003',
      studentName: 'Carol White',
      studentId: 'STU003',
      email: 'carol@university.edu',
      type: 'pre-thesis',
      title: 'Sustainable Energy Solutions for Urban Development',
      submittedDate: '2024-03-02',
      status: 'approved',
      supervisor: 'Dr. Michael Brown',
      coSupervisor: 'Dr. Lisa Anderson',
      dscCommittee: 'DSC Committee C',
      documents: [
        { name: 'Pre-Thesis Proposal.pdf', size: '2.1 MB', type: 'proposal' },
        { name: 'Methodology.pdf', size: '1.5 MB', type: 'methodology' },
      ],
      studentComments: 'Research proposal focusing on renewable energy integration in smart cities.',
      supervisorApproval: 'approved',
      supervisorComments: 'Timely and relevant research topic.',
      coSupervisorApproval: 'approved',
      coSupervisorComments: 'Good interdisciplinary approach.',
      adminDecision: 'approved',
      adminComments: 'Approved for pre-thesis phase. Excellent proposal.',
      reviewedDate: '2024-03-03',
    },
  ];

  // Effect to handle when a specific submission ID is passed
  useEffect(() => {
    if (isOpen && submissionId) {
      // Find the submission by ID
      const submission = allSubmissions.find(sub => sub.id === submissionId);
      if (submission) {
        handleReviewSubmission(submission);
      }
    } else if (isOpen && !submissionId) {
      // Reset to list view when no specific submission is selected
      setReviewMode('list');
      setActiveSubmission(null);
    }
  }, [isOpen, submissionId]);

  const filteredSubmissions = allSubmissions.filter(sub => {
    const typeMatch = filterType === 'all' || sub.type === filterType;
    const statusMatch = filterStatus === 'all' || sub.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const handleReviewSubmission = (submission: any) => {
    setActiveSubmission(submission);
    setReviewMode('review');
    setDecision(null);
    setAdminComments('');
  };

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

    // TODO: BACKEND REQUIRED - Submit review decision
    // POST /api/admin/submissions/review
    // Body: { submissionId, decision, adminComments }
    
    setTimeout(() => {
      console.log('Submitting review:', {
        submissionId: activeSubmission.id,
        decision,
        adminComments,
      });
      
      alert(`Submission ${decision === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setLoading(false);
      setReviewMode('list');
      setActiveSubmission(null);
      onSuccess();
      onClose(); // Close the modal after successful review
    }, 1500);
  };

  const handleDownload = (docName: string) => {
    // TODO: BACKEND REQUIRED - Download document
    // GET /api/admin/submissions/documents/:id
    console.log('Downloading:', docName);
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

  const getApprovalIcon = (approval: string | null) => {
    switch (approval) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const handleClose = () => {
    setReviewMode('list');
    setActiveSubmission(null);
    setDecision(null);
    setAdminComments('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {reviewMode === 'list' ? 'Submission Review System' : 'Review Submission'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {reviewMode === 'list' 
                ? 'Review and approve pre-thesis and final thesis submissions' 
                : `${activeSubmission?.type === 'pre-thesis' ? 'Pre-Thesis' : 'Final Thesis'} Submission`}
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
          {reviewMode === 'list' ? (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Submission Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="pre-thesis">Pre-Thesis</option>
                    <option value="final-thesis">Final Thesis</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <div className="text-2xl font-bold text-white">{allSubmissions.length}</div>
                  <div className="text-sm text-slate-400">Total Submissions</div>
                </div>
                <div className="bg-yellow-600/10 rounded-lg p-4 border border-yellow-600/30">
                  <div className="text-2xl font-bold text-yellow-400">
                    {allSubmissions.filter(s => s.status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-400">Pending Review</div>
                </div>
                <div className="bg-green-600/10 rounded-lg p-4 border border-green-600/30">
                  <div className="text-2xl font-bold text-green-400">
                    {allSubmissions.filter(s => s.status === 'approved').length}
                  </div>
                  <div className="text-sm text-green-400">Approved</div>
                </div>
                <div className="bg-red-600/10 rounded-lg p-4 border border-red-600/30">
                  <div className="text-2xl font-bold text-red-400">
                    {allSubmissions.filter(s => s.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-red-400">Rejected</div>
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-slate-700/30 border border-slate-600 rounded-lg p-6 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium">
                            {submission.type === 'pre-thesis' ? 'PRE-THESIS' : 'FINAL THESIS'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{submission.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {submission.studentName} ({submission.studentId})
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {submission.submittedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Supervisor</p>
                        <div className="flex items-center gap-2">
                          {getApprovalIcon(submission.supervisorApproval)}
                          <p className="text-sm text-white">{submission.supervisor}</p>
                        </div>
                      </div>
                      {submission.coSupervisor && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Co-Supervisor</p>
                          <div className="flex items-center gap-2">
                            {getApprovalIcon(submission.coSupervisorApproval)}
                            <p className="text-sm text-white">{submission.coSupervisor}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          {submission.documents.length} document(s)
                        </span>
                      </div>
                      {submission.status === 'pending' ? (
                        <button
                          onClick={() => handleReviewSubmission(submission)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Review Submission
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReviewSubmission(submission)}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No submissions found with the selected filters</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Review Mode
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => {
                  setReviewMode('list');
                  setActiveSubmission(null);
                }}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
              >
                ← Back to Submissions List
              </button>

              {/* Submission Details */}
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium">
                        {activeSubmission?.type === 'pre-thesis' ? 'PRE-THESIS' : 'FINAL THESIS'}
                      </span>
                      <span className="text-sm text-slate-400">ID: {activeSubmission?.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{activeSubmission?.title}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-300">
                        <span className="text-slate-400">Student:</span> {activeSubmission?.studentName} ({activeSubmission?.studentId})
                      </p>
                      <p className="text-slate-300">
                        <span className="text-slate-400">Email:</span> {activeSubmission?.email}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-slate-400">Submitted:</span> {activeSubmission?.submittedDate}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-slate-400">DSC Committee:</span> {activeSubmission?.dscCommittee}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Comments */}
                <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Student Comments
                  </p>
                  <p className="text-sm text-slate-200">{activeSubmission?.studentComments}</p>
                </div>

                {/* Documents */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Submitted Documents</h4>
                  <div className="space-y-2">
                    {activeSubmission?.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="text-sm font-medium text-white">{doc.name}</p>
                            <p className="text-xs text-slate-400">{doc.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(doc.name)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supervisor Approvals */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300">Supervisor Approvals</h4>
                  
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getApprovalIcon(activeSubmission?.supervisorApproval)}
                      <p className="font-medium text-white">{activeSubmission?.supervisor}</p>
                      <span className="text-xs text-slate-400">(Supervisor)</span>
                    </div>
                    {activeSubmission?.supervisorComments && (
                      <p className="text-sm text-slate-300 mt-2">{activeSubmission.supervisorComments}</p>
                    )}
                  </div>

                  {activeSubmission?.coSupervisor && (
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getApprovalIcon(activeSubmission?.coSupervisorApproval)}
                        <p className="font-medium text-white">{activeSubmission?.coSupervisor}</p>
                        <span className="text-xs text-slate-400">(Co-Supervisor)</span>
                      </div>
                      {activeSubmission?.coSupervisorComments && (
                        <p className="text-sm text-slate-300 mt-2">{activeSubmission.coSupervisorComments}</p>
                      )}
                    </div>
                  )}
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
                        onClick={() => setDecision('approve')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                          decision === 'approve'
                            ? 'bg-green-600 text-white border-2 border-green-400'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve Submission
                      </button>
                      <button
                        onClick={() => setDecision('reject')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                          decision === 'reject'
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
                      onClick={() => {
                        setReviewMode('list');
                        setActiveSubmission(null);
                      }}
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
                        {activeSubmission?.adminDecision?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Comments:</p>
                      <p className="text-sm text-slate-200">{activeSubmission?.adminComments}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Reviewed: {activeSubmission?.reviewedDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}