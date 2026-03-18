import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { metricAPI } from '../services/api';

export default function BodyMetrics() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMetric, setNewMetric] = useState({
    weight: 0,
    bodyFat: 0,
    chest: 0,
    waist: 0,
    arms: 0,
    thighs: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await metricAPI.getMetrics();
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await metricAPI.logMetrics(newMetric);
      fetchMetrics();
      alert('Metrics logged successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Body Metrics</h1>
        <p className="text-gray-400 mt-1">Track your physical transformation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6">Log New Measurements</h3>
          <form onSubmit={handleLog} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Weight (kg)</label>
                <input 
                  type="number" step="0.1" className="input-field w-full"
                  value={newMetric.weight} onChange={e => setNewMetric({...newMetric, weight: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Body Fat (%)</label>
                <input 
                  type="number" step="0.1" className="input-field w-full"
                  value={newMetric.bodyFat} onChange={e => setNewMetric({...newMetric, bodyFat: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Chest (cm)</label>
                <input 
                  type="number" step="0.1" className="input-field w-full"
                  value={newMetric.chest} onChange={e => setNewMetric({...newMetric, chest: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Waist (cm)</label>
                <input 
                  type="number" step="0.1" className="input-field w-full"
                  value={newMetric.waist} onChange={e => setNewMetric({...newMetric, waist: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Arms (cm)</label>
                <input 
                  type="number" step="0.1" className="input-field w-full"
                  value={newMetric.arms} onChange={e => setNewMetric({...newMetric, arms: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Thighs (cm)</label>
                <input 
                  type="number" step="0.1" className="input-field w-full"
                  value={newMetric.thighs} onChange={e => setNewMetric({...newMetric, thighs: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3 rounded-xl mt-4">
              Log Progress
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 glass-card p-6 overflow-x-auto">
          <h3 className="text-lg font-bold text-white mb-6">Measurement History</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 uppercase border-b border-white/5">
                <th className="pb-4">Date</th>
                <th className="pb-4">Weight</th>
                <th className="pb-4">Body Fat</th>
                <th className="pb-4">Waist</th>
                <th className="pb-4">Chest</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {metrics.map((m, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-4 text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-white font-medium">{m.weight}kg</td>
                  <td className="py-4 text-white">{m.bodyFat}%</td>
                  <td className="py-4 text-white">{m.waist}cm</td>
                  <td className="py-4 text-white">{m.chest}cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
