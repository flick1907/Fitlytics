import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineX, HiOutlineLightningBolt } from 'react-icons/hi';
import WorkoutTypeStep from './WorkoutTypeStep';
import MuscleGroupStep from './MuscleGroupStep';
import ExerciseBuilder from './ExerciseBuilder';
import CardioStep from './CardioStep';
import WorkoutSummary from './WorkoutSummary';
import { workoutAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export type WorkoutData = {
  workoutType: string;
  muscleGroup: string;
  exercises: { exercise: string; exerciseType: string; sets: number; reps: number; weight: number }[];
  cardio: { type: string; duration: number; intensity: 'Low' | 'Moderate' | 'High' } | null;
};

const steps = [
  'Workout Type',
  'Muscle Group',
  'Exercises',
  'Cardio',
  'Summary'
];

export default function WorkoutWizard({ onClose, onSuccess }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WorkoutData>({
    workoutType: '',
    muscleGroup: '',
    exercises: [],
    cardio: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [heavyWorkoutCount, setHeavyWorkoutCount] = useState(0);

  React.useEffect(() => {
    const checkDailyWorkouts = async () => {
      try {
        const res = await workoutAPI.getAll(1, 20);
        const today = new Date().toISOString().split('T')[0];
        const heavyToday = res.data.workouts.filter((w: any) => {
          const wDate = new Date(w.createdAt).toISOString().split('T')[0];
          return wDate === today && (w.workoutType === 'Strength' || w.workoutType === 'Mixed');
        });
        setHeavyWorkoutCount(heavyToday.length);
      } catch (err) {
        console.error('Error checking daily workouts:', err);
      }
    };
    checkDailyWorkouts();
  }, []);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSave = async () => {
    setIsLoading(true);
    if ((data.workoutType === 'Strength' || data.workoutType === 'Mixed') && heavyWorkoutCount >= 2) {
      toast.error('Daily limit for intensive workouts reached. Please rest.');
      setIsLoading(false);
      return;
    }
    
    try {
      await workoutAPI.log({
        workoutType: data.workoutType,
        muscleGroup: data.muscleGroup,
        exercises: data.exercises,
        cardio: data.cardio ? {
          type: data.cardio.type,
          duration: data.cardio.duration,
          intensity: data.cardio.intensity
        } : undefined
      });
      toast.success('Workout logged successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to log workout');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WorkoutTypeStep 
          value={data.workoutType} 
          onChange={(val) => setData({ ...data, workoutType: val })} 
          onNext={nextStep}
          strengthCount={heavyWorkoutCount}
        />;
      case 1:
        return <MuscleGroupStep 
          value={data.muscleGroup} 
          onChange={(val) => setData({ ...data, muscleGroup: val })} 
          onNext={nextStep}
          workoutType={data.workoutType}
        />;
      case 2:
        return <ExerciseBuilder 
          exercises={data.exercises} 
          onChange={(val) => setData({ ...data, exercises: val })}
          workoutType={data.workoutType}
        />;
      case 3:
        return <CardioStep 
          value={data.cardio} 
          onChange={(val) => setData({ ...data, cardio: val })}
        />;
      case 4:
        return <WorkoutSummary data={data} isLoading={isLoading} onSave={handleSave} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Log Workout</h2>
            <div className="flex items-center gap-2 mt-1">
              {steps.map((step, i) => (
                <React.Fragment key={step}>
                  <span className={`text-xs ${i === currentStep ? 'text-primary' : 'text-gray-500'}`}>
                    {step}
                  </span>
                  {i < steps.length - 1 && <span className="text-gray-700">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5 w-full">
          <motion.div 
            className="h-full bg-primary shadow-[0_0_10px_#3b82f6]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Workout Restriction Warning */}
              {(data.workoutType === 'Strength' || data.workoutType === 'Mixed') && heavyWorkoutCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mb-6 p-4 rounded-xl border flex gap-4 ${
                    heavyWorkoutCount >= 2 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  }`}
                >
                  <div className="pt-0.5">
                    <HiOutlineLightningBolt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      {heavyWorkoutCount >= 2 ? 'Strict Limit Reached' : 'Intensive Session Detected'}
                    </h4>
                    <p className="text-xs opacity-80 mt-1 leading-relaxed">
                      {heavyWorkoutCount >= 2 
                        ? "You've already completed 2 intensive sessions (Strength/Mixed) today. Logging more is strictly blocked to prevent severe fatigue and injury. Recovery is essential!" 
                        : `You've already logged ${heavyWorkoutCount} intensive session today. Training at this intensity multiple times can lead to overtraining. Priority should be proper recovery.`}
                    </p>
                  </div>
                </motion.div>
              )}
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            {currentStep < steps.length - 1 && (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 0 && !data.workoutType) ||
                  (currentStep === 0 && (data.workoutType === 'Strength' || data.workoutType === 'Mixed') && heavyWorkoutCount >= 2) ||
                  (currentStep === 1 && (data.workoutType === 'Strength' || data.workoutType === 'Calisthenics') && !data.muscleGroup) ||
                  (currentStep === 2 && data.exercises.length === 0)
                }
                className="btn-primary flex items-center gap-2 px-6"
              >
                {(data.workoutType === 'Strength' || data.workoutType === 'Mixed') && heavyWorkoutCount >= 2 && currentStep === 0 ? 'Blocked' : 'Next Step'}
                <HiOutlineArrowRight className="w-5 h-5" />
              </button>
            )}
        </div>
      </motion.div>
    </div>
  );
}
