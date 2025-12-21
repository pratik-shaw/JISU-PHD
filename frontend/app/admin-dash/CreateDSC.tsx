/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { X, Users, Calendar, FileText, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface CreateDSCProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Student {
  id: number;
  name: string;
  email: string;
  uniqueId?: string;
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  uniqueId?: string;
}

interface SelectedStudent {
  studentId: string;
  studentName: string;
}

interface SelectedMember {
  memberId: string;
  memberName: string;
}

export default function CreateDSC({ isOpen, onClose, onSuccess }: CreateDSCProps) {
  const [formData, setFormData] = useState({
    dscName: '',
    formationDate: '',
    description: ''
  });
  
  const [students, setStudents] = useState<Student[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [currentStudent, setCurrentStudent] = useState('');
  const [currentMember, setCurrentMember] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setFetchingData(true);
    try {
      const token = localStorage.getItem('authToken');
      const [studentsResponse, membersResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?role=student`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/members`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      const studentsData = await studentsResponse.json();
      if (studentsData.success) setStudents(studentsData.data);
      const membersData = await membersResponse.json();
      if (membersData.success) setMembers(membersData.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleAddStudent = () => {
    if (!currentStudent) return;
    
    if (selectedStudents.some(s => s.studentId === currentStudent)) {
      setError('This student is already added');
      return;
    }

    const student = students.find(s => s.id.toString() === currentStudent);
    if (student) {
      setSelectedStudents([...selectedStudents, {
        studentId: currentStudent,
        studentName: student.name
      }]);
      setCurrentStudent('');
      setError('');
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter(s => s.studentId !== studentId));
  };

  const handleAddMember = () => {
    if (!currentMember) return;
    
    if (selectedMembers.some(m => m.memberId === currentMember)) {
      setError('This member is already added');
      return;
    }

    const member = members.find(m => m.id.toString() === currentMember);
    if (member) {
      setSelectedMembers([...selectedMembers, {
        memberId: currentMember,
        memberName: member.name
      }]);
      setCurrentMember('');
      setError('');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.memberId !== memberId));
  };

  const handleSubmit = async () => {
    if (!formData.dscName || !formData.formationDate) {
      setError('DSC name and formation date are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const dscResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dscs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.dscName,
          description: formData.description,
          formation_date: formData.formationDate,
        }),
      });

      if (!dscResponse.ok) {
        const errorData = await dscResponse.json();
        throw new Error(errorData.message || 'Failed to create DSC');
      }

      const dscData = await dscResponse.json();
      const dscId = dscData.data.id;

      // Add members to the new DSC
      for (const member of selectedMembers) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dscs/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: member.memberId,
            dscId: dscId,
            role: 'Member', // Default role, can be changed later
          }),
        });
      }
      
      // TODO: Associate students with the DSC. This will likely require another API endpoint.
      // For now, we'll just log the students that would be associated.
      console.log('Students to associate with DSC:', selectedStudents);


      if (onSuccess) onSuccess();
      
      setFormData({
        dscName: '',
        formationDate: '',
        description: ''
      });
      setSelectedStudents([]);
      setSelectedMembers([]);
      
      onClose();
      alert(`Successfully created DSC and added ${selectedMembers.length} members!`);

    } catch (err: any) {
      setError(err.message || 'An error occurred while creating DSCs');
      console.error('Error creating DSCs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create DSC (Bulk)</h2>
              <p className="text-sm text-slate-400">Add multiple students and members at once</p>
            </div>
          </div>
          <button
            onClick={onClose}
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

          <div className="space-y-6">
            <div>
              <label htmlFor="dscName" className="block text-sm font-medium text-slate-300 mb-2">
                DSC Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  id="dscName"
                  name="dscName"
                  value={formData.dscName}
                  onChange={handleChange}
                  placeholder="e.g., AI Research DSC - Batch 2024"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="formationDate" className="block text-sm font-medium text-slate-300 mb-2">
                Formation Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  id="formationDate"
                  name="formationDate"
                  value={formData.formationDate}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Description / Notes
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Add any additional notes about this DSC batch..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Add Students <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={currentStudent}
                    onChange={(e) => setCurrentStudent(e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-sm"
                    disabled={loading || fetchingData}
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.uniqueId})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddStudent}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    disabled={!currentStudent || loading}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-3 min-h-[200px] max-h-[250px] overflow-y-auto">
                  {selectedStudents.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">No students added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedStudents.map((student) => (
                        <div
                          key={student.studentId}
                          className="flex items-center justify-between bg-slate-800 rounded-lg p-2"
                        >
                          <span className="text-sm text-white">{student.studentName}</span>
                          <button
                            onClick={() => handleRemoveStudent(student.studentId)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {selectedStudents.length} student(s) added
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Add Members <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={currentMember}
                    onChange={(e) => setCurrentMember(e.target.value)}
                    className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none text-sm"
                    disabled={loading || fetchingData}
                  >
                    <option value="">Select a member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role} ({member.uniqueId})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddMember}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    disabled={!currentMember || loading}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-3 min-h-[200px] max-h-[250px] overflow-y-auto">
                  {selectedMembers.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">No members added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.memberId}
                          className="flex items-center justify-between bg-slate-800 rounded-lg p-2"
                        >
                          <span className="text-sm text-white">{member.memberName}</span>
                          <button
                            onClick={() => handleRemoveMember(member.memberId)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {selectedMembers.length} member(s) added
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">Bulk DSC Creation Process</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>This will create one DSC per selected student</li>
                    <li>All selected members will be added to each DSC (roles unassigned)</li>
                    <li>After creation, use "Assign Roles" to designate supervisors and co-supervisors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={loading || fetchingData || selectedStudents.length === 0 || selectedMembers.length === 0}
            >
              {loading ? 'Creating DSCs...' : `Create ${selectedStudents.length} DSC(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}