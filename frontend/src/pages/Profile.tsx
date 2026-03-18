import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineDownload, HiOutlineMail, HiOutlineCalendar } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { userAPI, exportAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Beginner');
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { 
        name, 
        weight: weight ? parseFloat(weight) : undefined, 
        height: height ? parseFloat(height) : undefined, 
        experienceLevel 
      };
      await userAPI.updateProfile(payload);
      updateUser(payload);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const res = await exportAPI.workouts(format);
      if (format === 'csv') {
        const blob = new Blob([res.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fitlytics-workouts.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fitlytics-workouts.json';
        a.click();
        window.URL.revokeObjectURL(url);
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account and export data</p>
      </div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <HiOutlineMail className="w-4 h-4" /> {user?.email}
              </span>
              <span className="flex items-center gap-1">
                <HiOutlineCalendar className="w-4 h-4" /> Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Display Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Experience Level</label>
              <select 
                value={experienceLevel} 
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="input-field"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Weight (kg)</label>
              <input 
                type="number" 
                step="0.1"
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
                className="input-field" 
                placeholder="e.g. 75.0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Height (cm)</label>
              <input 
                type="number" 
                step="0.1"
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
                className="input-field" 
                placeholder="e.g. 180.0"
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto">
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </motion.div>

      {/* Data Export */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-accent-green to-accent-cyan text-white">
            <HiOutlineDownload className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-200">Export Data</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">Download your workout history in your preferred format.</p>
        <div className="flex gap-4">
          <button onClick={() => handleExport('csv')} className="btn-secondary flex items-center gap-2">
            <HiOutlineDownload className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => handleExport('json')} className="btn-secondary flex items-center gap-2">
            <HiOutlineDownload className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </motion.div>
    </div>
  );
}
