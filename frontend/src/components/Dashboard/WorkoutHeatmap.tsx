import { motion } from 'framer-motion';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface HeatmapData {
  date: string;
  count: number;
}

interface WorkoutHeatmapProps {
  data: HeatmapData[];
  isLoading: boolean;
}

function getClassForValue(value: any) {
  if (!value || value.count === 0) return 'color-empty';
  if (value.count === 1) return 'color-scale-1';
  if (value.count === 2) return 'color-scale-2';
  if (value.count === 3) return 'color-scale-3';
  return 'color-scale-4';
}

export default function WorkoutHeatmap({ data, isLoading }: WorkoutHeatmapProps) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(startDate.getFullYear() - 1);

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="h-5 w-48 bg-card rounded animate-pulse mb-6" />
        <div className="h-32 w-full bg-card rounded animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-200 mb-4">
        🗓️ Workout Consistency
      </h3>
      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={data}
          classForValue={getClassForValue}
          tooltipDataAttrs={(value: any) => {
            return {
              'data-tooltip': value?.date ? `${value.date}: ${value.count} workout(s)` : '',
            } as any;
          }}
          showWeekdayLabels
        />
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        {['#1F2937', '#1e3a5f', '#2563EB', '#3B82F6', '#60A5FA'].map((color) => (
          <div
            key={color}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
}
