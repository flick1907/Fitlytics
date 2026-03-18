/// <reference types="node" />
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const exercises: Prisma.ExerciseLibraryCreateInput[] = [
  { name: 'Bench Press', muscleGroup: 'Chest', exerciseType: 'Strength', equipment: 'Barbell' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', exerciseType: 'Strength', equipment: 'Dumbbells' },
  { name: 'Push Ups', muscleGroup: 'Chest', exerciseType: 'Bodyweight', equipment: 'None' },
  { name: 'Lat Pulldown', muscleGroup: 'Back', exerciseType: 'Strength', equipment: 'Machine' },
  { name: 'Seated Row', muscleGroup: 'Back', exerciseType: 'Strength', equipment: 'Machine' },
  { name: 'Pull Ups', muscleGroup: 'Back', exerciseType: 'Bodyweight', equipment: 'Pull-up Bar' },
  { name: 'Overhead Press', muscleGroup: 'Shoulders', exerciseType: 'Strength', equipment: 'Barbell' },
  { name: 'Lateral Raises', muscleGroup: 'Shoulders', exerciseType: 'Strength', equipment: 'Dumbbells' },
  { name: 'Squats', muscleGroup: 'Legs', exerciseType: 'Strength', equipment: 'Barbell' },
  { name: 'Leg Press', muscleGroup: 'Legs', exerciseType: 'Strength', equipment: 'Machine' },
  { name: 'Deadlift', muscleGroup: 'Back', exerciseType: 'Strength', equipment: 'Barbell' },
  { name: 'Barbell Curls', muscleGroup: 'Biceps', exerciseType: 'Strength', equipment: 'Barbell' },
  { name: 'Tricep Pushdowns', muscleGroup: 'Triceps', exerciseType: 'Strength', equipment: 'Machine' },
  { name: 'Plank', muscleGroup: 'Core', exerciseType: 'Core', equipment: 'None' },
  { name: 'Russian Twists', muscleGroup: 'Core', exerciseType: 'Core', equipment: 'None' },
  { name: 'Burpees', muscleGroup: 'Full Body', exerciseType: 'HIIT', equipment: 'None' },
  { name: 'Jump Rope', muscleGroup: 'Full Body', exerciseType: 'Cardio', equipment: 'Rope' },
];

async function main() {
  console.log('Seeding Exercise Library...');
  for (const ex of exercises) {
    await prisma.exerciseLibrary.upsert({
      where: { name: ex.name },
      update: {},
      create: ex,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
