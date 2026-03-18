import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { HiOutlineUserGroup } from 'react-icons/hi';
import EmptyState from '../UI/EmptyState';

interface MuscleGroupChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'];

export default function MuscleGroupChart({ data }: MuscleGroupChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-6 h-full min-h-[400px]">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <HiOutlineUserGroup className="text-primary" /> Muscle Group Distribution
        </h3>
        <EmptyState title="No Muscle Group Data" message="Categorize your workouts to see the distribution." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-6 h-full"
    >
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <HiOutlineUserGroup className="text-primary" /> Muscle Group Distribution
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationBegin={200}
              animationDuration={1500}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#E5E7EB',
                fontSize: '12px'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-[11px] text-gray-400 font-medium capitalize">{value}</span>}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
