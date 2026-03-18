import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { formatDate, daysAgo, calculateStreak } from '../utils/helpers';

export const getInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const thirtyDaysAgo = daysAgo(30);
    const sevenDaysAgo = daysAgo(7);

    const [recentWorkouts, monthWorkouts, allWorkouts, streak] = await Promise.all([
      prisma.workout.findMany({
        where: { userId, createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workout.findMany({
        where: { userId, createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workout.findMany({
        where: { userId },
        select: { createdAt: true, totalCalories: true, workoutType: true },
        orderBy: { createdAt: 'desc' },
      }),
      (prisma as any).streak.findUnique({
        where: { userId },
      }),
    ]);

    const insights: string[] = [];

    // Streak insight
    const currentStreak = streak?.currentStreak || 0;
    if (currentStreak >= 3) {
      insights.push(`🔥 You're on a ${currentStreak}-day workout streak! Keep it up!`);
    } else if (currentStreak === 0 && allWorkouts.length > 0) {
      insights.push(`💪 Time to get back to it — your last workout was a while ago.`);
    }

    // Workout type distribution
    const typeCounts: Record<string, number> = {};
    monthWorkouts.forEach((w: any) => {
      typeCounts[w.workoutType] = (typeCounts[w.workoutType] || 0) + 1;
    });

    const types = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    if (types.length >= 2) {
      insights.push(
        `📊 You trained ${types[0][0]} ${types[0][1]}x and ${types[1][0]} only ${types[1][1]}x this month.`
      );
    }

    // Missing workout types
    const commonTypes = ['Strength', 'Cardio', 'HIIT', 'Calisthenics'];
    const recentTypes = new Set(recentWorkouts.map((w: any) => w.workoutType));
    const missingTypes = commonTypes.filter((t) => !recentTypes.has(t));
    if (missingTypes.length > 0 && recentWorkouts.length > 0) {
      insights.push(`⚠️ You haven't trained ${missingTypes.slice(0, 2).join(' or ')} recently.`);
    }

    // Best calorie day
    const dayCalories: Record<string, number> = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    monthWorkouts.forEach((w: any) => {
      const dayName = dayNames[new Date(w.createdAt).getDay()];
      dayCalories[dayName] = (dayCalories[dayName] || 0) + w.totalCalories;
    });

    const bestDay = Object.entries(dayCalories).sort((a, b) => b[1] - a[1])[0];
    if (bestDay) {
      insights.push(`🏆 Best calorie burn day: ${bestDay[0]} (${bestDay[1]} kcal total).`);
    }

    if (insights.length === 0) {
      insights.push('📝 Log more workouts to receive personalized insights!');
    }

    res.json({ insights });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights.' });
  }
};

export const getWorkoutHeatmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const startDate = daysAgo(365);

    const workouts = await prisma.workout.findMany({
      where: { userId, createdAt: { gte: startDate } },
      select: { createdAt: true },
    });

    // Group by date
    const dateMap: Record<string, number> = {};
    workouts.forEach((w: any) => {
      const date = formatDate(w.createdAt);
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    // Generate full year of dates
    const heatmapData: { date: string; count: number }[] = [];
    const current = new Date(startDate);
    const today = new Date();
    while (current <= today) {
      const dateStr = formatDate(current);
      heatmapData.push({ date: dateStr, count: dateMap[dateStr] || 0 });
      current.setDate(current.getDate() + 1);
    }

    res.json(heatmapData);
  } catch (error) {
    console.error('Heatmap error:', error);
    res.status(500).json({ error: 'Failed to generate heatmap data.' });
  }
};

export const getPersonalRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const workouts = await prisma.workout.findMany({
      where: { userId },
      select: { totalCalories: true, createdAt: true },
    });

    const maxCaloriesBurned = workouts.reduce((max: number, w: any) => Math.max(max, w.totalCalories), 0);
    const longestStreak = calculateStreak(workouts.map((w: any) => w.createdAt));

    // Total workouts in a single day
    const dayCounts: Record<string, number> = {};
    workouts.forEach((w: any) => {
      const date = formatDate(w.createdAt);
      dayCounts[date] = (dayCounts[date] || 0) + 1;
    });
    const maxWorkoutsInDay = Object.values(dayCounts).reduce((max: number, c: any) => Math.max(max, c), 0);

    res.json({
      maxCaloriesBurned,
      longestStreak,
      maxWorkoutsInDay,
      totalWorkouts: workouts.length,
    });
  } catch (error) {
    console.error('Personal records error:', error);
    res.status(500).json({ error: 'Failed to fetch personal records.' });
  }
};

export const getTimeline = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const limit = parseInt(req.query.limit as string) || 20;

    const [workouts, goals] = await Promise.all([
      prisma.workout.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          workoutType: true,
          totalCalories: true,
          createdAt: true,
        },
      }),
      prisma.goal.findMany({
        where: { userId, completed: true },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          weeklyWorkoutGoal: true,
          calorieGoal: true,
          updatedAt: true,
        },
      }),
    ]);

    const timeline = [
      ...workouts.map((w: any) => ({
        id: w.id,
        type: 'workout' as const,
        title: `${w.workoutType} Workout`,
        description: `Burned ${w.totalCalories} kcal during this session`,
        date: w.createdAt,
      })),
      ...goals.map((g: any) => ({
        id: g.id,
        type: 'goal' as const,
        title: 'Goal Completed! 🎉',
        description: `Weekly: ${g.weeklyWorkoutGoal} workouts • Calories: ${g.calorieGoal} kcal`,
        date: g.updatedAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(timeline.slice(0, limit));
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch timeline.' });
  }
};

export const getExerciseProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { exercise } = req.params;

    const exercises = await prisma.exercise.findMany({
      where: {
        workout: { userId },
        exerciseName: { equals: exercise as string },
        sets: { gt: 0 },
      },
      include: {
        workout: {
          select: { createdAt: true },
        },
      },
      orderBy: {
        workout: { createdAt: 'asc' },
      },
    });

    const progress = exercises.map((e) => ({
      date: (e as any).workout.createdAt,
      weight: e.weight,
      reps: e.reps,
      sets: e.sets,
      volume: e.sets * e.reps * e.weight,
    }));

    res.json(progress);
  } catch (error) {
    console.error('Exercise progress error:', error);
    res.status(500).json({ error: 'Failed to fetch exercise progress.' });
  }
};

export const getTrainingVolume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const thirtyDaysAgo = daysAgo(30);

    const workouts = await prisma.workout.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, totalVolume: true } as any,
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const volumeByDate: Record<string, number> = {};
    workouts.forEach((w: any) => {
      const date = formatDate(w.createdAt);
      volumeByDate[date] = (volumeByDate[date] || 0) + (w.totalVolume || 0);
    });

    const result = Object.entries(volumeByDate).map(([date, volume]) => ({
      date,
      volume,
    }));

    res.json(result);
  } catch (error) {
    console.error('Training volume error:', error);
    res.status(500).json({ error: 'Failed to fetch training volume.' });
  }
};
