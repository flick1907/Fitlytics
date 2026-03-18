import { motion } from 'framer-motion';
import { IoTrophyOutline } from 'react-icons/io5';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';

export interface PersonalRecord {
  lift: string;
  weight: number;
  date: string;
  trend: 'up' | 'down' | 'flat';
}

interface PersonalRecordsProps {
  records: PersonalRecord[];
}

export default function PersonalRecords({ records }: PersonalRecordsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <IoTrophyOutline className="text-yellow-500 w-5 h-5" /> Personal Records
        </h3>
        <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md">All-Time</span>
      </div>

      {records.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <IoTrophyOutline className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-sm text-gray-400">Log more sets to establish your PRs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 flex-1">
          {records.map((record, index) => (
            <motion.div
              key={record.lift}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{record.lift}</span>
                {record.trend === 'up' && <FaArrowTrendUp className="w-3 h-3 text-emerald-400" />}
                {record.trend === 'down' && <FaArrowTrendDown className="w-3 h-3 text-red-400" />}
              </div>
              
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-2xl font-black text-white">{record.weight}</span>
                <span className="text-sm text-gray-500 font-medium">kg</span>
              </div>
              
              <div className="mt-2 text-[10px] text-gray-500 relative z-10">
                Achieved: {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
