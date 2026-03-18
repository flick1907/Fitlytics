import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { MET_VALUES } from '../utils/constants';
import { updateStreak } from '../utils/streak';

interface ExerciseInput {
  exercise: string;
  exerciseType?: 'strength' | 'bodyweight' | 'core' | 'cardio' | 'hiit';
  sets: number;
  reps: number;
  weight: number;
}

interface CardioInput {
  type: string;
  duration: number;
  intensity: 'Low' | 'Moderate' | 'High';
}

export const logWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let { workoutType, muscleGroup, exercises, cardio } = req.body;

    if (!workoutType) {
      res.status(400).json({ error: 'Workout type is required.' });
      return;
    }

    // Filter out unperformed (empty) exercises
    if (exercises && Array.isArray(exercises)) {
      exercises = exercises.filter((ex: ExerciseInput) => ex.sets > 0 || ex.reps > 0 || ex.weight > 0);
    }

    // 0. Fetch User Weight
    const user = await (prisma.user as any).findUnique({
      where: { id: req.userId },
      select: { weight: true, experienceLevel: true },
    });
    const userWeight = user?.weight || 75; // fallback to 75kg if not set

    // 1. Calculate Exercise Calories
    let exerciseCalories = 0;
    if (exercises && Array.isArray(exercises)) {
      exercises.forEach((ex: ExerciseInput) => {
        const type = ex.exerciseType || 'strength';
        const met = MET_VALUES[type as keyof typeof MET_VALUES] || MET_VALUES.strength;
        
        // Estimation: strength/core/bodyweight exercises typically take time
        // Bodyweight rule: 45s per set as per requirements
        let durationMinutes = 0;
        if (type === 'bodyweight' || type === 'core') {
          durationMinutes = (ex.sets * 45) / 60;
        } else {
          // Default strength: ~1 min per set including rest
          durationMinutes = ex.sets;
        }

        const calories = (met * userWeight * durationMinutes) / 60;
        exerciseCalories += calories;
      });
    }

    // 2. Calculate HIIT Calories
    let hiitCalories = 0;
    if (workoutType === 'HIIT') {
      const met = MET_VALUES.hiit;
      // Formula: total sets * (30s work + 30s rest) = 60s per set
      const totalSets = exercises?.reduce((acc: number, ex: ExerciseInput) => acc + ex.sets, 0) || 0;
      const durationMinutes = totalSets; // 1 min per set
      hiitCalories = (met * userWeight * durationMinutes) / 60;
      
      // If workoutType is HIIT, we primarily use HIIT calculation 
      // but avoid double counting with strength if logged together
      exerciseCalories = 0; 
    }

    // 3. Calculate Cardio Calories
    let cardioCalories = 0;
    if (cardio && cardio.type && cardio.duration) {
      const duration = cardio.duration;
      const typeKey = cardio.type.toLowerCase() as keyof typeof MET_VALUES;
      const met = MET_VALUES[typeKey] || MET_VALUES.cardio;
      
      cardioCalories = (met * userWeight * duration) / 60;
    }

    // 3. Calculate Volume & Total Calories
    let totalVolume = 0;
    if (exercises && Array.isArray(exercises)) {
      totalVolume = exercises.reduce((sum: number, ex: ExerciseInput) => sum + (ex.sets * ex.reps * ex.weight), 0);
    }
    const totalCalories = Math.round(exerciseCalories + hiitCalories + cardioCalories);

    // 3. Determine Rating
    let rating = 'Light';
    if (totalCalories >= 500) rating = 'Elite';
    else if (totalCalories >= 300) rating = 'Intense';
    else if (totalCalories >= 150) rating = 'Moderate';

    // 4. Create Workout Record
    const workout = await prisma.workout.create({
      data: {
        userId: req.userId!,
        workoutType,
        muscleGroup,
        totalCalories,
        totalVolume,
        rating,
        exercises: {
          create: exercises?.map((ex: ExerciseInput) => ({
            exerciseName: ex.exercise,
            exerciseType: ex.exerciseType || 'strength',
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            volume: ex.sets * ex.reps * ex.weight,
          })) || [],
        },
        cardio: cardio?.type ? {
          create: {
            cardioType: cardio.type,
            duration: cardio.duration,
            intensity: cardio.intensity || 'Moderate',
            calories: Math.round(cardioCalories),
          },
        } : undefined,
      },
      include: {
        exercises: true,
        cardio: true,
      },
    });
    
    // 5. Update Streak
    await updateStreak(req.userId!);

    res.status(201).json(workout);
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({ error: 'Failed to log workout.' });
  }
};

export const getWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      prisma.workout.findMany({
        where: { userId: req.userId },
        include: {
          exercises: true,
          cardio: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.workout.count({ where: { userId: req.userId } }),
    ]);

    res.json({ workouts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Failed to fetch workouts.' });
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.workout.findFirst({
      where: { id: id as string, userId: req.userId as string },
    });

    if (!existing) {
      res.status(404).json({ error: 'Workout not found.' });
      return;
    }

    await prisma.workout.delete({ where: { id: id as string } });

    res.json({ message: 'Workout deleted successfully.' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ error: 'Failed to delete workout.' });
  }
};
