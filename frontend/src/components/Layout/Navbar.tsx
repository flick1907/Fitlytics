import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineBell } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-secondary-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-200">
            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
          </h2>
          <p className="text-sm text-gray-500">Track your fitness journey</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-xl bg-card hover:bg-card-hover border border-white/5 transition-all duration-200 relative">
            <HiOutlineBell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-green rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-card transition-all duration-200 text-gray-400 hover:text-accent-red"
              title="Logout"
            >
              <HiOutlineLogout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
