import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface DSCMenuProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DSCMenu({ sidebarOpen, activeTab, setActiveTab }: DSCMenuProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/member-login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', tab: 'dashboard' },
    { icon: FileText, label: 'Proposals', tab: 'proposals' },
    { icon: ClipboardCheck, label: 'Reports', tab: 'reports' },
    { icon: BookOpen, label: 'Pre-Thesis', tab: 'pre-thesis' },
    { icon: BookOpen, label: 'Final Thesis', tab: 'final-thesis' },
    { icon: Settings, label: 'Settings', tab: 'settings' },
  ];

  return (
    <aside className={`${
      sidebarOpen ? 'w-64' : 'w-0'
    } bg-slate-800/50 border-r border-slate-700 transition-all duration-300 overflow-hidden`}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-emerald-400">DSC Portal</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.tab
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {activeTab === item.tab && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all mt-6 border-t border-slate-700 pt-6"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}