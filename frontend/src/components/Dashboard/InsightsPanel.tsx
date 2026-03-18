import { motion } from 'framer-motion';
import { HiLightningBolt, HiTrendingUp, HiStar } from 'react-icons/hi';

interface InsightsPanelProps {
  insights: string[];
  isLoading: boolean;
}

export default function InsightsPanel({ insights, isLoading }: InsightsPanelProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="h-5 w-40 bg-card rounded animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-full bg-card rounded-xl animate-pulse mb-3" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink text-white">
          <HiLightningBolt className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-semibold text-gray-200">AI Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="mt-0.5">
              {index === 0 ? (
                <HiStar className="w-4 h-4 text-accent-yellow" />
              ) : (
                <HiTrendingUp className="w-4 h-4 text-primary-light" />
              )}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
