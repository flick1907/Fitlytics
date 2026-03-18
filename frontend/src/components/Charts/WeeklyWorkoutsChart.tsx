import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { motion } from 'framer-motion';

interface WeeklyWorkoutsChartProps {
  data: { day: string; workouts: number; calories: number }[];
}

export default function WeeklyWorkoutsChart({ data }: WeeklyWorkoutsChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-200 mb-6">📊 Weekly Workouts</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#6B7280', fontSize: 11 }} 
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false} 
          />
          <YAxis hide domain={[0, 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#E5E7EB',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="workouts" fill="url(#barGradient)" radius={[6, 6, 0, 0]} animationDuration={1500}>
            <LabelList dataKey="workouts" position="top" fill="#60A5FA" fontSize={11} fontWeight="bold" offset={10} />
          </Bar>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
