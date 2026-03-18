import { motion } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineFlag, HiOutlineStar } from 'react-icons/hi';

interface TimelineItem {
  id: string;
  type: 'workout' | 'goal' | 'record';
  title: string;
  description: string;
  date: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
  isLoading: boolean;
}

const typeConfig = {
  workout: {
    icon: <HiOutlineLightningBolt className="w-4 h-4" />,
    color: 'bg-primary',
    borderColor: 'border-primary/30',
  },
  goal: {
    icon: <HiOutlineFlag className="w-4 h-4" />,
    color: 'bg-accent-green',
    borderColor: 'border-accent-green/30',
  },
  record: {
    icon: <HiOutlineStar className="w-4 h-4" />,
    color: 'bg-accent-yellow',
    borderColor: 'border-accent-yellow/30',
  },
};

export default function ActivityTimeline({ items, isLoading }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="h-5 w-40 bg-card rounded animate-pulse mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-card animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-card rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-card rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-200 mb-4">📋 Activity Timeline</h3>
      <div className="space-y-1">
        {items.slice(0, 8).map((item, index) => {
          const config = typeConfig[item.type] || typeConfig.workout;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="flex gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white`}>
                  {config.icon}
                </div>
                {index < items.length - 1 && (
                  <div className="w-px h-full bg-white/5 mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200">{item.title}</p>
                <p className="text-xs text-gray-500 truncate">{item.description}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No activity yet. Start logging workouts!</p>
        )}
      </div>
    </motion.div>
  );
}
