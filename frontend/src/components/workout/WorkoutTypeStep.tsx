import { motion } from 'framer-motion';
import { 
  HiOutlineLightningBolt, 
  HiOutlineHeart, 
  HiOutlineFire, 
  HiOutlineUser, 
  HiOutlineCollection 
} from 'react-icons/hi';

const types = [
  { id: 'Strength', name: 'Strength Training', icon: <HiOutlineLightningBolt />, desc: 'Weightlifting and resistance' },
  { id: 'Cardio', name: 'Cardio', icon: <HiOutlineHeart />, desc: 'Endurance and heart health' },
  { id: 'HIIT', name: 'HIIT', icon: <HiOutlineFire />, desc: 'High intensity interval training' },
  { id: 'Calisthenics', name: 'Calisthenics', icon: <HiOutlineUser />, desc: 'Bodyweight exercises' },
  { id: 'Mixed', name: 'Mixed Workout', icon: <HiOutlineCollection />, desc: 'Combination of activities' },
];

interface Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  strengthCount: number;
}

export default function WorkoutTypeStep({ value, onChange, onNext, strengthCount }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Select Workout Category</h3>
        <p className="text-gray-400">What type of activity are we logging today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((type) => (
          <motion.button
            key={type.id}
            whileHover={!(type.id === 'Strength' && strengthCount >= 2) ? { scale: 1.02 } : {}}
            whileTap={!(type.id === 'Strength' && strengthCount >= 2) ? { scale: 0.98 } : {}}
            disabled={(type.id === 'Strength' || type.id === 'Mixed') && strengthCount >= 2}
            onClick={() => {
              onChange(type.id);
              if (!((type.id === 'Strength' || type.id === 'Mixed') && strengthCount >= 2)) {
                setTimeout(onNext, 300);
              }
            }}
            className={`p-6 rounded-xl border transition-all text-left flex flex-col gap-3 ${
              value === type.id 
                ? 'bg-primary/20 border-primary ring-1 ring-primary' 
                : (type.id === 'Strength' || type.id === 'Mixed') && strengthCount >= 2
                  ? 'bg-red-500/5 border-red-500/20 opacity-60 cursor-not-allowed'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <span className={`text-2xl ${value === type.id ? 'text-primary' : 'text-gray-400'}`}>
              {type.icon}
            </span>
            <div>
              <h4 className="font-bold text-white text-lg">{type.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{type.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
