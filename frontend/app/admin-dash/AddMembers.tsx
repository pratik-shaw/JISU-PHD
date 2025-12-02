/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { X, Users, UserCheck, AlertCircle, Shield, Check, ChevronRight, Search } from 'lucide-react';

interface AssignRolesProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface DSC {
  id: number;
  name: string;
  description: string;
  createdDate: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  universityId: string;
  department: string;
}

interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
}

interface StudentAssignment {
  studentId: number;
  supervisors: number[];
  coSupervisors: number[];
}

export default function AssignRoles({ isOpen, onClose, onSuccess }: AssignRolesProps) {
  const [step, setStep] = useState<'selectDSC' | 'selectStudent' | 'assignSupervisors'>('selectDSC');
  const [selectedDSC, setSelectedDSC] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [dscs, setDSCs] = useState<DSC[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [assignments, setAssignments] = useState<Map<number, StudentAssignment>>(new Map());
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchDSCs();
      fetchStudents();
      fetchFaculty();
    }
  }, [isOpen]);

  const fetchDSCs = async () => {
    setFetchingData(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setDSCs([
        { id: 1, name: 'DSC Committee A', description: 'Computer Science & AI', createdDate: '2024-01-15' },
        { id: 2, name: 'DSC Committee B', description: 'Biotechnology & Life Sciences', createdDate: '2024-02-20' },
        { id: 3, name: 'DSC Committee C', description: 'Physics & Mathematics', createdDate: '2024-03-10' }
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to load DSCs');
    } finally {
      setFetchingData(false);
    }
  };

  const fetchStudents = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudents([
        { id: 1, name: 'John Doe', email: 'john.doe@university.edu', universityId: 'STU001', department: 'Computer Science' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@university.edu', universityId: 'STU002', department: 'Computer Science' },
        { id: 3, name: 'Mike Johnson', email: 'mike.j@university.edu', universityId: 'STU003', department: 'AI & ML' },
        { id: 4, name: 'Sarah Williams', email: 'sarah.w@university.edu', universityId: 'STU004', department: 'Data Science' },
        { id: 5, name: 'Robert Brown', email: 'robert.b@university.edu', universityId: 'STU005', department: 'Computer Science' },
        { id: 6, name: 'Emily Davis', email: 'emily.d@university.edu', universityId: 'STU006', department: 'AI & ML' },
        { id: 7, name: 'David Wilson', email: 'david.w@university.edu', universityId: 'STU007', department: 'Data Science' },
        { id: 8, name: 'Lisa Anderson', email: 'lisa.a@university.edu', universityId: 'STU008', department: 'Computer Science' }
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    }
  };

  const fetchFaculty = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFaculty([
        { id: 10, name: 'Dr. Robert Smith', email: 'robert.s@university.edu', department: 'Computer Science', designation: 'Professor' },
        { id: 11, name: 'Dr. Emily Johnson', email: 'emily.j@university.edu', department: 'AI & ML', designation: 'Associate Professor' },
        { id: 12, name: 'Dr. Michael Brown', email: 'michael.b@university.edu', department: 'Data Science', designation: 'Professor' },
        { id: 13, name: 'Dr. Sarah Davis', email: 'sarah.d@university.edu', department: 'Computer Science', designation: 'Assistant Professor' },
        { id: 14, name: 'Dr. James Wilson', email: 'james.w@university.edu', department: 'AI & ML', designation: 'Professor' },
        { id: 15, name: 'Dr. Lisa Anderson', email: 'lisa.a@university.edu', department: 'Computer Science', designation: 'Associate Professor' }
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to load faculty');
    }
  };

  const handleDSCSelect = (dscId: number) => {
    setSelectedDSC(dscId);
    setStep('selectStudent');
    setError('');
  };

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudent(studentId);
    setStep('assignSupervisors');
    setError('');
  };

  const getCurrentStudent = () => students.find(s => s.id === selectedStudent);

  const getCurrentAssignment = (): StudentAssignment => {
    if (!selectedStudent) return { studentId: 0, supervisors: [], coSupervisors: [] };
    
    return assignments.get(selectedStudent) || {
      studentId: selectedStudent,
      supervisors: [],
      coSupervisors: []
    };
  };

  const toggleSupervisor = (facultyId: number) => {
    if (!selectedStudent) return;

    const currentAssignment = getCurrentAssignment();
    const newAssignments = new Map(assignments);
    
    const isSupervisor = currentAssignment.supervisors.includes(facultyId);
    const isCoSupervisor = currentAssignment.coSupervisors.includes(facultyId);

    if (isSupervisor) {
      currentAssignment.supervisors = currentAssignment.supervisors.filter(id => id !== facultyId);
    } else {
      currentAssignment.coSupervisors = currentAssignment.coSupervisors.filter(id => id !== facultyId);
      currentAssignment.supervisors.push(facultyId);
    }

    newAssignments.set(selectedStudent, currentAssignment);
    setAssignments(newAssignments);
    setError('');
  };

  const toggleCoSupervisor = (facultyId: number) => {
    if (!selectedStudent) return;

    const currentAssignment = getCurrentAssignment();
    const newAssignments = new Map(assignments);
    
    const isSupervisor = currentAssignment.supervisors.includes(facultyId);
    const isCoSupervisor = currentAssignment.coSupervisors.includes(facultyId);

    if (isCoSupervisor) {
      currentAssignment.coSupervisors = currentAssignment.coSupervisors.filter(id => id !== facultyId);
    } else {
      currentAssignment.supervisors = currentAssignment.supervisors.filter(id => id !== facultyId);
      currentAssignment.coSupervisors.push(facultyId);
    }

    newAssignments.set(selectedStudent, currentAssignment);
    setAssignments(newAssignments);
    setError('');
  };

  const handleBackToStudentSelection = () => {
    const currentAssignment = getCurrentAssignment();
    
    if (currentAssignment.supervisors.length === 0) {
      setError('Please assign at least one supervisor before going back');
      return;
    }

    setSelectedStudent(null);
    setStep('selectStudent');
    setError('');
  };

  const handleSaveAndContinue = () => {
    const currentAssignment = getCurrentAssignment();
    
    if (currentAssignment.supervisors.length === 0) {
      setError('Please assign at least one supervisor before continuing');
      return;
    }

    setSelectedStudent(null);
    setStep('selectStudent');
    setError('');
  };

  const handleSaveAll = async () => {
    if (assignments.size === 0) {
      setError('Please assign supervisors to at least one student');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assignmentData = Array.from(assignments.entries()).map(([studentId, assignment]) => ({
        dscId: selectedDSC,
        studentId,
        supervisors: assignment.supervisors,
        coSupervisors: assignment.coSupervisors
      }));

      console.log('Saving assignments:', assignmentData);

      if (onSuccess) onSuccess();
      
      alert(`Successfully assigned supervisors to ${assignments.size} student(s)!`);
      handleClose();

    } catch (err: any) {
      setError(err.message || 'An error occurred while saving assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('selectDSC');
    setSelectedDSC(null);
    setSelectedStudent(null);
    setAssignments(new Map());
    setSearchTerm('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const currentStudent = getCurrentStudent();
  const currentAssignment = getCurrentAssignment();
  const assignedCount = assignments.size;

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.universityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDSCData = dscs.find(d => d.id === selectedDSC);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assign Supervisors to Students</h2>
              <p className="text-sm text-slate-400">
                {step === 'selectDSC' && 'Select a DSC committee'}
                {step === 'selectStudent' && 'Select a student to assign supervisors'}
                {step === 'assignSupervisors' && 'Assign supervisors and co-supervisors'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-6 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Select DSC */}
          {step === 'selectDSC' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Select DSC Committee</h3>
              {fetchingData ? (
                <div className="bg-slate-900/50 rounded-lg p-8 text-center">
                  <p className="text-slate-400">Loading DSCs...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {dscs.map((dsc) => (
                    <button
                      key={dsc.id}
                      onClick={() => handleDSCSelect(dsc.id)}
                      className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500 hover:bg-slate-900 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-semibold text-lg group-hover:text-purple-400 transition-colors">
                            {dsc.name}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1">{dsc.description}</p>
                          <p className="text-slate-500 text-xs mt-2">Created: {dsc.createdDate}</p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Student */}
          {step === 'selectStudent' && (
            <div className="space-y-6">
              {/* DSC Info & Progress */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedDSCData?.name}</h3>
                    <p className="text-sm text-slate-400">{selectedDSCData?.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{assignedCount}</div>
                    <div className="text-xs text-slate-400">Students Assigned</div>
                  </div>
                </div>
                {assignedCount > 0 && (
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Assignment Progress</span>
                      <span className="text-slate-400">{assignedCount} / {students.length} students</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(assignedCount / students.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students by name, ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Student List */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Select Student ({filteredStudents.length})
                </h4>
                <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                  {filteredStudents.map((student) => {
                    const hasAssignment = assignments.has(student.id);
                    const assignment = assignments.get(student.id);
                    
                    return (
                      <button
                        key={student.id}
                        onClick={() => handleStudentSelect(student.id)}
                        className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-purple-500 hover:bg-slate-900 transition-all text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                                {student.name}
                              </h5>
                              {hasAssignment && (
                                <span className="px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs font-medium flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Assigned
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span>{student.universityId}</span>
                              <span>•</span>
                              <span>{student.department}</span>
                            </div>
                            {hasAssignment && assignment && (
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <span className="text-purple-400">
                                  {assignment.supervisors.length} Supervisor(s)
                                </span>
                                <span className="text-blue-400">
                                  {assignment.coSupervisors.length} Co-Supervisor(s)
                                </span>
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setStep('selectDSC')}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                  disabled={loading}
                >
                  Back to DSC Selection
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || assignedCount === 0}
                >
                  {loading ? 'Saving...' : `Save All Assignments (${assignedCount})`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Assign Supervisors */}
          {step === 'assignSupervisors' && currentStudent && (
            <div className="space-y-6">
              {/* Current Student Info */}
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{currentStudent.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-300">ID: {currentStudent.universityId}</p>
                      <p className="text-slate-300">Email: {currentStudent.email}</p>
                      <p className="text-slate-300">Department: {currentStudent.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-purple-400">{selectedDSCData?.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{assignedCount} students assigned</div>
                  </div>
                </div>
              </div>

              {/* Assignment Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{currentAssignment.supervisors.length}</div>
                  <div className="text-sm text-slate-400 mt-1">Supervisors Assigned</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{currentAssignment.coSupervisors.length}</div>
                  <div className="text-sm text-slate-400 mt-1">Co-Supervisors Assigned</div>
                </div>
              </div>

              {/* Faculty List */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Select Supervisors & Co-Supervisors
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {faculty.map((member) => {
                    const isSupervisor = currentAssignment.supervisors.includes(member.id);
                    const isCoSupervisor = currentAssignment.coSupervisors.includes(member.id);
                    
                    return (
                      <div
                        key={member.id}
                        className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium">{member.name}</p>
                            <p className="text-sm text-slate-400">{member.designation} • {member.department}</p>
                            <p className="text-xs text-slate-500 mt-1">{member.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleSupervisor(member.id)}
                              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                                isSupervisor
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                            >
                              {isSupervisor && <Check className="w-4 h-4 inline mr-1" />}
                              Supervisor
                            </button>
                            <button
                              onClick={() => toggleCoSupervisor(member.id)}
                              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                                isCoSupervisor
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                            >
                              {isCoSupervisor && <Check className="w-4 h-4 inline mr-1" />}
                              Co-Supervisor
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-700">
                <button
                  onClick={handleBackToStudentSelection}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                  disabled={loading}
                >
                  Back to Student List
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleSaveAndContinue}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}