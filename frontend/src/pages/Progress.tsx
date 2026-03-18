import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import { progressAPI } from '../services/api';
import WeightProgressChart from '../components/Charts/WeightProgressChart';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';

interface ProgressEntry {
  id: string;
  weight: number | null;
  bodyFat: number | null;
  measurement: string | null;
  createdAt: string;
}

export default function Progress() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ weight: '', bodyFat: '', measurement: '' });

  const fetchProgress = async () => {
    try {
      const res = await progressAPI.getAll();
      setEntries(res.data);
    } catch {
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProgress(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await progressAPI.create({
        weight: form.weight ? parseFloat(form.weight) : null,
        bodyFat: form.bodyFat ? parseFloat(form.bodyFat) : null,
        measurement: form.measurement || null,
      });
      toast.success('Progress recorded!');
      setModalOpen(false);
      setForm({ weight: '', bodyFat: '', measurement: '' });
      fetchProgress();
    } catch {
      toast.error('Failed to save progress');
    }
  };

  const weightData = entries
    .filter((e) => e.weight)
    .reverse()
    .map((e) => ({
      date: new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: e.weight!,
    }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Progress</h1>
          <p className="text-gray-400 mt-1">Track your body metrics over time</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" /> Add Entry
        </button>
      </div>

      {/* Weight Chart */}
      <WeightProgressChart data={weightData} />

      {/* Progress History */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">📋 Progress History</h3>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-card rounded-xl animate-pulse" />)}</div>
        ) : entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No progress entries yet. Start tracking!</p>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 20).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-6">
                  {entry.weight && (
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="text-lg font-bold text-white">{entry.weight} kg</p>
                    </div>
                  )}
                  {entry.bodyFat && (
                    <div>
                      <p className="text-xs text-gray-500">Body Fat</p>
                      <p className="text-lg font-bold text-accent-yellow">{entry.bodyFat}%</p>
                    </div>
                  )}
                  {entry.measurement && (
                    <div>
                      <p className="text-xs text-gray-500">Measurements</p>
                      <p className="text-sm text-gray-300">{entry.measurement}</p>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Progress Entry">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Weight (kg)</label>
            <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="input-field" step="0.1" placeholder="e.g. 75.5" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Body Fat (%)</label>
            <input type="number" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} className="input-field" step="0.1" placeholder="e.g. 15.5" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Measurements</label>
            <textarea value={form.measurement} onChange={(e) => setForm({ ...form, measurement: e.target.value })} className="input-field" rows={2} placeholder="e.g. Chest: 42in, Waist: 32in" />
          </div>
          <button type="submit" className="btn-primary w-full">Save Entry</button>
        </form>
      </Modal>
    </div>
  );
}
