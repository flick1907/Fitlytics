import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { motion } from 'framer-motion';

interface WeightProgressChartProps {
  data: { date: string; weight: number }[];
}

export default function WeightProgressChart({ data }: WeightProgressChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-200 mb-6">⚖️ Weight Progress</h3>
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm italic">
          No weight data recorded yet. Add a progress entry!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280', fontSize: 11 }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 11 }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false} 
              domain={['auto', 'auto']}
              hide
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#E5E7EB',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#8B5CF6' }}
            />
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="weight"
              stroke="url(#weightGradient)"
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#EC4899' }}
              animationDuration={1500}
            >
              <LabelList dataKey="weight" position="top" offset={10} fill="#A78BFA" fontSize={10} fontWeight="bold" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
