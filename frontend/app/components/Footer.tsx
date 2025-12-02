// FILE: app/components/Footer.tsx
'use client';

import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <footer className="border-t border-slate-700 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">JIS PhD</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Empowering excellence in doctoral education
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/')}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@jisuniversity.edu"
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/faq')}
                  className="text-slate-400 hover:text-blue-400 text-sm transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 JIS University. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for academic excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}