import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: 'easeOut' });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function StatCard({ title, value, suffix = '', icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="stat-card group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 ${gradient} group-hover:opacity-20 transition-opacity duration-500`} />
      
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
      </div>

      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-white">
          <AnimatedNumber value={value} />
        </span>
        {suffix && <span className="text-sm text-gray-400 mb-1">{suffix}</span>}
      </div>
    </motion.div>
  );
}
