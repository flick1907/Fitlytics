import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { motion } from 'framer-motion';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import EmptyState from '../UI/EmptyState';

interface TrainingVolumeChartProps {
  data: { date: string; volume: number }[];
}

export default function TrainingVolumeChart({ data }: TrainingVolumeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-6 h-full min-h-[400px]">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <HiOutlineLightningBolt className="text-accent-yellow" /> Training Volume Trend (kg)
        </h3>
        <EmptyState title="No Volume Data" message="Add exercises with weight and sets to track volume." />
      </div>
    );
  }

  // Ensure dates are formatted for the axis
  const chartData = data.map(d => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6 h-full"
    >
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <HiOutlineLightningBolt className="text-accent-yellow" /> Training Volume Trend (kg)
      </h3>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
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
              formatter={(value: number) => [`${value.toLocaleString()} kg`, 'Volume']}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#F59E0B"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorVolume)"
              animationDuration={1500}
              activeDot={{ r: 6, fill: '#F59E0B', stroke: '#111827', strokeWidth: 2 }}
            >
              <LabelList 
                dataKey="volume" 
                position="top" 
                offset={10} 
                fill="#FBBF24" 
                fontSize={10} 
                fontWeight="bold"
                formatter={(val: number) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
