import { motion } from 'framer-motion';
import { HiOutlineCheck, HiOutlineFire, HiOutlineScale, HiOutlineLightningBolt } from 'react-icons/hi';
import { WorkoutData } from './WorkoutWizard';

interface Props {
  data: WorkoutData;
  isLoading: boolean;
  onSave: () => void;
}

export default function WorkoutSummary({ data, isLoading, onSave }: Props) {
  // Frontend preview calculations (matching backend)
  const strengthCals = data.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight * 0.1), 0);
  let cardioCals = 0;
  if (data.cardio) {
    const intensityMultiplier = data.cardio.intensity === 'Low' ? 4 : data.cardio.intensity === 'Moderate' ? 7 : 10;
    cardioCals = data.cardio.duration * intensityMultiplier;
  }
  const totalCals = Math.round(strengthCals + cardioCals);
  const totalVolume = data.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0);
  const totalSets = data.exercises.reduce((sum, ex) => sum + ex.sets, 0);

  let rating = 'Light';
  let ratingColor = 'text-accent-cyan bg-accent-cyan/10';
  if (totalCals >= 500) {
    rating = 'Elite';
    ratingColor = 'text-accent-purple bg-accent-purple/10 ring-1 ring-accent-purple/50';
  } else if (totalCals >= 300) {
    rating = 'Intense';
    ratingColor = 'text-accent-red bg-accent-red/10';
  } else if (totalCals >= 150) {
    rating = 'Moderate';
    ratingColor = 'text-accent-yellow bg-accent-yellow/10';
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Workout Summary</h3>
        <p className="text-gray-400">Review your workout stats before saving.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <HiOutlineLightningBolt className="w-6 h-6 text-primary mx-auto mb-2" />
          <span className="block text-xl font-bold text-white">{totalCals}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Est. Calories</span>
        </div>
        <div className="glass-card p-4 text-center">
          <HiOutlineScale className="w-6 h-6 text-accent-green mx-auto mb-2" />
          <span className="block text-xl font-bold text-white">{totalVolume}kg</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Total Volume</span>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="mx-auto mb-2 flex justify-center">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${ratingColor}`}>
               {rating}
             </span>
          </div>
          <span className="block text-xl font-bold text-white">{rating}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Effort Level</span>
        </div>
      </div>

      <div className="glass-card p-6 border-white/5 space-y-4">
        <h4 className="font-bold text-white border-b border-white/5 pb-2">Session Highlights</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Workout Category</span>
            <span className="text-white font-medium">{data.workoutType}</span>
          </div>
          {data.muscleGroup && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target Area</span>
              <span className="text-white font-medium">{data.muscleGroup}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Exercises</span>
            <span className="text-white font-medium">{data.exercises.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Sets</span>
            <span className="text-white font-medium">{totalSets}</span>
          </div>
          {data.cardio && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Cardio Activity</span>
              <span className="text-white font-medium">{data.cardio.type} ({data.cardio.duration}m)</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={isLoading}
        className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
      >
        {isLoading ? (
          'Saving Workout...'
        ) : (
          <>
            <HiOutlineCheck className="w-6 h-6" />
            Complete & Log Session
          </>
        )}
      </button>
    </div>
  );
}
