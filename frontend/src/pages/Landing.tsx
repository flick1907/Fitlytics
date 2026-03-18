import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineChartBar, HiOutlineFlag, HiOutlineStar, HiOutlineHeart, HiOutlineFire } from 'react-icons/hi';
import { FaDumbbell } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import heroVideo from '../5319089-uhd_3840_2160_25fps.mp4';
const features = [
  { icon: <HiOutlineLightningBolt className="w-6 h-6" />, title: 'Workout Tracking', desc: 'Log every set, rep, and workout with detailed tracking.' },
  { icon: <HiOutlineChartBar className="w-6 h-6" />, title: 'Analytics & Charts', desc: 'Visualize progress with beautiful charts and heatmaps.' },
  { icon: <HiOutlineFlag className="w-6 h-6" />, title: 'Goal Setting', desc: 'Set weekly workout and calorie goals with progress tracking.' },
  { icon: <HiOutlineStar className="w-6 h-6" />, title: 'AI Insights', desc: 'Get personalized workout recommendations and insights.' },
];

const Counter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
};

const FloatingIcon = ({ icon, delay, x, y, size = "text-3xl" }: { icon: React.ReactNode, delay: number, x: string, y: string, size?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2],
      y: [0, -20, 0],
      x: [0, 10, 0]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className={`absolute ${x} ${y} ${size} text-primary/30 pointer-events-none hidden lg:block`}
  >
    {icon}
  </motion.div>
);

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-primary-bg overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-secondary-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">⚡ Fitlytics</h1>
          <div className="flex items-center gap-4">
            <Link to="/login" className="relative group text-gray-400 hover:text-white transition-colors font-medium">
              Login
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/signup" className="btn-primary text-sm !px-5 !py-2.5 shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-12 px-6">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0B0F19]">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/60 via-[#0B0F19]/50 to-[#0B0F19] pointer-events-none" />
        </div>

        {/* Floating Icons */}
        <FloatingIcon icon={<FaDumbbell />} delay={0} x="left-[15%]" y="top-[20%]" size="text-5xl" />
        <FloatingIcon icon={<HiOutlineHeart />} delay={1} x="right-[18%]" y="top-[25%]" size="text-4xl" />
        <FloatingIcon icon={<HiOutlineFire />} delay={2} x="left-[20%]" y="bottom-[30%]" size="text-4xl" />
        <FloatingIcon icon={<HiOutlineLightningBolt />} delay={1.5} x="right-[15%]" y="bottom-[25%]" size="text-5xl" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <HiOutlineLightningBolt className="w-4 h-4" /> Your Fitness Journey, Supercharged
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
            >
              Track. Analyze.<br />
              <span className="gradient-text">Achieve.</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The modern fitness analytics platform that helps you track workouts, monitor progress, and crush your goals with AI-powered insights.
            </motion.p>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2, delayChildren: 0.5 }
                }
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }} className="w-full sm:w-auto">
                <Link to="/signup" className="btn-primary block text-center text-lg !px-10 !py-4 w-full sm:w-auto transition-transform duration-300 hover:scale-105 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]">Start Free →</Link>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }} className="w-full sm:w-auto">
                <Link to="/login" className="btn-secondary block text-center text-lg !px-10 !py-4 w-full sm:w-auto transition-transform duration-300 hover:scale-105">Sign In</Link>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 border-t border-white/5 pt-12 w-full max-w-4xl"
            >
              <Counter value={250000} label="Workouts Tracked" suffix="+" />
              <Counter value={12000} label="Active Users" suffix="+" />
              <Counter value={5000000} label="Total Weight Lifted" suffix="kg" />
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
        >
          Everything you need to <span className="gradient-text">level up</span>
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card-hover p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="border-t border-white/5 py-12 bg-secondary-bg/30"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold gradient-text">⚡ Fitlytics</div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Fitlytics. Built with ❤️ for fitness enthusiasts.
          </div>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
