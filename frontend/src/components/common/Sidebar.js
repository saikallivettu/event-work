import React, { useContext } from 'react';
import { LayoutDashboard, BookOpen, CheckSquare, LogOut, FileUp } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: BookOpen, label: 'Courses' },
    { icon: CheckSquare, label: 'Grades' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-20 md:w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col justify-between transition-all duration-300 z-10">
      <div>
        <div className="flex items-center justify-center md:justify-start gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full"></div>
          <h1 className="hidden md:block text-2xl font-bold text-white">GlassNeuro</h1>
        </div>

        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <LayoutDashboard size={24} />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <a href="#" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <BookOpen size={24} />
            <span className="hidden md:inline">Courses</span>
          </a>
          <Link to="/my-grades" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <CheckSquare size={24} />
            <span className="hidden md:inline">Grades</span>
          </Link>
          <Link to="/summarizer" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <FileUp size={24} />
            <span className="hidden md:inline">Summarizer</span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4">
        <button onClick={logout} className="flex items-center gap-4 p-3 w-full rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors">
          <LogOut size={24} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
