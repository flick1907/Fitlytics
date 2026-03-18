import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineFlag,
  HiOutlinePresentationChartLine,
  HiOutlineUser,
  HiOutlineCalendar,
} from 'react-icons/hi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/workouts', label: 'Workouts', icon: HiOutlineLightningBolt },
  { path: '/progress', label: 'Progress', icon: HiOutlineChartBar },
  { path: '/goals', label: 'Goals', icon: HiOutlineFlag },
  { path: '/metrics', label: 'Metrics', icon: HiOutlineChartBar },
  { path: '/analytics', label: 'Analytics', icon: HiOutlinePresentationChartLine },
  { path: '/profile', label: 'Profile', icon: HiOutlineUser },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-64 bg-secondary-bg border-r border-white/5 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold gradient-text">⚡ Fitlytics</h1>
        <p className="text-xs text-gray-500 mt-1">Fitness Analytics Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-primary/15 text-primary-light border border-primary/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-gray-500">Fitlytics v1.0</p>
        </div>
      </div>
    </motion.aside>
  );
}
