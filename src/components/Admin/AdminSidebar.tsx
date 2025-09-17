import  { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  BarChart3, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Tournaments', href: '/admin/tournaments', icon: Trophy },
    { name: 'Registrations', href: '/admin/registrations', icon: Users },
    { name: 'Leaderboard', href: '/admin/leaderboard', icon: BarChart3 },
    { name: 'Queries', href: '/admin/queries', icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isMobileMenuOpen ? 0 : -300 }}
        className={`lg:animate-none lg:translate-x-0 fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 border-r border-gray-700 lg:static lg:inset-0 transition-transform duration-300 ease-in-out lg:transition-none`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-gray-700">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mr-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
              <p className="text-sm text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}