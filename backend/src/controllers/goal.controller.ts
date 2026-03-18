import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { weeklyWorkoutGoal, calorieGoal, goalType, targetDuration } = req.body;

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId!,
        weeklyWorkoutGoal: weeklyWorkoutGoal || 0,
        calorieGoal: calorieGoal || 0,
        goalType,
        targetDuration,
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal.' });
  }
};

export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals.' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { weeklyWorkoutGoal, calorieGoal, goalType, targetDuration, completed } = req.body;

    const existing = await prisma.goal.findFirst({
      where: { id: id as string, userId: req.userId as string },
    });

    if (!existing) {
      res.status(404).json({ error: 'Goal not found.' });
      return;
    }

    const goal = await prisma.goal.update({
      where: { id: id as string },
      data: { weeklyWorkoutGoal, calorieGoal, goalType, targetDuration, completed },
    });

    res.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal.' });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.goal.findFirst({
      where: { id: id as string, userId: req.userId as string },
    });

    if (!existing) {
      res.status(404).json({ error: 'Goal not found.' });
      return;
    }

    await prisma.goal.delete({
      where: { id: id as string },
    });

    res.json({ message: 'Goal deleted successfully.' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal.' });
  }
};
