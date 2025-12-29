/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
// FILE: app/admin-dash/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AdminMenu from '@/app/admin-dash/Admin-menu';
import CreateStudent from '@/app/admin-dash/CreateStudent';
import CreateMember from '@/app/admin-dash/CreateMember';
import CreateDSC from '@/app/admin-dash/CreateDSC';
import AddMembers from '@/app/admin-dash/AddMembers';
import AssignRoles from '@/app/admin-dash/AddMembers';
import ViewEditDeleteUser from '@/app/admin-dash/ViewEditDeleteUser';
import ViewEditDeleteDSC from '@/app/admin-dash/ViewEditDeleteDSC';
import ReviewSystem from '@/app/admin-dash/ReviewSystem';
import ReviewSubmission from '@/app/admin-dash/ReviewSubmission';
import AdminChangePassword from '@/app/admin-dash/AdminChangePassword';
import { useApi } from '@/app/hooks/useApi';
import { useRouter } from 'next/navigation';
import { Menu, X, Shield, Plus, Users, FileText, Award, CheckCircle, Eye, Edit, Trash2, UserPlus, UserCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApplications: 0,
    activeDSCs: 0,
    recentSubmissions: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [showCreateMember, setShowCreateMember] = useState(false);
  const [showCreateDSC, setShowCreateDSC] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showReviewSystem, setShowReviewSystem] = useState(false);
  const [showReviewSubmission, setShowReviewSubmission] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | undefined>(undefined);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | undefined>(undefined);
  
  const [userModal, setUserModal] = useState<{
    isOpen: boolean;
    mode: 'view' | 'edit' | 'delete';
    user: any | null;
  }>({
    isOpen: false,
    mode: 'view',
    user: null
  });

  const [dscModal, setDscModal] = useState<{
    isOpen: boolean;
    mode: 'view' | 'edit' | 'delete';
    dsc: any | null;
  }>({
    isOpen: false,
    mode: 'view',
    dsc: null
  });
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [dscs, setDscs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [memberRoles, setMemberRoles] = useState<{ [key: number]: string }>({});

  const apiFetch = useApi();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin-login');
    }
  }, [router]);

  const fetchData = async () => {
    console.log('Fetching data for tab:', activeTab);
    
    try {
      if (activeTab === 'dashboard') {
        const [statsResponse, activityResponse] = await Promise.all([
          apiFetch(`/api/admin/stats`),
          apiFetch(`/api/admin/recent-activity`)
        ]);
        const statsData = await statsResponse.json();
        if (statsData.success) setStats(statsData.data);
        const activityData = await activityResponse.json();
        if (activityData.success) setRecentUsers(activityData.data);
      } else if (activeTab === 'users') {
        const usersResponse = await apiFetch(`/api/users`);
        const usersData = await usersResponse.json();
        console.log('Users data:', usersData);
        if (usersData.success) setAllUsers(usersData.data);
      } else if (activeTab === 'dsc') {
        const dscsResponse = await apiFetch(`/api/dscs`);
        const dscsData = await dscsResponse.json();
        if (dscsData.success) setDscs(dscsData.data);
      } else if (activeTab === 'applications') {
        const applicationsResponse = await apiFetch(`/api/applications`);
        const applicationsData = await applicationsResponse.json();
        if (applicationsData.success) setApplications(applicationsData.data);
      } else if (activeTab === 'roles') {
        const membersResponse = await apiFetch(`/api/users/members`);
        const membersData = await membersResponse.json();
        if (membersData.success) setMembers(membersData.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleUpdateRole = async (userId: number) => {
    const newRole = memberRoles[userId];
    if (!newRole) {
      alert('Please select a role to update.');
      return;
    }

    try {
      const response = await apiFetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update role');
      }

      alert('Role updated successfully!');
      handleRefresh();

    } catch (error: any) {
      console.error('Failed to update role:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const openUserModal = (mode: 'view' | 'edit' | 'delete', user: any) => {
    setUserModal({ isOpen: true, mode, user });
  };

  const openDscModal = (mode: 'view' | 'edit' | 'delete', dsc: any) => {
    setDscModal({ isOpen: true, mode, dsc });
  };

  const openReviewForStudent = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setShowReviewSystem(true);
  };

  const closeReviewSystem = () => {
    setShowReviewSystem(false);
    setSelectedApplicationId(undefined);
  };

  const openReviewSubmission = (submissionId?: string) => {
    setSelectedSubmissionId(submissionId);
    setShowReviewSubmission(true);
  };

  const closeReviewSubmission = () => {
    setShowReviewSubmission(false);
    setSelectedSubmissionId(undefined);
  };

  const StatCard = ({ icon: Icon, value, label, gradient }: any) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform`}
         onClick={() => {
           if (label === 'Pending Applications') {
             setSelectedApplicationId(undefined);
             setShowReviewSystem(true);
             setActiveTab('applications');
           }
         }}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-8 h-8 opacity-80" />
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );

  const ActionButton = ({ icon: Icon, onClick, label, color = 'purple' }: any) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-${color}-600 hover:bg-${color}-700 rounded-lg transition-all`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <AdminMenu sidebarOpen={sidebarOpen} activeTab={activeTab} setActiveTabAction={setActiveTab} />

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
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-slate-400">System Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              
              {/* Dashboard Home */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h2>
                    <p className="text-purple-100">Manage users, roles, DSC committees, and oversee all system operations.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Users} value={stats.totalUsers} label="Total Users" gradient="from-blue-600 to-blue-700" />
                    <StatCard icon={FileText} value={stats.pendingApplications} label="Pending Applications" gradient="from-yellow-600 to-yellow-700" />
                    <StatCard icon={Award} value={stats.activeDSCs} label="Active DSCs" gradient="from-green-600 to-green-700" />
                    <StatCard icon={CheckCircle} value={stats.recentSubmissions} label="Recent Submissions" gradient="from-purple-600 to-purple-700" />
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Recent User Activity</h3>
                    <div className="space-y-3">
                      {recentUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-slate-400">{user.role} • {new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">New</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Manage Users</h2>
                    <div className="flex gap-2">
                      <ActionButton icon={Plus} onClick={() => setShowCreateStudent(true)} label="Create Student" />
                      <ActionButton icon={Plus} onClick={() => setShowCreateMember(true)} label="Create Member" />
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">Name</th>
                          <th className="px-6 py-3 font-medium">Email</th>
                          <th className="px-6 py-3 font-medium">Role</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map(user => (
                          <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4 text-slate-400">{user.email}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => openUserModal('view', user)} className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-all" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => openUserModal('edit', user)} className="p-2 bg-purple-600 hover:bg-purple-700 rounded transition-all" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => openUserModal('delete', user)} className="p-2 bg-red-600 hover:bg-red-700 rounded transition-all" title="Delete">
                                  <Trash2 className="w-4 h-4" />
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

              {/* Roles Tab */}
              {activeTab === 'roles' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Manage Roles</h2>
                  <p className="text-slate-400 text-sm mb-4">Select a role to assign to any user (excluding other admins).</p>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">User Name</th>
                          <th className="px-6 py-3 font-medium">Current Role</th>
                          <th className="px-6 py-3 font-medium">Update Role</th>
                          <th className="px-6 py-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member) => (
                          <tr key={member.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4">{member.name}</td>
                            <td className="px-6 py-4">{member.role}</td>
                            <td className="px-6 py-4">
                              <select 
                                className="bg-slate-700 text-white rounded px-3 py-2 text-sm border border-slate-600 focus:border-purple-500 focus:outline-none"
                                onChange={(e) => setMemberRoles(prev => ({...prev, [member.id]: e.target.value}))}
                                defaultValue={member.role}
                              >
                                <option value="student">Student</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="co_supervisor">Co-Supervisor</option>
                                <option value="dsc_member">DSC Member</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-all"
                                onClick={() => handleUpdateRole(member.id)}
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DSC Tab */}
              {activeTab === 'dsc' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">DSC Management</h2>
                    <div className="flex gap-2">
                      <ActionButton icon={Plus} onClick={() => setShowCreateDSC(true)} label="Create DSC" />
                      <ActionButton icon={UserPlus} onClick={() => setShowAddMembers(true)} label="Add Members" color="blue" />
                    </div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">DSC Name</th>
                          <th className="px-6 py-3 font-medium">Formation Date</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dscs.map(dsc => (
                          <tr key={dsc.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{dsc.name}</p>
                                <p className="text-xs text-slate-400">{dsc.description}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400">{new Date(dsc.formation_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                                {dsc.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => openDscModal('view', dsc)} className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-all" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => openDscModal('edit', dsc)} className="p-2 bg-purple-600 hover:bg-purple-700 rounded transition-all" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => openDscModal('delete', dsc)} className="p-2 bg-red-600 hover:bg-red-700 rounded transition-all" title="Delete">
                                  <Trash2 className="w-4 h-4" />
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

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold mb-4">Applications</h2>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">Application ID</th>
                          <th className="px-6 py-3 font-medium">Student</th>
                          <th className="px-6 py-3 font-medium">Type</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map(app => (
                          <tr key={app.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4 font-mono text-sm text-purple-400">{app.id}</td>
                            <td className="px-6 py-4">{app.student_name}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                                {app.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                app.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                                app.status === 'approved' ? 'bg-green-600/20 text-green-400' :
                                'bg-blue-600/20 text-blue-400'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-400">{new Date(app.submission_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => openReviewForStudent(app.id)}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submissions Tab */}
              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold mb-4">Submissions</h2>
                    <ActionButton 
                      icon={FileText} 
                      onClick={() => openReviewSubmission()} 
                      label="Open Review System" 
                      color="blue"
                    />
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-700/30">
                        <tr className="text-left text-sm text-slate-400">
                          <th className="px-6 py-3 font-medium">Submission ID</th>
                          <th className="px-6 py-3 font-medium">Student</th>
                          <th className="px-6 py-3 font-medium">Title</th>
                          <th className="px-6 py-3 font-medium">Type</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map(sub => (
                          <tr key={sub.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                            <td className="px-6 py-4 font-mono text-sm text-purple-400">{sub.id}</td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{/* Placeholder */}</p>
                                <p className="text-xs text-slate-400">{/* Placeholder */}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <p className="truncate text-sm">{/* Placeholder */}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                                {/* Placeholder */}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm`}>
                                {/* Placeholder */}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-400">{/* Placeholder */}</td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => openReviewSubmission(sub.id)}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all"
                              >
                                Review
                              </button>
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
                <AdminChangePassword />
              )}

            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Modals */}
      <CreateStudent isOpen={showCreateStudent} onClose={() => setShowCreateStudent(false)} onSuccess={handleRefresh} />
      <CreateMember isOpen={showCreateMember} onClose={() => setShowCreateMember(false)} onSuccess={handleRefresh} />
      <CreateDSC isOpen={showCreateDSC} onClose={() => setShowCreateDSC(false)} onSuccess={handleRefresh} />
      <AddMembers isOpen={showAddMembers} onClose={() => setShowAddMembers(false)} onSuccess={handleRefresh} />
      
      <ViewEditDeleteUser
        isOpen={userModal.isOpen}
        mode={userModal.mode}
        user={userModal.user}
        onClose={() => setUserModal({ isOpen: false, mode: 'view', user: null })}
        onSuccess={handleRefresh}
      />

      <ViewEditDeleteDSC
        isOpen={dscModal.isOpen}
        mode={dscModal.mode}
        dsc={dscModal.dsc}
        onClose={() => setDscModal({ isOpen: false, mode: 'view', dsc: null })}
        onSuccess={handleRefresh}
      />

      {/* Review System Modal - Now with specific application ID */}
      <ReviewSystem
        isOpen={showReviewSystem}
        onClose={closeReviewSystem}
        applicationId={selectedApplicationId}
        onSuccess={handleRefresh}
      />
      <ReviewSubmission
        isOpen={showReviewSubmission}
        onClose={closeReviewSubmission}
        submissionId={selectedSubmissionId}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
