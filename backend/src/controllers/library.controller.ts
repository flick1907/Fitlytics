import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getExercises = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exercises = await prisma.exerciseLibrary.findMany({
      orderBy: { name: 'asc' },
    }) as any;
    res.json(exercises);
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Failed to fetch exercise library.' });
  }
};
