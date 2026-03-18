import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const logBodyMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { weight, bodyFat, chest, waist, arms, thighs } = req.body;
    const userId = req.userId!;

    const metrics = await prisma.bodyMetric.create({
      data: {
        userId,
        weight,
        bodyFat,
        chest,
        waist,
        arms,
        thighs,
      },
    });

    // Also update User profile weight if provided
    if (weight) {
      await prisma.user.update({
        where: { id: userId },
        data: { weight },
      });
    }

    res.status(201).json(metrics);
  } catch (error) {
    console.error('Log body metrics error:', error);
    res.status(500).json({ error: 'Failed to log body metrics.' });
  }
};

export const getBodyMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const metrics = await prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(metrics);
  } catch (error) {
    console.error('Get body metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch body metrics.' });
  }
};
