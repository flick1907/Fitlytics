import { motion } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineSparkles } from 'react-icons/hi';

interface SmartInsightsProps {
  insights: string[];
}

export default function SmartInsights({ insights }: SmartInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6 h-full flex flex-col relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <HiOutlineSparkles className="w-24 h-24 text-primary" />
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HiOutlineLightningBolt className="text-primary w-5 h-5" /> Smart Insights
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30 bg-primary/10 px-2 py-1 rounded-full">AI Analysis</span>
      </div>

      <div className="flex flex-col gap-3 relative z-10 flex-1 justify-center">
        {insights.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center">Log more workouts to generate personalized insights.</p>
        ) : (
          insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.15 }}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <p className="text-sm text-gray-300 leading-snug">{insight}</p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
