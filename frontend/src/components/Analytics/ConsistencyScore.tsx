import { motion } from 'framer-motion';
import { HiOutlineBadgeCheck } from 'react-icons/hi';

interface ConsistencyScoreProps {
  score: number; // 0 to 100
  workoutsThisWeek: number;
  targetWorkouts: number;
}

export default function ConsistencyScore({ score, workoutsThisWeek, targetWorkouts }: ConsistencyScoreProps) {
  // Determine color based on score
  const getColorClass = (val: number) => {
    if (val >= 80) return 'text-emerald-400';
    if (val >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const colorClass = getColorClass(score);
  
  // Calculate SVG stroke attributes
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HiOutlineBadgeCheck className="text-primary w-5 h-5" /> Consistency Score
        </h3>
      </div>
      
      <p className="text-xs text-gray-400 mb-6">Based on your weekly target frequency</p>

      <div className="flex items-center justify-between flex-1">
        {/* Circular Progress */}
        <div className="relative w-28 h-28 flex items-center justify-center mx-auto sm:mx-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              cx="56"
              cy="56"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className={`${colorClass} drop-shadow-[0_0_8px_currentColor]`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black ${colorClass}`}>{score}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-right pr-2">
          <div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">This Week</div>
            <div className="text-2xl font-bold text-white">{workoutsThisWeek} <span className="text-sm text-gray-400 font-normal">/ {targetWorkouts}</span></div>
          </div>
          <div className="text-xs text-gray-400">
            {score >= 100 ? "Goal Crushed! 🔥" : score >= 75 ? "On track! Keep it up. 💪" : "Room for improvement."}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
