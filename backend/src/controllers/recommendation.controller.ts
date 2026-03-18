import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { WORKOUT_SPLITS, DIET_PLANS, SUGGESTED_EXERCISES } from '../utils/constants';

export const getWorkoutRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { experienceLevel: true, weight: true },
    }) as any;

    const activeGoal = await prisma.goal.findFirst({
      where: { userId: req.userId, completed: false },
      orderBy: { createdAt: 'desc' },
    }) as any;

    if (!activeGoal || !activeGoal.goalType) {
      res.json({
        message: 'Set a fitness goal to get personalized recommendations.',
        recommendedSplit: [],
        suggestedExercises: {},
        dietPlan: null,
      });
      return;
    }

    const goalType = activeGoal.goalType;
    
    // Map goal types to split types
    const splitKeyMap: Record<string, string> = {
      'Muscle Gain': 'Muscle Gain',
      'Bulking': 'Bulking',
      'Weight Loss': 'Weight Loss',
      'Fat Loss': 'Weight Loss',
      'Endurance': 'Endurance',
      'Strength': 'Muscle Gain', // Fallback to Muscle Gain for now
    };

    const recommendedSplit = WORKOUT_SPLITS[splitKeyMap[goalType] || 'Muscle Gain'] || [];
    
    // Simple exercise suggestion based on split groups
    const suggestedExercises: Record<string, string[]> = {};
    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'HIIT', 'Core', 'Full Body'];
    
    muscleGroups.forEach(group => {
      if (recommendedSplit.some(s => s.toLowerCase().includes(group.toLowerCase()))) {
        suggestedExercises[group] = SUGGESTED_EXERCISES[group] || [];
      }
    });

    const dietPlan = (DIET_PLANS as any)[splitKeyMap[goalType] || 'Muscle Gain'] || null;

    res.json({
      goalType,
      experienceLevel: user?.experienceLevel || 'Beginner',
      recommendedSplit,
      suggestedExercises,
      dietPlan,
    });
  } catch (error) {
    console.error('CRITICAL: Recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recommendations.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};
