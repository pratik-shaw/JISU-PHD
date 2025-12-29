/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import {
  X,
  Users,
  AlertCircle,
  Shield,
  ChevronRight,
  Search,
} from "lucide-react";

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

interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  uniqueId?: string;
}

export default function AssignRoles({
  isOpen,
  onClose,
  onSuccess,
}: AssignRolesProps) {
  const [step, setStep] = useState<"selectDSC" | "assignMembers">(
    "selectDSC"
  );
  const [selectedDSC, setSelectedDSC] = useState<number | null>(null);
  const [dscs, setDSCs] = useState<DSC[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [memberRoles, setMemberRoles] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const apiFetch = useApi();

  useEffect(() => {
    if (isOpen) {
      fetchDSCs();
      fetchFaculty();
    }
  }, [isOpen]);

  const fetchDSCs = async () => {
    setFetchingData(true);
    try {
      const response = await apiFetch(`/api/dscs`);
      const data = await response.json();
      if (data.success) {
        setDSCs(data.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load DSCs");
    } finally {
      setFetchingData(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await apiFetch(`/api/users?role=faculty`);
      const data = await response.json();
      if (data.success) {
        setFaculty(data.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load faculty");
    }
  };

  const fetchDscMembers = async (dscId: number) => {
    try {
      const response = await apiFetch(`/api/dscs/${dscId}/members`);
      const data = await response.json();
      if (data.success) {
        const newMemberRoles: { [key: number]: string } = {};
        for (const member of data.data) {
          newMemberRoles[member.user_id] = member.role_in_dsc;
        }
        setMemberRoles(newMemberRoles);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load DSC members");
    }
  };

  const handleDSCSelect = (dscId: number) => {
    setSelectedDSC(dscId);
    setStep("assignMembers");
    setError("");
    fetchDscMembers(dscId);
  };
  
  const handleRoleChange = (memberId: number, role: string) => {
    setMemberRoles(prev => ({
      ...prev,
      [memberId]: role,
    }));
  };

  const handleSaveAll = async () => {
    if (!selectedDSC) {
      setError("Please select a DSC first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Remove all existing members from the DSC
      await apiFetch(`/api/dscs/${selectedDSC}/members`, {
        method: 'DELETE',
      });

      // Add the new members with roles
      const assignmentPromises = [];
      for (const userId in memberRoles) {
        const role = memberRoles[userId];
        if (role && role !== 'none') {
          assignmentPromises.push(
            apiFetch(`/api/dscs/members`, {
              method: "POST",
              body: JSON.stringify({
                userId: parseInt(userId),
                dscId: selectedDSC,
                role: role,
              }),
            }),
          );
        }
      }

      const responses = await Promise.all(assignmentPromises);

      responses.forEach((response) => {
        if (!response.ok) {
          throw new Error("Failed to save one or more assignments.");
        }
      });

      if (onSuccess) onSuccess();

      alert(
        `Successfully assigned members to the DSC!`,
      );
      handleClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("selectDSC");
    setSelectedDSC(null);
    setMemberRoles({});
    setSearchTerm("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  const filteredFaculty = faculty.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDSCData = dscs.find((d) => d.id === selectedDSC);

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
              <h2 className="text-xl font-bold text-white">
                Assign Members to DSC
              </h2>
              <p className="text-sm text-slate-400">
                {step === "selectDSC" && "Select a DSC committee"}
                {step === "assignMembers" && "Assign roles to members for this DSC"}
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

          {step === "selectDSC" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Select DSC Committee
              </h3>
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
                          <p className="text-slate-400 text-sm mt-1">
                            {dsc.description}
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            Created: {dsc.createdDate}
                          </p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "assignMembers" && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedDSCData?.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {selectedDSCData?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Assign Roles to Faculty Members
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {filteredFaculty.map((member) => (
                      <div
                        key={member.id}
                        className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium">
                              {member.name}
                            </p>
                            <p className="text-sm text-slate-400">
                              {member.designation} • {member.department} (
                              {member.uniqueId})
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {member.email}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={memberRoles[member.id] || 'none'}
                              onChange={(e) => handleRoleChange(member.id, e.target.value)}
                              className="px-4 py-2 rounded-lg transition-all text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600"
                            >
                              <option value="none">None</option>
                              <option value="supervisor">Supervisor</option>
                              <option value="co_supervisor">Co-Supervisor</option>
                              <option value="member">Member</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setStep("selectDSC")}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                  disabled={loading}
                >
                  Back to DSC Selection
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Member Roles'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}