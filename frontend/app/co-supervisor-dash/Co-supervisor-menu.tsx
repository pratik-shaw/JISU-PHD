// FILE: app/co-supervisor-dash/Co-supervisor-menu.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface CoSupervisorMenuProps {
  sidebarOpen: boolean;
  activeTab: string;
  onTabChangeAction: (tab: string) => void;
}

export default function CoSupervisorMenu({ sidebarOpen, activeTab, onTabChangeAction }: CoSupervisorMenuProps) {
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
    // Example:
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('user');
    // await fetch('/api/auth/logout', { method: 'POST' });
    
    console.log('Logging out...');
    router.push('/member-login');
  };

  /**
   * Navigation items for Co-Supervisor dashboard
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
      label: 'My Students', 
      tab: 'students',
      description: 'View assigned students'
    },
    { 
      icon: FileText, 
      label: 'Proposals', 
      tab: 'proposals',
      description: 'Review research proposals'
    },
    { 
      icon: ClipboardCheck, 
      label: 'Reports', 
      tab: 'reports',
      description: 'Review progress reports'
    },
    { 
      icon: BookOpen, 
      label: 'Pre-Thesis', 
      tab: 'pre-thesis',
      description: 'Pre-thesis submissions'
    },
    { 
      icon: BookOpen, 
      label: 'Final Thesis', 
      tab: 'final-thesis',
      description: 'Final thesis submissions'
    },
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      tab: 'messages',
      description: 'Communication hub'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      tab: 'settings',
      description: 'Account preferences'
    },
  ];

  return (
    <aside className={`${
      sidebarOpen ? 'w-64' : 'w-0'
    } bg-slate-800/50 border-r border-slate-700 transition-all duration-300 overflow-hidden`}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-teal-400">Co-Supervisor Portal</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => onTabChangeAction(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.tab
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
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