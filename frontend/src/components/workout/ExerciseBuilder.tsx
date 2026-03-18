import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { libraryAPI } from '../../services/api';

const EXERCISE_DATABASE: Record<string, string[]> = {};

interface Exercise {
  exercise: string;
  exerciseType: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Props {
  exercises: Exercise[];
  onChange: (val: Exercise[]) => void;
  workoutType: string;
}

export default function ExerciseBuilder({ exercises, onChange, workoutType }: Props) {
  const [numExercises, setNumExercises] = useState(exercises.length || 1);
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    libraryAPI.getExercises().then(res => {
      setExerciseList(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Group exercises by muscle group and filter by workoutType
  const groupedExercises: Record<string, any[]> = {};
  exerciseList.forEach(ex => {
    // If not a Strength workout, filter out strength exercises
    if (workoutType !== 'Strength' && ex.exerciseType?.toLowerCase() === 'strength') {
      return;
    }
    if (!groupedExercises[ex.muscleGroup]) groupedExercises[ex.muscleGroup] = [];
    groupedExercises[ex.muscleGroup].push(ex);
  });

  const addExercise = () => {
    const defaultType = workoutType === 'Strength' ? 'Strength' : 'Bodyweight';
    onChange([...exercises, { exercise: '', exerciseType: defaultType, sets: 3, reps: 10, weight: 0 }]);
    setNumExercises(prev => prev + 1);
  };

  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    onChange(newExercises);
    setNumExercises(newExercises.length);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    onChange(newExercises);
  };

  // Initialize with at least one exercise if empty
  if (exercises.length === 0 && numExercises > 0) {
    const defaultType = workoutType === 'Strength' ? 'Strength' : 'Bodyweight';
    onChange([{ exercise: '', exerciseType: defaultType, sets: 3, reps: 10, weight: 0 }]);
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Exercise Details</h3>
        <p className="text-gray-400">Add the exercises you performed in this session.</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {exercises.map((ex, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 border border-white/5 relative group"
            >
              <button 
                onClick={() => removeExercise(index)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-primary block mb-2 uppercase tracking-wider">
                    Exercise {index + 1}
                  </label>
                  <select
                    value={ex.exercise}
                    onChange={(e) => updateExercise(index, 'exercise', e.target.value)}
                    className="input-field w-full bg-white/5 border-white/10"
                    required
                  >
                    <option value="" disabled className="bg-gray-900">
                      {loading ? 'Loading...' : 'Select exercise...'}
                    </option>
                    {Object.entries(groupedExercises).map(([group, list]) => (
                      <optgroup key={group} label={group} className="bg-gray-900 font-bold text-primary">
                        {list.map(ex => (
                          <option key={ex.id} value={ex.name} className="bg-gray-900 text-white font-normal">
                            {ex.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1 uppercase tracking-wider">Type</label>
                  <select
                    value={ex.exerciseType}
                    onChange={(e) => updateExercise(index, 'exerciseType', e.target.value)}
                    className="input-field w-full bg-white/5 border-white/10"
                    required
                  >
                    {workoutType === 'Strength' && <option value="Strength">Strength</option>}
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Core">Core</option>
                    <option value="Cardio">Cardio</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4 md:col-span-2">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Sets</label>
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                      className="input-field py-2 text-center"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Reps</label>
                    <input
                      type="number"
                      value={ex.reps}
                      onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                      className="input-field py-2 text-center"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={ex.weight}
                      onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                      className="input-field py-2 text-center"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={addExercise}
          className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Another Exercise
        </button>
      </div>
    </div>
  );
}
