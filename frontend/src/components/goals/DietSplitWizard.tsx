import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineX, HiOutlineLightningBolt, HiOutlineSparkles } from 'react-icons/hi';
import { IoFastFoodOutline, IoFitnessOutline } from 'react-icons/io5';

interface Props {
  onClose: () => void;
  userGoal?: string;
}

type Meal = {
  time: string;
  items: string[];
};

type SplitDay = {
  day: string;
  focus: string;
};

export default function DietSplitWizard({ onClose, userGoal = 'Muscle Gain' }: Props) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    type: 'Non-Vegetarian',
    supplements: [] as string[],
    goal: userGoal
  });
  const [generatedPlan, setGeneratedPlan] = useState<{ diet: Meal[], split: SplitDay[] } | null>(null);

  const nextStep = () => {
    if (step === 3) {
      generatePlan();
    }
    setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => prev - 1);

  const generatePlan = () => {
    const isVeg = preferences.type === 'Vegetarian';
    const goal = preferences.goal;
    const hasWhey = preferences.supplements.includes('Whey Protein');
    const hasPlant = preferences.supplements.includes('Plant-based Protein');
    const hasCreatine = preferences.supplements.includes('Creatine');

    // Simple generation logic based on goal and preference
    let diet: Meal[] = [];
    if (goal === 'Muscle Gain' || goal === 'Bulking' || goal === 'Strength') {
      diet = [
        { time: 'Breakfast', items: isVeg ? ['4 Egg Whites / Paneer (100g)', 'Oats with milk and almonds', '1 Banana'] : ['3 Whole Eggs', 'Oats with milk', '1 Banana'] },
        { time: 'Lunch', items: isVeg ? ['Brown Rice (150g)', 'Dal/Legumes (Large bowl)', 'Soya Chunks / Paneer (100g)', 'Mixed Greens'] : ['Brown Rice (150g)', 'Grilled Chicken Breast (150g)', 'Broccoli & Carrots'] },
        { time: 'Evening Snack', items: ['Handful of Walnut/Almonds', 'Fruit or Peanut Butter Toast'] },
        { time: 'Dinner', items: isVeg ? ['2 Chapatis', 'Paneer Curry / Chickpeas', 'Greek Yogurt (1 cup)'] : ['Grilled Fish or Chicken (150g)', 'Small portion of Sweet Potato', 'Asparagus'] },
      ];
    } else {
      diet = [
        { time: 'Breakfast', items: ['2 Egg Whites or Moong Dal Chilla', 'Green Tea', 'Papaya'] },
        { time: 'Lunch', items: isVeg ? ['Quinoa/Brown Rice (small portion)', 'Large Tofu/Paneer Salad', 'Sprouted Moong Salad'] : ['Grilled Chicken Salad', 'Vinaigrette dressing', 'Steamed Veggies'] },
        { time: 'Evening Snack', items: ['Green Tea', 'Roasted Makhana or Sprouts'] },
        { time: 'Dinner', items: isVeg ? ['Mixed Veg Soup', 'Soya Nugget Salad', 'Cucumber'] : ['Grilled Salmon or Lean Chicken', 'Large Zucchini salad', 'Clear Soup'] },
      ];
    }

    // Add supplements to diet
    if (hasWhey || hasPlant) {
      diet.splice(diet.length - 1, 0, { time: 'Post-Workout', items: [`1 Scoop ${hasWhey ? 'Whey' : 'Plant'} Protein with water`].concat(hasCreatine ? ['5g Creatine'] : []) });
    } else if (hasCreatine) {
        diet.splice(diet.length - 1, 0, { time: 'Post-Workout', items: ['5g Creatine with fruit juice'] });
    }

    let split: SplitDay[] = [];
    if (goal === 'Muscle Gain' || goal === 'Bulking' || goal === 'Strength') {
      split = [
        { day: 'Mon', focus: 'Push (Chest, Shoulders, Triceps)' },
        { day: 'Tue', focus: 'Pull (Back, Biceps)' },
        { day: 'Wed', focus: 'Legs (Quads, Hamstrings, Calves)' },
        { day: 'Thu', focus: 'Rest or Active Recovery' },
        { day: 'Fri', focus: 'Upper Body (Hypertrophy)' },
        { day: 'Sat', focus: 'Lower Body (Explosivity)' },
        { day: 'Sun', focus: 'Rest' },
      ];
    } else {
      split = [
        { day: 'Mon', focus: 'Full Body + 20min Cardio' },
        { day: 'Tue', focus: 'HIIT / Cardio Session' },
        { day: 'Wed', focus: 'Full Body + 20min Cardio' },
        { day: 'Thu', focus: 'Active Recovery (Yoga/Walk)' },
        { day: 'Fri', focus: 'Lower Body Focus + Cardio' },
        { day: 'Sat', focus: 'Upper Body Focus + HIIT' },
        { day: 'Sun', focus: 'Rest' },
      ];
    }

    setGeneratedPlan({ diet, split });
  };

  const handleToggleSupplement = (supp: string) => {
    setPreferences(prev => ({
      ...prev,
      supplements: prev.supplements.includes(supp)
        ? prev.supplements.filter(s => s !== supp)
        : [...prev.supplements, supp]
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HiOutlineSparkles className="text-primary" /> Diet & Split Generator
            </h2>
            <p className="text-sm text-gray-500 mt-1">Personalized nutrition and training roadmap</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">What is your dietary preference?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Vegetarian', 'Non-Vegetarian'].map(type => (
                    <button
                      key={type}
                      onClick={() => setPreferences({ ...preferences, type })}
                      className={`p-6 rounded-2xl border-2 transition-all text-left group ${
                        preferences.type === type 
                        ? 'border-primary bg-primary/10' 
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold uppercase tracking-widest ${preferences.type === type ? 'text-primary' : 'text-gray-500'}`}>
                          {type}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${preferences.type === type ? 'border-primary bg-primary' : 'border-gray-700'}`}>
                          {preferences.type === type && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">
                        {type === 'Vegetarian' ? 'Plant-based options including dairy and eggs.' : 'Includes all meat, fish, and poultry options.'}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Are you open to using supplements?</h3>
                <p className="text-sm text-gray-400">Select any you are comfortable adding to your diet plan.</p>
                <div className="grid grid-cols-1 gap-3">
                  {['Whey Protein', 'Plant-based Protein', 'Creatine'].map(supp => (
                    <button
                      key={supp}
                      onClick={() => handleToggleSupplement(supp)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        preferences.supplements.includes(supp)
                        ? 'border-primary bg-primary/5 text-white'
                        : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <span className="font-medium">{supp}</span>
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${preferences.supplements.includes(supp) ? 'border-primary bg-primary text-white' : 'border-gray-700'}`}>
                        {preferences.supplements.includes(supp) && '✓'}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Confirm your primary goal</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Weight Loss', 'Muscle Gain', 'Bulking', 'Fat Loss', 'Endurance', 'Strength'].map(g => (
                    <button
                      key={g}
                      onClick={() => setPreferences({ ...preferences, goal: g })}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                        preferences.goal === g
                        ? 'border-primary bg-primary/5 text-white'
                        : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && generatedPlan && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 pb-8"
              >
                {/* Banner */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <HiOutlineSparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Plan Generated Successfully!</h3>
                    <p className="text-sm text-gray-400">Customized for {preferences.type} • {preferences.goal}</p>
                  </div>
                </div>

                {/* Diet Section */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <IoFastFoodOutline className="text-orange-400" /> Daily Nutritional Roadmap
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedPlan.diet.map((meal, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-colors">
                        <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{meal.time}</div>
                        <ul className="space-y-2">
                          {meal.items.map((item, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Split Section */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <IoFitnessOutline className="text-emerald-400" /> Recommended Training Split
                  </h4>
                  <div className="glass-card overflow-hidden">
                    {generatedPlan.split.map((day, idx) => (
                      <div key={idx} className={`flex items-center p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${idx === generatedPlan.split.length - 1 ? 'border-b-0' : ''}`}>
                        <div className="w-12 text-sm font-bold text-gray-500 uppercase">{day.day}</div>
                        <div className="flex-1 text-sm font-medium text-white">{day.focus}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          {step < 4 ? (
            <>
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <HiOutlineArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={nextStep}
                className="btn-primary flex items-center gap-2 px-6"
              >
                {step === 3 ? 'Generate Plan' : 'Next Step'} <HiOutlineArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
               onClick={onClose}
               className="btn-primary w-full py-4 text-center"
            >
               Finish & Start Following Plan
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
