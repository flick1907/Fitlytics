import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiOutlineLightningBolt, HiOutlineFire, HiOutlineCollection } from 'react-icons/hi';
import { workoutAPI } from '../services/api';
import WorkoutWizard from '../components/workout/WorkoutWizard';
import toast from 'react-hot-toast';

interface Exercise {
  id: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  id: string;
  workoutType: string;
  muscleGroup?: string;
  totalCalories: number;
  rating: string;
  createdAt: string;
  exercises: Exercise[];
  cardio: any[];
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);

  const fetchWorkouts = async () => {
    try {
      const res = await workoutAPI.getAll(1, 100);
      setWorkouts(res.data.workouts);
    } catch {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await workoutAPI.deleteWorkout(id);
      toast.success('Workout deleted');
      fetchWorkouts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Elite': return 'text-accent-purple bg-accent-purple/10 border-accent-purple/20';
      case 'Intense': return 'text-accent-red bg-accent-red/10 border-accent-red/20';
      case 'Moderate': return 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20';
      default: return 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-bold text-white">Workouts</h1>
          <p className="text-gray-400 mt-1">Professional training history</p>
        </motion.div>
        <button 
          onClick={() => setWizardOpen(true)} 
          className="btn-primary flex items-center gap-2 px-6 shadow-lg shadow-primary/20"
        >
          <HiPlus className="w-5 h-5" /> Log Session
        </button>
      </div>

      {/* Workout List */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card p-6 h-32 animate-pulse" />)}</div>
      ) : workouts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center">
          <HiOutlineLightningBolt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No training logs recorded</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Use the guided wizard to start logging your exercises and cardio sessions.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {workouts.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-hover border border-white/5 p-6 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-light/10 flex items-center justify-center text-primary-light border border-primary/20 shrink-0">
                      <HiOutlineCollection className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{w.workoutType}</h3>
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-tighter ${getRatingColor(w.rating)}`}>
                          {w.rating}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-gray-400">
                        {w.muscleGroup && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {w.muscleGroup}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                           <HiOutlineLightningBolt className="w-4 h-4 text-accent-yellow" />
                           {w.totalCalories} kcal
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                           {new Date(w.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Exercise Pills */}
                    <div className="flex flex-wrap gap-2">
                       {w.exercises.slice(0, 3).map(ex => (
                         <div key={ex.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
                           {ex.exerciseName} <span className="text-gray-500 ml-1">{ex.sets}×{ex.reps}</span>
                         </div>
                       ))}
                       {w.exercises.length > 3 && (
                         <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400">
                           +{w.exercises.length - 3} more
                         </div>
                       )}
                       {w.cardio && w.cardio.length > 0 && (
                         <div className="px-3 py-1 bg-accent-red/10 border border-accent-red/20 rounded-lg text-xs text-accent-red flex items-center gap-1">
                           <HiOutlineFire className="w-3 h-3" /> Cardio
                         </div>
                       )}
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(w.id)} 
                      className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-accent-red hover:bg-accent-red/10 transition-all ml-auto self-end sm:self-auto"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Wizard Modal */}
      <AnimatePresence>
        {wizardOpen && (
          <WorkoutWizard 
            onClose={() => setWizardOpen(false)} 
            onSuccess={fetchWorkouts}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
