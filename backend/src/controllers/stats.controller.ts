import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { getWeekStart, calculateStreak } from '../utils/helpers';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const weekStart = getWeekStart();

    const [totalWorkouts, allWorkouts, weeklyWorkouts, goals] = await Promise.all([
      prisma.workout.count({ where: { userId } }),
      prisma.workout.findMany({
        where: { userId },
        select: { totalCalories: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workout.findMany({
        where: { userId, createdAt: { gte: weekStart } },
        select: { totalCalories: true, createdAt: true, workoutType: true },
      }),
      prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 1,
      }),
    ]);

    const totalCalories = allWorkouts.reduce((sum: number, w: any) => sum + w.totalCalories, 0);
    const streak = calculateStreak(allWorkouts.map((w: any) => w.createdAt));
    const weeklyCalories = weeklyWorkouts.reduce((sum: number, w: any) => sum + w.totalCalories, 0);

    // Weekly activity summary (workouts per day of the week)
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklySummary = daysOfWeek.map((day, index) => {
      const dayWorkouts = weeklyWorkouts.filter((w) => {
        const d = new Date(w.createdAt).getDay();
        // getDay() returns 0 for Sunday, 1 for Monday, etc.
        // index 0 is Mon, so (0 + 1) % 7 = 1
        // index 6 is Sun, so (6 + 1) % 7 = 0
        return d === (index + 1) % 7;
      });
      return {
        day,
        workouts: dayWorkouts.length,
        calories: dayWorkouts.reduce((sum: number, w: any) => sum + w.totalCalories, 0),
      };
    });

    // Goal completion
    const currentGoal = goals[0];
    const goalCompletion = currentGoal
      ? {
          workoutGoal: currentGoal.weeklyWorkoutGoal,
          workoutsCompleted: weeklyWorkouts.length,
          workoutProgress: currentGoal.weeklyWorkoutGoal > 0
            ? Math.min(100, Math.round((weeklyWorkouts.length / currentGoal.weeklyWorkoutGoal) * 100))
            : 0,
          calorieGoal: currentGoal.calorieGoal,
          caloriesCompleted: weeklyCalories,
          calorieProgress: currentGoal.calorieGoal > 0
            ? Math.min(100, Math.round((weeklyCalories / currentGoal.calorieGoal) * 100))
            : 0,
        }
      : null;

    res.json({
      totalWorkouts,
      totalCalories,
      currentStreak: streak,
      weeklyWorkouts: weeklyWorkouts.length,
      weeklyCalories,
      weeklySummary,
      goalCompletion,
    });
  } catch (error) {
    console.error('CRITICAL: Dashboard stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard stats.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
