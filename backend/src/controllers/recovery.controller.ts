import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { daysAgo } from '../utils/helpers';

export const getRecoveryStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    
    // Recovery Logic: Analyze last 3 days
    const threeDaysAgo = daysAgo(3);
    const recentWorkouts = await prisma.workout.findMany({
      where: { userId, createdAt: { gte: threeDaysAgo } },
      select: { totalVolume: true, rating: true, createdAt: true },
    }) as any;

    if (recentWorkouts.length === 0) {
      res.json({
        status: 'Train Today',
        message: 'You are well rested and ready to hit the gym!',
        intensity: 'Optimal',
        recommendation: 'Full intensity workout'
      });
      return;
    }

    const totalRecentVolume = recentWorkouts.reduce((sum: number, w: any) => sum + w.totalVolume, 0);
    const intenseWorkouts = recentWorkouts.filter((w: any) => w.rating === 'Elite' || w.rating === 'Intense').length;
    const trainingDaysInARow = recentWorkouts.length;

    let status = 'Train Today';
    let message = 'Your recovery is looking good.';
    let intensity = 'High';
    let recommendation = 'Proceed with planned workout';

    if (trainingDaysInARow >= 3 || intenseWorkouts >= 2) {
      status = 'Rest Day';
      message = 'Your body needs time to repair after consecutive intense sessions.';
      intensity = 'Rest';
      recommendation = 'Complete rest or light stretching';
    } else if (intenseWorkouts >= 1 || totalRecentVolume > 10000) {
      status = 'Light Workout';
      message = 'You have high recent volume. A deload or active recovery session is advised.';
      intensity = 'Low/Moderate';
      recommendation = 'Active recovery / Mobility work';
    }

    res.json({
      status,
      message,
      intensity,
      recommendation,
      recentVolume: totalRecentVolume,
      consecutiveDays: trainingDaysInARow
    });
  } catch (error) {
    console.error('Recovery status error:', error);
    res.status(500).json({ error: 'Failed to fetch recovery status.' });
  }
};
