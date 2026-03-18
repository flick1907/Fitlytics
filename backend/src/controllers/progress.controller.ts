import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { weight, bodyFat, measurement } = req.body;

    const progress = await prisma.progress.create({
      data: {
        userId: req.userId!,
        weight,
        bodyFat,
        measurement,
      },
    });

    res.status(201).json(progress);
  } catch (error) {
    console.error('Create progress error:', error);
    res.status(500).json({ error: 'Failed to create progress entry.' });
  }
};

export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress.' });
  }
};
