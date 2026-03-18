import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiOutlineFlag, HiOutlineSparkles, HiTrash } from 'react-icons/hi';
import { goalAPI } from '../services/api';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';
import DietSplitWizard from '../components/goals/DietSplitWizard';

interface Goal {
  id: string;
  weeklyWorkoutGoal: number;
  calorieGoal: number;
  goalType?: string;
  targetDuration?: string;
  completed: boolean;
  createdAt: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [dietWizardOpen, setDietWizardOpen] = useState(false);
  const [form, setForm] = useState({ 
    weeklyWorkoutGoal: '5', 
    calorieGoal: '2000',
    goalType: 'Muscle Gain',
    targetDuration: '12 weeks'
  });

  const fetchGoals = async () => {
    try {
      const res = await goalAPI.getAll();
      setGoals(res.data);
    } catch {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalAPI.create({
        weeklyWorkoutGoal: parseInt(form.weeklyWorkoutGoal),
        calorieGoal: parseInt(form.calorieGoal),
        goalType: form.goalType,
        targetDuration: form.targetDuration,
      });
      toast.success('Goal created!');
      setModalOpen(false);
      fetchGoals();
    } catch {
      toast.error('Failed to create goal');
    }
  };

  const toggleGoal = async (goal: Goal) => {
    try {
      await goalAPI.update(goal.id, { 
        ...goal,
        completed: !goal.completed 
      });
      toast.success(goal.completed ? 'Goal reopened' : 'Goal completed! 🎉');
      fetchGoals();
    } catch {
      toast.error('Failed to update goal');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalAPI.delete(id);
      toast.success('Goal deleted');
      fetchGoals();
    } catch {
      toast.error('Failed to delete goal');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Goals</h1>
          <p className="text-gray-400 mt-1">Set and track your fitness targets</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDietWizardOpen(true)} 
            className="btn-secondary flex items-center gap-2 border-primary/20 text-primary-light hover:border-primary/50"
          >
            <HiOutlineSparkles className="w-5 h-5" /> Generate Diet Plan
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <HiPlus className="w-5 h-5" /> New Goal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card p-6 h-24 animate-pulse" />)}</div>
      ) : goals.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
          <HiOutlineFlag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No goals yet</h3>
          <p className="text-gray-500">Set your first fitness goal to stay motivated!</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card-hover p-6 ${goal.completed ? 'border-accent-green/30' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleGoal(goal)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      goal.completed
                        ? 'bg-accent-green text-white'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:border-accent-green/50'
                    }`}
                  >
                    {goal.completed ? '✓' : '○'}
                  </button>
                  <div>
                    <h3 className={`text-lg font-semibold ${goal.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {goal.goalType} • {goal.weeklyWorkoutGoal} workouts/week
                    </h3>
                    <p className="text-sm text-gray-400">
                      Target: {goal.targetDuration} • {goal.calorieGoal} kcal/week
                    </p>
                    <p className="text-sm text-gray-500">
                      Created {new Date(goal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    goal.completed
                      ? 'bg-accent-green/10 text-accent-green'
                      : 'bg-primary/10 text-primary-light'
                  }`}>
                    {goal.completed ? 'Completed' : 'In Progress'}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}
                    className="p-2 text-gray-500 hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-all"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Wizard Modals */}
      {dietWizardOpen && (
        <DietSplitWizard 
          onClose={() => setDietWizardOpen(false)} 
          userGoal={goals.length > 0 ? goals[0].goalType : undefined} 
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Goal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Weekly Workout Goal</label>
            <input type="number" value={form.weeklyWorkoutGoal} onChange={(e) => setForm({ ...form, weeklyWorkoutGoal: e.target.value })} className="input-field" min="1" max="14" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Weekly Calorie Goal</label>
            <input type="number" value={form.calorieGoal} onChange={(e) => setForm({ ...form, calorieGoal: e.target.value })} className="input-field" min="100" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Goal Type</label>
            <select value={form.goalType} onChange={(e) => setForm({ ...form, goalType: e.target.value })} className="input-field" required>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Bulking">Bulking</option>
              <option value="Fat Loss">Fat Loss</option>
              <option value="Endurance">Endurance</option>
              <option value="Strength">Strength</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Target Duration</label>
            <select value={form.targetDuration} onChange={(e) => setForm({ ...form, targetDuration: e.target.value })} className="input-field" required>
              <option value="4 weeks">4 weeks</option>
              <option value="8 weeks">8 weeks</option>
              <option value="12 weeks">12 weeks</option>
              <option value="16 weeks">16 weeks</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">Create Goal</button>
        </form>
      </Modal>
    </div>
  );
}
