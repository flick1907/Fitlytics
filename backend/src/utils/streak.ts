import prisma from '../config/database';
import { formatDate } from '../utils/helpers';

export const updateStreak = async (userId: string): Promise<void> => {
  try {
    const today = new Date();
    const todayStr = formatDate(today);
    
    let streak = await (prisma as any).streak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await (prisma as any).streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastWorkoutDate: today,
        },
      });
      return;
    }

    const lastWorkoutDate = streak.lastWorkoutDate ? new Date(streak.lastWorkoutDate) : null;
    const lastWorkoutStr = lastWorkoutDate ? formatDate(lastWorkoutDate) : null;

    if (lastWorkoutStr === todayStr) {
      // Already logged today, do nothing
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    if (lastWorkoutStr === yesterdayStr) {
      // Consecutive day
      const newCurrent = streak.currentStreak + 1;
      await (prisma as any).streak.update({
        where: { userId },
        data: {
          currentStreak: newCurrent,
          longestStreak: Math.max(streak.longestStreak, newCurrent),
          lastWorkoutDate: today,
        },
      });
    } else {
      // Streak broken
      await (prisma as any).streak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          lastWorkoutDate: today,
        },
      });
    }

    // Update Consistency Score (simplified for now: workouts in last 7 days / 7)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = await prisma.workout.count({
      where: { userId, createdAt: { gte: sevenDaysAgo } },
    });
    
    await (prisma as any).streak.update({
      where: { userId },
      data: {
        weeklyConsistencyScore: (recentCount / 7) * 100,
      },
    });

  } catch (error) {
    console.error('Update streak error:', error);
  }
};
