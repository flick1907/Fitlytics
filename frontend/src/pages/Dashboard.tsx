import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineFire, HiOutlineTrendingUp, HiOutlineCalendar } from 'react-icons/hi';
import { statsAPI, analyticsAPI, recoveryAPI } from '../services/api';
import StatCard from '../components/Dashboard/StatCard';
import GoalProgress from '../components/Dashboard/GoalProgress';
import WeeklyWorkoutsChart from '../components/Charts/WeeklyWorkoutsChart';
import CaloriesLineChart from '../components/Charts/CaloriesLineChart';
import TrainingVolumeChart from '../components/Charts/TrainingVolumeChart';
import WorkoutHeatmap from '../components/Dashboard/WorkoutHeatmap';
import InsightsPanel from '../components/Dashboard/InsightsPanel';
import PersonalRecords from '../components/Dashboard/PersonalRecords';
import ActivityTimeline from '../components/Dashboard/ActivityTimeline';
import { StatCardSkeleton } from '../components/UI/Skeleton';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [records, setRecords] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [recovery, setRecovery] = useState<any>(null);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes, 
          heatmapRes, 
          insightsRes, 
          recordsRes, 
          timelineRes, 
          recoveryRes, 
          volumeDataRes
        ] = await Promise.all([
          statsAPI.getDashboard(),
          analyticsAPI.getHeatmap(),
          analyticsAPI.getInsights(),
          analyticsAPI.getPersonalRecords(),
          analyticsAPI.getTimeline(),
          recoveryAPI.getStatus(),
          analyticsAPI.getTrainingVolume(),
        ]);
        setStats(statsRes.data);
        setHeatmap(heatmapRes.data);
        setInsights(insightsRes.data.insights);
        setRecords(recordsRes.data);
        setTimeline(timelineRes.data);
        setRecovery(recoveryRes.data);
        setVolumeData(volumeDataRes.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Your fitness overview at a glance</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Workouts"
              value={stats?.totalWorkouts || 0}
              icon={<HiOutlineLightningBolt className="w-5 h-5" />}
              gradient="from-primary to-primary-light"
              delay={0}
            />
            <StatCard
              title="Calories Burned"
              value={stats?.totalCalories || 0}
              suffix="kcal"
              icon={<HiOutlineFire className="w-5 h-5" />}
              gradient="from-accent-red to-accent-yellow"
              delay={0.1}
            />
            <StatCard
              title="Current Streak"
              value={stats?.currentStreak || 0}
              suffix="days"
              icon={<HiOutlineTrendingUp className="w-5 h-5" />}
              gradient="from-accent-green to-accent-cyan"
              delay={0.2}
            />
            <StatCard
              title="This Week"
              value={stats?.weeklyWorkouts || 0}
              suffix="workouts"
              icon={<HiOutlineCalendar className="w-5 h-5" />}
              gradient="from-accent-purple to-accent-pink"
              delay={0.3}
            />
          </>
        )}
      </motion.div>

      {/* Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GoalProgress goalCompletion={stats?.goalCompletion || null} />
      </motion.div>

      {/* Charts */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <WeeklyWorkoutsChart data={stats?.weeklySummary || []} />
        <TrainingVolumeChart data={volumeData.slice(-7)} />
      </motion.div>

      {/* Recovery Status */}
      {!loading && recovery && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55 }}
          className="glass-card p-6 border-l-4 border-l-primary"
          style={{ borderLeftColor: recovery.status === 'Rest Day' ? '#ef4444' : recovery.status === 'Light Workout' ? '#f59e0b' : '#3b82f6' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HiOutlineLightningBolt className={recovery.status === 'Rest Day' ? 'text-red-500' : 'text-primary'} /> 
                Recovery Status: <span style={{ color: recovery.status === 'Rest Day' ? '#ef4444' : recovery.status === 'Light Workout' ? '#f59e0b' : '#3b82f6' }}>{recovery.status}</span>
              </h3>
              <p className="text-gray-400 text-sm mt-1">{recovery.message}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-w-[200px]">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Recommendation</div>
              <div className="text-primary-light font-bold">{recovery.recommendation}</div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <WorkoutHeatmap data={heatmap} isLoading={loading} />
      </motion.div>

      {/* Insights + Records */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <InsightsPanel insights={insights} isLoading={loading} />
        <PersonalRecords data={records} isLoading={loading} />
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <ActivityTimeline items={timeline} isLoading={loading} />
      </motion.div>
    </motion.div>
  );
}
