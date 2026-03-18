import React, { useEffect, useState } from 'react';
import { workoutAPI, analyticsAPI } from '../services/api';
import WeeklyWorkoutsChart from '../components/Charts/WeeklyWorkoutsChart';
import CaloriesLineChart from '../components/Charts/CaloriesLineChart';
import WorkoutTypePieChart from '../components/Charts/WorkoutTypePieChart';
import TrainingVolumeChart from '../components/Charts/TrainingVolumeChart';
import MuscleGroupChart from '../components/Charts/MuscleGroupChart';
import { ChartSkeleton } from '../components/UI/Skeleton';
import { HiOutlineTrendingUp, HiOutlineLightningBolt } from 'react-icons/hi';
import ActivityHeatmap from '../components/Charts/ActivityHeatmap';
import PersonalRecords from '../components/Analytics/PersonalRecords';
import ConsistencyScore from '../components/Analytics/ConsistencyScore';
import SmartInsights from '../components/Analytics/SmartInsights';
export default function Analytics() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState('Bench Press');
  const [exerciseProgress, setExerciseProgress] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);

  const [insights, setInsights] = useState<string[]>([]);
  const [personalRecords, setPersonalRecords] = useState<any[]>([]);
  const [consistency, setConsistency] = useState({ score: 0, weeks: 0, targets: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [workoutsRes, volumeRes, insightsRes, prsRes] = await Promise.all([
          workoutAPI.getAll(1, 200),
          analyticsAPI.getTrainingVolume(),
          analyticsAPI.getInsights().catch(() => ({ data: { insights: [] } })),
          analyticsAPI.getPersonalRecords().catch(() => ({ data: [] }))
        ]);
        
        const wData = workoutsRes.data.workouts || [];
        setWorkouts(wData);
        setVolumeData(volumeRes.data || []);
        
        // Use backend insights if available, else generate basic ones
        if (insightsRes.data?.insights?.length > 0) {
           setInsights(insightsRes.data.insights);
        } else {
           generateLocalInsights(wData);
        }

        // Generate or map Personal Records
        generateLocalRecords(wData);
        
        // Generate Consistency Score
        calculateConsistency(wData);

      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      analyticsAPI.getExerciseProgress(selectedExercise)
        .then(res => setExerciseProgress(res.data || []))
        .catch(console.error);
    }
  }, [selectedExercise]);

  const generateLocalInsights = (works: any[]) => {
    if (works.length === 0) return;
    const i = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recent = works.filter(w => new Date(w.createdAt) >= sevenDaysAgo);
    
    if (recent.length >= 4) i.push(`You trained ${recent.length} times this week. Fantastic consistency!`);
    else if (recent.length > 0) i.push(`You've been active lately, but could add ${4 - recent.length} more sessions to reach optimal weekly volume.`);
    else i.push("You haven't trained recently. Let's get moving today!");

    // Check muscle distribution
    const legs = recent.filter(w => w.muscleGroup === 'Legs').length;
    if (legs === 0 && recent.length > 2) i.push(`You haven't trained legs this week. Consider balancing your routine.`);
    
    setInsights(i);
  };

  const generateLocalRecords = (works: any[]) => {
     if (works.length === 0) return;
     
     const targetExercises = ['Bench Press', 'Squat', 'Deadlift', 'Pull Ups'];
     const prs: any[] = [];
     
     works.forEach(w => {
         if (w.exercises) {
             w.exercises.forEach((ex: any) => {
                 if (targetExercises.includes(ex.exerciseName)) {
                     const existing = prs.find(p => p.lift === ex.exerciseName);
                     if (!existing || ex.weight > existing.weight) {
                         if (!existing) {
                             prs.push({ lift: ex.exerciseName, weight: ex.weight || 0, date: w.createdAt, trend: 'flat' });
                         } else {
                             existing.weight = ex.weight;
                             existing.date = w.createdAt;
                             existing.trend = 'up';
                         }
                     }
                 }
             });
         }
     });

     // Fill missing with empty to show UI
     targetExercises.forEach(target => {
       if (!prs.find(p => p.lift === target)) {
         prs.push({ lift: target, weight: 0, date: new Date().toISOString(), trend: 'flat' });
       }
     });

     setPersonalRecords(prs.filter(p => p.weight > 0).slice(0, 4));
  };

  const calculateConsistency = (works: any[]) => {
      const targetWorkouts = 4; // Assuming 4 days a week is baseline goal
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recent = works.filter(w => new Date(w.createdAt) >= sevenDaysAgo);
      const score = Math.min(Math.round((recent.length / targetWorkouts) * 100), 100);
      
      setConsistency({ score, weeks: recent.length, targets: targetWorkouts });
  };

  // Process data for charts
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Heatmap Data directly from workout list
  const heatmapData = React.useMemo(() => {
    const result: { date: string, count: number }[] = [];
    workouts.forEach(w => {
       const d = new Date(w.createdAt).toISOString().split('T')[0];
       const existing = result.find(i => i.date === d);
       if (existing) existing.count += 1;
       else result.push({ date: d, count: 1 });
    });
    return result;
  }, [workouts]);
  // We'll map the last 7 days starting from today back
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // Go from 6 days ago to today
    const dateStr = d.toISOString().split('T')[0];
    const dayName = daysOfWeek[d.getDay() === 0 ? 6 : d.getDay() - 1];
    
    const dayWorkouts = workouts.filter((w) => {
      const wDate = new Date(w.createdAt).toISOString().split('T')[0];
      return wDate === dateStr;
    });

    return {
      day: dayName,
      date: dateStr,
      workouts: dayWorkouts.length,
      calories: dayWorkouts.reduce((sum: number, w: any) => sum + (w.totalCalories || 0), 0),
    };
  });

  // Workout type distribution
  const typeCounts: Record<string, number> = {};
  workouts.forEach((w) => {
    if (w.workoutType) {
      typeCounts[w.workoutType] = (typeCounts[w.workoutType] || 0) + 1;
    }
  });
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  // Muscle group distribution
  const muscleCounts: Record<string, number> = {};
  workouts.forEach((w) => {
    if (w.muscleGroup) {
      muscleCounts[w.muscleGroup] = (muscleCounts[w.muscleGroup] || 0) + 1;
    }
  });
  const muscleData = Object.entries(muscleCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // Training volume (last 7 data points)
  const filteredVolumeData = volumeData.slice(-7);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Professional insights into your fitness journey</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4,5,6].map(i => <ChartSkeleton key={i} />)}
        </div>
      ) : workouts.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/20 floating">
            <HiOutlineTrendingUp className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">No Data Yet</h2>
            <p className="text-gray-400 max-w-md mx-auto">Start logging your workouts to unlock performance insights, consistency scores, and beautiful data visualizations.</p>
          </div>
          <button onClick={() => window.location.href='/dashboard'} className="btn-primary mt-4 flex items-center gap-2 relative z-10 transition-transform hover:scale-105">
            <HiOutlineLightningBolt className="w-5 h-5" /> Log Your First Workout
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Row 1 */}
          {/* Top Row - Heatmap & Insights */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <ActivityHeatmap data={heatmapData} />
            </div>
            <div className="lg:col-span-1">
               <SmartInsights insights={insights} />
            </div>
          </div>

          {/* Row 2 - Personal Records & Consistency */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
             <PersonalRecords records={personalRecords} />
             <ConsistencyScore score={consistency.score} workoutsThisWeek={consistency.weeks} targetWorkouts={consistency.targets} />
          </div>

          {/* Row 3 - Charts */}
          <WeeklyWorkoutsChart data={weeklyData} />
          <WorkoutTypePieChart data={pieData} />

          {/* Row 4 - Full Width on Large Screens */}
          <div className="lg:col-span-2">
            <TrainingVolumeChart data={filteredVolumeData} />
          </div>

          {/* Row 5 - Muscle Distribution & Line Chart */}
          <MuscleGroupChart data={muscleData} />
          <CaloriesLineChart data={weeklyData} title="🔥 Weekly Calorie Trend" />

          {/* Row 4 - Progressive Overload */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HiOutlineTrendingUp className="text-primary" /> Progressive Overload
                </h3>
                <p className="text-xs text-gray-500 mt-1 tracking-wide">Tracking your estimated 1RM and total volume</p>
              </div>
              <select 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all hover:bg-white/10"
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
              >
                <option value="Bench Press">Bench Press</option>
                <option value="Deadlift">Deadlift</option>
                <option value="Squat">Squat</option>
                <option value="Overhead Press">Overhead Press</option>
              </select>
            </div>
            
            <div className="h-80 w-full relative mt-4">
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-12 overflow-x-auto gap-4 custom-scrollbar">
                {exerciseProgress.length > 0 ? (() => {
                  const maxVol = Math.max(...exerciseProgress.map(p => p.volume), 1);
                  return exerciseProgress.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group relative h-full justify-end min-w-[80px] flex-1">
                      {/* Value Labels */}
                      <div className="flex flex-col items-center mb-1 transition-transform group-hover:scale-110">
                        <span className="text-[10px] font-bold text-primary">{p.weight}kg</span>
                        <span className="text-[9px] text-gray-500">{p.volume.toLocaleString()}</span>
                      </div>
                      
                      {/* Bar */}
                      <div 
                        className="w-full max-w-[45px] bg-gradient-to-t from-primary/10 to-primary/50 group-hover:from-primary/30 group-hover:to-primary transition-all duration-300 rounded-t-xl relative border border-primary/20"
                        style={{ height: `${(p.volume / (maxVol * 1.1)) * 100}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-2xl border border-white/10 z-20 pointer-events-none whitespace-nowrap">
                          {p.sets} sets × {p.reps} reps
                        </div>
                      </div>

                      {/* Date Label */}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-max">
                        <p className="text-[10px] text-gray-500 font-medium">
                          {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ));
                })() : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-sm italic space-y-2">
                    <p>No data available for {selectedExercise}</p>
                    <p className="text-xs">Start logging this exercise to see your progress</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
