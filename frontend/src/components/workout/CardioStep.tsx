import { motion } from 'framer-motion';
import { HiOutlineFire } from 'react-icons/hi';

interface CardioData {
  type: string;
  duration: number;
  intensity: 'Low' | 'Moderate' | 'High';
}

interface Props {
  value: CardioData | null;
  onChange: (val: CardioData | null) => void;
}

const types = ['Running', 'Cycling', 'Rowing', 'Walking', 'Jump Rope'];
const intensitiesStr = ['Low', 'Moderate', 'High'];

export default function CardioStep({ value, onChange }: Props) {
  const hasCardio = !!value;

  const toggleCardio = () => {
    if (hasCardio) onChange(null);
    else onChange({ type: 'Running', duration: 15, intensity: 'Moderate' });
  };

  const updateCardio = (field: keyof CardioData, val: any) => {
    if (!value) return;
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Cardio (Optional)</h3>
        <p className="text-gray-400">Did you perform any cardiovascular training?</p>
      </div>

      <div className="max-w-md mx-auto">
        <button
          onClick={toggleCardio}
          className={`w-full p-6 rounded-xl border flex items-center justify-between transition-all ${
            hasCardio 
              ? 'bg-primary/20 border-primary ring-1 ring-primary' 
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${hasCardio ? 'bg-primary/30 text-primary' : 'bg-white/5 text-gray-500'}`}>
              <HiOutlineFire className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-white">Toggle Cardio Session</span>
              <span className="text-sm text-gray-500">{hasCardio ? 'Currently active' : 'Click to add cardio'}</span>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${hasCardio ? 'bg-primary' : 'bg-gray-700'}`}>
            <motion.div 
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
              animate={{ x: hasCardio ? 24 : 0 }}
            />
          </div>
        </button>

        {hasCardio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 space-y-6 pt-6 border-t border-white/10"
          >
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Activity Type</label>
              <div className="grid grid-cols-2 gap-2">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => updateCardio('type', t)}
                    className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                      value.type === t ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={value.duration}
                onChange={(e) => updateCardio('duration', parseInt(e.target.value) || 0)}
                className="input-field"
                min="1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Intensity</label>
              <div className="grid grid-cols-3 gap-2">
                {intensitiesStr.map(i => (
                  <button
                    key={i}
                    onClick={() => updateCardio('intensity', i)}
                    className={`py-2 px-4 rounded-lg border text-sm transition-all ${
                      value.intensity === i ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
