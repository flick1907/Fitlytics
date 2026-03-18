import { motion } from 'framer-motion';
import { HiOutlineCalendar } from 'react-icons/hi';
import { useMemo } from 'react';

// Help from Date objects
const ONE_DAY = 24 * 60 * 60 * 1000;

interface HeatmapData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: HeatmapData[];
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Generate the last 30 days grid
  const grid = useMemo(() => {
    const today = new Date();
    // Normalize today to start of day
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getTime() - i * ONE_DAY);
      const dateStr = d.toISOString().split('T')[0];
      const match = data.find((x) => x.date === dateStr);

      days.push({
        date: dateStr,
        count: match ? match.count : 0,
        dayOfWeek: d.getDay(),
      });
    }
    return days;
  }, [data]);

  // Max intensity for scaling color
  const maxIntensity = Math.max(...grid.map((d) => d.count), 1);

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-[#1F2937] border-white/5'; // Empty state

    const ratio = count / maxIntensity;
    if (ratio <= 0.25) return 'bg-emerald-900 border-emerald-800';
    if (ratio <= 0.5) return 'bg-emerald-700 border-emerald-600';
    if (ratio <= 0.75) return 'bg-emerald-500 border-emerald-400';
    return 'bg-emerald-400 border-emerald-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 w-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HiOutlineCalendar className="text-emerald-400 w-5 h-5" /> Activity Heatmap
        </h3>
        <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md">Last 30 Days</span>
      </div>

      <div className="flex flex-col items-center sm:items-start group relative">
        <div className="flex gap-1 sm:gap-1.5 flex-wrap">
          {grid.map((day, i) => (
            <motion.div
              key={day.date}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02 + 0.3, type: "spring", stiffness: 200 }}
              className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-sm border ${getIntensityColor(day.count)} transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer group/cell`}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-md opacity-0 font-medium tracking-wide group-hover/cell:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10 z-50">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {day.count} workout{day.count !== 1 ? 's' : ''}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 self-end text-xs text-gray-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-[#1F2937] border border-white/5" />
          <div className="w-3 h-3 rounded-sm bg-emerald-900 border border-emerald-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-700 border border-emerald-600" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300" />
          <span>More</span>
        </div>
      </div>
    </motion.div>
  );
}
