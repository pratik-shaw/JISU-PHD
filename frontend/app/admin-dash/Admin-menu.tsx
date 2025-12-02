// FILE: app/admin-dash/Admin-menu.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Award,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface AdminMenuProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTabAction: (tab: string) => void;
}

export default function AdminMenu({ sidebarOpen, activeTab, setActiveTabAction }: AdminMenuProps) {
  const router = useRouter();

  /**
   * Handle logout
   * TODO: BACKEND REQUIRED - Implement logout functionality
   * - Clear authentication tokens
   * - Clear user session data
   * - Redirect to login page
   */
  const handleLogout = () => {
    // TODO: Clear auth tokens and user data
    console.log('Logging out...');
    router.push('/admin-login');
  };

  /**
   * Navigation items for Admin dashboard
   * Each item controls which content is displayed in the main area
   */
  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      tab: 'dashboard',
      description: 'Overview and statistics'
    },
    { 
      icon: Users, 
      label: 'Users', 
      tab: 'users',
      description: 'Manage all users'
    },
    { 
      icon: Users, 
      label: 'Manage Roles', 
      tab: 'roles',
      description: 'Assign user roles'
    },
    { 
      icon: Award, 
      label: 'DSC', 
      tab: 'dsc',
      description: 'Doctoral Supervisory Committee'
    },
    { 
      icon: FileText, 
      label: 'Applications', 
      tab: 'applications',
      description: 'Review applications'
    },
    { 
      icon: BookOpen, 
      label: 'Submissions', 
      tab: 'submissions',
      description: 'Thesis submissions'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      tab: 'settings',
      description: 'System settings'
    },
  ];

  return (
    <aside className={`${
      sidebarOpen ? 'w-64' : 'w-0'
    } bg-slate-800/50 border-r border-slate-700 transition-all duration-300 overflow-hidden`}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-purple-400">Admin Portal</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTabAction(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.tab
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
              title={item.description}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {activeTab === item.tab && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </button>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 mt-6 border-t border-slate-700 pt-6"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-left">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}