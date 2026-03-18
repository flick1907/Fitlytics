export const MET_VALUES = {
  strength: 6.0,
  heavy_lifting: 8.0,
  hiit: 10.0,
  calisthenics: 8.0,
  core: 5.0,
  cardio: 7.0, // Default cardio (e.g., moderate cycling)
  running: 9.8,
  walking: 3.5,
  cycling: 7.0,
  jump_rope: 12.0,
};

export const WORKOUT_SPLITS: Record<string, string[]> = {
  'Muscle Gain': [
    'Chest + Triceps',
    'Back + Biceps',
    'Legs',
    'Rest',
    'Shoulders',
    'Full Body',
    'Rest',
  ],
  'Weight Loss': [
    'Cardio + Core',
    'Strength (Full Body)',
    'HIIT',
    'Rest',
    'Cardio + Core',
    'Strength (Full Body)',
    'Rest',
  ],
  'Bulking': [
    'Chest + Shoulders',
    'Back + Traps',
    'Legs',
    'Rest',
    'Arms',
    'Full Body',
    'Rest',
  ],
  'Endurance': [
    'Running (Long Distance)',
    'Strength (HIIT)',
    'Cycling',
    'Rest',
    'Running (Intervals)',
    'Swimming/Mixed Cardio',
    'Rest',
  ],
};

export const DIET_PLANS: Record<string, any> = {
  'Weight Loss': {
    breakfast: 'Oats + eggs',
    lunch: 'Chicken + rice + vegetables',
    snack: 'Fruits',
    dinner: 'Paneer / fish + salad',
    note: 'Calorie deficit focus with high protein.',
  },
  'Muscle Gain': {
    breakfast: 'Eggs + oats + milk',
    lunch: 'Chicken + rice',
    snack: 'Peanut butter sandwich',
    dinner: 'Paneer / chicken + roti',
    note: 'Slight calorie surplus with high protein for hypertrophy.',
  },
  'Bulking': {
    breakfast: 'Eggs + heavy oats + peanut butter',
    lunch: 'Lean beef/chicken + large portion of brown rice',
    snack: 'Protein shake + banana + nuts',
    dinner: 'Salmon/chicken + sweet potato + avocado',
    note: 'High volume training + calorie surplus diet.',
  },
  'Endurance': {
    breakfast: 'Whole grain toast + eggs + avocado',
    lunch: 'Pasta/Quinoa + turkey + mixed veggies',
    snack: 'Yogurt + berries + honey',
    dinner: 'Lean meat + brown rice + spinach',
    note: 'Carbohydrate focus for sustained energy + heart health.',
  },
};

export const SUGGESTED_EXERCISES: Record<string, string[]> = {
  'Chest': ['Bench Press', 'Incline DB Press', 'Chest Fly'],
  'Back': ['Pull Ups', 'Lat Pulldown', 'Seated Row'],
  'Legs': ['Squats', 'Leg Press', 'Lunges'],
  'Shoulders': ['Overhead Press', 'Lateral Raises', 'Front Raises'],
  'Arms': ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls'],
  'Full Body': ['Deadlifts', 'Clean and Press', 'Burpees'],
  'Core': ['Plank', 'Leg Raises', 'Russian Twists'],
  'HIIT': ['Mountain Climbers', 'Burpees', 'Jumping Jacks', 'High Knees'],
};
