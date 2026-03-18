import { motion } from 'framer-motion';

interface GoalProgressProps {
  goalCompletion: {
    workoutGoal: number;
    workoutsCompleted: number;
    workoutProgress: number;
    calorieGoal: number;
    caloriesCompleted: number;
    calorieProgress: number;
  } | null;
}

function ProgressBar({ label, current, goal, percent, color }: {
  label: string;
  current: number;
  goal: number;
  percent: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300">{current} / {goal}</span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{percent}% completed</p>
    </div>
  );
}

export default function GoalProgress({ goalCompletion }: GoalProgressProps) {
  if (!goalCompletion) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">🎯 Goal Progress</h3>
        <p className="text-sm text-gray-500">No goals set. Create your first goal!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-200 mb-6">🎯 Goal Progress</h3>
      <div className="space-y-6">
        <ProgressBar
          label="Weekly Workouts"
          current={goalCompletion.workoutsCompleted}
          goal={goalCompletion.workoutGoal}
          percent={goalCompletion.workoutProgress}
          color="from-primary to-primary-light"
        />
        <ProgressBar
          label="Calorie Goal"
          current={goalCompletion.caloriesCompleted}
          goal={goalCompletion.calorieGoal}
          percent={goalCompletion.calorieProgress}
          color="from-accent-green to-accent-cyan"
        />
      </div>
    </motion.div>
  );
}
