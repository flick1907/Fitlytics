import { motion } from 'framer-motion';
import { HiOutlineTrendingUp, HiOutlineFire, HiOutlineLightningBolt, HiOutlineCalendar } from 'react-icons/hi';

interface PersonalRecordsData {
  maxWeightLifted: number;
  maxCaloriesBurned: number;
  longestStreak: number;
  maxWorkoutsInDay: number;
  totalWorkouts: number;
}

interface PersonalRecordsProps {
  data: PersonalRecordsData | null;
  isLoading: boolean;
}

export default function PersonalRecords({ data, isLoading }: PersonalRecordsProps) {
  if (isLoading || !data) {
    return (
      <div className="glass-card p-6">
        <div className="h-5 w-40 bg-card rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const records = [
    {
      label: 'Max Weight Lifted',
      value: `${data.maxWeightLifted} kg`,
      icon: <HiOutlineTrendingUp className="w-5 h-5" />,
      color: 'from-primary to-primary-light',
    },
    {
      label: 'Max Calories Burned',
      value: `${data.maxCaloriesBurned} kcal`,
      icon: <HiOutlineFire className="w-5 h-5" />,
      color: 'from-accent-red to-accent-yellow',
    },
    {
      label: 'Longest Streak',
      value: `${data.longestStreak} days`,
      icon: <HiOutlineLightningBolt className="w-5 h-5" />,
      color: 'from-accent-green to-accent-cyan',
    },
    {
      label: 'Total Workouts',
      value: `${data.totalWorkouts}`,
      icon: <HiOutlineCalendar className="w-5 h-5" />,
      color: 'from-accent-purple to-accent-pink',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-200 mb-4">🏅 Personal Records</h3>
      <div className="grid grid-cols-2 gap-3">
        {records.map((record, i) => (
          <motion.div
            key={record.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-200"
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${record.color} text-white mb-2`}>
              {record.icon}
            </div>
            <p className="text-lg font-bold text-white">{record.value}</p>
            <p className="text-xs text-gray-500">{record.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
