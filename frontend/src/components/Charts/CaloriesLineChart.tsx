import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import EmptyState from '../UI/EmptyState';

interface CaloriesLineChartProps {
  data: { day: string; calories: number }[];
  title?: string;
}

export default function CaloriesLineChart({ data, title = '🔥 Calories Burned' }: CaloriesLineChartProps) {
  // Filter out days with 0 calories if requested by user for "realistic" trend, 
  // but keep them if they are truly rest days. For a line chart, 0 values can make it look jagged.
  // We'll keep them but use a smooth monotone curve.
  
  if (!data || data.length === 0 || data.every(d => d.calories === 0)) {
    return (
      <div className="glass-card p-6 h-full min-h-[400px]">
        <h3 className="text-lg font-semibold text-gray-200 mb-6">{title}</h3>
        <EmptyState title="No Calorie Data" message="Workouts with calories will show up here." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6 h-full"
    >
      <h3 className="text-lg font-semibold text-gray-200 mb-6">{title}</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#6B7280', fontSize: 11 }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
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
              formatter={(value: number) => [`${value} kcal`, 'Calories']}
            />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCalories)"
              animationDuration={1500}
              activeDot={{ r: 6, fill: '#10B981', stroke: '#111827', strokeWidth: 2 }}
            >
              <LabelList dataKey="calories" position="top" offset={10} fill="#34D399" fontSize={10} fontWeight="bold" />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
