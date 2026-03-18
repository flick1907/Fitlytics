import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createWorkoutPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dayOfWeek, workoutType, muscleGroup, notes } = req.body;
    const userId = req.userId!;

    const plan = await prisma.workoutPlan.create({
      data: {
        userId,
        dayOfWeek,
        workoutType,
        muscleGroup,
        notes,
      },
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Create workout plan error:', error);
    res.status(500).json({ error: 'Failed to create workout plan.' });
  }
};

export const getWorkoutPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const plans = await prisma.workoutPlan.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' }, // Note: Sort might need custom logic for Mon-Sun
    });

    res.json(plans);
  } catch (error) {
    console.error('Get workout plans error:', error);
    res.status(500).json({ error: 'Failed to fetch workout plans.' });
  }
};

export const deleteWorkoutPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.userId!;

    const plan = await prisma.workoutPlan.findFirst({
      where: { id, userId },
    });

    if (!plan) {
      res.status(404).json({ error: 'Workout plan not found.' });
      return;
    }

    await prisma.workoutPlan.delete({ where: { id } });
    res.json({ message: 'Workout plan deleted successfully.' });
  } catch (error) {
    console.error('Delete workout plan error:', error);
    res.status(500).json({ error: 'Failed to delete workout plan.' });
  }
};
