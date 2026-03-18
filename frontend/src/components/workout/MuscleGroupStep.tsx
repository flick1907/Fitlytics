import { motion } from 'framer-motion';

const groups = [
  { id: 'Chest', name: 'Chest' },
  { id: 'Back', name: 'Back' },
  { id: 'Shoulders', name: 'Shoulders' },
  { id: 'Biceps', name: 'Biceps' },
  { id: 'Triceps', name: 'Triceps' },
  { id: 'Legs', name: 'Legs' },
  { id: 'Core', name: 'Core' },
  { id: 'Full Body', name: 'Full Body' },
];

interface Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  workoutType: string;
}

export default function MuscleGroupStep({ value, onChange, onNext, workoutType }: Props) {
  // Only show for strength or calisthenics
  if (workoutType !== 'Strength' && workoutType !== 'Calisthenics') {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-white mb-4">No muscle group selection needed</h3>
        <p className="text-gray-400 mb-8">Hit Next to continue to Exercise Builder.</p>
        <button onClick={onNext} className="btn-primary px-8">Continue</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Target Muscle Group</h3>
        <p className="text-gray-400">Which part of the body are we focusing on?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {groups.map((group) => (
          <motion.button
            key={group.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onChange(group.id);
              setTimeout(onNext, 300);
            }}
            className={`p-6 rounded-xl border transition-all text-center ${
              value === group.id 
                ? 'bg-primary/20 border-primary ring-1 ring-primary' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <h4 className={`font-bold ${value === group.id ? 'text-primary' : 'text-white'}`}>
              {group.name}
            </h4>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
