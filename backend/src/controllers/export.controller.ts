import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const exportWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const format = (req.query.format as string) || 'json';

    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        workoutType: true,
        totalCalories: true,
        rating: true,
        createdAt: true,
      },
    });

    if (format === 'csv') {
      const headers = 'Workout Type,Calories Burned,Rating,Date\n';
      const rows = workouts
        .map(
          (w) =>
            `"${w.workoutType}",${w.totalCalories},"${w.rating || ''}","${w.createdAt.toISOString()}"`
        )
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=fitlytics-workouts.csv');
      res.send(headers + rows);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=fitlytics-workouts.json');
      res.json(workouts);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export workouts.' });
  }
};
